import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  Plus, 
  X, 
  ChevronDown,
  Star,
  Edit3,
  Trash2
} from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../../constants';
import styles from './styles';

const PaymentMethods = ({ 
  paymentMethods = [], 
  onPaymentMethodsChange,
  title = "Payment Methods",
  subtitle = "How do you want to receive payments?",
  showPrimarySelection = true,
  maxMethods = 5,
  required = true
}) => {
  const [methods, setMethods] = useState(paymentMethods);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newPayment, setNewPayment] = useState({
    method: '',
    value: {
      accountNumber: '',
      accountName: '',
      bankName: '',
      accountType: 'personal'
    }
  });

  // Available payment types with icons and colors
  const paymentTypes = [
    { 
      value: 'MoMo', 
      label: 'MoMo', 
      icon: Smartphone, 
      color: '#FF6B35',
      description: 'Mobile Money'
    },
    { 
      value: 'OrangeMoney', 
      label: 'Orange Money', 
      icon: Smartphone, 
      color: '#FF6600',
      description: 'Orange Mobile Money'
    },
    { 
      value: 'OM', 
      label: 'OM', 
      icon: Smartphone, 
      color: '#FF6600',
      description: 'Orange Money (Alternative)'
    },
    { 
      value: 'MTN', 
      label: 'MTN', 
      icon: Smartphone, 
      color: '#FFCC02',
      description: 'MTN Mobile Money'
    },
    { 
      value: 'bank_transfer', 
      label: 'Bank Transfer', 
      icon: Building2, 
      color: '#2196F3',
      description: 'Bank Account'
    },
    { 
      value: 'cash_on_delivery', 
      label: 'Cash on Delivery', 
      icon: Banknote, 
      color: '#4CAF50',
      description: 'Cash Payments'
    },
  ];

  // Update parent when methods change
  useEffect(() => {
    if (onPaymentMethodsChange) {
      onPaymentMethodsChange(methods);
    }
  }, [methods, onPaymentMethodsChange]);

  const getPaymentIcon = (method) => {
    const paymentType = paymentTypes.find(t => t.value === method);
    return paymentType ? paymentType.icon : CreditCard;
  };

  const getPaymentColor = (method) => {
    const paymentType = paymentTypes.find(t => t.value === method);
    return paymentType ? paymentType.color : COLORS.primary;
  };

  const getPaymentLabel = (method) => {
    const paymentType = paymentTypes.find(t => t.value === method);
    return paymentType ? paymentType.label : method;
  };

  const addPayment = () => {
    if (!newPayment.method || !newPayment.value.accountNumber || !newPayment.value.accountName) {
      Alert.alert('Required', 'Please fill in all required fields');
      return;
    }

    // Check if payment method already exists
    if (methods.some(method => method.method === newPayment.method)) {
      Alert.alert('Duplicate', 'This payment method already exists');
      return;
    }

    // Check max methods limit
    if (methods.length >= maxMethods) {
      Alert.alert('Limit Reached', `Maximum ${maxMethods} payment methods allowed`);
      return;
    }

    // Basic validation
    if (newPayment.method === 'bank_transfer' && !newPayment.value.bankName) {
      Alert.alert('Required', 'Bank name is required for bank transfers');
      return;
    }

    const updatedMethods = [...methods, { ...newPayment }];
    setMethods(updatedMethods);
    resetForm();
  };

  const updatePayment = (index) => {
    if (!newPayment.method || !newPayment.value.accountNumber || !newPayment.value.accountName) {
      Alert.alert('Required', 'Please fill in all required fields');
      return;
    }

    // Check if payment method already exists (excluding current index)
    const otherMethods = methods.filter((_, i) => i !== index);
    if (otherMethods.some(method => method.method === newPayment.method)) {
      Alert.alert('Duplicate', 'This payment method already exists');
      return;
    }

    const updatedMethods = [...methods];
    updatedMethods[index] = { ...newPayment };
    setMethods(updatedMethods);
    resetForm();
  };

  const removePayment = (index) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            const updatedMethods = methods.filter((_, i) => i !== index);
            setMethods(updatedMethods);
          }
        }
      ]
    );
  };

  const setPrimaryPayment = (index) => {
    if (!showPrimarySelection) return;
    
    const updatedMethods = methods.map((method, i) => ({
      ...method,
      isPrimary: i === index
    }));
    setMethods(updatedMethods);
  };

  const startAddingPayment = () => {
    setIsAddingPayment(true);
    setEditingIndex(-1);
    resetForm();
  };

  const startEditingPayment = (index) => {
    setEditingIndex(index);
    setIsAddingPayment(true);
    setNewPayment({ ...methods[index] });
  };

  const cancelForm = () => {
    setIsAddingPayment(false);
    setEditingIndex(-1);
    setShowTypeOptions(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPayment({
      method: '',
      value: {
        accountNumber: '',
        accountName: '',
        bankName: '',
        accountType: 'personal'
      }
    });
    setShowTypeOptions(false);
  };

  const selectPaymentType = (type) => {
    setNewPayment(prev => ({ ...prev, method: type }));
    setShowTypeOptions(false);
  };

  const updatePaymentField = (field, value) => {
    setNewPayment(prev => ({
      ...prev,
      value: {
        ...prev.value,
        [field]: value
      }
    }));
  };

  const renderPaymentItem = (payment, index) => {
    const IconComponent = getPaymentIcon(payment.method);
    const color = getPaymentColor(payment.method);
    const label = getPaymentLabel(payment.method);
    const isPrimary = payment.isPrimary;

    return (
      <View key={index} style={[styles.paymentItem, isPrimary && styles.paymentItemPrimary]}>
        <View style={styles.paymentHeader}>
          <View style={styles.paymentType}>
            <View style={styles.paymentTypeIcon}>
              <IconComponent size={24} color={color} />
            </View>
            <Text style={styles.paymentTypeText}>{label}</Text>
          </View>
          {isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Primary</Text>
            </View>
          )}
        </View>

        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Number:</Text>
            <Text style={styles.detailValue}>{payment.value.accountNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Name:</Text>
            <Text style={styles.detailValue}>{payment.value.accountName}</Text>
          </View>
          {payment.value.bankName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bank Name:</Text>
              <Text style={styles.detailValue}>{payment.value.bankName}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Type:</Text>
            <Text style={styles.detailValue}>{payment.value.accountType}</Text>
          </View>
        </View>

        <View style={styles.paymentActions}>
          {showPrimarySelection && !isPrimary && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => setPrimaryPayment(index)}
            >
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Set Primary</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => startEditingPayment(index)}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={() => removePayment(index)}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPaymentForm = () => {
    const selectedType = paymentTypes.find(t => t.value === newPayment.method);
    const IconComponent = selectedType ? selectedType.icon : CreditCard;
    const color = selectedType ? selectedType.color : COLORS.primary;
    const isEditing = editingIndex !== -1;

    return (
      <View style={styles.paymentFormContainer}>
        <Text style={styles.formTitle}>
          {isEditing ? 'Edit Payment Method' : 'Add Payment Method'}
        </Text>
        
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Payment Type</Text>
          <TouchableOpacity
            style={styles.typeSelector}
            onPress={() => setShowTypeOptions(!showTypeOptions)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {newPayment.method && (
                <IconComponent size={20} color={color} style={{ marginRight: SIZES.small }} />
              )}
              <Text style={styles.typeSelectorText}>
                {newPayment.method ? getPaymentLabel(newPayment.method) : 'Select Payment Type'}
              </Text>
            </View>
            <ChevronDown size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {showTypeOptions && (
          <View style={styles.typeOptionsContainer}>
            {paymentTypes.map((type, index) => {
              const IconComponent = type.icon;
              const isLast = index === paymentTypes.length - 1;
              const isSelected = newPayment.method === type.value;
              
              return (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    isLast && styles.typeOptionLast,
                    isSelected && { backgroundColor: '#F0F8FF' }
                  ]}
                  onPress={() => selectPaymentType(type.value)}
                >
                  <IconComponent size={20} color={type.color} />
                  <Text style={styles.typeOptionText}>{type.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Account Number *</Text>
          <TextInput
            style={styles.formInput}
            placeholder={newPayment.method === 'bank_transfer' ? 'Account number' : 'Phone number'}
            value={newPayment.value.accountNumber}
            onChangeText={(value) => updatePaymentField('accountNumber', value)}
            keyboardType={newPayment.method === 'bank_transfer' ? 'numeric' : 'phone-pad'}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Account Name *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Account holder name"
            value={newPayment.value.accountName}
            onChangeText={(value) => updatePaymentField('accountName', value)}
          />
        </View>

        {newPayment.method === 'bank_transfer' && (
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Bank Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Bank name"
              value={newPayment.value.bankName}
              onChangeText={(value) => updatePaymentField('bankName', value)}
            />
          </View>
        )}

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Account Type</Text>
          <View style={styles.accountTypeContainer}>
            <TouchableOpacity
              style={[
                styles.accountTypeButton,
                newPayment.value.accountType === 'personal' && styles.accountTypeButtonSelected
              ]}
              onPress={() => updatePaymentField('accountType', 'personal')}
            >
              <Text style={[
                styles.accountTypeText,
                newPayment.value.accountType === 'personal' && styles.accountTypeTextSelected
              ]}>
                Personal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.accountTypeButton,
                newPayment.value.accountType === 'business' && styles.accountTypeButtonSelected
              ]}
              onPress={() => updatePaymentField('accountType', 'business')}
            >
              <Text style={[
                styles.accountTypeText,
                newPayment.value.accountType === 'business' && styles.accountTypeTextSelected
              ]}>
                Business
              </Text>
            </TouchableOpacity>
          </View>
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
            onPress={isEditing ? () => updatePayment(editingIndex) : addPayment}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Add'} Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CreditCard size={24} color="#2E7D32" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>

        {/* Existing Payment Methods */}
        {methods.length > 0 && (
          <View style={styles.paymentListContainer}>
            {methods.map((payment, index) => renderPaymentItem(payment, index))}
          </View>
        )}

        {/* Add Payment Form */}
        {isAddingPayment ? (
          renderPaymentForm()
        ) : (
          <TouchableOpacity
            style={styles.addPaymentContainer}
            onPress={startAddingPayment}
            disabled={methods.length >= maxMethods}
          >
            <View style={styles.addPaymentButton}>
              <Plus size={24} color={COLORS.primary} />
              <Text style={styles.addPaymentText}>
                {methods.length >= maxMethods ? 'Maximum methods reached' : 'Add Payment Method'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Summary */}
        {methods.length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            {methods.map((payment, index) => {
              const IconComponent = getPaymentIcon(payment.method);
              const color = getPaymentColor(payment.method);
              const label = getPaymentLabel(payment.method);

              return (
                <View key={index} style={styles.summaryItem}>
                  <View style={styles.summaryIcon}>
                    <IconComponent size={16} color={color} />
                  </View>
                  <Text style={styles.summaryText}>
                    {label}: {payment.value.accountNumber} {payment.isPrimary && '(Primary)'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default PaymentMethods;

