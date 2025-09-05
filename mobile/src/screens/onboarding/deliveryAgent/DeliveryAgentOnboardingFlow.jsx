import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../../constants';
import { useDeliveryAgentApplication } from '../../../stateManagement/contexts/DeliveryAgentApplicationContext';

// Import step components
import Step1_BasicInfo from './steps/Step1_BasicInfo';
import Step2_EmailVerification from './steps/Step2_EmailVerification';
import Step3_BusinessInfo from './steps/Step3_BusinessInfo';
import Step4_ServiceAreas from './steps/Step4_ServiceAreas';
import Step5_DeliveryPreferences from './steps/Step5_DeliveryPreferences';
import Step6_ContactInfo from './steps/Step6_ContactInfo';
import Step7_BusinessAddress from './steps/Step7_BusinessAddress';
import Step8_PaymentMethods from './steps/Step8_PaymentMethods';
import Step9_Documents from './steps/Step9_Documents';
import Step10_VehicleImages from './steps/Step10_VehicleImages';
import Step11_ReviewSubmit from './steps/Step11_ReviewSubmit';
import Step12_Success from './steps/Step12_Success';

const DeliveryAgentOnboardingFlow = ({ navigation }) => {
  const {
    activeStep,
    visitedSteps,
    isLoading,
    STEPS,
    getStepTitle,
    getStepSubtitle,
    getStepIcon,
    isStepCompleted,
    nextStep,
    prevStep,
    goToStep,
  } = useDeliveryAgentApplication();

  const [currentStep, setCurrentStep] = useState(activeStep);

  // Update current step when activeStep changes
  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep]);

  // Handle step navigation
  const handleNext = () => {
    if (currentStep === STEPS.SUCCESS) {
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (currentStep > STEPS.BASIC_USER_INFO) {
      prevStep();
    } else {
      navigation.goBack();
    }
  };

  const handleStepPress = (step) => {
    if (visitedSteps.includes(step) || step <= currentStep) {
      goToStep(step);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.BASIC_USER_INFO:
        return <Step1_BasicInfo onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.EMAIL_VERIFICATION:
        return <Step2_EmailVerification onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.BUSINESS_INFO:
        return <Step3_BusinessInfo onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.SERVICE_AREAS:
        return <Step4_ServiceAreas onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.DELIVERY_PREFERENCES:
        return <Step5_DeliveryPreferences onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.CONTACT_INFO:
        return <Step6_ContactInfo onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.BUSINESS_ADDRESS:
        return <Step7_BusinessAddress onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.PAYMENT_METHODS:
        return <Step8_PaymentMethods onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.DOCUMENTS:
        return <Step9_Documents onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.VEHICLE_IMAGES:
        return <Step10_VehicleImages onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.REVIEW_SUBMIT:
        return <Step11_ReviewSubmit onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.SUCCESS:
        return <Step12_Success onNext={handleNext} onPrev={handlePrev} />;
      
      // Add other steps here as we create them
      default:
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Step {currentStep} - {getStepTitle(currentStep)}
            </Text>
            <Text style={styles.placeholderSubtext}>
              {getStepSubtitle(currentStep)}
            </Text>
          </View>
        );
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    // Show only current step and 2 steps on each side for better spacing
    const allSteps = [
      STEPS.BASIC_USER_INFO,
      STEPS.EMAIL_VERIFICATION,
      STEPS.BUSINESS_INFO,
      STEPS.SERVICE_AREAS,
      STEPS.DELIVERY_PREFERENCES,
      STEPS.CONTACT_INFO,
      STEPS.BUSINESS_ADDRESS,
      STEPS.PAYMENT_METHODS,
      STEPS.DOCUMENTS,
      STEPS.VEHICLE_IMAGES,
      STEPS.REVIEW_SUBMIT,
      STEPS.SUCCESS,
    ];
    
    const currentIndex = allSteps.indexOf(currentStep);
    const startIndex = Math.max(0, currentIndex - 2);
    const endIndex = Math.min(allSteps.length - 1, currentIndex + 2);
    const steps = allSteps.slice(startIndex, endIndex + 1);

    return (
      <View style={styles.stepIndicator}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stepIndicatorContent}
        >
          {steps.map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = isStepCompleted(step);
            const isVisited = visitedSteps.includes(step);
            const canNavigate = isVisited || step <= currentStep;

            return (
              <TouchableOpacity
                key={step}
                style={[
                  styles.stepItem,
                  isActive && styles.stepItemActive,
                  isCompleted && styles.stepItemCompleted,
                ]}
                onPress={() => canNavigate && handleStepPress(step)}
                disabled={!canNavigate}
                activeOpacity={canNavigate ? 0.7 : 1}
              >
                <View style={[
                  styles.stepIconContainer,
                  isActive && styles.stepIconContainerActive,
                  isCompleted && styles.stepIconContainerCompleted
                ]}>
                  {isCompleted ? (
                    <CheckCircle size={18} color={COLORS.white} />
                  ) : (
                    <Text style={[
                      styles.stepIconText,
                      isActive && styles.stepIconTextActive
                    ]}>
                      {getStepIcon(step)}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepTitle,
                    isActive && styles.stepTitleActive,
                    isCompleted && styles.stepTitleCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {getStepTitle(step)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handlePrev}
          disabled={isLoading}
        >
          <ArrowLeft size={28} color={COLORS.black} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {getStepTitle(currentStep)}
          </Text>
          <Text style={styles.headerSubtitle}>
            {getStepSubtitle(currentStep)}
          </Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      {currentStep !== STEPS.SUCCESS && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep - 1) / (STEPS.SUCCESS - 2)) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep - STEPS.BASIC_USER_INFO + 1} of {STEPS.SUCCESS - STEPS.BASIC_USER_INFO}
          </Text>
        </View>
      )}

      {/* Step Indicator */}
      {currentStep !== STEPS.SUCCESS && renderStepIndicator()}

      {/* Step Content */}
      <View style={styles.content}>
        {renderStepContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.medium * 1.5,
    paddingTop: SIZES.padding * 2, // Added top padding to move header away from device edge
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    left: SIZES.medium,
    padding: SIZES.medium * 0.5,
    borderRadius: SIZES.small,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 60, // Same width as back button to center content
  },
  headerTitle: {
    fontSize: SIZES.xLarge + 4,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: SIZES.small + 2,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    opacity: 0.8,
    textAlign: 'center',
  },
  stepIndicator: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepIndicatorContent: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium * 0.6, // Reduced vertical padding
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    marginHorizontal: SIZES.medium * 0.4,
    paddingVertical: SIZES.medium * 0.8,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
    minWidth: 100,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  stepItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  stepItemCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium * 0.5,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  stepIconContainerActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepIconContainerCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepIconText: {
    fontSize: 14,
  },
  stepIconTextActive: {
    color: COLORS.white,
  },
  stepTitle: {
    fontSize: SIZES.xSmall + 1,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 14,
  },
  stepTitleActive: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: SIZES.xSmall + 1,
  },
  stepTitleCompleted: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: SIZES.xSmall + 1,
  },
  progressBarContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium * 0.2, // Further reduced vertical padding
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginBottom: SIZES.medium * 0.3, // Reduced margin between progress bar and text
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium * 2,
  },
  placeholderText: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  placeholderSubtext: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DeliveryAgentOnboardingFlow;
