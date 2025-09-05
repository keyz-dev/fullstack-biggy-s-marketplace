import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../../../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.padding,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 2, // Reduced top padding to bring content closer to progress indicators
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.h1,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.body3,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },

  // Email Display Styles
  emailContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  emailLabel: {
    fontSize: SIZES.body3,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.base / 2,
  },
  emailText: {
    fontSize: SIZES.body2,
    fontFamily: FONTS.semiBold,
    color: COLORS.black,
    textAlign: 'center',
  },

  // Code Input Styles
  codeContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  codeInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.base,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    fontSize: SIZES.h1, // Increased font size from h2 to h1
    fontFamily: FONTS.semiBold,
    color: COLORS.black,
    textAlign: 'center',
    textAlignVertical: 'center', // Center text vertically on Android
    includeFontPadding: false, // Remove extra padding on Android
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  codeInputSuccess: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
    color: COLORS.success,
  },
  codeInputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
    color: COLORS.error,
  },

  // Error and Success Styles
  errorText: {
    fontSize: SIZES.body4,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.base,
    gap: SIZES.base / 2,
  },
  successText: {
    fontSize: SIZES.body3,
    fontFamily: FONTS.medium,
    color: COLORS.success,
  },

  // Resend Styles
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding * 4, // Further increased margin to add more gap between inputs and buttons
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: SIZES.body4,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  resendLink: {
    fontSize: SIZES.body4,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    color: COLORS.lightGray,
    textDecorationLine: 'none',
  },

  // Button Styles - Positioned with proper gap from inputs
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SIZES.base,
    marginTop: SIZES.padding * 3, // Further increased margin to add more gap between inputs and buttons
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  backButtonText: {
    fontSize: SIZES.body2,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
  },
  verifyButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },

  // Responsive adjustments
  '@media (max-width: 350)': {
    codeInput: {
      width: 45,
      height: 45,
      fontSize: SIZES.h2, // Keep larger font size even on smaller screens
    },
    codeInputs: {
      gap: SIZES.base / 2,
    },
  },
});

export default styles;
