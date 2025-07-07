import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Filter,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'react-native-feather';

type TabKey = 'active' | 'paused' | 'completed';
type PaymentStatus = 'active' | 'paused' | 'completed';

interface RecurringPayment {
  id: number;
  recipient: string;
  service: string;
  amount: number;
  frequency: string;
  nextPayment: string;
  status: PaymentStatus;
  avatar: string;
  color: string;
  paymentMethod: string;
  totalPaid: number;
  paymentsCount: number;
}

export default function RecurringPaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('active');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const recurringPayments = {
    active: [
      {
        id: 1,
        recipient: 'Josh Peters',
        service: 'Apartment Rent',
        amount: 1700,
        frequency: 'Monthly',
        nextPayment: '2025-06-01',
        status: 'active' as const,
        avatar: 'JP',
        color: 'green',
        paymentMethod: 'Bank Transfer',
        totalPaid: 8500,
        paymentsCount: 5
      },
      {
        id: 2,
        recipient: 'Anna Smith',
        service: 'Weekly Cleaning',
        amount: 75,
        frequency: 'Weekly',
        nextPayment: '2025-05-19',
        status: 'active' as const,
        avatar: 'AS',
        color: 'blue',
        paymentMethod: 'Venmo',
        totalPaid: 900,
        paymentsCount: 12
      },
      {
        id: 3,
        recipient: 'Tech Solutions',
        service: 'Website Hosting',
        amount: 50,
        frequency: 'Monthly',
        nextPayment: '2025-05-25',
        status: 'active' as const,
        avatar: 'TS',
        color: 'purple',
        paymentMethod: 'Credit Card',
        totalPaid: 200,
        paymentsCount: 4
      },
      {
        id: 4,
        recipient: 'Garden Pro',
        service: 'Lawn Care',
        amount: 120,
        frequency: 'Bi-weekly',
        nextPayment: '2025-05-22',
        status: 'active' as const,
        avatar: 'GP',
        color: 'emerald',
        paymentMethod: 'Check',
        totalPaid: 480,
        paymentsCount: 4
      }
    ],
    paused: [
      {
        id: 5,
        recipient: 'Mike Wilson',
        service: 'Pool Maintenance',
        amount: 150,
        frequency: 'Monthly',
        nextPayment: 'Paused',
        status: 'paused' as const,
        avatar: 'MW',
        color: 'orange',
        paymentMethod: 'Bank Transfer',
        totalPaid: 600,
        paymentsCount: 4
      }
    ],
    completed: [
      {
        id: 6,
        recipient: 'Sarah Johnson',
        service: 'Piano Lessons',
        amount: 80,
        frequency: 'Weekly',
        nextPayment: 'Completed',
        status: 'completed' as const,
        avatar: 'SJ',
        color: 'gray',
        paymentMethod: 'Cash',
        totalPaid: 960,
        paymentsCount: 12
      }
    ]
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'active': return { text: '#059669', bg: '#D1FAE5' };
      case 'paused': return { text: '#D97706', bg: '#FED7AA' };
      case 'completed': return { text: '#6B7280', bg: '#F3F4F6' };
      default: return { text: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const getAvatarColor = (color: string): string => {
    const colors: Record<string, string> = {
      green: '#10B981',
      blue: '#3B82F6',
      purple: '#8B5CF6',
      emerald: '#059669',
      orange: '#F59E0B',
      gray: '#6B7280'
    };
    return colors[color] || colors.gray;
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'weekly': return <Clock width={16} height={16} color="#6B7280" opacity={0.5} />;
      case 'bi-weekly': return <Calendar width={16} height={16} color="#6B7280" opacity={0.5} />;
      case 'monthly': return <RefreshCw width={16} height={16} color="#6B7280" opacity={0.5} />;
      default: return <RefreshCw width={16} height={16} color="#6B7280" opacity={0.5} />;
    }
  };

  interface RecurringPaymentCardProps {
    payment: RecurringPayment;
  }

  const RecurringPaymentCard: React.FC<RecurringPaymentCardProps> = ({ payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentLeft}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(payment.color) }]}>
            <Text style={styles.avatarText}>{payment.avatar}</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.recipientName}>{payment.recipient}</Text>
            <Text style={styles.serviceName}>{payment.service}</Text>
            <View style={styles.frequencyContainer}>
              {getFrequencyIcon(payment.frequency)}
              <Text style={styles.frequencyText}>{payment.frequency}</Text>
            </View>
          </View>
        </View>
        <View style={styles.paymentRight}>
          <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status).bg }]}>
            <Text style={[styles.statusText, { color: getStatusColor(payment.status).text }]}>
              {payment.status}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.paymentDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Next Payment</Text>
            <Text style={styles.detailValue}>
              {payment.nextPayment === 'Paused' || payment.nextPayment === 'Completed' 
                ? payment.nextPayment 
                : new Date(payment.nextPayment).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })
              }
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Paid</Text>
            <Text style={styles.detailValue}>{formatCurrency(payment.totalPaid)}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{payment.paymentMethod}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Payments Made</Text>
            <Text style={styles.detailValue}>{payment.paymentsCount} times</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {payment.status === 'active' && (
          <>
            <TouchableOpacity style={styles.pauseButton}>
              <Pause width={16} height={16} color="#D97706" />
              <Text style={styles.pauseButtonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Edit width={16} height={16} color="#3B82F6" />
            </TouchableOpacity>
          </>
        )}
        {payment.status === 'paused' && (
          <>
            <TouchableOpacity style={styles.resumeButton}>
              <Play width={16} height={16} color="#059669" />
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Edit width={16} height={16} color="#3B82F6" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.deleteButton}>
          <Trash2 width={16} height={16} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalActiveAmount = recurringPayments.active.reduce((sum, payment) => {
    const multiplier = payment.frequency === 'Weekly' ? 4 : payment.frequency === 'Bi-weekly' ? 2 : 1;
    return sum + (payment.amount * multiplier);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recurring Payments</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus width={16} height={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{recurringPayments.active.length}</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{formatCurrency(totalActiveAmount)}</Text>
            <Text style={styles.summaryLabel}>Monthly Total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{recurringPayments.paused.length}</Text>
            <Text style={styles.summaryLabel}>Paused</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'active', label: 'Active', count: recurringPayments.active.length },
            { key: 'paused', label: 'Paused', count: recurringPayments.paused.length },
            { key: 'completed', label: 'Completed', count: recurringPayments.completed.length }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as TabKey)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search width={16} height={16} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder="Search recurring payments..."
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter width={16} height={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {recurringPayments[activeTab].length === 0 ? (
          <View style={styles.emptyState}>
            <RefreshCw width={48} height={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No {activeTab} recurring payments</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active' && "You don't have any active recurring payments yet."}
              {activeTab === 'paused' && "No recurring payments are currently paused."}
              {activeTab === 'completed' && "No completed recurring payments to show."}
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Set Up Recurring Payment</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View>
            {recurringPayments[activeTab].map((payment) => (
              <RecurringPaymentCard key={payment.id} payment={payment} />
            ))}
          </View>
        )}

        {activeTab === 'active' && (
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>Upcoming This Week</Text>
            <View style={styles.upcomingList}>
              {recurringPayments.active
                .filter(payment => new Date(payment.nextPayment) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                .map((payment) => (
                  <View key={payment.id} style={styles.upcomingItem}>
                    <View style={styles.upcomingLeft}>
                      <View style={[styles.smallAvatar, { backgroundColor: getAvatarColor(payment.color) }]}>
                        <Text style={styles.smallAvatarText}>{payment.avatar}</Text>
                      </View>
                      <View style={styles.upcomingInfo}>
                        <Text style={styles.upcomingRecipient}>{payment.recipient}</Text>
                        <Text style={styles.upcomingDate}>
                          {new Date(payment.nextPayment).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.upcomingAmount}>{formatCurrency(payment.amount)}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#F59E0B',
    padding: 8,
    borderRadius: 8,
  },
  summaryContainer: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#F59E0B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#D97706',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  paymentInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  paymentDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#FED7AA',
    borderWidth: 1,
    borderColor: '#FDBA74',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  pauseButtonText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  resumeButton: {
    flex: 1,
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  resumeButtonText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 8,
    borderRadius: 8,
  },
  upcomingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  upcomingList: {
    gap: 12,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  upcomingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  smallAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingRecipient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  upcomingDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  upcomingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D97706',
  },
});