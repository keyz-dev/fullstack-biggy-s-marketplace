import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import ImageUpload from '../../../../components/forms/ImageUpload';
import styles from './styles/step_10.style';

const Step10_VehicleImages = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    updateField,
    isLoading,
  } = useDeliveryAgentApplication();

  const [vehicleImages, setVehicleImages] = useState(deliveryAgentData.vehicleImages || []);

  // Vehicle image types for delivery agents
  const imageTypes = [
    { name: 'License Plate', description: 'Clear view of license plate' },
    { name: 'Front View', description: 'Front view of the vehicle' },
    { name: 'Side View', description: 'Side view of the vehicle' },
    { name: 'Back View', description: 'Back view of the vehicle' },
    { name: 'Interior View', description: 'Interior of the vehicle' },
  ];

  // Required images for delivery agents
  const requiredImages = [
    'Front View',
  ];

  const handleImagesChange = (images) => {
    setVehicleImages(images);
  };

  const handleNext = () => {
    // Check if all required images are uploaded
    const uploadedImgs = vehicleImages.filter(img => img.file);
    const requiredUploaded = vehicleImages.filter(img => 
      requiredImages.includes(img.imageName) && img.file
    );

    if (requiredUploaded.length < requiredImages.length) {
      const missingImgs = requiredImages.filter(req => 
        !vehicleImages.find(img => img.imageName === req && img.file)
      );
      
      Alert.alert(
        'Required Images Missing',
        `Please upload the following required images:\n• ${missingImgs.join('\n• ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (uploadedImgs.length === 0) {
      Alert.alert('Required', 'Please upload at least one vehicle image');
      return;
    }

    // Update context
    updateField('vehicleImages', vehicleImages);
    onNext();
  };

  return (
    <View style={styles.container}>
      {/* Vehicle Images Upload Component */}
      <ImageUpload
        images={vehicleImages}
        onImagesChange={handleImagesChange}
        title="Vehicle Images"
        subtitle="Upload clear photos of your delivery vehicle for verification"
        imageTypes={imageTypes}
        requiredImages={requiredImages}
        maxImages={8}
        required={true}
        aspectRatio={[4, 3]}
      />

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
    </View>
  );
};

export default Step10_VehicleImages;
