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

  // Image List Styles
  imageListContainer: {
    marginBottom: SIZES.medium,
  },
  imageItem: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  imageItemUploaded: {
    borderColor: COLORS.success,
    backgroundColor: '#F0F8F0',
  },
  imageItemRequired: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  imageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  imageInfo: {
    flex: 1,
    marginRight: SIZES.medium,
  },
  imageName: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  imageDescription: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 16,
  },
  imageStatus: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xSmall,
    borderRadius: SIZES.xSmall,
  },
  statusRequired: {
    backgroundColor: '#FFE6E6',
  },
  statusUploaded: {
    backgroundColor: '#E6F7E6',
  },
  statusText: {
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.medium,
  },
  statusTextRequired: {
    color: '#FF4444',
  },
  statusTextUploaded: {
    color: '#4CAF50',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.small,
  },
  actionButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
  },
  replaceButton: {
    backgroundColor: COLORS.lightGray,
  },
  removeButton: {
    backgroundColor: '#FFE6E6',
  },
  clearButton: {
    backgroundColor: '#FFF3CD',
  },
  actionButtonText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
  },
  uploadButtonText: {
    color: COLORS.white,
  },
  replaceButtonText: {
    color: COLORS.black,
  },
  removeButtonText: {
    color: '#FF4444',
  },
  clearButtonText: {
    color: '#856404',
  },

  // Image Preview Styles
  imagePreview: {
    marginTop: SIZES.medium,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  previewTitle: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  changeFileButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xSmall,
    borderRadius: SIZES.xSmall,
  },
  changeFileButtonText: {
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
  },
  previewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewFileName: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    flex: 1,
  },
  previewFileSize: {
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },

  // Add Image Styles
  addImageContainer: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  addImageText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: SIZES.small,
  },

  // Image Form Styles
  imageFormContainer: {
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
  imageNameInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.white,
  },
  imageTypeSelector: {
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
  imageTypeSelectorText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
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

  // Upload Options Styles
  uploadOptionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.medium,
    borderTopRightRadius: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  uploadOptionLast: {
    borderBottomWidth: 0,
  },
  uploadOptionText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginLeft: SIZES.medium,
  },

  // Progress Styles
  progressContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginTop: SIZES.medium,
  },
  progressTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  progressIcon: {
    marginRight: SIZES.small,
  },
  progressText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },

  // Instructions Styles
  instructionsContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  instructionsTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.small,
  },
  instructionBullet: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginRight: SIZES.small,
    marginTop: 2,
  },
  instructionText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    flex: 1,
    lineHeight: 16,
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
  },
});

export default styles;
