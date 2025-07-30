import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Check,
    CreditCard,
    Plane,
    Shield,
    User,
    X,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface AviationReviewProps {
  onBack?: () => void;
  onComplete?: () => void;
}

const AviationReview: React.FC<AviationReviewProps> = ({ onBack, onComplete }) => {
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [signaturePaths, setSignaturePaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const pathRef = useRef<string>('');

  const contractData = {
    aircraft: {
      type: 'Cessna Citation CJ3+',
      tailNumber: 'N123AB',
      passengerStatus: 'Owner',
      company: 'Thompson Enterprises',
      tripDates: 'July 25 - July 27, 2025',
      departureAirport: 'CHS (Charleston, SC)',
    },
    pilot: {
      name: 'Captain Sarah Mitchell',
      license: 'ATP #12345678',
      dailyRate: '$1,500/day',
      perDiem: '$75/day',
      expenseCoverage: 'Hotel, Airline Tickets, Crew Meals',
      estimatedTotal: '$4,250',
    },
    protections: [
      'Cancellation Fee Policy - 24 hours notice - $500',
      'PIC Final Authority - Safety decisions',
      'Payment Terms - Net 15 days',
      'Force Majeure - Weather/ATC/mechanical',
    ],
    payment: {
      type: 'Invoice in Full',
      terms: 'Net 15 Days',
      methods: 'Credit/Debit Card, ACH/Bank Transfer',
      destination: 'AVIATION SERVICES LLC (••••7842)',
      reminders: 'Enabled',
    },
  };

  const handlePanGesture = (event: any) => {
    const { translationX, translationY, state, x, y } = event.nativeEvent;

    switch (state) {
      case State.BEGAN:
        const startX = x;
        const startY = y;
        pathRef.current = `M${startX},${startY}`;
        setCurrentPath(pathRef.current);
        break;

      case State.ACTIVE:
        const currentX = x;
        const currentY = y;
        pathRef.current += ` L${currentX},${currentY}`;
        setCurrentPath(pathRef.current);
        break;

      case State.END:
      case State.CANCELLED:
        if (pathRef.current) {
          setSignaturePaths(prev => [...prev, pathRef.current]);
          setCurrentPath('');
          pathRef.current = '';
        }
        break;
    }
  };

  const clearSignature = () => {
    setSignaturePaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

  const hasSignature = () => {
    return signaturePaths.length > 0 || currentPath.length > 0;
  };

  const handleSendContract = () => {
    if (!isAgreed) {
      Alert.alert('Missing Agreement', 'Please agree to the terms and conditions');
      return;
    }

    if (!hasSignature()) {
      Alert.alert('Missing Signature', 'Please provide your signature');
      return;
    }

    Alert.alert('Success', 'Contract sent successfully to Thompson Enterprises!');
    onComplete?.();
  };

  const handleEdit = (section: string) => {
    console.log('Edit section:', section);
  };

  const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const Card: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    onEdit?: () => void; 
    children: React.ReactNode;
  }> = ({ title, icon, onEdit, children }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          {icon}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  const router = useRouter()
  const PartySection: React.FC<{ 
    label: string; 
    name: string; 
    subtitle: string; 
    initials: string; 
    color: string;
  }> = ({ label, name, subtitle, initials, color }) => (
    <View style={styles.partySection}>
      <Text style={styles.partyLabel}>{label}</Text>
      <View style={styles.partyInfo}>
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.partyDetails}>
          <Text style={styles.partyName}>{name}</Text>
          <Text style={styles.partyProfile}>{subtitle}</Text>
        </View>
      </View>
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

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Review & Sign</Text>
          <Text style={styles.subtitle}>
            Review all details and sign to create your aviation service contract.
          </Text>
        </View>

        {/* Aircraft Details */}
        <Card
          title="Aircraft Details"
          icon={<Plane size={20} color="#6b7280" />}
          onEdit={() => handleEdit('aircraft')}
        >
          <InfoRow label="Aircraft Type" value={contractData.aircraft.type} />
          <InfoRow label="Tail Number" value={contractData.aircraft.tailNumber} />
          <InfoRow label="Passenger Status" value={contractData.aircraft.passengerStatus} />
          <InfoRow label="Company/Name" value={contractData.aircraft.company} />
          <InfoRow label="Trip Dates" value={contractData.aircraft.tripDates} />
          <InfoRow label="Departure Airport" value={contractData.aircraft.departureAirport} />
        </Card>

        {/* Pilot Information */}
        <Card
          title="Pilot Information"
          icon={<User size={20} color="#6b7280" />}
          onEdit={() => handleEdit('pilot')}
        >
          <PartySection
            label="Captain/PIC"
            name={contractData.pilot.name}
            subtitle={contractData.pilot.license}
            initials="SM"
            color="#2fb035"
          />
          <InfoRow label="Daily Rate" value={contractData.pilot.dailyRate} />
          <InfoRow label="Per Diem" value={contractData.pilot.perDiem} />
          <InfoRow label="Expense Coverage" value={contractData.pilot.expenseCoverage} />
          <InfoRow label="Estimated Total" value={contractData.pilot.estimatedTotal} />
        </Card>

        {/* Pilot Protections */}
        <Card
          title="Pilot Protections"
          icon={<Shield size={20} color="#6b7280" />}
          onEdit={() => handleEdit('protections')}
        >
          {contractData.protections.map((protection, index) => (
            <View key={index} style={styles.protectionRow}>
              <Check size={16} color="#2fb035" />
              <Text style={styles.protectionText}>{protection}</Text>
            </View>
          ))}
        </Card>

        {/* Payment Setup */}
        <Card
          title="Payment Setup"
          icon={<CreditCard size={20} color="#6b7280" />}
          onEdit={() => handleEdit('payment')}
        >
          <InfoRow label="Payment Type" value={contractData.payment.type} />
          <InfoRow label="Invoice Terms" value={contractData.payment.terms} />
          <InfoRow label="Payment Methods" value={contractData.payment.methods} />
          <InfoRow label="Payment Destination" value={contractData.payment.destination} />
          <InfoRow label="Payment Reminders" value={contractData.payment.reminders} />
        </Card>

        {/* Generated Contract */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aviation Service Contract</Text>
          <View style={styles.contractDocument}>
            <Text style={styles.contractText}>
              This Aviation Service Agreement ("Agreement") is entered into on this 20th day of 
              July, 2025, by and between:
            </Text>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Service Provider:</Text>
              <Text style={styles.contractText}>AVIATION SERVICES LLC</Text>
              <Text style={styles.contractText}>
                Pilot: Captain Sarah Mitchell (ATP #12345678)
              </Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractBold}>Client:</Text>
              <Text style={styles.contractText}>Thompson Enterprises</Text>
              <Text style={styles.contractText}>Aircraft Owner</Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractSubheading}>1. Aircraft and Trip Details</Text>
              <Text style={styles.contractText}>
                The Service Provider agrees to provide pilot services for the following aircraft and trip:
              </Text>
              <Text style={styles.contractBullet}>• Aircraft: Cessna Citation CJ3+ (N123AB)</Text>
              <Text style={styles.contractBullet}>• Trip Dates: July 25 - July 27, 2025</Text>
              <Text style={styles.contractBullet}>• Departure: CHS (Charleston, SC)</Text>
              <Text style={styles.contractBullet}>• Passenger Status: Owner</Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractSubheading}>2. Financial Terms</Text>
              <Text style={styles.contractText}>
                The estimated total cost for pilot services is $4,250 (Four Thousand Two Hundred Fifty US Dollars).
              </Text>
              <Text style={styles.contractText}>Payment Type: Invoice in Full</Text>
              <Text style={styles.contractText}>Payment Terms: Net 15 Days</Text>
              <Text style={styles.contractText}>
                Accepted Payment Methods: Credit/Debit Card, ACH/Bank Transfer
              </Text>
            </View>
            
            <View style={styles.contractSection}>
              <Text style={styles.contractSubheading}>3. Binding Agreement</Text>
              <Text style={styles.contractText}>
                By signing below, both parties agree to be bound by the terms and conditions 
                set forth in this Agreement.
              </Text>
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
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.signatureLine} />
            </View>
            
            <PanGestureHandler onGestureEvent={handlePanGesture}>
              <View style={styles.canvasContainer}>
                <Svg height="120" width="100%" style={styles.signatureCanvas}>
                  {signaturePaths.map((path, index) => (
                    <Path
                      key={index}
                      d={path}
                      stroke="#2fb035"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="transparent"
                    />
                  ))}
                  {currentPath && (
                    <Path
                      d={currentPath}
                      stroke="#2fb035"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="transparent"
                    />
                  )}
                </Svg>
              </View>
            </PanGestureHandler>
          </View>
          
          <Text style={styles.signatureDisclaimer}>
            By signing this agreement, both parties agree to be bound by these terms
          </Text>
        </View>

        {/* Agreement Checkbox */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => setIsAgreed(!isAgreed)}
            style={styles.agreementButton}
          >
            <View style={[styles.checkbox, isAgreed && styles.checkboxActive]}>
              {isAgreed && <Check size={16} color="white" />}
            </View>
            <Text style={styles.agreementText}>
              I agree to the terms and conditions of this aviation service contract and 
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
          <Text style={styles.sendButtonText}>Send to Thompson Enterprises</Text>
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
    backgroundColor: '#f9fafb',
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
  editButtonText: {
    color: '#2fb035',
    fontSize: 14,
    textDecorationLine: 'underline',
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
    color: '#2fb035',
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
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2fb035',
    width: '100%',
    borderRadius: 4,
  },
  sendButton: {
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
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AviationReview;

