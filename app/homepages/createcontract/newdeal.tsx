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
  TouchableOpacity,
  View,
} from 'react-native';

interface NewDealProps {
  onClose?: () => void;
  onOptionSelect?: (option: string) => void;
}

export default function NewDeal({ onClose, onOptionSelect }: NewDealProps) {

  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'transaction' | 'agreement'>('transaction');

  const handleDealTypeSelect = (type: 'transaction' | 'agreement') => {
    setSelectedType(type);
  };

  const handleOptionSelect = (option: string) => {
    console.log(`Selected option: ${option}`);
    onOptionSelect?.(option);
  };

  const transactionOptions = [
    {
      id: 'service',
      title: 'Service',
      description: 'Create a service contract that includes payment',
      icon: 'construct-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'sale',
      title: 'Sale',
      description: 'Buy or sell an item with payment',
      icon: 'storefront-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'rent',
      title: 'Rent',
      description: 'Set up a rental agreement with payments',
      icon: 'key-outline' as keyof typeof Ionicons.glyphMap,
    }
  ];

  const agreementOptions = [
    {
      id: 'nda',
      title: 'NDA',
      description: 'Protect confidential info.',
      icon: 'shield-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'partnership',
      title: 'Partnership',
      description: 'Define roles & responsibilities.',
      icon: 'people-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'equity',
      title: 'Equity Agreement',
      description: 'Outline equity splits & vesting terms.',
      icon: 'trending-up-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'option',
      title: 'Option',
      description: 'Grant an exclusive right to purchase later.',
      icon: 'ellipsis-horizontal-outline' as keyof typeof Ionicons.glyphMap,
    }
  ];

  const currentOptions = selectedType === 'transaction' ? transactionOptions : agreementOptions;

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
        {/* Segmented Toggle */}
        <View style={styles.segmentedControl}>
          <View style={styles.segmentedWrapper}>
            <TouchableOpacity
              onPress={() => handleDealTypeSelect('transaction')}
              style={[
                styles.segmentButton,
                selectedType === 'transaction' && styles.segmentButtonActive
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.segmentText,
                selectedType === 'transaction' && styles.segmentTextActive
              ]}>
                Transaction
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDealTypeSelect('agreement')}
              style={[
                styles.segmentButton,
                selectedType === 'agreement' && styles.segmentButtonActive
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.segmentText,
                selectedType === 'agreement' && styles.segmentTextActive
              ]}>
                Agreement
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Option Buttons */}
        <View style={styles.optionsContainer}>
          {currentOptions.map((option) => {
            const isTransaction = selectedType === 'transaction';
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  if (option.id === 'service') {
                    router.push('/homepages/createcontract/service/servicetemplate'); // <--- customize this route
                  }
                  if (option.id === 'sale') {
                    router.push('/homepages/createcontract/sale/saletemplate');
                  }
                  if (option.id === 'rent') {
                    router.push('/homepages/createcontract/rent/renttemplate');
                  }
                  handleOptionSelect(option.id);
                }}
                style={styles.optionButton}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.iconContainer,
                    isTransaction ? styles.greenIconContainer : styles.blueIconContainer
                  ]}>
                    <Ionicons 
                      name={option.icon} 
                      size={24} 
                      color={isTransaction ? '#16A34A' : '#2563EB'} 
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
    paddingHorizontal: 24,
    paddingVertical: 4,
    flex: 1,
  },
  segmentedControl: {
    marginBottom: 32,
  },
  segmentedWrapper: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 4,
    flexDirection: 'row',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  segmentTextActive: {
    color: '#111827',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    height: 128,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenIconContainer: {
    backgroundColor: '#DCFCE7',
  },
  blueIconContainer: {
    backgroundColor: '#DBEAFE',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
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

