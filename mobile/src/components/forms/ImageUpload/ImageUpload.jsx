import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  Camera, 
  Image as ImageIcon,
  Plus, 
  X, 
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../../constants';
import styles from './styles';

const ImageUpload = ({ 
  images = [], 
  onImagesChange,
  title = "Upload Images",
  subtitle = "Upload your images for verification",
  imageTypes = [],
  requiredImages = [],
  maxImages = 5,
  required = true,
  aspectRatio = [4, 3]
}) => {
  const [imgs, setImgs] = useState(images);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newImage, setNewImage] = useState({
    imageName: '',
    file: null,
    status: 'required'
  });

  // Ref for scroll view to enable auto-scroll
  const scrollViewRef = useRef(null);

  // Update parent when images change
  useEffect(() => {
    if (onImagesChange) {
      onImagesChange(imgs);
    }
  }, [imgs, onImagesChange]);

  // Initialize images if empty
  useEffect(() => {
    if (imgs.length === 0 && imageTypes.length > 0) {
      const initialImgs = imageTypes.map(type => ({
        imageName: type.name,
        file: null,
        status: requiredImages.includes(type.name) ? 'required' : 'optional'
      }));
      setImgs(initialImgs);
    }
  }, [imageTypes, requiredImages]);

  const getImageStatus = (img) => {
    if (img.file) return 'uploaded';
    if (requiredImages.includes(img.imageName)) return 'required';
    return 'optional';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded': return COLORS.success;
      case 'required': return COLORS.error;
      case 'optional': return COLORS.gray;
      default: return COLORS.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'uploaded': return 'Uploaded';
      case 'required': return 'Required';
      case 'optional': return 'Optional';
      default: return 'Unknown';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const pickImage = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Camera permission is required to take photos');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: aspectRatio,
          quality: 0.8,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Photo library permission is required');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: aspectRatio,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: `${newImage.imageName.replace(/\s+/g, '_')}_${Date.now()}.${asset.type?.includes('png') ? 'png' : 'jpg'}`,
          size: asset.fileSize || 0,
          isImage: true,
        };
        
        setNewImage(prev => ({ ...prev, file }));
        setShowUploadOptions(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const addImage = () => {
    if (!newImage.imageName.trim()) {
      Alert.alert('Required', 'Please enter an image name');
      return;
    }

    if (!newImage.file) {
      Alert.alert('Required', 'Please upload an image file');
      return;
    }

    // Check if image name already exists
    if (imgs.some(img => img.imageName.toLowerCase() === newImage.imageName.toLowerCase())) {
      Alert.alert('Duplicate', 'An image with this name already exists');
      return;
    }

    // Check max images limit
    if (imgs.length >= maxImages) {
      Alert.alert('Limit Reached', `Maximum ${maxImages} images allowed`);
      return;
    }

    const updatedImgs = [...imgs, { ...newImage }];
    setImgs(updatedImgs);
    resetForm();
  };

  const updateImage = (index) => {
    if (!newImage.imageName.trim()) {
      Alert.alert('Required', 'Please enter an image name');
      return;
    }

    if (!newImage.file) {
      Alert.alert('Required', 'Please upload an image file');
      return;
    }

    // Check if image name already exists (excluding current index)
    const otherImgs = imgs.filter((_, i) => i !== index);
    if (otherImgs.some(img => img.imageName.toLowerCase() === newImage.imageName.toLowerCase())) {
      Alert.alert('Duplicate', 'An image with this name already exists');
      return;
    }

    const updatedImgs = [...imgs];
    updatedImgs[index] = { ...newImage };
    setImgs(updatedImgs);
    resetForm();
  };

  const removeImage = (index) => {
    const img = imgs[index];
    const isRequired = requiredImages.includes(img.imageName);
    
    if (isRequired) {
      // For required images, only clear the file, don't remove the card
      Alert.alert(
        'Clear Image',
        'This is a required image. Do you want to clear the uploaded image so you can upload a new one?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear Image', 
            style: 'destructive',
            onPress: () => {
              const updatedImgs = [...imgs];
              updatedImgs[index] = {
                ...updatedImgs[index],
                file: null
              };
              setImgs(updatedImgs);
            }
          }
        ]
      );
    } else {
      // For optional images, remove the entire card
      Alert.alert(
        'Remove Image',
        'Are you sure you want to remove this image?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => {
              const updatedImgs = imgs.filter((_, i) => i !== index);
              setImgs(updatedImgs);
            }
          }
        ]
      );
    }
  };

  const replaceImage = (index) => {
    setEditingIndex(index);
    setNewImage({ ...imgs[index] });
    setIsAddingImage(true);
    
    // Auto-scroll to the form after a short delay to ensure it's rendered
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const startAddingImage = () => {
    setIsAddingImage(true);
    setEditingIndex(-1);
    resetForm();
    
    // Auto-scroll to the form after a short delay to ensure it's rendered
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const cancelForm = () => {
    setIsAddingImage(false);
    setEditingIndex(-1);
    setShowUploadOptions(false);
    resetForm();
  };

  const resetForm = () => {
    setNewImage({
      imageName: '',
      file: null,
      status: 'optional'
    });
    setShowUploadOptions(false);
  };

  const renderImageItem = (img, index) => {
    const status = getImageStatus(img);
    const statusColor = getStatusColor(status);
    const statusText = getStatusText(status);
    const isUploaded = status === 'uploaded';

    return (
      <View key={index} style={[
        styles.imageItem,
        isUploaded && styles.imageItemUploaded,
        status === 'required' && !isUploaded && styles.imageItemRequired
      ]}>
        <View style={styles.imageHeader}>
          <View style={styles.imageInfo}>
            <Text style={styles.imageName}>{img.imageName}</Text>
            {img.file && (
              <Text style={styles.imageDescription}>
                {img.file.name} • {formatFileSize(img.file.size)}
              </Text>
            )}
          </View>
          <View style={[styles.imageStatus, status === 'uploaded' ? styles.statusUploaded : styles.statusRequired]}>
            <Text style={[
              styles.statusText,
              status === 'uploaded' ? styles.statusTextUploaded : styles.statusTextRequired
            ]}>
              {statusText}
            </Text>
          </View>
        </View>

        {img.file && (
          <View style={styles.imagePreview}>
            <Text style={styles.previewTitle}>Image Preview</Text>
            <Image source={{ uri: img.file.uri }} style={styles.previewImage} />
            <View style={styles.previewInfo}>
              <Text style={styles.previewFileName}>{img.file.name}</Text>
              <Text style={styles.previewFileSize}>{formatFileSize(img.file.size)}</Text>
            </View>
          </View>
        )}

        <View style={styles.imageActions}>
          {!isUploaded ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.uploadButton]}
              onPress={() => replaceImage(index)}
            >
              <Text style={[styles.actionButtonText, styles.uploadButtonText]}>Upload</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.replaceButton]}
                onPress={() => replaceImage(index)}
              >
                <Text style={[styles.actionButtonText, styles.replaceButtonText]}>Replace</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  requiredImages.includes(img.imageName) ? styles.clearButton : styles.removeButton
                ]}
                onPress={() => removeImage(index)}
              >
                <Text style={[
                  styles.actionButtonText, 
                  requiredImages.includes(img.imageName) ? styles.clearButtonText : styles.removeButtonText
                ]}>
                  {requiredImages.includes(img.imageName) ? 'Clear' : 'Remove'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderImageForm = () => {
    const isEditing = editingIndex !== -1;

    return (
      <View style={styles.imageFormContainer}>
        <Text style={styles.formTitle}>
          {isEditing ? 'Update Image' : 'Add Image'}
        </Text>
        
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Image Name</Text>
          <TextInput
            style={styles.imageNameInput}
            placeholder="Enter image name (e.g., Front View, Side View)"
            value={newImage.imageName}
            onChangeText={(value) => setNewImage(prev => ({ ...prev, imageName: value }))}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Image File</Text>
          {newImage.file ? (
            <View style={styles.imagePreview}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>Selected Image</Text>
                <TouchableOpacity
                  style={styles.changeFileButton}
                  onPress={() => setShowUploadOptions(true)}
                >
                  <Text style={styles.changeFileButtonText}>Change Image</Text>
                </TouchableOpacity>
              </View>
              <Image source={{ uri: newImage.file.uri }} style={styles.previewImage} />
              <View style={styles.previewInfo}>
                <Text style={styles.previewFileName}>{newImage.file.name}</Text>
                <Text style={styles.previewFileSize}>{formatFileSize(newImage.file.size)}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imageTypeSelector}
              onPress={() => setShowUploadOptions(true)}
            >
              <Text style={styles.imageTypeSelectorText}>Select Image</Text>
              <ImageIcon size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelForm}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={isEditing ? () => updateImage(editingIndex) : addImage}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Add'} Image
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderUploadOptions = () => (
    <Modal
      visible={showUploadOptions}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowUploadOptions(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={styles.uploadOptionsContainer}>
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => pickImage('camera')}
          >
            <Camera size={24} color={COLORS.primary} />
            <Text style={styles.uploadOptionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.uploadOption, styles.uploadOptionLast]}
            onPress={() => pickImage('gallery')}
          >
            <ImageIcon size={24} color={COLORS.primary} />
            <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const getProgressStats = () => {
    const total = imgs.length;
    const uploaded = imgs.filter(img => getImageStatus(img) === 'uploaded').length;
    const required = imgs.filter(img => requiredImages.includes(img.imageName)).length;
    const requiredUploaded = imgs.filter(img => 
      requiredImages.includes(img.imageName) && getImageStatus(img) === 'uploaded'
    ).length;

    return { total, uploaded, required, requiredUploaded };
  };

  const stats = getProgressStats();

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ImageIcon size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Upload Instructions</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Take clear, well-lit photos</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Ensure the subject is fully visible</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Upload images in JPG or PNG format</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Images will be reviewed by our admin team</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Upload Progress</Text>
          <View style={styles.progressItem}>
            <View style={styles.progressIcon}>
              <CheckCircle size={16} color={COLORS.success} />
            </View>
            <Text style={styles.progressText}>
              {stats.uploaded} of {stats.total} images uploaded
            </Text>
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressIcon}>
              <AlertCircle size={16} color={COLORS.error} />
            </View>
            <Text style={styles.progressText}>
              {stats.requiredUploaded} of {stats.required} required images uploaded
            </Text>
          </View>
        </View>
      </View>

      {/* Images List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Images</Text>
        
        {imgs.map((img, index) => renderImageItem(img, index))}

        {/* Add Image Form */}
        {isAddingImage ? (
          renderImageForm()
        ) : (
          <TouchableOpacity
            style={styles.addImageContainer}
            onPress={startAddingImage}
            disabled={imgs.length >= maxImages}
          >
            <View style={styles.addImageButton}>
              <Plus size={24} color={COLORS.primary} />
              <Text style={styles.addImageText}>
                {imgs.length >= maxImages ? 'Maximum images reached' : 'Add Image'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Upload Options Modal */}
      {renderUploadOptions()}
    </ScrollView>
  );
};

export default ImageUpload;
