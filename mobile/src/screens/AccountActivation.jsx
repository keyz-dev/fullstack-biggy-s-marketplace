import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../stateManagement/contexts/AuthContext';
import { COLORS, SIZES, FONTS } from '../constants';
import applicationAPI from '../api/application';

const AccountActivation = ({ navigation }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'pending_farmer':
        return 'Farmer';
      case 'pending_delivery_agent':
        return 'Delivery Agent';
      default:
        return 'User';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'pending_farmer':
        return 'leaf';
      case 'pending_delivery_agent':
        return 'bicycle';
      default:
        return 'person';
    }
  };

  const handleActivateAccount = async () => {
    setLoading(true);
    try {
      const response = await applicationAPI.activateAccount();
      
      if (response.success) {
        Alert.alert(
          'Account Activated!',
          `Congratulations! Your account has been activated as a ${getRoleDisplayName(user.role)}. You can now access all ${getRoleDisplayName(user.role).toLowerCase()} features.`,
          [
            {
              text: 'Continue',
              onPress: () => {
                // Refresh user data to get updated role
                refreshUser();
                // Navigation will be handled by AppStack based on new role
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to activate account');
      }
    } catch (error) {
      console.error('Account activation error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to activate account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getRoleIcon(user?.role)}
              size={80}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.title}>Account Approved!</Text>
          <Text style={styles.subtitle}>
            Your {getRoleDisplayName(user?.role).toLowerCase()} application has been approved by our admin team.
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            <Text style={styles.statusTitle}>Application Status: Approved</Text>
          </View>
          <Text style={styles.statusDescription}>
            You are now ready to activate your account and start using all the features available to {getRoleDisplayName(user?.role).toLowerCase()}s.
          </Text>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>
            What you can do as a {getRoleDisplayName(user?.role)}:
          </Text>
          <View style={styles.featuresList}>
            {user?.role === 'pending_farmer' && (
              <>
                <View style={styles.featureItem}>
                  <Ionicons name="storefront" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>Create and manage your farm shop</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="leaf" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>List and sell your products</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="people" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>Connect with customers</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="analytics" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>Track sales and analytics</Text>
                </View>
              </>
            )}
            {user?.role === 'pending_delivery_agent' && (
              <>
                <View style={styles.featureItem}>
                  <Ionicons name="bicycle" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>Accept delivery requests</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="map" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>Track delivery routes</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="cash" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>Earn money from deliveries</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="time" size={20} color={COLORS.primary} />
                  <Text style={styles.featureText}>Manage your availability</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Activation Button */}
        <TouchableOpacity
          style={[styles.activateButton, loading && styles.activateButtonDisabled]}
          onPress={handleActivateAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
              <Text style={styles.activateButtonText}>Activate My Account</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={styles.infoText}>
          By activating your account, you agree to our terms of service and will be able to access all platform features.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    flex: 1,
    padding: SIZES.base * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: {
    fontSize: SIZES.large * 1.5,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SIZES.base / 2,
  },
  subtitle: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    marginBottom: SIZES.base * 2,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  statusTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: SIZES.base / 2,
  },
  statusDescription: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    lineHeight: 20,
  },
  featuresCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    marginBottom: SIZES.base * 2,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featuresTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  featuresList: {
    gap: SIZES.base,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: SIZES.small,
    color: COLORS.black,
    marginLeft: SIZES.base / 2,
    flex: 1,
  },
  activateButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  activateButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  activateButtonText: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: SIZES.base / 2,
  },
  infoText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AccountActivation;
