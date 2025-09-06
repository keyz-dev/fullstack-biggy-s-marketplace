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
      
      // Check if user has token (email verification is not required for login)
      if (response.data && response.data.user && response.data.token) {
        // User is logged in - set user and token
        setUserAndToken(response.data.user, response.data.token);
      }
      
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

  const registerFarmer   = async (formData) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/register/farmer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      });

      if (res.data.success) {
        setUserAndToken(res.data.user, res.data.token);
      } else {
        throw new Error(res.data.message || "Registration failed");
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 413) {
          errorMessage = "File too large. Please select a smaller image.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data. Please check all fields.";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data (without loading state)
  const refreshUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await authAPI.verifyToken(token);
      if (response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem("user", JSON.stringify(response.user));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
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
    registerFarmer,
    initiateRegistration,
    verifyEmail,
    resendVerificationEmail,
    googleSignIn,
    googleSignUp,
    verifyToken,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
