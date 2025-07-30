// App.tsx - Main App Component (Page 1)
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Filter,
  Folder,
  FolderPlus,
  Plus,
  Search
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Types.ts - Interface Definitions (Page 2)
export interface Project {
  name: string;
  type: string;
  id: string;
  contracts: number;
  value: string;
}

export interface Contract {
  name: string;
  service: string;
  amount: string;
  status: 'active' | 'pending' | 'completed' | 'recurring';
  project: string;
}

export type CurrentView = 'main' | 'vanderhorst' | 'mike-ock';
export type TabType = 'projects' | 'active' | 'pending' | 'completed';

// Data.ts - Search Data and Utils (Page 3)
export const searchData = {
  projects: [
    { name: '1234 Vanderhorst St', type: 'Custom Home Construction', id: 'vanderhorst', contracts: 8, value: '$485,000' },
    { name: '567 King Street', type: 'Kitchen Renovation', id: 'king-street', contracts: 4, value: '$75,500' },
    { name: '890 Meeting Street', type: 'Historic Home Restoration', id: 'meeting-street', contracts: 4, value: '$320,000' },
    { name: 'Mike Ock Aviation Services', type: 'Private Pilot Services', id: 'mike-ock', contracts: 6, value: '$45,000' }
  ],
  contracts: [
    // Main contracts
    { name: 'Josh Peters', service: 'Apartment Rent Collection', amount: '$1,700', status: 'active' as const, project: 'main' },
    { name: 'Anna Smith', service: 'Weekly Cleaning Service', amount: '$300', status: 'active' as const, project: 'main' },
    { name: 'Tech Solutions Inc', service: 'Website Maintenance', amount: '$500', status: 'active' as const, project: 'main' },
    { name: 'Mike Wilson', service: 'Home Inspection', amount: '$450', status: 'active' as const, project: 'main' },
    { name: 'Lisa Chen', service: 'Legal Consultation', amount: '$800', status: 'active' as const, project: 'main' },
    { name: 'Sarah Johnson', service: 'Garden Landscaping', amount: '$1,200', status: 'pending' as const, project: 'main' },
    { name: 'David Brown', service: 'Monthly Marketing Services', amount: '$750', status: 'pending' as const, project: 'main' },
    
    // Vanderhorst project contracts
    { name: 'Elite Electric Co', service: 'Electrical Installation', amount: '$45,000', status: 'active' as const, project: 'vanderhorst' },
    { name: 'Charleston Cabinets', service: 'Custom Kitchen Cabinets', amount: '$28,500', status: 'active' as const, project: 'vanderhorst' },
    { name: 'Artisan Glass Works', service: 'Window Installation', amount: '$15,200', status: 'active' as const, project: 'vanderhorst' },
    { name: 'Premier Plumbing', service: 'Plumbing Systems', amount: '$32,000', status: 'pending' as const, project: 'vanderhorst' },
    { name: 'Coastal HVAC', service: 'Climate Control Systems', amount: '$18,500', status: 'pending' as const, project: 'vanderhorst' },
    { name: 'Foundation Masters', service: 'Foundation Work', amount: '$85,000', status: 'completed' as const, project: 'vanderhorst' },
    { name: 'Timber Frame Co', service: 'Framing & Structure', amount: '$125,000', status: 'completed' as const, project: 'vanderhorst' },
    { name: 'Roofing Pros', service: 'Roof Installation', amount: '$42,000', status: 'completed' as const, project: 'vanderhorst' },
    
    // Mike Ock contracts
    { name: 'Mike Ock', service: 'Monthly Flight Training', amount: '$3,500', status: 'active' as const, project: 'mike-ock' },
    { name: 'Mike Ock', service: 'Cross-Country Flight', amount: '$1,200', status: 'active' as const, project: 'mike-ock' },
    { name: 'Mike Ock', service: 'Instrument Rating Training', amount: '$8,500', status: 'pending' as const, project: 'mike-ock' },
    { name: 'Mike Ock', service: 'Private Pilot License Training', amount: '$12,000', status: 'completed' as const, project: 'mike-ock' },
    { name: 'Mike Ock', service: 'Solo Flight Certification', amount: '$2,500', status: 'completed' as const, project: 'mike-ock' },
    { name: 'Mike Ock', service: 'Night Flying Endorsement', amount: '$1,800', status: 'completed' as const, project: 'mike-ock' }
  ]
};

