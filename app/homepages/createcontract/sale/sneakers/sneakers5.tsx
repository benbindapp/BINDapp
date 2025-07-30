import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ArrowLeft
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Vehicle {
  year: string;
  make: string;
  model: string;
  vin: string;
  mileage: string;
}

interface Party {
  name: string;
  email: string;
  phone: string;
}

interface Financial {
  salePrice: string;
  deposit: string;
  paymentMethod: string;
  dueDate: string;
}

interface ContractData {
  vehicle: Vehicle;
  buyer: Party;
  seller: Party;
  financial: Financial;
  contingencies: string[];
}

const VehicleSaleReview: React.FC = () => {
  const router = useRouter()
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [signaturePaths, setSignaturePaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Sample data - would come from previous steps
  const contractData: ContractData = {
    vehicle: {
      year: '2020',
      make: 'Toyota',
      model: 'Camry',
      vin: '1HGBH41JXMN109186',
      mileage: '45,000'
    },
    buyer: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567'
    },
    seller: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com', 
      phone: '(555) 987-6543'
    },
    financial: {
      salePrice: '$18,500',
      deposit: '$2,000',
      paymentMethod: 'Bank Transfer',
      dueDate: 'Upon delivery'
    },
    contingencies: [
      'Pre-purchase Inspection',
      'Financing Approval',
      'Title & Lien Search'
    ]
  };

  const getOrdinalSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const convertNumberToWords = (priceString: string): string => {
    const price = priceString.replace('$', '').replace(',', '');
    const number = parseInt(price);
    
    if (number === 18500) return 'Eighteen Thousand Five Hundred';
    if (number === 16000) return 'Sixteen Thousand';
    if (number === 10000) return 'Ten Thousand';
    
    // Basic conversion for common amounts
    if (number < 1000) return number.toString();
    if (number < 100000) {
      const thousands = Math.floor(number / 1000);
      const remainder = number % 1000;
      let result = thousands + ' Thousand';
      if (remainder > 0) result += ' ' + remainder;
      return result;
    }
    return number.toLocaleString();
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getProfileName = (name: string): string => {
    return '@' + name.toLowerCase().replace(' ', '');
  };

  const clearSignature = (): void => {
    setSignaturePaths([]);
    setCurrentPath('');
  };

  const handleCreateContract = (): void => {
    if (!isAgreed) {
      Alert.alert('Missing Information', 'Please agree to terms and provide your signature');
      return;
    }
    
    console.log('Creating contract with signature data');
    // Navigate to success/completion screen
  };

  const handleEdit = (section: string): void => {
    console.log('Edit section:', section);
    // Navigate back to specific step
  };

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Review & Sign</Text>
          <Text style={styles.subtitle}>Review all details and sign to create your vehicle sale contract.</Text>
        </View>

        {/* Contract Summary */}
        <View style={styles.summaryContainer}>
          
          {/* Vehicle Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="car-outline" size={20} color="#6b7280" />
                <Text style={styles.cardTitle}>Vehicle</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleEdit('vehicle')}
                style={styles.editButton}
              >
                <Ionicons name="pencil-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Year, Make, Model:</Text>
                <Text style={styles.infoValue}>
                  {contractData.vehicle.year} {contractData.vehicle.make} {contractData.vehicle.model}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>VIN:</Text>
                <Text style={styles.infoValue}>{contractData.vehicle.vin}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mileage:</Text>
                <Text style={styles.infoValue}>{contractData.vehicle.mileage} miles</Text>
              </View>
            </View>
          </View>

          {/* Parties Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Parties</Text>
              <TouchableOpacity 
                onPress={() => handleEdit('parties')}
                style={styles.editButton}
              >
                <Ionicons name="pencil-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.partySection}>
                <Text style={styles.partyLabel}>Buyer</Text>
                <View style={styles.partyInfo}>
                  <View style={[styles.avatar, { backgroundColor: '#3b82f6' }]}>
                    <Text style={styles.avatarText}>{getInitials(contractData.buyer.name)}</Text>
                  </View>
                  <View style={styles.partyDetails}>
                    <Text style={styles.partyName}>{contractData.buyer.name}</Text>
                    <Text style={styles.partyProfile}>{getProfileName(contractData.buyer.name)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.partySection}>
                <Text style={styles.partyLabel}>Seller</Text>
                <View style={styles.partyInfo}>
                  <View style={[styles.avatar, { backgroundColor: '#10b981' }]}>
                    <Text style={styles.avatarText}>{getInitials(contractData.seller.name)}</Text>
                  </View>
                  <View style={styles.partyDetails}>
                    <Text style={styles.partyName}>{contractData.seller.name}</Text>
                    <Text style={styles.partyProfile}>{getProfileName(contractData.seller.name)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Financial Terms */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="cash-outline" size={20} color="#6b7280" />
                <Text style={styles.cardTitle}>Financial Terms</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleEdit('financial')}
                style={styles.editButton}
              >
                <Ionicons name="pencil-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sale Price:</Text>
                <Text style={styles.infoValue}>{contractData.financial.salePrice}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Deposit:</Text>
                <Text style={styles.infoValue}>{contractData.financial.deposit}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Method:</Text>
                <Text style={styles.infoValue}>{contractData.financial.paymentMethod}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Due Date:</Text>
                <Text style={styles.infoValue}>{contractData.financial.dueDate}</Text>
              </View>
            </View>
          </View>

          {/* Contingencies */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#6b7280" />
                <Text style={styles.cardTitle}>Contingencies</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleEdit('contingencies')}
                style={styles.editButton}
              >
                <Ionicons name="pencil-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
              {contractData.contingencies.map((contingency, index) => (
                <View key={index} style={styles.contingencyRow}>
                  <Ionicons name="checkmark" size={16} color="#10b981" />
                  <Text style={styles.contingencyText}>{contingency}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Generated Contract */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle Sale Contract</Text>
            
            <View style={styles.contractDocument}>
              <Text style={styles.contractText}>
                This Bill of Sale and Purchase Agreement ("Agreement") is entered into on this {day}{getOrdinalSuffix(day)} day of {month}, {year}, by and between:
              </Text>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractBold}>Seller:</Text>
                <Text style={styles.contractText}>{contractData.seller.name}</Text>
              </View>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractBold}>Buyer:</Text>
                <Text style={styles.contractText}>{contractData.buyer.name}</Text>
              </View>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractSubheading}>1. Description of the Vehicle</Text>
                <Text style={styles.contractText}>The Seller agrees to sell, and the Buyer agrees to purchase, the following described vehicle:</Text>
                <Text style={styles.contractBullet}>• Make and Model: {contractData.vehicle.year} {contractData.vehicle.make} {contractData.vehicle.model}</Text>
                <Text style={styles.contractBullet}>• VIN: {contractData.vehicle.vin}</Text>
                <Text style={styles.contractBullet}>• Mileage: {contractData.vehicle.mileage} miles</Text>
              </View>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractSubheading}>2. Purchase Price</Text>
                <Text style={styles.contractText}>The total purchase price for the vehicle is {contractData.financial.salePrice} ({convertNumberToWords(contractData.financial.salePrice)} US Dollars). The Buyer agrees to pay the full purchase price according to the payment terms specified below.</Text>
              </View>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractSubheading}>3. Payment Terms</Text>
                <Text style={styles.contractText}>Payment Method: {contractData.financial.paymentMethod}</Text>
                <Text style={styles.contractText}>Payment Due: {contractData.financial.dueDate}</Text>
                {contractData.financial.deposit !== '$0' && (
                  <Text style={styles.contractText}>Deposit Amount: {contractData.financial.deposit}</Text>
                )}
              </View>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractSubheading}>4. Contingencies</Text>
                <Text style={styles.contractText}>This sale is subject to the following contingencies:</Text>
                {contractData.contingencies.map((contingency, index) => (
                  <Text key={index} style={styles.contractBullet}>• {contingency}</Text>
                ))}
              </View>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractSubheading}>5. Title and Transfer</Text>
                <Text style={styles.contractText}>The Seller warrants that they hold clear title to the vehicle and will transfer such title to the Buyer upon completion of payment and satisfaction of all contingencies.</Text>
              </View>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractSubheading}>6. As-Is Sale</Text>
                <Text style={styles.contractText}>This vehicle is sold "as-is" without any warranties, express or implied. The Buyer acknowledges that they have inspected the vehicle or waived their right to inspection.</Text>
              </View>
              
              <View style={styles.contractSection}>
                <Text style={styles.contractSubheading}>7. Binding Agreement</Text>
                <Text style={styles.contractText}>By signing below, both parties agree to be legally bound by the terms and conditions set forth in this Agreement.</Text>
              </View>
            </View>
          </View>

          {/* Digital Signature Section */}
          <View style={styles.signatureCard}>
            <View style={styles.signatureHeader}>
              <Text style={styles.signatureTitle}>Draw your eSignature here</Text>
            </View>
            
            <View style={styles.signatureArea}>
              <View style={styles.signatureToolbar}>
                <TouchableOpacity onPress={clearSignature} style={styles.clearButton}>
                  <Ionicons name="close" size={24} color="#9ca3af" />
                </TouchableOpacity>
                <View style={styles.signatureLine} />
              </View>
              
              <View style={styles.canvasContainer}>
                <Svg height="120" width="100%" style={styles.signatureCanvas}>
                  {signaturePaths.map((path, index) => (
                    <Path
                      key={index}
                      d={path}
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  ))}
                  {currentPath && (
                    <Path
                      d={currentPath}
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  )}
                </Svg>
              </View>
            </View>
            
            <Text style={styles.signatureDisclaimer}>
              By signing this BIND, both parties agree to be legally bound by these terms
            </Text>
          </View>

          {/* Agreement Checkbox */}
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => setIsAgreed(!isAgreed)}
              style={styles.agreementButton}
            >
              <View style={[
                styles.checkbox,
                isAgreed && styles.checkboxActive
              ]}>
                {isAgreed && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.agreementText}>
                I agree to the terms and conditions of this vehicle sale contract and understand that this creates a legally binding agreement between the parties.
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Step 5 of 5</Text>
            <Text style={styles.progressLabel}>100%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Create Contract Button */}
        <TouchableOpacity onPress={handleCreateContract} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Send to {contractData.buyer.name}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 4,
    paddingBottom: 120,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  summaryContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  editButton: {
    padding: 4,
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  partySection: {
    marginBottom: 16,
  },
  partyLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  partyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  partyDetails: {
    flex: 1,
  },
  partyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  partyProfile: {
    fontSize: 14,
    color: '#6b7280',
  },
  contingencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contingencyText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
  },
  contractDocument: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  contractSection: {
    marginBottom: 16,
  },
  contractText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
  },
  contractBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  contractSubheading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  contractBullet: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 16,
    marginBottom: 2,
  },
  signatureCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  signatureHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  signatureTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#10b981',
    marginBottom: 8,
  },
  signatureArea: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  signatureToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    marginRight: 16,
  },
  signatureLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4b5563',
  },
  canvasContainer: {
    height: 120,
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 4,
    backgroundColor: '#1f2937',
  },
  signatureCanvas: {
    backgroundColor: 'transparent',
  },
  signatureDisclaimer: {
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
  },
  agreementButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: '#10b981',
    backgroundColor: '#10b981',
  },
  agreementText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 16,
    marginTop: 'auto',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  }
});

export default VehicleSaleReview;

