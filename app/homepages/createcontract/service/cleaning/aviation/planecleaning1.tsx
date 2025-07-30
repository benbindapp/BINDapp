import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
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

interface CleaningDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  aircraftType: string;
  tailNumber: string;
  ownerName: string;
  cleaningType: 'interior' | 'exterior' | 'detail' | '';
  specialRequests: string;
  location: string;
  preferredDate: string;
  estimatedHours: string;
}

const CleaningDetails: React.FC<CleaningDetailsProps> = ({
  onBack,
  onNext,
}) => {

  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    aircraftType: '',
    tailNumber: '',
    ownerName: '',
    cleaningType: '',
    specialRequests: '',
    location: '',
    preferredDate: '',
    estimatedHours: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCleaningTypeSelect = (type: 'interior' | 'exterior' | 'detail') => {
    setFormData(prev => ({
      ...prev,
      cleaningType: type
    }));
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.aircraftType || !formData.tailNumber || !formData.ownerName || 
        !formData.cleaningType || !formData.preferredDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    console.log('Cleaning form data:', formData);
    onNext?.(formData);
  };

  const cleaningTypes = [
    { id: 'interior', name: 'Interior Only' },
    { id: 'exterior', name: 'Exterior Only' },
    { id: 'detail', name: 'Full Detail Service' },
  ];

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
          <Text style={styles.title}>Aircraft Cleaning</Text>
          <Text style={styles.subtitle}>Enter aircraft and cleaning details</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Aircraft Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type of Aircraft</Text>
            <TextInput
              style={styles.input}
              placeholder="Boeing 737, Cessna 172, Gulfstream G650, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.aircraftType}
              onChangeText={(value) => handleInputChange('aircraftType', value)}
            />
          </View>

          {/* Tail Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tail Number</Text>
            <TextInput
              style={styles.input}
              placeholder="N123AB"
              placeholderTextColor="#9CA3AF"
              value={formData.tailNumber}
              onChangeText={(value) => handleInputChange('tailNumber', value.toUpperCase())}
              autoCapitalize="characters"
            />
          </View>

          {/* Company or Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Company or Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Aircraft owner name or company"
              placeholderTextColor="#9CA3AF"
              value={formData.ownerName}
              onChangeText={(value) => handleInputChange('ownerName', value)}
            />
          </View>

          {/* Cleaning Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cleaning Type</Text>
            <View style={styles.cleaningTypeGrid}>
              {cleaningTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.gridButton,
                    formData.cleaningType === type.id && styles.gridButtonActive,
                  ]}
                  onPress={() => handleCleaningTypeSelect(type.id as 'interior' | 'exterior' | 'detail')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.gridButtonText,
                      formData.cleaningType === type.id && styles.gridButtonTextActive,
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Special Requests */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Special Requests</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any special cleaning requirements, problem areas, or specific instructions (e.g., leather treatment, carpet shampooing, etc.)"
              placeholderTextColor="#9CA3AF"
              value={formData.specialRequests}
              onChangeText={(value) => handleInputChange('specialRequests', value)}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Cleaning Location */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cleaning Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Hangar location or airport"
              placeholderTextColor="#9CA3AF"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />
          </View>

          {/* Preferred Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Preferred Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#9CA3AF"
              value={formData.preferredDate}
              onChangeText={(value) => handleInputChange('preferredDate', value)}
            />
          </View>

          {/* Estimated Duration */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Estimated Duration</Text>
            <TextInput
              style={styles.input}
              placeholder="Number of hours (e.g., 4-6 hours)"
              placeholderTextColor="#9CA3AF"
              value={formData.estimatedHours}
              onChangeText={(value) => handleInputChange('estimatedHours', value)}
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
            onPress={() => router.push('/homepages/createcontract/service/cleaning/aviation/planecleaning2')}
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
  textArea: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
  },
  cleaningTypeGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  gridButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  gridButtonActive: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  gridButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  gridButtonTextActive: {
    color: '#16a34a',
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
    width: '20%',
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

export default CleaningDetails;

