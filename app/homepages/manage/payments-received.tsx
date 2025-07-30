import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Search,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
interface Payment {
  id: number;
  client: string;
  service: string;
  amount: number;
  date: string;
  status: 'received' | 'pending' | 'overdue';
  avatar: string;
  color: 'green' | 'purple' | 'blue' | 'emerald' | 'orange' | 'pink' | 'amber';
  paymentMethod: string;
}

const { width } = Dimensions.get('window');

export default function PaymentsReceivedPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('');

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
      paymentMethod: 'ACH'
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
      paymentMethod: 'Credit Card'
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
      paymentMethod: 'Debit Card'
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
      paymentMethod: 'Wire Transfer'
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
      paymentMethod: 'ACH'
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
      paymentMethod: 'Wire Transfer'
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
      paymentMethod: 'ACH'
    }
  ];

  const filteredPayments = paymentsReceived.filter(payment =>
    payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'received':
        return { color: '#059669', backgroundColor: '#dcfce7' };
      case 'pending':
        return { color: '#d97706', backgroundColor: '#fed7aa' };
      case 'overdue':
        return { color: '#dc2626', backgroundColor: '#fecaca' };
      default:
        return { color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
  };

  const getAvatarStyle = (color: string) => {
    const colors = {
      green: ['#4ade80', '#22c55e'],
      purple: ['#a78bfa', '#8b5cf6'],
      blue: ['#60a5fa', '#3b82f6'],
      emerald: ['#34d399', '#10b981'],
      orange: ['#fb923c', '#f97316'],
      pink: ['#f472b6', '#ec4899'],
      amber: ['#fbbf24', '#f59e0b']
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
    const avatarColors = getAvatarStyle(payment.color);
    const statusStyle = getStatusStyle(payment.status);

    return (
      <View style={styles.paymentCard}>
        <View style={styles.cardHeader}>
          <View style={styles.clientInfo}>
            <View style={[
              styles.avatar,
              { 
                backgroundColor: avatarColors[0],
                shadowColor: avatarColors[1],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }
            ]}>
              <Text style={styles.avatarText}>{payment.avatar}</Text>
            </View>
            <View style={styles.clientDetails}>
              <Text style={styles.clientName}>{payment.client}</Text>
              <Text style={styles.serviceName}>{payment.service}</Text>
            </View>
          </View>
          <View style={styles.amountSection}>
            <Text style={styles.amount}>+{formatCurrency(payment.amount)}</Text>
            <View style={[styles.statusBadge, statusStyle]}>
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {payment.status}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.paymentInfo}>
            <View style={styles.dateSection}>
              <Calendar size={16} color="#6b7280" />
              <Text style={styles.dateText}>
                {new Date(payment.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <Text style={styles.paymentMethod}>
              {payment.paymentMethod}
            </Text>
            <TouchableOpacity>
              <Text style={styles.invoiceButton}>Invoice</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleGoBack = () => {
    // Navigation logic here
    console.log('Go back pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments Received</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={16} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by client, service, or payment method..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Payments List */}
        <View style={styles.paymentsContainer}>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No payments found matching your search.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  searchContainer: {
    marginVertical: 24,
  },
  searchInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#000',
  },
  paymentsContainer: {
    marginBottom: 24,
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#6b7280',
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  cardFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#6b7280',
  },
  invoiceButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  viewDetailsButton: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: 'rgba(156, 163, 175, 0.7)',
    borderRadius: 9999,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

