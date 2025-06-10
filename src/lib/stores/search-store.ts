import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, SearchFilters, MatchCompatibility } from './types';

interface SearchState {
  // Search results
  searchResults: UserProfile[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  isSearching: boolean;
  
  // Filters
  filters: SearchFilters;
  savedSearches: Array<{ id: string; name: string; filters: SearchFilters; createdAt: Date }>;
  
  // Recommendations
  recommendations: MatchCompatibility[];
  isLoadingRecommendations: boolean;
  
  // Recently viewed profiles
  recentlyViewed: UserProfile[];
  
  // Shortlisted profiles
  shortlisted: UserProfile[];
  
  // Blocked profiles
  blocked: string[]; // profile IDs
  
  // Actions
  setSearchResults: (results: UserProfile[], total: number, page: number, totalPages: number) => void;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
  setSearching: (searching: boolean) => void;
  
  // Saved searches
  saveSearch: (name: string, filters: SearchFilters) => void;
  deleteSavedSearch: (id: string) => void;
  loadSavedSearch: (id: string) => void;
  
  // Recommendations
  setRecommendations: (recommendations: MatchCompatibility[]) => void;
  setLoadingRecommendations: (loading: boolean) => void;
  
  // Profile management
  addToRecentlyViewed: (profile: UserProfile) => void;
  addToShortlist: (profile: UserProfile) => void;
  removeFromShortlist: (profileId: string) => void;
  blockProfile: (profileId: string) => void;
  unblockProfile: (profileId: string) => void;
  
  // Pagination
  setCurrentPage: (page: number) => void;
  
  // Clear data
  clearSearchResults: () => void;
  clearRecentlyViewed: () => void;
}

const defaultFilters: SearchFilters = {
  ageMin: 18,
  ageMax: 35,
  hasPhoto: true,
  location: {},
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      searchResults: [],
      totalResults: 0,
      currentPage: 1,
      totalPages: 0,
      isSearching: false,
      
      filters: defaultFilters,
      savedSearches: [],
      
      recommendations: [],
      isLoadingRecommendations: false,
      
      recentlyViewed: [],
      shortlisted: [],
      blocked: [],
      
      // Actions
      setSearchResults: (results, total, page, totalPages) => set({
        searchResults: results,
        totalResults: total,
        currentPage: page,
        totalPages: totalPages,
        isSearching: false,
      }),
      
      setFilters: (filters) => set({ filters }),
      
      updateFilter: (key, value) => {
        const currentFilters = get().filters;
        set({
          filters: {
            ...currentFilters,
            [key]: value,
          }
        });
      },
      
      clearFilters: () => set({ filters: defaultFilters }),
      
      setSearching: (searching) => set({ isSearching: searching }),
      
      // Saved searches
      saveSearch: (name, filters) => {
        const savedSearches = get().savedSearches;
        const newSearch = {
          id: Date.now().toString(),
          name,
          filters,
          createdAt: new Date(),
        };
        set({
          savedSearches: [...savedSearches, newSearch]
        });
      },
      
      deleteSavedSearch: (id) => {
        const savedSearches = get().savedSearches;
        set({
          savedSearches: savedSearches.filter(search => search.id !== id)
        });
      },
      
      loadSavedSearch: (id) => {
        const savedSearches = get().savedSearches;
        const search = savedSearches.find(s => s.id === id);
        if (search) {
          set({ filters: search.filters });
        }
      },
      
      // Recommendations
      setRecommendations: (recommendations) => set({ 
        recommendations,
        isLoadingRecommendations: false 
      }),
      
      setLoadingRecommendations: (loading) => set({ 
        isLoadingRecommendations: loading 
      }),
      
      // Profile management
      addToRecentlyViewed: (profile) => {
        const recentlyViewed = get().recentlyViewed;
        const filtered = recentlyViewed.filter(p => p.id !== profile.id);
        set({
          recentlyViewed: [profile, ...filtered].slice(0, 50) // Keep last 50
        });
      },
      
      addToShortlist: (profile) => {
        const shortlisted = get().shortlisted;
        if (!shortlisted.find(p => p.id === profile.id)) {
          set({
            shortlisted: [...shortlisted, profile]
          });
        }
      },
      
      removeFromShortlist: (profileId) => {
        const shortlisted = get().shortlisted;
        set({
          shortlisted: shortlisted.filter(p => p.id !== profileId)
        });
      },
      
      blockProfile: (profileId) => {
        const blocked = get().blocked;
        if (!blocked.includes(profileId)) {
          set({
            blocked: [...blocked, profileId],
            // Remove from other lists
            searchResults: get().searchResults.filter(p => p.id !== profileId),
            recommendations: get().recommendations.filter(r => r.profileId !== profileId),
            recentlyViewed: get().recentlyViewed.filter(p => p.id !== profileId),
            shortlisted: get().shortlisted.filter(p => p.id !== profileId),
          });
        }
      },
      
      unblockProfile: (profileId) => {
        const blocked = get().blocked;
        set({
          blocked: blocked.filter(id => id !== profileId)
        });
      },
      
      // Pagination
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // Clear data
      clearSearchResults: () => set({
        searchResults: [],
        totalResults: 0,
        currentPage: 1,
        totalPages: 0,
        isSearching: false,
      }),
      
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        savedSearches: state.savedSearches,
        recentlyViewed: state.recentlyViewed,
        shortlisted: state.shortlisted,
        blocked: state.blocked,
      }),
    }
  )
);

