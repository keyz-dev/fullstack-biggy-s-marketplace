import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  style = {},
  inputStyle = {},
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  label: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.padding * 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    minHeight: 50,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: SIZES.padding * 0.3,
  },
});

export default CustomInput;
