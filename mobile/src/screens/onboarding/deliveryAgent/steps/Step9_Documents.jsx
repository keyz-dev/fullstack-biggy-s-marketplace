import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import DocumentUpload from '../../../../components/forms/DocumentUpload/DocumentUpload';
import styles from './styles/step_9.style';

const Step9_Documents = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    updateField,
    isLoading,
  } = useDeliveryAgentApplication();

  const [documents, setDocuments] = useState(deliveryAgentData.documents || []);

  // Document types for delivery agents
  const documentTypes = [
    { name: 'National ID', description: 'Government issued identification' },
    { name: 'Driver\'s License', description: 'Valid driver\'s license for vehicle operation' },
    { name: 'Vehicle Registration', description: 'Proof of vehicle ownership' },
    { name: 'Insurance Certificate', description: 'Vehicle insurance documentation' },
    { name: 'Business License', description: 'Business registration (if applicable)' },
    { name: 'Bank Statement', description: 'Recent bank statement for verification' },
  ];

  // Required documents for delivery agents
  const requiredDocuments = [
    'National ID'
  ];

  const handleDocumentsChange = (docs) => {
    setDocuments(docs);
  };

  const handleNext = () => {
    // Check if all required documents are uploaded
    const uploadedDocs = documents.filter(doc => doc.file);
    const requiredUploaded = documents.filter(doc => 
      requiredDocuments.includes(doc.documentName) && doc.file
    );

    if (requiredUploaded.length < requiredDocuments.length) {
      const missingDocs = requiredDocuments.filter(req => 
        !documents.find(doc => doc.documentName === req && doc.file)
      );
      
      Alert.alert(
        'Required Documents Missing',
        `Please upload the following required documents:\n• ${missingDocs.join('\n• ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (uploadedDocs.length === 0) {
      Alert.alert('Required', 'Please upload at least one document');
      return;
    }

    // Update context
    updateField('documents', documents);
    onNext();
  };

  return (
    <View style={styles.container}>
      {/* Document Upload Component */}
      <DocumentUpload
        documents={documents}
        onDocumentsChange={handleDocumentsChange}
        title="Verification Documents"
        subtitle="Upload your documents for admin review and approval"
        documentTypes={documentTypes}
        requiredDocuments={requiredDocuments}
        maxDocuments={10}
        required={true}
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

export default Step9_Documents;

