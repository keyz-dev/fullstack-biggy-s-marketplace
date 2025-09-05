// config/apiConfig.js
// API Configuration following consultation reference pattern
// Supports different environments (development, staging, production)

const isProduction = __DEV__ === false; // React Native equivalent of NODE_ENV === 'production'

let API_BASE_URL;

if (isProduction) {
  // Production environment
  API_BASE_URL = process.env.REACT_NATIVE_PRODUCTION_API_URL || 
                 process.env.EXPO_PUBLIC_PRODUCTION_API_URL || 
                 'https://your-production-api.com/api';
} else {
  // Development environment
  API_BASE_URL = process.env.REACT_NATIVE_DEVELOPMENT_API_URL || 
                 process.env.EXPO_PUBLIC_DEVELOPMENT_API_URL || 
                 'http://localhost:5000/api'; // Local development URL
}

// Export configuration
export { API_BASE_URL };

// Default configuration object
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;
