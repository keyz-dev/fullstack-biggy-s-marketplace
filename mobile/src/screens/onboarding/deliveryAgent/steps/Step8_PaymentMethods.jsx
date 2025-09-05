import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDeliveryAgentApplication } from '../../../../stateManagement/contexts/DeliveryAgentApplicationContext';
import PaymentMethods from '../../../../components/forms/PaymentMethods/PaymentMethods';
import styles from './styles/step_8.style';

const Step8_PaymentMethods = ({ onNext, onPrev }) => {
  const {
    deliveryAgentData,
    updateField,
    isLoading,
  } = useDeliveryAgentApplication();

  const [paymentMethods, setPaymentMethods] = useState(deliveryAgentData.paymentMethods || []);

  const handlePaymentMethodsChange = (methods) => {
    setPaymentMethods(methods);
  };

  const handleNext = () => {
    // Validation
    if (paymentMethods.length === 0) {
      Alert.alert('Required', 'Please add at least one payment method');
      return;
    }

    // Update context
    updateField('paymentMethods', paymentMethods);
    onNext();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Payment Methods Component */}
      <PaymentMethods
        paymentMethods={paymentMethods}
        onPaymentMethodsChange={handlePaymentMethodsChange}
        title="Payment Methods"
        subtitle="How do you want to receive payments from customers?"
        showPrimarySelection={true}
        maxMethods={5}
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
    </ScrollView>
  );
};

export default Step8_PaymentMethods;

