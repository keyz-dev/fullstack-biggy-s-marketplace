import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES } from '../../../constants';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: screenHeight,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    justifyContent: 'center',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingContent: {
    alignItems: 'center',
  },
  spinner: {
    width: 32,
    height: 32,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderTopColor: 'transparent',
    borderRadius: 16,
    marginBottom: SIZES.medium,
  },
  loadingText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontFamily: 'regular',
  },

  // Header
  header: {
    position: 'absolute',
    top: 50,
    left: SIZES.large,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Logo Section
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xLarge,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  logoText: {
    fontSize: 32,
  },

  // Title Section
  titleContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xLarge,
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

  // Code Input Section
  codeContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xLarge,
  },
  codeInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.small,
    marginBottom: SIZES.medium,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.primary,
  },
  inputDefault: {
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  inputSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
    color: '#059669',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
  },

  // Messages
  errorText: {
    fontSize: SIZES.small,
    color: '#EF4444',
    textAlign: 'center',
    fontFamily: 'regular',
    marginTop: SIZES.small,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    marginTop: SIZES.small,
  },
  successText: {
    fontSize: SIZES.small,
    color: '#10B981',
    fontFamily: 'medium',
  },

  // Resend Section
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

  // Button Container
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
  verifyButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  verifyButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  verifyButtonText: {
    color: COLORS.white,
    fontFamily: 'medium',
    fontSize: SIZES.medium,
  },

  // Responsive adjustments
  '@media (max-width: 375)': {
    codeInput: {
      width: 44,
      height: 52,
      fontSize: 22,
    },
    title: {
      fontSize: 24,
    },
  },
});

export default styles;
