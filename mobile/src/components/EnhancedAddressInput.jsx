// components/EnhancedAddressInput.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation, Search } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../constants';

const EnhancedAddressInput = ({
  value,
  onChange,
  onAddressChange,
  placeholder = "Enter your address",
  style,
  error,
}) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);

  // Handle current location
  const handleCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get your current address.'
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const fullAddress = [
          address.street,
          address.streetNumber,
          address.district,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean).join(', ');

        // Create complete address object
        const addressObject = {
          streetAddress: `${address.street || ''} ${address.streetNumber || ''}`.trim(),
          fullAddress: fullAddress,
          city: address.city || '',
          state: address.region || '',
          country: address.country || 'Cameroon',
          postalCode: address.postalCode || '00000',
          coordinates: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        };

        // Update the address
        if (onAddressChange) {
          onAddressChange(addressObject);
        }
        if (onChange) {
          onChange(fullAddress);
        }
        
        setIsManualInput(false);
      } else {
        Alert.alert('Error', 'Could not find address for your location.');
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Could not get your current location. Please enter your address manually.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle manual text input
  const handleTextChange = (text) => {
    if (onChange) {
      onChange(text);
    }
    
    // If user is typing manually, update the address object with basic info
    if (onAddressChange && text.length > 0) {
      const addressObject = {
        streetAddress: text,
        fullAddress: text,
        city: '', // Will be filled by user or geocoding
        state: '',
        country: 'Cameroon',
        postalCode: '00000',
        coordinates: {
          lat: 0,
          lng: 0,
        },
      };
      onAddressChange(addressObject);
    }
    
    setIsManualInput(true);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Input Field */}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Search size={20} color={COLORS.gray} style={styles.searchIcon} />
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          multiline={false}
          autoCorrect={false}
          autoCapitalize="words"
        />
        
        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Navigation size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Current Location Option */}
      <TouchableOpacity
        style={styles.currentLocationOption}
        onPress={handleCurrentLocation}
        disabled={isLoadingLocation}
      >
        <MapPin size={16} color={COLORS.primary} />
        <Text style={styles.currentLocationText}>
          {isLoadingLocation ? 'Getting your location...' : 'Use current location'}
        </Text>
      </TouchableOpacity>

      {/* Manual Input Indicator */}
      {isManualInput && value.length > 0 && (
        <View style={styles.manualInputIndicator}>
          <Text style={styles.manualInputText}>
            Manual input - coordinates will be set to default
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  searchIcon: {
    marginRight: SIZES.medium * 0.5,
  },
  input: {
    flex: 1,
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    paddingVertical: 0,
  },
  locationButton: {
    padding: SIZES.medium * 0.3,
    marginLeft: SIZES.medium * 0.5,
  },
  currentLocationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.medium * 0.5,
    paddingVertical: SIZES.medium * 0.5,
  },
  currentLocationText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: SIZES.medium * 0.3,
  },
  manualInputIndicator: {
    marginTop: SIZES.medium * 0.3,
    paddingVertical: SIZES.medium * 0.3,
  },
  manualInputText: {
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});

export default EnhancedAddressInput;
