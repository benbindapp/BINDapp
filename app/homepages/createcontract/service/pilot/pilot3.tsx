import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface PilotProtectionsProps {
  onBack?: () => void;
  onNext?: (formData: ProtectionFormData) => void;
}

interface ProtectionFormData {
  cancellation: {
    active: boolean;
    time: number;
    unit: 'hours' | 'days';
    fee: number;
  };
  overdue: {
    active: boolean;
    percent: number;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  picAuthority: {
    active: boolean;
  };
  payment: {
    active: boolean;
    terms: 'net15' | 'net30' | 'upfront' | 'completion';
  };
  forceMajeure: {
    active: boolean;
  };
}

interface ProtectionSummaryItem {
  name: string;
  detail: string;
}

const PilotProtections: React.FC<PilotProtectionsProps> = ({ onBack, onNext }) => {
  const [protectionData, setProtectionData] = useState<ProtectionFormData>({
    cancellation: { active: false, time: 0, unit: 'hours', fee: 0 },
    overdue: { active: false, percent: 0, frequency: 'daily' },
    picAuthority: { active: false },
    payment: { active: false, terms: 'net30' },
    forceMajeure: { active: false },
  });

  const toggleProtection = (type: keyof ProtectionFormData, value: boolean) => {
    setProtectionData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        active: value
      }
    }));
  };

  const updateCancellationTime = (time: string) => {
    setProtectionData(prev => ({
      ...prev,
      cancellation: {
        ...prev.cancellation,
        time: parseInt(time) || 0
      }
    }));
  };

  const updateCancellationUnit = (unit: 'hours' | 'days') => {
    setProtectionData(prev => ({
      ...prev,
      cancellation: {
        ...prev.cancellation,
        unit
      }
    }));
  };

  const updateCancellationFee = (fee: string) => {
    setProtectionData(prev => ({
      ...prev,
      cancellation: {
        ...prev.cancellation,
        fee: parseInt(fee) || 0
      }
    }));
  };

  const updateOverduePercent = (percent: string) => {
    setProtectionData(prev => ({
      ...prev,
      overdue: {
        ...prev.overdue,
        percent: parseInt(percent) || 0
      }
    }));
  };

  const updateOverdueFrequency = (frequency: 'daily' | 'weekly' | 'monthly') => {
    setProtectionData(prev => ({
      ...prev,
      overdue: {
        ...prev.overdue,
        frequency
      }
    }));
  };

  const updatePaymentTerms = (terms: 'net15' | 'net30' | 'upfront' | 'completion') => {
    setProtectionData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        terms
      }
    }));
  };

  const getProtectionsSummary = (): ProtectionSummaryItem[] => {
    const summary: ProtectionSummaryItem[] = [];

    Object.entries(protectionData).forEach(([key, data]) => {
      if (data.active) {
        let name = '';
        let detail = '';

        switch (key) {
          case 'cancellation':
            name = 'Cancellation Fee Policy';
            detail = (data.time > 0 && data.fee > 0) 
              ? `${data.time} ${data.unit} notice - $${data.fee}` 
              : 'Terms TBD';
            break;
          case 'overdue':
            name = 'Overdue Payment Fees';
            detail = data.percent > 0 
              ? `${data.percent}% ${data.frequency}` 
              : 'Rate TBD';
            break;
          case 'picAuthority':
            name = 'PIC Final Authority';
            detail = 'Safety decisions';
            break;
          case 'payment':
            name = 'Payment Terms';
            detail = data.terms
              .replace('net', 'Net ')
              .replace('upfront', 'Estimated expenses upfront')
              .replace('completion', 'Upon completion');
            break;
          case 'forceMajeure':
            name = 'Force Majeure';
            detail = 'Weather/ATC/mechanical';
            break;
        }

        if (name && detail) {
          summary.push({ name, detail });
        }
      }
    });

    return summary;
  };

  const router = useRouter()
  const protectionsSummary = getProtectionsSummary();
  const hasProtections = protectionsSummary.length > 0;

  const handleNext = () => {
    const selectedProtections = Object.entries(protectionData)
      .filter(([_, data]) => data.active)
      .map(([type, data]) => ({ type, ...data }));

    console.log('Selected protections:', selectedProtections);
    onNext?.(protectionData);
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
          <Text style={styles.title}>Pilot Protections</Text>
          <Text style={styles.subtitle}>Select contingencies to protect pilot interests</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Cancellation Fee Policy */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Cancellation Fee Policy</Text>
                <Text style={styles.toggleDescription}>
                  Charge cancellation fee for trips cancelled within specified timeframe
                </Text>
              </View>
              <Switch
                value={protectionData.cancellation.active}
                onValueChange={(value) => toggleProtection('cancellation', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Cancellation Fee Details */}
          {protectionData.cancellation.active && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Cancellation Policy</Text>
              <View style={styles.dualInputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Hours or days"
                  placeholderTextColor="#9CA3AF"
                  value={protectionData.cancellation.time > 0 ? protectionData.cancellation.time.toString() : ''}
                  onChangeText={updateCancellationTime}
                  keyboardType="numeric"
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={protectionData.cancellation.unit}
                    onValueChange={updateCancellationUnit}
                    style={styles.picker}
                  >
                    <Picker.Item label="Hours" value="hours" />
                    <Picker.Item label="Days" value="days" />
                  </Picker>
                </View>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Dollar amount"
                placeholderTextColor="#9CA3AF"
                value={protectionData.cancellation.fee > 0 ? protectionData.cancellation.fee.toString() : ''}
                onChangeText={updateCancellationFee}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Overdue Payment Fees */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Overdue Payment Fees</Text>
                <Text style={styles.toggleDescription}>
                  Late payment penalties for invoices past due date
                </Text>
              </View>
              <Switch
                value={protectionData.overdue.active}
                onValueChange={(value) => toggleProtection('overdue', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Overdue Fee Details */}
          {protectionData.overdue.active && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Late Payment Penalty</Text>
              <View style={styles.dualInputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="2"
                  placeholderTextColor="#9CA3AF"
                  value={protectionData.overdue.percent > 0 ? protectionData.overdue.percent.toString() : ''}
                  onChangeText={updateOverduePercent}
                  keyboardType="numeric"
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={protectionData.overdue.frequency}
                    onValueChange={updateOverdueFrequency}
                    style={styles.picker}
                  >
                    <Picker.Item label="% per day" value="daily" />
                    <Picker.Item label="% per week" value="weekly" />
                    <Picker.Item label="% per month" value="monthly" />
                  </Picker>
                </View>
              </View>
            </View>
          )}

          {/* PIC Final Authority */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>PIC Final Authority</Text>
                <Text style={styles.toggleDescription}>
                  Pilot-in-command has final say on all safety decisions
                </Text>
              </View>
              <Switch
                value={protectionData.picAuthority.active}
                onValueChange={(value) => toggleProtection('picAuthority', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Payment Terms */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Payment Terms Protection</Text>
                <Text style={styles.toggleDescription}>
                  Define payment schedule and enforce prompt payment
                </Text>
              </View>
              <Switch
                value={protectionData.payment.active}
                onValueChange={(value) => toggleProtection('payment', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Payment Terms Details */}
          {protectionData.payment.active && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Payment Due</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={protectionData.payment.terms}
                  onValueChange={updatePaymentTerms}
                  style={styles.picker}
                >
                  <Picker.Item label="Net 15 days" value="net15" />
                  <Picker.Item label="Net 30 days" value="net30" />
                  <Picker.Item label="Estimated expenses upfront" value="upfront" />
                  <Picker.Item label="Upon completion" value="completion" />
                </Picker>
              </View>
            </View>
          )}

          {/* Force Majeure */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Force Majeure Protection</Text>
                <Text style={styles.toggleDescription}>
                  Protection from penalties due to weather, ATC, or mechanical delays
                </Text>
              </View>
              <Switch
                value={protectionData.forceMajeure.active}
                onValueChange={(value) => toggleProtection('forceMajeure', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Selected Protections Summary */}
          {hasProtections && (
            <View style={styles.protectionsSummary}>
              <Text style={styles.summaryTitle}>Selected Protections</Text>
              {protectionsSummary.map((item, index) => (
                <View key={index} style={styles.protectionItem}>
                  <Text style={styles.protectionName}>{item.name}</Text>
                  <Text style={styles.protectionDetail}>{item.detail}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 3 of 5</Text>
            <Text style={styles.progressText}>60%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/homepages/createcontract/service/aviation/pilot/pilot4')}
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
  toggleContent: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dualInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#111827',
  },
  protectionsSummary: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  protectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  protectionName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  protectionDetail: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
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
    width: '60%',
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

export default PilotProtections;

