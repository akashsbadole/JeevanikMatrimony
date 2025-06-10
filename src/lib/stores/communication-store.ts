import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserInterest, Message, Notification } from './types';

interface CommunicationState {
  // Interests
  sentInterests: UserInterest[];
  receivedInterests: UserInterest[];
  isLoadingInterests: boolean;
  
  // Messages
  conversations: Array<{
    conversationId: string;
    participantProfileId: string;
    participantProfile?: any;
    lastMessage?: Message;
    unreadCount: number;
    lastActivity: Date;
  }>;
  messages: Record<string, Message[]>; // conversationId -> messages
  isLoadingMessages: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  isLoadingNotifications: boolean;
  
  // Actions - Interests
  setSentInterests: (interests: UserInterest[]) => void;
  setReceivedInterests: (interests: UserInterest[]) => void;
  addSentInterest: (interest: UserInterest) => void;
  updateInterestStatus: (interestId: string, status: UserInterest['status']) => void;
  setLoadingInterests: (loading: boolean) => void;
  
  // Actions - Messages
  setConversations: (conversations: any[]) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  markMessageAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  setLoadingMessages: (loading: boolean) => void;
  
  // Actions - Notifications
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  setLoadingNotifications: (loading: boolean) => void;
  
  // Utility actions
  clearAllData: () => void;
  getUnreadMessagesCount: () => number;
  getConversationUnreadCount: (conversationId: string) => number;
}

export const useCommunicationStore = create<CommunicationState>()(
  persist(
    (set, get) => ({
      // Initial state
      sentInterests: [],
      receivedInterests: [],
      isLoadingInterests: false,
      
      conversations: [],
      messages: {},
      isLoadingMessages: false,
      
      notifications: [],
      unreadNotificationsCount: 0,
      isLoadingNotifications: false,
      
      // Interest actions
      setSentInterests: (interests) => set({ sentInterests: interests }),
      
      setReceivedInterests: (interests) => set({ receivedInterests: interests }),
      
      addSentInterest: (interest) => {
        const sentInterests = get().sentInterests;
        set({ sentInterests: [interest, ...sentInterests] });
      },
      
      updateInterestStatus: (interestId, status) => {
        const sentInterests = get().sentInterests;
        const receivedInterests = get().receivedInterests;
        
        set({
          sentInterests: sentInterests.map(interest =>
            interest.id === interestId ? { ...interest, status, respondedAt: new Date() } : interest
          ),
          receivedInterests: receivedInterests.map(interest =>
            interest.id === interestId ? { ...interest, status, respondedAt: new Date() } : interest
          ),
        });
      },
      
      setLoadingInterests: (loading) => set({ isLoadingInterests: loading }),
      
      // Message actions
      setConversations: (conversations) => set({ conversations }),
      
      setMessages: (conversationId, messages) => {
        const currentMessages = get().messages;
        set({
          messages: {
            ...currentMessages,
            [conversationId]: messages,
          }
        });
      },
      
      addMessage: (message) => {
        const currentMessages = get().messages;
        const conversationMessages = currentMessages[message.conversationId] || [];
        
        set({
          messages: {
            ...currentMessages,
            [message.conversationId]: [...conversationMessages, message],
          }
        });
        
        // Update conversation last message and activity
        const conversations = get().conversations;
        const updatedConversations = conversations.map(conv => {
          if (conv.conversationId === message.conversationId) {
            return {
              ...conv,
              lastMessage: message,
              lastActivity: message.sentAt,
              unreadCount: message.senderProfileId !== get().getCurrentUserProfileId() 
                ? conv.unreadCount + 1 
                : conv.unreadCount,
            };
          }
          return conv;
        });
        
        set({ conversations: updatedConversations });
      },
      
      markMessageAsRead: (messageId) => {
        const currentMessages = get().messages;
        const updatedMessages: Record<string, Message[]> = {};
        
        Object.keys(currentMessages).forEach(conversationId => {
          updatedMessages[conversationId] = currentMessages[conversationId].map(message =>
            message.id === messageId 
              ? { ...message, isRead: true, readAt: new Date() }
              : message
          );
        });
        
        set({ messages: updatedMessages });
      },
      
      markConversationAsRead: (conversationId) => {
        const currentMessages = get().messages;
        const conversationMessages = currentMessages[conversationId] || [];
        
        const updatedMessages = conversationMessages.map(message => ({
          ...message,
          isRead: true,
          readAt: message.readAt || new Date(),
        }));
        
        set({
          messages: {
            ...currentMessages,
            [conversationId]: updatedMessages,
          }
        });
        
        // Update conversation unread count
        const conversations = get().conversations;
        const updatedConversations = conversations.map(conv =>
          conv.conversationId === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        );
        
        set({ conversations: updatedConversations });
      },
      
      setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),
      
      // Notification actions
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ 
          notifications,
          unreadNotificationsCount: unreadCount 
        });
      },
      
      addNotification: (notification) => {
        const notifications = get().notifications;
        const unreadCount = get().unreadNotificationsCount;
        
        set({
          notifications: [notification, ...notifications],
          unreadNotificationsCount: notification.isRead ? unreadCount : unreadCount + 1,
        });
      },
      
      markNotificationAsRead: (notificationId) => {
        const notifications = get().notifications;
        const updatedNotifications = notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        
        set({
          notifications: updatedNotifications,
          unreadNotificationsCount: unreadCount,
        });
      },
      
      markAllNotificationsAsRead: () => {
        const notifications = get().notifications;
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          isRead: true,
        }));
        
        set({
          notifications: updatedNotifications,
          unreadNotificationsCount: 0,
        });
      },
      
      removeNotification: (notificationId) => {
        const notifications = get().notifications;
        const notification = notifications.find(n => n.id === notificationId);
        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        
        set({
          notifications: updatedNotifications,
          unreadNotificationsCount: notification && !notification.isRead 
            ? get().unreadNotificationsCount - 1 
            : get().unreadNotificationsCount,
        });
      },
      
      setLoadingNotifications: (loading) => set({ isLoadingNotifications: loading }),
      
      // Utility actions
      clearAllData: () => set({
        sentInterests: [],
        receivedInterests: [],
        conversations: [],
        messages: {},
        notifications: [],
        unreadNotificationsCount: 0,
        isLoadingInterests: false,
        isLoadingMessages: false,
        isLoadingNotifications: false,
      }),
      
      getUnreadMessagesCount: () => {
        const conversations = get().conversations;
        return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
      },
      
      getConversationUnreadCount: (conversationId) => {
        const conversations = get().conversations;
        const conversation = conversations.find(conv => conv.conversationId === conversationId);
        return conversation?.unreadCount || 0;
      },
      
      // Helper function to get current user profile ID (would be implemented based on your auth system)
      getCurrentUserProfileId: () => {
        // This would typically come from your user store or auth context
        return 'current-user-profile-id'; // Placeholder
      },
    }),
    {
      name: 'communication-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist essential data, not loading states
        sentInterests: state.sentInterests,
        receivedInterests: state.receivedInterests,
        conversations: state.conversations,
        messages: state.messages,
        notifications: state.notifications,
        unreadNotificationsCount: state.unreadNotificationsCount,
      }),
    }
  )
);

