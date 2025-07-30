import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, ChevronDown, Upload, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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

interface ResponsibilitiesProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  materialsProvidedBy: 'contractor' | 'client' | 'shared' | '';
  contractorResponsibleForPermits: boolean | null;
  changeOrdersAgreed: boolean;
  warrantyOnWork: boolean | null;
  warrantyLength: string;
  warrantyUnit: 'days' | 'months' | 'years';
  warrantyDetails: string;
  cleanupResponsibility: 'contractor' | 'client' | 'shared' | '';
  insuranceRequired: boolean | null;
  insuranceFiles: any[];
}

interface FileItem {
  name: string;
  uri: string;
  type: string;
}

const warrantyUnits = ['days', 'months', 'years'];
const cleanupOptions = [
  { value: 'contractor', label: 'Contractor' },
  { value: 'client', label: 'Client' },
  { value: 'shared', label: 'Shared' },
];

const Responsibilities: React.FC<ResponsibilitiesProps> = ({
  onBack,
  onNext,
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    materialsProvidedBy: '',
    contractorResponsibleForPermits: null,
    changeOrdersAgreed: true,
    warrantyOnWork: null,
    warrantyLength: '1',
    warrantyUnit: 'years',
    warrantyDetails: '',
    cleanupResponsibility: '',
    insuranceRequired: null,
    insuranceFiles: [],
  });

  const [showWarrantyLengthModal, setShowWarrantyLengthModal] = useState(false);
  const [showWarrantyUnitModal, setShowWarrantyUnitModal] = useState(false);
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [warrantyLengthOptions, setWarrantyLengthOptions] = useState<number[]>([]);

  useEffect(() => {
    // Generate warranty length options (1-100)
    const options = Array.from({ length: 100 }, (_, i) => i + 1);
    setWarrantyLengthOptions(options);
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaterialsSelect = (type: 'contractor' | 'client' | 'shared') => {
    setFormData(prev => ({
      ...prev,
      materialsProvidedBy: type
    }));
  };

  const handlePermitsSelect = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      contractorResponsibleForPermits: value
    }));
  };

  const handleWarrantySelect = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      warrantyOnWork: value
    }));
  };

  const handleInsuranceSelect = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      insuranceRequired: value,
      insuranceFiles: value ? prev.insuranceFiles : []
    }));
  };

  const handleCleanupSelect = (type: 'contractor' | 'client' | 'shared') => {
    setFormData(prev => ({
      ...prev,
      cleanupResponsibility: type
    }));
    setShowCleanupModal(false);
  };

  const handleWarrantyLengthSelect = (length: number) => {
    setFormData(prev => ({
      ...prev,
      warrantyLength: length.toString()
    }));
    setShowWarrantyLengthModal(false);
  };

  const handleWarrantyUnitSelect = (unit: 'days' | 'months' | 'years') => {
    setFormData(prev => ({
      ...prev,
      warrantyUnit: unit
    }));
    setShowWarrantyUnitModal(false);
  };

  const handleInsuranceUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true,
      });
      
      if (!result.canceled) {
        const newFiles = result.assets.map(asset => ({
          name: asset.name,
          uri: asset.uri,
          type: asset.mimeType || 'unknown',
        }));
        
        setFormData(prev => ({
          ...prev,
          insuranceFiles: [...prev.insuranceFiles, ...newFiles]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload files');
    }
  };

  const removeInsuranceFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      insuranceFiles: prev.insuranceFiles.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): string[] => {
    const errors = [];
    
    if (!formData.materialsProvidedBy) errors.push('Materials provider is required');
    if (formData.contractorResponsibleForPermits === null) errors.push('Permit responsibility must be specified');
    if (formData.warrantyOnWork === null) errors.push('Warranty information is required');
    if (formData.warrantyOnWork && !formData.warrantyLength) errors.push('Warranty length is required');
    if (!formData.cleanupResponsibility) errors.push('Cleanup responsibility must be specified');
    if (formData.insuranceRequired === null) errors.push('Insurance requirement must be specified');
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields:\n' + errors.join('\n'));
      return;
    }

    console.log('Responsibilities form data:', formData);
    onNext?.(formData);
  };

  const renderWarrantyLengthOption = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={styles.modalOption}
      onPress={() => handleWarrantyLengthSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.modalOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderWarrantyUnitOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalOption}
      onPress={() => handleWarrantyUnitSelect(item as 'days' | 'months' | 'years')}
      activeOpacity={0.7}
    >
      <Text style={styles.modalOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCleanupOption = ({ item }: { item: typeof cleanupOptions[0] }) => (
    <TouchableOpacity
      style={styles.modalOption}
      onPress={() => handleCleanupSelect(item.value as 'contractor' | 'client' | 'shared')}
      activeOpacity={0.7}
    >
      <Text style={styles.modalOptionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderInsuranceFile = ({ item, index }: { item: FileItem; index: number }) => (
    <View style={styles.uploadFileItem}>
      <Text style={styles.uploadFileName} numberOfLines={1}>{item.name}</Text>
      <TouchableOpacity
        style={styles.uploadFileRemove}
        onPress={() => removeInsuranceFile(index)}
        activeOpacity={0.7}
      >
        <X size={16} color="#EF4444" />
      </TouchableOpacity>
    </View>
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
          <Text style={styles.title}>Responsibilities</Text>
          <Text style={styles.subtitle}>Specify additional responsibilities and terms</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Materials Provided By */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Materials Provided By</Text>
            <View style={styles.materialsContainer}>
              <TouchableOpacity
                style={[
                  styles.materialsOption,
                  formData.materialsProvidedBy === 'contractor' && styles.materialsOptionSelected,
                ]}
                onPress={() => handleMaterialsSelect('contractor')}
                activeOpacity={0.8}
              >
                <Text style={styles.materialsTitle}>Contractor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.materialsOption,
                  formData.materialsProvidedBy === 'client' && styles.materialsOptionSelected,
                ]}
                onPress={() => handleMaterialsSelect('client')}
                activeOpacity={0.8}
              >
                <Text style={styles.materialsTitle}>Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.materialsOption,
                  formData.materialsProvidedBy === 'shared' && styles.materialsOptionSelected,
                ]}
                onPress={() => handleMaterialsSelect('shared')}
                activeOpacity={0.8}
              >
                <Text style={styles.materialsTitle}>Shared</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Permit Responsibility */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Is the contractor responsible for permits?</Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoOption,
                  formData.contractorResponsibleForPermits === true && styles.yesNoOptionSelected,
                ]}
                onPress={() => handlePermitsSelect(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.yesNoTitle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoOption,
                  formData.contractorResponsibleForPermits === false && styles.yesNoOptionSelected,
                ]}
                onPress={() => handlePermitsSelect(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.yesNoTitle}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Change Orders */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Change Orders</Text>
            <View style={styles.changeOrderContainer}>
              <Check size={16} color="#2fb035" />
              <Text style={styles.changeOrderText}>
                All changes to the scope of work must be agreed in writing via BIND before work proceeds.
              </Text>
            </View>
          </View>

          {/* Warranty on Work */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Warranty on Work?</Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoOption,
                  formData.warrantyOnWork === true && styles.yesNoOptionSelected,
                ]}
                onPress={() => handleWarrantySelect(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.yesNoTitle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoOption,
                  formData.warrantyOnWork === false && styles.yesNoOptionSelected,
                ]}
                onPress={() => handleWarrantySelect(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.yesNoTitle}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Warranty Details (conditional) */}
          {formData.warrantyOnWork === true && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Warranty Length:</Text>
                <View style={styles.warrantyRow}>
                  <TouchableOpacity
                    style={styles.warrantyDropdownButton}
                    onPress={() => setShowWarrantyLengthModal(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownButtonText}>{formData.warrantyLength}</Text>
                    <ChevronDown size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.warrantyDropdownButton}
                    onPress={() => setShowWarrantyUnitModal(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownButtonText}>{formData.warrantyUnit}</Text>
                    <ChevronDown size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Warranty Details</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Describe what is covered under warranty..."
                  placeholderTextColor="#9CA3AF"
                  value={formData.warrantyDetails}
                  onChangeText={(value) => handleInputChange('warrantyDetails', value)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}

          {/* Cleanup Responsibility */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cleanup Responsibility</Text>
            <Text style={styles.sublabel}>Who is responsible for job site cleanup?</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowCleanupModal(true)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.dropdownButtonText,
                !formData.cleanupResponsibility && styles.placeholderText
              ]}>
                {formData.cleanupResponsibility ? 
                  cleanupOptions.find(opt => opt.value === formData.cleanupResponsibility)?.label :
                  'Select cleanup responsibility'
                }
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Insurance Required */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Insurance Required?</Text>
            <Text style={styles.sublabel}>Does contractor need to provide proof of insurance?</Text>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoOption,
                  formData.insuranceRequired === true && styles.yesNoOptionSelected,
                ]}
                onPress={() => handleInsuranceSelect(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.yesNoTitle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoOption,
                  formData.insuranceRequired === false && styles.yesNoOptionSelected,
                ]}
                onPress={() => handleInsuranceSelect(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.yesNoTitle}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Insurance Upload Section (conditional) */}
          {formData.insuranceRequired === true && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Upload Insurance Documents</Text>
              <Text style={styles.sublabel}>Upload proof of liability insurance and any required certificates</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleInsuranceUpload}
                activeOpacity={0.8}
              >
                <Upload size={24} color="#6B7280" />
                <Text style={styles.uploadButtonText}>Add Insurance Photos/Documents</Text>
              </TouchableOpacity>
              {formData.insuranceFiles.length > 0 && (
                <View style={styles.uploadFilesList}>
                  <FlatList
                    data={formData.insuranceFiles}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    renderItem={({ item, index }) => renderInsuranceFile({ item, index })}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>
          )}
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
            onPress={() => router.push('/homepages/createcontract/service/construction/construction3')}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Warranty Length Modal */}
      <Modal
        visible={showWarrantyLengthModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWarrantyLengthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Warranty Length</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowWarrantyLengthModal(false)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={warrantyLengthOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={renderWarrantyLengthOption}
              style={styles.modalList}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </View>
      </Modal>

      {/* Warranty Unit Modal */}
      <Modal
        visible={showWarrantyUnitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWarrantyUnitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time Unit</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowWarrantyUnitModal(false)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={warrantyUnits}
              keyExtractor={(item) => item}
              renderItem={renderWarrantyUnitOption}
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Cleanup Modal */}
      <Modal
        visible={showCleanupModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCleanupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Cleanup Responsibility</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCleanupModal(false)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={cleanupOptions}
              keyExtractor={(item) => item.value}
              renderItem={renderCleanupOption}
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
    minHeight: 80,
    paddingTop: 14,
  },
  materialsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  materialsOption: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  materialsOptionSelected: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  materialsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  yesNoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  yesNoOption: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  yesNoOptionSelected: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  yesNoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  changeOrderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  changeOrderText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    lineHeight: 20,
  },
  warrantyRow: {
    flexDirection: 'row',
    gap: 0,
  },
  warrantyDropdownButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  uploadFilesList: {
    gap: 8,
  },
  uploadFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  uploadFileName: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  uploadFileRemove: {
    padding: 4,
    borderRadius: 4,
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

export default Responsibilities;

