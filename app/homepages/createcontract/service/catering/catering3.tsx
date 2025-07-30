import { useRouter } from 'expo-router';
import { AlertTriangle, ArrowLeft, MapPin, RefreshCw, Shield, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
interface CateringContingencyTermsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  forceMajeure: boolean;
  cancellationPolicy: boolean;
  guestCountClause: boolean;
  menuSubstitution: boolean;
  venueAccess: boolean;
  healthSafety: boolean;
}

const CateringContingencyTerms: React.FC<CateringContingencyTermsProps> = ({
  onBack,
  onNext,
}) => {

  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    forceMajeure: true,
    cancellationPolicy: true,
    guestCountClause: true,
    menuSubstitution: true,
    venueAccess: true,
    healthSafety: true,
  });

  const handleToggle = (field: keyof FormData) => {
    if (typeof formData[field] === 'boolean') {
      setFormData(prev => ({
        ...prev,
        [field]: !prev[field]
      }));
    }
  };

  const handleNext = () => {
    console.log('Contingency terms data:', formData);
    onNext?.(formData);
  };

  const ToggleSwitch: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ 
    isActive, 
    onToggle 
  }) => (
    <TouchableOpacity 
      style={[styles.toggleSwitch, isActive && styles.toggleSwitchActive]} 
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleSlider, isActive && styles.toggleSliderActive]} />
    </TouchableOpacity>
  );

  const contractTerms = [
    {
      id: 'forceMajeure',
      title: 'Force Majeure (Uncontrollable Events)',
      description: 'Neither party shall be held liable for failure to perform due to unforeseen circumstances beyond their control, including but not limited to natural disasters, government restrictions, labor strikes, power outages, or acts of God.',
      benefits: ['Protects caterers from weather, emergencies, or shutdowns', 'Lets client reschedule if event becomes impossible'],
      icon: AlertTriangle,
      active: formData.forceMajeure,
    },
    {
      id: 'cancellationPolicy',
      title: 'Cancellation & Refund Policy',
      description: 'Client may cancel this agreement up to a specified number of days prior to the event for a full refund, minus any non-refundable expenses. Cancellations within the specified timeframe will result in forfeiture of the deposit. Last-minute cancellations may require full payment.',
      benefits: ['Protects caterers from last-minute cancellations', 'Sets clear refund tiers'],
      icon: RefreshCw,
      active: formData.cancellationPolicy,
    },
    {
      id: 'guestCountClause',
      title: 'Guest Count Adjustment Clause',
      description: 'Final guest count must be confirmed a specified number of days prior to the event. Increases are subject to availability. Decreases after this point will not reduce the total cost.',
      benefits: ['Ensures caterers aren\'t left holding costs if headcount drops', 'Encourages timely planning'],
      icon: Users,
      active: formData.guestCountClause,
    },
    {
      id: 'menuSubstitution',
      title: 'Substitution of Menu Items',
      description: 'If a listed menu item becomes unavailable due to supply chain issues, the caterer may substitute a similar item of equal or greater value with client approval.',
      benefits: ['Allows flexibility with supply issues', 'Keeps the event moving without legal risk'],
      icon: RefreshCw,
      active: formData.menuSubstitution,
    },
    {
      id: 'venueAccess',
      title: 'Venue Access Clause',
      description: 'Client shall ensure the caterer has access to the venue for a reasonable amount of time before the event for setup and preparation. If access is delayed, the caterer is not liable for late service.',
      benefits: ['Protects timing expectations', 'Especially useful for weddings, corporate events, or tight turnarounds'],
      icon: MapPin,
      active: formData.venueAccess,
    },
    {
      id: 'healthSafety',
      title: 'Health & Safety Compliance Clause',
      description: 'Caterer will comply with all local food safety, health code, and licensing regulations. Client shall ensure the venue meets minimum cleanliness and kitchen standards required for safe food service.',
      benefits: ['Ensures professional compliance', 'Gives caterer right to refuse unsafe environments'],
      icon: Shield,
      active: formData.healthSafety,
    },
  ];

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
          <Text style={styles.title}>Contract Terms & Contingencies</Text>
          <Text style={styles.subtitle}>Select the terms that will protect your catering business</Text>
        </View>

        {/* Contract Terms */}
        <View style={styles.termsContainer}>
          {contractTerms.map((term) => {
            const IconComponent = term.icon;
            return (
              <View key={term.id} style={styles.termCard}>
                <View style={styles.termHeader}>
                  <View style={styles.termTitleRow}>
                    <View style={styles.iconContainer}>
                      <IconComponent size={24} color="#16a34a" />
                    </View>
                    <View style={styles.termTitleContainer}>
                      <Text style={styles.termTitle}>{term.title}</Text>
                    </View>
                  </View>
                  <ToggleSwitch
                    isActive={term.active}
                    onToggle={() => handleToggle(term.id as keyof FormData)}
                  />
                </View>

                {term.active && (
                  <View style={styles.termContent}>
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionText}>
                        "{term.description}"
                      </Text>
                    </View>

                    <View style={styles.benefitsContainer}>
                      <Text style={styles.benefitsHeader}>Benefits:</Text>
                      {term.benefits.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                          <View style={styles.benefitBullet} />
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Contract Summary</Text>
          <Text style={styles.summaryText}>
            You have selected {Object.values(formData).filter(v => v === true).length} protective terms for your catering contract. These terms will be reviewed by legal counsel before being finalized.
          </Text>
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
        <View style={styles.completeButtonContainer}>
          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={() => router.push('/homepages/createcontract/service/catering/catering4')}
            activeOpacity={0.8}
          >
            <Text style={styles.completeButtonText}>Complete Contract Setup</Text>
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
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  termsContainer: {
    gap: 24,
    marginBottom: 24,
  },
  termCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 24,
  },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  termTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  termTitleContainer: {
    flex: 1,
  },
  termTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#2fb035',
  },
  toggleSlider: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  toggleSliderActive: {
    transform: [{ translateX: 20 }],
  },
  termContent: {
    gap: 16,
  },
  descriptionContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  benefitsContainer: {
    gap: 8,
  },
  benefitsHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitBullet: {
    width: 8,
    height: 8,
    backgroundColor: '#2fb035',
    borderRadius: 4,
    marginTop: 6,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14532d',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 21,
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
    width: '60%',
    backgroundColor: '#2fb035',
    borderRadius: 4,
  },
  completeButtonContainer: {
    marginBottom: 20,
  },
  completeButton: {
    width: '100%',
    backgroundColor: '#2fb035',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
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
});

export default CateringContingencyTerms;

