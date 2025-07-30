import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CleaningContingenciesProps {
  onBack?: () => void;
  onNext?: (contingencyData: ContingencyFormData) => void;
}

interface ContingencyFormData {
  photoRequirement: { active: boolean };
  accessContingency: { active: boolean };
  petSafety: { active: boolean };
  weatherDelay: { active: boolean };
  toolsUtilities: { active: boolean };
  excessWork: { active: boolean };
  stopWork: { active: boolean };
}

interface ContingencySummaryItem {
  name: string;
  detail: string;
}

const CleaningContingencies: React.FC<CleaningContingenciesProps> = ({
  onBack,
  onNext,
}) => {
  const router = useRouter()
  const [contingencyData, setContingencyData] = useState<ContingencyFormData>({
    photoRequirement: { active: false },
    accessContingency: { active: false },
    petSafety: { active: false },
    weatherDelay: { active: false },
    toolsUtilities: { active: false },
    excessWork: { active: false },
    stopWork: { active: false },
  });

  const toggleContingency = (type: keyof ContingencyFormData, value: boolean) => {
    setContingencyData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        active: value
      }
    }));
  };

  const getContingenciesSummary = (): ContingencySummaryItem[] => {
    const summary: ContingencySummaryItem[] = [];

    Object.entries(contingencyData).forEach(([key, data]) => {
      if (data.active) {
        let name = '';
        let detail = '';

        switch (key) {
          case 'photoRequirement':
            name = 'Photo Requirement';
            detail = 'Before/after photos uploaded for job confirmation';
            break;
          case 'accessContingency':
            name = 'Access Contingency';
            detail = '15-minute access window or rebooking fee applies';
            break;
          case 'petSafety':
            name = 'Pet & Safety Contingency';
            detail = 'Pets secured, unsafe conditions may pause job';
            break;
          case 'weatherDelay':
            name = 'Weather Delay';
            detail = 'Outdoor services may be rescheduled for weather';
            break;
          case 'toolsUtilities':
            name = 'Tools & Utilities';
            detail = 'Water, electricity access required or reschedule';
            break;
          case 'excessWork':
            name = 'Excess Work Contingency';
            detail = 'Additional payment or reschedule for excess work';
            break;
          case 'stopWork':
            name = 'Stop Work Contingency';
            detail = 'Provider can stop for unsafe/misrepresented conditions';
            break;
        }

        if (name && detail) {
          summary.push({ name, detail });
        }
      }
    });

    return summary;
  };

  const contingenciesSummary = getContingenciesSummary();
  const hasContingencies = contingenciesSummary.length > 0;

  const handleNext = () => {
    const selectedContingencies = Object.entries(contingencyData)
      .filter(([_, data]) => data.active)
      .map(([type, data]) => ({ type, ...data }));

    console.log('Selected contingencies:', selectedContingencies);
    onNext?.(contingencyData);
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
          <Text style={styles.title}>Service Expectations</Text>
          <Text style={styles.subtitle}>Set expectations for your cleaning service</Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerBold}>Note:</Text> These are operational expectations, not legal terms. 
            Both parties agree to discuss and resolve any issues fairly.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Photo Requirement */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Photo Requirement</Text>
                <Text style={styles.toggleDescription}>
                  Service provider uploads clear photos before and after the job to confirm service completion
                </Text>
              </View>
              <Switch
                value={contingencyData.photoRequirement.active}
                onValueChange={(value) => toggleContingency('photoRequirement', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Access Contingency */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Access Contingency</Text>
                <Text style={styles.toggleDescription}>
                  If provider cannot access location within 15 minutes of arrival, job may be canceled and rebooking fee may apply
                </Text>
              </View>
              <Switch
                value={contingencyData.accessContingency.active}
                onValueChange={(value) => toggleContingency('accessContingency', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Pet & Safety Contingency */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Pet & Safety Contingency</Text>
                <Text style={styles.toggleDescription}>
                  Pets must be secured before job starts. Provider can pause or cancel if they feel unsafe entering the space
                </Text>
              </View>
              <Switch
                value={contingencyData.petSafety.active}
                onValueChange={(value) => toggleContingency('petSafety', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Weather Delay */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Weather Delay</Text>
                <Text style={styles.toggleDescription}>
                  Outdoor services may be delayed or rescheduled due to weather conditions
                </Text>
              </View>
              <Switch
                value={contingencyData.weatherDelay.active}
                onValueChange={(value) => toggleContingency('weatherDelay', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Tools & Utilities */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Tools & Utilities</Text>
                <Text style={styles.toggleDescription}>
                  Client must provide access to water, electricity, or other required resources. If not available, provider may reschedule
                </Text>
              </View>
              <Switch
                value={contingencyData.toolsUtilities.active}
                onValueChange={(value) => toggleContingency('toolsUtilities', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Excess Work Contingency */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Excess Work Contingency</Text>
                <Text style={styles.toggleDescription}>
                  If job site is excessively dirty or cluttered beyond what was agreed upon, provider can request additional payment or reschedule
                </Text>
              </View>
              <Switch
                value={contingencyData.excessWork.active}
                onValueChange={(value) => toggleContingency('excessWork', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Stop Work Contingency */}
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Stop Work Contingency</Text>
                <Text style={styles.toggleDescription}>
                  Provider can stop work at any time if environment is unsafe, contains hazards, or was misrepresented in the request
                </Text>
              </View>
              <Switch
                value={contingencyData.stopWork.active}
                onValueChange={(value) => toggleContingency('stopWork', value)}
                trackColor={{ false: '#E5E7EB', true: '#2fb035' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Selected Contingencies Summary */}
          {hasContingencies && (
            <View style={styles.contingenciesSummary}>
              <Text style={styles.summaryTitle}>Selected Expectations</Text>
              {contingenciesSummary.map((item, index) => (
                <View key={index} style={styles.contingencyItem}>
                  <Text style={styles.contingencyName}>{item.name}</Text>
                  <Text style={styles.contingencyDetail}>{item.detail}</Text>
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
            onPress={() => router.push('/homepages/createcontract/service/cleaning/cleaning4')}
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
  disclaimerContainer: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#1E40AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  disclaimerBold: {
    fontWeight: 'bold',
  },
  formContainer: {
    gap: 12,
    marginBottom: 20,
  },
  fieldContainer: {
    gap: 12,
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
  contingenciesSummary: {
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
  contingencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contingencyName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  contingencyDetail: {
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

export default CleaningContingencies;

