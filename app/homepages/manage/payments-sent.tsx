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
  ArrowUpRight,
  Calendar,
  DollarSign,
  Filter,
  Plus,
  Search,
  TrendingUp,
} from 'react-native-feather';

type PeriodKey = 'thisMonth' | 'lastMonth' | 'last3Months';
type PaymentStatus = 'completed' | 'pending' | 'failed';

interface Payment {
  id: number;
  recipient: string;
  service: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  avatar: string;
  color: string;
  paymentMethod: string;
}

export default function PaymentsSentPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('thisMonth');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const paymentsSent: Payment[] = [
    {
      id: 1,
      recipient: 'Anna Smith',
      service: 'Cleaning Service',
      amount: 300,
      date: '2025-05-12',
      status: 'completed',
      avatar: 'AS',
      color: 'orange',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 2,
      recipient: 'John Smith',
      service: 'Babysitting',
      amount: 150,
      date: '2025-05-10',
      status: 'completed',
      avatar: 'JS',
      color: 'red',
      paymentMethod: 'Venmo'
    },
    {
      id: 3,
      recipient: 'Mike\'s Repairs',
      service: 'Plumbing Service',
      amount: 450,
      date: '2025-05-08',
      status: 'completed',
      avatar: 'MR',
      color: 'blue',
      paymentMethod: 'Check'
    },
    {
      id: 4,
      recipient: 'Garden Pro',
      service: 'Lawn Maintenance',
      amount: 200,
      date: '2025-05-05',
      status: 'completed',
      avatar: 'GP',
      color: 'green',
      paymentMethod: 'Cash'
    },
    {
      id: 5,
      recipient: 'Tech Support Co',
      service: 'Computer Repair',
      amount: 275,
      date: '2025-05-03',
      status: 'pending',
      avatar: 'TC',
      color: 'purple',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 6,
      recipient: 'Sarah Johnson',
      service: 'House Painting',
      amount: 850,
      date: '2025-05-01',
      status: 'completed',
      avatar: 'SJ',
      color: 'indigo',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const monthlyStats = {
    thisMonth: { total: 5300, count: 12, avgPayment: 442 },
    lastMonth: { total: 4800, count: 10, avgPayment: 480 },
    last3Months: { total: 14200, count: 32, avgPayment: 444 }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed': return { text: '#059669', bg: '#D1FAE5' };
      case 'pending': return { text: '#D97706', bg: '#FED7AA' };
      case 'failed': return { text: '#DC2626', bg: '#FEE2E2' };
      default: return { text: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const getAvatarColor = (color: string): string => {
    const colors: Record<string, string> = {
      orange: '#F59E0B',
      red: '#EF4444',
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
      indigo: '#6366F1'
    };
    return colors[color] || colors.blue;
  };

  interface PaymentCardProps {
    payment: Payment;
  }

  const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentLeft}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(payment.color) }]}>
            <Text style={styles.avatarText}>{payment.avatar}</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.recipientName}>{payment.recipient}</Text>
            <Text style={styles.serviceName}>{payment.service}</Text>
          </View>
        </View>
        <View style={styles.paymentRight}>
          <Text style={styles.paymentAmount}>-{formatCurrency(payment.amount)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status).bg }]}>
            <Text style={[styles.statusText, { color: getStatusColor(payment.status).text }]}>
              {payment.status}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.paymentFooter}>
        <View style={styles.dateContainer}>
          <Calendar width={16} height={16} color="#6B7280" opacity={0.5} />
          <Text style={styles.dateText}>
            {new Date(payment.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
        <Text style={styles.paymentMethod}>{payment.paymentMethod}</Text>
        <TouchableOpacity>
          <Text style={styles.receiptButton}>Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments Sent</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus width={16} height={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'thisMonth', label: 'This Month' },
            { key: 'lastMonth', label: 'Last Month' },
            { key: 'last3Months', label: 'Last 3 Months' }
          ].map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[styles.periodButton, selectedPeriod === period.key && styles.activePeriodButton]}
              onPress={() => setSelectedPeriod(period.key as PeriodKey)}
            >
              <Text style={[styles.periodText, selectedPeriod === period.key && styles.activePeriodText]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <DollarSign width={20} height={20} color="#EF4444" opacity={0.5} />
            </View>
            <Text style={styles.statValue}>
              {formatCurrency(monthlyStats[selectedPeriod].total)}
            </Text>
            <Text style={styles.statLabel}>Total Sent</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <ArrowUpRight width={20} height={20} color="#3B82F6" opacity={0.5} />
            </View>
            <Text style={styles.statValue}>
              {monthlyStats[selectedPeriod].count}
            </Text>
            <Text style={styles.statLabel}>Payments</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp width={20} height={20} color="#10B981" opacity={0.5} />
            </View>
            <Text style={styles.statValue}>
              {formatCurrency(monthlyStats[selectedPeriod].avgPayment)}
            </Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search width={16} height={16} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder="Search payments..."
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter width={16} height={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.paymentsSection}>
          <Text style={styles.sectionTitle}>Recent Payments</Text>
          {paymentsSent.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </View>
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
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 8,
  },
  periodContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  periodButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  activePeriodButton: {
    backgroundColor: '#EF4444',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePeriodText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
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
  paymentsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
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
  paymentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#6B7280',
  },
  receiptButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
});