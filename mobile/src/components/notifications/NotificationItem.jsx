import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotificationContext } from "../../stateManagement/contexts";
import { COLORS, SIZES } from "../../constants";

const NotificationItem = ({ notification, onPress }) => {
  const { markAsRead, deleteNotification } = useNotificationContext();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return COLORS.red;
      case "high":
        return COLORS.orange;
      case "medium":
        return COLORS.primary;
      case "low":
        return COLORS.gray;
      default:
        return COLORS.primary;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application_approved":
        return "checkmark-circle";
      case "application_rejected":
        return "close-circle";
      case "application_under_review":
        return "time";
      case "new_order_received":
        return "bag";
      case "order_status_update":
        return "refresh";
      case "delivery_status_update":
        return "car";
      case "payment_successful":
        return "card";
      case "payment_failed":
        return "card-outline";
      case "new_delivery_request":
        return "bicycle";
      case "system_announcement":
        return "megaphone";
      default:
        return "notifications";
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleMarkAsRead = async () => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNotification(notification.id),
        },
      ]
    );
  };

  const handlePress = () => {
    handleMarkAsRead();
    if (onPress) {
      onPress(notification);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getPriorityColor(notification.priority) + "20" },
          ]}
        >
          <Ionicons
            name={getNotificationIcon(notification.type)}
            size={20}
            color={getPriorityColor(notification.priority)}
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                !notification.isRead && styles.unreadTitle,
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            <Text style={styles.time}>
              {formatTime(notification.createdAt)}
            </Text>
          </View>

          <Text
            style={[
              styles.message,
              !notification.isRead && styles.unreadMessage,
            ]}
            numberOfLines={2}
          >
            {notification.message}
          </Text>

          {/* Category Badge */}
          {notification.data?.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>
                {notification.data.category}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {!notification.isRead && (
            <View style={styles.unreadDot} />
          )}
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightWhite,
    marginHorizontal: SIZES.base,
    marginVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.lightGray,
  },
  unreadContainer: {
    backgroundColor: COLORS.white,
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.base,
  },
  textContainer: {
    flex: 1,
    marginRight: SIZES.base,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.base / 2,
  },
  title: {
    fontSize: SIZES.font,
    fontWeight: "500",
    color: COLORS.black,
    flex: 1,
    marginRight: SIZES.base,
  },
  unreadTitle: {
    fontWeight: "600",
  },
  time: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  message: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    lineHeight: 18,
    marginBottom: SIZES.base / 2,
  },
  unreadMessage: {
    color: COLORS.black,
    fontWeight: "400",
  },
  categoryContainer: {
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: SIZES.small - 1,
    color: COLORS.primary,
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: SIZES.base / 2,
    paddingVertical: 2,
    borderRadius: SIZES.base / 2,
    fontWeight: "500",
  },
  actions: {
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  deleteButton: {
    padding: SIZES.base / 2,
  },
});

export default NotificationItem;