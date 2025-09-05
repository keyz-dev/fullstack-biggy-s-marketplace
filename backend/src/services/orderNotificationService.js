const NotificationService = require("./notificationService");
const Order = require("../models/order");
const User = require("../models/user");
const logger = require("../utils/logger");

class OrderNotificationService {
  /**
   * Notify farmer about new order
   */
  static async notifyFarmerNewOrder(order, farmerId) {
    try {
      const farmer = await User.findById(farmerId);
      if (!farmer) {
        logger.error(`Farmer not found: ${farmerId}`);
        return;
      }

      const farmerItems = order.orderItems.filter(item => 
        item.farmerId.toString() === farmerId
      );

      const totalAmount = farmerItems.reduce((sum, item) => 
        sum + (item.unitPrice * item.quantity), 0
      );

      await NotificationService.createNotification({
        user: farmerId,
        type: "new_order_received",
        title: "New Order Received",
        message: `You have received a new order with ${farmerItems.length} item(s) worth ${totalAmount} XAF. Please review and confirm.`,
        priority: "high",
        relatedId: order._id,
        relatedModel: "Order",
        category: "orders",
        actionData: {
          actionType: "view_order",
          actionUrl: `/farmer/orders/${order._id}`,
          actionText: "View Order",
        },
      });

      // Emit real-time notification
      if (global.io) {
        global.io.to(`user-${farmerId}`).emit("notification:new", {
          notification: {
            type: "new_order_received",
            title: "New Order Received",
            message: `You have received a new order with ${farmerItems.length} item(s).`,
            priority: "high",
            relatedId: order._id,
            actionData: {
              actionType: "view_order",
              actionUrl: `/farmer/orders/${order._id}`,
              actionText: "View Order",
            },
          },
        });
      }

      logger.info(`Farmer notification sent for order ${order._id} to farmer ${farmerId}`);
    } catch (error) {
      logger.error("Error notifying farmer about new order:", error);
    }
  }

  /**
   * Notify customer about order status update
   */
  static async notifyCustomerOrderUpdate(order, status, additionalInfo = {}) {
    try {
      let title, message, notificationType, priority = "medium";

      switch (status) {
        case "accepted":
          title = "Order Confirmed";
          message = "Your order has been confirmed by the farmer. It will be prepared soon.";
          notificationType = "order_confirmed";
          priority = "high";
          break;
        case "ready":
          title = "Order Ready";
          message = "Your order is ready for pickup/delivery.";
          notificationType = "order_ready";
          priority = "high";
          break;
        case "on_the_way":
          title = "Order On The Way";
          message = "Your order is on the way to you.";
          notificationType = "order_shipped";
          priority = "high";
          break;
        case "delivered":
          title = "Order Delivered";
          message = "Your order has been delivered successfully. Thank you for your purchase!";
          notificationType = "order_delivered";
          priority = "high";
          break;
        case "cancelled":
          title = "Order Cancelled";
          message = additionalInfo.reason || "Your order has been cancelled.";
          notificationType = "order_cancelled";
          priority = "high";
          break;
        default:
          title = "Order Update";
          message = "Your order status has been updated.";
          notificationType = "order_status_update";
      }

      await NotificationService.createNotification({
        user: order.clientId,
        type: notificationType,
        title,
        message,
        priority,
        relatedId: order._id,
        relatedModel: "Order",
        category: "orders",
        actionData: {
          actionType: "view_order",
          actionUrl: `/orders/${order._id}`,
          actionText: "View Order",
        },
      });

      // Emit real-time notification
      if (global.io) {
        global.io.to(`user-${order.clientId}`).emit("notification:new", {
          notification: {
            type: notificationType,
            title,
            message,
            priority,
            relatedId: order._id,
            actionData: {
              actionType: "view_order",
              actionUrl: `/orders/${order._id}`,
              actionText: "View Order",
            },
          },
        });
      }

      logger.info(`Customer notification sent for order ${order._id} status: ${status}`);
    } catch (error) {
      logger.error("Error notifying customer about order update:", error);
    }
  }

  /**
   * Notify delivery agent about new delivery request
   */
  static async notifyDeliveryAgentNewRequest(deliveryRequest, order) {
    try {
      const deliveryAgent = await User.findById(deliveryRequest.deliveryAgentId);
      if (!deliveryAgent) {
        logger.error(`Delivery agent not found: ${deliveryRequest.deliveryAgentId}`);
        return;
      }

      await NotificationService.createNotification({
        user: deliveryRequest.deliveryAgentId,
        type: "new_delivery_request",
        title: "New Delivery Request",
        message: `You have received a new delivery request for order #${order._id.toString().slice(-8)}. Pickup from farmer and deliver to customer.`,
        priority: "high",
        relatedId: deliveryRequest._id,
        relatedModel: "DeliveryRequest",
        category: "orders",
        actionData: {
          actionType: "view_delivery_request",
          actionUrl: `/delivery-agent/requests/${deliveryRequest._id}`,
          actionText: "View Request",
        },
      });

      // Emit real-time notification
      if (global.io) {
        global.io.to(`user-${deliveryRequest.deliveryAgentId}`).emit("notification:new", {
          notification: {
            type: "new_delivery_request",
            title: "New Delivery Request",
            message: `You have received a new delivery request for order #${order._id.toString().slice(-8)}.`,
            priority: "high",
            relatedId: deliveryRequest._id,
            actionData: {
              actionType: "view_delivery_request",
              actionUrl: `/delivery-agent/requests/${deliveryRequest._id}`,
              actionText: "View Request",
            },
          },
        });
      }

      logger.info(`Delivery agent notification sent for request ${deliveryRequest._id}`);
    } catch (error) {
      logger.error("Error notifying delivery agent about new request:", error);
    }
  }

