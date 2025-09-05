import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../../constants';

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

  // Payment Method List Styles
  paymentListContainer: {
    marginBottom: SIZES.medium,
  },
  paymentItem: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    position: 'relative',
  },
  paymentItemPrimary: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F8FF',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  paymentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentTypeIcon: {
    marginRight: SIZES.small,
  },
  paymentTypeText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  primaryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xSmall,
    borderRadius: SIZES.xSmall,
  },
  primaryBadgeText: {
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  paymentDetails: {
    marginBottom: SIZES.medium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  detailLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    flex: 1,
  },
  detailValue: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    flex: 2,
    textAlign: 'right',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.small,
  },
  actionButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.lightGray,
  },
  dangerButton: {
    backgroundColor: '#FFE6E6',
  },
  actionButtonText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.black,
  },
  dangerButtonText: {
    color: '#FF4444',
  },

  // Add Payment Method Styles
  addPaymentContainer: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  addPaymentText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: SIZES.small,
  },

  // Payment Form Styles
  paymentFormContainer: {
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
    marginBottom: SIZES.medium,
  },
  formLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  typeSelector: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeSelectorText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.white,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    gap: SIZES.small,
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  accountTypeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  accountTypeText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  accountTypeTextSelected: {
    color: COLORS.white,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeOptionLast: {
    borderBottomWidth: 0,
  },
  typeOptionText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginLeft: SIZES.small,
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

  // Responsive adjustments
  '@media (max-width: 350)': {
    section: {
      marginHorizontal: SIZES.small,
      padding: SIZES.small,
    },
    sectionTitle: {
      fontSize: SIZES.h4,
    },
    accountTypeContainer: {
      flexDirection: 'column',
    },
  },
});

export default styles;

