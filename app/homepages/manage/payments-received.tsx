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
  ArrowDownLeft,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Plus,
  Search,
  TrendingUp,
} from 'react-native-feather';

type PeriodKey = 'thisMonth' | 'lastMonth' | 'last3Months';
type PaymentStatus = 'received' | 'pending' | 'overdue';

interface Payment {
  id: number;
  client: string;
  service: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  avatar: string;
  color: string;
  paymentMethod: string;
}

export default function PaymentsReceivedPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('thisMonth');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const paymentsReceived: Payment[] = [
    {
      id: 1,
      client: 'Josh Peters',
      service: 'Apartment Rent Collection',
      amount: 1700,
      date: '2025-05-15',
      status: 'received',
      avatar: 'JP',
      color: 'green',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 2,
      client: 'Tech Solutions Inc',
      service: 'Website Maintenance',
      amount: 500,
      date: '2025-05-12',
      status: 'received',
      avatar: 'TS',
      color: 'purple',
      paymentMethod: 'Check'
    },
    {
      id: 3,
      client: 'Anna Smith',
      service: 'Consulting Session',
      amount: 250,
      date: '2025-05-10',
      status: 'received',
      avatar: 'AS',
      color: 'blue',
      paymentMethod: 'Venmo'
    },
    {
      id: 4,
      client: 'Green Valley LLC',
      service: 'Landscaping Project',
      amount: 1200,
      date: '2025-05-08',
      status: 'received',
      avatar: 'GV',
      color: 'emerald',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 5,
      client: 'Mike Wilson',
      service: 'Photography Session',
      amount: 400,
      date: '2025-05-05',
      status: 'pending',
      avatar: 'MW',
      color: 'orange',
      paymentMethod: 'PayPal'
    },
    {
      id: 6,
      client: 'Sarah Johnson',
      service: 'Design Work',
      amount: 800,
      date: '2025-05-03',
      status: 'received',
      avatar: 'SJ',
      color: 'pink',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 7,
      client: 'Local Cafe',
      service: 'Social Media Management',
      amount: 300,
      date: '2025-05-01',
      status: 'received',
      avatar: 'LC',
      color: 'amber',
      paymentMethod: 'Cash'
    }
  ];

  const monthlyStats = {
    thisMonth: { total: 28500, count: 15, avgPayment: 1900, growth: 12 },
    lastMonth: { total: 25400, count: 14, avgPayment: 1814, growth: 8 },
    last3Months: { total: 82600, count: 42, avgPayment: 1967, growth: 15 }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'received': return { text: '#059669', bg: '#D1FAE5' };
      case 'pending': return { text: '#D97706', bg: '#FED7AA' };
      case 'overdue': return { text: '#DC2626', bg: '#FEE2E2' };
      default: return { text: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const getAvatarColor = (color: string): string => {
    const colors: Record<string, string> = {
      green: '#10B981',
      purple: '#8B5CF6',
      blue: '#3B82F6',
      emerald: '#059669',
      orange: '#F59E0B',
      pink: '#EC4899',
      amber: '#F59E0B'
    };
    return colors[color] || colors.green;
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
            <Text style={styles.clientName}>{payment.client}</Text>
            <Text style={styles.serviceName}>{payment.service}</Text>
          </View>
        </View>
        <View style={styles.paymentRight}>
          <Text style={styles.paymentAmount}>+{formatCurrency(payment.amount)}</Text>
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
          <Text style={styles.invoiceButton}>Invoice</Text>
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
        <Text style={styles.headerTitle}>Payments Received</Text>
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
        <View style={styles.summaryRow}>
          <View style={styles.mainSummaryCard}>
            <View style={styles.summaryHeader}>
              <DollarSign width={24} height={24} color="#FFFFFF" opacity={0.5} />
              <View style={styles.growthBadge}>
                <Text style={styles.growthText}>+{monthlyStats[selectedPeriod].growth}%</Text>
              </View>
            </View>
            <Text style={styles.mainSummaryValue}>
              {formatCurrency(monthlyStats[selectedPeriod].total)}
            </Text>
            <Text style={styles.mainSummaryLabel}>Total Received</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <ArrowDownLeft width={20} height={20} color="#3B82F6" opacity={0.5} />
            </View>
            <Text style={styles.statValue}>
              {monthlyStats[selectedPeriod].count}
            </Text>
            <Text style={styles.statLabel}>Payments</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp width={20} height={20} color="#8B5CF6" opacity={0.5} />
            </View>
            <Text style={styles.statValue}>
              {formatCurrency(monthlyStats[selectedPeriod].avgPayment)}
            </Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock width={20} height={20} color="#F59E0B" opacity={0.5} />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Pending</Text>
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
          {paymentsReceived.map((payment) => (
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
    backgroundColor: '#10B981',
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
    backgroundColor: '#10B981',
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mainSummaryCard: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  growthBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  growthText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  mainSummaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mainSummaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  clientName: {
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
    color: '#059669',
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
  invoiceButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
});