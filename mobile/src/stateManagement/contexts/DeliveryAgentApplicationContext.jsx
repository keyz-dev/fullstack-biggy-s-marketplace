import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authAPI from "../../api/auth";
import { useAuth } from "./AuthContext";
import axios from "axios"
import { API_BASE_URL } from "../../config/apiConfig";

// ==================== TYPES ====================
const STEPS = {
  BASIC_USER_INFO: 1,
  EMAIL_VERIFICATION: 2,
  BUSINESS_INFO: 3,
  SERVICE_AREAS: 4,
  DELIVERY_PREFERENCES: 5,
  CONTACT_INFO: 6,
  BUSINESS_ADDRESS: 7,
  PAYMENT_METHODS: 8,
  DOCUMENTS: 9,
  VEHICLE_IMAGES: 10,
  REVIEW_SUBMIT: 11,
  SUCCESS: 12,
};

// ==================== CONTEXT ====================
const DeliveryAgentApplicationContext = createContext();

export const useDeliveryAgentApplication = () => {
  const context = useContext(DeliveryAgentApplicationContext);
  if (!context) {
    throw new Error(
      "useDeliveryAgentApplication must be used within a DeliveryAgentApplicationProvider"
    );
  }
  return context;
};

// ==================== PROVIDER ====================
export const DeliveryAgentApplicationProvider = ({ children }) => {
  const { user, verifyToken } = useAuth();
  const [activeStep, setActiveStep] = useState(STEPS.BASIC_USER_INFO);
  const [visitedSteps, setVisitedSteps] = useState([STEPS.BASIC_USER_INFO]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [applicationData, setApplicationData] = useState(null);

  const [deliveryAgentData, setDeliveryAgentData] = useState({
    // Step 1: Basic User Information
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    address: {
      streetAddress: "",
      fullAddress: "",
      city: "",
      state: "",
      country: "Cameroon",
      postalCode: "00000",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    avatar: null,

    // Step 3: Business Information
    businessName: "",
    vehicleType: "",
    description: "",
    experience: "",

    // Step 4: Service Areas & Operating Hours
    serviceAreas: [],
    operatingHours: [],

    // Step 5: Delivery Preferences
    deliveryPreferences: {
      maxDeliveryRadius: 50,
      maxPackageWeight: 100,
      maxPackageDimensions: {
        length: 100,
        width: 100,
        height: 100,
      },
      acceptsFragileItems: false,
      acceptsPerishableItems: true,
      acceptsLivestock: false,
    },

    // Step 6: Contact Information
    contactInfo: [],

    // Step 7: Business Address
    businessAddress: {
      streetAddress: "",
      fullAddress: "",
      city: "",
      state: "",
      country: "Cameroon",
      postalCode: "00000",
      coordinates: null,
    },

    // Step 8: Payment Methods
    paymentMethods: [],

    // Step 9: Documents
    documents: [],

    // Step 10: Vehicle Images
    vehicleImages: [],

    // Step 11: Review
    agreedToTerms: false,
  });

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    // Handle return from email verification
    const loadRegistrationContext = async () => {
      try {
        const context = await AsyncStorage.getItem("deliveryAgentRegistrationContext");
        if (context) {
          const { returnStep, visitedSteps: visited } = JSON.parse(context);
          if (returnStep && visited) {
            setActiveStep(returnStep);
            setVisitedSteps(visited);
            // Clean up
            await AsyncStorage.removeItem("deliveryAgentRegistrationContext");
          }
        }
      } catch (error) {
        console.error("Error loading registration context:", error);
      }
    };

    loadRegistrationContext();

    // Handle incomplete_delivery_agent user
    if (user?.role === "incomplete_delivery_agent") {
      setActiveStep(STEPS.BUSINESS_INFO);
      setVisitedSteps([STEPS.BASIC_USER_INFO, STEPS.EMAIL_VERIFICATION]);
    }
  }, [user]);

  // ==================== STEP NAVIGATION ====================
  const nextStep = () => {
    const newStep = Math.min(activeStep + 1, STEPS.SUCCESS);
    if (!visitedSteps.includes(newStep)) {
      setVisitedSteps((prev) => [...prev, newStep]);
    }
    setActiveStep(newStep);
  };

  const prevStep = () => {
    // If user is logged in as incomplete_delivery_agent, don't allow going back to Steps 1 & 2
    if (user && user.role === "incomplete_delivery_agent") {
      setActiveStep((prev) => Math.max(prev - 1, STEPS.BUSINESS_INFO));
    } else {
      setActiveStep((prev) => Math.max(prev - 1, STEPS.BASIC_USER_INFO));
    }
  };

  const goToStep = (step) => {
    // If user is logged in as incomplete_delivery_agent, don't allow going to Steps 1 & 2
    if (
      user &&
      user.role === "incomplete_delivery_agent" &&
      step < STEPS.BUSINESS_INFO
    ) {
      return;
    }

    if (visitedSteps.includes(step) || step <= activeStep) {
      setActiveStep(step);
    }
  };

  // ==================== DATA MANAGEMENT ====================
  const updateField = (field, value) => {
    setDeliveryAgentData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const updateFormData = (stepData) => {
    setDeliveryAgentData((prev) => ({ ...prev, ...stepData }));
  };

  // ==================== STEP SUBMISSIONS ====================
  // Submit Step 1 (Basic User Information)
  const submitStep1 = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', deliveryAgentData.name);
      formData.append('email', deliveryAgentData.email);
      formData.append('password', deliveryAgentData.password);
      formData.append('phone', deliveryAgentData.phoneNumber);
      formData.append('gender', deliveryAgentData.gender);
      formData.append('dob', deliveryAgentData.dob);
      formData.append('address', JSON.stringify(deliveryAgentData.address));

      if( deliveryAgentData.avatar ) {
        // Create proper file object from URI for FormData
        const avatarFile = {
          uri: deliveryAgentData.avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg'
        };
        formData.append('avatar', avatarFile);
      }
    
      // Call initiate registration
      const response = await authAPI.initiateRegistration(
        'delivery_agent', // Role parameter first
        formData
      );

      console.log("response: ", response)

      if (response.success && response.data) {
        // Store registration context for email verification
        await AsyncStorage.setItem(
          "deliveryAgentRegistrationContext",
          JSON.stringify({
            type: "delivery_agent",
            returnUrl: "/register/delivery-agent",
            returnStep: STEPS.BUSINESS_INFO,
            visitedSteps: [STEPS.BASIC_USER_INFO, STEPS.EMAIL_VERIFICATION],
          })
        );

        // Mark Step 2 as visited and redirect to email verification
        setVisitedSteps((prev) => [...prev, STEPS.EMAIL_VERIFICATION]);
        
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || "Failed to submit basic information",
        };
      }
    } catch (error) {

      console.log("this is the error:", error)

      return {
        success: false,
        error: error.message || "Failed to submit basic information",
      };
    } finally {
      setIsLoading(false);
    }
  };

