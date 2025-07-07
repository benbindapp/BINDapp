import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Home,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  User,
} from 'react-native-feather';

type CurrentPage = 'home' | 'manage' | 'messages' | 'profile';

export default function ManagementPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<CurrentPage>('manage');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  interface NavButtonProps {
    page: CurrentPage;
    label: string;
    icon: React.ReactNode;
    onPress: () => void;
  }

  const NavButton: React.FC<NavButtonProps> = ({ page, label, icon, onPress }) => (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      {icon}
      <Text style={[styles.navText, currentPage === page && styles.navTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const BottomNav: React.FC = () => (
    <View style={styles.bottomNav}>
      <View style={styles.bottomNavContainer}>
        <NavButton
          page="home"
          label="Home"
          icon={<Home width={24} height={24} color={currentPage === 'home' ? '#10B981' : '#9CA3AF'} />}
          onPress={() => router.push('/homepages/home')}
        />
        <NavButton
          page="manage"
          label="Manage"
          icon={<FileText width={24} height={24} color={currentPage === 'manage' ? '#10B981' : '#9CA3AF'} />}
          onPress={() => setCurrentPage('manage')}
        />
        <TouchableOpacity style={styles.createButton}>
          <Plus width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <NavButton
          page="messages"
          label="Messages"
          icon={<MessageCircle width={24} height={24} color={currentPage === 'messages' ? '#10B981' : '#9CA3AF'} />}
          onPress={() => router.push('/homepages/messages')}
        />
        <NavButton
          page="profile"
          label="Profile"
          icon={<User width={24} height={24} color={currentPage === 'profile' ? '#10B981' : '#9CA3AF'} />}
          onPress={() => router.push('/homepages/profile')}
        />
      </View>
    </View>
  );

  interface ManageButtonProps {
    title: string;
    subtitle: string;
    iconColor: string;
    backgroundColor: string;
    icon: React.ReactNode;
    onPress: () => void;
  }

  const ManageButton: React.FC<ManageButtonProps> = ({
    title,
    subtitle,
    iconColor,
    backgroundColor,
    icon,
    onPress
  }) => (
    <TouchableOpacity style={styles.manageButton} onPress={onPress}>
      <View style={styles.manageButtonContent}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor }]}>
            {React.cloneElement(icon as React.ReactElement, {
              width: 24,
              height: 24,
              color: iconColor,
              opacity: 0.5
            })}
          </View>
        </View>
        <View style={styles.manageButtonText}>
          <Text style={styles.manageButtonTitle}>{title}</Text>
          <Text style={styles.manageButtonSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Text style={styles.chevron}></Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Search width={24} height={24} color="#9CA3AF" opacity={0.5} />
          <Text style={styles.headerTitle}>Manage</Text>
          <View style={styles.profileIcon}>
            <User width={20} height={20} color="#6B7280" />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.taxSummaryCard}>
            <Text style={styles.taxSummaryTitle}>Tax Summary 2025</Text>
            <View style={styles.taxGrid}>
              <View style={styles.taxItem}>
                <Text style={styles.taxLabel}>Total Income</Text>
                <Text style={styles.taxValue}>$28,500</Text>
              </View>
              <View style={styles.taxItem}>
                <Text style={styles.taxLabel}>Tax Savings</Text>
                <Text style={styles.taxValue}>$1,915</Text>
              </View>
              <View style={styles.taxItem}>
                <Text style={styles.taxLabel}>Deductions</Text>
                <Text style={styles.taxValueSmall}>$5,000</Text>
              </View>
              <View style={styles.taxItem}>
                <Text style={styles.taxLabel}>Next Payment</Text>
                <Text style={styles.taxValueSmall}>$1,786</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.taxButton}
              onPress={() => router.push('/homepages/manage/tax-dashboard')}
            >
              <Text style={styles.taxButtonText}>View Full Tax Dashboard</Text>
            </TouchableOpacity>
          </View>

          <ManageButton
            title="Contracts"
            subtitle="3 active contracts"
            iconColor="#2563EB"
            backgroundColor="#DBEAFE"
            icon={<FileText />}
            onPress={() => router.push('/homepages/manage/contracts')}
          />

          <ManageButton
            title="Payments Sent"
            subtitle="$5,300 this month"
            iconColor="#DC2626"
            backgroundColor="#FEE2E2"
            icon={<ArrowUp />}
            onPress={() => router.push('/homepages/manage/payments-sent')}
          />

          <ManageButton
            title="Payments Received"
            subtitle="$28,500 this year"
            iconColor="#059669"
            backgroundColor="#D1FAE5"
            icon={<ArrowDown />}
            onPress={() => router.push('/homepages/manage/payments-received')}
          />

          <ManageButton
            title="Recurring Payments"
            subtitle="4 active subscriptions"
            iconColor="#EA580C"
            backgroundColor="#FED7AA"
            icon={<RefreshCw />}
            onPress={() => router.push('/homepages/manage/recurring-payments')}
          />
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 96,
  },
  taxSummaryCard: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taxSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  taxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  taxItem: {
    width: '48%',
    marginBottom: 16,
  },
  taxLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  taxValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  taxValueSmall: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  taxButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  taxButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  manageButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageButtonText: {
    flex: 1,
  },
  manageButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  manageButtonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  chevron: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  navTextActive: {
    color: '#10B981',
  },
  createButton: {
    width: 48,
    height: 48,
    backgroundColor: '#10B981',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});