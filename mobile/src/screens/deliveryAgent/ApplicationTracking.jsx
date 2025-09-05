import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { 
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  MessageCircle,
  MapPin,
  Truck,
  CreditCard,
  Phone,
  Mail
} from 'lucide-react-native';
import { useAuth } from '../../stateManagement/contexts/AuthContext';
import { useApplication } from '../../stateManagement/contexts/ApplicationContext';
import { useNotificationContext } from '../../stateManagement/contexts/NotificationContext';
import { COLORS, SIZES, FONTS } from '../../constants';
import styles from './styles/ApplicationTracking.style';

const ApplicationTracking = ({ navigation, route }) => {
  const { user } = useAuth();
  const { applicationId } = route?.params || {};
  
  const {
    currentApplication,
    timeline,
    loading,
    error,
    getApplicationStatus,
    getMyApplications,
    refreshApplication,
    getStatusColor,
    getStatusText,
    getStatusIcon,
    formatDate,
    clearError
  } = useApplication();

  const { unreadCount, socketConnected } = useNotificationContext();
  
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplicationStatus = useCallback(async () => {
    try {
      if (applicationId) {
        // If applicationId is provided (from success page), fetch specific application
        await getApplicationStatus(applicationId);
      } else {
        // If no applicationId (from drawer), fetch user's latest application
        const response = await getMyApplications();
        if (response.data && response.data.length > 0) {
          // Get the most recent application
          const latestApplication = response.data[0];
          await getApplicationStatus(latestApplication._id);
        }
      }
    } catch (err) {
      console.error('Error fetching application status:', err);
    } finally {
      setRefreshing(false);
    }
  }, [applicationId, getApplicationStatus, getMyApplications]);

  useEffect(() => {
    fetchApplicationStatus();
  }, [fetchApplicationStatus]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchApplicationStatus();
  }, [fetchApplicationStatus]);

  // Helper function to get status icon component
  const getStatusIconComponent = (status) => {
    const iconName = getStatusIcon(status);
    const color = getStatusColor(status);
    
    switch (iconName) {
      case 'clock':
        return <Clock size={20} color={color} />;
      case 'alert-circle':
        return <AlertCircle size={20} color={color} />;
      case 'check-circle':
        return <CheckCircle size={20} color={color} />;
      case 'x-circle':
        return <XCircle size={20} color={color} />;
      default:
        return <Clock size={20} color={color} />;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={24} color={COLORS.black} />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Application Status</Text>
        <Text style={styles.headerSubtitle}>Track your delivery agent application</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={refreshing}
      >
        {refreshing ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <RefreshCw size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStatusCard = () => {
    if (!currentApplication) return null;

    return (
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusIconContainer}>
            {getStatusIconComponent(currentApplication.status)}
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {getStatusText(currentApplication.status)}
            </Text>
            <Text style={styles.statusSubtitle}>
              Application ID: #{currentApplication._id}
            </Text>
          </View>
        </View>

        {currentApplication.adminReview?.remarks && (
          <View style={styles.remarksContainer}>
            <Text style={styles.remarksTitle}>Admin Remarks:</Text>
            <Text style={styles.remarksText}>
              {currentApplication.adminReview.remarks}
            </Text>
          </View>
        )}

        <View style={styles.statusDetails}>
          <View style={styles.statusDetailRow}>
            <Text style={styles.statusDetailLabel}>Submitted:</Text>
            <Text style={styles.statusDetailValue}>
              {formatDate(currentApplication.submittedAt)}
            </Text>
          </View>
          {currentApplication.reviewedAt && (
            <View style={styles.statusDetailRow}>
              <Text style={styles.statusDetailLabel}>Last Review:</Text>
              <Text style={styles.statusDetailValue}>
                {formatDate(currentApplication.reviewedAt)}
              </Text>
            </View>
          )}
          <View style={styles.statusDetailRow}>
            <Text style={styles.statusDetailLabel}>Estimated Completion:</Text>
            <Text style={styles.statusDetailValue}>
              {formatDate(currentApplication.estimatedCompletion || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTimeline = () => (
    <View style={styles.timelineCard}>
      <Text style={styles.sectionTitle}>Application Timeline</Text>
      
      <View style={styles.timeline}>
        {timeline.map((event, index) => (
          <View key={event.id} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[
                styles.timelineIcon,
                event.completed && styles.timelineIconCompleted,
                event.current && styles.timelineIconCurrent
              ]}>
                {event.completed ? (
                  <CheckCircle size={16} color={COLORS.white} />
                ) : event.current ? (
                  <Clock size={16} color={COLORS.primary} />
                ) : (
                  <Clock size={16} color={COLORS.gray} />
                )}
              </View>
              {index < timeline.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            
            <View style={styles.timelineContent}>
              <Text style={[
                styles.timelineTitle,
                event.completed && styles.timelineTitleCompleted,
                event.current && styles.timelineTitleCurrent
              ]}>
                {event.title}
              </Text>
              <Text style={styles.timelineDescription}>
                {event.description}
              </Text>
              <Text style={styles.timelineDate}>
                {formatDate(event.date)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderApplicationDetails = () => {
    if (!currentApplication) return null;

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Application Details</Text>
        
        <View style={styles.detailsSection}>
          <Text style={styles.detailsSectionTitle}>Business Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Business Name:</Text>
            <Text style={styles.detailValue}>{currentApplication.businessName || 'Not specified'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle Type:</Text>
            <Text style={styles.detailValue}>{currentApplication.vehicleType || 'Not specified'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service Areas:</Text>
            <Text style={styles.detailValue}>
              {currentApplication.serviceAreas?.length ? currentApplication.serviceAreas.join(', ') : 'Not specified'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.detailsSectionTitle}>Contact Information</Text>
          {currentApplication.contactInfo?.map((contact, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {contact.type === 'phone' ? 'Phone:' : 'Email:'}
              </Text>
              <Text style={styles.detailValue}>{contact.value}</Text>
            </View>
          )) || (
            <Text style={styles.detailValue}>No contact information available</Text>
          )}
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.detailsSectionTitle}>Payment Methods</Text>
          <Text style={styles.detailValue}>
            {currentApplication.paymentMethods?.length ? currentApplication.paymentMethods.join(', ') : 'Not specified'}
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.detailsSectionTitle}>Document Status</Text>
          {currentApplication.documents?.map((doc, index) => (
            <View key={index} style={styles.documentRow}>
              <FileText size={16} color={COLORS.gray} />
              <Text style={styles.documentName}>{doc.name}</Text>
              <View style={[
                styles.documentStatus,
                { backgroundColor: doc.status === 'approved' ? COLORS.success : COLORS.warning }
              ]}>
                <Text style={styles.documentStatusText}>
                  {doc.status}
                </Text>
              </View>
            </View>
          )) || (
            <Text style={styles.detailValue}>No documents available</Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading application status...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show message if no application found
  if (!currentApplication) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.noApplicationContainer}>
          <FileText size={80} color={COLORS.gray} />
          <Text style={styles.noApplicationTitle}>No Application Found</Text>
          <Text style={styles.noApplicationText}>
            You don't have any applications yet. Please submit an application to track its status.
          </Text>
          <TouchableOpacity 
            style={styles.submitApplicationButton}
            onPress={() => navigation.navigate('DeliveryRegister')}
          >
            <Text style={styles.submitApplicationButtonText}>Submit Application</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
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
        {renderStatusCard()}
        {renderTimeline()}
        {renderApplicationDetails()}
      </ScrollView>
    </View>
  );
};

export default ApplicationTracking;
