const campayService = require("./campay");
const Order = require("../models/order");
const User = require("../models/user");
const logger = require("../utils/logger");

class PaymentTrackingService {
  constructor() {
    this.activePayments = new Map();
  }

  /**
   * Start polling for payment status updates
   */
  startPolling(paymentReference) {
    const pollInterval = 10000; // 10 seconds
    const maxPollTime = 600000; // 10 minutes
    const startTime = Date.now();

    // Start polling after 10 seconds
    const pollDelay = 10000;

    const poll = async () => {
      try {
        // Stop if exceeded max time
        if (Date.now() - startTime > maxPollTime) {
          logger.info(
            `Stopping polling for payment ${paymentReference} - exceeded max time`
          );
          this.stopPolling(paymentReference);
          return;
        }

        const statusResponse = await campayService.checkPaymentStatus(paymentReference);

        if (statusResponse.status) {
          await this.updatePaymentStatus(paymentReference, statusResponse.status);

          // Stop polling if payment is completed
          if (
            ["SUCCESSFUL", "FAILED", "CANCELLED"].includes(statusResponse.status)
          ) {
            logger.info(
              `Stopping polling for payment ${paymentReference} - status: ${statusResponse.status}`
            );
            this.stopPolling(paymentReference);
            return;
          }
        }

        // Continue polling
        setTimeout(poll, pollInterval);
      } catch (error) {
        logger.error(`Polling error for payment ${paymentReference}:`, error);
        setTimeout(poll, pollInterval);
      }
    };

    // Start polling after delay
    setTimeout(poll, pollDelay);
  }

  /**
   * Update payment status in database and notify relevant parties
   */
  async updatePaymentStatus(paymentReference, status) {
    try {
      const order = await Order.findOne({ paymentReference })
        .populate("clientId", "name email phone")
        .populate("orderItems.product", "name price")
        .populate("orderItems.farmerId", "name email phone");

      if (!order) {
        logger.error(`Order not found for payment reference: ${paymentReference}`);
        return;
      }

      let paymentStatus = "pending";
      let orderStatus = "pending";

      switch (status) {
        case "SUCCESSFUL":
          paymentStatus = "paid";
          orderStatus = "accepted";
          order.paymentTime = new Date();
          break;
        case "FAILED":
        case "CANCELLED":
          paymentStatus = "failed";
          orderStatus = "cancelled";
          break;
        case "PENDING":
          paymentStatus = "pending";
          orderStatus = "pending";
          break;
      }

      // Update order
      order.paymentStatus = paymentStatus;
      order.status = orderStatus;
      await order.save();

      // Emit real-time payment status update
      if (global.io) {
        global.io.to(`payment-${paymentReference}`).emit("payment-status-update", {
          reference: paymentReference,
          status: status,
          orderId: order._id,
          message:
            status === "SUCCESSFUL"
              ? "Payment completed successfully! Your order is confirmed."
              : status === "FAILED"
                ? "Payment failed. Please try again."
                : status === "CANCELLED"
                  ? "Payment was cancelled. You can retry the payment."
                  : "Payment status updated.",
          timestamp: new Date(),
        });
      }

      // Send notifications based on payment status
      if (status === "SUCCESSFUL") {
        await this.notifyPaymentSuccess(order);
      } else if (status === "FAILED" || status === "CANCELLED") {
        await this.notifyPaymentFailure(order, status);
      }

      logger.info(
        `Payment ${paymentReference} status updated to ${status} (polling)`
      );
    } catch (error) {
      logger.error(
        `Error updating payment status for ${paymentReference}:`,
        error
      );
    }
  }

  /**
   * Notify about successful payment
   */
  async notifyPaymentSuccess(order) {
    const NotificationService = require("./notificationService");

    // Notify customer
    await NotificationService.createNotification({
      user: order.clientId._id,
      type: "payment_successful",
      title: "Payment Successful",
      message: "Your payment has been completed successfully! Your order is now confirmed.",
      priority: "high",
      relatedId: order._id,
      relatedModel: "Order",
      category: "payments",
    });

    // Notify farmers about new order
    const uniqueFarmers = [...new Set(order.orderItems.map(item => item.farmerId._id.toString()))];
    
    for (const farmerId of uniqueFarmers) {
      const farmerItems = order.orderItems.filter(item => 
        item.farmerId._id.toString() === farmerId
      );
      
      await NotificationService.createNotification({
        user: farmerId,
        type: "new_order_received",
        title: "New Order Received",
        message: `You have received a new order with ${farmerItems.length} item(s). Please review and confirm.`,
        priority: "high",
        relatedId: order._id,
        relatedModel: "Order",
        category: "orders",
      });
    }

    // Emit real-time notifications
    if (global.io) {
      // Notify customer
      global.io.to(`user-${order.clientId._id}`).emit("notification:new", {
        notification: {
          type: "payment_successful",
          title: "Payment Successful",
          message: "Your payment has been completed successfully!",
          priority: "high",
          relatedId: order._id,
        },
      });

      // Notify farmers
      for (const farmerId of uniqueFarmers) {
        global.io.to(`user-${farmerId}`).emit("notification:new", {
          notification: {
            type: "new_order_received",
            title: "New Order Received",
            message: "You have received a new order. Please review and confirm.",
            priority: "high",
            relatedId: order._id,
          },
        });
      }
    }
  }

  /**
   * Notify about failed payment
   */
  async notifyPaymentFailure(order, status) {
    const NotificationService = require("./notificationService");

    const statusText = status === "FAILED" ? "failed" : "cancelled";
    
    await NotificationService.createNotification({
      user: order.clientId._id,
      type: "payment_failed",
      title: `Payment ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
      message: `Your payment has ${statusText}. Please try again to confirm your order.`,
      priority: "high",
      relatedId: order._id,
      relatedModel: "Order",
      category: "payments",
    });

    // Emit real-time notification
    if (global.io) {
      global.io.to(`user-${order.clientId._id}`).emit("notification:new", {
        notification: {
          type: "payment_failed",
          title: `Payment ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
          message: `Your payment has ${statusText}. Please try again.`,
          priority: "high",
          relatedId: order._id,
        },
      });
    }
  }

  /**
   * Stop polling for a payment
   */
  stopPolling(paymentReference) {
    this.activePayments.delete(paymentReference);
  }

  /**
   * Get payment info
   */
  async getPaymentInfo(paymentReference) {
    try {
      const order = await Order.findOne({ paymentReference })
        .populate("clientId", "name email")
        .populate("orderItems.product", "name price");

      if (!order) return null;

      return {
        reference: paymentReference,
        status: order.paymentStatus,
        amount: order.totalAmount,
        currency: "XAF",
        orderId: order._id,
        createdAt: order.createdAt,
        paymentTime: order.paymentTime,
      };
    } catch (error) {
      logger.error(
        `Error getting payment info for ${paymentReference}:`,
        error
      );
      return null;
    }
  }
}

module.exports = new PaymentTrackingService();
