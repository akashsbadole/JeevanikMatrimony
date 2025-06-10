// Types for user interactions, messaging, and platform features

export interface UserInterest {
  id: string;
  senderId: string;
  receiverId: string;
  interestType: 'standard' | 'premium' | 'super';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  sentAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
  
  // Populated fields
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
    age: number;
    city?: string;
    occupation?: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
    age: number;
    city?: string;
    occupation?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  messageType: 'text' | 'image' | 'voice' | 'video';
  content?: string;
  mediaUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  
  // Populated sender info
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
  };
}

export interface Conversation {
  participantId: string;
  participantName: string;
  participantPhoto?: string;
  lastMessage?: Message;
  unreadCount: number;
  lastActivity: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  durationMonths: number;
  priceInr: number;
  features: {
    profileViews?: number; // -1 for unlimited
    interestsSend?: number;
    premiumInterests?: number;
    directMessaging?: boolean;
    advancedSearch?: boolean;
    profileHighlighting?: boolean;
    contactInfoAccess?: boolean;
    horoscopeMatching?: boolean;
    prioritySupport?: boolean;
    profileVerification?: boolean;
    whoViewedProfile?: boolean;
  };
  isActive: boolean;
  createdAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  paymentMethod?: string;
  amountPaid?: number;
  createdAt: Date;
  
  // Populated plan details
  plan?: SubscriptionPlan;
}

export interface ProfileView {
  id: string;
  viewerId: string;
  viewedProfileId: string;
  viewedAt: Date;
  
  // Populated viewer info
  viewer?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
    age: number;
    city?: string;
    occupation?: string;
  };
}

export interface ShortlistedProfile {
  id: string;
  userId: string;
  shortlistedProfileId: string;
  notes?: string;
  createdAt: Date;
  
  // Populated profile info
  profile?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
    age: number;
    city?: string;
    occupation?: string;
    heightCm?: number;
    education?: string;
  };
}

export interface BlockedProfile {
  id: string;
  userId: string;
  blockedProfileId: string;
  reason?: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedProfileId: string;
  reportType: 'fake_profile' | 'inappropriate_message' | 'harassment' | 'spam' | 'other';
  description?: string;
  evidenceUrls: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: Date;
  resolvedAt?: Date;
  
  // Populated fields
  reporter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reportedProfile?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface SuccessStory {
  id: string;
  user1Id: string;
  user2Id: string;
  storyTitle?: string;
  storyContent?: string;
  weddingDate?: Date;
  weddingPhotos: string[];
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  
  // Populated user info
  couple?: {
    user1: {
      firstName: string;
      lastName: string;
      profilePhotoUrl?: string;
    };
    user2: {
      firstName: string;
      lastName: string;
      profilePhotoUrl?: string;
    };
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search and matching types
export interface MatchScore {
  profileId: string;
  score: number;
  matchingFactors: {
    age: number;
    location: number;
    education: number;
    profession: number;
    lifestyle: number;
    family: number;
    religious: number;
  };
}

export interface SearchResult {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    profilePhotoUrl?: string;
    city?: string;
    state?: string;
    occupation?: string;
    education?: string;
    heightCm?: number;
    religion?: string;
    caste?: string;
    isVerified: boolean;
    lastActive?: Date;
  };
  matchScore?: number;
  isShortlisted: boolean;
  hasInterest: boolean;
  interestStatus?: 'sent' | 'received' | 'mutual';
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'interest_received' | 'interest_accepted' | 'message_received' | 'profile_viewed' | 'subscription_expiring' | 'profile_verified';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// Analytics types
export interface UserAnalytics {
  profileViews: {
    total: number;
    thisWeek: number;
    thisMonth: number;
  };
  interestsSent: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
  };
  interestsReceived: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
  };
  messages: {
    totalConversations: number;
    totalMessages: number;
    thisWeek: number;
  };
  profileCompleteness: number;
  responseRate: number;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: ValidationError[];
  success?: boolean;
  message?: string;
}

// File upload types
export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

// Chat/messaging types
export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

// Premium feature usage tracking
export interface FeatureUsage {
  userId: string;
  feature: string;
  usageCount: number;
  lastUsed: Date;
  resetDate: Date; // When the counter resets (monthly/yearly)
}
