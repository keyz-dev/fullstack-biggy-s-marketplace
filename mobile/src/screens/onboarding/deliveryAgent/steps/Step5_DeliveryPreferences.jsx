import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import { Settings, Package, Truck, Shield, Leaf, Heart } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../../../constants';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import styles from './styles/step_5.style';

const { width: screenWidth } = Dimensions.get('window');

const Step5_DeliveryPreferences = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    updateField,
    isLoading,
    errors,
  } = useDeliveryAgentApplication();

  const [preferences, setPreferences] = useState({
    maxDeliveryRadius: deliveryAgentData.deliveryPreferences?.maxDeliveryRadius || 50,
    maxPackageWeight: deliveryAgentData.deliveryPreferences?.maxPackageWeight || 100,
    maxPackageDimensions: {
      length: deliveryAgentData.deliveryPreferences?.maxPackageDimensions?.length || 100,
      width: deliveryAgentData.deliveryPreferences?.maxPackageDimensions?.width || 100,
      height: deliveryAgentData.deliveryPreferences?.maxPackageDimensions?.height || 100,
    },
    acceptsFragileItems: deliveryAgentData.deliveryPreferences?.acceptsFragileItems || false,
    acceptsPerishableItems: deliveryAgentData.deliveryPreferences?.acceptsPerishableItems || true,
    acceptsLivestock: deliveryAgentData.deliveryPreferences?.acceptsLivestock || false,
  });

  const [sliderValues, setSliderValues] = useState({
    radius: preferences.maxDeliveryRadius,
    weight: preferences.maxPackageWeight,
  });

  // Update preferences when slider values change
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      maxDeliveryRadius: sliderValues.radius,
      maxPackageWeight: sliderValues.weight,
    }));
  }, [sliderValues]);

  const handleSliderChange = (type, value) => {
    setSliderValues(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = parseInt(value) || 0;
    setPreferences(prev => ({
      ...prev,
      maxPackageDimensions: {
        ...prev.maxPackageDimensions,
        [dimension]: numValue,
      },
    }));
  };

  const handleToggleChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    // Validation
    if (preferences.maxDeliveryRadius < 5) {
      Alert.alert('Invalid Input', 'Minimum delivery radius is 5km');
      return;
    }

    if (preferences.maxPackageWeight < 1) {
      Alert.alert('Invalid Input', 'Minimum package weight is 1kg');
      return;
    }

    const { length, width, height } = preferences.maxPackageDimensions;
    if (length < 10 || width < 10 || height < 10) {
      Alert.alert('Invalid Input', 'Minimum package dimension is 10cm');
      return;
    }

    // Update context
    updateField('deliveryPreferences', preferences);
    onNext();
  };

  const renderSlider = (title, value, min, max, unit, type, icon) => {
    const sliderWidth = screenWidth - (SIZES.padding * 4) - (SIZES.medium * 2);
    const thumbPosition = ((value - min) / (max - min)) * sliderWidth;

    const handleTrackPress = (event) => {
      const { locationX } = event.nativeEvent;
      const newValue = Math.round(min + (locationX / sliderWidth) * (max - min));
      const clampedValue = Math.max(min, Math.min(max, newValue));
      handleSliderChange(type, clampedValue);
    };

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {icon}
            <Text style={styles.sliderTitle}>{title}</Text>
          </View>
          <Text style={styles.sliderValue}>{value}{unit}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.sliderTrack, { width: sliderWidth }]}
          onPress={handleTrackPress}
          activeOpacity={0.8}
        >
          <View 
            style={[
              styles.sliderFill, 
              { width: thumbPosition }
            ]} 
          />
          
          <View
            style={[
              styles.sliderThumb,
              { 
                position: 'absolute',
                left: thumbPosition - 10,
                top: -7,
              }
            ]}
          />
        </TouchableOpacity>
        
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>{min}{unit}</Text>
          <Text style={styles.sliderLabel}>{max}{unit}</Text>
        </View>
      </View>
    );
  };

  const renderToggle = (title, description, value, field, icon) => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.small }}>
          {icon}
          <Text style={styles.toggleTitle}>{title}</Text>
        </View>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        style={styles.toggleSwitch}
        value={value}
        onValueChange={(newValue) => handleToggleChange(field, newValue)}
        trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Delivery Radius Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Settings size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>Delivery Capabilities</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Set your delivery radius and package handling limits
        </Text>

        {renderSlider(
          'Maximum Delivery Radius',
          sliderValues.radius,
          5,
          200,
          'km',
          'radius',
          <Truck size={20} color="#2E7D32" style={{ marginRight: SIZES.small }} />
        )}

        {renderSlider(
          'Maximum Package Weight',
          sliderValues.weight,
          1,
          500,
          'kg',
          'weight',
          <Package size={20} color="#2E7D32" style={{ marginRight: SIZES.small }} />
        )}
      </View>

      {/* Package Dimensions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Package size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>Package Dimensions</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Maximum package size you can handle (in centimeters)
        </Text>

        <View style={styles.dimensionsContainer}>
          <Text style={styles.dimensionsTitle}>Maximum Dimensions</Text>
          <View style={styles.dimensionsGrid}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.dimensionInput}
                value={preferences.maxPackageDimensions.length.toString()}
                onChangeText={(value) => handleDimensionChange('length', value)}
                keyboardType="numeric"
                placeholder="100"
              />
              <Text style={styles.dimensionLabel}>Length (cm)</Text>
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.dimensionInput}
                value={preferences.maxPackageDimensions.width.toString()}
                onChangeText={(value) => handleDimensionChange('width', value)}
                keyboardType="numeric"
                placeholder="100"
              />
              <Text style={styles.dimensionLabel}>Width (cm)</Text>
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.dimensionInput}
                value={preferences.maxPackageDimensions.height.toString()}
                onChangeText={(value) => handleDimensionChange('height', value)}
                keyboardType="numeric"
                placeholder="100"
              />
              <Text style={styles.dimensionLabel}>Height (cm)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Special Items Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>Special Items</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Select the types of items you're comfortable delivering
        </Text>

        {renderToggle(
          'Fragile Items',
          'Glass, electronics, ceramics, and other breakable items',
          preferences.acceptsFragileItems,
          'acceptsFragileItems',
          <Shield size={20} color="#FF9800" style={{ marginRight: SIZES.small }} />
        )}

        {renderToggle(
          'Perishable Items',
          'Food, flowers, and other items that require special handling',
          preferences.acceptsPerishableItems,
          'acceptsPerishableItems',
          <Leaf size={20} color="#4CAF50" style={{ marginRight: SIZES.small }} />
        )}

        {renderToggle(
          'Livestock',
          'Animals, poultry, and other live creatures',
          preferences.acceptsLivestock,
          'acceptsLivestock',
          <Heart size={20} color="#E91E63" style={{ marginRight: SIZES.small }} />
        )}
      </View>

      {/* Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Delivery Radius:</Text>
            <Text style={styles.summaryValue}>{preferences.maxDeliveryRadius}km</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Max Weight:</Text>
            <Text style={styles.summaryValue}>{preferences.maxPackageWeight}kg</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Max Dimensions:</Text>
            <Text style={styles.summaryValue}>
              {preferences.maxPackageDimensions.length}×{preferences.maxPackageDimensions.width}×{preferences.maxPackageDimensions.height}cm
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Fragile Items:</Text>
            <Text style={styles.summaryValue}>{preferences.acceptsFragileItems ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Perishable Items:</Text>
            <Text style={styles.summaryValue}>{preferences.acceptsPerishableItems ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Livestock:</Text>
            <Text style={styles.summaryValue}>{preferences.acceptsLivestock ? 'Yes' : 'No'}</Text>
          </View>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.prevButton}
          onPress={onPrev}
          disabled={isLoading}
        >
          <Text style={styles.prevButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {isLoading ? 'Processing...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Step5_DeliveryPreferences;
