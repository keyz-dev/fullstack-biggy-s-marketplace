import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import { useAuth } from '../../../../stateManagement/contexts/AuthContext'
import CustomButton from '../../../../components/CustomButton';
import { CheckCircle2 } from 'lucide-react-native';
import styles from './styles/step_2.style';

const CODE_LENGTH = 6;
const REDIRECT_DELAY = 1200; // 1.2 seconds delay

const Step2_EmailVerification = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    errors,
    isLoading,
    STEPS,
  } = useDeliveryAgentApplication();

  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [isValid, setIsValid] = useState(null); // null: default, true: valid, false: invalid
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');


  // Create refs for inputs
  const inputsRef = React.useRef([]);

  // Check if all code entries are filled
  const isCodeComplete = code.every((digit) => digit !== '');

  // Handle input change for each code box
  const handleChange = (value, idx) => {
    const val = value.replace(/[^0-9]/g, '');
    const newCode = [...code];
    
    // Allow clearing the input (empty string) or setting a single digit
    if (val === '') {
      newCode[idx] = '';
    } else {
      newCode[idx] = val[0]; // Take only the first digit
    }
    
    setCode(newCode);
    setIsValid(null); // Reset validation state on new input
    setError(''); // Clear error on new input

    // Auto-focus next input if we have a value and not at the last input
    if (val && idx < CODE_LENGTH - 1) {
      const nextInput = inputsRef.current[idx + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle backspace to move to previous input
  const handleKeyPress = (key, idx) => {
    if (key === 'Backspace' && !code[idx] && idx > 0) {
      const prevInput = inputsRef.current[idx - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, CODE_LENGTH);
    
    if (pastedData.length === 0) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    setIsValid(null); // Reset validation state on paste
    setError(''); // Clear error on paste

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;
    const focusInput = inputsRef.current[focusIndex];
    if (focusInput) {
      focusInput.focus();
    }
  };

  // Submit code
  const handleSubmit = async () => {
    setError('');
    setIsValid(null);
    
    try {
      const codeStr = code.join('');

      const response = await verifyEmail(deliveryAgentData.email, codeStr);

      if (response.success) {
      setTimeout(() => {
        setIsValid(true);
        setShowSuccess(true);
        
        // Delay redirection to show success state
        setTimeout(() => {
            onNext();
          }, REDIRECT_DELAY);
        }, 1000);
      }

    } catch (err) {
      setIsValid(false);
      setError('Verification failed. Please try again.');
    }
  };

  // Resend code
  const handleResend = async () => {
    setError('');
    setIsValid(null);
    try {
      const response = await resendVerificationEmail(deliveryAgentData.email);
      if (response.success) {
        Alert.alert('Success', 'A new verification code has been sent to your email.');
        // Reset the code input
        setCode(Array(CODE_LENGTH).fill(''));
      } else {
        Alert.alert('Error', response.message || 'Failed to resend code. Please try again later.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      Alert.alert('Error', 'Failed to resend code. Please try again later.');
    }
  };

  // Get input styling based on validation state
  const getInputStyle = (idx) => {
    if (isValid === null) {
      return styles.codeInput;
    }
    return isValid
      ? [styles.codeInput, styles.codeInputSuccess]
      : [styles.codeInput, styles.codeInputError];
  };

  // Mask email for display
  const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    return `${localPart.substring(0, 2)}*****@${domain}`;
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
          {/* Email Display */}
          <View style={styles.emailContainer}>
            <Text style={styles.emailLabel}>
              Enter the code sent to
            </Text>
            <Text style={styles.emailText}>
              {maskEmail(deliveryAgentData.email)}
            </Text>
          </View>

          {/* Code Input */}
          <View style={styles.codeContainer}>
            <View style={styles.codeInputs}>
              {code.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => (inputsRef.current[idx] = ref)}
                  style={getInputStyle(idx)}
                  value={digit}
                  onChangeText={(value) => handleChange(value, idx)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
                  onPaste={handlePaste}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  autoFocus={idx === 0}
                  editable={!showSuccess}
                  selectTextOnFocus
                />
              ))}
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Success Message */}
          {showSuccess ? (
            <View style={styles.successContainer}>
              <CheckCircle2 color="#10B981" size={20} />
              <Text style={styles.successText}>
                Verification successful! Redirecting...
              </Text>
            </View>
          ) : null}

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the email?{' '}
            </Text>
            <TouchableOpacity onPress={handleResend} disabled={isLoading || showSuccess}>
              <Text style={[
                styles.resendLink,
                (isLoading || showSuccess) && styles.resendLinkDisabled
              ]}>
                Click to resend
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons - Positioned closer to inputs */}
          <View style={styles.buttonContainer}>
            {/* <CustomButton
              title="Back"
              onPress={onPrev}
              style={[styles.button, styles.backButton]}
              textStyle={styles.backButtonText}
              disabled={isLoading || showSuccess}
            /> */}
            <CustomButton
              title="Verify"
              onPress={handleSubmit}
              loading={isLoading}
              style={[
                styles.button,
                isCodeComplete ? styles.verifyButton : styles.verifyButtonDisabled
              ]}
              disabled={isLoading || showSuccess || !isCodeComplete}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Step2_EmailVerification;