// Selectors
export const useSearchResults = () => useSearchStore((state) => state.searchResults);
export const useSearchFilters = () => useSearchStore((state) => state.filters);
export const useIsSearching = () => useSearchStore((state) => state.isSearching);
export const useTotalResults = () => useSearchStore((state) => state.totalResults);
export const useCurrentPage = () => useSearchStore((state) => state.currentPage);
export const useTotalPages = () => useSearchStore((state) => state.totalPages);
export const useSavedSearches = () => useSearchStore((state) => state.savedSearches);
export const useRecommendations = () => useSearchStore((state) => state.recommendations);
export const useIsLoadingRecommendations = () => useSearchStore((state) => state.isLoadingRecommendations);
export const useRecentlyViewed = () => useSearchStore((state) => state.recentlyViewed);
export const useShortlisted = () => useSearchStore((state) => state.shortlisted);
export const useBlocked = () => useSearchStore((state) => state.blocked);

// Computed selectors
export const useFilteredSearchResults = () => useSearchStore((state) => {
  const blocked = state.blocked;
  return state.searchResults.filter(profile => !blocked.includes(profile.id));
});

export const useIsProfileShortlisted = (profileId: string) => useSearchStore((state) => 
  state.shortlisted.some(p => p.id === profileId)
);

export const useIsProfileBlocked = (profileId: string) => useSearchStore((state) => 
  state.blocked.includes(profileId)
);

export const useHasActiveFilters = () => useSearchStore((state) => {
  const filters = state.filters;
  const defaultFiltersKeys = Object.keys(defaultFilters);
  
  return Object.keys(filters).some(key => {
    if (!defaultFiltersKeys.includes(key)) return true;
    const defaultValue = defaultFilters[key as keyof SearchFilters];
    const currentValue = filters[key as keyof SearchFilters];
    return JSON.stringify(defaultValue) !== JSON.stringify(currentValue);
  });
});

// Action selectors
export const useSearchActions = () => useSearchStore((state) => ({
  setSearchResults: state.setSearchResults,
  setFilters: state.setFilters,
  updateFilter: state.updateFilter,
  clearFilters: state.clearFilters,
  setSearching: state.setSearching,
  saveSearch: state.saveSearch,
  deleteSavedSearch: state.deleteSavedSearch,
  loadSavedSearch: state.loadSavedSearch,
  setRecommendations: state.setRecommendations,
  setLoadingRecommendations: state.setLoadingRecommendations,
  addToRecentlyViewed: state.addToRecentlyViewed,
  addToShortlist: state.addToShortlist,
  removeFromShortlist: state.removeFromShortlist,
  blockProfile: state.blockProfile,
  unblockProfile: state.unblockProfile,
  setCurrentPage: state.setCurrentPage,
  clearSearchResults: state.clearSearchResults,
  clearRecentlyViewed: state.clearRecentlyViewed,
}));
