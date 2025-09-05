import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../../../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.padding,
  },

  // Section Styles
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginLeft: SIZES.medium,
  },
  sectionSubtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.medium,
    lineHeight: 20,
  },

  // Slider Styles
  sliderContainer: {
    marginBottom: SIZES.medium,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  sliderTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  sliderValue: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginBottom: SIZES.small,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  sliderLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },

  // Package Dimensions Styles
  dimensionsContainer: {
    marginBottom: SIZES.medium,
  },
  dimensionsTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  dimensionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.small,
  },
  dimensionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  dimensionLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.small,
  },

  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SIZES.medium,
  },
  toggleTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  toggleDescription: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 16,
  },
  toggleSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },

  // Preference Card Styles
  preferenceCard: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  preferenceCardActive: {
    backgroundColor: '#E8F5E8',
    borderColor: COLORS.primary,
  },
  preferenceIcon: {
    marginBottom: SIZES.small,
  },
  preferenceTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  preferenceDescription: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 16,
  },

  // Summary Styles
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginTop: SIZES.medium,
  },
  summaryTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  summaryLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },

  // Navigation Styles
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.medium * 2,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  prevButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  prevButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  nextButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  nextButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },

  // Responsive adjustments
  '@media (max-width: 350)': {
    section: {
      marginHorizontal: SIZES.small,
      padding: SIZES.small,
    },
    sectionTitle: {
      fontSize: SIZES.h4,
    },
    dimensionsGrid: {
      flexDirection: 'column',
      gap: SIZES.small,
    },
  },
});

export default styles;
