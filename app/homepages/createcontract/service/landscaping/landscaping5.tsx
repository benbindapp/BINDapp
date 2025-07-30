import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    ArrowLeft
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CardHeaderProps {
  icon: string;
  title: string;
  onEdit: () => void;
}

interface InfoRowProps {
  label: string;
  value: string;
}

interface ProtectionRowProps {
  text: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ icon, title, onEdit }) => (
  <View style={styles.cardHeader}>
    <View style={styles.cardHeaderLeft}>
      <Ionicons name={icon as any} size={20} color="#6b7280" />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
      <Text style={styles.editButtonText}>Edit</Text>
    </TouchableOpacity>
  </View>
);

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const ProtectionRow: React.FC<ProtectionRowProps> = ({ text }) => (
  <View style={styles.protectionRow}>
    <Ionicons name="checkmark" size={16} color="#2fb035" />
    <Text style={styles.protectionText}>{text}</Text>
  </View>
);

const LandscapingReviewSign: React.FC = () => {
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);

  const handleEdit = (section: string) => {
    console.log(`Editing ${section} section`);
    Alert.alert('Edit', `Edit ${section} section`);
  };

  const handleGoBack = () => {
    console.log('Going back to previous step');
  };
  const router = useRouter()
  const toggleAgreement = () => {
    setAgreementChecked(!agreementChecked);
  };

  const expandContract = () => {
    setContractModalVisible(true);
  };

  const closeContract = () => {
    setContractModalVisible(false);
  };

  const handleSendContract = () => {
    if (!agreementChecked) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions before sending the contract.');
      return;
    }
    
    console.log('Sending contract to Williams Family');
    Alert.alert('Success', 'Contract sent to Williams Family successfully!');
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
          <Text style={styles.title}>Review & Sign</Text>
          <Text style={styles.subtitle}>Review all details and sign to create your landscaping service contract.</Text>
        </View>

        {/* Service Details */}
        <View style={styles.card}>
          <CardHeader 
            icon="star-outline" 
            title="Service Details" 
            onEdit={() => handleEdit('service')} 
          />
          <View style={styles.cardContent}>
            <InfoRow label="Type of Work:" value="Garden Design & Installation" />
            <InfoRow label="Service Type:" value="Full Landscape Design" />
            <InfoRow label="Location:" value="456 Garden Lane, Charleston, SC" />
            <InfoRow label="Timeline:" value="Sep 1, 2025 - Sep 20, 2025" />
            <InfoRow label="Client:" value="Williams Family" />
          </View>
        </View>

        {/* Responsibilities */}
        <View style={styles.card}>
          <CardHeader 
            icon="checkmark-circle-outline" 
            title="Responsibilities" 
            onEdit={() => handleEdit('responsibilities')} 
          />
          <View style={styles.cardContent}>
            <InfoRow label="Plants Provided By:" value="Landscaper" />
            <InfoRow label="Site Preparation:" value="Landscaper" />
            <InfoRow label="Plant Warranty:" value="6 Months" />
            <InfoRow label="Cleanup:" value="Landscaper" />
            <InfoRow label="Maintenance Guide:" value="Included" />
          </View>
        </View>

        {/* Contingencies */}
        <View style={styles.card}>
          <CardHeader 
            icon="shield-outline" 
            title="Contingencies" 
            onEdit={() => handleEdit('contingencies')} 
          />
          <View style={styles.cardContent}>
            <ProtectionRow text="Weather Delays - Timeline extensions for extreme weather affecting plant health" />
            <ProtectionRow text="Plant Availability - Extensions for plant shortages without contractor penalty" />
            <ProtectionRow text="Seasonal Timing - Work delayed to optimal planting seasons for plant health" />
            <ProtectionRow text="Poor Soil Conditions - Written approval required for additional soil amendments" />
          </View>
        </View>

        {/* Landscaping Service Provider */}
        <View style={styles.card}>
          <CardHeader 
            icon="star-outline" 
            title="Landscaping Service Provider" 
            onEdit={() => handleEdit('provider')} 
          />
          <View style={styles.cardContent}>
            <View style={styles.partySection}>
              <Text style={styles.partyLabel}>Service Provider</Text>
              <View style={styles.partyInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>GL</Text>
                </View>
                <View style={styles.partyDetails}>
                  <Text style={styles.partyName}>GreenThumb Landscaping</Text>
                  <Text style={styles.partyProfile}>Contact: Sarah Martinez</Text>
                </View>
              </View>
            </View>
            <InfoRow label="Total Project Cost:" value="$8,500.00" />
            <InfoRow label="Plant Deposit:" value="$2,500.00" />
            <InfoRow label="Remaining Balance:" value="$6,000.00" />
          </View>
        </View>

        {/* Payment Setup */}
        <View style={styles.card}>
          <CardHeader 
            icon="card-outline" 
            title="Payment Setup" 
            onEdit={() => handleEdit('payment')} 
          />
          <View style={styles.cardContent}>
            <InfoRow label="Payment Type:" value="Plant Deposit" />
            <InfoRow label="Deposit Due:" value="Upon Agreement" />
            <InfoRow label="Remaining Due:" value="Upon Project Completion" />
            <InfoRow label="Payment Methods:" value="Credit/Debit Card, ACH" />
            <InfoRow label="Payment Destination:" value="GREENTHUMB LANDSCAPING LLC (••••5639)" />
          </View>
        </View>

        {/* Generated Contract */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Landscaping Service Contract</Text>
          </View>
          <View style={styles.contractDocument}>
            <Text style={styles.contractText}>
              This Landscaping Service Agreement ("Agreement") is entered into on this 22nd day of
              July, 2025, by and between:
            </Text>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Service Provider:</Text>
              <Text style={styles.contractText}>GREENTHUMB LANDSCAPING LLC</Text>
              <Text style={styles.contractText}>
                Contact: GreenThumb Landscaping - Sarah Martinez
              </Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Client:</Text>
              <Text style={styles.contractText}>Williams Family</Text>
              <Text style={styles.contractText}>Property Owner</Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractSubheading}>1. Project and Service Details</Text>
              <Text style={styles.contractText}>
                The Service Provider agrees to provide landscaping services for the following project:
              </Text>
              <Text style={styles.contractBullet}>• Project: Garden Design & Installation</Text>
              <Text style={styles.contractBullet}>• Service Type: Full Landscape Design</Text>
              <Text style={styles.contractBullet}>• Project Timeline: September 1, 2025 - September 20, 2025</Text>
              <Text style={styles.contractBullet}>• Location: 456 Garden Lane, Charleston, SC</Text>
            </View>

            {/* View Full Contract & E-Sign Button */}
            <TouchableOpacity style={styles.viewSignButton} onPress={expandContract}>
              <Ionicons name="open-outline" size={16} color="white" />
              <Text style={styles.viewSignButtonText}>View Full Contract & E-Sign</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Agreement Checkbox */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.agreementButton} onPress={toggleAgreement}>
            <View style={[styles.checkbox, agreementChecked && styles.checkboxActive]}>
              {agreementChecked && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.agreementText}>
              I agree to the terms and conditions of this landscaping service contract and
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
          style={[styles.sendButton, agreementChecked && styles.sendButtonEnabled]} 
          onPress={handleSendContract}
        >
          <Text style={[styles.sendButtonText, agreementChecked && styles.sendButtonTextEnabled]}>
            Send to Williams Family
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Contract Modal */}
      <Modal
        visible={contractModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.contractModalHeader}>
            <Text style={styles.contractModalTitle}>Landscaping Service Contract</Text>
            <TouchableOpacity style={styles.closeModalButton} onPress={closeContract}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.contractModalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fullContractText}>
              This Landscaping Service Agreement ("Agreement") is entered into on this 22nd day of
              July, 2025, by and between Williams Family and GREENTHUMB LANDSCAPING LLC.
            </Text>

            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>1. Project and Service Details</Text>
              <Text style={styles.fullContractText}>
                The Service Provider agrees to provide professional landscaping services for the following project:
              </Text>
              <Text style={styles.fullContractBullet}>• Project Type: Garden Design & Installation</Text>
              <Text style={styles.fullContractBullet}>• Service Type: Full Landscape Design</Text>
              <Text style={styles.fullContractBullet}>• Project Timeline: September 1, 2025 - September 20, 2025</Text>
              <Text style={styles.fullContractBullet}>• Work Location: 456 Garden Lane, Charleston, SC 29412</Text>
              <Text style={styles.fullContractBullet}>• Service Provider: GreenThumb Landscaping</Text>
              <Text style={styles.fullContractBullet}>• Primary Contact: Sarah Martinez</Text>
            </View>
            
            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>2. Scope of Work</Text>
              <Text style={styles.fullContractText}>
                The landscaping services shall include but are not limited to:
              </Text>
              <Text style={styles.fullContractBullet}>• Complete garden design consultation and planning</Text>
              <Text style={styles.fullContractBullet}>• Site preparation including soil testing and amendments</Text>
              <Text style={styles.fullContractBullet}>• Selection and installation of native and climate-appropriate plants</Text>
              <Text style={styles.fullContractBullet}>• Installation of irrigation system and drainage solutions</Text>
              <Text style={styles.fullContractBullet}>• Mulching, edging, and final landscaping touches</Text>
            </View>

            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>3. Timeline and Weather Contingencies</Text>
              <Text style={styles.fullContractText}>
                The project shall be completed according to the agreed timeline, with provisions for weather delays and seasonal planting requirements. Extensions may be granted for extreme weather conditions that affect plant health or work safety.
              </Text>
            </View>

            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>4. Payment Terms</Text>
              <Text style={styles.fullContractText}>
                Total project cost is $8,500.00, with a plant deposit of $2,500.00 due upon agreement execution, and the remaining balance of $6,000.00 due upon project completion and client satisfaction.
              </Text>
            </View>

            <View style={styles.fullContractSection}>
              <Text style={styles.fullContractSubheading}>5. Plant Warranty and Maintenance</Text>
              <Text style={styles.fullContractText}>
                All plants are guaranteed for a period of six (6) months from installation date, subject to proper care and maintenance as outlined in the provided maintenance guide. The Service Provider will provide comprehensive care instructions for all installed plants.
              </Text>
            </View>

            {/* Signature Card */}
            <View style={styles.signatureCard}>
              <View style={styles.signatureHeader}>
                <Text style={styles.signatureTitle}>Digital Signature</Text>
              </View>
              
              <View style={styles.signatureArea}>
                <View style={styles.signatureToolbar}>
                  <TouchableOpacity style={styles.clearButton}>
                    <Ionicons name="refresh" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <View style={styles.signatureLine} />
                </View>
                
                <View style={styles.canvasContainer}>
                  <View style={styles.signatureCanvas}>
                    <Text style={styles.canvasPlaceholder}>Sign here with your finger</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.signatureDisclaimer}>
                By signing above, you agree to the terms and conditions of this landscaping contract.
              </Text>
            </View>

            <TouchableOpacity style={styles.modalSignButton} onPress={closeContract}>
              <Text style={styles.modalSignButtonText}>Complete Signature</Text>
            </TouchableOpacity>
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
    padding: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
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
    height: '100%',
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

export default LandscapingReviewSign;

