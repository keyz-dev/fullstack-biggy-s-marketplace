
const Order = require('../models/order');
const Payout = require('../models/payout');
const User = require('../models/user');
const AsyncError = require('../error_handler/AsyncError');
const campayService = require('../services/campay');
const paymentTrackingService = require('../services/paymentTracking');
const { normalizePhoneNumber } = require('../utils/phoneValidation');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

// Initiate payment
exports.initiatePayment = AsyncError(async (req, res, next) => {
  const { orderId, phoneNumber } = req.body;

  // Validate input
  if (!orderId || !phoneNumber) {
    return next(new BadRequestError('Order ID and phone number are required'));
  }

  const order = await Order.findById(orderId)
    .populate('clientId', 'name email phone')
    .populate('orderItems.product', 'name price')
    .populate('orderItems.farmerId', 'name email');

  if (!order) {
    return next(new NotFoundError('Order not found'));
  }

  if (order.paymentStatus === 'paid') {
    return next(new BadRequestError('Order already paid'));
  }

  try {
    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    const paymentData = {
      amount: Math.round(order.totalAmount), // Ensure integer amount
      phoneNumber: normalizedPhone,
      description: `Payment for Biggy order #${orderId.slice(-8)}`,
      orderId: orderId,
      currency: 'XAF'
    };

    const paymentResponse = await campayService.initiatePayment(paymentData);

    // Update order with payment details
    order.paymentMethod = 'momo';
    order.paymentStatus = 'pending';
    order.paymentReference = paymentResponse.reference;
    await order.save();

    // Start payment tracking
    paymentTrackingService.startPolling(paymentResponse.reference);

    // Emit real-time payment initiation
    if (global.io) {
      global.io.to(`payment-${paymentResponse.reference}`).emit('payment-initiated', {
        reference: paymentResponse.reference,
        amount: paymentData.amount,
        phoneNumber: normalizedPhone,
        description: paymentData.description,
        status: 'PENDING',
        message: 'Payment request sent to user. Waiting for response.',
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully. Please check your phone for the payment prompt.',
      paymentReference: paymentResponse.reference,
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    logger.error('Payment initiation error:', error);
    next(new BadRequestError('Payment initiation failed: ' + error.message));
  }
});

// Campay webhook
exports.handleWebhook = AsyncError(async (req, res, next) => {
  const { 
    status, 
    reference, 
    amount, 
    currency, 
    operator, 
    phone_number, 
    external_reference, 
    code, 
    operator_reference 
  } = req.body;

  logger.info(`Webhook received for payment ${reference}: ${status}`);

  try {
    const order = await Order.findById(external_reference)
      .populate('clientId', 'name email phone')
      .populate('orderItems.product', 'name price')
      .populate('orderItems.farmerId', 'name email');

    if (!order) {
      logger.error(`Order not found for external reference: ${external_reference}`);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update order status based on payment status
    let orderStatus = 'pending';
    let paymentStatus = 'pending';

    switch (status) {
      case 'SUCCESSFUL':
        paymentStatus = 'paid';
        orderStatus = 'accepted';
        order.paymentTime = new Date();
        break;
      case 'FAILED':
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
        break;
      case 'CANCELLED':
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
        break;
      case 'PENDING':
        paymentStatus = 'pending';
        orderStatus = 'pending';
        break;
    }

    // Update order
    order.paymentStatus = paymentStatus;
    order.status = orderStatus;
    order.paymentReference = reference;
    await order.save();

    // Emit real-time payment status update
    if (global.io) {
      global.io.to(`payment-${reference}`).emit('payment-status-update', {
        reference: reference,
        status: status,
        orderId: order._id,
        message: status === 'SUCCESSFUL' 
          ? 'Payment completed successfully! Your order is confirmed.' 
          : 'Payment failed or was cancelled',
        timestamp: new Date(),
        shouldStopPolling: status === 'SUCCESSFUL' || status === 'FAILED' || status === 'CANCELLED'
      });
    }

    // Send notifications based on payment status
    if (status === 'SUCCESSFUL') {
      await paymentTrackingService.notifyPaymentSuccess(order);
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      await paymentTrackingService.notifyPaymentFailure(order, status);
    }

    res.status(200).json({
      received: true,
      verified: true,
      reference: reference,
      processedAt: new Date(),
    });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request payout
exports.requestPayout = AsyncError(async (req, res) => {
  const { amount } = req.body;
  const userId = req.authUser._id;

  // Check if user is farmer or delivery_agent
  if (!['farmer', 'delivery_agent'].includes(req.authUser.role)) {
    return res.status(403).json({
      success: false,
      message: 'Only farmers and delivery agents can request payouts'
    });
  }

  const payout = await Payout.create({
    userId,
    amount,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    payout,
    message: 'Payout request submitted successfully'
  });
});

// Check payment status manually
exports.checkPaymentStatus = AsyncError(async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new NotFoundError('Order not found'));
    }

    if (!order.paymentReference) {
      return next(new BadRequestError('No payment reference found'));
    }

    // Get latest status from Campay
    const paymentStatus = await campayService.checkPaymentStatus(order.paymentReference);

    // Update order based on current status if it has changed
    let orderUpdated = false;
    let shouldStopPolling = false;
    
    if (paymentStatus.status === 'SUCCESSFUL' && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paymentTime = new Date();
      order.status = 'accepted';
      orderUpdated = true;
      shouldStopPolling = true;
    } else if (paymentStatus.status === 'FAILED' && order.paymentStatus !== 'failed') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      orderUpdated = true;
      shouldStopPolling = true;
    } else if (paymentStatus.status === 'CANCELLED' && order.paymentStatus !== 'failed') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      orderUpdated = true;
      shouldStopPolling = true;
    }

    if (orderUpdated) {
      await order.save();
      logger.info(`Order ${orderId} updated via status check: ${order.paymentStatus}`);
      
      // Send notifications if status changed
      if (paymentStatus.status === 'SUCCESSFUL') {
        await paymentTrackingService.notifyPaymentSuccess(order);
      } else if (paymentStatus.status === 'FAILED' || paymentStatus.status === 'CANCELLED') {
        await paymentTrackingService.notifyPaymentFailure(order, paymentStatus.status);
      }
    }

    res.status(200).json({
      success: true,
      order: {
        id: order._id,
        paymentStatus: order.paymentStatus,
        status: order.status,
        paymentTime: order.paymentTime
      },
      campayStatus: paymentStatus,
      updated: orderUpdated,
      shouldStopPolling: shouldStopPolling
    });
  } catch (error) {
    logger.error('Payment status check error:', error);
    next(new BadRequestError('Failed to check payment status: ' + error.message));
  }
});

// Get payment status from active tracking
exports.getPaymentStatus = AsyncError(async (req, res, next) => {
  try {
    const { reference } = req.params;
    
    const paymentInfo = await paymentTrackingService.getPaymentInfo(reference);
    
    if (!paymentInfo) {
      return res.status(404).json({
        error: 'Payment not found',
        reference: reference
      });
    }

    res.json({
      reference: reference,
      status: paymentInfo.status,
      amount: paymentInfo.amount,
      orderId: paymentInfo.orderId,
      createdAt: paymentInfo.createdAt,
      paymentTime: paymentInfo.paymentTime
    });
  } catch (error) {
    logger.error('Get payment status error:', error);
    next(new BadRequestError('Failed to get payment status: ' + error.message));
  }
});

// Retry payment for failed transactions
exports.retryPayment = AsyncError(async (req, res, next) => {
  const { orderId, phoneNumber } = req.body;

  // Validate input
  if (!orderId || !phoneNumber) {
    return next(new BadRequestError('Order ID and phone number are required'));
  }

  const order = await Order.findById(orderId)
    .populate('clientId', 'name email phone')
    .populate('orderItems.product', 'name price')
    .populate('orderItems.farmerId', 'name email');

  if (!order) {
    return next(new NotFoundError('Order not found'));
  }

  // Check if order is in a retryable state
  if (order.paymentStatus !== 'failed' && order.paymentStatus !== 'pending') {
    return next(new BadRequestError('Order is not in a retryable state'));
  }

  try {
    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    const paymentData = {
      amount: Math.round(order.totalAmount),
      phoneNumber: normalizedPhone,
      description: `Payment retry for Biggy order #${orderId.slice(-8)}`,
      orderId: orderId,
      currency: 'XAF'
    };

    const paymentResponse = await campayService.initiatePayment(paymentData);

    // Update order with new payment reference
    order.paymentStatus = 'pending';
    order.paymentReference = paymentResponse.reference;
    await order.save();

    // Start payment tracking
    paymentTrackingService.startPolling(paymentResponse.reference);

    // Emit real-time payment retry
    if (global.io) {
      global.io.to(`payment-${paymentResponse.reference}`).emit('payment-initiated', {
        reference: paymentResponse.reference,
        amount: paymentData.amount,
        phoneNumber: normalizedPhone,
        description: paymentData.description,
        status: 'PENDING',
        message: 'Payment retry initiated. Please check your phone.',
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment retry initiated successfully. Please check your phone.',
      paymentReference: paymentResponse.reference,
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    logger.error('Payment retry error:', error);
    next(new BadRequestError('Payment retry failed: ' + error.message));
  }
});

// Get payout history
exports.getPayoutHistory = AsyncError(async (req, res) => {
  const userId = req.authUser._id;

  const payouts = await Payout.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    payouts,
    count: payouts.length
  });
});
