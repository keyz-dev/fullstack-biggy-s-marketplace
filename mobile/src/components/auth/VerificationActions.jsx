import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Button } from '../';
import { COLORS, SIZES } from '../../constants';

const VerificationActions = ({
  error,
  showSuccess,
  successMessage = "Verification successful! Redirecting...",
  onResend,
  onBack,
  onSubmit,
  isCodeComplete,
  loading,
  disabled = false,
  resendText = "Didn't receive the email?",
  resendLinkText = "Click to resend",
  backButtonText = "Back",
  submitButtonText = "Verify",
}) => {
  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Success Message */}
      {showSuccess && (
        <View style={styles.successContainer}>
          <CheckCircle2 size={20} color="#10B981" />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {/* Resend Section */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          {resendText}{" "}
          <TouchableOpacity
            onPress={onResend}
            disabled={loading || disabled}
          >
            <Text style={[
              styles.resendLink,
              (loading || disabled) && styles.resendLinkDisabled
            ]}>
              {resendLinkText}
            </Text>
          </TouchableOpacity>
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          handler={onBack}
          text={backButtonText}
          isValid={true}
          additionalStyles={styles.backButtonStyle}
          additionalTextStyles={styles.backButtonText}
          isDisabled={loading || disabled}
        />
        
        <Button
          handler={onSubmit}
          text={submitButtonText}
          isValid={isCodeComplete}
          loader={loading}
          additionalStyles={[
            styles.submitButton,
            !isCodeComplete && styles.submitButtonDisabled
          ]}
          additionalTextStyles={styles.submitButtonText}
          isDisabled={loading || disabled || !isCodeComplete}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: SIZES.small,
    color: '#EF4444',
    textAlign: 'center',
    fontFamily: 'regular',
    marginBottom: SIZES.medium,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    marginBottom: SIZES.medium,
  },
  successText: {
    fontSize: SIZES.small,
    color: '#10B981',
    fontFamily: 'medium',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xLarge,
  },
  resendText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: 'regular',
  },
  resendLink: {
    color: COLORS.primary,
    fontFamily: 'medium',
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    color: COLORS.lightGray,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.medium,
    paddingHorizontal: SIZES.medium,
  },
  backButtonStyle: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
  },
  backButtonText: {
    color: COLORS.gray,
    fontFamily: 'medium',
    fontSize: SIZES.medium,
  },
  submitButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: 'medium',
    fontSize: SIZES.medium,
  },
});

export default VerificationActions;
