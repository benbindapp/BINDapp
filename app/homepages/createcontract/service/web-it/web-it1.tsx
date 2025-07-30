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
  workType: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface DropdownProps {
  placeholder: string;
  selectedValue: string;
  options: string[];
  onSelect: (value: string) => void;
}

interface ServiceTypeOptionProps {
  id: string;
  title: string;
  selected: boolean;
  onSelect: (type: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ placeholder, selectedValue, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.dropdownButtonText, !selectedValue && styles.placeholderText]}>
          {selectedValue || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#111827" />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.dropdownContent}>
          <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownOption,
                  index === options.length - 1 && styles.dropdownOptionLast
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const ServiceTypeOption: React.FC<ServiceTypeOptionProps> = ({ id, title, selected, onSelect }) => (
  <TouchableOpacity
    style={[styles.serviceTypeOption, selected && styles.serviceTypeOptionSelected]}
    onPress={() => onSelect(id)}
  >
    <Text style={styles.serviceTypeTitle}>{title}</Text>
  </TouchableOpacity>
);

const WebITServiceDetails: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    workType: '',
    serviceType: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const workTypeOptions = [
    'Website Development',
    'E-commerce Store',
    'Mobile App Development',
    'Web Application',
    'API Development',
    'Database Design',
    'Website Redesign',
    'SEO Optimization',
    'System Integration',
    'Cloud Migration',
    'Network Setup',
    'IT Security Audit',
    'Data Migration',
    'Software Installation',
    'Technical Consulting',
    'CRM Setup',
    'Digital Marketing Setup',
    'Hosting & Domain Setup',
    'IT Support & Maintenance',
    'Custom Software Development',
    'Other',
  ];

  const handleWorkTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, workType: type }));
  };

  const handleServiceTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, serviceType: type }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.workType) errors.push('Type of work is required');
    if (!formData.serviceType) errors.push('Service type is required');
    if (!formData.startDate) errors.push('Start date is required');
    if (!formData.description) errors.push('Project description is required');
    
    return errors;
  };
  const router = useRouter()
  const handleNext = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      Alert.alert(
        'Please fill in all required fields:',
        errors.join('\n')
      );
      return;
    }
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        Alert.alert('Error', 'End date must be after start date');
        return;
      }
    }
    
    console.log('Web & IT service form data:', formData);
    Alert.alert('Success', 'Form submitted successfully! Moving to next step...');
    
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Service Details</Text>
          <Text style={styles.subtitle}>Fill in the details of the web & IT service to be provided</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Type of Work */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type of Work</Text>
            <Dropdown
              placeholder="Select type"
              selectedValue={formData.workType}
              options={workTypeOptions}
              onSelect={handleWorkTypeSelect}
            />
          </View>

          {/* Service Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Service Type</Text>
            <View style={styles.serviceTypeContainer}>
              <ServiceTypeOption
                id="development"
                title="Development"
                selected={formData.serviceType === 'development'}
                onSelect={handleServiceTypeSelect}
              />
              <ServiceTypeOption
                id="consulting"
                title="Consulting"
                selected={formData.serviceType === 'consulting'}
                onSelect={handleServiceTypeSelect}
              />
              <ServiceTypeOption
                id="maintenance"
                title="Maintenance"
                selected={formData.serviceType === 'maintenance'}
                onSelect={handleServiceTypeSelect}
              />
            </View>
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
                onChangeText={(text) => handleInputChange('startDate', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="End Date (YYYY-MM-DD)"
                placeholderTextColor="#9CA3AF"
                value={formData.endDate}
                onChangeText={(text) => handleInputChange('endDate', text)}
              />
            </View>
          </View>

          {/* Project Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Project Description</Text>
            <Text style={styles.sublabel}>Detailed description of work to be performed</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describe the scope of work, technical requirements, features needed, integrations, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
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
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
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
  input: {
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    position: 'relative',
    width: '100%',
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 10,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownOption: {
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#111827',
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
    padding: 14,
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
    padding: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WebITServiceDetails;