// Selectors
export const useSentInterests = () => useCommunicationStore((state) => state.sentInterests);
export const useReceivedInterests = () => useCommunicationStore((state) => state.receivedInterests);
export const useIsLoadingInterests = () => useCommunicationStore((state) => state.isLoadingInterests);

export const useConversations = () => useCommunicationStore((state) => state.conversations);
export const useMessages = (conversationId: string) => useCommunicationStore((state) => 
  state.messages[conversationId] || []
);
export const useIsLoadingMessages = () => useCommunicationStore((state) => state.isLoadingMessages);

export const useNotifications = () => useCommunicationStore((state) => state.notifications);
export const useUnreadNotificationsCount = () => useCommunicationStore((state) => state.unreadNotificationsCount);
export const useIsLoadingNotifications = () => useCommunicationStore((state) => state.isLoadingNotifications);

// Computed selectors
export const usePendingReceivedInterests = () => useCommunicationStore((state) => 
  state.receivedInterests.filter(interest => interest.status === 'pending')
);

export const useAcceptedInterests = () => useCommunicationStore((state) => {
  const sent = state.sentInterests.filter(interest => interest.status === 'accepted');
  const received = state.receivedInterests.filter(interest => interest.status === 'accepted');
  return [...sent, ...received];
});

export const useUnreadMessagesCount = () => useCommunicationStore((state) => 
  state.getUnreadMessagesCount()
);

export const useConversationUnreadCount = (conversationId: string) => useCommunicationStore((state) => 
  state.getConversationUnreadCount(conversationId)
);

export const useUnreadNotifications = () => useCommunicationStore((state) => 
  state.notifications.filter(notification => !notification.isRead)
);

// Action selectors
export const useCommunicationActions = () => useCommunicationStore((state) => ({
  setSentInterests: state.setSentInterests,
  setReceivedInterests: state.setReceivedInterests,
  addSentInterest: state.addSentInterest,
  updateInterestStatus: state.updateInterestStatus,
  setLoadingInterests: state.setLoadingInterests,
  setConversations: state.setConversations,
  setMessages: state.setMessages,
  addMessage: state.addMessage,
  markMessageAsRead: state.markMessageAsRead,
  markConversationAsRead: state.markConversationAsRead,
  setLoadingMessages: state.setLoadingMessages,
  setNotifications: state.setNotifications,
  addNotification: state.addNotification,
  markNotificationAsRead: state.markNotificationAsRead,
  markAllNotificationsAsRead: state.markAllNotificationsAsRead,
  removeNotification: state.removeNotification,
  setLoadingNotifications: state.setLoadingNotifications,
  clearAllData: state.clearAllData,
}));
