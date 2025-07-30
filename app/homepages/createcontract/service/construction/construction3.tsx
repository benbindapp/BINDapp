import { useRouter } from 'expo-router';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ContingenciesProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  weatherDelays: boolean;
  weatherThreshold: string;
  materialDelays: boolean;
  permitDelays: boolean;
  inspectionDelays: boolean;
  hiddenConditions: boolean;
  clientChanges: boolean;
  utilityIssues: boolean;
  forceMajeure: boolean;
  additionalTerms: string;
}

const weatherThresholdOptions = [
  'Heavy rain/snow',
  'Temperatures below 32°F',
  'Winds over 25 mph',
  'Ice conditions',
  'Extreme heat over 95°F',
];

const contingencyData = [
  {
    id: 'weatherDelays',
    title: 'Weather Delays',
    description: 'Contract Impact: Timeline extensions granted without penalty for weather-related delays. No additional costs charged to client for weather delays.',
    hasDetails: true,
  },
  {
    id: 'materialDelays',
    title: 'Material Delays',
    description: 'Contract Impact: Timeline extensions allowed for material shortages. Client may choose alternative materials or accept delays without contractor penalty.',
    hasDetails: false,
  },
  {
    id: 'permitDelays',
    title: 'Permit Delays',
    description: 'Contract Impact: Project timeline paused until permits obtained. Contractor not liable for permit-related delays or associated costs.',
    hasDetails: false,
  },
  {
    id: 'inspectionDelays',
    title: 'Inspection Delays',
    description: 'Contract Impact: Timeline extended for inspection scheduling and corrections. Client responsible for re-inspection fees if work meets standards.',
    hasDetails: false,
  },
  {
    id: 'hiddenConditions',
    title: 'Hidden Conditions',
    description: 'Contract Impact: Additional costs for unforeseen work require written approval before proceeding. Timeline adjusted accordingly without penalty.',
    hasDetails: false,
  },
  {
    id: 'clientChanges',
    title: 'Client Changes',
    description: 'Contract Impact: Client-requested changes result in timeline adjustments and potential additional costs. Change orders required via BIND.',
    hasDetails: false,
  },
  {
    id: 'utilityIssues',
    title: 'Utility Issues',
    description: 'Contract Impact: Timeline paused for utility company delays. Contractor not liable for third-party utility scheduling conflicts.',
    hasDetails: false,
  },
  {
    id: 'forceMajeure',
    title: 'Force Majeure',
    description: 'Contract Impact: Contract suspended during force majeure events. Neither party liable for delays or damages from uncontrollable circumstances.',
    hasDetails: false,
  },
];

const Contingencies: React.FC<ContingenciesProps> = ({
  onBack,
  onNext,
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    weatherDelays: false,
    weatherThreshold: '',
    materialDelays: false,
    permitDelays: false,
    inspectionDelays: false,
    hiddenConditions: false,
    clientChanges: false,
    utilityIssues: false,
    forceMajeure: false,
    additionalTerms: '',
  });

  const [showWeatherThresholdModal, setShowWeatherThresholdModal] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleContingency = (contingencyId: keyof FormData) => {
    const newValue = !formData[contingencyId];
    setFormData(prev => ({
      ...prev,
      [contingencyId]: newValue,
      // Clear weather threshold if weather delays is deselected
      ...(contingencyId === 'weatherDelays' && !newValue ? { weatherThreshold: '' } : {})
    }));
  };

  const handleWeatherThresholdSelect = (threshold: string) => {
    setFormData(prev => ({
      ...prev,
      weatherThreshold: threshold
    }));
    setShowWeatherThresholdModal(false);
  };

  const validateForm = (): string[] => {
    // At least one contingency should be selected or additional terms provided
    const hasContingency = formData.weatherDelays || formData.materialDelays || 
                         formData.permitDelays || formData.inspectionDelays || 
                         formData.hiddenConditions || formData.clientChanges || 
                         formData.utilityIssues || formData.forceMajeure || 
                         formData.additionalTerms.trim();
    
    const errors = [];
    if (!hasContingency) {
      errors.push('Please select at least one contingency or provide additional terms');
    }
    
    if (formData.weatherDelays && !formData.weatherThreshold) {
      errors.push('Please specify weather threshold conditions');
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      Alert.alert('Please complete the following', errors.join('\n'));
      return;
    }

    console.log('Contingencies form data:', formData);
    onNext?.(formData);
  };

  const renderWeatherThresholdOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalOption}
      onPress={() => handleWeatherThresholdSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.modalOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderContingencyItem = ({ item }: { item: typeof contingencyData[0] }) => {
    const isSelected = formData[item.id as keyof FormData] as boolean;
    
    return (
      <View style={styles.fieldContainer}>
        <TouchableOpacity
          style={[
            styles.contingencyItem,
            isSelected && styles.contingencyItemSelected
          ]}
          onPress={() => toggleContingency(item.id as keyof FormData)}
          activeOpacity={0.8}
        >
          <View style={styles.contingencyHeader}>
            <Text style={styles.contingencyTitle}>{item.title}</Text>
            <View style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected
            ]}>
              {isSelected && <Check size={12} color="white" />}
            </View>
          </View>
          <Text style={styles.contingencyDescription}>
            <Text style={styles.boldText}>Contract Impact:</Text>
            {item.description.replace('Contract Impact:', '').trim()}
          </Text>
          
          {/* Weather Details Section */}
          {item.id === 'weatherDelays' && isSelected && (
            <View style={styles.weatherDetails}>
              <Text style={styles.label}>Weather Threshold</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowWeatherThresholdModal(true)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.dropdownButtonText,
                  !formData.weatherThreshold && styles.placeholderText
                ]}>
                  {formData.weatherThreshold || 'Select weather conditions'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
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
          <Text style={styles.title}>Contingencies</Text>
          <Text style={styles.subtitle}>Select applicable contingencies and conditions</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <FlatList
            data={contingencyData}
            keyExtractor={(item) => item.id}
            renderItem={renderContingencyItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />

          {/* Additional Terms */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Additional Terms & Conditions</Text>
            <Text style={styles.sublabel}>Any other specific terms, conditions, or contingencies</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Enter any additional terms, special conditions, or custom contingencies..."
              placeholderTextColor="#9CA3AF"
              value={formData.additionalTerms}
              onChangeText={(value) => handleInputChange('additionalTerms', value)}
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
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/homepages/createcontract/service/construction/construction4')}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Weather Threshold Modal */}
      <Modal
        visible={showWeatherThresholdModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWeatherThresholdModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Weather Conditions</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowWeatherThresholdModal(false)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={weatherThresholdOptions}
              keyExtractor={(item) => item}
              renderItem={renderWeatherThresholdOption}
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
    textAlign: 'left',
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'left',
    marginBottom: 8,
    marginTop: -8,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textarea: {
    minHeight: 80,
    paddingTop: 14,
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
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
    color: '#111827',
  },
  weatherDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalCloseButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#2fb035',
    fontWeight: '600',
  },
  modalList: {
    paddingHorizontal: 20,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#111827',
  },
});

export default Contingencies;

