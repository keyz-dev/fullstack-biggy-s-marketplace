import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import SocketService from "../../services/SocketService";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Notification interface
export const Notification = {
  id: null,
  title: "",
  message: "",
  type: "",
  priority: "medium", // low, medium, high, urgent
  isRead: false,
  readAt: null,
  createdAt: "",
  updatedAt: "",
  data: {
    relatedId: null,
    relatedModel: null,
    category: null,
  },
  user: {
    id: null,
    name: "",
    email: "",
    role: "",
  },
};

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Notification types for your marketplace system
  const allowedTypes = [
    "application_approved",
    "application_rejected", 
    "application_under_review",
    "new_order_received",
    "order_status_update",
    "delivery_status_update",
    "payment_successful",
    "payment_failed",
    "new_delivery_request",
    "system_announcement",
    "general",
  ];

  const categories = [
    "applications",
    "orders", 
    "delivery",
    "payments",
    "system",
  ];

  // Get token from AsyncStorage
  const getToken = useCallback(async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }, []);

  // Get unread count from API
  const getUnreadCount = useCallback(async () => {
    const token = await getToken();
    if (!token || !user) return;

    try {
      // TODO: Implement API call to get unread count
      // const response = await notificationsAPI.getUnreadCount();
      // setUnreadCount(response.unreadCount);
      
      // For now, calculate from local notifications
      setNotifications(currentNotifications => {
        const unread = currentNotifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
        return currentNotifications;
      });
    } catch (error) {
      console.error("Failed to get unread count:", error);
    }
  }, [getToken, user]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      const token = await getToken();
      if (!token) return;

      try {
        // TODO: Implement API call to mark as read
        // await notificationsAPI.markAsRead(notificationId);

        // Update local state and unread count
        setNotifications((prev) => {
          const updated = prev.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : notification
          );
          
          // Update unread count
          const unread = updated.filter(n => !n.isRead).length;
          setUnreadCount(unread);
          
          return updated;
        });

        // Emit socket event to mark as read
        SocketService.markNotificationAsRead(notificationId);

        Toast.show({
          type: "success",
          text1: "Notification marked as read",
        });
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        Toast.show({
          type: "error",
          text1: "Failed to mark notification as read",
        });
      }
    },
    [getToken]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const token = await getToken();
    if (!token) return;

    try {
      // TODO: Implement API call to mark all as read
      // await notificationsAPI.markAllAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      // Update unread count
      setUnreadCount(0);

      Toast.show({
        type: "success",
        text1: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      Toast.show({
        type: "error",
        text1: "Failed to mark all notifications as read",
      });
    }
  }, [getToken]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      const token = await getToken();
      if (!token) return;

      try {
        // TODO: Implement API call to delete notification
        // await notificationsAPI.deleteNotification(notificationId);

        // Update local state and unread count
        setNotifications((prev) => {
          const deletedNotification = prev.find(
            (n) => n.id === notificationId
          );
          const updated = prev.filter((notification) => notification.id !== notificationId);
          
          // Update unread count if notification was unread
          if (deletedNotification && !deletedNotification.isRead) {
            setUnreadCount((current) => Math.max(0, current - 1));
          }
          
          return updated;
        });

        Toast.show({
          type: "success",
          text1: "Notification deleted",
        });
      } catch (error) {
        console.error("Failed to delete notification:", error);
        Toast.show({
          type: "error",
          text1: "Failed to delete notification",
        });
      }
    },
    [getToken]
  );

  // Refresh notifications from API
  const refreshNotifications = useCallback(async () => {
    const token = await getToken();
    if (!token || !user) return;

    setLoading(true);
    try {
      // TODO: Implement API call to get notifications
      // const response = await notificationsAPI.getNotifications({
      //   page: 1,
      //   limit: 50,
      // });

      // For now, use local storage or mock data
      const storedNotifications = await AsyncStorage.getItem(`notifications_${user.id}`);
      const parsedNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter((n) => !n.isRead).length);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
      setIsConnected(false);
      Toast.show({
        type: "error",
        text1: "Failed to load notifications",
      });
    } finally {
      setLoading(false);
    }
  }, [getToken, user]);

  // Add notification (for real-time updates)
  const addNotification = useCallback(
    async (notification) => {
      const newNotification = {
        ...notification,
        id: notification.id || Date.now().toString(),
        createdAt: notification.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotifications((prev) => {
        const updatedNotifications = [newNotification, ...prev];
        
        // Update unread count if notification is unread
        if (!newNotification.isRead) {
          setUnreadCount((current) => current + 1);
        }

        // Store in AsyncStorage
        if (user?.id) {
          AsyncStorage.setItem(
            `notifications_${user.id}`,
            JSON.stringify(updatedNotifications)
          ).catch(error => {
            console.error("Failed to store notification:", error);
          });
        }

        return updatedNotifications;
      });

      // Show toast for new notifications
      Toast.show({
        type: "info",
        text1: newNotification.title,
        text2: newNotification.message,
        position: "top",
        autoHide: true,
        topOffset: 60,
        visibilityTime: 5000,
      });
    },
    [user]
  );

  // Handle new notification from socket
  const handleSocketNotification = useCallback(
    (data) => {
      console.log("🔔 Socket notification received:", data);
      
      if (data.notification) {
        addNotification(data.notification);
      }
    },
    [addNotification]
  );

  // Handle delivery status update
  const handleDeliveryStatusUpdate = useCallback((data) => {
    console.log("📦 Delivery status update:", data);
    
    // Create notification for delivery update
    const notification = {
      id: `delivery_${data.orderId}_${Date.now()}`,
      type: "delivery_status_update",
      title: "Delivery Update",
      message: data.message || `Delivery status updated to: ${data.deliveryStatus}`,
      priority: "medium",
      isRead: false,
      data: {
        relatedId: data.orderId,
        relatedModel: "Order",
        category: "delivery",
      },
    };
    
    addNotification(notification);
  }, [addNotification]);

  // Handle order update
  const handleOrderUpdate = useCallback((data) => {
    console.log("📋 Order update:", data);
    
    const notification = {
      id: `order_${data.orderId}_${Date.now()}`,
      type: "order_status_update", 
      title: "Order Update",
      message: data.message || "Your order status has been updated",
      priority: "medium",
      isRead: false,
      data: {
        relatedId: data.orderId,
        relatedModel: "Order",
        category: "orders",
      },
    };
    
    addNotification(notification);
  }, [addNotification]);

  // Handle payment update
  const handlePaymentUpdate = useCallback((data) => {
    console.log("💳 Payment update:", data);
    
    const notification = {
      id: `payment_${data.paymentId || Date.now()}_${Date.now()}`,
      type: data.status === "successful" ? "payment_successful" : "payment_failed",
      title: data.status === "successful" ? "Payment Successful" : "Payment Failed",
      message: data.message || `Payment ${data.status}`,
      priority: "high",
      isRead: false,
      data: {
        relatedId: data.paymentId,
        relatedModel: "Payment",
        category: "payments",
      },
    };
    
    addNotification(notification);
  }, [addNotification]);

  // Setup socket callbacks
  useEffect(() => {
    if (user) {
      SocketService.setNotificationCallback(handleSocketNotification);
      SocketService.setDeliveryStatusCallback(handleDeliveryStatusUpdate);
      SocketService.setOrderUpdateCallback(handleOrderUpdate);
      SocketService.setPaymentUpdateCallback(handlePaymentUpdate);
    }
  }, [user, handleSocketNotification, handleDeliveryStatusUpdate, handleOrderUpdate, handlePaymentUpdate]);

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (user) {
      SocketService.connect();
      setSocketConnected(true);
    } else {
      SocketService.disconnect();
      setSocketConnected(false);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Load initial notifications when user is authenticated
  useEffect(() => {
    if (user) {
      refreshNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, refreshNotifications]);

  // Update socket connection status
  useEffect(() => {
    const checkConnection = () => {
      const status = SocketService.getConnectionStatus();
      setIsConnected(status.isConnected);
    };

    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    isConnected,
    socketConnected,
    allowedTypes,
    categories,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    addNotification,
    getUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;