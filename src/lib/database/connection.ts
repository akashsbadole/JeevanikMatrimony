// Database connection and utilities using Supabase

import { createClient } from '@supabase/supabase-js';
import { User, UserProfile, CompleteProfile } from '@/types/user';
import { UserInterest, Message, SubscriptionPlan } from '@/types/interactions';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database utility functions
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Generic database operations
export async function executeQuery<T>(
  query: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string = 'Database operation failed'
): Promise<T> {
  try {
    const { data, error } = await query();
    
    if (error) {
      console.error('Database error:', error);
      throw new DatabaseError(`${errorMessage}: ${error.message}`, error.code);
    }
    
    if (!data) {
      throw new DatabaseError('No data returned from query');
    }
    
    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    console.error('Unexpected database error:', error);
    throw new DatabaseError(errorMessage);
  }
}

// User operations
export async function createUser(userData: {
  email: string;
  passwordHash: string;
  phone?: string;
}): Promise<User> {
  return executeQuery(
    () => supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single(),
    'Failed to create user'
  );
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    throw new DatabaseError(`Failed to fetch user: ${error.message}`);
  }
  
  return data;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new DatabaseError(`Failed to fetch user: ${error.message}`);
  }
  
  return data;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  return executeQuery(
    () => supabaseAdmin
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single(),
    'Failed to update user'
  );
}

// Profile operations
export async function createUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  return executeQuery(
    () => supabaseAdmin
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single(),
    'Failed to create user profile'
  );
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new DatabaseError(`Failed to fetch user profile: ${error.message}`);
  }
  
  return data;
}

export async function getCompleteProfile(userId: string): Promise<CompleteProfile | null> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select(`
      *,
      users(*),
      family_details(*),
      education_details(*),
      professional_details(*),
      lifestyle_preferences(*),
      partner_preferences(*),
      horoscope_details(*)
    `)
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    throw new DatabaseError(`Failed to fetch complete profile: ${error.message}`);
  }
  
  return data;
}

export async function updateUserProfile(profileId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  return executeQuery(
    () => supabaseAdmin
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', profileId)
      .select()
      .single(),
    'Failed to update user profile'
  );
}

// Search and matching operations
export async function searchProfiles(filters: {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  religion?: string[];
  caste?: string[];
  city?: string[];
  state?: string[];
  education?: string[];
  occupation?: string[];
  maritalStatus?: string[];
  limit?: number;
  offset?: number;
}): Promise<UserProfile[]> {
  let query = supabaseAdmin
    .from('user_profiles')
    .select(`
      *,
      education_details(*),
      professional_details(*)
    `);
  
  // Apply filters
  if (filters.gender) {
    query = query.eq('gender', filters.gender);
  }
  
  if (filters.minAge || filters.maxAge) {
    const today = new Date();
    if (filters.maxAge) {
      const minDate = new Date(today.getFullYear() - filters.maxAge, today.getMonth(), today.getDate());
      query = query.gte('date_of_birth', minDate.toISOString().split('T')[0]);
    }
    if (filters.minAge) {
      const maxDate = new Date(today.getFullYear() - filters.minAge, today.getMonth(), today.getDate());
      query = query.lte('date_of_birth', maxDate.toISOString().split('T')[0]);
    }
  }
  
  if (filters.minHeight) {
    query = query.gte('height_cm', filters.minHeight);
  }
  
  if (filters.maxHeight) {
    query = query.lte('height_cm', filters.maxHeight);
  }
  
  if (filters.religion && filters.religion.length > 0) {
    query = query.in('religion', filters.religion);
  }
  
  if (filters.caste && filters.caste.length > 0) {
    query = query.in('caste', filters.caste);
  }
  
  if (filters.city && filters.city.length > 0) {
    query = query.in('city', filters.city);
  }
  
  if (filters.state && filters.state.length > 0) {
    query = query.in('state', filters.state);
  }
  
  if (filters.maritalStatus && filters.maritalStatus.length > 0) {
    query = query.in('marital_status', filters.maritalStatus);
  }
  
  // Pagination
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  if (filters.offset) {
    query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
  }
  
  return executeQuery(
    () => query,
    'Failed to search profiles'
  );
}

// Interest operations
export async function sendInterest(interestData: {
  senderId: string;
  receiverId: string;
  interestType?: string;
  message?: string;
}): Promise<UserInterest> {
  return executeQuery(
    () => supabaseAdmin
      .from('user_interests')
      .insert([interestData])
      .select()
      .single(),
    'Failed to send interest'
  );
}

export async function getInterestsSent(userId: string, limit: number = 20): Promise<UserInterest[]> {
  return executeQuery(
    () => supabaseAdmin
      .from('user_interests')
      .select(`
        *,
        receiver:user_profiles!receiver_id(id, first_name, last_name, profile_photo_url, city, date_of_birth)
      `)
      .eq('sender_id', userId)
      .order('sent_at', { ascending: false })
      .limit(limit),
    'Failed to fetch sent interests'
  );
}

export async function getInterestsReceived(userId: string, limit: number = 20): Promise<UserInterest[]> {
  return executeQuery(
    () => supabaseAdmin
      .from('user_interests')
      .select(`
        *,
        sender:user_profiles!sender_id(id, first_name, last_name, profile_photo_url, city, date_of_birth)
      `)
      .eq('receiver_id', userId)
      .order('sent_at', { ascending: false })
      .limit(limit),
    'Failed to fetch received interests'
  );
}

export async function updateInterestStatus(
  interestId: string, 
  status: 'accepted' | 'declined'
): Promise<UserInterest> {
  return executeQuery(
    () => supabaseAdmin
      .from('user_interests')
      .update({ 
        status, 
        responded_at: new Date().toISOString() 
      })
      .eq('id', interestId)
      .select()
      .single(),
    'Failed to update interest status'
  );
}

// Message operations
export async function sendMessage(messageData: {
  senderId: string;
  receiverId: string;
  content?: string;
  messageType?: string;
  mediaUrl?: string;
}): Promise<Message> {
  return executeQuery(
    () => supabaseAdmin
      .from('messages')
      .insert([messageData])
      .select()
      .single(),
    'Failed to send message'
  );
}

export async function getConversation(
  userId1: string, 
  userId2: string, 
  limit: number = 50
): Promise<Message[]> {
  return executeQuery(
    () => supabaseAdmin
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true })
      .limit(limit),
    'Failed to fetch conversation'
  );
}

// Subscription operations
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return executeQuery(
    () => supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_inr', { ascending: true }),
    'Failed to fetch subscription plans'
  );
}

// Analytics operations
export async function getProfileViews(profileId: string, days: number = 30): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { count, error } = await supabaseAdmin
    .from('profile_views')
    .select('*', { count: 'exact', head: true })
    .eq('viewed_profile_id', profileId)
    .gte('viewed_at', startDate.toISOString());
  
  if (error) {
    throw new DatabaseError(`Failed to fetch profile views: ${error.message}`);
  }
  
  return count || 0;
}

// Utility functions
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function formatHeight(heightCm: number): string {
  const feet = Math.floor(heightCm / 30.48);
  const inches = Math.round((heightCm % 30.48) / 2.54);
  return `${feet}'${inches}"`;
}

export function getAgeFromDate(dateOfBirth: string | Date): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}
