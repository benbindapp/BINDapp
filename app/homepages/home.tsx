import { useRouter } from 'expo-router';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Calendar,
  FileText,
  Home,
  MessageCircle,
  Plus,
  Search,
  User
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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
interface ActivityItem {
  id: number;
  person: string;
  service: string;
  amount: number;
  type: 'received' | 'sent';
  time: string;
  avatar: string;
}

interface CalendarDay {
  day: string;
  date: number;
  isToday: boolean;
  hasEvents: boolean;
}

interface ActionButtonProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  showAlert?: boolean;
  iconBg: string;
}

interface ActivityCardProps {
  person: string;
  service: string;
  amount: number;
  type: 'received' | 'sent';
  time: string;
  avatar: string;
  isLast?: boolean;
}

const { width } = Dimensions.get('window');

const BindHomepage: React.FC = () => {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Initial activities data
  const initialActivities: ActivityItem[] = [
    {
      id: 1,
      person: "Josh Peters",
      service: "Apartment Rent Payment",
      amount: 1700,
      type: "received",
      time: "2 hours ago",
      avatar: "JP"
    },
    {
      id: 2,
      person: "Anna Smith",
      service: "House Cleaning Service",
      amount: 300,
      type: "sent",
      time: "Yesterday",
      avatar: "AS"
    }
  ];

  // Generate more activities for endless scroll
  const generateMoreActivities = (startId: number): ActivityItem[] => {
    const names = ["Mike Johnson", "Sarah Wilson", "David Brown", "Emma Davis", "Alex Miller", "Lisa Garcia", "Tom Anderson", "Kate Taylor"];
    const services = ["Maintenance Service", "Consulting Fee", "Property Tax", "Insurance Payment", "Utility Bill", "Legal Services", "Design Work", "Equipment Rental"];
    
    return Array.from({ length: 8 }, (_, index) => ({
      id: startId + index,
      person: names[index % names.length],
      service: services[index % services.length],
      amount: Math.floor(Math.random() * 2000) + 100,
      type: Math.random() > 0.5 ? "received" : "sent",
      time: `${Math.floor(Math.random() * 7) + 1} days ago`,
      avatar: names[index % names.length].split(' ').map(n => n[0]).join('')
    }));
  };

  useEffect(() => {
    setActivities(initialActivities);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGreeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const getFormattedDate = (): string => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const days = ['WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE'];
    return days.map((day, index) => ({
      day,
      date: 14 + index,
      isToday: index === 0,
      hasEvents: [1, 4].includes(index)
    }));
  };

  const loadMoreActivities = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setTimeout(() => {
      const newActivities = generateMoreActivities(activities.length + 1);
      setActivities(prevActivities => [...prevActivities, ...newActivities]);
      setLoading(false);
      if (activities.length >= 50) {
        setHasMore(false);
      }
    }, 1000);
  }, [loading, hasMore, activities.length]);

  const ActionButton: React.FC<ActionButtonProps> = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    showAlert = false, 
    iconBg 
  }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      {showAlert && <View style={styles.alertBadge} />}
      
      <View style={styles.actionButtonContent}>
        <View style={[styles.actionIconContainer, { backgroundColor: iconBg }]}>
          {icon}
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
      </View>
      
      <Text style={styles.arrowIcon}>→</Text>
    </TouchableOpacity>
  );

  const ActivityCard: React.FC<ActivityCardProps> = ({ 
    person, 
    service, 
    amount, 
    type, 
    time, 
    avatar,
    isLast 
  }) => {
    const isPositive = type === 'received';
    
    return (
      <View style={styles.activityCard}>
        <View style={styles.activityContent}>
          <View style={[
            styles.activityIconContainer,
            { backgroundColor: isPositive ? '#dcfce7' : '#fee2e2' }
          ]}>
            {isPositive ? (
              <ArrowDownRight width={24} height={24} color="#374151" />
            ) : (
              <ArrowUpRight width={24} height={24} color="#374151" />
            )}
          </View>
          <View style={styles.activityTextContainer}>
            <Text style={styles.activityPerson}>{person}</Text>
            <Text style={styles.activityService}>{service}</Text>
            <Text style={styles.activityTime}>{time}</Text>
          </View>
        </View>
        
        <View style={styles.activityAmountContainer}>
          <Text style={styles.activityAmount}>
            {isPositive ? '+' : '-'}{formatCurrency(amount)}
          </Text>
        </View>
      </View>
    );
  };

  const CalendarDay: React.FC<{ dayData: CalendarDay }> = ({ dayData }) => (
    <TouchableOpacity style={[
      styles.calendarDay,
      dayData.isToday && styles.calendarDayActive
    ]}>
      <Text style={[
        styles.calendarDayText,
        dayData.isToday && styles.calendarDayTextActive
      ]}>
        {dayData.day}
      </Text>
      <Text style={[
        styles.calendarDateText,
        dayData.isToday && styles.calendarDateTextActive
      ]}>
        {dayData.date}
      </Text>
      {dayData.hasEvents && (
        <View style={styles.eventIndicators}>
          {[1, 2, 3].map(dot => (
            <View key={dot} style={styles.eventDot} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderActivity = ({ item, index }: { item: ActivityItem, index: number }) => (
    <ActivityCard
      person={item.person}
      service={item.service}
      amount={item.amount}
      type={item.type}
      time={item.time}
      avatar={item.avatar}
      isLast={index === activities.length - 1}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#10b981" />
      </View>
    );
  };

  const renderEndMessage = () => {
    if (hasMore) return null;
    return (
      <View style={styles.endMessageContainer}>
        <Text style={styles.endMessageText}>No more activities to load</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
    

      {/* Header with Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search width={20} height={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#9ca3af"
          />
        </View>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Bell width={24} height={24} color="#6b7280" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            Good {getGreeting()}, Colin
          </Text>
          <Text style={styles.dateText}>
            {getFormattedDate()}
          </Text>
        </View>

        {/* Calendar Widget */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Today</Text>
            <Calendar width={20} height={20} color="#9ca3af" />
          </View>
          
          <View style={styles.calendarDays}>
            {generateCalendarDays().map((dayData, index) => (
              <CalendarDay key={index} dayData={dayData} />
            ))}
          </View>
        </View>

        {/* Priority Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Actions</Text>
          
          <View style={styles.actionsContainer}>
            <ActionButton
              title="Contract Reviews"
              subtitle="3 contracts pending"
              icon={<FileText width={24} height={24} color="#374151" />}
              iconBg="#dbeafe"
              showAlert={true}
              onPress={() => router.push('homepages/contractreview')}
            />
            
            <ActionButton
              title="Incoming Payments"
              subtitle="1 payment expected"
              icon={<ArrowDownRight width={24} height={24} color="#374151" />}
              iconBg="#dcfce7"
              onPress={() => router.push('homepages/incomingpmnt')}
            />
            
            <ActionButton
              title="Outgoing Payments"
              subtitle="2 payments due today"
              icon={<ArrowUpRight width={24} height={24} color="#374151" />}
              iconBg="#fee2e2"
              onPress={() => router.push('homepages/outgoingpmnt')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <FlatList
            data={activities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMoreActivities}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEndMessage}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
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
    backgroundColor: '#f0fdf4',
  },
  notification: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 50,
  },
  notificationContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  closeButton: {
    fontSize: 24,
    color: '#9ca3af',
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontSize: 16,
    color: '#374151',
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  greetingContainer: {
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#6b7280',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarDay: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 40,
  },
  calendarDayActive: {
    backgroundColor: '#10b981',
    transform: [{ scale: 1.05 }],
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  calendarDayTextActive: {
    color: 'white',
  },
  calendarDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  calendarDateTextActive: {
    color: 'white',
  },
  eventIndicators: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  actionsContainer: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  alertBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    zIndex: 1,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#9ca3af',
    position: 'absolute',
    right: 16,
    top: '50%',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityPerson: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityService: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  activityAmountContainer: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  separator: {
    height: 8,
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  endMessageContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  endMessageText: {
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

export default BindHomepage;