// Type definitions for the matrimony platform

export interface User {
  id: string;
  clerkId: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  subscriptionType: 'premium'; // All users get premium for free
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  profileFor: 'self' | 'son' | 'daughter' | 'brother' | 'sister' | 'friend';
  createdByRelation: string;
  
  // Basic Information
  firstName: string;
  lastName: string;
  displayName?: string;
  dateOfBirth: Date;
  age: number;
  gender: 'male' | 'female';
  maritalStatus: 'never_married' | 'divorced' | 'widowed' | 'separated';
  
  // Physical Attributes
  heightCm?: number;
  weightKg?: number;
  bodyType?: 'slim' | 'average' | 'athletic' | 'heavy';
  complexion?: 'very_fair' | 'fair' | 'wheatish' | 'dark' | 'very_dark';
  physicalStatus: 'normal' | 'physically_challenged';
  bloodGroup?: string;
  
  // Location Details
  country: string;
  state?: string;
  city?: string;
  area?: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
  willingToRelocate: boolean;
  
  // Religious Information
  religion?: string;
  caste?: string;
  subCaste?: string;
  gothra?: string;
  starRashi?: string;
  manglikStatus?: 'yes' | 'no' | 'anshik';
  
  // Language Preferences
  motherTongue?: string;
  knownLanguages: string[];
  
  // About & Description
  aboutMe?: string;
  lookingFor?: string;
  hobbiesInterests: string[];
  
  // Profile Status
  profileCompletionPercentage: number;
  isVerified: boolean;
  verificationBadges: string[];
  profileViewsCount: number;
  lastActive: Date;
  
  // Related data
  photos: ProfilePhoto[];
  education: EducationDetail[];
  professional: ProfessionalDetail[];
  family: FamilyDetail;
  lifestyle: LifestylePreference;
  partnerPreferences: PartnerPreference;
  horoscope?: HoroscopeDetail;
}

export interface ProfilePhoto {
  id: string;
  profileId: string;
  photoUrl: string;
  photoType: 'profile' | 'gallery' | 'horoscope';
  isPrimary: boolean;
  isVerified: boolean;
  uploadDate: Date;
  displayOrder: number;
  privacyLevel: 'public' | 'premium_only' | 'private';
}

export interface EducationDetail {
  id: string;
  profileId: string;
  educationLevel: 'high_school' | 'diploma' | 'bachelors' | 'masters' | 'phd' | 'professional';
  degreeName?: string;
  specialization?: string;
  institutionName?: string;
  universityName?: string;
  yearOfPassing?: number;
  gradePercentage?: number;
  isHighestEducation: boolean;
}

export interface ProfessionalDetail {
  id: string;
  profileId: string;
  occupation?: string;
  designation?: string;
  companyName?: string;
  companyType?: 'private' | 'government' | 'business' | 'not_working';
  workExperienceYears?: number;
  annualIncomeMin?: number;
  annualIncomeMax?: number;
  workLocationCity?: string;
  workLocationState?: string;
  willingToRelocateForWork: boolean;
  careerPlans?: string;
  isCurrentJob: boolean;
}

export interface FamilyDetail {
  id: string;
  profileId: string;
  familyType?: 'nuclear' | 'joint' | 'others';
  familyStatus?: 'middle_class' | 'upper_middle_class' | 'rich' | 'affluent';
  familyValues?: 'orthodox' | 'traditional' | 'moderate' | 'liberal';
  
  // Parents Information
  fatherName?: string;
  fatherOccupation?: string;
  fatherLivingStatus: 'alive' | 'deceased';
  motherName?: string;
  motherOccupation?: string;
  motherLivingStatus: 'alive' | 'deceased';
  
  // Siblings Information
  totalBrothers: number;
  marriedBrothers: number;
  totalSisters: number;
  marriedSisters: number;
  
  // Additional Family Info
  familyIncomeRange?: string;
  familyProperty?: string;
  familyAbout?: string;
}

