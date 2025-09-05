import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CheckCircle, FileText, MapPin, Clock, CreditCard, Truck, User, Mail, Phone } from 'lucide-react-native';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import { useAuth } from '../../../../stateManagement/contexts/AuthContext';
import { COLORS, SIZES, FONTS } from '../../../../constants';
import styles from './styles/step_11.style';

const Step11_ReviewSubmit = ({ onNext, onPrev }) => {
  const { user } = useAuth();
  const {
    deliveryAgentData,
    submitDeliveryAgentApplication,
    updateField,
    isLoading,
  } = useDeliveryAgentApplication();

  const [agreedToTerms, setAgreedToTerms] = useState(deliveryAgentData.agreedToTerms || false);

  const handleSubmit = async () => {

    console.log("this is the delivery agent data about to be submitted: ", deliveryAgentData);

    if (!agreedToTerms) {
      Alert.alert('Required', 'Please agree to the terms and conditions to continue');
      return;
    }

    try {
      // Update the context with the agreed terms before submission
      updateField('agreedToTerms', true);

      console.log("this is the delivery agent data: ", deliveryAgentData);
      
      const result = await submitDeliveryAgentApplication();
      
      if (result.success) {
        onNext();
      } else {
        Alert.alert('Error', result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const renderSection = (title, icon, children) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderInfoRow = (label, value, isArray = false) => {
    if (!value || (isArray && value.length === 0)) return null;
    
    // Handle different value types safely
    let displayValue = '';
    if (isArray) {
      displayValue = Array.isArray(value) ? value.join(', ') : String(value);
    } else if (typeof value === 'object') {
      displayValue = JSON.stringify(value);
    } else {
      displayValue = String(value);
    }
    
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>
          {displayValue}
        </Text>
      </View>
    );
  };

  const renderAddress = (address, title) => {
    if (!address || !address.fullAddress) return null;
    
    return (
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>{title}</Text>
        <Text style={styles.addressText}>{address.fullAddress}</Text>
        {address.city && (
          <Text style={styles.addressText}>{address.city}, {address.state}</Text>
        )}
      </View>
    );
  };

  const renderOperatingHours = () => {
    if (!deliveryAgentData.operatingHours || deliveryAgentData.operatingHours.length === 0) {
      return null;
    }

    return (
      <View style={styles.operatingHoursContainer}>
        {deliveryAgentData.operatingHours.map((schedule, index) => (
          <View key={index} style={styles.scheduleItem}>
            <Text style={styles.scheduleDay}>{String(schedule.day || 'Unknown')}:</Text>
            <Text style={styles.scheduleTime}>
              {schedule.isOpen 
                ? `${String(schedule.openTime || '')} - ${String(schedule.closeTime || '')}`
                : 'Closed'
              }
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderServiceAreas = () => {
    if (!deliveryAgentData.serviceAreas || deliveryAgentData.serviceAreas.length === 0) {
      return null;
    }

    return (
      <View style={styles.serviceAreasContainer}>
        {deliveryAgentData.serviceAreas.map((area, index) => (
          <View key={index} style={styles.serviceAreaItem}>
            <Text style={styles.serviceAreaText}>{String(area || 'Unknown Area')}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderContactInfo = () => {
    if (!deliveryAgentData.contactInfo || deliveryAgentData.contactInfo.length === 0) {
      return null;
    }

    return (
      <View style={styles.contactInfoContainer}>
        {deliveryAgentData.contactInfo.map((contact, index) => (
          <View key={index} style={styles.contactItem}>
            <Text style={styles.contactType}>{String(contact.type || 'Unknown')}:</Text>
            <Text style={styles.contactValue}>{String(contact.value || '')}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPaymentMethods = () => {
    if (!deliveryAgentData.paymentMethods || deliveryAgentData.paymentMethods.length === 0) {
      return null;
    }

    return (
      <View style={styles.paymentMethodsContainer}>
        {deliveryAgentData.paymentMethods.map((method, index) => (
          <View key={index} style={styles.paymentMethodItem}>
            <Text style={styles.paymentMethodText}>{String(method || 'Unknown Method')}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDocuments = () => {
    if (!deliveryAgentData.documents || deliveryAgentData.documents.length === 0) {
      return null;
    }

    const uploadedDocs = deliveryAgentData.documents.filter(doc => doc.file);
    
    return (
      <View style={styles.documentsContainer}>
        <Text style={styles.documentsCount}>
          {uploadedDocs.length} of {deliveryAgentData.documents.length} documents uploaded
        </Text>
        {uploadedDocs.map((doc, index) => (
          <View key={index} style={styles.documentItem}>
            <CheckCircle size={16} color={COLORS.success} />
            <Text style={styles.documentName}>{doc.documentName}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderVehicleImages = () => {
    if (!deliveryAgentData.vehicleImages || deliveryAgentData.vehicleImages.length === 0) {
      return null;
    }

    const uploadedImages = deliveryAgentData.vehicleImages.filter(img => img.file);
    
    return (
      <View style={styles.vehicleImagesContainer}>
        <Text style={styles.vehicleImagesCount}>
          {uploadedImages.length} of {deliveryAgentData.vehicleImages.length} vehicle images uploaded
        </Text>
        {uploadedImages.map((img, index) => (
          <View key={index} style={styles.vehicleImageItem}>
            <CheckCircle size={16} color={COLORS.success} />
            <Text style={styles.vehicleImageName}>{img.imageName}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review Your Application</Text>
        <Text style={styles.headerSubtitle}>
          Please review all information before submitting your delivery agent application
        </Text>
      </View>

      {/* Personal Information - Only show if user is not logged in as incomplete_delivery_agent */}
      {user?.role !== 'incomplete_delivery_agent' && renderSection(
        'Personal Information',
        <User size={20} color={COLORS.primary} />,
        <View>
          {renderInfoRow('Name', deliveryAgentData.name)}
          {renderInfoRow('Email', deliveryAgentData.email)}
          {renderInfoRow('Phone', deliveryAgentData.phoneNumber)}
          {renderInfoRow('Gender', deliveryAgentData.gender)}
          {renderInfoRow('Date of Birth', deliveryAgentData.dob)}
          {renderAddress(deliveryAgentData.address, 'Address')}
        </View>
      )}

      {/* Business Information */}
      {renderSection(
        'Business Information',
        <Truck size={20} color={COLORS.primary} />,
        <View>
          {renderInfoRow('Business Name', deliveryAgentData.businessName)}
          {renderInfoRow('Vehicle Type', deliveryAgentData.vehicleType)}
          {renderInfoRow('Description', deliveryAgentData.description)}
          {renderInfoRow('Experience', deliveryAgentData.experience)}
        </View>
      )}

      {/* Service Areas */}
      {deliveryAgentData.serviceAreas && deliveryAgentData.serviceAreas.length > 0 && renderSection(
        'Service Areas',
        <MapPin size={20} color={COLORS.primary} />,
        renderServiceAreas()
      )}

      {/* Operating Hours */}
      {deliveryAgentData.operatingHours && deliveryAgentData.operatingHours.length > 0 && renderSection(
        'Operating Hours',
        <Clock size={20} color={COLORS.primary} />,
        renderOperatingHours()
      )}

      {/* Delivery Preferences */}
      {deliveryAgentData.deliveryPreferences && renderSection(
        'Delivery Preferences',
        <Truck size={20} color={COLORS.primary} />,
        <View>
          {renderInfoRow('Max Delivery Radius', `${deliveryAgentData.deliveryPreferences.maxDeliveryRadius} km`)}
          {renderInfoRow('Max Package Weight', `${deliveryAgentData.deliveryPreferences.maxPackageWeight} kg`)}
          {renderInfoRow('Accepts Fragile Items', deliveryAgentData.deliveryPreferences.acceptsFragileItems ? 'Yes' : 'No')}
          {renderInfoRow('Accepts Perishable Items', deliveryAgentData.deliveryPreferences.acceptsPerishableItems ? 'Yes' : 'No')}
          {renderInfoRow('Accepts Livestock', deliveryAgentData.deliveryPreferences.acceptsLivestock ? 'Yes' : 'No')}
        </View>
      )}

      {/* Contact Information */}
      {deliveryAgentData.contactInfo && deliveryAgentData.contactInfo.length > 0 && renderSection(
        'Contact Information',
        <Phone size={20} color={COLORS.primary} />,
        renderContactInfo()
      )}

      {/* Business Address */}
      {deliveryAgentData.businessAddress && renderSection(
        'Business Address',
        <MapPin size={20} color={COLORS.primary} />,
        renderAddress(deliveryAgentData.businessAddress, 'Business Location')
      )}

      {/* Payment Methods */}
      {deliveryAgentData.paymentMethods && deliveryAgentData.paymentMethods.length > 0 && renderSection(
        'Payment Methods',
        <CreditCard size={20} color={COLORS.primary} />,
        renderPaymentMethods()
      )}

      {/* Documents */}
      {deliveryAgentData.documents && deliveryAgentData.documents.length > 0 && renderSection(
        'Documents',
        <FileText size={20} color={COLORS.primary} />,
        renderDocuments()
      )}

      {/* Vehicle Images */}
      {deliveryAgentData.vehicleImages && deliveryAgentData.vehicleImages.length > 0 && renderSection(
        'Vehicle Images',
        <Truck size={20} color={COLORS.primary} />,
        renderVehicleImages()
      )}

      {/* Terms and Conditions */}
      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={styles.termsCheckbox}
          onPress={() => {
            const newValue = !agreedToTerms;
            setAgreedToTerms(newValue);
            updateField('agreedToTerms', newValue);
          }}
        >
          <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
            {agreedToTerms && <CheckCircle size={16} color={COLORS.white} />}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms and Conditions</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.prevButton}
          onPress={onPrev}
          disabled={isLoading}
        >
          <Text style={styles.prevButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading || !agreedToTerms}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Step11_ReviewSubmit;
