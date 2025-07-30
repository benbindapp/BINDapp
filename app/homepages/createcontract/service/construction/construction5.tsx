import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    Check,
    CheckSquare,
    CreditCard,
    ExternalLink,
    Home,
    Shield,
    Trash2,
    X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReviewSignProps {
  onGoBack?: () => void;
  onEdit?: (section: string) => void;
  onSendContract?: () => void;
}

const ReviewSign: React.FC<ReviewSignProps> = ({
  onGoBack,
  onEdit,
  onSendContract,
}) => {
  const router = useRouter()
  const [isAgreed, setIsAgreed] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [signaturePath, setSignaturePath] = useState<string>('');
  const [hasSignature, setHasSignature] = useState(false);

  const handleEdit = (section: string) => {
    onEdit?.(section);
  };

  const handleGoBack = () => {
    onGoBack?.();
  };

  const toggleAgreement = () => {
    setIsAgreed(!isAgreed);
  };

  const expandContract = () => {
    if (!isAgreed) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions first');
      return;
    }
    setContractModalVisible(true);
  };

  const closeContract = () => {
    setContractModalVisible(false);
  };

  const clearSignature = () => {
    setSignaturePath('');
    setHasSignature(false);
  };

  const handleSignature = () => {
    if (!hasSignature) {
      Alert.alert('Signature Required', 'Please provide your electronic signature above');
      return;
    }
    
    Alert.alert('Success', 'Contract signed successfully! Redirecting to confirmation page...');
    closeContract();
  };

  const handleSendContract = () => {
    if (!isAgreed) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions');
      return;
    }
    
    Alert.alert('Success', 'Contract sent successfully to Johnson Family!');
    onSendContract?.();
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const ProtectionRow = ({ text }: { text: string }) => (
    <View style={styles.protectionRow}>
      <Check size={16} color="#2fb035" />
      <Text style={styles.protectionText}>{text}</Text>
    </View>
  );

  const SignaturePad = () => (
    <View style={styles.signatureCard}>
      <View style={styles.signatureHeader}>
        <Text style={styles.signatureTitle}>Electronic Signature</Text>
      </View>
      <View style={styles.signatureArea}>
        <View style={styles.signatureToolbar}>
          <TouchableOpacity onPress={clearSignature} style={styles.clearButton}>
            <Trash2 size={20} color="#9ca3af" />
          </TouchableOpacity>
          <View style={styles.signatureLine} />
        </View>
        <View style={styles.canvasContainer}>
          {/* In a real app, you'd use react-native-signature-canvas or similar */}
          <TouchableOpacity 
            style={styles.signatureCanvas}
            onPress={() => setHasSignature(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.canvasPlaceholder}>Touch here to sign</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.signatureDisclaimer}>
        Please sign above using your finger or stylus
      </Text>
      <TouchableOpacity 
        style={styles.modalSignButton} 
        onPress={handleSignature}
        activeOpacity={0.8}
      >
        <Text style={styles.modalSignButtonText}>Complete E-Signature</Text>
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Review & Sign</Text>
          <Text style={styles.subtitle}>
            Review all details and sign to create your construction service contract.
          </Text>
        </View>

        {/* Service Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Home size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Service Details</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('service')}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Type of Work:" value="Kitchen Remodel" />
            <InfoRow label="Service Type:" value="Installation" />
            <InfoRow label="Location:" value="123 Main Street, Charleston, SC" />
            <InfoRow label="Timeline:" value="Aug 1, 2025 - Aug 15, 2025" />
            <InfoRow label="Client:" value="Johnson Family" />
          </View>
        </View>

        {/* Responsibilities */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <CheckSquare size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Responsibilities</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('responsibilities')}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Materials Provided By:" value="Contractor" />
            <InfoRow label="Permit Responsibility:" value="Contractor" />
            <InfoRow label="Warranty:" value="1 Year" />
            <InfoRow label="Cleanup:" value="Contractor" />
            <InfoRow label="Insurance Required:" value="Yes" />
          </View>
        </View>

        {/* Contingencies */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Shield size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Contingencies</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('contingencies')}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <ProtectionRow text="Weather Delays - Timeline extensions for heavy rain/snow" />
            <ProtectionRow text="Material Delays - Extensions for supply chain issues" />
            <ProtectionRow text="Hidden Conditions - Written approval for unforeseen work" />
          </View>
        </View>

        {/* Construction Service Provider */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Calendar size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Construction Service Provider</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('provider')}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.partySection}>
              <Text style={styles.partyLabel}>Service Provider</Text>
              <View style={styles.partyInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>CS</Text>
                </View>
                <View style={styles.partyDetails}>
                  <Text style={styles.partyName}>Charleston Construction Services</Text>
                  <Text style={styles.partyProfile}>Contact: Mike Thompson</Text>
                </View>
              </View>
            </View>
            <InfoRow label="Total Project Cost:" value="$15,000.00" />
            <InfoRow label="Material Deposit:" value="$5,000.00" />
            <InfoRow label="Remaining Balance:" value="$10,000.00" />
          </View>
        </View>

        {/* Payment Setup */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <CreditCard size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Payment Setup</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('payment')}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Payment Type:" value="Material Deposit" />
            <InfoRow label="Deposit Due:" value="Upon Agreement" />
            <InfoRow label="Remaining Due:" value="Upon Completion" />
            <InfoRow label="Payment Methods:" value="Credit/Debit Card, ACH" />
            <InfoRow label="Payment Destination:" value="CONSTRUCTION SERVICES LLC (••••7842)" />
          </View>
        </View>

        {/* Generated Contract */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Construction Service Contract</Text>
          </View>
          <View style={styles.contractDocument}>
            <Text style={styles.contractText}>
              This Construction Service Agreement ("Agreement") is entered into on this 22nd day of
              July, 2025, by and between:
            </Text>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Service Provider:</Text>
              <Text style={styles.contractText}>CONSTRUCTION SERVICES LLC</Text>
              <Text style={styles.contractText}>
                Contact: Charleston Construction Services - Mike Thompson
              </Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Client:</Text>
              <Text style={styles.contractText}>Johnson Family</Text>
              <Text style={styles.contractText}>Property Owner</Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractSubheading}>1. Project and Service Details</Text>
              <Text style={styles.contractText}>
                The Service Provider agrees to provide construction services for the following project:
              </Text>
              <Text style={styles.contractBullet}>• Project: Kitchen Remodel</Text>
              <Text style={styles.contractBullet}>• Service Type: Installation</Text>
              <Text style={styles.contractBullet}>• Project Timeline: August 1, 2025 - August 15, 2025</Text>
              <Text style={styles.contractBullet}>• Location: 123 Main Street, Charleston, SC</Text>
            </View>

            {/* View Full Contract & E-Sign Button */}
            <TouchableOpacity 
              style={styles.viewSignButton} 
              onPress={expandContract}
              activeOpacity={0.8}
            >
              <ExternalLink size={16} color="white" />
              <Text style={styles.viewSignButtonText}>View Full Contract & E-Sign</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Agreement Checkbox */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.agreementButton} 
            onPress={toggleAgreement}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, isAgreed && styles.checkboxActive]}>
              {isAgreed && <Check size={16} color="white" />}
            </View>
            <Text style={styles.agreementText}>
              I agree to the terms and conditions of this construction service contract and
              understand that this creates a transactional agreement between the parties.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 5 of 5</Text>
            <Text style={styles.progressText}>100%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Send Contract Button */}
        <TouchableOpacity 
          style={[
            styles.sendButton,
            isAgreed && styles.sendButtonEnabled
          ]} 
          onPress={handleSendContract}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.sendButtonText,
            isAgreed && styles.sendButtonTextEnabled
          ]}>
            Send to Johnson Family
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Contract Modal */}
      <Modal
        visible={contractModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeContract}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.contractModalHeader}>
            <Text style={styles.contractModalTitle}>Construction Service Contract</Text>
            <TouchableOpacity onPress={closeContract} style={styles.closeModalButton}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.contractModalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fullContractText}>
              This Construction Service Agreement ("Agreement") is entered into on this 22nd day of
              July, 2025, by and between Johnson Family and CONSTRUCTION SERVICES LLC.
            </Text>

            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>1. Project and Service Details</Text>
              <Text style={styles.fullContractText}>
                The Service Provider agrees to provide professional construction services for the following project:
              </Text>
              <Text style={styles.fullContractBullet}>• Project Type: Kitchen Remodel</Text>
              <Text style={styles.fullContractBullet}>• Service Type: Installation</Text>
              <Text style={styles.fullContractBullet}>• Project Timeline: August 1, 2025 - August 15, 2025</Text>
              <Text style={styles.fullContractBullet}>• Work Location: 123 Main Street, Charleston, SC 29401</Text>
              <Text style={styles.fullContractBullet}>• Service Provider: Charleston Construction Services</Text>
              <Text style={styles.fullContractBullet}>• Primary Contact: Mike Thompson</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>2. Scope of Work</Text>
              <Text style={styles.fullContractText}>
                The construction services shall include but are not limited to:
              </Text>
              <Text style={styles.fullContractBullet}>• Complete kitchen demolition and removal of existing fixtures</Text>
              <Text style={styles.fullContractBullet}>• Installation of new cabinetry, countertops, and appliances</Text>
              <Text style={styles.fullContractBullet}>• Electrical work including outlet and lighting installation</Text>
              <Text style={styles.fullContractBullet}>• Plumbing modifications for new sink and appliance connections</Text>
              <Text style={styles.fullContractBullet}>• Flooring installation and finishing work</Text>
              <Text style={styles.fullContractBullet}>• Paint and trim work to complete the renovation</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>3. Financial Terms</Text>
              <Text style={styles.fullContractText}>
                The total cost for construction services is $15,000.00 (Fifteen Thousand US Dollars), with the following payment structure:
              </Text>
              <Text style={styles.fullContractBullet}>• Material Deposit: $5,000.00 (Due upon agreement execution)</Text>
              <Text style={styles.fullContractBullet}>• Remaining Balance: $10,000.00 (Due upon completion)</Text>
              <Text style={styles.fullContractText}>Accepted Payment Methods: Credit/Debit Card, ACH/Bank Transfer</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>4. Responsibilities and Terms</Text>
              <Text style={styles.fullContractText}>The following responsibilities and terms apply:</Text>
              <Text style={styles.fullContractBullet}>• Materials will be provided by the Contractor</Text>
              <Text style={styles.fullContractBullet}>• Contractor is responsible for obtaining all necessary permits</Text>
              <Text style={styles.fullContractBullet}>• 1 Year warranty on all work performed</Text>
              <Text style={styles.fullContractBullet}>• Job site cleanup is the responsibility of the Contractor</Text>
              <Text style={styles.fullContractBullet}>• Contractor will provide proof of insurance</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>5. Contingencies and Protections</Text>
              <Text style={styles.fullContractText}>
                The following contingencies provide protection for both parties:
              </Text>
              <Text style={styles.fullContractBullet}>• Weather Delays: Timeline extensions granted without penalty for heavy rain/snow conditions</Text>
              <Text style={styles.fullContractBullet}>• Material Delays: Timeline flexibility for supply chain issues beyond contractor control</Text>
              <Text style={styles.fullContractBullet}>• Hidden Conditions: Additional costs for unforeseen work require written approval before proceeding</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>6. Insurance and Liability</Text>
              <Text style={styles.fullContractText}>
                Service Provider maintains comprehensive general liability insurance with minimum coverage of $1,000,000.
                Service Provider agrees to exercise reasonable care in performing services but shall not be liable for
                damage resulting from pre-existing conditions, normal wear and tear, or circumstances beyond reasonable control.
              </Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>7. Terms and Conditions</Text>
              <Text style={styles.fullContractText}>
                This agreement shall be governed by the laws of South Carolina. Any disputes arising from this agreement
                shall be resolved through binding arbitration. This agreement constitutes the entire understanding between
                the parties and may only be modified in writing signed by both parties.
              </Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>8. Signatures</Text>
              <Text style={styles.fullContractText}>
                By signing below, both parties agree to be bound by the terms and conditions set forth in this Agreement.
              </Text>
            </View>
            
            <SignaturePad />
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingVertical: 16
 },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
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
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 12,
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
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  editButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    color: '#374151',
    fontSize: 14,
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
    backgroundColor: '#2fb035',
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
  protectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  protectionText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
    flex: 1,
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
  viewSignButton: {
    backgroundColor: '#2fb035',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  viewSignButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
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
    borderColor: '#2fb035',
    backgroundColor: '#2fb035',
  },
  agreementText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    lineHeight: 20,
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
    color: '#6b7280',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2fb035',
    width: '100%',
    borderRadius: 4,
  },
  sendButton: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 32,
  },
  sendButtonEnabled: {
    backgroundColor: '#2fb035',
    borderColor: '#2fb035',
  },
  sendButtonText: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: '600',
  },
  sendButtonTextEnabled: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  contractModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  contractModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  closeModalButton: {
    padding: 4,
  },
  contractModalBody: {
    flex: 1,
    padding: 20,
  },
  fullContractSection: {
    marginBottom: 24,
  },
  fullContractSubheading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  fullContractText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 8,
  },
  fullContractBullet: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 20,
    marginBottom: 4,
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
    color: '#2fb035',
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
    padding: 4,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasPlaceholder: {
    color: '#6b7280',
    fontSize: 14,
  },
  signatureDisclaimer: {
    fontSize: 14,
    color: '#2fb035',
    textAlign: 'center',
  },
  modalSignButton: {
    backgroundColor: '#2fb035',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  modalSignButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ReviewSign;

