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
  Upload,
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
  status: 'pending' | 'overdue';
  dueDate: string;
  projectFolder: string;
  paymentMethod: string;
  description: string;
}

type FilterStatus = 'date' | 'amount';
type ActiveTab = 'pending' | 'overdue';

const IncomingPaymentsPage: React.FC = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('date');
  const [activeTab, setActiveTab] = useState<ActiveTab>('pending');

  // Sample incoming payment data - upcoming payments only
  const payments: Payment[] = [
    {
      id: 'PAY-2025-001',
      client: 'TechCorp Solutions',
      amount: '$125,000',
      status: 'pending',
      dueDate: '2025-07-18',
      projectFolder: 'Enterprise Software Suite',
      paymentMethod: 'Wire Transfer',
      description: 'Software License Agreement - Q3 Payment'
    },
    {
      id: 'PAY-2025-003',
      client: 'Manufacturing Plus LLC',
      amount: '$45,000',
      status: 'overdue',
      dueDate: '2025-07-10',
      projectFolder: 'Equipment Leasing Program',
      paymentMethod: 'Check',
      description: 'Equipment Lease Payment - July'
    },
    {
      id: 'PAY-2025-004',
      client: 'Innovate Partners',
      amount: '$200,000',
      status: 'pending',
      dueDate: '2025-07-20',
      projectFolder: 'Strategic Partnership',
      paymentMethod: 'Wire Transfer',
      description: 'Partnership Agreement - Initial Payment'
    },
    {
      id: 'PAY-2025-006',
      client: 'StartupHub Ventures',
      amount: '$60,000',
      status: 'pending',
      dueDate: '2025-07-22',
      projectFolder: 'Digital Consulting Services',
      paymentMethod: 'ACH Transfer',
      description: 'Consulting Services - Digital Strategy'
    },
    {
      id: 'PAY-2025-007',
      client: 'RetailMax Corporation',
      amount: '$95,000',
      status: 'overdue',
      dueDate: '2025-07-08',
      projectFolder: 'E-commerce Platform',
      paymentMethod: 'Wire Transfer',
      description: 'E-commerce Platform Development'
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
    if (filterStatus === 'date') {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(); // Most recent due date first
    } else if (filterStatus === 'amount') {
      const aValue = parseInt(a.amount.replace(/[$,]/g, ''));
      const bValue = parseInt(b.amount.replace(/[$,]/g, ''));
      return bValue - aValue; // Highest amount first
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
        { text: 'Due Date', onPress: () => setFilterStatus('date') },
        { text: 'Amount', onPress: () => setFilterStatus('amount') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRemindPayer = (paymentId: string): void => {
    Alert.alert('Remind Payer', `Sending reminder for payment ${paymentId}`);
  };

  const handleSendReminder = (paymentId: string): void => {
    Alert.alert('Send Reminder', `Sending overdue reminder for payment ${paymentId}`);
  };

  const handleViewDetails = (paymentId: string): void => {
    Alert.alert('View Details', `Viewing details for payment ${paymentId}`);
  };

  const handleUploadExpenses = (paymentId: string): void => {
    Alert.alert('Upload Expenses', `Uploading expenses for payment ${paymentId}`);
  };

  const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
    const daysUntilDue = getDaysUntilDue(payment.dueDate);
    
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
                    <Text style={styles.detailLabel}>Due Date</Text>
                    <Text style={styles.detailValue}>{formatDate(payment.dueDate)}</Text>
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
                    <Text style={styles.detailLabel}>Method</Text>
                    <Text style={styles.detailValue}>{payment.paymentMethod}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {activeTab === 'pending' && (
              <TouchableOpacity 
                style={styles.remindButton}
                onPress={() => handleRemindPayer(payment.id)}
              >
                <CheckCircle width={16} height={16} color="white" />
                <Text style={styles.remindButtonText}>Remind Payer</Text>
              </TouchableOpacity>
            )}
            
            {activeTab === 'overdue' && (
              <TouchableOpacity 
                style={styles.overdueButton}
                onPress={() => handleSendReminder(payment.id)}
              >
                <AlertCircle width={16} height={16} color="white" />
                <Text style={styles.overdueButtonText}>Send Reminder</Text>
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
              style={styles.uploadButton}
              onPress={() => handleUploadExpenses(payment.id)}
            >
              <Upload width={16} height={16} color="#c2410c" />
              <Text style={styles.uploadButtonText}>Upload Expenses</Text>
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
          <Text style={styles.title}>Incoming Payments</Text>
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
    color: '#16a34a', // green-600 for incoming payments
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  remindButton: {
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
  remindButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  overdueButton: {
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
  overdueButtonText: {
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
  uploadButton: {
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
  uploadButtonText: {
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

export default IncomingPaymentsPage;