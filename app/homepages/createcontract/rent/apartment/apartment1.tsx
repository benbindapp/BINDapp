import { useRouter } from 'expo-router';
import {
    ArrowLeft
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FormData {
  propertyType: string;
  address: string;
  unitNumber: string;
  leaseType: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
}

const RentalAgreementScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    propertyType: '',
    address: '',
    unitNumber: '',
    leaseType: '',
    startDate: '',
    endDate: '',
    renewalTerms: '',
  });

  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);

  const propertyTypes = [
    'Single Family House',
    'Apartment',
    'Condominium',
    'Townhouse',
    'Room',
    'Studio',
  ];

  const handleBack = () => {
    console.log('Going back to previous step');
    // Here you would typically call your onBack callback
    // onBack();
  };

  const selectPropertyType = (type: string) => {
    setFormData({ ...formData, propertyType: type });
    setShowPropertyTypeDropdown(false);
  };

  const selectLeaseType = (type: string) => {
    setFormData({
      ...formData,
      leaseType: type,
      // Clear end date if switching to month-to-month
      endDate: type === 'monthToMonth' ? '' : formData.endDate,
    });
  };

  const selectRenewal = (type: string) => {
    setFormData({ ...formData, renewalTerms: type });
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.propertyType) errors.push('Property type is required');
    if (!formData.address) errors.push('Property address is required');
    if (!formData.leaseType) errors.push('Type of lease is required');
    if (!formData.startDate) errors.push('Lease start date is required');
    if (formData.leaseType === 'fixedTerm' && !formData.endDate)
      errors.push('Lease end date is required for fixed term lease');
    if (!formData.renewalTerms) errors.push('Renewal terms are required');

    // Validate end date is after start date for fixed term leases
    if (formData.leaseType === 'fixedTerm' && formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        errors.push('Lease end date must be after start date');
      }
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();

    if (errors.length > 0) {
      Alert.alert('Please fill in all required fields', errors.join('\n'));
      return;
    }

    console.log('Rental agreement form data:', formData);
    Alert.alert('Success', 'Form submitted successfully! Moving to next step...');

    // Here you would typically call your onNext callback
    // onNext(formData);
  };
  const router = useRouter()
  const renderDropdownItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.dropdownOption}
      onPress={() => selectPropertyType(item)}
    >
      <Text style={styles.dropdownOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Rental Agreement</Text>
          <Text style={styles.subtitle}>Enter the basic lease information</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Property Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Property Type</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowPropertyTypeDropdown(true)}
            >
              <Text style={[styles.dropdownButtonText, !formData.propertyType && styles.placeholder]}>
                {formData.propertyType || 'Select property type'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Address */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Property Address</Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main Street, City, State 12345"
              placeholderTextColor="#9CA3AF"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>

          {/* Unit Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Unit Number</Text>
            <Text style={styles.sublabel}>Optional - for apartments, condos, or multi-unit properties</Text>
            <TextInput
              style={styles.input}
              placeholder="Apt 2B, Unit 5, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.unitNumber}
              onChangeText={(text) => setFormData({ ...formData, unitNumber: text })}
            />
          </View>

          {/* Type of Lease */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type of Lease</Text>
            <View style={styles.leaseTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.leaseTypeOption,
                  formData.leaseType === 'monthToMonth' && styles.selectedLeaseType,
                ]}
                onPress={() => selectLeaseType('monthToMonth')}
              >
                <Text style={styles.leaseTypeTitle}>Month-to-Month</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.leaseTypeOption,
                  formData.leaseType === 'fixedTerm' && styles.selectedLeaseType,
                ]}
                onPress={() => selectLeaseType('fixedTerm')}
              >
                <Text style={styles.leaseTypeTitle}>Fixed Term</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lease Start Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Lease Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9CA3AF"
              value={formData.startDate}
              onChangeText={(text) => setFormData({ ...formData, startDate: text })}
            />
          </View>

          {/* Lease End Date (only for fixed term) */}
          {formData.leaseType === 'fixedTerm' && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Lease End Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={formData.endDate}
                onChangeText={(text) => setFormData({ ...formData, endDate: text })}
              />
            </View>
          )}

          {/* Renewal Terms */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Renewal Terms</Text>
            <View style={styles.renewalContainer}>
              <TouchableOpacity
                style={[
                  styles.renewalOption,
                  formData.renewalTerms === 'autoRenew' && styles.selectedRenewal,
                ]}
                onPress={() => selectRenewal('autoRenew')}
              >
                <Text style={styles.renewalTitle}>Auto Renew</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.renewalOption,
                  formData.renewalTerms === 'noAutoRenew' && styles.selectedRenewal,
                ]}
                onPress={() => selectRenewal('noAutoRenew')}
              >
                <Text style={styles.renewalTitle}>No Auto Renew</Text>
              </TouchableOpacity>
            </View>
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
        <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/homepages/createcontract/rent/apartment/apartment2')}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Property Type Modal */}
      <Modal
        visible={showPropertyTypeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPropertyTypeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowPropertyTypeDropdown(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={propertyTypes}
              renderItem={renderDropdownItem}
              keyExtractor={(item) => item}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  backButtonText: {
    fontSize: 24,
    color: '#6B7280',
  },
  spacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
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
  },
  formContainer: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownButton: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
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
  placeholder: {
    color: '#9CA3AF',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  leaseTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  leaseTypeOption: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  selectedLeaseType: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  leaseTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  renewalContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  renewalOption: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  selectedRenewal: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  renewalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
  nextButton: {
    width: '100%',
    backgroundColor: '#2fb035',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 32,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 300,
    width: '100%',
    maxWidth: 400,
  },
  dropdownList: {
    maxHeight: 250,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#111827',
  },
});

export default RentalAgreementScreen;

