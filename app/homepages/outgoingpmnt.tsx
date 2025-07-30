import { useRouter } from 'expo-router';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Filter,
  Home,
  MessageCircle,
  Plus,
  Search,
  User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Type definitions
interface Payment {
  id: string;
  client: string;
  amount: string;
  status: 'pending' | 'recurring' | 'overdue';
  dueDate?: string;
  frequency?: string;
  projectFolder: string;
  paymentType: string;
  description: string;
}

type FilterStatus = 'amount-desc' | 'amount-asc' | 'date-desc' | 'date-asc';
type ActiveTab = 'pending' | 'recurring' | 'overdue';

const OutgoingPaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('amount-desc');
  const [activeTab, setActiveTab] = useState<ActiveTab>('pending');

  const router = useRouter()
  // Sample outgoing payment data
  const payments: Payment[] = [
    {
      id: 'OUT-2025-001',
      client: 'CloudServ Technologies',
      amount: '$25,000',
      status: 'pending',
      dueDate: '2025-07-18',
      projectFolder: 'Enterprise Software Suite',
      paymentType: 'Manual Pay',
      description: 'Cloud hosting services - Q3 Infrastructure'
    },
    {
      id: 'OUT-2025-002',
      client: 'Office Supplies Co.',
      amount: '$8,500',
      status: 'recurring',
      frequency: 'Monthly',
      projectFolder: 'Digital Consulting Services',
      paymentType: 'Auto Pay',
      description: 'Monthly office supplies and equipment'
    },
    {
      id: 'OUT-2025-003',
      client: 'Marketing Pros LLC',
      amount: '$15,000',
      status: 'overdue',
      dueDate: '2025-07-10',
      projectFolder: 'Equipment Leasing Program',
      paymentType: 'Manual Pay',
      description: 'Digital marketing campaign - July'
    },
    {
      id: 'OUT-2025-004',
      client: 'Legal Solutions Inc.',
      amount: '$35,000',
      status: 'pending',
      dueDate: '2025-07-20',
      projectFolder: 'Strategic Partnership',
      paymentType: 'Manual Pay',
      description: 'Legal consultation services - Contract review'
    },
    {
      id: 'OUT-2025-005',
      client: 'Software Licensing Corp',
      amount: '$120,000',
      status: 'recurring',
      frequency: 'Annually',
      projectFolder: 'Enterprise Software Suite',
      paymentType: 'Auto Pay',
      description: 'Annual software licensing fees'
    },
    {
      id: 'OUT-2025-006',
      client: 'Design Studio Pro',
      amount: '$12,000',
      status: 'pending',
      dueDate: '2025-07-22',
      projectFolder: 'Digital Consulting Services',
      paymentType: 'Manual Pay',
      description: 'UI/UX design services - Mobile app'
    },
    {
      id: 'OUT-2025-007',
      client: 'DataCenter Solutions',
      amount: '$28,000',
      status: 'overdue',
      dueDate: '2025-07-08',
      projectFolder: 'E-commerce Platform',
      paymentType: 'Manual Pay',
      description: 'Server infrastructure and maintenance'
    },
    {
      id: 'OUT-2025-008',
      client: 'Cleaning Services Plus',
      amount: '$2,200',
      status: 'recurring',
      frequency: 'Weekly',
      projectFolder: 'Office Operations',
      paymentType: 'Auto Pay',
      description: 'Weekly office cleaning services'
    }
  ];

  const filteredPayments = payments.filter((payment: Payment) => {
    // First filter by tab
    const matchesTab = payment.status === activeTab;
    
    // Then filter by search
    const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.projectFolder.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }).sort((a: Payment, b: Payment) => {
    if (filterStatus === 'amount-desc') {
      const aValue = parseInt(a.amount.replace(/[$,]/g, ''));
      const bValue = parseInt(b.amount.replace(/[$,]/g, ''));
      return bValue - aValue; // Highest amount first ($$-$)
    } else if (filterStatus === 'amount-asc') {
      const aValue = parseInt(a.amount.replace(/[$,]/g, ''));
      const bValue = parseInt(b.amount.replace(/[$,]/g, ''));
      return aValue - bValue; // Lowest amount first ($-$$)
    } else if (filterStatus === 'date-desc') {
      return new Date(b.dueDate || '').getTime() - new Date(a.dueDate || '').getTime(); // Newest date first
    } else if (filterStatus === 'date-asc') {
      return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime(); // Oldest date first
    }
    return 0;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date('2025-07-15'); // Current date
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const showFilterOptions = (): void => {
    Alert.alert(
      'Filter Options',
      'Choose how to sort payments:',
      [
        { text: 'Amount $$-$', onPress: () => setFilterStatus('amount-desc') },
        { text: 'Amount $-$$', onPress: () => setFilterStatus('amount-asc') },
        { text: 'Date Newest', onPress: () => setFilterStatus('date-desc') },
        { text: 'Date Oldest', onPress: () => setFilterStatus('date-asc') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePayNow = (paymentId: string, status: ActiveTab): void => {
    Alert.alert('Pay Now', `Processing payment for ${paymentId} (${status})`);
  };

  const handleViewDetails = (paymentId: string): void => {
    Alert.alert('View Details', `Viewing details for payment ${paymentId}`);
  };

  const handleMessage = (paymentId: string): void => {
    Alert.alert('Message', `Sending message for payment ${paymentId}`);
  };

  const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
    const daysUntilDue = payment.dueDate ? getDaysUntilDue(payment.dueDate) : 0;
    
    return (
      <View style={styles.paymentCard}>
        <View style={styles.paymentContent}>
          {/* Payment Info */}
          <View style={styles.paymentInfo}>
            <View style={styles.paymentHeader}>
              <Text style={styles.clientName}>{payment.client}</Text>
            </View>
            <Text style={styles.paymentDescription}>{payment.description}</Text>
            
            <View style={styles.paymentDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <DollarSign width={16} height={16} color="#9ca3af" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={[styles.detailValue, styles.amountText]}>{payment.amount}</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Calendar width={16} height={16} color="#9ca3af" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>
                      {payment.status === 'recurring' ? 'Frequency' : 'Date'}
                    </Text>
                    <Text style={styles.detailValue}>
                      {payment.status === 'recurring' 
                        ? payment.frequency 
                        : payment.dueDate ? formatDate(payment.dueDate) : 'N/A'
                      }
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <FileText width={16} height={16} color="#9ca3af" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Project</Text>
                    <Text style={styles.detailValue}>{payment.projectFolder}</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <CreditCard width={16} height={16} color="#9ca3af" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>{payment.paymentType}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {activeTab === 'pending' && (
              <TouchableOpacity 
                style={styles.payNowButtonPending}
                onPress={() => handlePayNow(payment.id, activeTab)}
              >
                <CheckCircle width={16} height={16} color="white" />
                <Text style={styles.payNowButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
            
            {activeTab === 'recurring' && (
              <TouchableOpacity 
                style={styles.payNowButtonRecurring}
                onPress={() => handlePayNow(payment.id, activeTab)}
              >
                <CheckCircle width={16} height={16} color="white" />
                <Text style={styles.payNowButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
            
            {activeTab === 'overdue' && (
              <TouchableOpacity 
                style={styles.payNowButtonOverdue}
                onPress={() => handlePayNow(payment.id, activeTab)}
              >
                <AlertCircle width={16} height={16} color="white" />
                <Text style={styles.payNowButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => handleViewDetails(payment.id)}
            >
              <Eye width={16} height={16} color="#374151" />
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.messageButton}
              onPress={() => handleMessage(payment.id)}
            >
              <MessageCircle width={16} height={16} color="#c2410c" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const NoPaymentsFound: React.FC = () => (
    <View style={styles.noPaymentsContainer}>
      <DollarSign width={64} height={64} color="#d1d5db" style={styles.noPaymentsIcon} />
      <Text style={styles.noPaymentsTitle}>No payments found</Text>
      <Text style={styles.noPaymentsSubtitle}>Try adjusting your search terms or filters</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Outgoing Payments</Text>
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Search width={16} height={16} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search clients, payment IDs, or project folders..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          
          <TouchableOpacity style={styles.filterContainer} onPress={showFilterOptions}>
            <Filter width={16} height={16} color="#9ca3af" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'pending' ? styles.activeTabTextPending : styles.inactiveTabText
            ]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recurring' && styles.activeTab]}
            onPress={() => setActiveTab('recurring')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'recurring' ? styles.activeTabTextRecurring : styles.inactiveTabText
            ]}>
              Recurring
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overdue' && styles.activeTab]}
            onPress={() => setActiveTab('overdue')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'overdue' ? styles.activeTabTextOverdue : styles.inactiveTabText
            ]}>
              Overdue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payments List */}
        <View style={styles.paymentsList}>
          {filteredPayments.map((payment: Payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
          
          {filteredPayments.length === 0 && <NoPaymentsFound />}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#22c55e" />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepages/manage/mnghome')}>
          <FileText size={24} color="#9ca3af" />
          <Text style={styles.navLabel}>Manage</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerNavButton} onPress={() => router.push('/homepages/createcontract/search')}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('homepages/messages')}>
          <MessageCircle size={24} color="#9ca3af" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('homepages/profile')}>
          <User size={24} color="#9ca3af" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4', // from-green-50 via-green-50 to-gray-100
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabTextPending: {
    color: '#16a34a', // green-600
  },
  activeTabTextRecurring: {
    color: '#2563eb', // blue-600
  },
  activeTabTextOverdue: {
    color: '#dc2626', // red-600
  },
  inactiveTabText: {
    color: '#6b7280',
  },
  paymentsList: {
    gap: 8,
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentContent: {
    gap: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentHeader: {
    marginBottom: 4,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  paymentDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  amountText: {
    color: '#dc2626', // red-600 for outgoing payments
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  payNowButtonPending: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a', // green-600
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payNowButtonRecurring: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb', // blue-600
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payNowButtonOverdue: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626', // red-600
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payNowButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  viewButton: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6', // gray-100
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // gray-700
  },
  messageButton: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fed7aa', // orange-100
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#c2410c', // orange-700
  },
  noPaymentsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noPaymentsIcon: {
    marginBottom: 16,
    opacity: 0.3,
  },
  noPaymentsTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  noPaymentsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#22c55e',
  },
  centerNavButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OutgoingPaymentsPage;