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
  workType: string;
  serviceType: 'repair' | 'install' | 'maintenance' | '';
  workLocation: string;
  startDate: string;
  endDate: string;
  description: string;
}

const workTypeOptions = [
  'Roofing',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Flooring',
  'Painting',
  'Kitchen Remodel',
  'Bathroom Remodel',
  'Structural',
  'Exterior',
  'Drywall',
  'Insulation',
  'Trim/Molding',
  'Cabinets',
  'Masonry',
  'Concrete',
  'Whole House Remodel',
  'Room Additions',
  'Basement Finishing',
  'Foundation',
  'Other',
];

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    workType: '',
    serviceType: '',
    workLocation: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [showWorkTypeModal, setShowWorkTypeModal] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceTypeSelect = (type: 'repair' | 'install' | 'maintenance') => {
    setFormData(prev => ({
      ...prev,
      serviceType: type
    }));
  };

  const handleWorkTypeSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      workType: type
    }));
    setShowWorkTypeModal(false);
  };

  const validateForm = (): string[] => {
    const errors = [];
    
    if (!formData.workType) errors.push('Type of work is required');
    if (!formData.serviceType) errors.push('Service type is required');
    if (!formData.workLocation) errors.push('Work location is required');
    if (!formData.startDate) errors.push('Start date is required');
    if (!formData.description) errors.push('Project description is required');
    
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

    console.log('Construction service form data:', formData);
    onNext?.(formData);
  };

  const renderWorkTypeOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalOption}
      onPress={() => handleWorkTypeSelect(item)}
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
          <Text style={styles.subtitle}>Fill in the details of the construction service to be provided</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Type of Work */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type of Work</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowWorkTypeModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.dropdownButtonText,
                !formData.workType && styles.placeholderText
              ]}>
                {formData.workType || 'Select type of construction work'}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Service Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Service Type</Text>
            <View style={styles.serviceTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.serviceTypeOption,
                  formData.serviceType === 'repair' && styles.serviceTypeOptionSelected,
                ]}
                onPress={() => handleServiceTypeSelect('repair')}
                activeOpacity={0.8}
              >
                <Text style={styles.serviceTypeTitle}>Repair</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.serviceTypeOption,
                  formData.serviceType === 'install' && styles.serviceTypeOptionSelected,
                ]}
                onPress={() => handleServiceTypeSelect('install')}
                activeOpacity={0.8}
              >
                <Text style={styles.serviceTypeTitle}>Installation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.serviceTypeOption,
                  formData.serviceType === 'maintenance' && styles.serviceTypeOptionSelected,
                ]}
                onPress={() => handleServiceTypeSelect('maintenance')}
                activeOpacity={0.8}
              >
                <Text style={styles.serviceTypeTitle}>Maintenance</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location of Work */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Location of Work</Text>
            <Text style={styles.sublabel}>Street address where work will be performed</Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main Street, City, State, ZIP"
              placeholderTextColor="#9CA3AF"
              value={formData.workLocation}
              onChangeText={(value) => handleInputChange('workLocation', value)}
            />
          </View>

          {/* Project Timeline */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Project Timeline</Text>
            <Text style={styles.sublabel}>Expected start and completion dates</Text>
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
                placeholder="End Date (YYYY-MM-DD)"
                placeholderTextColor="#9CA3AF"
                value={formData.endDate}
                onChangeText={(value) => handleInputChange('endDate', value)}
              />
            </View>
          </View>

          {/* Project Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Project Description</Text>
            <Text style={styles.sublabel}>Detailed description of work to be performed</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describe the scope of work, materials needed, specific requirements, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
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
            onPress={() => router.push('/homepages/createcontract/service/construction/construction2')}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Work Type Modal */}
      <Modal
        visible={showWorkTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWorkTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Type of Work</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowWorkTypeModal(false)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={workTypeOptions}
              keyExtractor={(item) => item}
              renderItem={renderWorkTypeOption}
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
    marginBottom: 12,
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
  dateRow: {
    flexDirection: 'row',
    gap: 8,
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