export const getAvatarColor = (name: string): string => {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#6B7280', '#6366F1', '#14B8A6', '#EC4899'];
  const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

export const getProjectName = (projectId: string): string => {
  const projectNames: Record<string, string> = {
    'main': 'General Contracts',
    'vanderhorst': '1234 Vanderhorst St',
    'king-street': '567 King Street',
    'meeting-street': '890 Meeting Street',
    'mike-ock': 'Mike Ock Aviation'
  };
  return projectNames[projectId] || 'Unknown Project';
};

// Components/Avatar.tsx (Page 4)
interface AvatarProps {
  name: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 48 }) => {
  const backgroundColor = getAvatarColor(name);
  const initials = getInitials(name);
  
  return (
    <View style={[styles.avatar, { 
      backgroundColor, 
      width: size, 
      height: size,
      borderRadius: size * 0.33 
    }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.29 }]}>
        {initials}
      </Text>
    </View>
  );
};

// Components/StatusBadge.tsx
interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#D1FAE5', color: '#059669' };
      case 'recurring':
        return { backgroundColor: '#EDE9FE', color: '#7C3AED' };
      case 'pending':
        return { backgroundColor: '#FED7AA', color: '#D97706' };
      case 'completed':
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
      <Text style={[styles.statusText, { color: statusStyle.color }]}>
        {status}
      </Text>
    </View>
  );
};

// Components/ContractCard.tsx (Page 5)
interface ContractCardProps {
  contract: Contract;
  isPending?: boolean;
  onFolderPress?: () => void;
  showActions?: boolean;
}

