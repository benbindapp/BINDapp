import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    Car,
    Check,
    CreditCard,
    ExternalLink,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ReviewSignProps {
  onGoBack?: () => void;
  onEdit?: (section: string) => void;
  onSendContract?: () => void;
}

interface InfoRowProps {
  label: string;
  value: string;
}

interface ProtectionRowProps {
  text: string;
}

const CleaningReviewSign: React.FC<ReviewSignProps> = ({
  onGoBack,
  onEdit,
  onSendContract,
}) => {
  const router = useRouter()
  const [isAgreed, setIsAgreed] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
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
    
    Alert.alert('Success', 'Contract sent successfully to Elite Auto Detailing!');
    onSendContract?.();
  };

  const addSignature = () => {
    setHasSignature(true);
    Alert.alert('Signature Added', 'Your signature has been captured');
  };

  const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const ProtectionRow: React.FC<ProtectionRowProps> = ({ text }) => (
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
        <TouchableOpacity style={styles.canvasContainer} onPress={addSignature}>
          <View style={styles.signatureCanvas}>
            <Text style={styles.canvasPlaceholder}>
              {hasSignature ? 'Signature Captured ✓' : 'Touch here to sign'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.signatureDisclaimer}>
        Please sign above using your finger or stylus
      </Text>
      <TouchableOpacity style={styles.modalSignButton} onPress={handleSignature}>
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
            Review all details and sign to create your cleaning service contract.
          </Text>
        </View>

        {/* Vehicle Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Car size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Vehicle Details</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('vehicle')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Vehicle:" value="2024 Toyota Camry" />
            <InfoRow label="Owner/Company:" value="Elite Auto Detailing" />
            <InfoRow label="Cleaning Type:" value="Full Detail Service" />
            <InfoRow label="Preferred Date:" value="July 28, 2025" />
            <InfoRow label="Location:" value="123 Main Street, Charleston, SC" />
          </View>
        </View>

        {/* Cleaning Service Provider */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Calendar size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Cleaning Service Provider</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('provider')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.partySection}>
              <Text style={styles.partyLabel}>Service Provider</Text>
              <View style={styles.partyInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>PC</Text>
                </View>
                <View style={styles.partyDetails}>
                  <Text style={styles.partyName}>Premier Car Cleaning</Text>
                  <Text style={styles.partyProfile}>Contact: Mike Johnson</Text>
                </View>
              </View>
            </View>
            <InfoRow label="Interior Rate:" value="$150.00" />
            <InfoRow label="Exterior Rate:" value="$100.00" />
            <InfoRow label="Supplies Cost:" value="$25.00" />
            <InfoRow label="Total Estimate:" value="$275.00" />
          </View>
        </View>

        {/* Service Expectations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Shield size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Service Expectations</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('expectations')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <ProtectionRow text="Photo Requirement - Before/after photos uploaded for job confirmation" />
            <ProtectionRow text="Access Contingency - 15-minute access window or rebooking fee applies" />
            <ProtectionRow text="Pet & Safety Contingency - Pets secured, unsafe conditions may pause job" />
            <ProtectionRow text="Weather Delay - Outdoor services may be rescheduled for weather" />
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
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Payment Type:" value="Invoice in Full" />
            <InfoRow label="Invoice Terms:" value="Upon Completion" />
            <InfoRow label="Payment Methods:" value="Credit/Debit Card, ACH/Bank Transfer" />
            <InfoRow label="Payment Destination:" value="CLEANING SERVICES LLC (••••7842)" />
            <InfoRow label="Payment Reminders:" value="Enabled" />
          </View>
        </View>

        {/* Generated Contract */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Vehicle Cleaning Service Contract</Text>
          </View>
          <View style={styles.contractDocument}>
            <Text style={styles.contractText}>
              This Vehicle Cleaning Service Agreement ("Agreement") is entered into on this 23rd day of
              July, 2025, by and between:
            </Text>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Service Provider:</Text>
              <Text style={styles.contractText}>CLEANING SERVICES LLC</Text>
              <Text style={styles.contractText}>
                Contact: Premier Car Cleaning - Mike Johnson
              </Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Client:</Text>
              <Text style={styles.contractText}>Elite Auto Detailing</Text>
              <Text style={styles.contractText}>Vehicle Owner</Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractSubheading}>1. Vehicle and Service Details</Text>
              <Text style={styles.contractText}>
                The Service Provider agrees to provide cleaning services for the following vehicle:
              </Text>
              <Text style={styles.contractBullet}>• Vehicle: 2024 Toyota Camry</Text>
              <Text style={styles.contractBullet}>• Service Date: July 28, 2025</Text>
              <Text style={styles.contractBullet}>• Location: 123 Main Street, Charleston, SC</Text>
              <Text style={styles.contractBullet}>• Service Type: Full Detail Service</Text>
            </View>

            {/* View Full Contract & E-Sign Button */}
            <TouchableOpacity style={styles.viewSignButton} onPress={expandContract}>
              <ExternalLink size={16} color="white" />
              <Text style={styles.viewSignButtonText}>View Full Contract & E-Sign</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Agreement Checkbox */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.agreementButton} onPress={toggleAgreement}>
            <View style={[styles.checkbox, isAgreed && styles.checkboxActive]}>
              {isAgreed && <Check size={16} color="white" />}
            </View>
            <Text style={styles.agreementText}>
              I agree to the terms and conditions of this vehicle cleaning service contract and
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
          style={[styles.sendButton, isAgreed && styles.sendButtonActive]} 
          onPress={handleSendContract}
        >
          <Text style={[styles.sendButtonText, isAgreed && styles.sendButtonTextActive]}>
            Send to Elite Auto Detailing
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
            <Text style={styles.contractModalTitle}>Vehicle Cleaning Service Contract</Text>
            <TouchableOpacity onPress={closeContract} style={styles.closeModalButton}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.contractModalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fullContractText}>
              This Vehicle Cleaning Service Agreement ("Agreement") is entered into on this 23rd day of
              July, 2025, by and between Elite Auto Detailing and CLEANING SERVICES LLC.
            </Text>

            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>1. Vehicle and Service Details</Text>
              <Text style={styles.fullContractText}>
                The Service Provider agrees to provide professional vehicle cleaning services for the following vehicle:
              </Text>
              <Text style={styles.fullContractBullet}>• Vehicle Make/Model: 2024 Toyota Camry</Text>
              <Text style={styles.fullContractBullet}>• Service Date: July 28, 2025</Text>
              <Text style={styles.fullContractBullet}>• Service Time: 9:00 AM - 2:00 PM (estimated)</Text>
              <Text style={styles.fullContractBullet}>• Location: 123 Main Street, Charleston, SC 29401</Text>
              <Text style={styles.fullContractBullet}>• Service Type: Full Detail Service (Interior + Exterior)</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>2. Scope of Work</Text>
              <Text style={styles.fullContractText}>
                The cleaning services shall include but are not limited to:
              </Text>
              <Text style={styles.fullContractBullet}>• Complete interior cleaning including seats, dashboard, and carpets</Text>
              <Text style={styles.fullContractBullet}>• Thorough exterior cleaning including wash, wax, and tire shine</Text>
              <Text style={styles.fullContractBullet}>• Window cleaning (interior and exterior)</Text>
              <Text style={styles.fullContractBullet}>• Carpet shampooing and leather conditioning as needed</Text>
              <Text style={styles.fullContractBullet}>• Application of protective wax and polish to exterior surfaces</Text>
              <Text style={styles.fullContractBullet}>• Cleaning of all accessible surfaces and compartments</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>3. Financial Terms</Text>
              <Text style={styles.fullContractText}>
                The total cost for cleaning services is $275.00 (Two Hundred Seventy-Five US Dollars), itemized as follows:
              </Text>
              <Text style={styles.fullContractBullet}>• Interior Cleaning Services: $150.00</Text>
              <Text style={styles.fullContractBullet}>• Exterior Cleaning Services: $100.00</Text>
              <Text style={styles.fullContractBullet}>• Cleaning Supplies and Materials: $25.00</Text>
              <Text style={styles.fullContractText}>Payment Type: Invoice in Full</Text>
              <Text style={styles.fullContractText}>Payment Terms: Upon Completion of Services</Text>
              <Text style={styles.fullContractText}>Accepted Payment Methods: Credit/Debit Card, ACH/Bank Transfer</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>4. Service Expectations and Policies</Text>
              <Text style={styles.fullContractText}>The following expectations and policies apply to this agreement:</Text>
              <Text style={styles.fullContractBullet}>• Photo Requirement: Before and after photos will be taken for job confirmation</Text>
              <Text style={styles.fullContractBullet}>• Access Contingency: 15-minute access window required or rebooking fee may apply</Text>
              <Text style={styles.fullContractBullet}>• Pet & Safety: Pets must be secured and unsafe conditions may pause the job</Text>
              <Text style={styles.fullContractBullet}>• Weather Delay: Outdoor services may be rescheduled due to weather conditions</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>5. Terms and Conditions</Text>
              <Text style={styles.fullContractText}>
                This agreement shall be governed by the laws of South Carolina. Both parties agree to discuss
                and resolve any issues fairly. This agreement constitutes the entire understanding between
                the parties and may only be modified in writing signed by both parties.
              </Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>6. Electronic Signature</Text>
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
    paddingVertical: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 4,
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
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 32,
  },
  sendButtonActive: {
    backgroundColor: '#2fb035',
    borderColor: '#2fb035',
  },
  sendButtonText: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: '600',
  },
  sendButtonTextActive: {
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

export default CleaningReviewSign;

