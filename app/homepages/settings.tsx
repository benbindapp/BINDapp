import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Building2,
  ChevronRight,
  CreditCard,
  FileCheck,
  FileText,
  Fingerprint,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  MessageCircle,
  Receipt,
  Shield,
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
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Type definitions
interface SettingsItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

interface ToggleProps {
  enabled: boolean;
  onToggle?: (enabled: boolean) => void;
}

interface ToggleStates {
  twoFactor: boolean;
  biometric: boolean;
  notifications: boolean;
}

const { width } = Dimensions.get('window');

const BindSettings: React.FC = () => {
  const [toggleStates, setToggleStates] = useState<ToggleStates>({
    twoFactor: true,
    biometric: false,
    notifications: true,
  });

  const handleToggle = (key: keyof ToggleStates): void => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAccountInfo = (): void => {
    Alert.alert('Account Information', 'Navigate to account information');
  };

  const handleBusinessProfile = (): void => {
    Alert.alert('Business Profile', 'Navigate to business profile');
  };

  const handleChangePassword = (): void => {
    Alert.alert('Change Password', 'Navigate to change password');
  };

  const handlePaymentMethods = (): void => {
    Alert.alert('Payment Methods', 'Navigate to payment methods');
  };

  const handleBankAccounts = (): void => {
    Alert.alert('Bank Accounts', 'Navigate to bank accounts');
  };

  const handleTaxSettings = (): void => {
    Alert.alert('Tax Settings', 'Navigate to tax settings');
  };

  const handleLanguage = (): void => {
    Alert.alert('Language', 'Select language');
  };

  const handleHelpCenter = (): void => {
    Alert.alert('Help Center', 'Navigate to help center');
  };

  const handleContactSupport = (): void => {
    Alert.alert('Contact Support', 'Navigate to contact support');
  };

  const handleTermsOfService = (): void => {
    Alert.alert('Terms of Service', 'Navigate to terms of service');
  };

  const handleSignOut = (): void => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Signed out') }
    ]);
  };

  const router = useRouter()

  const Toggle: React.FC<ToggleProps> = ({ enabled, onToggle }) => (
    <TouchableOpacity 
      style={[styles.toggle, enabled ? styles.toggleEnabled : styles.toggleDisabled]}
      onPress={() => onToggle?.(!enabled)}
    >
      <View style={[styles.toggleThumb, enabled ? styles.toggleThumbEnabled : styles.toggleThumbDisabled]} />
    </TouchableOpacity>
  );

  const SettingsItem: React.FC<SettingsItemProps> = ({ 
    icon: IconComponent, 
    title, 
    subtitle, 
    rightElement, 
    onPress 
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <IconComponent size={20} color="#6b7280" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightElement}
        <ChevronRight size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={User}
              title="Account Information"
              subtitle="Name, email, phone number"
              onPress={handleAccountInfo}
            />
            <SettingsItem
              icon={FileText}
              title="Business Profile"
              subtitle="Professional information & certifications"
              onPress={handleBusinessProfile}
            />
            <SettingsItem
              icon={Lock}
              title="Change Password"
              subtitle="Update your account password"
              onPress={handleChangePassword}
            />
          </View>
        </View>

        {/* Banking & Payments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BANKING & PAYMENTS</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={CreditCard}
              title="Payment Methods"
              subtitle="Add or remove cards and bank accounts"
              rightElement={<Text style={styles.rightText}>2 cards</Text>}
              onPress={handlePaymentMethods}
            />
            <SettingsItem
              icon={Building2}
              title="Bank Accounts"
              subtitle="Manage linked bank accounts"
              rightElement={<Text style={styles.rightText}>1 account</Text>}
              onPress={handleBankAccounts}
            />
            <SettingsItem
              icon={Receipt}
              title="Tax Settings"
              subtitle="Tax forms and business expenses"
              onPress={handleTaxSettings}
            />
          </View>
        </View>

        {/* Privacy & Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={Shield}
              title="Two-Factor Authentication"
              subtitle="Extra security for your account"
              rightElement={
                <Toggle 
                  enabled={toggleStates.twoFactor} 
                  onToggle={() => handleToggle('twoFactor')} 
                />
              }
            />
            <SettingsItem
              icon={Fingerprint}
              title="Biometric Authentication"
              subtitle="Use fingerprint or Face ID"
              rightElement={
                <Toggle 
                  enabled={toggleStates.biometric} 
                  onToggle={() => handleToggle('biometric')} 
                />
              }
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={Globe}
              title="Language"
              subtitle="English (US)"
              rightElement={<Text style={styles.rightText}>EN</Text>}
              onPress={handleLanguage}
            />
            <SettingsItem
              icon={Bell}
              title="Notifications"
              subtitle="Push notifications and alerts"
              rightElement={
                <Toggle 
                  enabled={toggleStates.notifications} 
                  onToggle={() => handleToggle('notifications')} 
                />
              }
            />
          </View>
        </View>

        {/* Support & Legal Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>SUPPORT & LEGAL</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={HelpCircle}
              title="Help Center"
              subtitle="FAQs and support articles"
              onPress={handleHelpCenter}
            />
            <SettingsItem
              icon={MessageCircle}
              title="Contact Support"
              subtitle="Get help from our team"
              onPress={handleContactSupport}
            />
            <SettingsItem
              icon={FileCheck}
              title="Terms of Service"
              subtitle="Legal terms and conditions"
              onPress={handleTermsOfService}
            />
            <SettingsItem
              icon={LogOut}
              title="Sign Out"
              subtitle=""
              onPress={handleSignOut}
            />
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSpacer: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 100, // Space for bottom nav
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionContent: {
    gap: 8,
  },
  settingsItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightText: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleEnabled: {
    backgroundColor: '#10b981',
  },
  toggleDisabled: {
    backgroundColor: '#d1d5db',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  toggleThumbEnabled: {
    alignSelf: 'flex-end',
  },
  toggleThumbDisabled: {
    alignSelf: 'flex-start',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemCenter: {
    alignItems: 'center',
    padding: 8,
  },
  navLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#10b981',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});

export default BindSettings;

