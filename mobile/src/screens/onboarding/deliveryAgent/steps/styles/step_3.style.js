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
    paddingTop: SIZES.padding, // Further reduced top padding to bring content closer to progress indicators
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding, // Reduced gap between progress indicators and header
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

  // Text Area Styles
  textAreaContainer: {
    marginBottom: SIZES.padding,
  },
  label: {
    fontSize: SIZES.body2,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SIZES.base,
  },
  characterCount: {
    fontSize: SIZES.body4,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: SIZES.base / 4, // Reduced gap between textarea and character counter
  },

  // Button Styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SIZES.padding, // Increased gap between buttons
    marginTop: SIZES.padding * 2, // Reduced margin to bring buttons up
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
  continueButton: {
    backgroundColor: COLORS.primary,
  },

  // Responsive adjustments
  '@media (max-width: 350)': {
    formContainer: {
      paddingTop: SIZES.padding * 3,
    },
    title: {
      fontSize: SIZES.h2,
    },
  },
});

export default styles;
