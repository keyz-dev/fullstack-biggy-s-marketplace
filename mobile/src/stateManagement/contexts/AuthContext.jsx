// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authAPI from "../../api/auth";
import googleAuth from "../../api/googleAuth";
import api from "../../api/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load token and user from AsyncStorage on app start
  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Set default authorization header for API calls
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    };
    loadUserData();
  }, []);

  const setUserAndToken = (user, token) => {
    setUser(user);
    setToken(token);
    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("user", JSON.stringify(user));
    // Set default authorization header for API calls
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      
      // Check if user is verified and has token
      if (response.data && response.data.user && response.data.user.emailVerified && response.data.token) {
        // User is verified - set user and token
        setUserAndToken(response.data.user, response.data.token);
      }
      // If user is not verified, don't set user/token - let login screen handle redirect
      
      return response; // Return response for handling email verification
    } catch (error) {
      throw error; // Error is already handled in authAPI
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
  };

  // Register client directly (complete registration)
  const registerClient = async (formData) => {
    setLoading(true);

    try {
      const response = await authAPI.registerClient(formData);
      if (response.success) {
        setUserAndToken(response.user, response.token);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      throw error; // Error is already handled in authAPI
    } finally {
      setLoading(false);
    }
  };

  // Initiate registration for farmer/delivery agent (incomplete user creation)
  const initiateRegistration = async (role, formData) => {
    setLoading(true);

    try {
      const response = await authAPI.initiateRegistration(role, formData);
      return response; // Don't set user/token yet - user needs email verification
    } catch (error) {
      throw error; // Error is already handled in authAPI
    } finally {
      setLoading(false);
    }
  };

  // Verify email with verification code
  const verifyEmail = async (email, code) => {
    setLoading(true);

    try {
      const response = await authAPI.verifyEmail(email, code);
      if (response.success && response.data.user && response.data.token) {
        setUserAndToken(response.data.user, response.data.token);
      }

      return response;
    } catch (error) {
      throw error; // Error is already handled in authAPI
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email) => {
    setLoading(true);

    try {
      const response = await authAPI.resendVerificationEmail(email);
      return response;
    } catch (error) {
      throw error; // Error is already handled in authAPI
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In (for existing users)
  const googleSignIn = async () => {
    setLoading(true);

    try {
      const response = await googleAuth.signInWithGoogle();
      if (response.success) {
        setUserAndToken(response.user, response.token);
      }
      return response;
    } catch (error) {
      throw error; // Error is already handled in googleAuth
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-Up (for new users)
  const googleSignUp = async (role = 'client') => {
    setLoading(true);

    try {
      const response = await googleAuth.signUpWithGoogle(role);
      if (response.success) {
        setUserAndToken(response.user, response.token);
      }
      return response;
    } catch (error) {
      throw error; // Error is already handled in googleAuth
    } finally {
      setLoading(false);
    }
  };

  // Verify token and update user data
  const verifyToken = async (tokenToVerify = null) => {
    setLoading(true);

    try {
      const token = tokenToVerify || token;
      if (!token) {
        throw new Error('No token provided');
      }

      const response = await authAPI.verifyToken(token);
      if (response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem("user", JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      // If token verification fails, clear user data
      await logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // state
    user,
    token,
    loading,

    // actions
    login,
    logout,
    registerClient,
    initiateRegistration,
    verifyEmail,
    resendVerificationEmail,
    googleSignIn,
    googleSignUp,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
