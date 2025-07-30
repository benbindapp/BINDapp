import { useRouter } from 'expo-router';
import {
    ArrowLeft
} from 'lucide-react-native';
import React, { useState } from 'react';
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

interface FormData {
  earlyTermination: string;
  terminationFee: string;
  noticePeriod: string;
  maintenanceResponsibilities: string[];
  sublettingPolicy: string;
  entryNotice: string;
  legalClauses: string[];
  additionalClauses: string;
}

const ContingenciesScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    earlyTermination: '',
    terminationFee: '',
    noticePeriod: '',
    maintenanceResponsibilities: [],
    sublettingPolicy: '',
    entryNotice: '',
    legalClauses: [],
    additionalClauses: '',
  });
  const router = useRouter()
  const [showNoticePeriodDropdown, setShowNoticePeriodDropdown] = useState(false);
  const [showSublettingDropdown, setShowSublettingDropdown] = useState(false);
  const [showEntryNoticeDropdown, setShowEntryNoticeDropdown] = useState(false);

  const noticePeriodOptions = ['30 days', '60 days', '90 days'];
  const sublettingOptions = [
    'Not Allowed',
    'With Written Permission',
    'Allowed with Notice',
    'Freely Allowed',
  ];
  const entryNoticeOptions = ['24 hours', '48 hours', '72 hours', '1 week'];

  const maintenanceOptions = [
    {
      id: 'minorRepairs',
      title: 'Minor Repairs',
      description: 'Clogged drains, light bulbs, air filters, etc. (under $100)',
    },
    {
      id: 'landscaping',
      title: 'Landscaping & Yard Care',
      description: 'Lawn mowing, weeding, basic yard maintenance',
    },
    {
      id: 'hvacFilters',
      title: 'HVAC Filter Changes',
      description: 'Regular replacement of heating/cooling system filters',
    },
    {
      id: 'pestControl',
      title: 'Pest Control',
      description: 'Tenant-caused infestations and preventive measures',
    },
  ];

  const legalClausesOptions = [
    {
      id: 'forceClause',
      title: 'Force Majeure Clause',
      description: 'Protection against unforeseeable circumstances (natural disasters, etc.)',
    },
    {
      id: 'holdHarmless',
      title: 'Hold Harmless Agreement',
      description: 'Tenant assumes responsibility for injuries on the property',
    },
    {
      id: 'rentersInsurance',
      title: 'Renter\'s Insurance Requirement',
      description: 'Tenant must maintain renter\'s insurance throughout lease term',
    },
    {
      id: 'jointSeveral',
      title: 'Joint & Several Liability',
      description: 'Each tenant is fully responsible for all lease obligations',
    },
  ];

  const handleBack = () => {
    console.log('Going back to previous step');
    // Here you would typically call your onBack callback
    // onBack();
  };

  const selectEarlyTermination = (choice: string) => {
    setFormData(prev => ({
      ...prev,
      earlyTermination: choice,
      terminationFee: choice === 'no' ? '' : prev.terminationFee,
      noticePeriod: choice === 'no' ? '' : prev.noticePeriod,
    }));
  };

  const toggleMaintenance = (maintenance: string) => {
    setFormData(prev => {
      const index = prev.maintenanceResponsibilities.indexOf(maintenance);
      const newResponsibilities = [...prev.maintenanceResponsibilities];
      
      if (index > -1) {
        newResponsibilities.splice(index, 1);
      } else {
        newResponsibilities.push(maintenance);
      }
      
      return {
        ...prev,
        maintenanceResponsibilities: newResponsibilities,
      };
    });
  };

  const toggleLegalClause = (clause: string) => {
    setFormData(prev => {
      const index = prev.legalClauses.indexOf(clause);
      const newClauses = [...prev.legalClauses];
      
      if (index > -1) {
        newClauses.splice(index, 1);
      } else {
        newClauses.push(clause);
      }
      
      return {
        ...prev,
        legalClauses: newClauses,
      };
    });
  };

  const selectNoticePeriod = (period: string) => {
    setFormData(prev => ({ ...prev, noticePeriod: period }));
    setShowNoticePeriodDropdown(false);
  };

  const selectSubletting = (policy: string) => {
    setFormData(prev => ({ ...prev, sublettingPolicy: policy }));
    setShowSublettingDropdown(false);
  };

  const selectEntryNotice = (notice: string) => {
    setFormData(prev => ({ ...prev, entryNotice: notice }));
    setShowEntryNoticeDropdown(false);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.earlyTermination) {
      errors.push('Please specify early termination policy');
    }

    if (formData.earlyTermination === 'yes') {
      if (!formData.terminationFee) {
        errors.push('Please enter early termination fee');
      }
      if (!formData.noticePeriod) {
        errors.push('Please select required notice period');
      }
    }

    if (!formData.sublettingPolicy) {
      errors.push('Please select subletting policy');
    }

    if (!formData.entryNotice) {
      errors.push('Please select landlord entry notice requirement');
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateForm();

    if (errors.length > 0) {
      Alert.alert('Please complete the following', errors.join('\n'));
      return;
    }

    console.log('Contingencies form data:', formData);
    Alert.alert('Success', 'Contingencies saved! Moving to payment setup...');

    // Here you would typically call your onNext callback
    // onNext(formData);
  };

  const renderDropdownOption = (
    item: string,
    onSelect: (item: string) => void
  ) => (
    <TouchableOpacity
      style={styles.dropdownOption}
      onPress={() => onSelect(item)}
      key={item}
    >
      <Text style={styles.dropdownOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderMaintenanceItem = ({ item }: { item: typeof maintenanceOptions[0] }) => {
    const isSelected = formData.maintenanceResponsibilities.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.checkboxItem, isSelected && styles.checkboxItemSelected]}
        onPress={() => toggleMaintenance(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.checkboxContent}>
          <Text style={styles.checkboxTitle}>{item.title}</Text>
          <Text style={styles.checkboxDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLegalClauseItem = ({ item }: { item: typeof legalClausesOptions[0] }) => {
    const isSelected = formData.legalClauses.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.checkboxItem, isSelected && styles.checkboxItemSelected]}
        onPress={() => toggleLegalClause(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.checkboxContent}>
          <Text style={styles.checkboxTitle}>{item.title}</Text>
          <Text style={styles.checkboxDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
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
          <Text style={styles.title}>Contingencies & Clauses</Text>
          <Text style={styles.subtitle}>Add special conditions and legal protections to your lease</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Early Termination */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Early Termination</Text>
            <Text style={styles.sublabel}>Allow tenant to break lease early under certain conditions?</Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.earlyTermination === 'yes' && styles.gridButtonActive,
                ]}
                onPress={() => selectEarlyTermination('yes')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.earlyTermination === 'yes' && styles.gridButtonTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gridButton,
                  formData.earlyTermination === 'no' && styles.gridButtonActive,
                ]}
                onPress={() => selectEarlyTermination('no')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    formData.earlyTermination === 'no' && styles.gridButtonTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            {/* Early Termination Details */}
            {formData.earlyTermination === 'yes' && (
              <View style={styles.customDaySection}>
                <Text style={styles.sublabel}>Early termination fee (months of rent)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2"
                  placeholderTextColor="#9CA3AF"
                  value={formData.terminationFee}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, terminationFee: text }))}
                  keyboardType="numeric"
                />

                <View style={styles.dropdownSection}>
                  <Text style={styles.sublabel}>Required notice period</Text>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowNoticePeriodDropdown(true)}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        !formData.noticePeriod && styles.placeholder,
                      ]}
                    >
                      {formData.noticePeriod || 'Select notice period'}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Maintenance & Repairs */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Maintenance & Repair Responsibilities</Text>
            <Text style={styles.sublabel}>Select which repairs the tenant is responsible for</Text>
            <FlatList
              data={maintenanceOptions}
              renderItem={renderMaintenanceItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.checkboxGroup}
            />
          </View>

          {/* Subletting Policy */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Subletting & Assignment</Text>
            <Text style={styles.sublabel}>Can the tenant sublet or assign the lease?</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowSublettingDropdown(true)}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !formData.sublettingPolicy && styles.placeholder,
                ]}
              >
                {formData.sublettingPolicy || 'Select subletting policy'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Right of Entry */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Landlord Right of Entry</Text>
            <Text style={styles.sublabel}>How much notice is required for landlord entry?</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowEntryNoticeDropdown(true)}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !formData.entryNotice && styles.placeholder,
                ]}
              >
                {formData.entryNotice || 'Select notice requirement'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Legal Protections */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Legal Protections</Text>
            <Text style={styles.sublabel}>Include standard legal clauses and protections</Text>
            <FlatList
              data={legalClausesOptions}
              renderItem={renderLegalClauseItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.checkboxGroup}
            />
          </View>

          {/* Additional Clauses */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Additional Clauses</Text>
            <Text style={styles.sublabel}>Add any custom terms or conditions</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Enter any additional terms, conditions, or special agreements..."
              placeholderTextColor="#9CA3AF"
              value={formData.additionalClauses}
              onChangeText={(text) => setFormData(prev => ({ ...prev, additionalClauses: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

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

        {/* Complete Button */}
        <TouchableOpacity style={styles.completeButton} onPress={() => router.push('/homepages/createcontract/rent/apartment/apartment4')} activeOpacity={0.8}>
          <Text style={styles.completeButtonText}>Continue to Payment Setup</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Notice Period Modal */}
      <Modal
        visible={showNoticePeriodDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNoticePeriodDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowNoticePeriodDropdown(false)}
        >
          <View style={styles.modalContent}>
            {noticePeriodOptions.map(option => renderDropdownOption(option, selectNoticePeriod))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Subletting Modal */}
      <Modal
        visible={showSublettingDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSublettingDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowSublettingDropdown(false)}
        >
          <View style={styles.modalContent}>
            {sublettingOptions.map(option => renderDropdownOption(option, selectSubletting))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Entry Notice Modal */}
      <Modal
        visible={showEntryNoticeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEntryNoticeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowEntryNoticeDropdown(false)}
        >
          <View style={styles.modalContent}>
            {entryNoticeOptions.map(option => renderDropdownOption(option, selectEntryNotice))}
          </View>
        </TouchableOpacity>
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
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  gridButton: {
    flex: 1,
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
  customDaySection: {
    marginTop: 16,
  },
  dropdownSection: {
    marginTop: 16,
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
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  checkboxGroup: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
  },
  checkboxItemSelected: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2fb035',
    borderColor: '#2fb035',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 19.6,
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
    width: '60%',
    backgroundColor: '#2fb035',
    borderRadius: 4,
  },
  completeButton: {
    width: '100%',
    backgroundColor: '#2fb035',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#2fb035',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  completeButtonText: {
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
    paddingVertical: 8,
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

export default ContingenciesScreen;

