import * as Location from 'expo-location';

class LocationService {
  constructor() {
    this.isLocationPermissionGranted = false;
  }

  // Request location permissions
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
      
      this.isLocationPermissionGranted = true;
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      throw error;
    }
  }

  // Get current location
  async getCurrentLocation() {
    try {
      // Check if permission is granted
      if (!this.isLocationPermissionGranted) {
        await this.requestLocationPermission();
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  // Search for places using Nominatim API (same as web version)
  async searchPlaces(query, countryCode = 'cm', limit = 5) {
    try {
      if (!query || query.length < 3) {
        return [];
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=${countryCode}&limit=${limit}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BiggyDeliveryApp/1.0',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          console.warn('Nominatim API rate limited for search');
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      return results || [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  // Reverse geocoding - get address from coordinates
  async reverseGeocode(latitude, longitude) {
    try {
      // Add user agent header to avoid 403 errors
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BiggyDeliveryApp/1.0',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          // If 403, try with a different approach or return fallback
          console.warn('Nominatim API rate limited, using fallback');
          return this.createFallbackAddress(latitude, longitude);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // If no result or empty result, create fallback
      if (!result || !result.display_name) {
        return this.createFallbackAddress(latitude, longitude);
      }
      
      return result;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Return fallback address instead of throwing
      return this.createFallbackAddress(latitude, longitude);
    }
  }

  // Create fallback address when geocoding fails
  createFallbackAddress(latitude, longitude) {
    return {
      display_name: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      address: {
        country: 'Cameroon',
        state: 'Unknown',
        city: 'Unknown',
        road: 'Unknown',
      },
      lat: latitude.toString(),
      lon: longitude.toString(),
    };
  }

  // Extract address components from Nominatim response
  extractAddressComponents(result) {
    if (!result || !result.address) {
      return {
        street: '',
        city: '',
        state: '',
        country: 'Cameroon',
        postalCode: '00000',
        fullAddress: result?.display_name || '',
      };
    }

    const address = result.address;
    
    return {
      street: address.road || address.pedestrian || address.footway || '',
      city: address.city || address.town || address.village || address.hamlet || '',
      state: address.state || address.region || '',
      country: address.country || 'Cameroon',
      postalCode: address.postcode || '00000',
      fullAddress: result.display_name || '',
    };
  }

  // Create formatted address string
  createFormattedAddress(addressComponents) {
    const parts = [
      addressComponents.street,
      addressComponents.city,
      addressComponents.state,
      addressComponents.country,
      addressComponents.postalCode,
    ].filter(Boolean);

    return parts.join(', ');
  }

  // Calculate distance between two coordinates (in kilometers)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  // Convert degrees to radians
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Check if location is within Cameroon bounds
  isWithinCameroon(latitude, longitude) {
    // Approximate Cameroon bounds
    const minLat = 1.6547;
    const maxLat = 13.0833;
    const minLon = 8.4947;
    const maxLon = 16.1921;

    return (
      latitude >= minLat &&
      latitude <= maxLat &&
      longitude >= minLon &&
      longitude <= maxLon
    );
  }

  // Get location error message
  getLocationErrorMessage(error) {
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        return 'Location permission denied. Please enable location access in your device settings.';
      case 2: // POSITION_UNAVAILABLE
        return 'Location information is unavailable. Please check your GPS settings.';
      case 3: // TIMEOUT
        return 'Location request timed out. Please try again.';
      default:
        return 'Unable to get your location. Please try again or enter address manually.';
    }
  }
}

// Create and export a singleton instance
const locationService = new LocationService();
export default locationService;

