import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, X } from 'lucide-react-native';
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

interface CleaningServiceProviderProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  companyName: string;
  contactName: string;
  interiorRate: number;
  exteriorRate: number;
  detailRate: number;
  supplies: Supply[];
}

interface Supply {
  name: string;
  quantity: number;
  price: number;
  unit: string;
  total: number;
}

const CleaningServiceProvider: React.FC<CleaningServiceProviderProps> = ({
  onBack,
  onNext,
}) => {

  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    interiorRate: 0,
    exteriorRate: 0,
    detailRate: 0,
    supplies: [],
  });

  const [showSupplyForm, setShowSupplyForm] = useState<boolean>(false);
  const [supplyForm, setSupplyForm] = useState({
    name: '',
    quantity: '1',
    price: '0',
    unit: 'each',
  });

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSupplyForm = () => {
    setShowSupplyForm(!showSupplyForm);
    if (!showSupplyForm) {
      setSupplyForm({ name: '', quantity: '1', price: '0', unit: 'each' });
    }
  };

  const addSupply = () => {
    if (!supplyForm.name.trim()) {
      Alert.alert('Error', 'Please enter a supply name');
      return;
    }

    const quantity = parseInt(supplyForm.quantity) || 1;
    const price = parseFloat(supplyForm.price) || 0;

    const newSupply: Supply = {
      name: supplyForm.name,
      quantity: quantity,
      price: price,
      unit: supplyForm.unit || 'each',
      total: quantity * price,
    };

    setFormData(prev => ({
      ...prev,
      supplies: [...prev.supplies, newSupply],
    }));

    setShowSupplyForm(false);
    setSupplyForm({ name: '', quantity: '1', price: '0', unit: 'each' });
  };

  const removeSupply = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supplies: prev.supplies.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    const suppliesCost = formData.supplies.reduce((total, supply) => total + supply.total, 0);
    const totalCost = formData.interiorRate + formData.exteriorRate + formData.detailRate + suppliesCost;
    
    return {
      suppliesCost,
      totalCost,
    };
  };

  const { suppliesCost, totalCost } = calculateTotals();

  const handleNext = () => {
    if (!formData.companyName || !formData.contactName) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    console.log('Cleaning service data:', formData);
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
          <Text style={styles.title}>Cleaning Service Provider</Text>
          <Text style={styles.subtitle}>Enter your company information and service pricing</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Company Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your cleaning company name"
              placeholderTextColor="#9CA3AF"
              value={formData.companyName}
              onChangeText={(value) => handleInputChange('companyName', value)}
            />
          </View>

          {/* Primary Contact */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Primary Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Contact person name"
              placeholderTextColor="#9CA3AF"
              value={formData.contactName}
              onChangeText={(value) => handleInputChange('contactName', value)}
            />
          </View>

          {/* Interior Cleaning Rate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Interior Cleaning Rate</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              value={formData.interiorRate > 0 ? formData.interiorRate.toString() : ''}
              onChangeText={(value) => handleInputChange('interiorRate', parseFloat(value) || 0)}
              keyboardType="numeric"
            />
          </View>

          {/* Exterior Cleaning Rate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Exterior Cleaning Rate</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              value={formData.exteriorRate > 0 ? formData.exteriorRate.toString() : ''}
              onChangeText={(value) => handleInputChange('exteriorRate', parseFloat(value) || 0)}
              keyboardType="numeric"
            />
          </View>

          {/* Full Detail Service Rate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Detail Service Rate</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              value={formData.detailRate > 0 ? formData.detailRate.toString() : ''}
              onChangeText={(value) => handleInputChange('detailRate', parseFloat(value) || 0)}
              keyboardType="numeric"
            />
          </View>

          {/* Supplies & Materials */}
          <View style={styles.fieldContainer}>
            <View style={styles.suppliesSection}>
              <View style={styles.suppliesHeader}>
                <Text style={styles.label}>Supplies & Materials</Text>
                <TouchableOpacity style={styles.addSupplyButton} onPress={toggleSupplyForm}>
                  <Plus size={16} color="#6B7280" />
                  <Text style={styles.addSupplyButtonText}>Add Supply</Text>
                </TouchableOpacity>
              </View>

              {/* Supply Form */}
              {showSupplyForm && (
                <View style={styles.supplyForm}>
                  <View style={styles.supplyFormGrid}>
                    <TextInput
                      style={styles.supplyInput}
                      placeholder="Supply name"
                      placeholderTextColor="#9CA3AF"
                      value={supplyForm.name}
                      onChangeText={(value) => setSupplyForm(prev => ({ ...prev, name: value }))}
                    />
                    <TextInput
                      style={styles.supplyInput}
                      placeholder="Qty"
                      placeholderTextColor="#9CA3AF"
                      value={supplyForm.quantity}
                      onChangeText={(value) => setSupplyForm(prev => ({ ...prev, quantity: value }))}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.supplyInput}
                      placeholder="Price"
                      placeholderTextColor="#9CA3AF"
                      value={supplyForm.price}
                      onChangeText={(value) => setSupplyForm(prev => ({ ...prev, price: value }))}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.supplyInput}
                      placeholder="Unit"
                      placeholderTextColor="#9CA3AF"
                      value={supplyForm.unit}
                      onChangeText={(value) => setSupplyForm(prev => ({ ...prev, unit: value }))}
                    />
                  </View>
                  <View style={styles.formButtons}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={addSupply}>
                      <Text style={styles.btnText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary} onPress={toggleSupplyForm}>
                      <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Supply List */}
              <View style={styles.supplyList}>
                {formData.supplies.map((supply, index) => (
                  <View key={index} style={styles.supplyItem}>
                    <View style={styles.supplyInfo}>
                      <Text style={styles.supplyName}>{supply.name}</Text>
                      <Text style={styles.supplyDetails}>
                        Qty: {supply.quantity} {supply.unit} @ ${supply.price.toFixed(2)} each
                      </Text>
                    </View>
                    <Text style={styles.supplyCost}>${supply.total.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.removeSupply} onPress={() => removeSupply(index)}>
                      <X size={16} color="#e53e3e" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Invoice Summary */}
        <View style={styles.invoiceSummary}>
          <Text style={styles.invoiceTitle}>Service Estimate</Text>
          <View style={styles.invoiceLine}>
            <Text style={styles.invoiceLabel}>Interior Cleaning:</Text>
            <Text style={styles.invoiceValue}>${formData.interiorRate.toFixed(2)}</Text>
          </View>
          <View style={styles.invoiceLine}>
            <Text style={styles.invoiceLabel}>Exterior Cleaning:</Text>
            <Text style={styles.invoiceValue}>${formData.exteriorRate.toFixed(2)}</Text>
          </View>
          <View style={styles.invoiceLine}>
            <Text style={styles.invoiceLabel}>Full Detail Service:</Text>
            <Text style={styles.invoiceValue}>${formData.detailRate.toFixed(2)}</Text>
          </View>
          <View style={styles.invoiceLine}>
            <Text style={styles.invoiceLabel}>Supplies Cost:</Text>
            <Text style={styles.invoiceValue}>${suppliesCost.toFixed(2)}</Text>
          </View>
          <View style={styles.invoiceTotal}>
            <View style={styles.invoiceLine}>
              <Text style={styles.invoiceTotalLabel}>Total Estimate:</Text>
              <Text style={styles.invoiceTotalValue}>${totalCost.toFixed(2)}</Text>
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
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/homepages/createcontract/service/cleaning/aviation/planecleaning3')}
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
  suppliesSection: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  suppliesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addSupplyButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addSupplyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  supplyForm: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  supplyFormGrid: {
    gap: 8,
    marginBottom: 12,
  },
  supplyInput: {
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  btnPrimary: {
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  btnSecondary: {
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  supplyList: {
    marginTop: 12,
    gap: 8,
  },
  supplyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  supplyInfo: {
    flex: 1,
  },
  supplyName: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  supplyDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  supplyCost: {
    fontWeight: '600',
    color: '#111827',
    marginRight: 12,
  },
  removeSupply: {
    backgroundColor: '#fed7d7',
    borderRadius: 6,
    padding: 6,
  },
  invoiceSummary: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  invoiceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceLabel: {
    fontSize: 16,
    color: '#111827',
  },
  invoiceValue: {
    fontSize: 16,
    color: '#111827',
  },
  invoiceTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 12,
  },
  invoiceTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  invoiceTotalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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

export default CleaningServiceProvider;

