import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  FileText,
  Home,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  User,
  Video
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Conversation {
  id: number;
  name: string;
  type: 'ai' | 'individual' | 'business';
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  avatar: string;
  pinned?: boolean;
}

const { width, height } = Dimensions.get('window');

const MessagesPage: React.FC = () => {
  const router = useRouter()
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showChatList, setShowChatList] = useState<boolean>(true);
  const [inputHeight, setInputHeight] = useState<number>(48);
  const scrollViewRef = useRef<ScrollView>(null);

  const conversations: Conversation[] = [
    {
      id: 0,
      name: 'BIND AI',
      type: 'ai',
      lastMessage: 'Hi! I\'m here to help you with contracts, business advice, and making the most of BIND. How can I assist you today?',
      timestamp: 'now',
      unread: 0,
      online: true,
      avatar: 'AI',
      pinned: true
    },
    {
      id: 1,
      name: 'Sarah Johnson',
      type: 'individual',
      lastMessage: 'Thanks for sending over the contract details. I\'ll review and get back to you by tomorrow.',
      timestamp: '2:34 PM',
      unread: 2,
      online: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'TechCorp Solutions',
      type: 'business',
      lastMessage: 'The milestone payment has been processed. Please confirm receipt.',
      timestamp: '1:15 PM',
      unread: 0,
      online: false,
      avatar: 'TC'
    },
    {
      id: 3,
      name: 'Alex Chen',
      type: 'individual',
      lastMessage: 'Can we schedule a call to discuss the project timeline?',
      timestamp: '11:22 AM',
      unread: 1,
      online: true,
      avatar: 'AC'
    },
    {
      id: 4,
      name: 'Creative Agency Ltd',
      type: 'business',
      lastMessage: 'The design mockups are ready for your review.',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      avatar: 'CA'
    },
    {
      id: 5,
      name: 'Jennifer Liu',
      type: 'individual',
      lastMessage: 'Perfect! The contract looks good to me.',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      avatar: 'JL'
    },
    {
      id: 6,
      name: 'BuildRight Construction',
      type: 'business',
      lastMessage: 'We\'ll need to adjust the timeline due to weather delays.',
      timestamp: '2 days ago',
      unread: 0,
      online: false,
      avatar: 'BR'
    },
    {
      id: 7,
      name: 'Maria Rodriguez',
      type: 'individual',
      lastMessage: 'Voice call',
      timestamp: '3 days ago',
      unread: 0,
      online: false,
      avatar: 'MR'
    },
    {
      id: 8,
      name: 'Digital Marketing Pro',
      type: 'business',
      lastMessage: 'The campaign results are looking great! ROI is up 40%.',
      timestamp: '4 days ago',
      unread: 0,
      online: false,
      avatar: 'DM'
    },
    {
      id: 9,
      name: 'Robert Kim',
      type: 'individual',
      lastMessage: 'Let\'s finalize the contract terms tomorrow.',
      timestamp: '5 days ago',
      unread: 0,
      online: false,
      avatar: 'RK'
    },
    {
      id: 10,
      name: 'Startup Accelerator',
      type: 'business',
      lastMessage: 'Congratulations on your funding round!',
      timestamp: '1 week ago',
      unread: 0,
      online: false,
      avatar: 'SA'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = (): void => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
      setInputHeight(48);
    }
  };

  const getAvatarColor = (name: string): string => {
    if (name === 'BIND AI') {
      return '#3b82f6'; // Blue for AI (gradient not easily supported in RN)
    }
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#6366f1', '#eab308', '#ef4444', '#14b8a6'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const openChat = (chat: Conversation): void => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  const goBackToList = (): void => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  const scrollToBottom = (): void => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (!showChatList) {
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedChat, showChatList, inputHeight]);

  const renderAIMessage = () => (
    <View style={styles.messageContainer}>
      <View style={styles.aiMessageBubble}>
        <Text style={styles.aiMessageText}>👋 Hi! I'm BIND AI, your business assistant. I can help you with:</Text>
        <View style={styles.aiListContainer}>
          <Text style={styles.aiListItem}>• Contract questions and templates</Text>
          <Text style={styles.aiListItem}>• Business advice and strategy</Text>
          <Text style={styles.aiListItem}>• BIND platform features</Text>
          <Text style={styles.aiListItem}>• Payment and legal guidance</Text>
        </View>
        <Text style={styles.aiMessageText}>What would you like to know?</Text>
        <Text style={styles.aiTimestamp}>Just now</Text>
      </View>
    </View>
  );

  const renderRegularMessages = () => (
    <>
      <View style={[styles.messageContainer, styles.messageLeft]}>
        <View style={styles.messageBubbleLeft}>
          <Text style={styles.messageText}>Hi! I saw your profile and I'm interested in discussing a potential web development project.</Text>
          <Text style={styles.messageTime}>2:30 PM</Text>
        </View>
      </View>
      
      <View style={[styles.messageContainer, styles.messageRight]}>
        <View style={styles.messageBubbleRight}>
          <Text style={styles.messageTextWhite}>Hi Sarah! I'd be happy to discuss your project. What kind of website are you looking to build?</Text>
          <Text style={styles.messageTimeWhite}>2:31 PM</Text>
        </View>
      </View>
      
      <View style={[styles.messageContainer, styles.messageLeft]}>
        <View style={styles.messageBubbleLeft}>
          <Text style={styles.messageText}>I need an e-commerce site for my boutique clothing store. Something modern and mobile-friendly.</Text>
          <Text style={styles.messageTime}>2:32 PM</Text>
        </View>
      </View>
      
      <View style={[styles.messageContainer, styles.messageRight]}>
        <View style={styles.messageBubbleRight}>
          <Text style={styles.messageTextWhite}>That sounds great! I specialize in e-commerce development. I can send you a proposal with timeline and pricing. Would you like me to create a formal contract through BIND?</Text>
          <Text style={styles.messageTimeWhite}>2:33 PM</Text>
        </View>
      </View>
      
      <View style={[styles.messageContainer, styles.messageLeft]}>
        <View style={styles.messageBubbleLeft}>
          <Text style={styles.messageText}>Thanks for sending over the contract details. I'll review and get back to you by tomorrow.</Text>
          <Text style={styles.messageTime}>2:34 PM</Text>
        </View>
      </View>
    </>
  );

  if (showChatList) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Chat List Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Chats</Text>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Search size={16} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              placeholder="Search"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Conversations List */}
        <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
          {filteredConversations.map((conv, index) => (
            <View key={conv.id}>
              <TouchableOpacity
                onPress={() => openChat(conv)}
                style={styles.conversationItem}
                activeOpacity={0.7}
              >
                <View style={styles.conversationContent}>
                  <View style={[styles.avatar, { backgroundColor: getAvatarColor(conv.name) }]}>
                    <Text style={styles.avatarText}>{conv.avatar}</Text>
                  </View>
                  
                  <View style={styles.conversationDetails}>
                    <View style={styles.conversationHeader}>
                      <View style={styles.nameContainer}>
                        <Text style={styles.conversationName}>{conv.name}</Text>
                        {conv.name === 'BIND AI' && (
                          <View style={styles.aiBadge}>
                            <Text style={styles.aiBadgeText}>AI</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.timestampContainer}>
                        <Text style={styles.timestamp}>{conv.timestamp}</Text>
                        {conv.unread > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{conv.unread}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <Text style={styles.lastMessage} numberOfLines={1}>{conv.lastMessage}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              {index < filteredConversations.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
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
  
          <TouchableOpacity style={styles.navItem}>
            <MessageCircle size={24} color="#22c55e" />
            <Text style={[styles.navLabel, styles.activeNavLabel]}>Messages</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('homepages/profile')}>
            <User size={24} color="#9ca3af" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <View style={styles.chatHeaderContent}>
            <TouchableOpacity onPress={goBackToList} style={styles.backButton} activeOpacity={0.7}>
              <ArrowLeft width={24} height={24} color="#000000" />
            </TouchableOpacity>
            
            <View style={[styles.chatAvatar, { backgroundColor: getAvatarColor(selectedChat?.name || '') }]}>
              <Text style={styles.avatarText}>{selectedChat?.avatar}</Text>
            </View>
            
            <View style={styles.chatHeaderInfo}>
              <View style={styles.chatNameContainer}>
                <Text style={styles.chatName}>{selectedChat?.name}</Text>
                {selectedChat?.name === 'BIND AI' && (
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>AI</Text>
                  </View>
                )}
              </View>
              <Text style={styles.chatStatus}>
                {selectedChat?.name === 'BIND AI' 
                  ? 'AI Assistant - Always available to help' 
                  : selectedChat?.online ? 'Online' : 'Last seen recently'
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.chatActions}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Phone size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Video size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <MoreVertical size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: inputHeight + 120 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {selectedChat?.name === 'BIND AI' ? renderAIMessage() : renderRegularMessages()}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputContent}>
            <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
              <Paperclip size={20} color="#6b7280" />
            </TouchableOpacity>
            
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder={selectedChat?.name === 'BIND AI' ? 'Ask me anything about your business...' : 'Type a message'}
                value={newMessage}
                onChangeText={setNewMessage}
                style={[styles.textInput, { height: Math.max(48, inputHeight) }]}
                multiline
                onContentSizeChange={(event) => {
                  const newHeight = Math.min(event.nativeEvent.contentSize.height, 128);
                  setInputHeight(newHeight);
                }}
              />
            </View>
            
            <TouchableOpacity 
              onPress={sendMessage}
              style={styles.sendButton} 
              activeOpacity={0.7}
            >
              <Send size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    width: 36,
    height: 36,
    backgroundColor: '#22c55e',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    fontSize: 16,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  aiBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  aiBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    backgroundColor: '#22c55e',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#4b5563',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 64,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chatStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  chatActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageLeft: {
    alignItems: 'flex-start',
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  messageBubbleLeft: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: width * 0.75,
  },
  messageBubbleRight: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: width * 0.75,
  },
  messageText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  messageTextWhite: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  messageTimeWhite: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  aiMessageBubble: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#93c5fd',
    maxWidth: width * 0.8,
  },
  aiMessageText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  aiListContainer: {
    marginVertical: 8,
  },
  aiListItem: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    marginBottom: 4,
  },
  aiTimestamp: {
    fontSize: 12,
    color: '#2563eb',
    marginTop: 8,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
    padding: 8,
    marginBottom: 4,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  textInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
    maxHeight: 128,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#22c55e',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
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

export default MessagesPage;

