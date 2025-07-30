import { useRouter } from 'expo-router';
import {
    ArrowLeft
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FormData {
  monthlyRent: string;
  paymentDueDate: string;
  customDay: string;
  hasSecurityDeposit: string;
  securityDeposit: string;
  isRefundable: string;
  paymentMethods: {
    card: boolean;
    ach: boolean;
    wire: boolean;
  };
  settings: {
    reminders: boolean;
    creditFees: boolean;
  };
}

const PaymentSetupScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    monthlyRent: '',
    paymentDueDate: '',
    customDay: '',
    hasSecurityDeposit: '',
    securityDeposit: '',
    isRefundable: '',
    paymentMethods: {
      card: true,
      ach: false,
      wire: false,
    },
    settings: {
      reminders: true,
      creditFees: false,
    },
  });

  const formatCurrency = (value: string): string => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    return cleanValue;
  };
  const router = useRouter()
  const handleBack = () => {
    console.log('Going back to previous step');
    // Here you would typically call your onBack callback
    // onBack();
  };

  const selectPaymentDueDate = (type: string) => {
    setFormData(prev => ({
      ...prev,
      paymentDueDate: type,
      customDay: type !== 'custom' ? '' : prev.customDay,
    }));
  };

  const selectSecurityDeposit = (choice: string) => {
    setFormData(prev => ({
      ...prev,
      hasSecurityDeposit: choice,
      securityDeposit: choice === 'no' ? '' : prev.securityDeposit,
      isRefundable: choice === 'no' ? '' : prev.isRefundable,
    }));
  };

  const selectRefundable = (choice: string) => {
    setFormData(prev => ({
      ...prev,
      isRefundable: choice,
    }));
  };

  const togglePaymentMethod = (method: keyof FormData['paymentMethods']) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }));
  };

  const toggleSetting = (setting: keyof FormData['settings']) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting],
      },
    }));
  };

  const learnMore = () => {
    Alert.alert(
      'Credit Card Fees',
      'Credit card processing fees are typically 2.9% + $0.30 per transaction. When enabled, these fees will be added to the total amount charged to your tenant.'
    );
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.monthlyRent || parseFloat(formData.monthlyRent) <= 0) {
      errors.push('Please enter a valid monthly rent amount');
    }

    if (!formData.paymentDueDate) {
      errors.push('Please select a payment due date');
    }

    if (
      formData.paymentDueDate === 'custom' &&
      (!formData.customDay ||
        parseInt(formData.customDay) < 1 ||
        parseInt(formData.customDay) > 31)
    ) {
      errors.push('Please enter a valid custom day (1-31)');
    }

    if (!formData.hasSecurityDeposit) {
      errors.push('Please specify if you require a security deposit');
    }

    if (formData.hasSecurityDeposit === 'yes') {
      if (!formData.securityDeposit || parseFloat(formData.securityDeposit) <= 0) {
        errors.push('Please enter a valid security deposit amount');
      }
      if (!formData.isRefundable) {
        errors.push('Please specify if the security deposit is refundable');
      }
    }

    const hasPaymentMethod = Object.values(formData.paymentMethods).some(method => method);
    if (!hasPaymentMethod) {
      errors.push('Please select at least one payment method');
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();

    if (errors.length > 0) {
      Alert.alert('Please complete the following', errors.join('\n'));
      return;
    }

    console.log('Payment setup data:', formData);
    Alert.alert('Success', 'Payment setup complete! Moving to review...');

    // Here you would typically call your onNext callback
    // onNext(formData);
  };

  const handleMonthlyRentChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setFormData(prev => ({ ...prev, monthlyRent: formattedValue }));
  };

  const handleSecurityDepositChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setFormData(prev => ({ ...prev, securityDeposit: formattedValue }));
  };

  const handleCustomDayChange = (value: string) => {
    const numValue = parseInt(value);
    if (numValue < 1) value = '';
    if (numValue > 31) value = '31';
    setFormData(prev => ({ ...prev, customDay: value }));
  };

  const ToggleSwitch: React.FC<{ isActive: boolean; onToggle: () => void }> = ({
    isActive,
    onToggle,
  }) => (
    <TouchableOpacity
      style={[styles.toggleSwitch, isActive && styles.toggleSwitchActive]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleSlider, isActive && styles.toggleSliderActive]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Payment Setup</Text>
          <Text style={styles.subtitle}>Configure how you'd like to receive rent payment</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Monthly Rent */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Monthly Rent</Text>
            <Text style={styles.sublabel}>Enter the monthly rent amount</Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.costInput}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                value={formData.monthlyRent}
                onChangeText={handleMonthlyRentChange}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Payment Due Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Payment Due Date</Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.paymentDueDate === 'firstDay' && styles.gridButtonActive,
                ]}
                onPress={() => selectPaymentDueDate('firstDay')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.paymentDueDate === 'firstDay' && styles.gridButtonTextActive,
                  ]}
                >
                  First Day of Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.paymentDueDate === 'lastDay' && styles.gridButtonActive,
                ]}
                onPress={() => selectPaymentDueDate('lastDay')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.paymentDueDate === 'lastDay' && styles.gridButtonTextActive,
                  ]}
                >
                  Last Day of Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.paymentDueDate === 'custom' && styles.gridButtonActive,
                ]}
                onPress={() => selectPaymentDueDate('custom')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.paymentDueDate === 'custom' && styles.gridButtonTextActive,
                  ]}
                >
                  Custom
                </Text>
              </TouchableOpacity>
            </View>

            {/* Custom Day Input */}
            {formData.paymentDueDate === 'custom' && (
              <View style={styles.customDaySection}>
                <Text style={styles.sublabel}>Enter day of month (1-31)</Text>
                <TextInput
                  style={styles.customDayInput}
                  placeholder="15"
                  placeholderTextColor="#9CA3AF"
                  value={formData.customDay}
                  onChangeText={handleCustomDayChange}
                  keyboardType="numeric"
                />
              </View>
            )}
          </View>

          {/* Security Deposit */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Security Deposit</Text>
            <Text style={styles.sublabel}>Will you require a security deposit?</Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.hasSecurityDeposit === 'yes' && styles.gridButtonActive,
                ]}
                onPress={() => selectSecurityDeposit('yes')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.hasSecurityDeposit === 'yes' && styles.gridButtonTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.hasSecurityDeposit === 'no' && styles.gridButtonActive,
                ]}
                onPress={() => selectSecurityDeposit('no')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.hasSecurityDeposit === 'no' && styles.gridButtonTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security Deposit Details */}
            {formData.hasSecurityDeposit === 'yes' && (
              <View style={styles.customDaySection}>
                <Text style={styles.sublabel}>Security deposit amount</Text>
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.depositInput}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    value={formData.securityDeposit}
                    onChangeText={handleSecurityDepositChange}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.refundableSection}>
                  <Text style={styles.sublabel}>Is the security deposit refundable?</Text>
                  <View style={styles.buttonGrid}>
                    <TouchableOpacity
                      style={[
                        styles.gridButton,
                        formData.isRefundable === 'yes' && styles.gridButtonActive,
                      ]}
                      onPress={() => selectRefundable('yes')}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.gridButtonText,
                          formData.isRefundable === 'yes' && styles.gridButtonTextActive,
                        ]}
                      >
                        Refundable
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.gridButton,
                        formData.isRefundable === 'no' && styles.gridButtonActive,
                      ]}
                      onPress={() => selectRefundable('no')}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.gridButtonText,
                          formData.isRefundable === 'no' && styles.gridButtonTextActive,
                        ]}
                      >
                        Non-Refundable
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Payment Destination */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Payment Destination</Text>
            <View style={styles.paymentDestinationCard}>
              <View style={styles.paymentDestinationIcon}>
                <Text style={styles.iconText}>🏠</Text>
              </View>
              <View style={styles.paymentDestinationText}>
                <Text style={styles.paymentDestinationName}>PROPERTY MANAGEMENT LLC</Text>
              </View>
              <Text style={styles.paymentDestinationAccount}>••••7842</Text>
            </View>
          </View>

          {/* Accepted Payment Methods */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Accepted Payment Methods</Text>
            <Text style={styles.sublabel}>Select which payment methods you'll accept</Text>

            <View style={styles.paymentMethodsList}>
              <View style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodLeft}>
                  <View style={styles.paymentMethodIcon}>
                    <Text style={styles.iconText}>💳</Text>
                  </View>
                  <View style={styles.paymentMethodText}>
                    <Text style={styles.paymentMethodTitle}>Credit/Debit Card</Text>
                  </View>
                </View>
                <ToggleSwitch
                  isActive={formData.paymentMethods.card}
                  onToggle={() => togglePaymentMethod('card')}
                />
              </View>

              <View style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodLeft}>
                  <View style={styles.paymentMethodIcon}>
                    <Text style={styles.iconText}>🏛️</Text>
                  </View>
                  <View style={styles.paymentMethodText}>
                    <Text style={styles.paymentMethodTitle}>ACH/Bank Transfer</Text>
                    <Text style={styles.paymentMethodSubtitle}>1-3 business days</Text>
                  </View>
                </View>
                <ToggleSwitch
                  isActive={formData.paymentMethods.ach}
                  onToggle={() => togglePaymentMethod('ach')}
                />
              </View>

              <View style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodLeft}>
                  <View style={styles.paymentMethodIcon}>
                    <Text style={styles.iconText}>⚡</Text>
                  </View>
                  <View style={styles.paymentMethodText}>
                    <Text style={styles.paymentMethodTitle}>Wire Transfer</Text>
                    <Text style={styles.paymentMethodSubtitle}>Same day, higher fees</Text>
                  </View>
                </View>
                <ToggleSwitch
                  isActive={formData.paymentMethods.wire}
                  onToggle={() => togglePaymentMethod('wire')}
                />
              </View>
            </View>
          </View>

          {/* Payment Reminders Setting */}
          <View style={styles.settingContainer}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>Payment Reminders</Text>
              <ToggleSwitch
                isActive={formData.settings.reminders}
                onToggle={() => toggleSetting('reminders')}
              />
            </View>
            <Text style={styles.settingDescription}>
              Automatically send reminder emails when rent payment is due.
            </Text>
          </View>

          {/* Credit Card Fees Setting */}
          <View style={styles.settingContainer}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>Pass Credit Card Fees to Tenant</Text>
              <ToggleSwitch
                isActive={formData.settings.creditFees}
                onToggle={() => toggleSetting('creditFees')}
              />
            </View>
            <Text style={styles.settingDescription}>
              Add credit card processing fees to the rent payment amount.{' '}
              <Text style={styles.learnMoreText} onPress={learnMore}>
                Learn more
              </Text>
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 4 of 5</Text>
            <Text style={styles.progressText}>80%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Complete Button */}
        <TouchableOpacity style={styles.completeButton} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.completeButtonText}>Review Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#6B7280',
  },
  spacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  currencyInputContainer: {
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -12,
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
    zIndex: 1,
  },
  costInput: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingLeft: 40,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  depositInput: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingLeft: 40,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  customDayInput: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  gridButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  gridButtonActive: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  gridButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  gridButtonTextActive: {
    color: '#16a34a',
  },
  customDaySection: {
    marginTop: 16,
  },
  refundableSection: {
    marginTop: 16,
  },
  paymentDestinationCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDestinationIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#111827',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentDestinationText: {
    flex: 1,
  },
  paymentDestinationName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  paymentDestinationAccount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  paymentMethodsList: {
    gap: 12,
  },
  paymentMethodCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#111827',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodText: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  paymentMethodSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  iconText: {
    fontSize: 20,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#2fb035',
  },
  toggleSlider: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  toggleSliderActive: {
    transform: [{ translateX: 20 }],
  },
  settingContainer: {
    marginBottom: 24,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  learnMoreText: {
    color: '#2fb035',
    textDecorationLine: 'underline',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '80%',
    backgroundColor: '#2fb035',
    borderRadius: 4,
  },
  completeButton: {
    width: '100%',
    backgroundColor: '#2fb035',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#2fb035',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PaymentSetupScreen;

