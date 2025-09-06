import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNotificationContext } from "../stateManagement/contexts";
import NotificationItem from "../components/notifications/NotificationItem";
import { COLORS, SIZES } from "../constants";

const Notifications = ({ navigation }) => {
  const {
    notifications,
    unreadCount,
    loading,
    isConnected,
    socketConnected,
    markAllAsRead,
    refreshNotifications,
    allowedTypes,
    categories,
  } = useNotificationContext();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Filter notifications based on selected filters
  const filteredNotifications = notifications.filter((notification) => {
    const categoryMatch = selectedCategory === "all" || 
      notification.data?.category === selectedCategory;
    const typeMatch = selectedType === "all" || 
      notification.type === selectedType;
    return categoryMatch && typeMatch;
  });

  const handleNotificationPress = (notification) => {
    // Navigate based on notification type and related data
    if (notification.data?.relatedId) {
      switch (notification.data.relatedModel) {
        case "Order":
          navigation.navigate("OrderDetails", { orderId: notification.data.relatedId });
          break;
        case "UserApplication":
          navigation.navigate("ApplicationTracking");
          break;
        case "DeliveryRequest":
          navigation.navigate("DeliveryDetails", { requestId: notification.data.relatedId });
          break;
        default:
          console.log("No specific navigation for this notification type");
      }
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      Alert.alert(
        "Mark All as Read",
        `Are you sure you want to mark all ${unreadCount} notifications as read?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Mark All Read",
            onPress: markAllAsRead,
          },
        ]
      );
    }
  };

  const renderNotificationItem = ({ item }) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
    />
  );

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Categories</Text>
      <View style={styles.filterRow}>
        {["all", ...categories].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedCategory === category && styles.activeFilterButtonText,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTypeFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Types</Text>
      <View style={styles.filterRow}>
        {["all", ...allowedTypes.slice(0, 5)].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              selectedType === type && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedType === type && styles.activeFilterButtonText,
              ]}
            >
              {type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-outline" size={64} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        {selectedCategory !== "all" || selectedType !== "all"
          ? "No notifications match your current filters"
          : "You're all caught up! New notifications will appear here."}
      </Text>
      {(selectedCategory !== "all" || selectedType !== "all") && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={() => {
            setSelectedCategory("all");
            setSelectedType("all");
          }}
        >
          <Text style={styles.clearFiltersText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {/* Connection Status */}
          <View style={styles.connectionStatus}>
            <View
              style={[
                styles.connectionDot,
                { backgroundColor: socketConnected ? COLORS.success : COLORS.error },
              ]}
            />
            <Text style={styles.connectionText}>
              {socketConnected ? "Connected" : "Disconnected"}
            </Text>
          </View>

          {/* Mark All Read Button */}
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
            >
              <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
              <Text style={styles.markAllText}>Mark All Read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Filters */}
      {renderCategoryFilter()}
      {renderTypeFilter()}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshNotifications}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 80, // Approximate height of each notification item
          offset: 80 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  listContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.base,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.black,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SIZES.base,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.base / 2,
  },
  connectionText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  markAllText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: "500",
    marginLeft: SIZES.base / 2,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    alignSelf: "flex-start",
    marginBottom: SIZES.base,
  },
  unreadText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: "500",
  },
  filterContainer: {
    marginBottom: SIZES.base,
  },
  filterTitle: {
    fontSize: SIZES.font,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: SIZES.base / 2,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base / 2,
    marginBottom: SIZES.base / 2,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    fontWeight: "500",
  },
  activeFilterButtonText: {
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base * 4,
  },
  emptyTitle: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.black,
    marginTop: SIZES.base,
    marginBottom: SIZES.base / 2,
  },
  emptyMessage: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SIZES.base * 2,
  },
  clearFiltersButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  clearFiltersText: {
    fontSize: SIZES.font,
    color: COLORS.white,
    fontWeight: "500",
  },
});

export default Notifications;