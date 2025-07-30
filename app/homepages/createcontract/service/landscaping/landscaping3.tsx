import { Ionicons } from '@expo/vector-icons';
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
  weatherDelays: boolean;
  plantAvailability: boolean;
  seasonalTiming: boolean;
  soilConditions: boolean;
  permitDelays: boolean;
  utilityConflicts: boolean;
  clientChanges: boolean;
  hoaApproval: boolean;
  additionalTerms: string;
}

interface ContingencyItemProps {
  id: keyof FormData;
  title: string;
  description: string;
  selected: boolean;
  onToggle: (id: keyof FormData) => void;
}

const ContingencyItem: React.FC<ContingencyItemProps> = ({
  id,
  title,
  description,
  selected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.contingencyItem, selected && styles.contingencyItemSelected]}
      onPress={() => onToggle(id)}
      activeOpacity={0.7}
    >
      <View style={styles.contingencyHeader}>
        <Text style={styles.contingencyTitle}>{title}</Text>
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && (
            <Ionicons name="checkmark" size={12} color="white" />
          )}
        </View>
      </View>
      <Text style={styles.contingencyDescription}>{description}</Text>
    </TouchableOpacity>
  );
};

const LandscapingContingencies: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    weatherDelays: false,
    plantAvailability: false,
    seasonalTiming: false,
    soilConditions: false,
    permitDelays: false,
    utilityConflicts: false,
    clientChanges: false,
    hoaApproval: false,
    additionalTerms: '',
  });

  const router = useRouter()

  const toggleContingency = (contingencyId: keyof FormData) => {
    if (contingencyId === 'additionalTerms') return;
    
    setFormData(prev => ({
      ...prev,
      [contingencyId]: !prev[contingencyId],
    }));
    
    console.log('Contingency updated:', contingencyId, !formData[contingencyId]);
  };

  const handleAdditionalTermsChange = (text: string) => {
    setFormData(prev => ({
      ...prev,
      additionalTerms: text,
    }));
  };

  const validateForm = (): string[] => {
    const hasContingency = formData.weatherDelays || 
                          formData.plantAvailability || 
                          formData.seasonalTiming || 
                          formData.soilConditions || 
                          formData.permitDelays || 
                          formData.utilityConflicts || 
                          formData.clientChanges || 
                          formData.hoaApproval || 
                          formData.additionalTerms.trim();
    
    const errors: string[] = [];
    if (!hasContingency) {
      errors.push('Please select at least one contingency or provide additional terms');
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      Alert.alert(
        'Please complete the following:',
        errors.join('\n')
      );
      return;
    }
    
    console.log('Landscaping contingencies form data:', formData);
    Alert.alert('Form submitted successfully! Moving to next step...');
    
    // Here you would typically call your onNext callback
    // onNext(formData);
  };

  const handleBack = () => {
    console.log('Going back to previous step');
    // Here you would typically call your onBack callback
    // onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
          <View style={styles.spacer} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Contingencies</Text>
            <Text style={styles.subtitle}>Select applicable contingencies and landscaping conditions</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Weather Delays */}
            <View style={styles.fieldContainer}>
              <ContingencyItem
                id="weatherDelays"
                title="Weather Delays"
                description="Contract Impact: Timeline extensions granted without penalty for extreme weather affecting plant health or work safety. No additional costs for weather delays."
                selected={formData.weatherDelays}
                onToggle={toggleContingency}
              />
            </View>

            {/* Plant Availability */}
            <View style={styles.fieldContainer}>
              <ContingencyItem
                id="plantAvailability"
                title="Plant Availability"
                description="Contract Impact: Timeline extensions allowed for plant shortages. Client may choose substitutions or accept delays without contractor penalty."
                selected={formData.plantAvailability}
                onToggle={toggleContingency}
              />
            </View>

            {/* Seasonal Timing */}
            <View style={styles.fieldContainer}>
              <ContingencyItem
                id="seasonalTiming"
                title="Seasonal Timing"
                description="Contract Impact: Work delayed to optimal planting seasons for plant health. Timeline adjusted to appropriate seasonal windows without penalty."
                selected={formData.seasonalTiming}
                onToggle={toggleContingency}
              />
            </View>

            {/* Soil Conditions */}
            <View style={styles.fieldContainer}>
              <ContingencyItem
                id="soilConditions"
                title="Poor Soil Conditions"
                description="Contract Impact: Additional soil amendments require written approval before proceeding. Timeline adjusted for soil improvement work without penalty."
                selected={formData.soilConditions}
                onToggle={toggleContingency}
              />
            </View>

            {/* Permit Delays */}
            <View style={styles.fieldContainer}>
              <ContingencyItem
                id="permitDelays"
                title="Permit Delays"
                description="Contract Impact: Project timeline paused until landscaping permits obtained. Contractor not liable for permit-related delays or costs."
                selected={formData.permitDelays}
                onToggle={toggleContingency}
              />
            </View>

            {/* Utility Conflicts */}
            <View style={styles.fieldContainer}>
              <ContingencyItem
                id="utilityConflicts"
                title="Utility Conflicts"
                description="Contract Impact: Timeline paused for utility marking and conflicts. Design modifications for utility clearance require client approval."
                selected={formData.utilityConflicts}
                onToggle={toggleContingency}
              />
            </View>

            {/* Client Changes */}
            <View style={styles.fieldContainer}>
              <ContingencyItem
                id="clientChanges"
                title="Client Changes"
                description="Contract Impact: Client-requested changes to plant selections or design result in timeline adjustments and potential additional costs. Change orders required via BIND."
                selected={formData.clientChanges}
                onToggle={toggleContingency}
              />
            </View>

            {/* HOA Approval */}
            <View style={styles.fieldContainer}>
              <ContingencyItem
                id="hoaApproval"
                title="HOA Approval"
                description="Contract Impact: Timeline paused for HOA approval process. Design changes required by HOA may result in additional costs with client approval."
                selected={formData.hoaApproval}
                onToggle={toggleContingency}
              />
            </View>

            {/* Additional Terms */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Additional Terms & Conditions</Text>
              <Text style={styles.sublabel}>Any other specific landscaping terms, conditions, or contingencies</Text>
              <TextInput
                style={styles.textarea}
                value={formData.additionalTerms}
                onChangeText={handleAdditionalTermsChange}
                placeholder="Enter any additional landscaping terms, special conditions, or custom contingencies..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
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
            <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/homepages/createcontract/service/landscaping/landscaping4')}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  spacer: {
    width: 40,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    flex: 1,
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
    gap: 24,
    marginBottom: 32,
  },
  fieldContainer: {
    gap: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 8,
  },
  contingencyItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  contingencyItemSelected: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  contingencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contingencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2fb035',
    borderColor: '#2fb035',
  },
  contingencyDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  textarea: {
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80,
    fontFamily: 'System',
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
    backgroundColor: '#2fb035',
    width: '60%',
    borderRadius: 4,
  },
  nextButtonContainer: {
    marginBottom: 32,
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#2fb035',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LandscapingContingencies;

