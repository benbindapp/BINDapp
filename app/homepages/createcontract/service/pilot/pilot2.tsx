import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
interface PilotInfoProps {
  onBack?: () => void;
  onNext?: (formData: PilotFormData) => void;
}

interface PilotFormData {
  isCaptain: boolean;
  captainName: string;
  sicRequired: boolean;
  sicRequiredName: string;
  isSIC: boolean;
  sicName: string;
  isFlightAttendant: boolean;
  flightAttendantName: string;
  dailyRate: number;
  hasPerDiem: boolean;
  perDiem: number;
  hasExpenseCoverage: boolean;
  expenses: {
    hotel: boolean;
    tickets: boolean;
    transport: boolean;
    meals: boolean;
  };
  expenseRates: {
    hotel: number;
    tickets: number;
    transport: number;
  };
}

const PilotInfo: React.FC<PilotInfoProps> = ({ onBack, onNext }) => {
  const [formData, setFormData] = useState<PilotFormData>({
    isCaptain: false,
    captainName: '',
    sicRequired: false,
    sicRequiredName: '',
    isSIC: false,
    sicName: '',
    isFlightAttendant: false,
    flightAttendantName: '',
    dailyRate: 0,
    hasPerDiem: false,
    perDiem: 0,
    hasExpenseCoverage: false,
    expenses: {
      hotel: false,
      tickets: false,
      transport: false,
      meals: false,
    },
    expenseRates: {
      hotel: 150,
      tickets: 500,
      transport: 100,
    },
  });

  const router = useRouter()
  const toggleCaptain = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      isCaptain: value,
      captainName: value ? prev.captainName : '',
      // Reset SIC when toggling captain
      isSIC: value ? false : prev.isSIC,
      sicName: value ? '' : prev.sicName,
      // Reset SIC Required when turning off captain
      sicRequired: value ? prev.sicRequired : false,
      sicRequiredName: value ? prev.sicRequiredName : '',
    }));
  };

  const toggleSICRequired = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      sicRequired: value,
      sicRequiredName: value ? prev.sicRequiredName : '',
    }));
  };

  const toggleSIC = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      isSIC: value,
      sicName: value ? prev.sicName : '',
    }));
  };

  const toggleFlightAttendant = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      isFlightAttendant: value,
      flightAttendantName: value ? prev.flightAttendantName : '',
    }));
  };

  const togglePerDiem = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasPerDiem: value,
      perDiem: value ? prev.perDiem : 0,
    }));
  };

  const toggleExpenseCoverage = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasExpenseCoverage: value,
      expenses: value ? prev.expenses : {
        hotel: false,
        tickets: false,
        transport: false,
        meals: false,
      },
    }));
  };

  const toggleExpense = (expense: keyof PilotFormData['expenses'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [expense]: value,
      },
    }));
  };

  const updateExpenseRate = (expense: keyof PilotFormData['expenseRates'], value: string) => {
    setFormData(prev => ({
      ...prev,
      expenseRates: {
        ...prev.expenseRates,
        [expense]: parseInt(value) || prev.expenseRates[expense],
      },
    }));
  };

  const updateField = (field: keyof PilotFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateExpenseBreakdown = () => {
    const items: { label: string; amount: string }[] = [];
    let total = 0;

    // Add per diem if enabled
    if (formData.hasPerDiem && formData.perDiem > 0) {
      items.push({
        label: 'Per Diem',
        amount: `$${formData.perDiem.toLocaleString()}`,
      });
      total += formData.perDiem;
    }

    // Add expenses if coverage is enabled
    if (formData.hasExpenseCoverage) {
      Object.entries(formData.expenses).forEach(([key, selected]) => {
        if (selected) {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          
          if (key === 'meals') {
            items.push({
              label,
              amount: 'TBD',
            });
          } else {
            const amount = formData.expenseRates[key as keyof PilotFormData['expenseRates']];
            items.push({
              label,
              amount: `$${amount.toLocaleString()}`,
            });
            total += amount;
          }
        }
      });
    }

    return { items, total };
  };

  const { items: expenseItems, total: expenseTotal } = calculateExpenseBreakdown();
  const hasExpenses = expenseItems.length > 0;

  const handleNext = () => {
    // Basic validation
    if (!formData.dailyRate) {
      Alert.alert('Missing Information', 'Please fill in the daily rate.');
      return;
    }
    
    if (formData.isCaptain && !formData.captainName) {
      Alert.alert('Missing Information', 'Please enter your captain name.');
      return;
    }
    
    if (formData.sicRequired && !formData.sicRequiredName) {
      Alert.alert('Missing Information', 'Please enter the SIC name.');
      return;
    }

    if (formData.isSIC && !formData.sicName) {
      Alert.alert('Missing Information', 'Please enter your SIC name.');
      return;
    }

    if (formData.isFlightAttendant && !formData.flightAttendantName) {
      Alert.alert('Missing Information', 'Please enter your flight attendant name.');
      return;
    }
    
    console.log('Pilot form data:', formData);
    onNext?.(formData);
  };

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
          <Text style={styles.title}>Pilot Information</Text>
          <Text style={styles.subtitle}>Enter pilot details and rates</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Captain/PIC Toggle */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Captain/PIC</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>I am the Captain/PIC</Text>
              <Switch
                value={formData.isCaptain}
                onValueChange={toggleCaptain}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Captain Name */}
          {formData.isCaptain && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Captain/PIC Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                value={formData.captainName}
                onChangeText={(value) => updateField('captainName', value)}
              />
            </View>
          )}

          {/* SIC Required Toggle (only shows when captain is selected) */}
          {formData.isCaptain && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Second in Command (SIC)</Text>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>SIC Required</Text>
                <Switch
                  value={formData.sicRequired}
                  onValueChange={toggleSICRequired}
                  trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
            </View>
          )}

          {/* SIC Required Name */}
          {formData.isCaptain && formData.sicRequired && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>SIC Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter SIC name"
                placeholderTextColor="#9CA3AF"
                value={formData.sicRequiredName}
                onChangeText={(value) => updateField('sicRequiredName', value)}
              />
            </View>
          )}

          {/* SIC Toggle (standalone - shows when NOT captain) */}
          {!formData.isCaptain && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Second in Command (SIC)</Text>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>I am the SIC</Text>
                <Switch
                  value={formData.isSIC}
                  onValueChange={toggleSIC}
                  trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
            </View>
          )}

          {/* SIC Name (for standalone SIC) */}
          {!formData.isCaptain && formData.isSIC && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>SIC Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                value={formData.sicName}
                onChangeText={(value) => updateField('sicName', value)}
              />
            </View>
          )}

          {/* Flight Attendant Toggle */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Flight Attendant</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>I am the Flight Attendant</Text>
              <Switch
                value={formData.isFlightAttendant}
                onValueChange={toggleFlightAttendant}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Flight Attendant Name */}
          {formData.isFlightAttendant && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Flight Attendant Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                value={formData.flightAttendantName}
                onChangeText={(value) => updateField('flightAttendantName', value)}
              />
            </View>
          )}

          {/* Daily Rate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Daily Rate</Text>
            <Text style={styles.sublabel}>12-hour duty day rate</Text>
            <TextInput
              style={styles.input}
              placeholder="1500"
              placeholderTextColor="#9CA3AF"
              value={formData.dailyRate > 0 ? formData.dailyRate.toString() : ''}
              onChangeText={(value) => updateField('dailyRate', parseInt(value) || 0)}
              keyboardType="numeric"
            />
            
            {/* Rate Display */}
            {formData.dailyRate > 0 && (
              <View style={styles.rateDisplay}>
                <Text style={styles.rateText}>
                  Current Rate: ${formData.dailyRate.toLocaleString()}/day
                </Text>
              </View>
            )}
          </View>

          {/* Per Diem Toggle */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Per Diem</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Per Diem Required</Text>
              <Switch
                value={formData.hasPerDiem}
                onValueChange={togglePerDiem}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Per Diem Input */}
          {formData.hasPerDiem && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Per Diem Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="75"
                placeholderTextColor="#9CA3AF"
                value={formData.perDiem > 0 ? formData.perDiem.toString() : ''}
                onChangeText={(value) => updateField('perDiem', parseInt(value) || 0)}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Expense Coverage Toggle */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Expense Coverage</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Cover Expenses</Text>
              <Switch
                value={formData.hasExpenseCoverage}
                onValueChange={toggleExpenseCoverage}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Individual Expense Toggles */}
          {formData.hasExpenseCoverage && (
            <View style={styles.fieldContainer}>
              <Text style={styles.sublabel}>Select expenses to be covered</Text>
              
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Hotel</Text>
                <Switch
                  value={formData.expenses.hotel}
                  onValueChange={(value) => toggleExpense('hotel', value)}
                  trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
              
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Airline Tickets</Text>
                <Switch
                  value={formData.expenses.tickets}
                  onValueChange={(value) => toggleExpense('tickets', value)}
                  trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
              
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Transportation</Text>
                <Switch
                  value={formData.expenses.transport}
                  onValueChange={(value) => toggleExpense('transport', value)}
                  trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
              
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Crew Meals</Text>
                <Switch
                  value={formData.expenses.meals}
                  onValueChange={(value) => toggleExpense('meals', value)}
                  trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>
            </View>
          )}

          {/* Expense Input Fields */}
          {formData.hasExpenseCoverage && formData.expenses.hotel && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Hotel Rate</Text>
              <TextInput
                style={styles.input}
                placeholder="150"
                placeholderTextColor="#9CA3AF"
                value={formData.expenseRates.hotel.toString()}
                onChangeText={(value) => updateExpenseRate('hotel', value)}
                keyboardType="numeric"
              />
            </View>
          )}

          {formData.hasExpenseCoverage && formData.expenses.tickets && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Airline Tickets Cost</Text>
              <TextInput
                style={styles.input}
                placeholder="500"
                placeholderTextColor="#9CA3AF"
                value={formData.expenseRates.tickets.toString()}
                onChangeText={(value) => updateExpenseRate('tickets', value)}
                keyboardType="numeric"
              />
            </View>
          )}

          {formData.hasExpenseCoverage && formData.expenses.transport && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Transportation Cost</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                placeholderTextColor="#9CA3AF"
                value={formData.expenseRates.transport.toString()}
                onChangeText={(value) => updateExpenseRate('transport', value)}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Expense Estimate */}
          {hasExpenses && (
            <View style={styles.expenseEstimate}>
              <Text style={styles.expenseTitle}>Estimated Expenses</Text>
              <Text style={styles.sublabel}>Real price shown with uploaded receipt</Text>
              
              {expenseItems.map((item, index) => (
                <View key={index} style={styles.expenseItem}>
                  <Text style={styles.expenseLabel}>{item.label}</Text>
                  <Text style={styles.expenseAmount}>{item.amount}</Text>
                </View>
              ))}
              
              <View style={[styles.expenseItem, styles.expenseTotal]}>
                <Text style={styles.expenseLabel}>Total Estimated Expenses</Text>
                <Text style={styles.expenseAmount}>${expenseTotal.toLocaleString()}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 2 of 5</Text>
            <Text style={styles.progressText}>40%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/homepages/createcontract/service/aviation/pilot/pilot3')}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 4,
    flex: 1,
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
    gap: 12,
    marginBottom: 20,
  },
  fieldContainer: {
    gap: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'left',
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'left',
    marginBottom: 8,
    marginTop: -4,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  rateDisplay: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 8,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    textAlign: 'center',
  },
  expenseEstimate: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  expenseTotal: {
    borderBottomWidth: 0,
    fontWeight: '600',
    color: '#2fb035',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  expenseLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
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
    backgroundColor: '#2fb035',
    width: '40%',
    borderRadius: 4,
  },
  nextButtonContainer: {
    marginBottom: 20,
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#2fb035',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PilotInfo;


