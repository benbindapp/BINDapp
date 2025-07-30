import { useRouter } from 'expo-router';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  FileText,
  Home,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  User,
} from 'lucide-react-native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BindManageScreenProps {
  onContractsPress?: () => void;
  onPaymentsSentPress?: () => void;
  onPaymentsReceivedPress?: () => void;
  onRecurringPaymentsPress?: () => void;
  onBusinessSnapshotPress?: () => void;
  onHomePress?: () => void;
  onCreateContractPress?: () => void;
  onMessagesPress?: () => void;
  onProfilePress?: () => void;
}

const BindManageScreen: React.FC<BindManageScreenProps> = ({
  onContractsPress,
  onPaymentsSentPress,
  onPaymentsReceivedPress,
  onRecurringPaymentsPress,
  onBusinessSnapshotPress,
  onHomePress,
  onCreateContractPress,
  onMessagesPress,
  onProfilePress,
}) => {
  const router = useRouter()


  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <Search size={24} color="#9ca3af" />
        <Text style={styles.headerTitle}>Manage</Text>
        <View style={styles.profileButton}>
          <User size={20} color="#6b7280" />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.buttonContainer}>
          {/* Contracts Button */}
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('homepages/manage/contracts')}>
            <View style={styles.buttonContent}>
              <View style={[styles.iconContainer, styles.blueIconBg]}>
                <FileText size={24} color="#2563eb" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>Contracts</Text>
                <Text style={styles.buttonSubtitle}>3 active contracts</Text>
              </View>
            </View>
            <Text style={styles.chevron}></Text>
          </TouchableOpacity>

          {/* Payments Sent Button */}
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('homepages/manage/payments-sent')}>
            <View style={styles.buttonContent}>
              <View style={[styles.iconContainer, styles.redIconBg]}>
                <ArrowUp size={24} color="#dc2626" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>Payments Sent</Text>
                <Text style={styles.buttonSubtitle}>$5,300 this month</Text>
              </View>
            </View>
            <Text style={styles.chevron}></Text>
          </TouchableOpacity>

          {/* Payments Received Button */}
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('homepages/manage/payments-received')}>
            <View style={styles.buttonContent}>
              <View style={[styles.iconContainer, styles.greenIconBg]}>
                <ArrowDown size={24} color="#16a34a" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>Payments Received</Text>
                <Text style={styles.buttonSubtitle}>$28,500 this year</Text>
              </View>
            </View>
            <Text style={styles.chevron}></Text>
          </TouchableOpacity>

          {/* Recurring Payments Button */}
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('homepages/manage/recurring-payments')}>
            <View style={styles.buttonContent}>
              <View style={[styles.iconContainer, styles.orangeIconBg]}>
                <RefreshCw size={24} color="#ea580c" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>Recurring Payments</Text>
                <Text style={styles.buttonSubtitle}>4 active subscriptions</Text>
              </View>
            </View>
            <Text style={styles.chevron}></Text>
          </TouchableOpacity>

          {/* Business Snapshot Button */}
          <TouchableOpacity style={styles.menuButton} onPress={onBusinessSnapshotPress}>
            <View style={styles.buttonContent}>
              <View style={[styles.iconContainer, styles.purpleIconBg]}>
                <BarChart3 size={24} color="#9333ea" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>Business Snapshot</Text>
                <Text style={styles.buttonSubtitle}>View revenue & expenses</Text>
              </View>
            </View>
            <Text style={styles.chevron}></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepages/home')}>
          <Home size={24} color="#9ca3af" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <FileText size={24} color="#22c55e" />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Manage</Text>
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
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingTop: 16,
    gap: 16,
    paddingBottom: 100,
  },
  menuButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  blueIconBg: {
    backgroundColor: '#dbeafe',
  },
  redIconBg: {
    backgroundColor: '#fee2e2',
  },
  greenIconBg: {
    backgroundColor: '#dcfce7',
  },
  orangeIconBg: {
    backgroundColor: '#fed7aa',
  },
  purpleIconBg: {
    backgroundColor: '#ede9fe',
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  chevron: {
    fontSize: 18,
    color: '#9ca3af',
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

export default BindManageScreen;