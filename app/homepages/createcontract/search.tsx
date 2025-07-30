import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  FileText,
  Home,
  MessageCircle,
  Plus,
  User
} from 'lucide-react-native';
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
interface Contact {
  id: number;
  name: string;
  username: string;
  avatar: string;
  lastDeal: string;
}

interface WhoAreYouBindingWithProps {
  onClose?: () => void;
  onPersonSelect?: (person: Contact) => void;
  onBusinessSelect?: (business: Contact) => void;
  onSyncContacts?: () => void;
}
export default function SearchPage({
  onClose,
  onPersonSelect,
  onBusinessSelect,
  onSyncContacts,
}: WhoAreYouBindingWithProps) {

  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('');
  const handlePersonSelect = (person: Contact) => {
    console.log(`Selected person: ${person.name}`);
    onPersonSelect?.(person);
  };
  const handleBusinessSelect = (business: Contact) => {
    console.log(`Selected business: ${business.name}`);
    onBusinessSelect?.(business);
  };
  const handleSyncContacts = () => {
    console.log('Sync contacts');
    onSyncContacts?.();
  };
  const topPeople: Contact[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: '@sarah-j',
      avatar: 'SJ',
      lastDeal: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Mike Chen',
      username: '@mike-chen',
      avatar: 'MC',
      lastDeal: '1 month ago'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      username: '@emily-rod',
      avatar: 'ER',
      lastDeal: '3 days ago'
    },
    {
      id: 4,
      name: 'David Kim',
      username: '@david-kim',
      avatar: 'DK',
      lastDeal: '1 week ago'
    }
  ];
  const topBusinesses: Contact[] = [
    {
      id: 1,
      name: 'TechStart Solutions',
      username: '@techstart',
      avatar: 'TS',
      lastDeal: '1 week ago'
    },
    {
      id: 2,
      name: 'Green Building Co.',
      username: '@greenbuild',
      avatar: 'GB',
      lastDeal: '2 months ago'
    },
    {
      id: 3,
      name: 'Creative Agency Plus',
      username: '@creativeplus',
      avatar: 'CA',
      lastDeal: '3 weeks ago'
    }
  ];
  const PersonCard: React.FC<{ person: Contact }> = ({ person }) => (
    <TouchableOpacity
      onPress={() => router.push('homepages/createcontract/newdeal')}
      style={styles.contactCard}
      activeOpacity={0.8}
    >
      <View style={styles.contactContent}>
        <View style={[styles.avatar, styles.blueAvatar]}>
          <Text style={styles.blueAvatarText}>{person.avatar}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{person.name}</Text>
          <Text style={styles.contactUsername}>{person.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  const BusinessCard: React.FC<{ business: Contact }> = ({ business }) => (
    <TouchableOpacity
      onPress={() => handleBusinessSelect(business)}
      style={styles.contactCard}
      activeOpacity={0.8}
    >
      <View style={styles.contactContent}>
        <View style={[styles.avatar, styles.greenAvatar]}>
          <Text style={styles.greenAvatarText}>{business.avatar}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{business.name}</Text>
          <Text style={styles.contactUsername}>{business.username}</Text>
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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
              <Ionicons name="link" size={14} color="white" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Name, @username, phone, or email"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        {/* Sync Contacts */}
        <View style={styles.syncContainer}>
          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleSyncContacts}
            activeOpacity={0.8}
          >
            <View style={styles.syncContent}>
              <View style={styles.syncIcon}>
                <Ionicons name="people-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.syncTextContainer}>
                <Text style={styles.syncTitle}>Sync your contacts</Text>
                <Text style={styles.syncSubtitle}>Easily find people you know.</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Recent Individuals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent individuals</Text>
          <View>
            {topPeople.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </View>
        </View>
        {/* Recent Businesses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent businesses</Text>
          <View>
            {topBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepages/home')}>
          <Home size={24} color="#9ca3af" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
    
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepages/manage/mnghome')}>
          <FileText size={24} color="#9ca3af" />
          <Text style={styles.navLabel}>Manage</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerNavButton}>
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
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerSpacer: {
    width: 40,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flex: 1,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  syncContainer: {
    marginBottom: 24,
  },
  syncButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
  },
  syncContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  syncIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#D1D5DB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncTextContainer: {
    flex: 1,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  syncSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  contactCard: {
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueAvatar: {
    backgroundColor: '#DBEAFE',
  },
  greenAvatar: {
    backgroundColor: '#DCFCE7',
  },
  blueAvatarText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  greenAvatarText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactUsername: {
    fontSize: 14,
    color: '#6B7280',
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

