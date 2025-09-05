import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MapPin, Clock, Plus, X, Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import styles from './styles/step_4.style';

const Step4_ServiceAreas = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    updateField,
    isLoading,
    errors,
  } = useDeliveryAgentApplication();

  const [serviceAreas, setServiceAreas] = useState(deliveryAgentData.serviceAreas || []);
  const [operatingHours, setOperatingHours] = useState(deliveryAgentData.operatingHours || []);
  const [newArea, setNewArea] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [isPopularAreasExpanded, setIsPopularAreasExpanded] = useState(false);

  // Predefined service areas for Cameroon
  const predefinedAreas = [
    'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Garoua', 'Maroua',
    'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kumba', 'Limbe', 'Buea',
    'Dschang', 'Foumban', 'Kribi', 'Edea', 'Mbalmayo', 'Sangmelima'
  ];

  // Days of the week (lowercase for backend compatibility)
  const daysOfWeek = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' }
  ];

  useEffect(() => {
    // Initialize selected days from existing operating hours
    if (operatingHours.length > 0) {
      const days = operatingHours.map(hour => hour.day);
      setSelectedDays(days);
    }
  }, [operatingHours]);

  const addServiceArea = () => {
    if (newArea.trim() && !serviceAreas.includes(newArea.trim())) {
      setServiceAreas([...serviceAreas, newArea.trim()]);
      setNewArea('');
    }
  };

  const removeServiceArea = (area) => {
    setServiceAreas(serviceAreas.filter(a => a !== area));
  };

  const addPredefinedArea = (area) => {
    if (!serviceAreas.includes(area)) {
      setServiceAreas([...serviceAreas, area]);
    }
  };

  const toggleDaySelection = (dayValue) => {
    if (selectedDays.includes(dayValue)) {
      // Remove day and its operating hours
      setSelectedDays(selectedDays.filter(d => d !== dayValue));
      setOperatingHours(operatingHours.filter(hour => hour.day !== dayValue));
    } else {
      // Add day with default hours
      setSelectedDays([...selectedDays, dayValue]);
      setOperatingHours([...operatingHours, {
        day: dayValue,
        openTime: '08:00',
        closeTime: '18:00'
      }]);
    }
  };

  const updateOperatingHour = (dayValue, field, value) => {
    const updated = operatingHours.map(hour => 
      hour.day === dayValue ? { ...hour, [field]: value } : hour
    );
    setOperatingHours(updated);
  };

  const handleNext = () => {
    // Validation
    if (serviceAreas.length === 0) {
      Alert.alert('Required', 'Please add at least one service area');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Required', 'Please select at least one working day');
      return;
    }

    // Check if all selected days have valid times
    const invalidHours = operatingHours.some(hour => !hour.openTime || !hour.closeTime);
    if (invalidHours) {
      Alert.alert('Required', 'Please set valid working hours for all selected days');
      return;
    }

    // Update context with backend-compatible format
    updateField('serviceAreas', serviceAreas);
    updateField('operatingHours', operatingHours);
    
    onNext();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Service Areas Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>Service Areas</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Select the areas where you can provide delivery services
        </Text>

        {/* Current Service Areas */}
        {serviceAreas.length > 0 && (
          <View style={styles.currentAreasContainer}>
            <Text style={styles.currentAreasTitle}>Selected Areas ({serviceAreas.length})</Text>
            <View style={styles.areasList}>
              {serviceAreas.map((area, index) => (
                <View key={index} style={styles.areaItem}>
                  <Text style={styles.areaText}>{area}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeServiceArea(area)}
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Add New Area */}
        <View style={styles.addAreaContainer}>
          <TextInput
            style={styles.areaInput}
            placeholder="Enter city or area name"
            value={newArea}
            onChangeText={setNewArea}
            onSubmitEditing={addServiceArea}
          />
          <TouchableOpacity
            style={[styles.addButton, !newArea.trim() && styles.addButtonDisabled]}
            onPress={addServiceArea}
            disabled={!newArea.trim()}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Collapsible Popular Areas */}
        <TouchableOpacity
          style={styles.collapsibleHeader}
          onPress={() => setIsPopularAreasExpanded(!isPopularAreasExpanded)}
        >
          <Text style={styles.collapsibleTitle}>Popular Areas in Cameroon</Text>
          {isPopularAreasExpanded ? (
            <ChevronUp size={20} color="#666" />
          ) : (
            <ChevronDown size={20} color="#666" />
          )}
        </TouchableOpacity>

        {isPopularAreasExpanded && (
          <View style={styles.predefinedAreasContainer}>
            <View style={styles.predefinedAreasGrid}>
              {predefinedAreas.map((area, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.predefinedAreaItem,
                    serviceAreas.includes(area) && styles.predefinedAreaItemSelected
                  ]}
                  onPress={() => addPredefinedArea(area)}
                  disabled={serviceAreas.includes(area)}
                >
                  <Text style={[
                    styles.predefinedAreaText,
                    serviceAreas.includes(area) && styles.predefinedAreaTextSelected
                  ]}>
                    {area}
                  </Text>
                  {serviceAreas.includes(area) && (
                    <Check size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Operating Hours Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>Operating Hours</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          First select your working days, then set the schedule for each day
        </Text>

        {/* Day Selection */}
        <View style={styles.daySelectionContainer}>
          <Text style={styles.daySelectionTitle}>Select Working Days</Text>
          <View style={styles.daySelectionGrid}>
            {daysOfWeek.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayItem,
                  selectedDays.includes(day.value) && styles.dayItemSelected
                ]}
                onPress={() => toggleDaySelection(day.value)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDays.includes(day.value) && styles.dayTextSelected
                ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Operating Hours for Selected Days */}
        {selectedDays.length > 0 && (
          <View style={styles.hoursContainer}>
            <Text style={styles.daySelectionTitle}>Set Working Hours</Text>
            {operatingHours
              .filter(hour => selectedDays.includes(hour.day))
              .map((hour, index) => {
                const dayInfo = daysOfWeek.find(d => d.value === hour.day);
                return (
                  <View key={hour.day} style={styles.hourItem}>
                    <View style={styles.hourHeader}>
                      <Text style={styles.dayNameText}>{dayInfo?.label}</Text>
                    </View>
                    
                    <View style={styles.timeInputsContainer}>
                      <View style={styles.timeInputGroup}>
                        <Text style={styles.timeLabel}>Start Time</Text>
                        <TextInput
                          style={styles.timeInput}
                          value={hour.openTime}
                          onChangeText={(value) => updateOperatingHour(hour.day, 'openTime', value)}
                          placeholder="08:00"
                          keyboardType="numeric"
                        />
                      </View>
                      
                      <View style={styles.timeInputGroup}>
                        <Text style={styles.timeLabel}>End Time</Text>
                        <TextInput
                          style={styles.timeInput}
                          value={hour.closeTime}
                          onChangeText={(value) => updateOperatingHour(hour.day, 'closeTime', value)}
                          placeholder="18:00"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
        )}
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

export default Step4_ServiceAreas;
