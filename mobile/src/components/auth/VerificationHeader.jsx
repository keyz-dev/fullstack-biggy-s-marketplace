import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SIZES } from '../../constants';

const VerificationHeader = ({
  title = "Verify Your Account",
  subtitle,
  email,
  onBack,
  showBackButton = true,
  disabled = false,
}) => {
  const maskEmail = (email) => {
    if (!email) return "";
    return email.replace(/(.{2}).+(@.+)/, "$1*****$2");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          disabled={disabled}
        >
          <ArrowLeft size={24} color={disabled ? COLORS.lightGray : COLORS.gray} />
        </TouchableOpacity>
      )}

      {/* Logo/Icon */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>📧</Text>
        </View>
      </View>

      {/* Title and Description */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle}{" "}
            {email && (
              <Text style={styles.emailText}>{maskEmail(email)}</Text>
            )}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: SIZES.xLarge,
  },
  backButton: {
    position: 'absolute',
    top: -50,
    left: -SIZES.large,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SIZES.medium,
  },
  emailText: {
    fontFamily: 'medium',
    color: COLORS.primary,
  },
});

export default VerificationHeader;
