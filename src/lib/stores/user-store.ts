import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserProfile } from './types';

interface UserState {
  // User data
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Profile completion tracking
  onboardingStep: number;
  isOnboardingComplete: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  clearUserData: () => void;
  
  // Profile management
  updateProfileCompletion: () => void;
  addVerificationBadge: (badge: string) => void;
  removeVerificationBadge: (badge: string) => void;
  incrementProfileViews: () => void;
  updateLastActive: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      profile: null,
      isLoading: false,
      error: null,
      onboardingStep: 1,
      isOnboardingComplete: false,
      
      // Actions
      setUser: (user) => set({ user }),
      
      setProfile: (profile) => {
        set({ profile });
        if (profile) {
          get().updateProfileCompletion();
        }
      },
      
      updateProfile: (updates) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          const updatedProfile = { ...currentProfile, ...updates };
          set({ profile: updatedProfile });
          get().updateProfileCompletion();
        }
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      completeOnboarding: () => set({ 
        isOnboardingComplete: true, 
        onboardingStep: 8 
      }),
      
      clearUserData: () => set({
        user: null,
        profile: null,
        isLoading: false,
        error: null,
        onboardingStep: 1,
        isOnboardingComplete: false,
      }),
      
      // Profile management functions
      updateProfileCompletion: () => {
        const profile = get().profile;
        if (!profile) return;
        
        const fields = [
          profile.firstName,
          profile.lastName,
          profile.dateOfBirth,
          profile.gender,
          profile.city,
          profile.state,
          profile.religion,
          profile.motherTongue,
          profile.aboutMe,
          profile.lookingFor,
          profile.education?.length > 0,
          profile.professional?.length > 0,
          profile.photos?.length > 0,
        ];
        
        const filledFields = fields.filter(field => {
          if (typeof field === 'boolean') return field;
          if (typeof field === 'string') return field && field.trim() !== '';
          return field != null;
        }).length;
        
        const completionPercentage = Math.round((filledFields / fields.length) * 100);
        
        set({
          profile: {
            ...profile,
            profileCompletionPercentage: completionPercentage
          }
        });
      },
      
      addVerificationBadge: (badge) => {
        const profile = get().profile;
        if (profile && !profile.verificationBadges.includes(badge)) {
          set({
            profile: {
              ...profile,
              verificationBadges: [...profile.verificationBadges, badge]
            }
          });
        }
      },
      
      removeVerificationBadge: (badge) => {
        const profile = get().profile;
        if (profile) {
          set({
            profile: {
              ...profile,
              verificationBadges: profile.verificationBadges.filter(b => b !== badge)
            }
          });
        }
      },
      
      incrementProfileViews: () => {
        const profile = get().profile;
        if (profile) {
          set({
            profile: {
              ...profile,
              profileViewsCount: profile.profileViewsCount + 1
            }
          });
        }
      },
      
      updateLastActive: () => {
        const profile = get().profile;
        if (profile) {
          set({
            profile: {
              ...profile,
              lastActive: new Date()
            }
          });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        onboardingStep: state.onboardingStep,
        isOnboardingComplete: state.isOnboardingComplete,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useUserStore((state) => state.user);
export const useProfile = () => useUserStore((state) => state.profile);
export const useIsLoading = () => useUserStore((state) => state.isLoading);
export const useError = () => useUserStore((state) => state.error);
export const useOnboardingStep = () => useUserStore((state) => state.onboardingStep);
export const useIsOnboardingComplete = () => useUserStore((state) => state.isOnboardingComplete);

// Computed selectors
export const useProfileCompletion = () => useUserStore((state) => 
  state.profile?.profileCompletionPercentage || 0
);

export const useIsProfileComplete = () => useUserStore((state) => 
  (state.profile?.profileCompletionPercentage || 0) >= 80
);

export const useVerificationBadges = () => useUserStore((state) => 
  state.profile?.verificationBadges || []
);

export const useIsVerified = () => useUserStore((state) => 
  state.profile?.isVerified || false
);

export const useProfileViewsCount = () => useUserStore((state) => 
  state.profile?.profileViewsCount || 0
);

// Action selectors
export const useUserActions = () => useUserStore((state) => ({
  setUser: state.setUser,
  setProfile: state.setProfile,
  updateProfile: state.updateProfile,
  setLoading: state.setLoading,
  setError: state.setError,
  setOnboardingStep: state.setOnboardingStep,
  completeOnboarding: state.completeOnboarding,
  clearUserData: state.clearUserData,
  updateProfileCompletion: state.updateProfileCompletion,
  addVerificationBadge: state.addVerificationBadge,
  removeVerificationBadge: state.removeVerificationBadge,
  incrementProfileViews: state.incrementProfileViews,
  updateLastActive: state.updateLastActive,
}));
