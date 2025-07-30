import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ArrowLeft
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormData {
  settlementDate: string;
  scheduleDate: string;
  exchangeTiming: 'settlement' | 'later';
  exchangeMethod: 'meetup' | 'shipping' | '';
  shippingPayer: 'buyer' | 'seller' | '';
}

interface ExchangeDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

const ExchangeDetails: React.FC<ExchangeDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const [formData, setFormData] = useState<FormData>({
    settlementDate: '',
    scheduleDate: '',
    exchangeTiming: 'settlement',
    exchangeMethod: '',
    shippingPayer: ''
  });

  const router = useRouter()
  const [showCalendar, setShowCalendar] = useState(false);
  const [showScheduleCalendar, setShowScheduleCalendar] = useState(false);

  const handleTimingSelect = (timing: 'settlement' | 'later') => {
    setFormData(prev => ({
      ...prev,
      exchangeTiming: timing
    }));
    
    if (timing !== 'later') {
      setFormData(prev => ({
        ...prev,
        scheduleDate: ''
      }));
      setShowScheduleCalendar(false);
    }
  };

  const handleMethodSelect = (method: 'meetup' | 'shipping') => {
    setFormData(prev => ({
      ...prev,
      exchangeMethod: method
    }));
    
    if (method !== 'shipping') {
      setFormData(prev => ({
        ...prev,
        shippingPayer: ''
      }));
    }
  };

  const handleShippingPayerSelect = (payer: 'buyer' | 'seller') => {
    setFormData(prev => ({
      ...prev,
      shippingPayer: payer
    }));
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    setFormData(prev => ({
      ...prev,
      settlementDate: formattedDate
    }));
    setShowCalendar(false);
  };

  const handleScheduleDateSelect = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    });
    setFormData(prev => ({
      ...prev,
      scheduleDate: formattedDate
    }));
    setShowScheduleCalendar(false);
  };

  const handleNext = () => {
    console.log('Form data:', formData);
    onNext?.(formData);
  };

  const renderCalendar = (onDateSelect: (date: Date) => void, onCancel: () => void) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      
      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => onDateSelect(date)}
          style={[
            styles.calendarDay,
            styles.calendarDayButton,
            isToday && styles.calendarDayToday
          ]}
        >
          <Text style={[
            styles.calendarDayText,
            isToday && styles.calendarDayTodayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
        </View>
        <View style={styles.calendarWeekHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <View key={day} style={styles.calendarWeekDay}>
              <Text style={styles.calendarWeekDayText}>{day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {days}
        </View>
        <View style={styles.calendarFooter}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const RadioButton: React.FC<{ selected: boolean; onPress: () => void; children: React.ReactNode; subtitle?: string }> = ({
    selected,
    onPress,
    children,
    subtitle
  }) => (
    <TouchableOpacity style={styles.radioButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.radioContent}>
        <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <View style={styles.radioTextContainer}>
          <Text style={styles.radioText}>{children}</Text>
          {subtitle && <Text style={styles.radioSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
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
          <Text style={styles.title}>Exchange Details</Text>
          <Text style={styles.subtitle}>Confirm when and how the exchange will happen.</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Settlement Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Settlement/Closing date</Text>
            <View style={styles.dateInputContainer}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowCalendar(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={24} color="#9CA3AF" style={styles.calendarIcon} />
                <Text style={[styles.dateInputText, !formData.settlementDate && styles.placeholderText]}>
                  {formData.settlementDate || 'Select date'}
                </Text>
              </TouchableOpacity>
              {showCalendar && renderCalendar(handleDateSelect, () => setShowCalendar(false))}
            </View>
          </View>

          {/* When is the exchange happening? */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>When is the exchange happening?</Text>
            <View style={styles.radioGroup}>
              <RadioButton
                selected={formData.exchangeTiming === 'settlement'}
                onPress={() => handleTimingSelect('settlement')}
              >
                Settlement/Closing date
              </RadioButton>
              <RadioButton
                selected={formData.exchangeTiming === 'later'}
                onPress={() => handleTimingSelect('later')}
              >
                Schedule for later
              </RadioButton>
            </View>

            {/* Schedule Date Field - Only show when "later" is selected */}
            {formData.exchangeTiming === 'later' && (
              <View style={styles.scheduleContainer}>
                <Text style={styles.label}>Schedule date</Text>
                <View style={styles.dateInputContainer}>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowScheduleCalendar(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="calendar-outline" size={24} color="#9CA3AF" style={styles.calendarIcon} />
                    <Text style={[styles.dateInputText, !formData.scheduleDate && styles.placeholderText]}>
                      {formData.scheduleDate || 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showScheduleCalendar && renderCalendar(handleScheduleDateSelect, () => setShowScheduleCalendar(false))}
                </View>
              </View>
            )}
          </View>

          {/* How is the exchange happening? */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>How is the exchange happening?</Text>
            <View style={styles.radioGroup}>
              <RadioButton
                selected={formData.exchangeMethod === 'meetup'}
                onPress={() => handleMethodSelect('meetup')}
                subtitle="We recommend meeting in a public place"
              >
                Meet Up
              </RadioButton>
              <RadioButton
                selected={formData.exchangeMethod === 'shipping'}
                onPress={() => handleMethodSelect('shipping')}
              >
                Via Shipping
              </RadioButton>
            </View>

            {/* Shipping Payer Field - Only show when "shipping" is selected */}
            {formData.exchangeMethod === 'shipping' && (
              <View style={styles.shippingContainer}>
                <Text style={styles.label}>Who pays for shipping?</Text>
                <View style={styles.radioGroup}>
                  <RadioButton
                    selected={formData.shippingPayer === 'buyer'}
                    onPress={() => handleShippingPayerSelect('buyer')}
                  >
                    Buyer
                  </RadioButton>
                  <RadioButton
                    selected={formData.shippingPayer === 'seller'}
                    onPress={() => handleShippingPayerSelect('seller')}
                  >
                    Seller
                  </RadioButton>
                </View>
              </View>
            )}
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
            onPress={() => router.push('/homepages/createcontract/sale/vehicle/vehicle3')}
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
    paddingHorizontal: 24,
    paddingVertical: 4,
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
    gap: 16,
    marginBottom: 24,
  },
  fieldContainer: {
    gap: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'left',
  },
  dateInputContainer: {
    position: 'relative',
  },
  dateInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingLeft: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    position: 'absolute',
    left: 12,
  },
  dateInputText: {
    fontSize: 18,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  radioTextContainer: {
    flex: 1,
  },
  radioText: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  radioSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scheduleContainer: {
    marginTop: 16,
    gap: 8,
  },
  shippingContainer: {
    marginTop: 16,
    gap: 16,
  },
  calendarContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarWeekDay: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  calendarWeekDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayButton: {
    borderRadius: 8,
  },
  calendarDayToday: {
    backgroundColor: '#10B981',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#111827',
  },
  calendarDayTodayText: {
    color: 'white',
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
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
    color: '#6B7280',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressBar: {
    width: '40%',
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  nextButtonContainer: {
    marginBottom: 80,
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  }
});

export default ExchangeDetails;