// Submit delivery agent application (Steps 3-11)
const submitDeliveryAgentApplication = async () => {
  setIsLoading(true);
  setErrors({});
  
  try {  
    // Create FormData for file upload
    const formData = new FormData();
    const { street, otherAddress } = deliveryAgentData.businessAddress

    const businessAddress = {
      streetAddress: street,
      ...otherAddress,
    }
    
    // Add only business-related fields (exclude personal information from Step 1)
    formData.append('businessName', deliveryAgentData.businessName || '');
    formData.append('vehicleType', deliveryAgentData.vehicleType || '');
    formData.append('businessDescription', deliveryAgentData.businessDescription || '');
    formData.append('deliveryExperience', deliveryAgentData.deliveryExperience || '');
    formData.append('serviceAreas', JSON.stringify(deliveryAgentData.serviceAreas || []));
    formData.append('operatingHours', JSON.stringify(deliveryAgentData.operatingHours || []));
    formData.append('deliveryPreferences', JSON.stringify(deliveryAgentData.deliveryPreferences || {}));
    formData.append('contactInfo', JSON.stringify(deliveryAgentData.contactInfo || []));
    formData.append('businessAddress', JSON.stringify(businessAddress || {}));
    formData.append('paymentMethods', JSON.stringify(deliveryAgentData.paymentMethods || []));
    formData.append('agreedToTerms', deliveryAgentData.agreedToTerms ? 'true' : 'false');


    // Helper function to process files for FormData (based on handleFarmerRegister.js pattern)
    const processFileForFormData = (file, fieldName) => {
      if (!file || !file.uri) {
        console.log(`Skipping ${fieldName} - no file or URI provided:`, file);
        return null;
      }

      try {
        // Extract filename from URI or use provided name
        const filename = file.name || file.uri.split("/").pop() || `${fieldName}_${Date.now()}.jpg`;
        
        // Determine file type from filename extension or use provided type
        const match = /\.(\w+)$/.exec(filename);
        const extension = match ? match[1].toLowerCase() : 'jpg';
        
        // Validate and set appropriate MIME type
        const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const validDocumentExtensions = ['pdf', 'doc', 'docx', 'txt'];
        
        let fileType;
        if (validImageExtensions.includes(extension)) {
          fileType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
        } else if (validDocumentExtensions.includes(extension)) {
          fileType = file.type || 'application/octet-stream';
        } else {
          fileType = file.type || 'image/jpeg'; // fallback
        }

        const fileObject = {
          uri: file.uri,
          type: fileType,
          name: filename,
        };

        console.log(`Processed ${fieldName}:`, {
          uri: fileObject.uri.substring(0, 50) + '...',
          type: fileObject.type,
          name: fileObject.name
        });

        return fileObject;
      } catch (error) {
        console.error(`Error processing ${fieldName}:`, error);
        return null;
      }
    };

    // Process documents - only include those with files
    const documentsWithFiles = [];
    const documentNames = [];
    
    if (deliveryAgentData.documents && deliveryAgentData.documents.length > 0) {
      
      deliveryAgentData.documents.forEach((doc, index) => {
        if (doc && doc.file) {
          const processedFile = processFileForFormData(doc.file, `document_${doc.documentName || index}`);
          if (processedFile) {
            formData.append('deliveryAgentDocuments', processedFile);
            documentNames.push(doc.documentName || `Document ${index + 1}`);
            documentsWithFiles.push(processedFile);
          }
        }
      });
    }

    // Process vehicle images - only include those with files
    const vehicleImagesWithFiles = [];
    
    if (deliveryAgentData.vehicleImages && deliveryAgentData.vehicleImages.length > 0) {
      
      deliveryAgentData.vehicleImages.forEach((img, index) => {
        if (img && img.file) {
          const processedFile = processFileForFormData(img.file, `vehicle_${img.imageName || index}`);
          if (processedFile) {
            formData.append('vehiclePhotos', processedFile);
            vehicleImagesWithFiles.push(processedFile);
          }
        }
      });  
    }

    // Add document names array that corresponds to uploaded documents
    formData.append('documentNames', JSON.stringify(documentNames));
    
    // Make the API call with better error handling
    const response = await authAPI.registerDeliveryAgent(formData);

    console.log("API Response:", response);

    if (response.success) {
      console.log("Application submitted successfully");
      
      // Clear the registration context
      await AsyncStorage.removeItem("deliveryAgentRegistrationContext");
      
      // Store application data for success page
      setApplicationData(response.data);
      setActiveStep(STEPS.SUCCESS);
      return { success: true, data: response.data };
    } else {
      console.log("Application submission failed:", response.message);
      return {
        success: false,
        error: response.message || "Failed to submit application",
      };
    }
  } catch (error) {
    console.error('Application submission error:', error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to submit delivery agent application";
    
    if (error.message?.includes('Network Error') || error.code === 'NETWORK_ERROR') {
      errorMessage = "Network error - please check your internet connection and server status";
    } else if (error.message?.includes('timeout') || error.code === 'TIMEOUT') {
      errorMessage = "Request timeout - please try again";
    } else if (error.message?.includes('Server error') || error.response?.status >= 500) {
      errorMessage = "Server error - please try again later";
    } else if (error.response?.status === 401) {
      errorMessage = "Authentication failed - please log in again";
    } else if (error.response?.status === 400) {
      errorMessage = error.response.data?.message || "Invalid request data";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Log additional debug information
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    
    return {
      success: false,
      error: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};

  // ==================== STEP VALIDATION ====================
  const isStepCompleted = (step) => {
    if (step > activeStep) return false;

    switch (step) {
      case STEPS.BASIC_USER_INFO:
        // If user is logged in as incomplete_delivery_agent, this step is always completed
        if (user && user.role === "incomplete_delivery_agent") {
          return true;
        }
        return !!(
          deliveryAgentData.name &&
          deliveryAgentData.email &&
          deliveryAgentData.password &&
          deliveryAgentData.confirmPassword &&
          deliveryAgentData.password === deliveryAgentData.confirmPassword
        );

      case STEPS.EMAIL_VERIFICATION:
        // If user is logged in as incomplete_delivery_agent, this step is always completed
        if (user && user.role === "incomplete_delivery_agent") {
          return true;
        }
        return visitedSteps.includes(STEPS.EMAIL_VERIFICATION);

      case STEPS.BUSINESS_INFO:
        return !!(
          deliveryAgentData.vehicleType &&
          deliveryAgentData.description &&
          deliveryAgentData.experience
        );

      case STEPS.SERVICE_AREAS:
        return !!(
          deliveryAgentData.serviceAreas.length > 0 &&
          deliveryAgentData.operatingHours.length > 0
        );

      case STEPS.DELIVERY_PREFERENCES:
        return !!(
          deliveryAgentData.deliveryPreferences.maxDeliveryRadius &&
          deliveryAgentData.deliveryPreferences.maxPackageWeight
        );

      case STEPS.CONTACT_INFO:
        return deliveryAgentData.contactInfo.length > 0;

      case STEPS.BUSINESS_ADDRESS:
        return !!(
          deliveryAgentData.businessAddress?.fullAddress &&
          deliveryAgentData.businessAddress?.coordinates
        );

      case STEPS.PAYMENT_METHODS:
        return deliveryAgentData.paymentMethods.length > 0;

      case STEPS.DOCUMENTS:
        return !!(
          deliveryAgentData.documents.length > 0 &&
          deliveryAgentData.documents.every(doc => doc.documentName.trim())
        );

      case STEPS.VEHICLE_IMAGES:
        return deliveryAgentData.vehicleImages.length >= 3;

      case STEPS.REVIEW_SUBMIT:
        return deliveryAgentData.agreedToTerms;

      default:
        return false;
    }
  };

  // ==================== UTILITIES ====================
  const getStepTitle = (step) => {
    switch (step) {
      case STEPS.BASIC_USER_INFO:
        return "Basic Information";
      case STEPS.EMAIL_VERIFICATION:
        return "Email Verification";
      case STEPS.BUSINESS_INFO:
        return "Business & Vehicle Information";
      case STEPS.SERVICE_AREAS:
        return "Service Areas & Schedule";
      case STEPS.DELIVERY_PREFERENCES:
        return "Delivery Preferences";
      case STEPS.CONTACT_INFO:
        return "Contact Information";
      case STEPS.BUSINESS_ADDRESS:
        return "Business Address";
      case STEPS.PAYMENT_METHODS:
        return "Payment Methods";
      case STEPS.DOCUMENTS:
        return "Documents";
      case STEPS.VEHICLE_IMAGES:
        return "Vehicle Images";
      case STEPS.REVIEW_SUBMIT:
        return "Review & Submit";
      case STEPS.SUCCESS:
        return "Success";
      default:
        return "";
    }
  };

  const getStepSubtitle = (step) => {
    switch (step) {
      case STEPS.BASIC_USER_INFO:
        return "Enter your personal information";
      case STEPS.EMAIL_VERIFICATION:
        return "Verify your email address";
      case STEPS.BUSINESS_INFO:
        return "Tell us about your delivery business";
      case STEPS.SERVICE_AREAS:
        return "Where and when you can deliver";
      case STEPS.DELIVERY_PREFERENCES:
        return "What you can handle";
      case STEPS.CONTACT_INFO:
        return "How customers can reach you";
      case STEPS.BUSINESS_ADDRESS:
        return "Where you operate from";
      case STEPS.PAYMENT_METHODS:
        return "How you get paid";
      case STEPS.DOCUMENTS:
        return "Upload verification documents";
      case STEPS.VEHICLE_IMAGES:
        return "Add photos of your vehicle";
      case STEPS.REVIEW_SUBMIT:
        return "Review and submit for approval";
      case STEPS.SUCCESS:
        return "Application submitted successfully";
      default:
        return "";
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case STEPS.BASIC_USER_INFO:
        return "👤";
      case STEPS.EMAIL_VERIFICATION:
        return "📧";
      case STEPS.BUSINESS_INFO:
        return "🚚";
      case STEPS.SERVICE_AREAS:
        return "📍";
      case STEPS.DELIVERY_PREFERENCES:
        return "⚙️";
      case STEPS.CONTACT_INFO:
        return "📞";
      case STEPS.BUSINESS_ADDRESS:
        return "🏢";
      case STEPS.PAYMENT_METHODS:
        return "💳";
      case STEPS.DOCUMENTS:
        return "📋";
      case STEPS.VEHICLE_IMAGES:
        return "📸";
      case STEPS.REVIEW_SUBMIT:
        return "✅";
      case STEPS.SUCCESS:
        return "🎉";
      default:
        return "";
    }
  };

  // ==================== CONTEXT VALUE ====================
  const value = {
    // State
    activeStep,
    visitedSteps,
    isLoading,
    errors,
    deliveryAgentData,
    applicationData,
    STEPS,

    // Actions
    updateField,
    updateFormData,
    setDeliveryAgentData,
    nextStep,
    prevStep,
    goToStep,
    submitStep1,
    submitDeliveryAgentApplication,

    // Helpers
    getStepTitle,
    getStepSubtitle,
    getStepIcon,
    isStepCompleted,
  };

  return (
    <DeliveryAgentApplicationContext.Provider value={value}>
      {children}
    </DeliveryAgentApplicationContext.Provider>
  );
};

