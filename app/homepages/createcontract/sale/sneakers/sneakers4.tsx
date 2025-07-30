import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ArrowLeft
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface CustomPlan {
  numberOfPayments: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  firstPaymentDate: string;
}

interface FormData {
  salePrice: string;
  paymentType: 'one-time' | 'installments' | '';
  hasDeposit: boolean;
  depositAmount: string;
  paymentMethod: string;
  installmentPlan: '3-months' | '6-months' | 'custom' | '';
  customPlan: CustomPlan;
  // Payment method toggles
  acceptCard: boolean;
  acceptACH: boolean;
  acceptWire: boolean;
  acceptAffirm: boolean;
  // Settings toggles
  dueReminders: boolean;
  passOnFees: boolean;
}

const PaymentDetails: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    salePrice: '',
    paymentType: '',
    hasDeposit: false,
    depositAmount: '',
    paymentMethod: '',
    installmentPlan: '',
    customPlan: {
      numberOfPayments: '',
      frequency: 'monthly',
      firstPaymentDate: ''
    },
    // Payment method toggles
    acceptCard: true,
    acceptACH: false,
    acceptWire: false,
    acceptAffirm: false,
    // Settings toggles
    dueReminders: true,
    passOnFees: false
  });

  const router = useRouter()

  const [showCustomPlanDropdown, setShowCustomPlanDropdown] = useState<boolean>(false);

  const handleSalePriceChange = (value: string): void => {
    const numericValue = value.replace(/[^\d.]/g, '');
    setFormData(prev => ({
      ...prev,
      salePrice: numericValue
    }));
  };

  const handlePaymentTypeSelect = (type: 'one-time' | 'installments'): void => {
    setFormData(prev => ({
      ...prev,
      paymentType: type,
      installmentPlan: type === 'one-time' ? '' : prev.installmentPlan
    }));
  };

  const handleDepositToggle = (): void => {
    setFormData(prev => ({
      ...prev,
      hasDeposit: !prev.hasDeposit,
      depositAmount: !prev.hasDeposit ? prev.depositAmount : ''
    }));
  };

  const handleDepositAmountChange = (value: string): void => {
    const numericValue = value.replace(/[^\d.]/g, '');
    setFormData(prev => ({
      ...prev,
      depositAmount: numericValue
    }));
  };

  const handleInstallmentPlanSelect = (planId: '3-months' | '6-months' | 'custom'): void => {
    setFormData(prev => ({ ...prev, installmentPlan: planId }));
    if (planId === 'custom') {
      setShowCustomPlanDropdown(true);
    } else {
      setShowCustomPlanDropdown(false);
    }
  };

  const handleCustomPlanChange = (field: keyof CustomPlan, value: string): void => {
    setFormData(prev => ({
      ...prev,
      customPlan: {
        ...prev.customPlan,
        [field]: value
      }
    }));
  };

  const handlePaymentMethodToggle = (method: keyof FormData, enabled: boolean): void => {
    setFormData(prev => ({
      ...prev,
      [method]: enabled
    }));
  };

  const handleSettingToggle = (setting: keyof FormData, enabled: boolean): void => {
    setFormData(prev => ({
      ...prev,
      [setting]: enabled
    }));
  };

  const formatCurrency = (value: string): string => {
    if (!value) return '';
    const number = parseFloat(value);
    return isNaN(number) ? value : `$${number.toLocaleString()}`;
  };

  const calculateCustomPaymentAmount = (): string => {
    const totalAmount = parseFloat(formData.salePrice || '0');
    const depositAmount = formData.hasDeposit ? parseFloat(formData.depositAmount || '0') : 0;
    const remainingAmount = totalAmount - depositAmount;
    const numberOfPayments = parseInt(formData.customPlan.numberOfPayments || '1');
    
    if (numberOfPayments > 0) {
      return formatCurrency((remainingAmount / numberOfPayments).toString());
    }
    return '$0';
  };

  const handleNext = (): void => {
    console.log('Payment details:', formData);
    // Navigate to review & sign step
  };

  const installmentOptions = [
    {
      id: '3-months' as const,
      label: '3 Monthly Payments',
      desc: formatCurrency((parseFloat(formData.salePrice || '0') / 3).toString()) + ' per month'
    },
    {
      id: '6-months' as const,
      label: '6 Monthly Payments',
      desc: formatCurrency((parseFloat(formData.salePrice || '0') / 6).toString()) + ' per month'
    },
    {
      id: 'custom' as const,
      label: 'Custom Plan',
      desc: 'Set your own schedule'
    }
  ];

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const ToggleSwitch: React.FC<{
    isEnabled: boolean;
    onToggle: () => void;
    disabled?: boolean;
  }> = ({ isEnabled, onToggle, disabled = false }) => {
    return (
      <TouchableOpacity
        onPress={disabled ? undefined : onToggle}
        disabled={disabled}
        style={styles.toggleContainer}
      >
        <View style={[
          styles.toggleTrack,
          isEnabled ? styles.toggleTrackActive : styles.toggleTrackInactive,
          disabled && styles.toggleTrackDisabled
        ]}>
          <View style={[
            styles.toggleThumb,
            isEnabled ? styles.toggleThumbActive : styles.toggleThumbInactive
          ]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Payment Details</Text>
          <Text style={styles.subtitle}>Fill in the payment information</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          
          {/* Sale Price */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Sale Price:</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="10,000"
                placeholderTextColor="#9ca3af"
                value={formData.salePrice}
                onChangeText={handleSalePriceChange}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Choose Payment Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Choose payment type:</Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                onPress={() => handlePaymentTypeSelect('one-time')}
                style={[
                  styles.gridButton,
                  formData.paymentType === 'one-time' && styles.gridButtonActive
                ]}
              >
                <Text style={[
                  styles.gridButtonText,
                  formData.paymentType === 'one-time' && styles.gridButtonTextActive
                ]}>
                  One-Time Payment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePaymentTypeSelect('installments')}
                style={[
                  styles.gridButton,
                  formData.paymentType === 'installments' && styles.gridButtonActive
                ]}
              >
                <Text style={[
                  styles.gridButtonText,
                  formData.paymentType === 'installments' && styles.gridButtonTextActive
                ]}>
                  Installments
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Deposit */}
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              onPress={handleDepositToggle}
              style={[
                styles.depositButton,
                formData.hasDeposit && styles.depositButtonActive
              ]}
            >
              <View style={styles.depositButtonContent}>
                <View style={[
                  styles.checkbox,
                  formData.hasDeposit && styles.checkboxActive
                ]}>
                  {formData.hasDeposit && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={[
                  styles.depositButtonText,
                  formData.hasDeposit && styles.depositButtonTextActive
                ]}>
                  + Add Deposit
                </Text>
              </View>
            </TouchableOpacity>

            {/* Deposit Amount Field */}
            {formData.hasDeposit && (
              <View style={styles.depositAmountContainer}>
                <Text style={styles.fieldLabel}>Deposit Amount:</Text>
                <View style={styles.depositInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.depositInput}
                    placeholder="2,000"
                    placeholderTextColor="#9ca3af"
                    value={formData.depositAmount}
                    onChangeText={handleDepositAmountChange}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Installment Plan Options */}
          {formData.paymentType === 'installments' && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Installment Plan:</Text>
              <View style={styles.installmentOptions}>
                {installmentOptions.map((plan) => (
                  <View key={plan.id}>
                    <TouchableOpacity
                      onPress={() => handleInstallmentPlanSelect(plan.id)}
                      style={[
                        styles.installmentOption,
                        formData.installmentPlan === plan.id && styles.installmentOptionActive
                      ]}
                    >
                      <View style={styles.installmentOptionContent}>
                        <View style={[
                          styles.radioButton,
                          formData.installmentPlan === plan.id && styles.radioButtonActive
                        ]}>
                          {formData.installmentPlan === plan.id && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                        <View style={styles.installmentOptionText}>
                          <Text style={styles.installmentOptionLabel}>{plan.label}</Text>
                          <Text style={styles.installmentOptionDesc}>{plan.desc}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Custom Plan Dropdown */}
                    {plan.id === 'custom' && showCustomPlanDropdown && formData.installmentPlan === 'custom' && (
                      <View style={styles.customPlanDropdown}>
                        {/* Number of Payments */}
                        <View style={styles.customPlanField}>
                          <Text style={styles.customPlanLabel}>Number of payments:</Text>
                          <TextInput
                            style={styles.customPlanInput}
                            placeholder="e.g., 4"
                            placeholderTextColor="#9ca3af"
                            value={formData.customPlan.numberOfPayments}
                            onChangeText={(value) => handleCustomPlanChange('numberOfPayments', value)}
                            keyboardType="numeric"
                          />
                        </View>

                        {/* Payment Frequency */}
                        <View style={styles.customPlanField}>
                          <Text style={styles.customPlanLabel}>Payment frequency:</Text>
                          <View style={styles.frequencyButtons}>
                            {frequencyOptions.map((option) => (
                              <TouchableOpacity
                                key={option.value}
                                onPress={() => handleCustomPlanChange('frequency', option.value)}
                                style={[
                                  styles.frequencyButton,
                                  formData.customPlan.frequency === option.value && styles.frequencyButtonActive
                                ]}
                              >
                                <Text style={[
                                  styles.frequencyButtonText,
                                  formData.customPlan.frequency === option.value && styles.frequencyButtonTextActive
                                ]}>
                                  {option.label}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>

                        {/* First Payment Date */}
                        <View style={styles.customPlanField}>
                          <Text style={styles.customPlanLabel}>First payment date:</Text>
                          <TextInput
                            style={styles.customPlanInput}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#9ca3af"
                            value={formData.customPlan.firstPaymentDate}
                            onChangeText={(value) => handleCustomPlanChange('firstPaymentDate', value)}
                          />
                        </View>

                        {/* Payment Amount Preview */}
                        {formData.customPlan.numberOfPayments && (
                          <View style={styles.paymentPreview}>
                            <View style={styles.paymentPreviewContent}>
                              <Text style={styles.paymentPreviewLabel}>Payment amount:</Text>
                              <Text style={styles.paymentPreviewAmount}>
                                {calculateCustomPaymentAmount()} per {formData.customPlan.frequency.replace('-', ' ')}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Payment Destination */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Payment destination</Text>
            
            <View style={styles.paymentDestinationCard}>
              <View style={styles.paymentDestinationContent}>
                <View style={styles.paymentDestinationIcon}>
                  <Ionicons name="business-outline" size={24} color="white" />
                </View>
                <View style={styles.paymentDestinationText}>
                  <Text style={styles.paymentDestinationName}>CHOICE FINANCIAL GROUP</Text>
                </View>
                <Text style={styles.paymentDestinationAccount}>••••9748</Text>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Payment methods</Text>
            
            <View style={styles.paymentMethodsList}>
              {/* Credit/Debit Card */}
              <View style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodContent}>
                  <View style={styles.paymentMethodLeft}>
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons name="card-outline" size={24} color="white" />
                    </View>
                    <Text style={styles.paymentMethodTitle}>Credit/Debit Card</Text>
                  </View>
                  <ToggleSwitch
                    isEnabled={formData.acceptCard}
                    onToggle={() => handlePaymentMethodToggle('acceptCard', !formData.acceptCard)}
                  />
                </View>
              </View>

              {/* ACH/Bank Transfers */}
              <View style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodContent}>
                  <View style={styles.paymentMethodLeft}>
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons name="business-outline" size={24} color="white" />
                    </View>
                    <Text style={styles.paymentMethodTitle}>ACH/Bank Transfers</Text>
                  </View>
                  <ToggleSwitch
                    isEnabled={formData.acceptACH}
                    onToggle={() => handlePaymentMethodToggle('acceptACH', !formData.acceptACH)}
                  />
                </View>
              </View>

              {/* Wire Transfers */}
              <View style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodContent}>
                  <View style={styles.paymentMethodLeft}>
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons name="flash-outline" size={24} color="white" />
                    </View>
                    <View>
                      <Text style={styles.paymentMethodTitle}>Wire Transfers</Text>
                      <Text style={styles.paymentMethodSubtitle}>Required for $1M+</Text>
                    </View>
                  </View>
                  <ToggleSwitch
                    isEnabled={formData.acceptWire}
                    onToggle={() => handlePaymentMethodToggle('acceptWire', !formData.acceptWire)}
                  />
                </View>
              </View>

              {/* Sign Now, Pay Later */}
              <View style={[styles.paymentMethodCard, styles.paymentMethodCardDisabled]}>
                <View style={styles.paymentMethodContent}>
                  <View style={styles.paymentMethodLeft}>
                    <View style={[styles.paymentMethodIcon, styles.paymentMethodIconDisabled]}>
                      <Ionicons name="calendar-outline" size={24} color="white" />
                    </View>
                    <View>
                      <Text style={styles.paymentMethodTitleDisabled}>Sign Now, Pay Later</Text>
                      <Text style={styles.paymentMethodSubtitleDisabled}>Financed by ⚬Affirm</Text>
                    </View>
                  </View>
                  <View style={styles.disabledToggleContainer}>
                    <Ionicons name="lock-closed" size={16} color="#9ca3af" />
                    <ToggleSwitch
                      isEnabled={false}
                      onToggle={() => {}}
                      disabled={true}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Due Reminders */}
          <View style={styles.settingContainer}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>Due reminders</Text>
              <ToggleSwitch
                isEnabled={formData.dueReminders}
                onToggle={() => handleSettingToggle('dueReminders', !formData.dueReminders)}
              />
            </View>
            <Text style={styles.settingDescription}>
              Automatically send reminder emails to responsible party members when payment is due.
            </Text>
          </View>

          {/* Pass on Fees to Payer */}
          <View style={styles.settingContainer}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>Pass on fees to payer</Text>
              <ToggleSwitch
                isEnabled={formData.passOnFees}
                onToggle={() => handleSettingToggle('passOnFees', !formData.passOnFees)}
              />
            </View>
            <Text style={styles.settingDescription}>
              Adds a surcharge to the payment amount to cover processing fees. <Text style={styles.learnMoreText}>Learn more</Text>
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Step 4 of 5</Text>
            <Text style={styles.progressLabel}>80%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity onPress={() => router.push('/homepages/createcontract/sale/sneakers/sneakers5')} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 4,
    paddingBottom: 120,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  formContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'left',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  currencySymbol: {
    fontSize: 20,
    color: '#6b7280',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    color: '#111827',
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  gridButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  gridButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  gridButtonTextActive: {
    color: '#047857',
  },
  depositButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  depositButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  depositButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    borderColor: '#10b981',
    backgroundColor: '#10b981',
  },
  depositButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  depositButtonTextActive: {
    color: '#047857',
  },
  depositAmountContainer: {
    marginTop: 16,
  },
  depositInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  depositInput: {
    flex: 1,
    fontSize: 18,
    color: '#111827',
  },
  installmentOptions: {
    gap: 12,
  },
  installmentOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  installmentOptionActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  installmentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#10b981',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  installmentOptionText: {
    flex: 1,
  },
  installmentOptionLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  installmentOptionDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  customPlanDropdown: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  customPlanField: {
    marginBottom: 16,
  },
  customPlanLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  customPlanInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  frequencyButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#111827',
  },
  frequencyButtonTextActive: {
    color: '#047857',
  },
  paymentPreview: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  paymentPreviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentPreviewLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  paymentPreviewAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  paymentDestinationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  paymentDestinationContent: {
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
    color: '#9ca3af',
  },
  paymentMethodsList: {
    gap: 12,
  },
  paymentMethodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  paymentMethodCardDisabled: {
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  paymentMethodContent: {
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
  paymentMethodIconDisabled: {
    backgroundColor: '#9ca3af',
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  paymentMethodTitleDisabled: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
  },
  paymentMethodSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  paymentMethodSubtitleDisabled: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  disabledToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleContainer: {
    padding: 4,
  },
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleTrackActive: {
    backgroundColor: '#10b981',
  },
  toggleTrackInactive: {
    backgroundColor: '#d1d5db',
  },
  toggleTrackDisabled: {
    backgroundColor: '#d1d5db',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    left: 26,
  },
  toggleThumbInactive: {
    left: 2,
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
    color: '#6b7280',
    lineHeight: 20,
  },
  learnMoreText: {
    color: '#10b981',
    textDecorationLine: 'underline',
  },
  progressContainer: {
    marginBottom: 16,
    marginTop: 'auto',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  }
});

export default PaymentDetails;

