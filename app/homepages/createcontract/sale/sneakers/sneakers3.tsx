import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ArrowLeft
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormData {
  hasContingencies: 'yes' | 'no' | '';
  selectedContingencies: string[];
  customContingency: string;
}

interface ContingencyOption {
  id: string;
  title: string;
  description: string;
}

interface ContingenciesProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

const Contingencies: React.FC<ContingenciesProps> = ({
  onBack,
  onNext,
}) => {
  const [formData, setFormData] = useState<FormData>({
    hasContingencies: '',
    selectedContingencies: [],
    customContingency: ''
  });

  const router = useRouter()
  const handleContingencyToggle = (answer: 'yes' | 'no') => {
    setFormData(prev => ({
      ...prev,
      hasContingencies: answer
    }));
    
    if (answer === 'no') {
      setFormData(prev => ({
        ...prev,
        selectedContingencies: [],
        customContingency: ''
      }));
    }
  };

  const handleContingencySelect = (contingency: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedContingencies.includes(contingency);
      const newContingencies = isSelected
        ? prev.selectedContingencies.filter(item => item !== contingency)
        : [...prev.selectedContingencies, contingency];
      
      return {
        ...prev,
        selectedContingencies: newContingencies
      };
    });
    
    if (contingency === 'other' && formData.selectedContingencies.includes('other')) {
      setFormData(prev => ({
        ...prev,
        customContingency: ''
      }));
    }
  };

  const handleCustomContingencyChange = (text: string) => {
    setFormData(prev => ({
      ...prev,
      customContingency: text
    }));
  };

  const handleNext = () => {
    console.log('Form data:', formData);
    onNext?.(formData);
  };

  const contingencyOptions: ContingencyOption[] = [
    {
      id: 'pre-purchase-inspection',
      title: 'Pre-purchase Inspection',
      description: 'Buyer\'s mechanic or shop inspects the vehicle.'
    },
    {
      id: 'financing-approval',
      title: 'Financing Approval',
      description: 'Buyer\'s loan or payment method is secured.'
    },
    {
      id: 'title-lien-search',
      title: 'Title & Lien Search',
      description: 'Seller delivers a clean title, free of liens.'
    },
    {
      id: 'vehicle-history-report',
      title: 'Vehicle History Report',
      description: 'Buyer reviews a Carfax/AutoCheck report.'
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Custom contingency.'
    }
  ];

  const RadioButton: React.FC<{ selected: boolean; onPress: () => void; children: React.ReactNode }> = ({
    selected,
    onPress,
    children
  }) => (
    <TouchableOpacity style={styles.radioButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.radioContent}>
        <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioText}>{children}</Text>
      </View>
    </TouchableOpacity>
  );

  const CheckboxButton: React.FC<{ 
    selected: boolean; 
    onPress: () => void; 
    title: string; 
    description: string; 
  }> = ({ selected, onPress, title, description }) => (
    <TouchableOpacity style={styles.checkboxButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.checkboxContent}>
        <View style={styles.checkboxRow}>
          <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
            {selected && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
          <Text style={styles.checkboxTitle}>{title}</Text>
        </View>
        <Text style={styles.checkboxDescription}>{description}</Text>
      </View>
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
      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Contingencies</Text>
          <Text style={styles.subtitle}>
            Contingencies that must be met before the buyer is obligated to make the payment in full.
          </Text>
        </View>

        {/* Form Fields */}
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Are there any contingencies? */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Are there any contingencies?</Text>
            <View style={styles.radioGroup}>
              <RadioButton
                selected={formData.hasContingencies === 'yes'}
                onPress={() => handleContingencyToggle('yes')}
              >
                Yes
              </RadioButton>
              <RadioButton
                selected={formData.hasContingencies === 'no'}
                onPress={() => handleContingencyToggle('no')}
              >
                No
              </RadioButton>
            </View>
          </View>

          {/* Contingency Options - Only show when "Yes" is selected */}
          {formData.hasContingencies === 'yes' && (
            <View style={styles.contingencyOptionsContainer}>
              {contingencyOptions.map((option) => (
                <CheckboxButton
                  key={option.id}
                  selected={formData.selectedContingencies.includes(option.id)}
                  onPress={() => handleContingencySelect(option.id)}
                  title={option.title}
                  description={option.description}
                />
              ))}

              {/* Custom Contingency Field - Only show when "Other" is selected */}
              {formData.selectedContingencies.includes('other') && (
                <View style={styles.customContainer}>
                  <Text style={styles.customLabel}>Describe the custom contingency</Text>
                  <TextInput
                    style={styles.customInput}
                    placeholder="e.g., Vehicle must pass emissions test..."
                    placeholderTextColor="#9CA3AF"
                    value={formData.customContingency}
                    onChangeText={handleCustomContingencyChange}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>

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
            onPress={() => router.push('/homepages/createcontract/sale/sneakers/sneakers4')}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'left',
  },
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  radioText: {
    fontSize: 18,
    color: '#111827',
  },
  contingencyOptionsContainer: {
    gap: 12,
  },
  checkboxButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkboxContent: {
    gap: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  checkboxTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 36,
    lineHeight: 20,
  },
  customContainer: {
    marginTop: 16,
    gap: 8,
  },
  customLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'left',
  },
  customInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 96,
  },
  progressContainer: {
    marginBottom: 16,
    marginTop: 'auto',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressBar: {
    width: '60%',
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  nextButtonContainer: {
    marginBottom: 128,
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  }
});

export default Contingencies;


