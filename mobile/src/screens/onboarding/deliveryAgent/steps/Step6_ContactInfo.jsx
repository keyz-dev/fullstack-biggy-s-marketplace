import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Phone, Mail, MessageCircle, Facebook, Instagram, Globe, Plus, X, ChevronDown } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../../../constants';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import styles from './styles/step_6.style';

const Step6_ContactInfo = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    updateField,
    isLoading,
    errors,
  } = useDeliveryAgentApplication();

  const [contactInfo, setContactInfo] = useState(deliveryAgentData.contactInfo || []);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [newContact, setNewContact] = useState({
    type: '',
    value: '',
  });

  // Available contact types
  const contactTypes = [
    { value: 'phone', label: 'Phone', icon: Phone, color: '#4CAF50' },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
    { value: 'business_email', label: 'Business Email', icon: Mail, color: '#2196F3' },
    { value: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
    { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
    { value: 'website', label: 'Website', icon: Globe, color: '#FF9800' },
  ];

  const getContactIcon = (type) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.icon : Phone;
  };

  const getContactColor = (type) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.color : COLORS.primary;
  };

  const getContactLabel = (type) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.label : type;
  };

  const addContact = () => {
    if (!newContact.type || !newContact.value.trim()) {
      Alert.alert('Required', 'Please select a contact type and enter a value');
      return;
    }

    // Check if contact type already exists
    if (contactInfo.some(contact => contact.type === newContact.type)) {
      Alert.alert('Duplicate', 'This contact type already exists');
      return;
    }

    // Basic validation
    if (newContact.type === 'business_email' && !newContact.value.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (newContact.type === 'website' && !newContact.value.startsWith('http')) {
      setNewContact(prev => ({ ...prev, value: `https://${prev.value}` }));
    }

    setContactInfo([...contactInfo, { ...newContact, value: newContact.value.trim() }]);
    setNewContact({ type: '', value: '' });
    setIsAddingContact(false);
    setShowTypeOptions(false);
  };

  const removeContact = (index) => {
    const updatedContacts = contactInfo.filter((_, i) => i !== index);
    setContactInfo(updatedContacts);
  };

  const startAddingContact = () => {
    setIsAddingContact(true);
    setNewContact({ type: '', value: '' });
  };

  const cancelAddingContact = () => {
    setIsAddingContact(false);
    setNewContact({ type: '', value: '' });
    setShowTypeOptions(false);
  };

  const selectContactType = (type) => {
    setNewContact(prev => ({ ...prev, type }));
    setShowTypeOptions(false);
  };

  const handleNext = () => {
    if (contactInfo.length === 0) {
      Alert.alert('Required', 'Please add at least one contact method');
      return;
    }

    // Update context
    updateField('contactInfo', contactInfo);
    onNext();
  };

  const renderContactItem = (contact, index) => {
    const IconComponent = getContactIcon(contact.type);
    const color = getContactColor(contact.type);
    const label = getContactLabel(contact.type);

    return (
      <View key={index} style={styles.contactItem}>
        <View style={styles.contactIcon}>
          <IconComponent size={24} color={color} />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactType}>{label}</Text>
          <Text style={styles.contactValue}>{contact.value}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeContact(index)}
        >
          <X size={16} color="#FF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderContactForm = () => {
    const selectedType = contactTypes.find(t => t.value === newContact.type);
    const IconComponent = selectedType ? selectedType.icon : Phone;
    const color = selectedType ? selectedType.color : COLORS.primary;

    return (
      <View style={styles.contactFormContainer}>
        <Text style={styles.formTitle}>Add Contact Method</Text>
        
        <View style={styles.formRow}>
          <TouchableOpacity
            style={styles.typeSelector}
            onPress={() => setShowTypeOptions(!showTypeOptions)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {newContact.type && (
                  <IconComponent size={20} color={color} style={{ marginRight: SIZES.small }} />
                )}
                <Text style={styles.typeSelectorText}>
                  {newContact.type ? getContactLabel(newContact.type) : 'Select Type'}
                </Text>
              </View>
              <ChevronDown size={20} color={COLORS.gray} />
            </View>
          </TouchableOpacity>
        </View>

        {showTypeOptions && (
          <View style={styles.typeOptionsContainer}>
            {contactTypes.map((type, index) => {
              const IconComponent = type.icon;
              const isLast = index === contactTypes.length - 1;
              const isSelected = newContact.type === type.value;
              
              return (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    isLast && styles.typeOptionLast,
                    isSelected && { backgroundColor: '#F0F8FF' }
                  ]}
                  onPress={() => selectContactType(type.value)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconComponent size={20} color={type.color} style={{ marginRight: SIZES.small }} />
                    <Text style={styles.typeOptionText}>{type.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.formRow}>
          <TextInput
            style={styles.valueInput}
            placeholder={newContact.type === 'business_email' ? 'email@example.com' : 
                       newContact.type === 'website' ? 'https://example.com' :
                       newContact.type === 'phone' || newContact.type === 'whatsapp' ? '+237123456789' :
                       'Enter value'}
            value={newContact.value}
            onChangeText={(value) => setNewContact(prev => ({ ...prev, value }))}
            keyboardType={newContact.type === 'business_email' ? 'email-address' :
                         newContact.type === 'phone' || newContact.type === 'whatsapp' ? 'phone-pad' :
                         'default'}
          />
        </View>

        <View style={styles.formButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelAddingContact}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={addContact}
          >
            <Text style={styles.saveButtonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Contact Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Phone size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Add the ways customers can reach you for delivery services
        </Text>

        {/* Existing Contacts */}
        {contactInfo.length > 0 && (
          <View style={styles.contactListContainer}>
            {contactInfo.map((contact, index) => renderContactItem(contact, index))}
          </View>
        )}

        {/* Add Contact Form */}
        {isAddingContact ? (
          renderContactForm()
        ) : (
          <TouchableOpacity
            style={styles.addContactContainer}
            onPress={startAddingContact}
          >
            <View style={styles.addContactButton}>
              <Plus size={24} color={COLORS.primary} />
              <Text style={styles.addContactText}>Add Contact Method</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Summary Section */}
      {contactInfo.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Summary</Text>
          <View style={styles.summaryContainer}>
            {contactInfo.map((contact, index) => {
              const IconComponent = getContactIcon(contact.type);
              const color = getContactColor(contact.type);
              const label = getContactLabel(contact.type);

              return (
                <View key={index} style={styles.summaryItem}>
                  <View style={styles.summaryIcon}>
                    <IconComponent size={16} color={color} />
                  </View>
                  <Text style={styles.summaryText}>
                    {label}: {contact.value}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

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

export default Step6_ContactInfo;
