import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Building2,
    CreditCard,
    Home,
    Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CateringPaymentDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  serviceCost: string;
  paymentType: 'upfront' | 'invoice' | '';
  depositAmount: string;
  invoiceTerms: 'completion' | 'net15' | 'net30';
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

const CateringPaymentDetails: React.FC<CateringPaymentDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    serviceCost: '',
    paymentType: '',
    depositAmount: '',
    invoiceTerms: 'completion',
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

  const [showPaymentBreakdown, setShowPaymentBreakdown] = useState(false);

  const formatCurrency = (value: string): string => {
    // Remove all non-numeric characters except decimal point
    let cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    let parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      cleanValue = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return cleanValue;
  };

  const handleServiceCostChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setFormData(prev => ({
      ...prev,
      serviceCost: formattedValue
    }));
    updatePaymentBreakdown(formattedValue, formData.depositAmount);
  };

  const handleDepositAmountChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    setFormData(prev => ({
      ...prev,
      depositAmount: formattedValue
    }));
    updatePaymentBreakdown(formData.serviceCost, formattedValue);
  };

  const updatePaymentBreakdown = (totalCost: string, depositAmount: string) => {
    const total = parseFloat(totalCost) || 0;
    const deposit = parseFloat(depositAmount) || 0;
    
    // Show breakdown if both amounts are valid and deposit doesn't exceed total
    setShowPaymentBreakdown(
      total > 0 && deposit > 0 && deposit <= total && formData.paymentType === 'upfront'
    );
  };

  const selectPaymentType = (type: 'upfront' | 'invoice') => {
    setFormData(prev => ({
      ...prev,
      paymentType: type,
      depositAmount: type === 'invoice' ? '' : prev.depositAmount
    }));
    
    if (type === 'invoice') {
      setShowPaymentBreakdown(false);
    } else {
      updatePaymentBreakdown(formData.serviceCost, formData.depositAmount);
    }
  };

  const updateInvoiceTerms = (terms: 'completion' | 'net15' | 'net30') => {
    setFormData(prev => ({
      ...prev,
      invoiceTerms: terms
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

  const validateForm = (): string[] => {
    const errors = [];
    
    if (!formData.serviceCost || parseFloat(formData.serviceCost) <= 0) {
      errors.push('Please enter a valid total cost');
    }
    
    if (!formData.paymentType) {
      errors.push('Please select a payment type');
    }
    
    if (formData.paymentType === 'upfront') {
      if (!formData.depositAmount || parseFloat(formData.depositAmount) <= 0) {
        errors.push('Please enter a valid deposit amount');
      }
      
      const totalCost = parseFloat(formData.serviceCost) || 0;
      const depositAmount = parseFloat(formData.depositAmount) || 0;
      
      if (depositAmount > totalCost) {
        errors.push('Deposit amount cannot exceed total cost');
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

    console.log('Payment details data:', formData);
    onNext?.(formData);
  };

  const learnMore = () => {
    Alert.alert(
      'Credit Card Fees',
      'Credit card processing fees are typically 2.9% + $0.30 per transaction. When enabled, these fees will be added to the total amount charged to your client.'
    );
  };

  const formatDisplayCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getRemainingLabel = (): string => {
    const terms = formData.invoiceTerms;
    if (terms === 'net15') return 'Remaining (Due Net 15):';
    if (terms === 'net30') return 'Remaining (Due Net 30):';
    return 'Remaining (Due Upon Service):';
  };

  const ToggleSwitch: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ 
    isActive, 
    onToggle 
  }) => (
    <TouchableOpacity 
      style={[styles.toggleSwitch, isActive && styles.toggleSwitchActive]} 
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleSlider, isActive && styles.toggleSliderActive]} />
    </TouchableOpacity>
  );

  // Calculate breakdown values
  const totalCost = parseFloat(formData.serviceCost) || 0;
  const depositAmount = parseFloat(formData.depositAmount) || 0;
  const remainingAmount = totalCost - depositAmount;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Payment Setup</Text>
          <Text style={styles.subtitle}>Configure how you'd like to receive payment</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Total Cost */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total Cost</Text>
            <Text style={styles.sublabel}>Enter the total cost for the catering service</Text>
            <View style={styles.currencyInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.costInput}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                value={formData.serviceCost}
                onChangeText={handleServiceCostChange}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Payment Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Payment Type</Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.paymentType === 'upfront' && styles.gridButtonActive,
                ]}
                onPress={() => selectPaymentType('upfront')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.paymentType === 'upfront' && styles.gridButtonTextActive,
                  ]}
                >
                  Catering Deposit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.paymentType === 'invoice' && styles.gridButtonActive,
                ]}
                onPress={() => selectPaymentType('invoice')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.paymentType === 'invoice' && styles.gridButtonTextActive,
                  ]}
                >
                  Pay After Service
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Invoice Terms Dropdown */}
            {formData.paymentType === 'invoice' && (
              <View style={styles.invoiceTermsDropdown}>
                <Text style={styles.sublabel}>Select when payment is due</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.invoiceTerms}
                    onValueChange={(value) => updateInvoiceTerms(value as 'completion' | 'net15' | 'net30')}
                    style={styles.picker}
                  >
                    <Picker.Item label="Upon Service Completion" value="completion" />
                    <Picker.Item label="Net 15" value="net15" />
                    <Picker.Item label="Net 30" value="net30" />
                  </Picker>
                </View>
              </View>
            )}

            {/* Deposit Amount Section */}
            {formData.paymentType === 'upfront' && (
              <View style={styles.depositAmountSection}>
                <Text style={styles.sublabel}>Enter catering deposit amount</Text>
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.depositInput}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    value={formData.depositAmount}
                    onChangeText={handleDepositAmountChange}
                    keyboardType="numeric"
                  />
                </View>
                
                {/* Payment Breakdown */}
                {showPaymentBreakdown && (
                  <View style={styles.paymentBreakdown}>
                    <Text style={styles.breakdownHeader}>Payment Schedule:</Text>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>Catering Deposit (Due Now):</Text>
                      <Text style={styles.breakdownValue}>{formatDisplayCurrency(depositAmount)}</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>{getRemainingLabel()}</Text>
                      <Text style={styles.breakdownValue}>{formatDisplayCurrency(remainingAmount)}</Text>
                    </View>
                    <View style={styles.breakdownTotal}>
                      <Text style={styles.breakdownTotalLabel}>Total Catering Cost:</Text>
                      <Text style={styles.breakdownTotalValue}>{formatDisplayCurrency(totalCost)}</Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Payment Destination */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Payment Destination</Text>
            <View style={styles.paymentDestinationCard}>
              <View style={styles.paymentDestinationIcon}>
                <Home size={20} color="white" />
              </View>
              <View style={styles.paymentDestinationText}>
                <Text style={styles.paymentDestinationName}>ELITE CATERING SERVICES LLC</Text>
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
                    <CreditCard size={20} color="white" />
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
                    <Building2 size={20} color="white" />
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
                    <Zap size={20} color="white" />
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
              Automatically send reminder emails when payment is due.
            </Text>
          </View>

          {/* Credit Card Fees Setting */}
          <View style={styles.settingContainer}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>Pass Credit Card Fees to Client</Text>
              <ToggleSwitch
                isActive={formData.settings.creditFees}
                onToggle={() => toggleSetting('creditFees')}
              />
            </View>
            <Text style={styles.settingDescription}>
              Add credit card processing fees to the payment amount.{' '}
              <Text style={styles.learnMoreText} onPress={learnMore}>Learn more</Text>
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

        {/* Next Button */}
        <View style={styles.completeButtonContainer}>
          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={() => router.push('/homepages/createcontract/service/catering/catering5')}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>Review Details</Text>
          </TouchableOpacity>
        </View>
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
  headerSpacer: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 12,
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
  buttonGrid: {
    flexDirection: 'row',
    gap: 12,
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
  invoiceTermsDropdown: {
    marginTop: 12,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  depositAmountSection: {
    marginTop: 12,
  },
  paymentBreakdown: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  breakdownHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  breakdownTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
    borderTopWidth: 2,
    borderTopColor: '#2fb035',
    marginTop: 8,
  },
  breakdownTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  breakdownTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2fb035',
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
    marginBottom: 12,
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
    marginBottom: 20,
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
  completeButtonContainer: {
    marginBottom: 20,
  },
  completeButton: {
    width: '100%',
    backgroundColor: '#2fb035',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
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

export default CateringPaymentDetails;

