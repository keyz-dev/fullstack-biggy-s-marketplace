const Order = require('../models/order');
const Product  = require('../models/product');
const {BadRequestError} = require('../utils/errors');
const wrapAsync = require('../error_handler/AsyncError');
const OrderNotificationService = require('../services/orderNotificationService');
const logger = require('../utils/logger');

// to place an order
const newOrder = wrapAsync(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (
    !shippingAddress ||
    !orderItems ||
    !totalAmount ||
    orderItems.length === 0
  ) {
    return next(new BadRequestError('some of the input fields is missing', 401));
  }

  // check if the product is in stock and recalculate the total amount
  
  let total = 0;
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(orderItems[i].product).populate('vendor');
    if (!product) {
      return next(new BadRequestError('Product Not Found', 404));
    }
    if (product.stock < orderItems[i].quantity) {
      return next(
        new BadRequestError(
          `Product ${product.name} is out of stock. Only ${product.stock} left`,
          400
        )
      );
    }

    console.log("\n\nfoutnd the product: ", product)

    // Set the required fields according to the schema
    orderItems[i].unitPrice = product.price;
    orderItems[i].farmerId = product.vendor._id;
    orderItems[i].vendor = product.vendor._id;
    total += product.price * orderItems[i].quantity;
  }


  const order = new Order({
    clientId: req.authUser._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount: total
  });

  const createdOrder = await order.save();

  // reduce the stock of the product
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(orderItems[i].product);
    product.stock -= orderItems[i].quantity;
    await product.save();
  }

  res.status(201).json({
    success: true,
    message: 'Order Placed Successfully',
  });
});

const getAdminOrders = wrapAsync(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});

const getMyOrders = wrapAsync(async (req, res, next) => {
  const orders = await Order.find({ client: req.authUser._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

const getSingleOrder = wrapAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('client', 'name email')
    .populate('orderItems.product', 'name price');

  if (!order) return next(new BadRequestError('Order Not Found', 404));
  if (order.client.toString() !== req.authUser._id.toString()) {
    return next(new BadRequestError('You are not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

const proccessOrder = wrapAsync(async (req, res, next) => {
  const order = await Order.findById(req.params._id);
  if (!order) return next(new BadRequestError('Order Not Found', 404));

  if (order.orderStatus === 'Preparing') order.orderStatus = 'Shipped';
  else if (order.orderStatus === 'Shipped') {
    order.orderStatus = 'Delivered';
    order.deliveredAt = new Date(Date.now());
  } else return next(new BadRequestError('Order Already Delivered', 400));

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order Processed Successfully',
  });
});

// ================= Vendor Side ===================

const getVendorOrders = async (req, res) => {
  const orders = await Order.find({ 'orderItems.vendor': req.authUser._id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    orders,
  });
};

const confirmVendorOrder = async (req, res) => {
  const { deliveryMethod, deliveryOption } = req.body;

  try {
    const order = await Order.findById(req.params.id)
      .populate('clientId', 'name email phone')
      .populate('orderItems.product', 'name price')
      .populate('orderItems.farmerId', 'name email');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Make sure the farmer is involved in this order
    const farmerInOrder = order.orderItems.find(
      (item) => item.farmerId.toString() === req.authUser._id.toString()
    );

    if (!farmerInOrder) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized for this order' 
      });
    }

    // Check if order is in a confirmable state
    if (order.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Order is not in a confirmable state'
      });
    }

    // Update order status
    order.status = 'ready';
    order.deliveryMethod = deliveryMethod || 'pickup';
    
    // Update farmer-specific item
    farmerInOrder.deliveryConfirmed = true;
    farmerInOrder.deliveryMethod = deliveryMethod;
    
    await order.save();

    // Notify customer about order confirmation
    await OrderNotificationService.notifyCustomerOrderUpdate(order, 'ready');

    // Emit real-time update
    if (global.io) {
      global.io.to(`user-${order.clientId._id}`).emit('order-status-update', {
        orderId: order._id,
        status: 'ready',
        message: 'Your order has been confirmed and is ready for pickup/delivery.',
        timestamp: new Date()
      });
    }

    logger.info(`Order ${order._id} confirmed by farmer ${req.authUser._id}`);

    res.json({ 
      success: true,
      message: 'Order confirmed successfully',
      order: {
        id: order._id,
        status: order.status,
        deliveryMethod: order.deliveryMethod
      }
    });
  } catch (error) {
    logger.error('Error confirming order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm order',
      error: error.message
    });
  }
};

