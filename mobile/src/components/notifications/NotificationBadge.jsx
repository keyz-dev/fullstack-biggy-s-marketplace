import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNotificationContext } from "../../stateManagement/contexts";
import { COLORS, SIZES } from "../../constants";

const NotificationBadge = ({ size = 18, fontSize = 10 }) => {
  const { unreadCount } = useNotificationContext();

  if (unreadCount === 0) {
    return null;
  }

  return (
    <View style={[styles.badge, { width: size, height: size }]}>
      <Text style={[styles.badgeText, { fontSize }]}>
        {unreadCount > 99 ? "99+" : unreadCount.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.red,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    minHeight: 18,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationBadge;

