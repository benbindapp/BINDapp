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
  DollarSign,
  FileText,
  Filter,
  Plus,
  Search,
} from 'react-native-feather';

type ContractStatus = 'active' | 'pending' | 'completed';
type TabKey = 'active' | 'pending' | 'completed';

interface Contract {
  id: number;
  client: string;
  service: string;
  amount: number;
  frequency: string;
  nextPayment: string;
  status: ContractStatus;
  avatar: string;
  color: string;
}

export default function ContractsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('active');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const contracts = {
    active: [
      {
        id: 1,
        client: 'Josh Peters',
        service: 'Apartment Rent Collection',
        amount: 1700,
        frequency: 'Monthly',
        nextPayment: '2025-05-15',
        status: 'active' as const,
        avatar: 'JP',
        color: 'green'
      },
      {
        id: 2,
        client: 'Anna Smith',
        service: 'Weekly Cleaning Service',
        amount: 300,
        frequency: 'Weekly',
        nextPayment: '2025-05-18',
        status: 'active' as const,
        avatar: 'AS',
        color: 'blue'
      },
      {
        id: 3,
        client: 'Tech Solutions Inc',
        service: 'Website Maintenance',
        amount: 500,
        frequency: 'Monthly',
        nextPayment: '2025-05-20',
        status: 'active' as const,
        avatar: 'TS',
        color: 'purple'
      }
    ],
    pending: [
      {
        id: 4,
        client: 'Sarah Johnson',
        service: 'Garden Landscaping',
        amount: 1200,
        frequency: 'One-time',
        nextPayment: '2025-05-25',
        status: 'pending' as const,
        avatar: 'SJ',
        color: 'orange'
      }
    ],
    completed: [
      {
        id: 5,
        client: 'Mike Wilson',
        service: 'Home Repairs',
        amount: 800,
        frequency: 'One-time',
        nextPayment: 'Completed',
        status: 'completed' as const,
        avatar: 'MW',
        color: 'gray'
      },
      {
        id: 6,
        client: 'Lisa Chen',
        service: 'Event Photography',
        amount: 600,
        frequency: 'One-time',
        nextPayment: 'Completed',
        status: 'completed' as const,
        avatar: 'LC',
        color: 'gray'
      }
    ]
  };

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case 'active': return { text: '#059669', bg: '#D1FAE5' };
      case 'pending': return { text: '#D97706', bg: '#FED7AA' };
      case 'completed': return { text: '#6B7280', bg: '#F3F4F6' };
      default: return { text: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const getAvatarColor = (color: string): string => {
    const colors: Record<string, string> = {
      green: '#10B981',
      blue: '#3B82F6',
      purple: '#8B5CF6',
      orange: '#F59E0B',
      gray: '#6B7280'
    };
    return colors[color] || colors.gray;
  };

  interface ContractCardProps {
    contract: Contract;
  }

  const ContractCard: React.FC<ContractCardProps> = ({ contract }) => (
    <View style={styles.contractCard}>
      <View style={styles.contractHeader}>
        <View style={styles.contractLeft}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(contract.color) }]}>
            <Text style={styles.avatarText}>{contract.avatar}</Text>
          </View>
          <View style={styles.contractInfo}>
            <Text style={styles.clientName}>{contract.client}</Text>
            <Text style={styles.serviceName}>{contract.service}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(contract.status).bg }]}>
          <Text style={[styles.statusText, { color: getStatusColor(contract.status).text }]}>
            {contract.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.contractDetails}>
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <DollarSign width={16} height={16} color="#6B7280" opacity={0.5} />
          </View>
          <Text style={styles.detailValue}>{formatCurrency(contract.amount)}</Text>
          <Text style={styles.detailLabel}>{contract.frequency}</Text>
        </View>
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Calendar width={16} height={16} color="#6B7280" opacity={0.5} />
          </View>
          <Text style={styles.detailValue}>
            {contract.nextPayment === 'Completed' ? 'Done' : 
             new Date(contract.nextPayment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
          <Text style={styles.detailLabel}>
            {contract.nextPayment === 'Completed' ? 'Completed' : 'Next payment'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <FileText width={16} height={16} color="#6B7280" opacity={0.5} />
          </View>
          <TouchableOpacity>
            <Text style={styles.viewButton}>View</Text>
          </TouchableOpacity>
          <Text style={styles.detailLabel}>Contract</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contracts</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus width={16} height={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search width={16} height={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="Search contracts..."
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter width={16} height={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'active', label: 'Active', count: contracts.active.length },
            { key: 'pending', label: 'Pending', count: contracts.pending.length },
            { key: 'completed', label: 'Completed', count: contracts.completed.length }
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
        {contracts[activeTab].length === 0 ? (
          <View style={styles.emptyState}>
            <FileText width={48} height={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No {activeTab} contracts</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active' && "You don't have any active contracts yet."}
              {activeTab === 'pending' && "No contracts are pending review."}
              {activeTab === 'completed' && "No completed contracts to show."}
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Create Contract</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{contracts[activeTab].length}</Text>
                <Text style={styles.statLabel}>{activeTab}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatCurrency(contracts[activeTab].reduce((sum, contract) => sum + contract.amount, 0))}
                </Text>
                <Text style={styles.statLabel}>Total Value</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {contracts[activeTab].filter(c => c.frequency === 'Monthly').length}
                </Text>
                <Text style={styles.statLabel}>Recurring</Text>
              </View>
            </View>

            {contracts[activeTab].map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
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
    backgroundColor: '#10B981',
    padding: 8,
    borderRadius: 8,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#059669',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
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
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  contractCard: {
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
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contractLeft: {
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
  contractInfo: {
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  contractDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewButton: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
  },
});