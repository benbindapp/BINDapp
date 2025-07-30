import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Bell,
  Check,
  Edit,
  FileText,
  Home,
  MessageCircle,
  Plus,
  QrCode,
  Settings,
  Star,
  User,
  UserPlus,
  Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ProfilePage: React.FC = () => {
  const [showQR, setShowQR] = useState<boolean>(false);

  const router = useRouter()

  const toggleQR = (): void => {
    setShowQR(!showQR);
  };

  const handleEditBio = (): void => {
    Alert.alert('Edit Bio', 'Edit bio functionality');
  };

  const handleEditCertifications = (): void => {
    Alert.alert('Edit Certifications', 'Edit certifications functionality');
  };

  const handleAddPhoto = (): void => {
    Alert.alert('Add Photo', 'Add photo functionality');
  };

  const handleAddFriend = (): void => {
    Alert.alert('Add Friend', 'Add friend functionality');
  };

  const handleNotifications = (): void => {
    Alert.alert('Notifications', 'View notifications');
  };

  const handleSettings = (): void => {
    Alert.alert('Settings', 'Open settings');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#f0fdf4', '#ecfdf5', '#f0fdfa']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Subtle background pattern */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.backgroundCircle, styles.circle1]} />
        <View style={[styles.backgroundCircle, styles.circle2]} />
        <View style={[styles.backgroundCircle, styles.circle3]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={styles.topButtons}>
              <TouchableOpacity style={styles.topButton} onPress={toggleQR}>
                <QrCode width={24} height={24} color="#374151" />
              </TouchableOpacity>
              <View style={styles.rightButtons}>
                <TouchableOpacity style={styles.topButton} onPress={handleNotifications}>
                  <Bell width={20} height={20} color="#374151" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton} onPress={() => router.push('homepages/settings')}>
                  <Settings width={20} height={20} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Centered Avatar and Info */}
            <View style={styles.avatarSection}>
              <LinearGradient
                colors={['#4ade80', '#10b981', '#14b8a6']}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>CN</Text>
              </LinearGradient>
              <View style={styles.userInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>Colin Normile</Text>
                  <View style={styles.verificationBadge}>
                    <Check width={12} height={12} color="white" strokeWidth={3} />
                  </View>
                </View>
                <Text style={styles.userHandle}>@colin-normile</Text>
              </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statContent}>
                  <Star width={20} height={20} color="#eab308" fill="#eab308" />
                  <Text style={styles.statValue}>9.2/10</Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statContent}>
                  <Users width={20} height={20} color="#374151" />
                  <Text style={styles.statValue}>12 Friends</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Add Friend Bar */}
            <TouchableOpacity onPress={handleAddFriend}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.addFriendButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.addFriendContent}>
                  <UserPlus width={20} height={20} color="white" />
                  <Text style={styles.addFriendText}>Add Friend</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Bio Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Bio:</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEditBio}>
                  <Edit width={16} height={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <Text style={styles.bioText}>
                Hi everyone, I'm Colin! I live in Charleston, SC. I'm focussed on building my real estate career, working as an agent and also investing into properties. Please reach out if you have any questions!
              </Text>
            </View>

            {/* Certifications Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Certifications:</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEditCertifications}>
                  <Edit width={16} height={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.certificationsContainer}>
                <View style={styles.certificationItem}>
                  <View style={[styles.bullet, { backgroundColor: '#10b981' }]} />
                  <Text style={styles.certificationText}>Licensed Real Estate Agent in SC</Text>
                </View>
                <View style={styles.certificationItem}>
                  <View style={[styles.bullet, { backgroundColor: '#059669' }]} />
                  <Text style={styles.certificationText}>Licensed Real Estate Agent in VA</Text>
                </View>
              </View>
            </View>

            {/* Photo Gallery Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Photo Gallery:</Text>
                <TouchableOpacity onPress={handleAddPhoto}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.addPhotoButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Plus width={16} height={16} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <LinearGradient
                colors={['#f9fafb', '#f3f4f6']}
                style={styles.photoGallery}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.noPhotosText}>No photos yet</Text>
              </LinearGradient>
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

          <TouchableOpacity style={styles.centerNavButton} onPress={() => router.push('/homepages/createcontract/search')}>
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push('homepages/messages')}>
            <MessageCircle size={24} color="#9ca3af" />
            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <User size={24} color="#22c55e" />
            <Text style={[styles.navLabel, styles.activeNavLabel]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* QR Code Modal */}
      <Modal
        visible={showQR}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQR(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowQR(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.qrCodeContainer}>
              <QrCode width={96} height={96} color="#9ca3af" />
            </View>
            <Text style={styles.qrCodeLabel}>Colin's QR Code</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundPattern: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.3,
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 100,
  },
  circle1: {
    top: 80,
    left: 40,
    width: 128,
    height: 128,
    backgroundColor: '#bbf7d0',
  },
  circle2: {
    top: 240,
    right: 64,
    width: 96,
    height: 96,
    backgroundColor: '#a7f3d0',
  },
  circle3: {
    bottom: 160,
    left: 80,
    width: 112,
    height: 112,
    backgroundColor: '#99f6e4',
  },
  safeArea: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  topButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  verificationBadge: {
    width: 20,
    height: 20,
    backgroundColor: '#10b981',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  userHandle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    gap: 8,
  },
  addFriendButton: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#16a34a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  addFriendContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addFriendText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  editButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  certificationsContainer: {
    gap: 12,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  certificationText: {
    fontSize: 14,
    color: '#374151',
  },
  addPhotoButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  photoGallery: {
    height: 96,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  noPhotosText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  qrCodeContainer: {
    width: 192,
    height: 192,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  qrCodeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});

export default ProfilePage;