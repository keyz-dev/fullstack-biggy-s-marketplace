import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.medium * 2,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.medium * 0.5,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  datePickerText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  placeholderText: {
    color: COLORS.placeholder,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    minHeight: 50,
  },
  errorText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: SIZES.medium * 0.3,
  },
  buttonContainer: {
    marginTop: SIZES.medium * 2,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
  },
  pickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    margin: SIZES.medium,
    minWidth: 280,
  },
  pickerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  pickerOptionText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  checkmark: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  pickerCancel: {
    padding: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.medium * 0.5,
  },
  pickerCancelText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
});

export default styles;
