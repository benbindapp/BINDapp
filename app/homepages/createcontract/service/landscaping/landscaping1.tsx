import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
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

interface ServiceDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  serviceType: string;
  frequency: 'one-time' | 'recurring' | '';
  recurringFrequency: string;
  propertyLocation: string;
  startDate: string;
  endDate: string;
  clientName: string;
  serviceDescription: string;
}

const serviceTypeOptions = [
  'Lawn Care & Maintenance',
  'Garden Design & Installation',
  'Tree & Shrub Services',
  'Hardscaping',
  'Irrigation Systems',
  'Landscape Lighting',
  'Seasonal Cleanup',
  'Mulching & Edging',
  'Sod Installation',
  'Retaining Walls',
  'Patio & Walkway Installation',
  'Drainage Solutions',
  'Other',
];

const recurringFrequencyOptions = [
  'Weekly',
  'Bi-Weekly',
  'Monthly',
  'Quarterly',
  'Seasonally',
];

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    frequency: '',
    recurringFrequency: '',
    propertyLocation: '',
    startDate: '',
    endDate: '',
    clientName: 'Johnson Smith', // Auto-populated from previous selection
    serviceDescription: '',
  });
  const router = useRouter()

  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [showRecurringFrequencyModal, setShowRecurringFrequencyModal] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFrequencySelect = (frequency: 'one-time' | 'recurring') => {
    setFormData(prev => ({
      ...prev,
      frequency: frequency,
      recurringFrequency: frequency === 'one-time' ? '' : prev.recurringFrequency
    }));
  };

  const handleServiceTypeSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      serviceType: type
    }));
    setShowServiceTypeModal(false);
  };

  const handleRecurringFrequencySelect = (frequency: string) => {
    setFormData(prev => ({
      ...prev,
      recurringFrequency: frequency
    }));
    setShowRecurringFrequencyModal(false);
  };

  const validateForm = (): string[] => {
    const errors = [];
    
    if (!formData.serviceType) errors.push('Type of service is required');
    if (!formData.frequency) errors.push('Service frequency is required');
    if (formData.frequency === 'recurring' && !formData.recurringFrequency) {
      errors.push('Recurring frequency is required');
    }
    if (!formData.propertyLocation) errors.push('Property location is required');
    if (!formData.startDate) errors.push('Start date is required');
    if (!formData.serviceDescription) errors.push('Service description is required');
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields:\n' + errors.join('\n'));
      return;
    }
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        Alert.alert('Invalid Dates', 'End date must be after start date');
        return;
      }
    }

    console.log('Landscaping service form data:', formData);
    onNext?.(formData);
  };

  const renderServiceTypeOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalOption}
      onPress={() => handleServiceTypeSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.modalOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRecurringFrequencyOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalOption}
      onPress={() => handleRecurringFrequencySelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.modalOptionText}>{item}</Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.title}>Service Details</Text>
          <Text style={styles.subtitle}>Fill in the details of the landscaping service to be provided</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Type of Service */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type of Service</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowServiceTypeModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.dropdownButtonText,
                !formData.serviceType && styles.placeholderText
              ]}>
                {formData.serviceType || 'Select type'}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Service Frequency */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Service Frequency</Text>
            <View style={styles.serviceTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.serviceTypeOption,
                  formData.frequency === 'one-time' && styles.serviceTypeOptionSelected,
                ]}
                onPress={() => handleFrequencySelect('one-time')}
                activeOpacity={0.8}
              >
                <Text style={styles.serviceTypeTitle}>One-Time</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.serviceTypeOption,
                  formData.frequency === 'recurring' && styles.serviceTypeOptionSelected,
                ]}
                onPress={() => handleFrequencySelect('recurring')}
                activeOpacity={0.8}
              >
                <Text style={styles.serviceTypeTitle}>Recurring</Text>
              </TouchableOpacity>
            </View>
            
            {/* Recurring Frequency Details */}
            {formData.frequency === 'recurring' && (
              <View style={styles.recurringFrequency}>
                <Text style={styles.label}>How Often?</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowRecurringFrequencyModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.dropdownButtonText,
                    !formData.recurringFrequency && styles.placeholderText
                  ]}>
                    {formData.recurringFrequency || 'Select frequency'}
                  </Text>
                  <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Property Location */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Property Location</Text>
            <Text style={styles.sublabel}>Street address where landscaping work will be performed</Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main Street, City, State, ZIP"
              placeholderTextColor="#9CA3AF"
              value={formData.propertyLocation}
              onChangeText={(value) => handleInputChange('propertyLocation', value)}
            />
          </View>

          {/* Service Timeline */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Service Timeline</Text>
            <Text style={styles.sublabel}>Preferred start date and completion timeline</Text>
            <View style={styles.dateRow}>
              <TextInput
                style={styles.input}
                placeholder="Start Date (YYYY-MM-DD)"
                placeholderTextColor="#9CA3AF"
                value={formData.startDate}
                onChangeText={(value) => handleInputChange('startDate', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="End Date (if applicable)"
                placeholderTextColor="#9CA3AF"
                value={formData.endDate}
                onChangeText={(value) => handleInputChange('endDate', value)}
              />
            </View>
          </View>

          {/* Client/Property Owner */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Client/Property Owner</Text>
            <View style={styles.clientCard}>
              <View style={styles.clientAvatar}>
                <Text style={styles.clientAvatarText}>JS</Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>Johnson Smith</Text>
                <Text style={styles.clientType}>Property Owner</Text>
              </View>
            </View>
          </View>

          {/* Service Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Service Description</Text>
            <Text style={styles.sublabel}>Detailed description of landscaping work to be performed</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describe the specific landscaping services needed, areas of focus, special requirements, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.serviceDescription}
              onChangeText={(value) => handleInputChange('serviceDescription', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 1 of 5</Text>
            <Text style={styles.progressText}>20%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/homepages/createcontract/service/landscaping/landscaping2')}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Service Type Modal */}
      <Modal
        visible={showServiceTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowServiceTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Type of Service</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowServiceTypeModal(false)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={serviceTypeOptions}
              keyExtractor={(item) => item}
              renderItem={renderServiceTypeOption}
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Recurring Frequency Modal */}
      <Modal
        visible={showRecurringFrequencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRecurringFrequencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Frequency</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowRecurringFrequencyModal(false)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recurringFrequencyOptions}
              keyExtractor={(item) => item}
              renderItem={renderRecurringFrequencyOption}
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
    minHeight: 100,
    paddingTop: 14,
  },
  dropdownButton: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
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
  serviceTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  serviceTypeOption: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  serviceTypeOptionSelected: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  serviceTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  recurringFrequency: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  clientCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2fb035',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  clientAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  clientType: {
    fontSize: 14,
    color: '#6B7280',
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
    width: '20%',
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
    maxHeight: '70%',
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

export default ServiceDetails;

