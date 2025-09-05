import React, { useState } from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { useAuth } from "../../stateManagement/contexts";
import { COLORS, SIZES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles/login.style.js";
import { Button, Input } from "../../components";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LoginSchema = Yup.object().shape({
  password: Yup.string().min(5, "Password Too Short!").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const { height: screenHeight } = Dimensions.get("window");

const LoginScreen = ({}) => {
  const { login, googleSignIn, loading } = useAuth();
  const [obsecureText, setObsecureText] = useState(true);
  const navigation = useNavigation();

  const invalidForm = () => {
    Alert.alert("Invalid Form", "Please provide all required fields", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Continue",
        onPress: () => {},
      },
      { defaultIndex: 1 },
    ]);
  };

  const submissionError = (err) => {
    Alert.alert("Login Error", err, [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Continue",
        onPress: () => {},
      },
      { defaultIndex: 1 },
    ]);
  };

  const handleLogin = async (values) => {
    try {
      const response = await login(values.email, values.password);
      
      // Check if user needs email verification
      if (response && response.data && response.data.user && !response.data.user.emailVerified) {
        // Redirect to email verification for unverified users
        navigation.navigate('EmailVerification', {
          email: response.data.user.email,
          from: 'Login'
        });
      } else {
        // User is verified, proceed to dashboard
        // Navigation will be handled by AuthContext
      } 
    } catch (err) {
      console.log(err);
      submissionError(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      // User is now logged in - navigation will be handled by AuthContext
>>>>>>> 40d4901 (getting things ready for deployment)
    } catch (err) {
      console.log(err);
      submissionError(err);
    }
  };

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
          <Image
            source={require("../../assets/images/bk.png")}
            style={styles.image}
          />
          <Text style={styles.title}>Unlimited Luxurious Products</Text>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values) => handleLogin(values)}
            validateOnMount={true}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              isValid,
              touched,
              setFieldTouched,
            }) => (
              <View style={styles.formContainer}>
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  materialIconName="email"
                  onFocus={() => setFieldTouched("email")}
                  onBlur={() => setFieldTouched("email", "")}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  touched={touched.email}
                  errors={errors.email}
                  wrapperStyles={{
                    marginBottom: 10,
                  }}
                />

                <Input
                  label="Password"
                  secureText={obsecureText}
                  placeholder="Enter your password"
                  materialIconName="lock-outline"
                  onFocus={() => setFieldTouched("password")}
                  onBlur={() => setFieldTouched("password", "")}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  touched={touched.password}
                  errors={errors.password}
                >
                  <TouchableOpacity
                    onPress={() => setObsecureText(!obsecureText)}
                  >
                    <MaterialCommunityIcons
                      name={obsecureText ? "eye-outline" : "eye-off-outline"}
                      size={18}
                      color={COLORS.placeholder}
                    />
                  </TouchableOpacity>
                </Input>

                <Button
                  handler={isValid ? handleSubmit : invalidForm}
                  text={"LOGIN"}
                  isValid={isValid}
                  loader={loading}
                  additionalTextStyles={{
                    letterSpacing: SIZES.xSmall - 4,
                  }}
                />

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign-In Button */}
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  disabled={loading}
                >
                  <Image
                    source={{
                      uri: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    }}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>

>>>>>>> 40d4901 (getting things ready for deployment)
                {/* Link to role selection page */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("RoleSelection")}
                >
                  <Text style={styles.registerText}>
                    Don't have an account? Register
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
