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

  // Contact List Styles
  contactListContainer: {
    marginBottom: SIZES.medium,
  },
  contactItem: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F8FF',
  },
  contactInfo: {
    flex: 1,
    marginRight: SIZES.medium,
  },
  contactType: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textTransform: 'uppercase',
    marginBottom: SIZES.small,
  },
  contactValue: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  contactIcon: {
    marginRight: SIZES.medium,
  },
  removeButton: {
    backgroundColor: '#FFE6E6',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Add Contact Styles
  addContactContainer: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  addContactText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: SIZES.small,
  },

  // Contact Form Styles
  contactFormContainer: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  formTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  typeSelector: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    marginRight: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  typeSelectorText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  valueInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.white,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.medium,
  },
  cancelButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.lightGray,
  },
  cancelButtonText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  saveButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },

  // Type Options Styles
  typeOptionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  typeOption: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  typeOptionLast: {
    borderBottomWidth: 0,
  },
  typeOptionText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
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
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  summaryIcon: {
    marginRight: SIZES.small,
  },
  summaryText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
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
    formRow: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    typeSelector: {
      marginRight: 0,
      marginBottom: SIZES.small,
    },
  },
});

export default styles;