// Choose delivery agent for order
const chooseDeliveryAgent = async (req, res) => {
  const { deliveryAgentId } = req.body;

  try {
    const order = await Order.findById(req.params.id)
      .populate('clientId', 'name email phone')
      .populate('orderItems.product', 'name price')
      .populate('orderItems.farmerId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure the farmer is involved in this order
    const farmerInOrder = order.orderItems.find(
      (item) => item.farmerId.toString() === req.authUser._id.toString()
    );

    if (!farmerInOrder) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized for this order'
      });
    }

    // Check if order is ready for delivery agent assignment
    if (order.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Order is not ready for delivery agent assignment'
      });
    }

    // Verify delivery agent exists and is available
    const deliveryAgent = await User.findById(deliveryAgentId);
    if (!deliveryAgent || deliveryAgent.role !== 'delivery_agent') {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery agent'
      });
    }

    // Update order with delivery agent
    order.deliveryAgentId = deliveryAgentId;
    order.status = 'on_the_way';
    await order.save();

    // Create delivery request (you might want to create a DeliveryRequest model)
    // For now, we'll just notify the delivery agent

    // Notify delivery agent about new request
    await OrderNotificationService.notifyDeliveryAgentNewRequest(
      { _id: `delivery-${Date.now()}`, deliveryAgentId, orderId: order._id },
      order
    );

    // Notify farmer about delivery agent assignment
    await OrderNotificationService.notifyFarmerDeliveryAgentAssigned(order, deliveryAgent);

    // Notify customer about delivery agent assignment
    await OrderNotificationService.notifyCustomerDeliveryAgentAssigned(order, deliveryAgent);

    // Emit real-time updates
    if (global.io) {
      // Notify delivery agent
      global.io.to(`user-${deliveryAgentId}`).emit('delivery-request-assigned', {
        orderId: order._id,
        farmerId: req.authUser._id,
        customerId: order.clientId._id,
        message: 'You have been assigned a new delivery request.',
        timestamp: new Date()
      });

      // Notify customer
      global.io.to(`user-${order.clientId._id}`).emit('delivery-agent-assigned', {
        orderId: order._id,
        deliveryAgentId: deliveryAgentId,
        deliveryAgentName: deliveryAgent.name,
        message: 'A delivery agent has been assigned to your order.',
        timestamp: new Date()
      });
    }

    logger.info(`Delivery agent ${deliveryAgentId} assigned to order ${order._id} by farmer ${req.authUser._id}`);

    res.json({
      success: true,
      message: 'Delivery agent assigned successfully',
      order: {
        id: order._id,
        status: order.status,
        deliveryAgentId: deliveryAgentId,
        deliveryAgentName: deliveryAgent.name
      }
    });
  } catch (error) {
    logger.error('Error assigning delivery agent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign delivery agent',
      error: error.message
    });
  }
};

const updateDeliveryStatus = async (req, res) => {
  const { deliveryStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id)
      .populate('clientId', 'name email phone')
      .populate('orderItems.product', 'name price')
      .populate('orderItems.farmerId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization - either farmer or delivery agent can update
    const isFarmer = order.orderItems.some(
      (item) => item.farmerId.toString() === req.authUser._id.toString()
    );
    const isDeliveryAgent = order.deliveryAgentId && 
      order.deliveryAgentId.toString() === req.authUser._id.toString();

    if (!isFarmer && !isDeliveryAgent) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized for this order'
      });
    }

    // Update delivery status
    order.deliveryStatus = deliveryStatus;
    
    if (deliveryStatus === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.status = 'delivered';
    } else if (deliveryStatus === 'picked_up') {
      order.status = 'on_the_way';
    }

    await order.save();

    // Notify customer about delivery status update
    await OrderNotificationService.notifyCustomerOrderUpdate(order, deliveryStatus);

    // Emit real-time update
    if (global.io) {
      global.io.to(`user-${order.clientId._id}`).emit('delivery-status-update', {
        orderId: order._id,
        deliveryStatus: deliveryStatus,
        message: `Delivery status updated to: ${deliveryStatus}`,
        timestamp: new Date()
      });
    }

    logger.info(`Delivery status updated for order ${order._id}: ${deliveryStatus}`);

    res.json({
      success: true,
      message: 'Delivery status updated successfully',
      order: {
        id: order._id,
        deliveryStatus: order.deliveryStatus,
        status: order.status,
        deliveredAt: order.deliveredAt
      }
    });
  } catch (error) {
    logger.error('Error updating delivery status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update delivery status',
      error: error.message
    });
  }
};

module.exports = {
  newOrder,
  getAdminOrders,
  getSingleOrder,
  proccessOrder,
  getMyOrders,
  getVendorOrders,
  confirmVendorOrder,
  chooseDeliveryAgent,
  updateDeliveryStatus
};
