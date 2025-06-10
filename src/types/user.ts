// User and Profile Types for Matrimony Platform

export interface User {
  id: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  status: 'active' | 'suspended' | 'deleted';
}

export interface UserProfile {
  id: string;
  userId: string;
  profileFor: 'self' | 'son' | 'daughter' | 'brother' | 'sister';
  
  // Basic Information
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  maritalStatus: 'never_married' | 'divorced' | 'widowed' | 'separated';
  
  // Physical Attributes
  heightCm?: number;
  weightKg?: number;
  bodyType?: 'slim' | 'average' | 'athletic' | 'heavy';
  complexion?: 'very_fair' | 'fair' | 'wheatish' | 'dark' | 'very_dark';
  physicalStatus?: 'normal' | 'physically_challenged';
  
  // Location
  country: string;
  state?: string;
  city?: string;
  willingToRelocate: boolean;
  
  // Religious Information
  religion?: string;
  caste?: string;
  subCaste?: string;
  gothra?: string;
  star?: string; // nakshatra
  rashi?: string;
  manglikStatus?: 'yes' | 'no' | 'anshik';
  
  // Languages
  motherTongue?: string;
  languagesKnown: string[];
  
  // About sections
  aboutMe?: string;
  partnerExpectations?: string;
  
  // Profile settings
  profilePhotoUrl?: string;
  photoGallery: string[];
  profileVisibility: 'public' | 'private' | 'premium_only';
  showContactInfo: boolean;
  
  // Verification
  isVerified: boolean;
  verificationDocuments: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyDetails {
  id: string;
  userProfileId: string;
  
  familyType?: 'nuclear' | 'joint' | 'others';
  familyStatus?: 'middle_class' | 'upper_middle_class' | 'rich' | 'affluent';
  familyValues?: 'orthodox' | 'traditional' | 'moderate' | 'liberal';
  
  // Parents Information
  fatherName?: string;
  fatherOccupation?: string;
  fatherLiving: boolean;
  motherName?: string;
  motherOccupation?: string;
  motherLiving: boolean;
  
  // Siblings
  brothersCount: number;
  brothersMarried: number;
  sistersCount: number;
  sistersMarried: number;
  
  // Financial
  familyIncomeRange?: string;
  propertyDetails?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationDetails {
  id: string;
  userProfileId: string;
  
  highestEducation: string;
  educationField?: string;
  institutionName?: string;
  graduationYear?: number;
  additionalQualifications?: string;
  
  createdAt: Date;
}

export interface ProfessionalDetails {
  id: string;
  userProfileId: string;
  
  occupation: string;
  designation?: string;
  companyName?: string;
  workLocation?: string;
  experienceYears?: number;
  annualIncomeRange?: string;
  willingToRelocateForWork: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface LifestylePreferences {
  id: string;
  userProfileId: string;
  
  diet?: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'jain';
  smoking?: 'never' | 'occasionally' | 'regularly' | 'trying_to_quit';
  drinking?: 'never' | 'occasionally' | 'socially' | 'regularly';
  
  hobbies: string[];
  interests: string[];
  musicPreferences: string[];
  moviePreferences: string[];
  bookPreferences: string[];
  sportsInterests: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerPreferences {
  id: string;
  userProfileId: string;
  
  // Age and Physical
  minAge?: number;
  maxAge?: number;
  minHeightCm?: number;
  maxHeightCm?: number;
  preferredComplexion: string[];
  preferredBodyType: string[];
  
  // Location
  preferredCountries: string[];
  preferredStates: string[];
  preferredCities: string[];
  
  // Religious
  preferredReligions: string[];
  preferredCastes: string[];
  preferredSubCastes: string[];
  manglikPreference?: 'yes' | 'no' | 'no_preference';
  
  // Education & Professional
  minEducationLevel?: string;
  preferredOccupations: string[];
  minIncomeRange?: string;
  
  // Lifestyle
  preferredDiet: string[];
  smokingPreference?: 'acceptable' | 'not_acceptable' | 'no_preference';
  drinkingPreference?: 'acceptable' | 'not_acceptable' | 'no_preference';
  
  // Family
  preferredFamilyType: string[];
  preferredFamilyValues: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface HoroscopeDetails {
  id: string;
  userProfileId: string;
  
  birthTime?: string;
  birthPlace?: string;
  kundliUrl?: string;
  
  // Astrological details
  sunSign?: string;
  moonSign?: string;
  ascendant?: string;
  nakshatra?: string;
  pada?: number;
  gana?: 'dev' | 'manushya' | 'rakshasa';
  nadi?: string;
  
  createdAt: Date;
}

// Complete profile interface combining all details
export interface CompleteProfile extends UserProfile {
  user: User;
  familyDetails?: FamilyDetails;
  educationDetails?: EducationDetails;
  professionalDetails?: ProfessionalDetails;
  lifestylePreferences?: LifestylePreferences;
  partnerPreferences?: PartnerPreferences;
  horoscopeDetails?: HoroscopeDetails;
}

// Profile creation form data
export interface ProfileFormData {
  // Basic info
  profileFor: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  
  // Physical
  heightCm?: number;
  weightKg?: number;
  bodyType?: string;
  complexion?: string;
  
  // Location
  country: string;
  state?: string;
  city?: string;
  willingToRelocate: boolean;
  
  // Religious
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  
  // Education
  highestEducation: string;
  educationField?: string;
  institutionName?: string;
  
  // Professional
  occupation: string;
  designation?: string;
  companyName?: string;
  annualIncomeRange?: string;
  
  // Lifestyle
  diet?: string;
  smoking?: string;
  drinking?: string;
  
  // About
  aboutMe?: string;
  partnerExpectations?: string;
}

// Search filters interface
export interface SearchFilters {
  ageRange?: [number, number];
  heightRange?: [number, number];
  location?: {
    countries?: string[];
    states?: string[];
    cities?: string[];
  };
  religion?: string[];
  caste?: string[];
  education?: string[];
  occupation?: string[];
  incomeRange?: string;
  maritalStatus?: string[];
  diet?: string[];
  manglikStatus?: string;
  profilesWithPhotos?: boolean;
  verifiedProfiles?: boolean;
  recentlyJoined?: boolean;
}
