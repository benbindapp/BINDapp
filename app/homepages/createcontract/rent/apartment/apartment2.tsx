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
    TouchableOpacity,
    View,
} from 'react-native';

interface FormData {
  petPolicy: string;
  smokingPolicy: string;
  alterations: string;
  alterationsType: string;
  utilities: {
    electricity: string;
    water: string;
    gas: string;
    internet: string;
    trash: string;
    sewer: string;
    cable: string;
    hoa: string;
  };
}

const RulesResponsibilitiesScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    petPolicy: '',
    smokingPolicy: '',
    alterations: '',
    alterationsType: '',
    utilities: {
      electricity: '',
      water: '',
      gas: '',
      internet: '',
      trash: '',
      sewer: '',
      cable: '',
      hoa: '',
    },
  });

  const [showAlterationsDropdown, setShowAlterationsDropdown] = useState(false);

  const alterationsOptions = [
    'Minor alterations with approval',
    'Cosmetic changes only',
    'Tenant improvements allowed',
    'Full alterations permitted',
    'Professional installation required',
    'Restore to original condition',
  ];

  const utilities = [
    { key: 'electricity', name: 'Electricity' },
    { key: 'water', name: 'Water' },
    { key: 'gas', name: 'Gas' },
    { key: 'internet', name: 'Internet' },
    { key: 'trash', name: 'Trash/Garbage' },
    { key: 'sewer', name: 'Sewer' },
    { key: 'cable', name: 'Cable/TV' },
    { key: 'hoa', name: 'HOA Fees' },
  ];

  const handleBack = () => {
    console.log('Going back to previous step');
    // Here you would typically call your onBack callback
    // onBack();
  };
  const router = useRouter()
  const selectPetPolicy = (value: string) => {
    setFormData({ ...formData, petPolicy: value });
  };

  const selectSmokingPolicy = (value: string) => {
    setFormData({ ...formData, smokingPolicy: value });
  };

  const selectAlterations = (value: string) => {
    setFormData({
      ...formData,
      alterations: value,
      // Clear alterations type if switching to no
      alterationsType: value === 'no' ? '' : formData.alterationsType,
    });
  };

  const selectAlterationsType = (type: string) => {
    setFormData({ ...formData, alterationsType: type });
    setShowAlterationsDropdown(false);
  };

  const selectUtility = (utility: string, responsible: string) => {
    setFormData({
      ...formData,
      utilities: {
        ...formData.utilities,
        [utility]: responsible,
      },
    });
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.petPolicy) errors.push('Pet policy is required');
    if (!formData.smokingPolicy) errors.push('Smoking policy is required');
    if (!formData.alterations) errors.push('Alterations policy is required');
    if (formData.alterations === 'yes' && !formData.alterationsType)
      errors.push('Alterations conditions must be specified');

    // Check if at least one utility has a responsible party assigned
    const utilitiesAssigned = Object.values(formData.utilities).some(
      (value) => value !== ''
    );

    if (!utilitiesAssigned)
      errors.push('At least one utility responsibility must be assigned');

    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();

    if (errors.length > 0) {
      Alert.alert('Please complete the following', errors.join('\n'));
      return;
    }

    console.log('Rules & Responsibilities form data:', formData);
    Alert.alert('Success', 'Form submitted successfully! Moving to next step...');

    // Here you would typically call your onNext callback
    // onNext(formData);
  };

  const renderAlterationsOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.dropdownOption}
      onPress={() => selectAlterationsType(item)}
    >
      <Text style={styles.dropdownOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderUtilityRow = ({ item }: { item: { key: string; name: string } }) => (
    <View style={styles.utilityRow}>
      <View style={styles.utilityName}>
        <Text style={styles.utilityNameText}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.utilityCheckboxCell}
        onPress={() => selectUtility(item.key, 'landlord')}
      >
        <View
          style={[
            styles.utilityCheckbox,
            formData.utilities[item.key as keyof typeof formData.utilities] === 'landlord' &&
              styles.utilityCheckboxChecked,
          ]}
        >
          {formData.utilities[item.key as keyof typeof formData.utilities] === 'landlord' && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.utilityCheckboxCell}
        onPress={() => selectUtility(item.key, 'tenant')}
      >
        <View
          style={[
            styles.utilityCheckbox,
            formData.utilities[item.key as keyof typeof formData.utilities] === 'tenant' &&
              styles.utilityCheckboxChecked,
          ]}
        >
          {formData.utilities[item.key as keyof typeof formData.utilities] === 'tenant' && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
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
          <Text style={styles.title}>Rules & Responsibilities</Text>
          <Text style={styles.subtitle}>Specify the rules and responsibilities for the rental</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Pet Policy */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Pet Policy</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => selectPetPolicy('yes')}
              >
                <View
                  style={[
                    styles.radioButton,
                    formData.petPolicy === 'yes' && styles.radioButtonSelected,
                  ]}
                >
                  {formData.petPolicy === 'yes' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => selectPetPolicy('no')}
              >
                <View
                  style={[
                    styles.radioButton,
                    formData.petPolicy === 'no' && styles.radioButtonSelected,
                  ]}
                >
                  {formData.petPolicy === 'no' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Smoking Policy */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Smoking Policy</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => selectSmokingPolicy('yes')}
              >
                <View
                  style={[
                    styles.radioButton,
                    formData.smokingPolicy === 'yes' && styles.radioButtonSelected,
                  ]}
                >
                  {formData.smokingPolicy === 'yes' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => selectSmokingPolicy('no')}
              >
                <View
                  style={[
                    styles.radioButton,
                    formData.smokingPolicy === 'no' && styles.radioButtonSelected,
                  ]}
                >
                  {formData.smokingPolicy === 'no' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Alterations Allowed */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Alterations Allowed?</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => selectAlterations('yes')}
              >
                <View
                  style={[
                    styles.radioButton,
                    formData.alterations === 'yes' && styles.radioButtonSelected,
                  ]}
                >
                  {formData.alterations === 'yes' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => selectAlterations('no')}
              >
                <View
                  style={[
                    styles.radioButton,
                    formData.alterations === 'no' && styles.radioButtonSelected,
                  ]}
                >
                  {formData.alterations === 'no' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>

            {/* Alterations Conditions Dropdown */}
            {formData.alterations === 'yes' && (
              <View style={styles.alterationsConditions}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowAlterationsDropdown(true)}
                >
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      !formData.alterationsType && styles.placeholder,
                    ]}
                  >
                    {formData.alterationsType || 'Select conditions'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Utilities Responsibility */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Utilities Responsibility</Text>
            <View style={styles.utilitiesSection}>
              <View style={styles.utilitiesTable}>
                {/* Header */}
                <View style={styles.utilitiesHeader}>
                  <View style={styles.utilityNameHeader} />
                  <View style={styles.utilityColumnHeader}>
                    <Text style={styles.utilityColumnHeaderText}>Landlord</Text>
                  </View>
                  <View style={styles.utilityColumnHeader}>
                    <Text style={styles.utilityColumnHeaderText}>Tenant</Text>
                  </View>
                </View>
                {/* Utility Rows */}
                <FlatList
                  data={utilities}
                  renderItem={renderUtilityRow}
                  keyExtractor={(item) => item.key}
                  scrollEnabled={false}
                />
              </View>
            </View>
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
        <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/homepages/createcontract/rent/apartment/apartment3')}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Alterations Type Modal */}
      <Modal
        visible={showAlterationsDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAlterationsDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowAlterationsDropdown(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={alterationsOptions}
              renderItem={renderAlterationsOption}
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
    textAlign: 'center',
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
  radioContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2fb035',
    backgroundColor: '#2fb035',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  radioText: {
    fontSize: 16,
    color: '#111827',
  },
  alterationsConditions: {
    marginTop: 16,
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
  utilitiesSection: {
    marginTop: 16,
  },
  utilitiesTable: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  utilitiesHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  utilityNameHeader: {
    flex: 1,
    padding: 16,
  },
  utilityColumnHeader: {
    width: 80,
    padding: 16,
    alignItems: 'center',
  },
  utilityColumnHeaderText: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 14,
  },
  utilityRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  utilityName: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  utilityNameText: {
    fontSize: 16,
    color: '#111827',
  },
  utilityCheckboxCell: {
    width: 80,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilityCheckbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilityCheckboxChecked: {
    backgroundColor: '#2fb035',
    borderColor: '#2fb035',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    width: '40%',
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

export default RulesResponsibilitiesScreen;