export interface LifestylePreference {
  id: string;
  profileId: string;
  diet?: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'jain_food' | 'occasionally_non_veg';
  drinking?: 'never' | 'occasionally' | 'socially' | 'regularly';
  smoking?: 'never' | 'occasionally' | 'socially' | 'regularly';
  exerciseHabits?: 'never' | 'rarely' | 'sometimes' | 'regularly' | 'daily';
  pets?: 'love_pets' | 'allergic_to_pets' | 'no_preference';
  musicPreferences: string[];
  moviePreferences: string[];
  sportsInterests: string[];
  travelPreferences?: 'love_traveling' | 'occasional_traveler' | 'homebody';
}

export interface PartnerPreference {
  id: string;
  profileId: string;
  
  // Basic Preferences
  ageMin?: number;
  ageMax?: number;
  heightMinCm?: number;
  heightMaxCm?: number;
  maritalStatusPreference: string[];
  
  // Location Preferences
  preferredCountries: string[];
  preferredStates: string[];
  preferredCities: string[];
  willingToRelocatePreference?: boolean;
  
  // Education & Professional Preferences
  educationPreference: string[];
  occupationPreference: string[];
  incomeMin?: number;
  incomeMax?: number;
  
  // Religious Preferences
  religionPreference: string[];
  castePreference: string[];
  manglikPreference?: 'yes' | 'no' | 'no_preference';
  
  // Lifestyle Preferences
  dietPreference: string[];
  drinkingPreference: string[];
  smokingPreference: string[];
  
  // Physical Preferences
  complexionPreference: string[];
  bodyTypePreference: string[];
  
  // Additional Preferences
  familyTypePreference: string[];
  familyValuesPreference: string[];
}

export interface HoroscopeDetail {
  id: string;
  profileId: string;
  birthTime?: string;
  birthPlace?: string;
  birthLatitude?: number;
  birthLongitude?: number;
  horoscopeFileUrl?: string;
  starNakshatra?: string;
  rashi?: string;
  gothra?: string;
  manglikStatus?: string;
  horoscopeDetails?: any; // JSON data
}

export interface UserInterest {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  interestType: 'regular' | 'premium' | 'super';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  sentAt: Date;
  respondedAt?: Date;
  expiresAt?: Date;
  
  // Populated data
  senderProfile?: UserProfile;
  receiverProfile?: UserProfile;
}

export interface Message {
  id: string;
  conversationId: string;
  senderProfileId: string;
  receiverProfileId: string;
  messageType: 'text' | 'image' | 'voice' | 'video';
  content?: string;
  mediaUrl?: string;
  isRead: boolean;
  readAt?: Date;
  sentAt: Date;
  
  // Populated data
  senderProfile?: UserProfile;
  receiverProfile?: UserProfile;
}

export interface ProfileView {
  id: string;
  viewerProfileId: string;
  viewedProfileId: string;
  viewDate: Date;
  viewCount: number;
  lastViewedAt: Date;
  
  // Populated data
  viewerProfile?: UserProfile;
  viewedProfile?: UserProfile;
}

export interface SearchFilters {
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;
  religion?: string[];
  caste?: string[];
  motherTongue?: string[];
  education?: string[];
  occupation?: string[];
  incomeMin?: number;
  incomeMax?: number;
  maritalStatus?: string[];
  diet?: string[];
  location?: {
    countries?: string[];
    states?: string[];
    cities?: string[];
  };
  manglikStatus?: string;
  hasPhoto?: boolean;
  isVerified?: boolean;
  recentlyJoined?: boolean;
  onlineNow?: boolean;
}

export interface MatchCompatibility {
  profileId: string;
  compatibilityScore: number;
  matchingFactors: {
    age: number;
    location: number;
    education: number;
    profession: number;
    lifestyle: number;
    family: number;
    religion: number;
  };
  profile: UserProfile;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'interest_received' | 'interest_accepted' | 'message_received' | 'profile_viewed' | 'match_found' | 'verification_approved';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export interface SuccessStory {
  id: string;
  groomProfileId: string;
  brideProfileId: string;
  storyTitle: string;
  storyContent: string;
  weddingDate?: Date;
  weddingPhotos: string[];
  isPublished: boolean;
  submittedAt: Date;
  publishedAt?: Date;
  
  // Populated data
  groomProfile?: UserProfile;
  brideProfile?: UserProfile;
}
