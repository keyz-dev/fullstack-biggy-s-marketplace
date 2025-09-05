import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../../../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },

  // Header Styles
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.medium * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  headerSubtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 20,
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
    paddingBottom: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginLeft: SIZES.small,
  },

  // Info Row Styles
  infoRow: {
    flexDirection: 'row',
    marginBottom: SIZES.small,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    width: 120,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    flex: 1,
    lineHeight: 20,
  },

  // Address Styles
  addressContainer: {
    marginTop: SIZES.small,
  },
  addressTitle: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginBottom: SIZES.xSmall,
  },
  addressText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 18,
  },

  // Operating Hours Styles
  operatingHoursContainer: {
    marginTop: SIZES.small,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  scheduleDay: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    flex: 1,
  },
  scheduleTime: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },

  // Service Areas Styles
  serviceAreasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.small,
  },
  serviceAreaItem: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xSmall,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
  },
  serviceAreaText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },

  // Contact Info Styles
  contactInfoContainer: {
    marginTop: SIZES.small,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  contactType: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    width: 80,
  },
  contactValue: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    flex: 1,
  },

  // Payment Methods Styles
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.small,
  },
  paymentMethodItem: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xSmall,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
  },
  paymentMethodText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },

  // Documents Styles
  documentsContainer: {
    marginTop: SIZES.small,
  },
  documentsCount: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  documentName: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginLeft: SIZES.small,
  },

  // Vehicle Images Styles
  vehicleImagesContainer: {
    marginTop: SIZES.small,
  },
  vehicleImagesCount: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  vehicleImageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  vehicleImageName: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginLeft: SIZES.small,
  },

  // Terms and Conditions Styles
  termsContainer: {
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
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.small,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  termsText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    textDecorationLine: 'underline',
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
  submitButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  submitButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  // Responsive adjustments
  '@media (max-width: 350)': {
    section: {
      marginHorizontal: SIZES.small,
      padding: SIZES.small,
    },
    header: {
      paddingHorizontal: SIZES.small,
    },
    navigationContainer: {
      paddingHorizontal: SIZES.small,
    },
  },
});

export default styles;
