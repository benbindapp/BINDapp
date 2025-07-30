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

interface CleaningProtectionsProps {
  onBack?: () => void;
  onNext?: (protectionData: ProtectionFormData) => void;
}

interface ProtectionFormData {
  cancellation: {
    active: boolean;
    time: number;
    unit: 'hours' | 'days';
    fee: number;
  };
  weather: {
    active: boolean;
  };
  access: {
    active: boolean;
  };
  scope: {
    active: boolean;
  };
  damage: {
    active: boolean;
  };
}

interface ProtectionSummaryItem {
  name: string;
  detail: string;
}

const CleaningProtections: React.FC<CleaningProtectionsProps> = ({
  onBack,
  onNext,
}) => {

  const router = useRouter()
  const [protectionData, setProtectionData] = useState<ProtectionFormData>({
    cancellation: { active: false, time: 24, unit: 'hours', fee: 100 },
    weather: { active: false },
    access: { active: false },
    scope: { active: false },
    damage: { active: false },
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
          case 'weather':
            name = 'Weather Delay Protection';
            detail = 'Weather delays covered';
            break;
          case 'access':
            name = 'Access Requirements';
            detail = 'Adequate workspace required';
            break;
          case 'scope':
            name = 'Service Scope Protection';
            detail = 'Additional work approval required';
            break;
          case 'damage':
            name = 'Pre-existing Damage Limitation';
            detail = 'Pre-existing damage protection';
            break;
        }

        if (name && detail) {
          summary.push({ name, detail });
        }
      }
    });

    return summary;
  };

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
          <Text style={styles.title}>Cleaning Protections</Text>
          <Text style={styles.subtitle}>Select contingencies to protect your cleaning service interests</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Cancellation Fee Policy */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Cancellation Fee Policy</Text>
                <Text style={styles.toggleDescription}>
                  Charge cancellation fee for services cancelled within specified timeframe
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

          {/* Weather Delay Protection */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Weather Delay Protection</Text>
                <Text style={styles.toggleDescription}>
                  Protection from penalties due to weather delays that prevent service
                </Text>
              </View>
              <Switch
                value={protectionData.weather.active}
                onValueChange={(value) => toggleProtection('weather', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Access Requirements */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Access Requirements</Text>
                <Text style={styles.toggleDescription}>
                  Client must provide adequate hangar access, power, and workspace
                </Text>
              </View>
              <Switch
                value={protectionData.access.active}
                onValueChange={(value) => toggleProtection('access', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Service Scope Protection */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Service Scope Protection</Text>
                <Text style={styles.toggleDescription}>
                  Additional work beyond agreed scope requires separate approval and billing
                </Text>
              </View>
              <Switch
                value={protectionData.scope.active}
                onValueChange={(value) => toggleProtection('scope', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Pre-existing Damage Limitation */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Pre-existing Damage Limitation</Text>
                <Text style={styles.toggleDescription}>
                  Protection from liability for pre-existing damage to aircraft
                </Text>
              </View>
              <Switch
                value={protectionData.damage.active}
                onValueChange={(value) => toggleProtection('damage', value)}
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
            onPress={() => router.push('/homepages/createcontract/service/cleaning/aviation/planecleaning4')}
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
    width: '80%',
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

export default CleaningProtections;

