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

interface CateringDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  eventType: string;
  contactName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  venueAddress: string;
}

const CateringDetails: React.FC<CateringDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    eventType: '',
    contactName: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    venueAddress: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.eventType || !formData.eventDate || !formData.venue) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    console.log('Catering form data:', formData);
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
          <Text style={styles.title}>Event Catering</Text>
          <Text style={styles.subtitle}>Tell us about your event and catering needs</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Company Name - Auto-filled */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Company Name</Text>
            <View style={styles.autoFilledField}>
              <Text style={styles.autoFilledText}>Your Company Name (Auto-filled)</Text>
            </View>
          </View>

          {/* Contact Name - Auto-filled */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Contact Name</Text>
            <View style={styles.autoFilledField}>
              <Text style={styles.autoFilledText}>Counter Party Contact (Auto-filled)</Text>
            </View>
          </View>

          {/* Event Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type of Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Wedding, Corporate Event, Birthday Party, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.eventType}
              onChangeText={(value) => handleInputChange('eventType', value)}
            />
          </View>

          {/* Event Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Event Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#9CA3AF"
              value={formData.eventDate}
              onChangeText={(value) => handleInputChange('eventDate', value)}
            />
          </View>

          {/* Event Time */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Event Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 6:00 PM - 11:00 PM"
              placeholderTextColor="#9CA3AF"
              value={formData.eventTime}
              onChangeText={(value) => handleInputChange('eventTime', value)}
            />
          </View>

          {/* Venue Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Venue Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Hotel, church, private home, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.venue}
              onChangeText={(value) => handleInputChange('venue', value)}
            />
          </View>

          {/* Venue Address */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Venue Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Full address for delivery/setup"
              placeholderTextColor="#9CA3AF"
              value={formData.venueAddress}
              onChangeText={(value) => handleInputChange('venueAddress', value)}
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
            onPress={() => router.push('/homepages/createcontract/service/catering/catering2')}
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
  autoFilledField: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  autoFilledText: {
    fontSize: 18,
    color: '#6B7280',
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

export default CateringDetails;

