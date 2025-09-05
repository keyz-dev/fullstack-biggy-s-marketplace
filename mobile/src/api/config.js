// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG, { API_BASE_URL } from '../config/apiConfig';

// Export the dynamic API base URL
export { API_BASE_URL };

// Log the configuration for debugging
console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  config: API_CONFIG
});

const api = axios.create(API_CONFIG);

// Add a request interceptor for authentication and logging
api.interceptors.request.use(
  async (config) => {
    // Add authentication token if available
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the exact URL being accessed
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data ? 'Data present' : 'No data',
      hasAuth: !!config.headers.Authorization
    });
    
    return config;
  },
  (error) => {
    console.log('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      fullURL: `${response.config.baseURL}${response.config.url}`,
      data: response.data ? 'Data received' : 'No data'
    });
    return response;
  },
  (error) => {
    // Log detailed error information
    console.log('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown',
      message: error.message,
      code: error.code,
      networkError: !error.response ? 'Network Error - Server unreachable' : 'Server responded with error'
    });
    
    // Handle common errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - token may be expired');
    }
    return Promise.reject(error);
  }
);

export default api;
