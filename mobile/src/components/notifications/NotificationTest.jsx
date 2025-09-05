import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNotificationContext } from "../../stateManagement/contexts";
import { COLORS, SIZES } from "../../constants";

const NotificationTest = () => {
  const { addNotification, unreadCount, isConnected, socketConnected } = useNotificationContext();

  const testNotifications = [
    {
      id: `test_${Date.now()}`,
      type: "application_approved",
      title: "Application Approved!",
      message: "Congratulations! Your delivery agent application has been approved.",
      priority: "high",
      isRead: false,
      data: {
        relatedId: "123",
        relatedModel: "UserApplication",
        category: "applications",
      },
    },
    {
      id: `test_${Date.now() + 1}`,
      type: "new_order_received",
      title: "New Order",
      message: "You have received a new order for delivery.",
      priority: "medium",
      isRead: false,
      data: {
        relatedId: "456",
        relatedModel: "Order",
        category: "orders",
      },
    },
    {
      id: `test_${Date.now() + 2}`,
      type: "payment_successful",
      title: "Payment Successful",
      message: "Your payment has been processed successfully.",
      priority: "high",
      isRead: false,
      data: {
        relatedId: "789",
        relatedModel: "Payment",
        category: "payments",
      },
    },
  ];

  const handleTestNotification = (notification) => {
    addNotification(notification);
    Alert.alert("Test Notification", "Test notification added!");
  };

  const handleTestAll = () => {
    testNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 1000);
    });
    Alert.alert("Test All", "All test notifications will be added with 1-second intervals");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Test Panel</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Socket Connected: {socketConnected ? "✅" : "❌"}
        </Text>
        <Text style={styles.statusText}>
          API Connected: {isConnected ? "✅" : "❌"}
        </Text>
        <Text style={styles.statusText}>
          Unread Count: {unreadCount}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => handleTestNotification(testNotifications[0])}
        >
          <Text style={styles.buttonText}>Test Application Approved</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => handleTestNotification(testNotifications[1])}
        >
          <Text style={styles.buttonText}>Test New Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={() => handleTestNotification(testNotifications[2])}
        >
          <Text style={styles.buttonText}>Test Payment Success</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.warningButton]}
          onPress={handleTestAll}
        >
          <Text style={styles.buttonText}>Test All Notifications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    margin: SIZES.base,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: SIZES.base,
  },
  statusContainer: {
    backgroundColor: COLORS.lightGray,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  statusText: {
    fontSize: SIZES.font,
    color: COLORS.black,
    marginBottom: SIZES.base / 2,
  },
  buttonContainer: {
    gap: SIZES.base / 2,
  },
  button: {
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.orange,
  },
  successButton: {
    backgroundColor: COLORS.green,
  },
  warningButton: {
    backgroundColor: COLORS.red,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: "500",
  },
});

export default NotificationTest;

