import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style = {},
  textStyle = {},
  variant = 'primary', // primary, secondary, outline
  size = 'large', // small, medium, large
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondary);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outline);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineText);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? COLORS.primary : COLORS.white} 
          size="small" 
        />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  large: {
    height: 56,
    paddingHorizontal: SIZES.padding * 2,
  },
  medium: {
    height: 48,
    paddingHorizontal: SIZES.padding * 1.5,
  },
  small: {
    height: 40,
    paddingHorizontal: SIZES.padding,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabled: {
    backgroundColor: COLORS.gray2,
    borderColor: COLORS.gray2,
  },
  text: {
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  largeText: {
    fontSize: SIZES.font + 2,
  },
  mediumText: {
    fontSize: SIZES.font,
  },
  smallText: {
    fontSize: SIZES.small,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  outlineText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: COLORS.gray,
  },
});

export default CustomButton;
