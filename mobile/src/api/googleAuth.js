// api/googleAuth.js
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import authAPI from './auth';
import GOOGLE_CONFIG from '../config/googleConfig';

/**
 * Google Authentication Service for Mobile
 * Handles Google Sign-In for React Native apps using Expo AuthSession
 * 
 * This works with the same backend endpoints as web:
 * - /auth/google-oauth (login)
 * - /auth/google-signup (signup)
 */

// Complete the auth session in the browser
WebBrowser.maybeCompleteAuthSession();

/**
 * Sign in with Google (for existing users)
 * @returns {Promise} API response with user data and token
 */
export const signInWithGoogle = async () => {
  try {
    // Create a redirect URI for the auth session
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
      scheme: 'new_marketplace', // Your app scheme
    });

    // Create the auth request
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CONFIG.webClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {},
      additionalParameters: {},
      prompt: AuthSession.Prompt.SelectAccount,
    });

    // Start the auth session
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success') {
      // Exchange the authorization code for an access token
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_CONFIG.webClientId,
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        }
      );

      // Send access token to backend
      const response = await authAPI.googleLogin({ 
        access_token: tokenResponse.accessToken 
      });
      return response;
    } else if (result.type === 'cancel') {
      throw 'Sign in was cancelled';
    } else {
      throw 'Google sign in failed';
    }
  } catch (error) {
    if (error.message === 'Sign in was cancelled') {
      throw 'Sign in was cancelled';
    } else {
      throw error.message || 'Google sign in failed';
    }
  }
};

/**
 * Sign up with Google (for new users)
 * @param {string} role - User role ('client', 'farmer', 'delivery_agent')
 * @returns {Promise} API response with user data and token
 */
export const signUpWithGoogle = async (role = 'client') => {
  try {
    // Create a redirect URI for the auth session
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
      scheme: 'new_marketplace', // Your app scheme
    });

    // Create the auth request
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CONFIG.webClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {},
      additionalParameters: {},
      prompt: AuthSession.Prompt.SelectAccount,
    });

    // Start the auth session
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success') {
      // Exchange the authorization code for an access token
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_CONFIG.webClientId,
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        }
      );

      // Send access token and role to backend
      const response = await authAPI.googleSignup({ 
        access_token: tokenResponse.accessToken, 
        role 
      });
      return response;
    } else if (result.type === 'cancel') {
      throw 'Sign up was cancelled';
    } else {
      throw 'Google sign up failed';
    }
  } catch (error) {
    if (error.message === 'Sign up was cancelled') {
      throw 'Sign up was cancelled';
    } else {
      throw error.message || 'Google sign up failed';
    }
  }
};

/**
 * Sign out from Google
 * @returns {Promise} void
 */
export const signOutFromGoogle = async () => {
  try {
    // With Expo AuthSession, we don't need to explicitly sign out from Google
    // The session is managed by the browser and will expire naturally
    console.log('Google sign out completed');
  } catch (error) {
    console.error('Google sign out error:', error);
  }
};

/**
 * Check if user is signed in with Google
 * @returns {Promise<boolean>} true if signed in
 */
export const isSignedInWithGoogle = async () => {
  try {
    // With Expo AuthSession, we can't easily check if user is signed in
    // This would require storing the token and checking its validity
    // For now, return false as we don't persist Google sessions
    return false;
  } catch (error) {
    console.error('Check Google sign in error:', error);
    return false;
  }
};

/**
 * Get current Google user info
 * @returns {Promise} Google user info
 */
export const getCurrentGoogleUser = async () => {
  try {
    // With Expo AuthSession, we don't persist Google user info
    // This would require storing the user data after successful authentication
    return null;
  } catch (error) {
    console.error('Get current Google user error:', error);
    return null;
  }
};

export default {
  signInWithGoogle,
  signUpWithGoogle,
  signOutFromGoogle,
  isSignedInWithGoogle,
  getCurrentGoogleUser,
};
