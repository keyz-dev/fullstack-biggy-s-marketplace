import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Home, 
  Eye,
  Calendar,
  MessageCircle,
  RefreshCw
} from 'lucide-react-native';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import { useAuth } from '../../../../stateManagement/contexts/AuthContext';
import { COLORS, SIZES, FONTS } from '../../../../constants';
import styles from './styles/step_12.style';

const Step12_Success = ({ onNext, onPrev }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { 
    deliveryAgentData,
    applicationData,
    isLoading 
  } = useDeliveryAgentApplication();

  const [applicationId, setApplicationId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Get application ID from the context or generate a temporary one
    if (applicationData?._id) {
      setApplicationId(applicationData._id);
    } else {
      // Generate a temporary ID for display (last 8 characters of timestamp)
      const tempId = Date.now().toString().slice(-8);
      setApplicationId(tempId);
    }
  }, [applicationData]);

  const handleTrackApplication = () => {
    // Navigate to application tracking page
    Alert.alert(
      'Track Application',
      'This will take you to the application tracking page where you can monitor your application status.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // Navigate to tracking page
            navigation.navigate('ApplicationTracking', { 
              applicationId: applicationId 
            });
          }
        }
      ]
    );
  };

  const handleGoHome = () => {
    Alert.alert(
      'Go to Home',
      'Are you sure you want to go to the main app? You can always track your application later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            onNext(); // This will navigate to main app
          }
        }
      ]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh - in real implementation, this would fetch latest status
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderTimelineStep = (icon, title, description, status = 'pending') => {
    const IconComponent = icon;
    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';
    
    return (
      <View style={styles.timelineStep}>
        <View style={[
          styles.timelineIcon,
          isCompleted && styles.timelineIconCompleted,
          isCurrent && styles.timelineIconCurrent
        ]}>
          <IconComponent 
            size={20} 
            color={isCompleted ? COLORS.white : isCurrent ? COLORS.primary : COLORS.gray} 
          />
        </View>
        <View style={styles.timelineContent}>
          <Text style={[
            styles.timelineTitle,
            isCompleted && styles.timelineTitleCompleted,
            isCurrent && styles.timelineTitleCurrent
          ]}>
            {title}
          </Text>
          <Text style={styles.timelineDescription}>
            {description}
          </Text>
        </View>
      </View>
    );
  };

  const renderApplicationInfo = () => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicationIdContainer}>
          <Text style={styles.applicationIdLabel}>Application ID</Text>
          <Text style={styles.applicationId}>#{applicationId}</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <RefreshCw size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusPill}>
          <Clock size={16} color={COLORS.primary} />
          <Text style={styles.statusText}>Pending Review</Text>
        </View>
        <Text style={styles.estimatedTime}>
          Review typically takes 2-3 business days
        </Text>
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Business Name</Text>
          <Text style={styles.detailValue}>
            {deliveryAgentData.businessName || 'Not specified'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vehicle Type</Text>
          <Text style={styles.detailValue}>
            {deliveryAgentData.vehicleType || 'Not specified'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Service Areas</Text>
          <Text style={styles.detailValue}>
            {deliveryAgentData.serviceAreas?.length || 0} areas selected
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Submitted</Text>
          <Text style={styles.detailValue}>
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderNextSteps = () => (
    <View style={styles.nextStepsCard}>
      <Text style={styles.sectionTitle}>What happens next?</Text>
      
      <View style={styles.timeline}>
        {renderTimelineStep(
          Clock,
          'Under Review',
          'Our team is reviewing your application and documents',
          'current'
        )}
        {renderTimelineStep(
          MessageCircle,
          'Admin Review',
          'An admin will review your application and may contact you for additional information',
          'pending'
        )}
        {renderTimelineStep(
          CheckCircle,
          'Decision Made',
          'You will receive notification of approval or any required changes',
          'pending'
        )}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={styles.trackButton}
        onPress={handleTrackApplication}
        disabled={isLoading}
      >
        <Eye size={20} color={COLORS.white} />
        <Text style={styles.trackButtonText}>Track Application</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={handleGoHome}
        disabled={isLoading}
      >
        <Home size={20} color={COLORS.primary} />
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Processing your application...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.successIconContainer}>
          <CheckCircle size={80} color={COLORS.success} />
        </View>
        <Text style={styles.successTitle}>Application Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Your delivery agent application has been successfully received and is now under review.
        </Text>
      </View>

      {/* Application Information */}
      {renderApplicationInfo()}

      {/* Next Steps Timeline */}
      {renderNextSteps()}

      {/* Important Information */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Important Information</Text>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <FileText size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Keep your application ID (#{applicationId}) for reference
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MessageCircle size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>
              You will receive email notifications about status updates
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Calendar size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Review process typically takes 2-3 business days
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      {renderActionButtons()}
    </ScrollView>
  );
};

export default Step12_Success;
