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
    navigationContainer: {
      paddingHorizontal: SIZES.small,
    },
  },
});

export default styles;

