import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },

  // Loading and Error Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.padding * 2,
  },
  loadingText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    marginTop: SIZES.medium,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.padding * 2,
  },
  errorText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
  },
  retryButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },

  // No Application State Styles
  noApplicationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding * 3,
  },
  noApplicationTitle: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  noApplicationText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.padding * 2,
  },
  submitApplicationButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitApplicationButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.medium,
    paddingTop: SIZES.padding * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    padding: SIZES.small,
    borderRadius: SIZES.small,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.xSmall,
  },
  headerSubtitle: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  refreshButton: {
    padding: SIZES.small,
    borderRadius: SIZES.small,
    backgroundColor: 'transparent',
  },

  // Content Styles
  content: {
    flex: 1,
  },

  // Status Card Styles
  statusCard: {
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
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  statusIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.xSmall,
  },
  statusSubtitle: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  remarksContainer: {
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
  },
  remarksTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  remarksText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 20,
  },
  statusDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SIZES.medium,
  },
  statusDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  statusDetailLabel: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  statusDetailValue: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },

  // Timeline Card Styles
  timelineCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.medium,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  timeline: {
    paddingLeft: SIZES.medium,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.medium,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  timelineIconCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  timelineIconCurrent: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: COLORS.lightGray,
    marginTop: SIZES.small,
  },
  timelineContent: {
    flex: 1,
    paddingTop: SIZES.xSmall,
  },
  timelineTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
  },
  timelineTitleCompleted: {
    color: COLORS.success,
  },
  timelineTitleCurrent: {
    color: COLORS.primary,
  },
  timelineDescription: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 18,
    marginBottom: SIZES.xSmall,
  },
  timelineDate: {
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },

  // Details Card Styles
  detailsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.medium,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsSection: {
    marginBottom: SIZES.medium,
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailsSectionTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SIZES.small,
  },
  detailLabel: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    flex: 1,
  },
  detailValue: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    flex: 1,
    textAlign: 'right',
  },
  documentRow: {
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
    flex: 1,
  },
  documentStatus: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xSmall,
    borderRadius: SIZES.small,
  },
  documentStatusText: {
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    textTransform: 'capitalize',
  },

  // Responsive adjustments
  '@media (max-width: 350)': {
    header: {
      paddingHorizontal: SIZES.small,
    },
    statusCard: {
      marginHorizontal: SIZES.small,
    },
    timelineCard: {
      marginHorizontal: SIZES.small,
    },
    detailsCard: {
      marginHorizontal: SIZES.small,
    },
  },
});

export default styles;
