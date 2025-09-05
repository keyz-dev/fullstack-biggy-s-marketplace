import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MapPin, Navigation, CheckCircle } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../../../constants';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import MobileMapView from '../../../../components/maps/MobileMapView';
import MobileAddressInput from '../../../../components/maps/MobileAddressInput';
import locationService from '../../../../services/LocationService';

const Step7_BusinessAddress = ({ onNext, onPrev }) => {
  const { deliveryAgentData, updateField, isLoading } = useDeliveryAgentApplication();
  
  const [address, setAddress] = useState(deliveryAgentData.businessAddress?.fullAddress || '');
  const [coordinates, setCoordinates] = useState(deliveryAgentData.businessAddress?.coordinates || null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length >= 3) {
        setSearchLoading(true);
        try {
          const results = await locationService.searchPlaces(query, 'cm', 5);
          setSuggestions(results);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  // Handle address input change
  const handleAddressChange = (value) => {
    setAddress(value);
    debouncedSearch(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion) => {
    try {
      setAddress(suggestion.display_name);
      setSuggestions([]);
      
      const newCoordinates = {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon),
      };
      
      setCoordinates(newCoordinates);
      
      // Extract address components
      const addressComponents = locationService.extractAddressComponents(suggestion);
      
      // Update the form data
      updateField('businessAddress', {
        ...addressComponents,
        coordinates: newCoordinates,
      });
      
    } catch (error) {
      console.error('Error selecting suggestion:', error);
      Alert.alert('Error', 'Failed to select address. Please try again.');
    }
  };

  // Handle map marker drag
  const handleMarkerDrag = async (newCoordinates) => {
    try {
      setCoordinates(newCoordinates);
      
      // Reverse geocode to get address
      const result = await locationService.reverseGeocode(
        newCoordinates.lat,
        newCoordinates.lng
      );
      
      const addressComponents = locationService.extractAddressComponents(result);
      const fullAddress = locationService.createFormattedAddress(addressComponents);
      
      setAddress(fullAddress);
      
      // Update the form data
      updateField('businessAddress', {
        ...addressComponents,
        coordinates: newCoordinates,
      });
      
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      const location = await locationService.getCurrentLocation();
      const newCoordinates = {
        lat: location.latitude,
        lng: location.longitude,
      };
      
      setCoordinates(newCoordinates);
      
      // Try to reverse geocode to get address
      try {
        const result = await locationService.reverseGeocode(
          location.latitude,
          location.longitude
        );
        
        const addressComponents = locationService.extractAddressComponents(result);
        const fullAddress = locationService.createFormattedAddress(addressComponents);
        
        setAddress(fullAddress);
        
        // Update the form data
        updateField('businessAddress', {
          ...addressComponents,
          coordinates: newCoordinates,
        });
        
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed, using coordinates only:', geocodeError);
        
        // Create a basic address from coordinates
        const fallbackAddress = `Location at ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
        setAddress(fallbackAddress);
        
        // Update the form data with basic info
        updateField('businessAddress', {
          streetAddress: '',
          fullAddress: fallbackAddress,
          city: 'Unknown',
          state: 'Unknown',
          country: 'Cameroon',
          postalCode: '00000',
          coordinates: newCoordinates,
        });
        
        Alert.alert(
          'Location Found',
          'Your location has been marked on the map. You can drag the marker to adjust the position or search for a more specific address.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Error getting current location:', error);
      const errorMessage = locationService.getLocationErrorMessage(error);
      Alert.alert('Location Error', errorMessage);
    } finally {
      setLocationLoading(false);
    }
  };

  // Validate form
  useEffect(() => {
    const valid = !!(
      address.trim() &&
      coordinates &&
      deliveryAgentData.businessAddress?.city
    );
    setIsValid(valid);
  }, [address, coordinates, deliveryAgentData.businessAddress]);

  // Handle next step
  const handleNext = () => {
    if (!isValid) {
      Alert.alert(
        'Incomplete Information',
        'Please select a valid business address on the map or enter it manually.'
      );
      return;
    }
    
    onNext();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Business Address</Text>
        <Text style={styles.subtitle}>
          Where do you operate your delivery business from?
        </Text>
      </View>

      {/* Address Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Address</Text>
        <MobileAddressInput
          value={address}
          onChange={handleAddressChange}
          suggestions={suggestions}
          onSuggestionSelect={handleSuggestionSelect}
          searchLoading={searchLoading}
          placeholder="Enter your business address..."
          style={styles.addressInput}
        />
        
        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          disabled={locationLoading}
          activeOpacity={0.7}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Navigation size={16} color={COLORS.white} />
          )}
          <Text style={styles.currentLocationText}>
            {locationLoading ? 'Getting Location...' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select on Map</Text>
        <View style={styles.mapContainer}>
          <MobileMapView
            coordinates={coordinates}
            address={address}
            onMarkerDrag={handleMarkerDrag}
            style={styles.map}
            showUserLocation={true}
            draggable={true}
          />
        </View>
        <Text style={styles.mapHint}>
          Drag the marker to adjust your business location
        </Text>
      </View>

      {/* Address Details */}
      {deliveryAgentData.businessAddress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Details</Text>
          <View style={styles.addressDetails}>
            <View style={styles.addressItem}>
              <MapPin size={16} color={COLORS.primary} />
              <Text style={styles.addressText}>
                {deliveryAgentData.businessAddress.fullAddress}
              </Text>
            </View>
            
            {deliveryAgentData.businessAddress.city && (
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>City:</Text>
                <Text style={styles.addressValue}>
                  {deliveryAgentData.businessAddress.city}
                </Text>
              </View>
            )}
            
            {deliveryAgentData.businessAddress.state && (
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>State:</Text>
                <Text style={styles.addressValue}>
                  {deliveryAgentData.businessAddress.state}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Validation Status */}
      <View style={styles.validationSection}>
        {isValid ? (
          <View style={styles.validStatus}>
            <CheckCircle size={20} color={COLORS.success} />
            <Text style={styles.validText}>Address selected successfully</Text>
          </View>
        ) : (
          <Text style={styles.invalidText}>
            Please select a valid business address
          </Text>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onPrev}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.padding * 0.5,
  },
  subtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 20,
  },
  section: {
    margin: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.semiBold,
    color: COLORS.black,
    marginBottom: SIZES.padding,
  },
  addressInput: {
    marginBottom: SIZES.padding,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding * 0.8,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding * 0.5,
  },
  currentLocationText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    marginLeft: SIZES.padding * 0.5,
  },
  mapContainer: {
    height: 300,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: SIZES.padding * 0.5,
  },
  map: {
    flex: 1,
  },
  mapHint: {
    fontSize: SIZES.font * 0.9,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addressDetails: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding * 0.5,
  },
  addressText: {
    flex: 1,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginLeft: SIZES.padding * 0.5,
    lineHeight: 20,
  },
  addressLabel: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    width: 60,
  },
  addressValue: {
    flex: 1,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  validationSection: {
    margin: SIZES.padding,
    alignItems: 'center',
  },
  validStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightSuccess,
    paddingVertical: SIZES.padding * 0.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  validText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.success,
    marginLeft: SIZES.padding * 0.5,
  },
  invalidText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  backButton: {
    flex: 1,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SIZES.padding * 0.5,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  nextButton: {
    flex: 1,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.padding * 0.5,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  nextButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
});

export default Step7_BusinessAddress;

