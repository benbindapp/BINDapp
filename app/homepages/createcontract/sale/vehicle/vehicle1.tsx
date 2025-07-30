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
  makeModel: string;
  year: string;
  vin: string;
  mileage: string;
}

interface VehicleDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
  onAddPhotos?: () => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  onBack,
  onNext,
  onAddPhotos,
}) => {
  const [formData, setFormData] = useState<FormData>({
    makeModel: '',
    year: '',
    vin: '',
    mileage: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPhotos = () => {
    console.log('Add photos clicked');
    onAddPhotos?.();
  };

  const handleNext = () => {
    console.log('Form data:', formData);
    onNext?.(formData);
  };
  const router = useRouter()

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
          <Text style={styles.title}>Vehicle Details</Text>
          <Text style={styles.subtitle}>Fill in the details of the vehicle being sold</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Make & Model */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Make & Model</Text>
            <TextInput
              style={styles.input}
              placeholder="Jeep Wrangler"
              placeholderTextColor="#9CA3AF"
              value={formData.makeModel}
              onChangeText={(value) => handleInputChange('makeModel', value)}
            />
          </View>

          {/* Year */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              style={styles.input}
              placeholder="2019"
              placeholderTextColor="#9CA3AF"
              value={formData.year}
              onChangeText={(value) => handleInputChange('year', value)}
              keyboardType="numeric"
            />
          </View>

          {/* VIN */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>VIN</Text>
            <Text style={styles.sublabel}>(Vehicle Identification Number)</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#9CA3AF"
              value={formData.vin}
              onChangeText={(value) => handleInputChange('vin', value)}
            />
          </View>

          {/* Mileage */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mileage</Text>
            <TextInput
              style={styles.input}
              placeholder="52,019"
              placeholderTextColor="#9CA3AF"
              value={formData.mileage}
              onChangeText={(value) => handleInputChange('mileage', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Add Photos */}
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.photosButton}
              onPress={handleAddPhotos}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#111827" />
              <Text style={styles.photosButtonText}>Photos</Text>
            </TouchableOpacity>
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
            onPress={() => router.push('/homepages/createcontract/sale/vehicle/vehicle2')}
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
    paddingHorizontal: 24,
    paddingVertical: 4,
    flex: 1,
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
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  fieldContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photosButton: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photosButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  progressContainer: {
    marginBottom: 16,
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
    width: '20%',
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  nextButtonContainer: {
    marginBottom: 80,
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

export default VehicleDetails;

