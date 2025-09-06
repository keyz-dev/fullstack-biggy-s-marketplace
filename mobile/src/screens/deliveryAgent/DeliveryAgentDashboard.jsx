import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../stateManagement/contexts/AuthContext';
import { COLORS, SIZES, FONTS } from '../../constants';

const DeliveryAgentDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    todayDeliveries: 0,
    rating: 0,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch delivery agent stats and data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // TODO: Update availability status on server
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Delivery Agent'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.availabilityButton, isAvailable && styles.availabilityButtonActive]}
          onPress={toggleAvailability}
        >
          <View style={[styles.availabilityDot, isAvailable && styles.availabilityDotActive]} />
          <Text style={[styles.availabilityText, isAvailable && styles.availabilityTextActive]}>
            {isAvailable ? 'Available' : 'Busy'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Your Performance</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="bicycle" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.totalDeliveries}</Text>
          <Text style={styles.statLabel}>Total Deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color={COLORS.success} />
          <Text style={styles.statNumber}>${stats.totalEarnings}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="today" size={24} color={COLORS.tertiary} />
          <Text style={styles.statNumber}>{stats.todayDeliveries}</Text>
          <Text style={styles.statLabel}>Today's Deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="star" size={24} color={COLORS.warning} />
          <Text style={styles.statNumber}>{stats.rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionCard}>
          <Ionicons name="list" size={32} color={COLORS.primary} />
          <Text style={styles.quickActionText}>View Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard}>
          <Ionicons name="map" size={32} color={COLORS.success} />
          <Text style={styles.quickActionText}>Active Deliveries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard}>
          <Ionicons name="time" size={32} color={COLORS.tertiary} />
          <Text style={styles.quickActionText}>Delivery History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionCard}>
          <Ionicons name="analytics" size={32} color={COLORS.warning} />
          <Text style={styles.quickActionText}>Earnings Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.recentActivityContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.activityList}>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Delivery Completed</Text>
            <Text style={styles.activityDescription}>Order #12345 delivered to John Doe</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <Text style={styles.activityAmount}>+$15.00</Text>
        </View>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="bicycle" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>New Request</Text>
            <Text style={styles.activityDescription}>Delivery request from Farm Fresh</Text>
            <Text style={styles.activityTime}>4 hours ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="star" size={20} color={COLORS.warning} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Rating Received</Text>
            <Text style={styles.activityDescription}>5 stars from Sarah Johnson</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {renderHeader()}
        {renderStats()}
        {renderQuickActions()}
        {renderRecentActivity()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  userName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  availabilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  availabilityButtonActive: {
    backgroundColor: COLORS.success + '20',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginRight: SIZES.base / 2,
  },
  availabilityDotActive: {
    backgroundColor: COLORS.success,
  },
  availabilityText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  availabilityTextActive: {
    color: COLORS.success,
  },
  statsContainer: {
    padding: SIZES.base * 2,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    alignItems: 'center',
    width: '48%',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: SIZES.large * 1.2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: SIZES.base / 2,
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.base / 4,
  },
  quickActionsContainer: {
    padding: SIZES.base * 2,
    paddingTop: 0,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  quickActionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    alignItems: 'center',
    width: '48%',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionText: {
    fontSize: SIZES.small,
    color: COLORS.black,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: SIZES.base / 2,
  },
  recentActivityContainer: {
    padding: SIZES.base * 2,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  viewAllText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
  activityList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.black,
  },
  activityDescription: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  activityTime: {
    fontSize: SIZES.small - 1,
    color: COLORS.gray,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.success,
  },
});

export default DeliveryAgentDashboard;

