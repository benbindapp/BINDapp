import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Plane,
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
  TouchableOpacity,
  View,
} from 'react-native';
const { width } = Dimensions.get('window');

interface PaymentSetup {
  paymentType: string;
  invoiceTerms: string;
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
  const [paymentSetup, setPaymentSetup] = useState<PaymentSetup>({
    paymentType: '',
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

  const router = useRouter()
  const selectPaymentType = (type: string) => {
    setPaymentSetup(prev => ({ ...prev, paymentType: type }));
  };

  const updateInvoiceTerms = (terms: string) => {
    setPaymentSetup(prev => ({ ...prev, invoiceTerms: terms }));
  };

  const togglePaymentMethod = (method: keyof PaymentSetup['paymentMethods']) => {
    setPaymentSetup(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }));
  };

  const toggleSetting = (setting: keyof PaymentSetup['settings']) => {
    setPaymentSetup(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting],
      },
    }));
  };

  const handleComplete = () => {
    if (!paymentSetup.paymentType) {
      Alert.alert('Error', 'Please select a payment type.');
      return;
    }

    const hasPaymentMethod = Object.values(paymentSetup.paymentMethods).some(method => method);
    if (!hasPaymentMethod) {
      Alert.alert('Error', 'Please select at least one payment method.');
      return;
    }

    console.log('Payment setup:', paymentSetup);
    Alert.alert('Success', 'Payment setup completed successfully! Your aviation service contract is ready.');
  };

  const goBack = () => {
    console.log('Going back to pilot protections...');
  };

  const ToggleSwitch: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ isActive, onToggle }) => (
    <TouchableOpacity style={[styles.toggleSwitch, isActive && styles.toggleSwitchActive]} onPress={onToggle}>
      <View style={[styles.toggleSlider, isActive && styles.toggleSliderActive]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Payment Setup</Text>
          <Text style={styles.subtitle}>Configure how you'd like to receive payment</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Payment Type</Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  paymentSetup.paymentType === 'upfront' && styles.gridButtonActive,
                ]}
                onPress={() => selectPaymentType('upfront')}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    paymentSetup.paymentType === 'upfront' && styles.gridButtonTextActive,
                  ]}
                >
                  Expenses Upfront
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  paymentSetup.paymentType === 'invoice' && styles.gridButtonActive,
                ]}
                onPress={() => selectPaymentType('invoice')}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    paymentSetup.paymentType === 'invoice' && styles.gridButtonTextActive,
                  ]}
                >
                  Invoice in Full
                </Text>
              </TouchableOpacity>
            </View>
            {paymentSetup.paymentType === 'invoice' && (
              <View style={styles.invoiceTermsDropdown}>
                <Text style={styles.sublabel}>Select when payment is due</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={paymentSetup.invoiceTerms}
                    onValueChange={updateInvoiceTerms}
                    style={styles.picker}
                  >
                    <Picker.Item label="Upon Completion" value="completion" />
                    <Picker.Item label="Net 15" value="net15" />
                    <Picker.Item label="Net 30" value="net30" />
                  </Picker>
                </View>
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Payment Destination</Text>
            <View style={styles.paymentDestinationCard}>
              <View style={styles.paymentDestinationIcon}>
                <Plane size={20} color="white" />
              </View>
              <View style={styles.paymentDestinationText}>
                <Text style={styles.paymentDestinationName}>AVIATION SERVICES LLC</Text>
              </View>
              <Text style={styles.paymentDestinationAccount}>••••7842</Text>
            </View>
          </View>

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
                  isActive={paymentSetup.paymentMethods.card}
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
                  isActive={paymentSetup.paymentMethods.ach}
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
                  isActive={paymentSetup.paymentMethods.wire}
                  onToggle={() => togglePaymentMethod('wire')}
                />
              </View>
            </View>
          </View>

          <View style={styles.settingContainer}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>Payment Reminders</Text>
              <ToggleSwitch
                isActive={paymentSetup.settings.reminders}
                onToggle={() => toggleSetting('reminders')}
              />
            </View>
            <Text style={styles.settingDescription}>
              Automatically send reminder emails when payment is due.
            </Text>
          </View>

          <View style={styles.settingContainer}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>Pass Credit Card Fees to Client</Text>
              <ToggleSwitch
                isActive={paymentSetup.settings.creditFees}
                onToggle={() => toggleSetting('creditFees')}
              />
            </View>
            <Text style={styles.settingDescription}>
              Add credit card processing fees to the payment amount.{' '}
              <Text style={styles.learnMoreText}>Learn more</Text>
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 4 of 5</Text>
            <Text style={styles.progressText}>80%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        <View style={styles.completeButtonContainer}>
          <TouchableOpacity style={styles.completeButton} onPress={() => router.push('/homepages/createcontract/service/aviation/pilot/pilot5')}>
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

export default PaymentSetupScreen;

