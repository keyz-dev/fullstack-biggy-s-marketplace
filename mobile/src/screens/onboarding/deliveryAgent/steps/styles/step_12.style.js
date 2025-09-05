import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../../../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },

  // Loading Styles
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

  // Success Header Styles
  successHeader: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 2,
    marginBottom: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIconContainer: {
    marginBottom: SIZES.medium,
  },
  successTitle: {
    fontSize: SIZES.h1,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  successSubtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SIZES.medium,
  },

  // Application Card Styles
  applicationCard: {
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
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  applicationIdContainer: {
    flex: 1,
  },
  applicationIdLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
  },
  applicationId: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  refreshButton: {
    padding: SIZES.small,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.lightWhite,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPrimary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.large,
    marginBottom: SIZES.small,
  },
  statusText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: SIZES.small,
  },
  estimatedTime: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  applicationDetails: {
    marginTop: SIZES.medium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
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

  // Next Steps Card Styles
  nextStepsCard: {
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
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.medium,
    position: 'relative',
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  timelineIconCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  timelineIconCurrent: {
    backgroundColor: COLORS.lightPrimary,
    borderColor: COLORS.primary,
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
  },

  // Info Card Styles
  infoCard: {
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
  infoList: {
    marginTop: SIZES.small,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.medium,
  },
  infoText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 20,
    marginLeft: SIZES.small,
    flex: 1,
  },

  // Action Buttons Styles
  actionButtons: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginLeft: SIZES.small,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.medium,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homeButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginLeft: SIZES.small,
  },

  // Responsive adjustments
  '@media (max-width: 350)': {
    successHeader: {
      paddingHorizontal: SIZES.small,
    },
    applicationCard: {
      marginHorizontal: SIZES.small,
    },
    nextStepsCard: {
      marginHorizontal: SIZES.small,
    },
    infoCard: {
      marginHorizontal: SIZES.small,
    },
    actionButtons: {
      paddingHorizontal: SIZES.small,
    },
  },
});

export default styles;
