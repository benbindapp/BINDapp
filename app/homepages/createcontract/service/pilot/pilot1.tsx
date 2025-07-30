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

interface AircraftDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  aircraftType: string;
  tailNumber: string;
  ownerType: 'owner' | 'lessee' | '';
  ownerName: string;
  departureDate: string;
  returnDate: string;
  departureAirport: string;
}

const AircraftDetails: React.FC<AircraftDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const [formData, setFormData] = useState<FormData>({
    aircraftType: '',
    tailNumber: '',
    ownerType: '',
    ownerName: '',
    departureDate: '',
    returnDate: '',
    departureAirport: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const router = useRouter()
  const handleOwnerTypeSelect = (type: 'owner' | 'lessee') => {
    setFormData(prev => ({
      ...prev,
      ownerType: type
    }));
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.aircraftType || !formData.tailNumber || !formData.ownerType || 
        !formData.ownerName || !formData.departureDate || !formData.departureAirport) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    console.log('Form data:', formData);
    onNext?.(formData);
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
          <Text style={styles.title}>Aircraft Details</Text>
          <Text style={styles.subtitle}>Fill in the aircraft and trip information</Text>
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

          {/* Passenger Status */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Passenger Status</Text>
            <View style={styles.ownerTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.ownerTypeOption,
                  formData.ownerType === 'owner' && styles.ownerTypeOptionSelected,
                ]}
                onPress={() => handleOwnerTypeSelect('owner')}
                activeOpacity={0.8}
              >
                <Text style={styles.ownerTypeTitle}>Owner</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ownerTypeOption,
                  formData.ownerType === 'lessee' && styles.ownerTypeOptionSelected,
                ]}
                onPress={() => handleOwnerTypeSelect('lessee')}
                activeOpacity={0.8}
              >
                <Text style={styles.ownerTypeTitle}>Lessee</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Company or Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Company or Name</Text>
            <TextInput
              style={styles.input}
              placeholder={
                formData.ownerType === 'owner' 
                  ? "Aircraft owner name or company" 
                  : formData.ownerType === 'lessee'
                  ? "Lessee name or company"
                  : "Full name or company name"
              }
              placeholderTextColor="#9CA3AF"
              value={formData.ownerName}
              onChangeText={(value) => handleInputChange('ownerName', value)}
            />
          </View>

          {/* Trip Dates */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Trip Dates</Text>
            <Text style={styles.sublabel}>Select departure and return dates</Text>
            <View style={styles.dateRow}>
              <TextInput
                style={styles.input}
                placeholder="Departure Date"
                placeholderTextColor="#9CA3AF"
                value={formData.departureDate}
                onChangeText={(value) => handleInputChange('departureDate', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Return Date"
                placeholderTextColor="#9CA3AF"
                value={formData.returnDate}
                onChangeText={(value) => handleInputChange('returnDate', value)}
              />
            </View>
          </View>

          {/* Departure Airport */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Departure Airport</Text>
            <Text style={styles.sublabel}>Enter airport code or name</Text>
            <TextInput
              style={styles.input}
              placeholder="LAX, JFK, KORD, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.departureAirport}
              onChangeText={(value) => handleInputChange('departureAirport', value.toUpperCase())}
              autoCapitalize="characters"
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
            onPress={() => router.push('/homepages/createcontract/service/aviation/pilot/pilot2')}
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
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'left',
    marginBottom: 8,
    marginTop: -4,
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
  ownerTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  ownerTypeOption: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  ownerTypeOptionSelected: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  ownerTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
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

export default AircraftDetails;

