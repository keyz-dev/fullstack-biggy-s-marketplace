import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, SIZES } from '../../constants';

const MobileMapView = ({
  coordinates,
  address,
  center,
  zoom = 11,
  markers = [],
  onMarkerDrag,
  onRegionChange,
  style,
  showUserLocation = true,
  draggable = true,
}) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);

  // Default center (Douala, Cameroon)
  const defaultCenter = {
    latitude: 4.0511,
    longitude: 9.7679,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Calculate region from coordinates or center
  const calculateRegion = () => {
    if (coordinates) {
      return {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    
    if (center) {
      return {
        latitude: center[0],
        longitude: center[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    
    return defaultCenter;
  };

  useEffect(() => {
    const newRegion = calculateRegion();
    setRegion(newRegion);
    
    // Animate to new region if map is ready
    if (mapRef.current && coordinates) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [coordinates, center]);

  const handleMarkerDrag = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newCoordinates = { lat: latitude, lng: longitude };
    
    if (onMarkerDrag) {
      onMarkerDrag(newCoordinates);
    }
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    if (onRegionChange) {
      onRegionChange(newRegion);
    }
  };

  const renderMarkers = () => {
    if (markers.length > 0) {
      return markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: marker.position[0],
            longitude: marker.position[1],
          }}
          title={marker.popup || `Marker ${index + 1}`}
          draggable={draggable}
          onDragEnd={handleMarkerDrag}
        />
      ));
    }
    
    if (coordinates) {
      return (
        <Marker
          coordinate={{
            latitude: coordinates.lat,
            longitude: coordinates.lng,
          }}
          title={address || "Selected Location"}
          draggable={draggable}
          onDragEnd={handleMarkerDrag}
        />
      );
    }
    
    return null;
  };

  if (!region) {
    return <View style={[styles.container, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
        loadingEnabled={true}
        loadingIndicatorColor={COLORS.primary}
        loadingBackgroundColor={COLORS.lightWhite}
      >
        {renderMarkers()}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  map: {
    flex: 1,
    borderRadius: SIZES.radius,
  },
});

export default MobileMapView;

