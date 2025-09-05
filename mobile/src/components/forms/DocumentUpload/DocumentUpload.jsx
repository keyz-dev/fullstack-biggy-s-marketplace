import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { 
  FileText, 
  Upload, 
  Camera, 
  Image as ImageIcon,
  File,
  FileImage,
  Plus, 
  X, 
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2
} from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../../constants';
import styles from './styles';

const DocumentUpload = ({ 
  documents = [], 
  onDocumentsChange,
  title = "Required Documents",
  subtitle = "Upload your verification documents for admin review",
  documentTypes = [],
  requiredDocuments = [],
  maxDocuments = 10,
  required = true
}) => {
  const [docs, setDocs] = useState(documents);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [newDocument, setNewDocument] = useState({
    documentName: '',
    file: null,
    status: 'required'
  });

  // Ref for scroll view to enable auto-scroll
  const scrollViewRef = useRef(null);

  // Update parent when documents change
  useEffect(() => {
    if (onDocumentsChange) {
      onDocumentsChange(docs);
    }
  }, [docs, onDocumentsChange]);

  // Initialize documents if empty
  useEffect(() => {
    if (docs.length === 0 && documentTypes.length > 0) {
      const initialDocs = documentTypes.map(type => ({
        documentName: type.name,
        file: null,
        status: requiredDocuments.includes(type.name) ? 'required' : 'optional'
      }));
      setDocs(initialDocs);
    }
  }, [documentTypes, requiredDocuments]);

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

  const getFileTypeIcon = (mimeType) => {
    if (!mimeType) return '📄';
    
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
    if (mimeType.includes('text')) return '📄';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️';
    
    return '📄';
  };

  const getDocumentStatus = (doc) => {
    if (doc.file) return 'uploaded';
    if (requiredDocuments.includes(doc.documentName)) return 'required';
    return 'optional';
  };
  
  const addDocument = () => {
    if (!newDocument.documentName.trim()) {
      Alert.alert('Required', 'Please enter a document name');
      return;
    }
  
    if (!newDocument.file) {
      Alert.alert('Required', 'Please upload a document file');
      return;
    }
  
    // Check if document name already exists
    if (docs.some(doc => doc.documentName.toLowerCase() === newDocument.documentName.toLowerCase())) {
      Alert.alert('Duplicate', 'A document with this name already exists');
      return;
    }
  
    // Check max documents limit
    if (docs.length >= maxDocuments) {
      Alert.alert('Limit Reached', `Maximum ${maxDocuments} documents allowed`);
      return;
    }
  
    // Create new document with proper status
    const documentToAdd = {
      ...newDocument,
      status: newDocument.file ? 'uploaded' : (requiredDocuments.includes(newDocument.documentName) ? 'required' : 'optional')
    };
  
    const updatedDocs = [...docs, documentToAdd];
    setDocs(updatedDocs);
    resetForm();
  };
  
  const updateDocument = (index) => {
    if (!newDocument.documentName.trim()) {
      Alert.alert('Required', 'Please enter a document name');
      return;
    }
  
    if (!newDocument.file) {
      Alert.alert('Required', 'Please upload a document file');
      return;
    }
  
    // Check if document name already exists (excluding current index)
    const otherDocs = docs.filter((_, i) => i !== index);
    if (otherDocs.some(doc => doc.documentName.toLowerCase() === newDocument.documentName.toLowerCase())) {
      Alert.alert('Duplicate', 'A document with this name already exists');
      return;
    }
  
    // Update document with proper status
    const documentToUpdate = {
      ...newDocument,
      status: newDocument.file ? 'uploaded' : (requiredDocuments.includes(newDocument.documentName) ? 'required' : 'optional')
    };
  
    const updatedDocs = [...docs];
    updatedDocs[index] = documentToUpdate;
    setDocs(updatedDocs);
    resetForm();
  };
  
  const removeDocument = (index) => {
    const doc = docs[index];
    const isRequired = requiredDocuments.includes(doc.documentName);
    
    if (isRequired) {
      // For required documents, only clear the file, don't remove the card
      Alert.alert(
        'Clear Document',
        'This is a required document. Do you want to clear the uploaded file so you can upload a new one?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear File', 
            style: 'destructive',
            onPress: () => {
              const updatedDocs = [...docs];
              updatedDocs[index] = {
                ...updatedDocs[index],
                file: null,
                // Update status based on file presence
                status: 'required' // Since we're clearing the file and it's required
              };
              setDocs(updatedDocs);
            }
          }
        ]
      );
    } else {
      // For optional documents, remove the entire card
      Alert.alert(
        'Remove Document',
        'Are you sure you want to remove this document?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => {
              const updatedDocs = docs.filter((_, i) => i !== index);
              setDocs(updatedDocs);
            }
          }
        ]
      );
    }
  };
  
  // Updated file validation function
  const validateFileForFormData = (file, fieldName) => {
    if (!file) {
      console.log(`❌ ${fieldName}: No file provided`);
      return false;
    }
  
    if (!file.uri) {
      console.log(`❌ ${fieldName}: No URI in file object`);
      return false;
    }
  
    // Check if URI is valid for React Native
    const validUriPrefixes = ['file://', 'content://', 'ph://'];
    const hasValidPrefix = validUriPrefixes.some(prefix => file.uri.startsWith(prefix));
    
    if (!hasValidPrefix) {
      console.log(`❌ ${fieldName}: Invalid URI format - ${file.uri}`);
      return false;
    }
  
    // Check file size (optional, but recommended)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size && file.size > maxSize) {
      console.log(`❌ ${fieldName}: File too large - ${file.size} bytes`);
      return false;
    }
  
    // Check file type
    if (file.type && !file.type.startsWith('image/') && !file.type.includes('pdf') && !file.type.includes('document')) {
      console.log(`❌ ${fieldName}: Unsupported file type - ${file.type}`);
      return false;
    }
  
    console.log(`✅ ${fieldName}: File validation passed`);
    return true;
  };
  
  // Updated processSelectedFile function
  const processSelectedFile = (asset, documentName) => {
    const file = {
      uri: asset.uri,
      type: asset.type || asset.mimeType || 'image/jpeg',
      name: asset.name || `${documentName.replace(/\s+/g, '_')}_${Date.now()}.${asset.type?.includes('png') ? 'png' : 'jpg'}`,
      size: asset.fileSize || asset.size || 0,
      isImage: asset.type?.startsWith('image/') || asset.mimeType?.startsWith('image/') || false,
    };
  
    if (validateFileForFormData(file, documentName)) {
      return file;
    }
    
    return null;
  };
  
  // Update the pickImage and pickDocument functions to use proper file processing
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
          aspect: [4, 3],
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
          aspect: [4, 3],
          quality: 0.8,
        });
      }
  
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = processSelectedFile(asset, newDocument.documentName);
        
        if (file) {
          setNewDocument(prev => ({ ...prev, file }));
          setShowUploadOptions(false);
        } else {
          Alert.alert('Error', 'Invalid file selected. Please try again with a different file.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });
  
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = processSelectedFile(asset, newDocument.documentName);
        
        if (file) {
          setNewDocument(prev => ({ ...prev, file }));
          setShowUploadOptions(false);
        } else {
          Alert.alert('Error', 'Invalid file selected. Please try again with a different file.');
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const replaceDocument = (index) => {
    setEditingIndex(index);
    setNewDocument({ ...docs[index] });
    setSelectedDocumentType(docs[index].documentName);
    setIsAddingDocument(true);
    
    // Auto-scroll to the form after a short delay to ensure it's rendered
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const startAddingDocument = () => {
    setIsAddingDocument(true);
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
    setIsAddingDocument(false);
    setEditingIndex(-1);
    setShowTypeOptions(false);
    setShowUploadOptions(false);
    resetForm();
  };

  const resetForm = () => {
    setNewDocument({
      documentName: '',
      file: null,
      status: 'optional'
    });
    setSelectedDocumentType('');
    setShowTypeOptions(false);
    setShowUploadOptions(false);
  };

  const selectDocumentType = (type) => {
    setSelectedDocumentType(type);
    setNewDocument(prev => ({ ...prev, documentName: type }));
    setShowTypeOptions(false);
  };

  const renderDocumentItem = (doc, index) => {
    const status = getDocumentStatus(doc);
    const statusColor = getStatusColor(status);
    const statusText = getStatusText(status);
    const isUploaded = status === 'uploaded';

    return (
      <View key={index} style={[
        styles.documentItem,
        isUploaded && styles.documentItemUploaded,
        status === 'required' && !isUploaded && styles.documentItemRequired
      ]}>
        <View style={styles.documentHeader}>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>{doc.documentName}</Text>
            {doc.file && (
              <Text style={styles.documentDescription}>
                {doc.file.name} • {formatFileSize(doc.file.size)}
              </Text>
            )}
          </View>
          <View style={[styles.documentStatus, status === 'uploaded' ? styles.statusUploaded : styles.statusRequired]}>
            <Text style={[
              styles.statusText,
              status === 'uploaded' ? styles.statusTextUploaded : styles.statusTextRequired
            ]}>
              {statusText}
            </Text>
          </View>
        </View>

        {doc.file && (
          <View style={styles.documentPreview}>
            <Text style={styles.previewTitle}>Document Preview</Text>
            {doc.file.isImage ? (
              <Image source={{ uri: doc.file.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.documentPreviewPlaceholder}>
                <File size={48} color={COLORS.primary} />
                <Text style={styles.documentPreviewText}>
                  {getFileTypeIcon(doc.file.type)}
                </Text>
                <Text style={styles.documentPreviewSubtext}>
                  {doc.file.type?.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                </Text>
              </View>
            )}
            <View style={styles.previewInfo}>
              <Text style={styles.previewFileName}>{doc.file.name}</Text>
              <Text style={styles.previewFileSize}>{formatFileSize(doc.file.size)}</Text>
            </View>
          </View>
        )}

        <View style={styles.documentActions}>
          {!isUploaded ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.uploadButton]}
              onPress={() => replaceDocument(index)}
            >
              <Text style={[styles.actionButtonText, styles.uploadButtonText]}>Upload</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.replaceButton]}
                onPress={() => replaceDocument(index)}
              >
                <Text style={[styles.actionButtonText, styles.replaceButtonText]}>Replace</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  requiredDocuments.includes(doc.documentName) ? styles.clearButton : styles.removeButton
                ]}
                onPress={() => removeDocument(index)}
              >
                <Text style={[
                  styles.actionButtonText, 
                  requiredDocuments.includes(doc.documentName) ? styles.clearButtonText : styles.removeButtonText
                ]}>
                  {requiredDocuments.includes(doc.documentName) ? 'Clear' : 'Remove'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderDocumentForm = () => {
    const isEditing = editingIndex !== -1;

    return (
      <View style={styles.documentFormContainer}>
        <Text style={styles.formTitle}>
          {isEditing ? 'Update Document' : 'Add Document'}
        </Text>
        
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Document Type</Text>
          <TouchableOpacity
            style={styles.documentTypeSelector}
            onPress={() => setShowTypeOptions(!showTypeOptions)}
          >
            <Text style={styles.documentTypeSelectorText}>
              {selectedDocumentType || 'Select Document Type'}
            </Text>
            <ChevronDown size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {showTypeOptions && (
          <View style={styles.typeOptionsContainer}>
            {documentTypes.map((type, index) => {
              const isLast = index === documentTypes.length - 1;
              const isSelected = selectedDocumentType === type.name;
              
              return (
                <TouchableOpacity
                  key={type.name}
                  style={[
                    styles.typeOption,
                    isLast && styles.typeOptionLast,
                    isSelected && { backgroundColor: '#F0F8FF' }
                  ]}
                  onPress={() => selectDocumentType(type.name)}
                >
                  <Text style={styles.typeOptionText}>{type.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Custom Document Name</Text>
          <TextInput
            style={styles.customNameInput}
            placeholder="Enter document name (e.g., National ID, Driver's License)"
            value={newDocument.documentName}
            onChangeText={(value) => setNewDocument(prev => ({ ...prev, documentName: value }))}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Document File</Text>
          {newDocument.file ? (
            <View style={styles.documentPreview}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>Selected File</Text>
                <TouchableOpacity
                  style={styles.changeFileButton}
                  onPress={() => setShowUploadOptions(true)}
                >
                  <Text style={styles.changeFileButtonText}>Change File</Text>
                </TouchableOpacity>
              </View>
              {newDocument.file.isImage ? (
                <Image source={{ uri: newDocument.file.uri }} style={styles.previewImage} />
              ) : (
                <View style={styles.documentPreviewPlaceholder}>
                  <File size={48} color={COLORS.primary} />
                  <Text style={styles.documentPreviewText}>
                    {getFileTypeIcon(newDocument.file.type)}
                  </Text>
                  <Text style={styles.documentPreviewSubtext}>
                    {newDocument.file.type?.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                  </Text>
                </View>
              )}
              <View style={styles.previewInfo}>
                <Text style={styles.previewFileName}>{newDocument.file.name}</Text>
                <Text style={styles.previewFileSize}>{formatFileSize(newDocument.file.size)}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.documentTypeSelector}
              onPress={() => setShowUploadOptions(true)}
            >
              <Text style={styles.documentTypeSelectorText}>Select File</Text>
              <Upload size={20} color={COLORS.gray} />
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
            onPress={isEditing ? () => updateDocument(editingIndex) : addDocument}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Add'} Document
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
            style={styles.uploadOption}
            onPress={() => pickImage('gallery')}
          >
            <ImageIcon size={24} color={COLORS.primary} />
            <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.uploadOption, styles.uploadOptionLast]}
            onPress={() => pickDocument()}
          >
            <File size={24} color={COLORS.primary} />
            <Text style={styles.uploadOptionText}>Choose Document (PDF, Word, etc.)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const getProgressStats = () => {
    const total = docs.length;
    const uploaded = docs.filter(doc => getDocumentStatus(doc) === 'uploaded').length;
    const required = docs.filter(doc => requiredDocuments.includes(doc.documentName)).length;
    const requiredUploaded = docs.filter(doc => 
      requiredDocuments.includes(doc.documentName) && getDocumentStatus(doc) === 'uploaded'
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
          <FileText size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Upload Instructions</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Take clear, well-lit photos of physical documents</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Upload digital documents (PDF, Word, etc.) directly</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Ensure all text is readable and not cut off</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Supported formats: Images (JPG, PNG), PDF, Word, Excel</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>Documents will be reviewed by our admin team</Text>
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
              {stats.uploaded} of {stats.total} documents uploaded
            </Text>
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressIcon}>
              <AlertCircle size={16} color={COLORS.error} />
            </View>
            <Text style={styles.progressText}>
              {stats.requiredUploaded} of {stats.required} required documents uploaded
            </Text>
          </View>
        </View>
      </View>

      {/* Documents List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        
        {docs.map((doc, index) => renderDocumentItem(doc, index))}

        {/* Add Document Form */}
        {isAddingDocument ? (
          renderDocumentForm()
        ) : (
          <TouchableOpacity
            style={styles.addDocumentContainer}
            onPress={startAddingDocument}
            disabled={docs.length >= maxDocuments}
          >
            <View style={styles.addDocumentButton}>
              <Plus size={24} color={COLORS.primary} />
              <Text style={styles.addDocumentText}>
                {docs.length >= maxDocuments ? 'Maximum documents reached' : 'Add Document'}
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

export default DocumentUpload;

