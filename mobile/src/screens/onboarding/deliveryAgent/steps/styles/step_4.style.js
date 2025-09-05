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

  // Service Areas Styles
  currentAreasContainer: {
    marginBottom: SIZES.medium,
  },
  currentAreasTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  areasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.medium,
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
  },
  areaText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    marginRight: SIZES.small,
  },
  removeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Add Area Styles
  addAreaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  areaInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    marginRight: SIZES.medium,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },

  // Collapsible Popular Areas Styles
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  collapsibleTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  collapsibleIcon: {
    transform: [{ rotate: '0deg' }],
  },
  collapsibleIconExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  predefinedAreasContainer: {
    marginTop: SIZES.medium,
  },
  predefinedAreasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.small,
  },
  predefinedAreaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
  },
  predefinedAreaItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  predefinedAreaText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginRight: SIZES.small,
  },
  predefinedAreaTextSelected: {
    color: COLORS.white,
  },

  // Day Selection Styles
  daySelectionContainer: {
    marginBottom: SIZES.medium,
  },
  daySelectionTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  daySelectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.small,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    minWidth: 80,
    justifyContent: 'center',
  },
  dayItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  dayTextSelected: {
    color: COLORS.white,
  },

  // Operating Hours Styles
  hoursContainer: {
    marginTop: SIZES.medium,
  },
  hourItem: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  hourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  dayNameText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputGroup: {
    flex: 1,
    marginHorizontal: SIZES.small,
  },
  timeLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    marginBottom: SIZES.small,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    textAlign: 'center',
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
    predefinedAreasGrid: {
      gap: SIZES.xSmall,
    },
    daySelectionGrid: {
      gap: SIZES.xSmall,
    },
  },
});

export default styles;
