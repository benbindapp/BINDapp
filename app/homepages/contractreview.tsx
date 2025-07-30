import { useRouter } from 'expo-router';
import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Filter,
  Home,
  MessageCircle,
  PenTool,
  Plus,
  Search,
  User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Type definitions
interface Contract {
  id: string;
  title: string;
  client: string;
  value: string;
  status: 'pending_review';
  priority: 'high' | 'medium' | 'low';
  submittedDate: string;
  deadline: string;
  type: string;
  description: string;
}

type FilterStatus = 'date' | 'deadline' | 'price';

const { width } = Dimensions.get('window');

const ContractsReviewPage: React.FC = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('date');

  // Sample contract data
  const contracts: Contract[] = [
    {
      id: 'CTR-2025-001',
      title: 'Software License Agreement',
      client: 'TechCorp Solutions',
      value: '$125,000',
      status: 'pending_review',
      priority: 'high',
      submittedDate: '2025-07-10',
      deadline: '2025-07-20',
      type: 'Software License',
      description: 'Annual software licensing agreement with enterprise support package'
    },
    {
      id: 'CTR-2025-002',
      title: 'Consulting Services Contract',
      client: 'Global Dynamics Inc.',
      value: '$85,000',
      status: 'pending_review',
      priority: 'medium',
      submittedDate: '2025-07-12',
      deadline: '2025-07-25',
      type: 'Consulting',
      description: 'Q3 strategic consulting services for digital transformation'
    },
    {
      id: 'CTR-2025-003',
      title: 'Equipment Lease Agreement',
      client: 'Manufacturing Plus LLC',
      value: '$45,000',
      status: 'pending_review',
      priority: 'low',
      submittedDate: '2025-07-13',
      deadline: '2025-07-30',
      type: 'Equipment Lease',
      description: 'Industrial equipment lease renewal for production facility'
    },
    {
      id: 'CTR-2025-004',
      title: 'Partnership Agreement',
      client: 'Innovate Partners',
      value: '$200,000',
      status: 'pending_review',
      priority: 'high',
      submittedDate: '2025-07-14',
      deadline: '2025-07-18',
      type: 'Partnership',
      description: 'Strategic partnership agreement for joint venture development'
    },
    {
      id: 'CTR-2025-005',
      title: 'Service Level Agreement',
      client: 'CloudFirst Technologies',
      value: '$75,000',
      status: 'pending_review',
      priority: 'medium',
      submittedDate: '2025-07-15',
      deadline: '2025-07-28',
      type: 'SLA',
      description: 'Cloud infrastructure service level agreement with 99.9% uptime guarantee'
    }
  ];

  const filteredContracts = contracts.filter((contract: Contract) => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a: Contract, b: Contract) => {
    if (filterStatus === 'date') {
      return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime(); // Most recent first
    } else if (filterStatus === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); // Earliest deadline first
    } else if (filterStatus === 'price') {
      const aValue = parseInt(a.value.replace(/[$,]/g, ''));
      const bValue = parseInt(b.value.replace(/[$,]/g, ''));
      return bValue - aValue; // Highest price first
    }
    return 0;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDeadline = (deadline: string): number => {
    const today = new Date('2025-07-15'); // Current date
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const handleFilterChange = (value: FilterStatus): void => {
    setFilterStatus(value);
  };

  const showFilterOptions = (): void => {
    Alert.alert(
      'Filter Options',
      'Choose how to sort contracts:',
      [
        { text: 'Date Sent', onPress: () => handleFilterChange('date') },
        { text: 'Deadline Due', onPress: () => handleFilterChange('deadline') },
        { text: 'Price', onPress: () => handleFilterChange('price') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleESign = (contractId: string): void => {
    Alert.alert('E-Sign', `E-signing contract ${contractId}`);
  };

  const handleReviewDetails = (contractId: string): void => {
    Alert.alert('Review Details', `Reviewing details for contract ${contractId}`);
  };

  const handleRevise = (contractId: string): void => {
    Alert.alert('Revise', `Revising contract ${contractId}`);
  };

  const ContractCard: React.FC<{ contract: Contract }> = ({ contract }) => {
    const daysUntilDeadline = getDaysUntilDeadline(contract.deadline);
    
    return (
      <View style={styles.contractCard}>
        <View style={styles.contractContent}>
          {/* Contract Info */}
          <View style={styles.contractInfo}>
            <View style={styles.contractHeader}>
              <View style={styles.contractTitleContainer}>
                <Text style={styles.contractTitle}>{contract.title}</Text>
              </View>
              <Text style={styles.contractDescription}>{contract.description}</Text>
            </View>
            
            <View style={styles.contractDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Building2 width={16} height={16} color="#9ca3af" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Client</Text>
                    <Text style={styles.detailValue}>{contract.client}</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <DollarSign width={16} height={16} color="#9ca3af" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Value</Text>
                    <Text style={[styles.detailValue, styles.valueText]}>{contract.value}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Calendar width={16} height={16} color="#9ca3af" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Deadline</Text>
                    <Text style={styles.detailValue}>{formatDate(contract.deadline)}</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Clock width={16} height={16} color="#9ca3af" />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Days Remaining</Text>
                    <Text style={styles.detailValue}>{daysUntilDeadline} days</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.signButton}
              onPress={() => handleESign(contract.id)}
            >
              <PenTool width={16} height={16} color="white" />
              <Text style={styles.signButtonText}>E-Sign</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={() => handleReviewDetails(contract.id)}
            >
              <Eye width={16} height={16} color="#374151" />
              <Text style={styles.reviewButtonText}>Review Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reviseButton}
              onPress={() => handleRevise(contract.id)}
            >
              <Edit width={16} height={16} color="#c2410c" />
              <Text style={styles.reviseButtonText}>Revise</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const NoContractsFound: React.FC = () => (
    <View style={styles.noContractsContainer}>
      <FileText width={64} height={64} color="#d1d5db" style={styles.noContractsIcon} />
      <Text style={styles.noContractsTitle}>No contracts found</Text>
      <Text style={styles.noContractsSubtitle}>Try adjusting your search terms or filters</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Contracts Review</Text>
          <Text style={styles.subtitle}>Review and manage contracts awaiting your approval</Text>
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Search width={20} height={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contracts, clients, or contract IDs..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          
          <TouchableOpacity style={styles.filterContainer} onPress={showFilterOptions}>
            <Filter width={20} height={20} color="#9ca3af" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Contracts List */}
        <View style={styles.contractsList}>
          {filteredContracts.map((contract: Contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
          
          {filteredContracts.length === 0 && <NoContractsFound />}
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
    paddingTop: 48,
    paddingBottom: 80, // Space for bottom nav
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#374151',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 8,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  contractsList: {
    gap: 16,
  },
  contractCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contractContent: {
    gap: 16,
  },
  contractInfo: {
    flex: 1,
  },
  contractHeader: {
    marginBottom: 16,
  },
  contractTitleContainer: {
    marginBottom: 8,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  contractDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  contractDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
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
  valueText: {
    color: '#16a34a', // green-600
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  signButton: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a', // green-600
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  reviewButton: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6', // gray-100
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // gray-700
  },
  reviseButton: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fed7aa', // orange-100
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reviseButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#c2410c', // orange-700
  },
  noContractsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noContractsIcon: {
    marginBottom: 16,
    opacity: 0.3,
  },
  noContractsTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  noContractsSubtitle: {
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

export default ContractsReviewPage;