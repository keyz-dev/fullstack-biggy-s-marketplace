import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../stateManagement/contexts";
import { Button } from "../../components";
import { CheckCircle2, ArrowLeft } from "lucide-react-native";
import styles from "./styles/emailVerification.style";

const { height: screenHeight } = Dimensions.get("window");
const CODE_LENGTH = 6;
const REDIRECT_DELAY = 1200; // 1.2 seconds delay

const EmailVerificationScreen = () => {
  const { verifyEmail, resendVerificationEmail, loading } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get email from route params
  const email = route.params?.email || "";
  const from = route.params?.from || "";
  
  // State management
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [isValid, setIsValid] = useState(null); // null: default, true: valid, false: invalid
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(true);
  
  // Refs for input focus management
  const inputRefs = useRef([]);

  useEffect(() => {
    // Validate email parameter
    if (!email) {
      Alert.alert("Error", "No email provided", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
      return;
    }
    setIsLoadingEmail(false);
  }, [email, navigation]);

  // Check if all code entries are filled
  const isCodeComplete = code.every((digit) => digit !== "");

  // Handle input change for each code box
  const handleChange = (value, idx) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    const newCode = [...code];
    
    // Allow clearing the input (empty string) or setting a single digit
    if (sanitizedValue === "") {
      newCode[idx] = "";
    } else {
      newCode[idx] = sanitizedValue[0]; // Take only the first digit
    }
    
    setCode(newCode);
    setIsValid(null); // Reset validation state on new input
    setError(""); // Clear any previous errors
    
    // Move to next input only if we have a value and not at the last input
    if (sanitizedValue && idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // Handle backspace to move to previous input
  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (pastedData) => {
    const sanitizedData = pastedData.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    if (sanitizedData.length === 0) return;

    const newCode = [...code];
    for (let i = 0; i < sanitizedData.length; i++) {
      newCode[i] = sanitizedData[i];
    }
    setCode(newCode);
    setIsValid(null); // Reset validation state on paste
    setError(""); // Clear any previous errors

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  // Submit code
  const handleSubmit = async () => {
    if (!isCodeComplete) return;
    
    setError("");
    try {
      const codeStr = code.join("");
      const response = await verifyEmail(email, codeStr);

      if (response.success) {
        setIsValid(true);
        setShowSuccess(true);

        // Delay redirection to show success state
        setTimeout(() => {
          // Navigate based on user role or return to previous screen
          if (from) {
            navigation.navigate(from);
          } else {
            // Default navigation based on user role
            navigation.navigate("Home");
          }
        }, REDIRECT_DELAY);
      } else {
        setIsValid(false);
        setError("Verification failed");
      }
    } catch (err) {
      setIsValid(false);
      setError(err.message || "Verification failed. Please try again.");
    }
  };

  // Resend code
  const handleResend = async () => {
    setError("");
    setIsValid(null);
    setCode(Array(CODE_LENGTH).fill(""));
    
    try {
      await resendVerificationEmail(email);
      Alert.alert("Success", "A new code has been sent to your email.");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to resend code. Please try again later.");
    }
  };

  // Get input styling based on validation state
  const getInputStyle = () => {
    if (isValid === null) {
      return styles.inputDefault;
    }
    return isValid ? styles.inputSuccess : styles.inputError;
  };

  // Mask email for display
  const maskEmail = (email) => {
    if (!email) return "";
    return email.replace(/(.{2}).+(@.+)/, "$1*****$2");
  };

  if (isLoadingEmail) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.spinner} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading || showSuccess}
            >
              <ArrowLeft size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>📧</Text>
            </View>
          </View>

          {/* Title and Description */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Verify Your Account</Text>
            <Text style={styles.subtitle}>
              Enter the code sent to{" "}
              <Text style={styles.emailText}>{maskEmail(email)}</Text>
            </Text>
          </View>

          {/* Code Input Container */}
          <View style={styles.codeContainer}>
            <View style={styles.codeInputs}>
              {code.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => (inputRefs.current[idx] = ref)}
                  style={[styles.codeInput, getInputStyle()]}
                  value={digit}
                  onChangeText={(value) => handleChange(value, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  keyboardType="numeric"
                  maxLength={1}
                  autoFocus={idx === 0}
                  disabled={showSuccess}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Error Message */}
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {/* Success Message */}
            {showSuccess && (
              <View style={styles.successContainer}>
                <CheckCircle2 size={20} color="#10B981" />
                <Text style={styles.successText}>
                  Verification successful! Redirecting...
                </Text>
              </View>
            )}
          </View>

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the email?{" "}
              <TouchableOpacity
                onPress={handleResend}
                disabled={loading || showSuccess}
              >
                <Text style={styles.resendLink}>Click to resend</Text>
              </TouchableOpacity>
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              handler={() => navigation.goBack()}
              text="Back"
              isValid={true}
              additionalStyles={styles.backButtonStyle}
              additionalTextStyles={styles.backButtonText}
              isDisabled={loading || showSuccess}
            />
            
            <Button
              handler={handleSubmit}
              text="Verify"
              isValid={isCodeComplete}
              loader={loading}
              additionalStyles={[
                styles.verifyButton,
                !isCodeComplete && styles.verifyButtonDisabled
              ]}
              additionalTextStyles={styles.verifyButtonText}
              isDisabled={loading || showSuccess || !isCodeComplete}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmailVerificationScreen;