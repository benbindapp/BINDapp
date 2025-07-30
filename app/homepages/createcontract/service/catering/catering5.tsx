import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    Check,
    ChefHat,
    CreditCard,
    ExternalLink,
    Shield,
    Trash2,
    Users,
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

interface CateringReviewSignProps {
  onGoBack?: () => void;
  onEdit?: (section: string) => void;
  onSendContract?: () => void;
}

const CateringReviewSign: React.FC<CateringReviewSignProps> = ({
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
    
    Alert.alert('Success', 'Contract sent successfully to Johnson Wedding Event!');
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
          <View style={styles.signatureCanvas}>
            <Text style={styles.canvasPlaceholder}>Touch here to sign</Text>
          </View>
        </View>
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
            Review all details and sign to create your catering service contract.
          </Text>
        </View>

        {/* Event Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Calendar size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Event Details</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('event')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Event Type:" value="Wedding Reception" />
            <InfoRow label="Event Date:" value="August 15, 2025" />
            <InfoRow label="Event Time:" value="6:00 PM - 11:00 PM" />
            <InfoRow label="Venue:" value="The Grand Ballroom" />
            <InfoRow label="Venue Address:" value="123 Celebration Ave, Charleston, SC" />
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <ChefHat size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Service Details</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('service')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <InfoRow label="Number of Guests:" value="150 guests" />
            <InfoRow label="Service Type:" value="Plated Service" />
            <InfoRow label="Cuisine Style:" value="Southern Comfort" />
            <InfoRow label="Dietary Restrictions:" value="2 vegetarian, 1 gluten-free" />
            <InfoRow label="Special Requests:" value="Custom wedding cake table setup" />
          </View>
        </View>

        {/* Catering Service Provider */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Users size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Catering Service Provider</Text>
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
                  <Text style={styles.avatarText}>EC</Text>
                </View>
                <View style={styles.partyDetails}>
                  <Text style={styles.partyName}>Elite Catering Services</Text>
                  <Text style={styles.partyProfile}>Contact: Sarah Thompson</Text>
                </View>
              </View>
            </View>
            <InfoRow label="Service Cost:" value="$4,500.00" />
            <InfoRow label="Materials Cost:" value="$750.00" />
            <InfoRow label="Total Estimate:" value="$5,250.00" />
          </View>
        </View>

        {/* Contract Protections */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Shield size={20} color="#6b7280" />
              <Text style={styles.cardTitle}>Contract Protections</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('protections')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <ProtectionRow text="Force Majeure - Protection from uncontrollable events" />
            <ProtectionRow text="Cancellation & Refund Policy - Clear cancellation terms" />
            <ProtectionRow text="Guest Count Adjustment - Final headcount confirmation required" />
            <ProtectionRow text="Menu Substitution - Flexibility for supply chain issues" />
            <ProtectionRow text="Venue Access - Adequate setup time required" />
            <ProtectionRow text="Health & Safety Compliance - Food safety standards" />
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
            <InfoRow label="Payment Type:" value="Catering Deposit" />
            <InfoRow label="Deposit Amount:" value="$1,575.00 (30%)" />
            <InfoRow label="Remaining Due:" value="$3,675.00 (Upon Service)" />
            <InfoRow label="Payment Methods:" value="Credit/Debit Card, ACH/Bank Transfer" />
            <InfoRow label="Payment Destination:" value="ELITE CATERING SERVICES LLC (••••7842)" />
            <InfoRow label="Payment Reminders:" value="Enabled" />
          </View>
        </View>

        {/* Generated Contract */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Catering Service Contract</Text>
          </View>
          <View style={styles.contractDocument}>
            <Text style={styles.contractText}>
              This Catering Service Agreement ("Agreement") is entered into on this 22nd day of
              July, 2025, by and between:
            </Text>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Service Provider:</Text>
              <Text style={styles.contractText}>ELITE CATERING SERVICES LLC</Text>
              <Text style={styles.contractText}>
                Contact: Elite Catering Services - Sarah Thompson
              </Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Client:</Text>
              <Text style={styles.contractText}>Johnson Wedding Event</Text>
              <Text style={styles.contractText}>Event Host</Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractSubheading}>1. Event and Service Details</Text>
              <Text style={styles.contractText}>
                The Service Provider agrees to provide catering services for the following event:
              </Text>
              <Text style={styles.contractBullet}>• Event: Wedding Reception</Text>
              <Text style={styles.contractBullet}>• Service Date: August 15, 2025</Text>
              <Text style={styles.contractBullet}>• Location: The Grand Ballroom</Text>
              <Text style={styles.contractBullet}>• Service Type: Plated Service</Text>
              <Text style={styles.contractBullet}>• Guest Count: 150 guests</Text>
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
              I agree to the terms and conditions of this catering service contract and
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
        <TouchableOpacity style={styles.sendButton} onPress={handleSendContract}>
          <Text style={styles.sendButtonText}>Send to Johnson Wedding Event</Text>
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
            <Text style={styles.contractModalTitle}>Catering Service Contract</Text>
            <TouchableOpacity onPress={closeContract} style={styles.closeModalButton}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.contractModalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fullContractText}>
              This Catering Service Agreement ("Agreement") is entered into on this 22nd day of
              July, 2025, by and between Johnson Wedding Event and ELITE CATERING SERVICES LLC.
            </Text>

            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>1. Event and Service Details</Text>
              <Text style={styles.fullContractText}>
                The Service Provider agrees to provide professional catering services for the following event:
              </Text>
              <Text style={styles.fullContractBullet}>• Event Type: Wedding Reception</Text>
              <Text style={styles.fullContractBullet}>• Event Date: August 15, 2025</Text>
              <Text style={styles.fullContractBullet}>• Service Time: 6:00 PM - 11:00 PM</Text>
              <Text style={styles.fullContractBullet}>• Venue: The Grand Ballroom</Text>
              <Text style={styles.fullContractBullet}>• Address: 123 Celebration Ave, Charleston, SC</Text>
              <Text style={styles.fullContractBullet}>• Service Type: Plated Service</Text>
              <Text style={styles.fullContractBullet}>• Guest Count: 150 guests</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>2. Scope of Catering Services</Text>
              <Text style={styles.fullContractText}>
                The catering services shall include but are not limited to:
              </Text>
              <Text style={styles.fullContractBullet}>• Menu planning and preparation in Southern Comfort style</Text>
              <Text style={styles.fullContractBullet}>• Professional plated service for 150 guests</Text>
              <Text style={styles.fullContractBullet}>• Accommodation of dietary restrictions (2 vegetarian, 1 gluten-free)</Text>
              <Text style={styles.fullContractBullet}>• Custom wedding cake table setup as requested</Text>
              <Text style={styles.fullContractBullet}>• Professional service staff for duration of event</Text>
              <Text style={styles.fullContractBullet}>• Setup and breakdown of catering equipment</Text>
              <Text style={styles.fullContractBullet}>• All necessary serving equipment, linens, and tableware</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>3. Financial Terms</Text>
              <Text style={styles.fullContractText}>
                The total cost for catering services is $5,250.00 (Five Thousand Two Hundred Fifty US Dollars), itemized as follows:
              </Text>
              <Text style={styles.fullContractBullet}>• Catering Service Cost: $4,500.00</Text>
              <Text style={styles.fullContractBullet}>• Materials and Equipment: $750.00</Text>
              <Text style={styles.fullContractText}>Payment Type: Catering Deposit</Text>
              <Text style={styles.fullContractText}>Deposit Amount: $1,575.00 (30% due upon signing)</Text>
              <Text style={styles.fullContractText}>Remaining Balance: $3,675.00 (due upon service completion)</Text>
              <Text style={styles.fullContractText}>Accepted Payment Methods: Credit/Debit Card, ACH/Bank Transfer</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>4. Contract Protections and Policies</Text>
              <Text style={styles.fullContractText}>The following protections and policies apply to this agreement:</Text>
              <Text style={styles.fullContractBullet}>• Force Majeure: Neither party liable for uncontrollable events (natural disasters, government restrictions)</Text>
              <Text style={styles.fullContractBullet}>• Cancellation & Refund Policy: Specific terms apply based on notice period</Text>
              <Text style={styles.fullContractBullet}>• Guest Count Adjustment: Final headcount confirmation required in advance</Text>
              <Text style={styles.fullContractBullet}>• Menu Substitution: Caterer may substitute items due to supply issues with client approval</Text>
              <Text style={styles.fullContractBullet}>• Venue Access: Client must ensure adequate setup time and venue access</Text>
              <Text style={styles.fullContractBullet}>• Health & Safety Compliance: All food safety and health regulations will be followed</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>5. Insurance and Liability</Text>
              <Text style={styles.fullContractText}>
                Service Provider maintains comprehensive general liability insurance with minimum coverage of $1,000,000.
                Service Provider agrees to exercise reasonable care in performing services but shall not be liable for
                circumstances beyond reasonable control or pre-existing venue conditions.
              </Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>6. Terms and Conditions</Text>
              <Text style={styles.fullContractText}>
                This agreement shall be governed by the laws of South Carolina. Any disputes arising from this agreement
                shall be resolved through binding arbitration. This agreement constitutes the entire understanding between
                the parties and may only be modified in writing signed by both parties.
              </Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>7. Signatures</Text>
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
  sendButtonText: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: '600',
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

export default CateringReviewSign;

