import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import CustomInput from '../../../../components/CustomInput';
import CustomButton from '../../../../components/CustomButton';
import PickerInput from '../../../../components/PickerInput';
import styles from './styles/step_3.style';

const Step3_BusinessInfo = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    updateField,
    errors,
    isLoading,
  } = useDeliveryAgentApplication();

  const vehicleTypeOptions = [
    { label: 'Motorcycle', value: 'motorcycle' },
    { label: 'Car', value: 'car' },
    { label: 'Truck', value: 'truck' },
    { label: 'Bicycle', value: 'bicycle' },
    { label: 'Van', value: 'van' },
    { label: 'Other', value: 'other' },
  ];

  const experienceOptions = [
    { label: 'Less than 1 year', value: '0-1' },
    { label: '1-2 years', value: '1-2' },
    { label: '2-3 years', value: '2-3' },
    { label: '3-5 years', value: '3-5' },
    { label: '5-10 years', value: '5-10' },
    { label: 'More than 10 years', value: '10+' },
  ];

  const handleNext = () => {
    // Validate required fields
    if (!deliveryAgentData.vehicleType) {
      Alert.alert('Error', 'Please select your vehicle type');
      return;
    }
    if (!deliveryAgentData.description || deliveryAgentData.description.trim().length < 10) {
      Alert.alert('Error', 'Please provide a business description (at least 10 characters)');
      return;
    }
    if (!deliveryAgentData.experience) {
      Alert.alert('Error', 'Please select your delivery experience');
      return;
    }

    onNext();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Business & Vehicle Information</Text>
            <Text style={styles.subtitle}>Tell us about your delivery business</Text>
          </View>

          {/* Business Name (Optional) */}
          <CustomInput
            label="Business Name (Optional)"
            placeholder="Enter your business name"
            value={deliveryAgentData.businessName}
            onChangeText={(text) => updateField('businessName', text)}
            error={errors.businessName}
            autoCapitalize="words"
          />

          {/* Vehicle Type */}
          <PickerInput
            label="Vehicle Type *"
            selectedValue={deliveryAgentData.vehicleType}
            onValueChange={(value) => updateField('vehicleType', value)}
            items={vehicleTypeOptions}
            errors={errors.vehicleType}
            materialIconName="truck"
            placeholder="Select your vehicle type"
          />

          {/* Business Description */}
          <View style={styles.textAreaContainer}>
            <Text style={styles.label}>Business Description *</Text>
            <CustomInput
              placeholder="Describe your delivery business, services, and what makes you unique..."
              value={deliveryAgentData.description}
              onChangeText={(text) => updateField('description', text)}
              error={errors.description}
              multiline
              numberOfLines={4}
              style={styles.textArea}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>
              {deliveryAgentData.description?.length || 0}/500 characters
            </Text>
          </View>

          {/* Experience */}
          <PickerInput
            label="Delivery Experience *"
            selectedValue={deliveryAgentData.experience}
            onValueChange={(value) => updateField('experience', value)}
            items={experienceOptions}
            errors={errors.experience}
            materialIconName="clock"
            placeholder="Select your experience level"
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Back"
              onPress={onPrev}
              style={[styles.button, styles.backButton]}
              textStyle={styles.backButtonText}
              disabled={isLoading}
            />
            <CustomButton
              title="Continue"
              onPress={handleNext}
              loading={isLoading}
              style={[styles.button, styles.continueButton]}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Step3_BusinessInfo;