  /**
   * Notify farmer about delivery agent assignment
   */
  static async notifyFarmerDeliveryAgentAssigned(order, deliveryAgent) {
    try {
      const uniqueFarmers = [...new Set(order.orderItems.map(item => item.farmerId.toString()))];
      
      for (const farmerId of uniqueFarmers) {
        await NotificationService.createNotification({
          user: farmerId,
          type: "delivery_agent_assigned",
          title: "Delivery Agent Assigned",
          message: `A delivery agent (${deliveryAgent.name}) has been assigned to your order. They will contact you for pickup.`,
          priority: "medium",
          relatedId: order._id,
          relatedModel: "Order",
          category: "orders",
        });

        // Emit real-time notification
        if (global.io) {
          global.io.to(`user-${farmerId}`).emit("notification:new", {
            notification: {
              type: "delivery_agent_assigned",
              title: "Delivery Agent Assigned",
              message: `A delivery agent has been assigned to your order.`,
              priority: "medium",
              relatedId: order._id,
            },
          });
        }
      }

      logger.info(`Farmer notification sent for delivery agent assignment for order ${order._id}`);
    } catch (error) {
      logger.error("Error notifying farmer about delivery agent assignment:", error);
    }
  }

  /**
   * Notify customer about delivery agent assignment
   */
  static async notifyCustomerDeliveryAgentAssigned(order, deliveryAgent) {
    try {
      await NotificationService.createNotification({
        user: order.clientId,
        type: "delivery_agent_assigned",
        title: "Delivery Agent Assigned",
        message: `A delivery agent (${deliveryAgent.name}) has been assigned to your order. They will contact you for delivery details.`,
        priority: "medium",
        relatedId: order._id,
        relatedModel: "Order",
        category: "orders",
      });

      // Emit real-time notification
      if (global.io) {
        global.io.to(`user-${order.clientId}`).emit("notification:new", {
          notification: {
            type: "delivery_agent_assigned",
            title: "Delivery Agent Assigned",
            message: `A delivery agent has been assigned to your order.`,
            priority: "medium",
            relatedId: order._id,
          },
        });
      }

      logger.info(`Customer notification sent for delivery agent assignment for order ${order._id}`);
    } catch (error) {
      logger.error("Error notifying customer about delivery agent assignment:", error);
    }
  }

  /**
   * Notify about delivery status update
   */
  static async notifyDeliveryStatusUpdate(deliveryRequest, status) {
    try {
      const order = await Order.findById(deliveryRequest.orderId)
        .populate("clientId", "name email");

      if (!order) {
        logger.error(`Order not found for delivery request: ${deliveryRequest._id}`);
        return;
      }

      let title, message, notificationType, priority = "medium";

      switch (status) {
        case "accepted":
          title = "Delivery Request Accepted";
          message = "Your delivery request has been accepted by the delivery agent.";
          notificationType = "delivery_accepted";
          priority = "high";
          break;
        case "picked_up":
          title = "Order Picked Up";
          message = "Your order has been picked up from the farmer and is on the way.";
          notificationType = "order_picked_up";
          priority = "high";
          break;
        case "delivered":
          title = "Order Delivered";
          message = "Your order has been delivered successfully!";
          notificationType = "order_delivered";
          priority = "high";
          break;
        case "cancelled":
          title = "Delivery Cancelled";
          message = "Your delivery request has been cancelled.";
          notificationType = "delivery_cancelled";
          priority = "high";
          break;
        default:
          title = "Delivery Update";
          message = "Your delivery status has been updated.";
          notificationType = "delivery_status_update";
      }

      // Notify customer
      await NotificationService.createNotification({
        user: order.clientId._id,
        type: notificationType,
        title,
        message,
        priority,
        relatedId: deliveryRequest._id,
        relatedModel: "DeliveryRequest",
        category: "orders",
      });

      // Emit real-time notification
      if (global.io) {
        global.io.to(`user-${order.clientId._id}`).emit("notification:new", {
          notification: {
            type: notificationType,
            title,
            message,
            priority,
            relatedId: deliveryRequest._id,
          },
        });
      }

      logger.info(`Delivery status notification sent for request ${deliveryRequest._id}: ${status}`);
    } catch (error) {
      logger.error("Error notifying about delivery status update:", error);
    }
  }
}

module.exports = OrderNotificationService;
