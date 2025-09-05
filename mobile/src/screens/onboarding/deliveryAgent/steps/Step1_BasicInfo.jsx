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
import ImagePickerInput from '../../../../components/ImagePickerInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles/step_1.style';

const Step1_BasicInfo = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    updateField,
    errors,
    isLoading,
    submitStep1,
  } = useDeliveryAgentApplication();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const handleNext = async () => {
    const result = await submitStep1();
    if (result.success) {
      onNext();
    } else {
      Alert.alert('Error', result.error || 'Please fill in all required fields');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateField('dob', selectedDate.toISOString().split('T')[0]);
    }
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
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {/* Full Name */}
          <CustomInput
            label="Full Name *"
            placeholder="Enter your full name"
            value={deliveryAgentData.name}
            onChangeText={(text) => updateField('name', text)}
            error={errors.name}
            autoCapitalize="words"
          />

          {/* Email */}
          <CustomInput
            label="Email Address *"
            placeholder="Enter your email"
            value={deliveryAgentData.email}
            onChangeText={(text) => updateField('email', text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Number */}
          <CustomInput
            label="Phone Number *"
            placeholder="Enter your phone number"
            value={deliveryAgentData.phoneNumber}
            onChangeText={(text) => updateField('phoneNumber', text)}
            error={errors.phoneNumber}
            keyboardType="phone-pad"
          />

          {/* Gender */}
          <PickerInput
            label="Gender *"
            selectedValue={deliveryAgentData.gender}
            onValueChange={(value) => updateField('gender', value)}
            items={genderOptions}
            errors={errors.gender}
            materialIconName="account"
          />

          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, errors.dob && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[
                styles.datePickerText,
                !deliveryAgentData.dob && styles.placeholderText
              ]}>
                {deliveryAgentData.dob || 'Select your date of birth'}
              </Text>
            </TouchableOpacity>
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
          </View>

          {/* Avatar/Profile Picture */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Profile Picture</Text>
            <ImagePickerInput
              imageUri={deliveryAgentData.avatar}
              onImageSelect={(uri) => updateField('avatar', uri)}
              label="profile picture"
            />
            {errors.avatar && <Text style={styles.errorText}>{errors.avatar}</Text>}
          </View>
          
          {/* Password */}
          <CustomInput
            label="Password *"
            placeholder="Create a password"
            value={deliveryAgentData.password}
            onChangeText={(text) => updateField('password', text)}
            error={errors.password}
            secureTextEntry
          />

          {/* Confirm Password */}
          <CustomInput
            label="Confirm Password *"
            placeholder="Confirm your password"
            value={deliveryAgentData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            error={errors.confirmPassword}
            secureTextEntry
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Continue"
              onPress={handleNext}
              loading={isLoading}
              style={styles.continueButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={deliveryAgentData.dob ? new Date(deliveryAgentData.dob) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

    </KeyboardAvoidingView>
  );
};


export default Step1_BasicInfo;
