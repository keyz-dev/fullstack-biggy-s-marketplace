import React, { useRef, useEffect } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const CodeInput = ({
  value,
  onChangeText,
  onKeyPress,
  isActive,
  isValid,
  disabled,
  autoFocus = false,
  style,
  ...props
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && isActive) {
      inputRef.current?.focus();
    }
  }, [autoFocus, isActive]);

  const getInputStyle = () => {
    if (isValid === true) {
      return styles.inputSuccess;
    } else if (isValid === false) {
      return styles.inputError;
    }
    return styles.inputDefault;
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={inputRef}
        style={[styles.input, getInputStyle()]}
        value={value}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        keyboardType="numeric"
        maxLength={1}
        selectTextOnFocus
        disabled={disabled}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles if needed
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.primary,
  },
  inputDefault: {
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  inputSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
    color: '#059669',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
  },
});

export default CodeInput;
