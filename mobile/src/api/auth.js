// api/auth.js
import api from './config';

/**
 * Authentication API Service
 * Handles all authentication-related API calls following the consultation reference pattern
 * 
 * Flow:
 * 1. Client: /register/client (direct registration)
 * 2. Farmer/Delivery Agent: /register/{role}/initiate (initiate registration)
 * 3. All users: Email verification
 * 4. Farmer/Delivery Agent: Complete application submission
 * 5. Admin review and approval
 */

// ==================== REGISTRATION METHODS ====================

/**
 * Register a client directly (complete registration)
 * @param {Object} formData - Client registration data
 * @returns {Promise} API response
 */
export const registerClient = async (formData) => {
  try {
    const response = await api.post('/auth/register/client', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Initiate registration for farmer or delivery agent (incomplete user creation)
 * @param {string} role - 'farmer' or 'delivery_agent'
 * @param {Object} formData - Basic user information
 * @returns {Promise} API response
 */
export const initiateRegistration = async (role, formData) => {
  try {
    const response = await api.post(`/auth/register/${role}/initiate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// ==================== LOGIN METHODS ====================

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response with user data and token
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Google OAuth login
 * @param {Object} googleData - Google authentication data
 * @returns {Promise} API response
 */
export const googleLogin = async (googleData) => {
  try {
    const response = await api.post('/auth/google-oauth', googleData);
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Google OAuth signup
 * @param {Object} googleData - Google authentication data
 * @returns {Promise} API response
 */
export const googleSignup = async (googleData) => {
  try {
    const response = await api.post('/auth/google-signup', googleData);
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// ==================== APPLICATION SUBMISSION METHODS ====================

/**
 * Submit delivery agent application
 * @param {Object} formData - Complete application data with files
 * @returns {Promise} API response
 */
export const registerDeliveryAgent = async (formData) => {
  try {
    const response = await api.post('/application/delivery-agent', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for file uploads
    });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Submit farmer application
 * @param {Object} formData - Complete application data with files
 * @returns {Promise} API response
 */
export const registerFarmer = async (formData) => {
  try {
    const response = await api.post('/application/farmer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for file uploads
    });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// ==================== EMAIL VERIFICATION METHODS ====================

/**
 * Verify email with verification code
 * @param {string} email - User email
 * @param {string} code - Verification code from email
 * @returns {Promise} API response
 */
export const verifyEmail = async (email, code) => {
  try {
    const response = await api.post('/auth/verify-email', {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise} API response
 */
export const resendVerificationEmail = async (email) => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// ==================== PASSWORD RESET METHODS ====================

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} API response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Reset password with reset token
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise} API response
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// ==================== TOKEN VERIFICATION ====================

/**
 * Verify authentication token
 * @param {string} token - Authentication token
 * @returns {Promise} API response with user data
 */
export const verifyToken = async (token) => {
  try {
    const response = await api.get('/auth/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Handle authentication errors consistently
 * @param {Error} error - API error
 * @returns {string} User-friendly error message
 */
const handleAuthError = (error) => {
  let errorMessage = 'Something went wrong. Please try again.';

  if (error.response) {
    const { status, data } = error.response;
    
    if (data && data.message) {
      errorMessage = data.message;
    } else if (status === 400) {
      errorMessage = 'Invalid data. Please check all fields.';
    } else if (status === 401) {
      errorMessage = 'Invalid credentials. Please try again.';
    } else if (status === 403) {
      errorMessage = 'Access denied. Please contact support.';
    } else if (status === 404) {
      errorMessage = 'User not found. Please check your email.';
    } else if (status === 409) {
      errorMessage = 'User already exists. Please try logging in.';
    } else if (status === 413) {
      errorMessage = 'File too large. Please select a smaller image.';
    } else if (status === 422) {
      errorMessage = 'Invalid verification code. Please try again.';
    } else if (status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
  } else if (error.request) {
    errorMessage = 'Network error. Please check your connection.';
  } else if (error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};

// ==================== EXPORT ALL METHODS ====================

export default {
  // Registration
  registerClient,
  initiateRegistration,
  
  // Application Submission
  registerDeliveryAgent,
  registerFarmer,
  
  // Login
  login,
  googleLogin,
  googleSignup,
  
  // Email Verification
  verifyEmail,
  resendVerificationEmail,
  
  // Password Reset
  forgotPassword,
  resetPassword,
  
  // Token Verification
  verifyToken,
};