export const ContractCard: React.FC<ContractCardProps> = ({ 
  contract, 
  isPending = false, 
  onFolderPress,
  showActions = false 
}) => {
  return (
    <View style={styles.contractCard}>
      <View style={styles.contractHeader}>
        <View style={styles.contractLeft}>
          <Avatar name={contract.name} />
          <View style={styles.contractInfo}>
            <Text style={styles.clientName}>{contract.name}</Text>
            <Text style={styles.serviceName}>{contract.service}</Text>
          </View>
        </View>
        <StatusBadge status={contract.status} />
      </View>
      
      <View style={styles.contractDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>{contract.amount}</Text>
          <Text style={styles.detailLabel}>Amount</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>
            {contract.status === 'recurring' ? 'Monthly' : 'One-time'}
          </Text>
          <Text style={styles.detailLabel}>Type</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>May 22</Text>
          <Text style={styles.detailLabel}>Due Date</Text>
        </View>
      </View>

      {isPending ? (
        <View style={styles.contractActions}>
          <TouchableOpacity style={styles.viewButtonPending}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.folderButton} onPress={onFolderPress}>
            <FolderPlus size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      )}
      
      {showActions && (
        <View style={styles.folderActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('New Project')}>
            <Text style={styles.actionButtonText}>New Project</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Move To')}>
            <Text style={styles.actionButtonText}>Move To</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Components/ProjectFolder.tsx (Page 6)
interface ProjectFolderProps {
  project: Project;
  onPress: () => void;
}

export const ProjectFolder: React.FC<ProjectFolderProps> = ({ project, onPress }) => {
  return (
    <TouchableOpacity style={styles.projectFolder} onPress={onPress}>
      <View style={styles.projectHeader}>
        <View style={[styles.folderIcon, { backgroundColor: project.id === 'mike-ock' ? '#3B82F6' : '#F59E0B' }]}>
          <Folder size={20} color="white" />
        </View>
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.projectSubtitle}>{project.type}</Text>
        </View>
      </View>
      
      <View style={styles.projectStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{project.contracts}</Text>
          <Text style={styles.statLabel}>Contracts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{project.value}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>Active</Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Components/TabBar.tsx
interface TabBarProps {
  tabs: { key: TabType; title: string; count: number }[];
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabPress }) => {
  return (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
            onPress={() => onTabPress(tab.key)}
          >
            <Text style={[
              styles.tabText, 
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.title} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Main App Component (Page 7)
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('main');
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    projects: Project[];
    contracts: Contract[];
  }>({ projects: [], contracts: [] });
  const [showFolderActions, setShowFolderActions] = useState<number | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const lowerQuery = query.toLowerCase();
      
      const matchingProjects = searchData.projects.filter(project => 
        project.name.toLowerCase().includes(lowerQuery) || 
        project.type.toLowerCase().includes(lowerQuery)
      );
      
      const matchingContracts = searchData.contracts.filter(contract => 
        contract.name.toLowerCase().includes(lowerQuery) || 
        contract.service.toLowerCase().includes(lowerQuery)
      );
      
      setSearchResults({ projects: matchingProjects, contracts: matchingContracts });
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const getTabsForView = () => {
    switch (currentView) {
      case 'vanderhorst':
        return [
          { key: 'active' as TabType, title: 'Active', count: 3 },
          { key: 'pending' as TabType, title: 'Pending', count: 2 },
          { key: 'completed' as TabType, title: 'Completed', count: 3 },
        ];
      case 'mike-ock':
        return [
          { key: 'active' as TabType, title: 'Active', count: 2 },
          { key: 'pending' as TabType, title: 'Pending', count: 1 },
          { key: 'completed' as TabType, title: 'Completed', count: 3 },
        ];
      default:
        return [
          { key: 'projects' as TabType, title: 'Projects', count: 4 },
          { key: 'active' as TabType, title: 'Active', count: 5 },
          { key: 'pending' as TabType, title: 'Pending', count: 2 },
          { key: 'completed' as TabType, title: 'Completed', count: 0 },
        ];
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'vanderhorst':
        return '1234 Vanderhorst St';
      case 'mike-ock':
        return 'Mike Ock Aviation Services';
      default:
        return 'Contracts';
    }
  };

  const getContractsForCurrentView = (status: string) => {
    return searchData.contracts.filter(contract => 
      contract.project === currentView && contract.status === status
    );
  };

  const getMainContracts = (status: string) => {
    return searchData.contracts.filter(contract => 
      contract.project === 'main' && contract.status === status
    );
  };

  const router = useRouter()


  const handleProjectPress = (projectId: string) => {
    if (projectId === 'vanderhorst' || projectId === 'mike-ock') {
      setCurrentView(projectId as CurrentView);
      setActiveTab('active');
    }
  };

  const renderContent = () => {
    if (showSearchResults) {
      return (
        <ScrollView style={styles.content}>
          {searchResults.projects.length > 0 && (
            <View style={styles.searchSection}>
              <Text style={styles.searchSectionTitle}>Projects</Text>
              {searchResults.projects.map((project, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchItem}
                  onPress={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                    handleProjectPress(project.id);
                  }}
                >
                  <View style={styles.searchItemHeader}>
                    <View style={[styles.searchItemIcon, { backgroundColor: '#F59E0B' }]}>
                      <Folder size={16} color="white" />
                    </View>
                    <View style={styles.searchItemInfo}>
                      <Text style={styles.searchItemName}>{project.name}</Text>
                      <Text style={styles.searchItemType}>{project.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.searchItemMeta}>
                    {project.contracts} contracts • {project.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {searchResults.contracts.length > 0 && (
            <View style={styles.searchSection}>
              <Text style={styles.searchSectionTitle}>Contracts</Text>
              {searchResults.contracts.map((contract, index) => (
                <View key={index} style={styles.searchItem}>
                  <View style={styles.searchItemHeader}>
                    <Avatar name={contract.name} size={32} />
                    <View style={styles.searchItemInfo}>
                      <Text style={styles.searchItemName}>{contract.name}</Text>
                      <Text style={styles.searchItemType}>{contract.service}</Text>
                    </View>
                  </View>
                  <Text style={styles.searchItemMeta}>
                    {contract.amount} • {contract.status} • {getProjectName(contract.project)}
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          {searchResults.projects.length === 0 && searchResults.contracts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No results found for "{searchQuery}"
              </Text>
            </View>
          )}
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.content}>
        {activeTab === 'projects' && currentView === 'main' && (
          <>
            {searchData.projects.map((project, index) => (
              <ProjectFolder
                key={index}
                project={project}
                onPress={() => handleProjectPress(project.id)}
              />
            ))}
          </>
        )}

        {activeTab === 'active' && (
          <>
            {currentView === 'main' 
              ? getMainContracts('active').map((contract, index) => (
                  <ContractCard key={index} contract={contract} />
                ))
              : getContractsForCurrentView('active').map((contract, index) => (
                  <ContractCard key={index} contract={contract} />
                ))
            }
          </>
        )}

        {activeTab === 'pending' && (
          <>
            {currentView === 'main' 
              ? getMainContracts('pending').map((contract, index) => (
                  <ContractCard 
                    key={index} 
                    contract={contract} 
                    isPending={true}
                    showActions={showFolderActions === index}
                    onFolderPress={() => setShowFolderActions(showFolderActions === index ? null : index)}
                  />
                ))
              : getContractsForCurrentView('pending').map((contract, index) => (
                  <ContractCard 
                    key={index} 
                    contract={contract} 
                    isPending={true}
                    showActions={showFolderActions === index}
                    onFolderPress={() => setShowFolderActions(showFolderActions === index ? null : index)}
                  />
                ))
            }
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {currentView === 'main' ? (
              <View style={styles.emptyState}>
                <Folder size={64} color="#9CA3AF" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyStateTitle}>All Completed Contracts</Text>
                <Text style={styles.emptyStateText}>are organized within their project folders.</Text>
              </View>
            ) : (
              getContractsForCurrentView('completed').map((contract, index) => (
                <ContractCard key={index} contract={contract} />
              ))
            )}
          </>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getPageTitle()}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contracts..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      {!showSearchResults && (
        <TabBar
          tabs={getTabsForView()}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      )}

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

// Styles.ts (Page 8)
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
    paddingVertical: 0,
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
    paddingHorizontal: 20,
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
  content: {
    flex: 1,
    padding: 20,
  },
  contractCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
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
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  viewButton: {
    width: '100%',
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewButtonPending: {
    flex: 1,
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  contractActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderActions: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    marginBottom: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  projectFolder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  folderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  projectSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchSection: {
    marginBottom: 24,
  },
  searchSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    paddingLeft: 4,
  },
  searchItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchItemInfo: {
    flex: 1,
  },
  searchItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  searchItemType: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchItemMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default App;

// Additional files needed:

// package.json dependencies to add:
/*
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "lucide-react-native": "^0.263.1",
    "react-native-svg": "^13.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.72.0",
    "typescript": "^5.0.0"
  }
}
*/

// metro.config.js
/*
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
*/

// Installation commands:
/*
npm install lucide-react-native react-native-svg
cd ios && pod install (for iOS)
*/

// Additional Components that could be split into separate files:

// Components/SearchResults.tsx (Page 9)
/*
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Folder } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { Project, Contract } from '../types';

interface SearchResultsProps {
  projects: Project[];
  contracts: Contract[];
  query: string;
  onProjectPress: (projectId: string) => void;
  getProjectName: (projectId: string) => string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  projects,
  contracts,
  query,
  onProjectPress,
  getProjectName
}) => {
  if (projects.length === 0 && contracts.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          No results found for "{query}"
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.content}>
      {projects.length > 0 && (
        <View style={styles.searchSection}>
          <Text style={styles.searchSectionTitle}>Projects</Text>
          {projects.map((project, index) => (
            <TouchableOpacity
              key={index}
              style={styles.searchItem}
              onPress={() => onProjectPress(project.id)}
            >
              <View style={styles.searchItemHeader}>
                <View style={[styles.searchItemIcon, { backgroundColor: '#F59E0B' }]}>
                  <Folder size={16} color="white" />
                </View>
                <View style={styles.searchItemInfo}>
                  <Text style={styles.searchItemName}>{project.name}</Text>
                  <Text style={styles.searchItemType}>{project.type}</Text>
                </View>
              </View>
              <Text style={styles.searchItemMeta}>
                {project.contracts} contracts • {project.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {contracts.length > 0 && (
        <View style={styles.searchSection}>
          <Text style={styles.searchSectionTitle}>Contracts</Text>
          {contracts.map((contract, index) => (
            <View key={index} style={styles.searchItem}>
              <View style={styles.searchItemHeader}>
                <Avatar name={contract.name} size={32} />
                <View style={styles.searchItemInfo}>
                  <Text style={styles.searchItemName}>{contract.name}</Text>
                  <Text style={styles.searchItemType}>{contract.service}</Text>
                </View>
              </View>
              <Text style={styles.searchItemMeta}>
                {contract.amount} • {contract.status} • {getProjectName(contract.project)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};
*/

// Screens/ProjectDetailScreen.tsx (Page 10)
/*
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { TabBar } from '../Components/TabBar';
import { ContractCard } from '../Components/ContractCard';
import { CurrentView, TabType, Contract } from '../types';

interface ProjectDetailScreenProps {
  projectId: CurrentView;
  contracts: Contract[];
  onBack: () => void;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  projectId,
  contracts,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const getProjectTitle = () => {
    switch (projectId) {
      case 'vanderhorst':
        return '1234 Vanderhorst St';
      case 'mike-ock':
        return 'Mike Ock Aviation Services';
      default:
        return 'Project Details';
    }
  };

  const getTabs = () => {
    const activeCount = contracts.filter(c => c.status === 'active').length;
    const pendingCount = contracts.filter(c => c.status === 'pending').length;
    const completedCount = contracts.filter(c => c.status === 'completed').length;

    return [
      { key: 'active' as TabType, title: 'Active', count: activeCount },
      { key: 'pending' as TabType, title: 'Pending', count: pendingCount },
      { key: 'completed' as TabType, title: 'Completed', count: completedCount },
    ];
  };

  const getFilteredContracts = () => {
    return contracts.filter(contract => contract.status === activeTab);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getProjectTitle()}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={16} color="white" />
        </TouchableOpacity>
      </View>

      <TabBar
        tabs={getTabs()}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      <ScrollView style={styles.content}>
        {getFilteredContracts().map((contract, index) => (
          <ContractCard
            key={index}
            contract={contract}
            isPending={activeTab === 'pending'}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
*/

