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

interface CateringServiceProviderProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  guestCount: string;
  serviceType: 'drop-off' | 'buffet' | 'plated' | 'cocktail' | 'full-service' | '';
  cuisineStyle: string;
  dietaryRestrictions: string;
  specialRequests: string;
}

const CateringServiceProvider: React.FC<CateringServiceProviderProps> = ({
  onBack,
  onNext,
}) => {
  const [formData, setFormData] = useState<FormData>({
    guestCount: '',
    serviceType: '',
    cuisineStyle: '',
    dietaryRestrictions: '',
    specialRequests: '',
  });
  const router = useRouter()
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceTypeSelect = (type: 'drop-off' | 'buffet' | 'plated' | 'cocktail' | 'full-service') => {
    setFormData(prev => ({
      ...prev,
      serviceType: type
    }));
  };

  const handleNext = () => {
    if (!formData.serviceType || !formData.guestCount) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    console.log('Catering service data:', formData);
    onNext?.(formData);
  };

  const serviceTypes = [
    { id: 'drop-off', name: 'Drop-Off Service', desc: 'Food delivered, you serve' },
    { id: 'buffet', name: 'Buffet Setup', desc: 'Self-serve buffet with setup' },
    { id: 'plated', name: 'Plated Service', desc: 'Individual plated meals' },
    { id: 'cocktail', name: 'Cocktail Service', desc: 'Passed hors d\'oeuvres & stations' },
    { id: 'full-service', name: 'Full Service', desc: 'Complete service with staff' },
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
          <Text style={styles.title}>Service Details</Text>
          <Text style={styles.subtitle}>Select your service type and provide details</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Guest Count */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Number of Guests</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 75 guests or 50-60 guests"
              placeholderTextColor="#9CA3AF"
              value={formData.guestCount}
              onChangeText={(value) => handleInputChange('guestCount', value)}
            />
          </View>

          {/* Service Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Service Type</Text>
            <View style={styles.serviceTypeContainer}>
              {serviceTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.serviceTypeButton,
                    formData.serviceType === type.id && styles.serviceTypeButtonActive,
                  ]}
                  onPress={() => handleServiceTypeSelect(type.id as any)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.serviceTypeName,
                      formData.serviceType === type.id && styles.serviceTypeNameActive,
                    ]}
                  >
                    {type.name}
                  </Text>
                  <Text
                    style={[
                      styles.serviceTypeDesc,
                      formData.serviceType === type.id && styles.serviceTypeDescActive,
                    ]}
                  >
                    {type.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cuisine Style */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cuisine Style</Text>
            <Text style={styles.subtext}>Italian, Southern Comfort, Fine Dining, Mexican, BBQ, etc.</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Italian, Southern Comfort, Fine Dining"
              placeholderTextColor="#9CA3AF"
              value={formData.cuisineStyle}
              onChangeText={(value) => handleInputChange('cuisineStyle', value)}
            />
          </View>

          {/* Dietary Restrictions */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dietary Restrictions</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any allergies, vegetarian/vegan needs, religious requirements, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.dietaryRestrictions}
              onChangeText={(value) => handleInputChange('dietaryRestrictions', value)}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Special Requests */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Special Requests</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Specific dishes, linens/rentals needed, setup requirements, serving preferences, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.specialRequests}
              onChangeText={(value) => handleInputChange('specialRequests', value)}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 2 of 5</Text>
            <Text style={styles.progressText}>40%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/homepages/createcontract/service/catering/catering3')}
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
  subtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 4,
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
  serviceTypeContainer: {
    gap: 12,
  },
  serviceTypeButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  serviceTypeButtonActive: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  serviceTypeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  serviceTypeNameActive: {
    color: '#16a34a',
  },
  serviceTypeDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  serviceTypeDescActive: {
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
    width: '40%',
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

export default CateringServiceProvider;

