// config/googleConfig.js
// Google OAuth Configuration for Expo AuthSession
// Note: In production, these should be environment variables

const GOOGLE_CONFIG = {
  // Web Client ID - same as your web app
  // This is used by your backend for token validation
  // You need to get this from Google Cloud Console
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '136561450696-k4h3glreqc50de61u09kbd6tr4t1b7pe.apps.googleusercontent.com',
  
  // Scopes for Google OAuth
  scopes: ['openid', 'profile', 'email'],
  
  // Additional configuration for Expo AuthSession
  redirectUri: 'https://auth.expo.io/@anonymous/new_marketplace', // Updated for your app
};

export default GOOGLE_CONFIG;
