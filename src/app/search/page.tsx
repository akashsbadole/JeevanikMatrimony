'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Heart, Eye, MapPin, Briefcase, GraduationCap, Bookmark, BookmarkCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  useSearchResults, 
  useSearchFilters, 
  useIsSearching, 
  useTotalResults,
  useSearchActions,
  useIsProfileShortlisted,
  useHasActiveFilters
} from '@/lib/stores/search-store';
import { useCommunicationActions } from '@/lib/stores/communication-store';
import { locationService } from '@/lib/services/location-service';
import { ProfileModal } from '@/components/profile/profile-modal';
import { UserProfile } from '@/lib/stores/types';

export default function SearchPage() {
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
  
  // Zustand store hooks
  const searchResults = useSearchResults();
  const filters = useSearchFilters();
  const isSearching = useIsSearching();
  const totalResults = useTotalResults();
  const hasActiveFilters = useHasActiveFilters();
  
  const {
    setSearchResults,
    updateFilter,
    clearFilters,
    setSearching,
    addToShortlist,
    removeFromShortlist,
    addToRecentlyViewed
  } = useSearchActions();
  
  const { addSentInterest } = useCommunicationActions();

  // Mock profile data for demonstration
  const mockProfiles: UserProfile[] = [
    {
      id: '1',
      userId: 'user1',
      profileFor: 'self',
      createdByRelation: 'self',
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: new Date('1998-05-15'),
      age: 26,
      gender: 'female',
      maritalStatus: 'never_married',
      heightCm: 165,
      weightKg: 55,
      bodyType: 'slim',
      complexion: 'fair',
      physicalStatus: 'normal',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      willingToRelocate: false,
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Hindi',
      knownLanguages: ['Hindi', 'English', 'Marathi'],
      aboutMe: 'I am a software engineer who loves to travel and read books.',
      lookingFor: 'Looking for a caring and understanding life partner.',
      hobbiesInterests: ['Reading', 'Traveling', 'Cooking'],
      profileCompletionPercentage: 92,
      isVerified: true,
      verificationBadges: ['photo_verified', 'education_verified'],
      profileViewsCount: 156,
      lastActive: new Date(),
      photos: [{ 
        id: '1', 
        profileId: '1', 
        photoUrl: '/api/placeholder/300/400', 
        photoType: 'profile', 
        isPrimary: true, 
        isVerified: true, 
        uploadDate: new Date(), 
        displayOrder: 0, 
        privacyLevel: 'public' 
      }],
      education: [{ 
        id: '1', 
        profileId: '1', 
        educationLevel: 'bachelors', 
        degreeName: 'B.Tech Computer Science', 
        institutionName: 'IIT Mumbai', 
        isHighestEducation: true 
      }],
      professional: [{ 
        id: '1', 
        profileId: '1', 
        occupation: 'Software Engineer', 
        companyName: 'Tech Corp', 
        isCurrentJob: true, 
        willingToRelocateForWork: false 
      }],
      family: {
        id: '1',
        profileId: '1',
        familyType: 'nuclear',
        familyValues: 'moderate',
        fatherLivingStatus: 'alive',
        motherLivingStatus: 'alive',
        totalBrothers: 1,
        marriedBrothers: 0,
        totalSisters: 0,
        marriedSisters: 0,
        fatherOccupation: 'Business',
        motherOccupation: 'Teacher'
      },
      lifestyle: {
        id: '1',
        profileId: '1',
        diet: 'vegetarian',
        drinking: 'never',
        smoking: 'never',
        musicPreferences: [],
        moviePreferences: [],
        sportsInterests: []
      },
      partnerPreferences: {
        id: '1',
        profileId: '1',
        ageMin: 26,
        ageMax: 32,
        heightMinCm: 170,
        heightMaxCm: 185,
        maritalStatusPreference: ['never_married'],
        preferredCountries: ['India'],
        preferredStates: ['Maharashtra', 'Karnataka'],
        preferredCities: [],
        educationPreference: ['bachelors', 'masters'],
        occupationPreference: [],
        religionPreference: ['Hindu'],
        castePreference: [],
        dietPreference: ['vegetarian'],
        drinkingPreference: ['never'],
        smokingPreference: ['never'],
        complexionPreference: [],
        bodyTypePreference: [],
        familyTypePreference: [],
        familyValuesPreference: []
      }
    },
    // Add more mock profiles...
  ];

  useEffect(() => {
    // Load initial results
    if (searchResults.length === 0) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    setSearching(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock profiles based on current filters
      let filteredProfiles = mockProfiles;
      
      if (filters.ageMin || filters.ageMax) {
        filteredProfiles = filteredProfiles.filter(profile => {
          const age = profile.age;
          return (!filters.ageMin || age >= filters.ageMin) && 
                 (!filters.ageMax || age <= filters.ageMax);
        });
      }
      
      if (quickSearch) {
        filteredProfiles = filteredProfiles.filter(profile =>
          `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(quickSearch.toLowerCase()) ||
          profile.professional[0]?.occupation?.toLowerCase().includes(quickSearch.toLowerCase())
        );
      }
      
      setSearchResults(filteredProfiles, filteredProfiles.length, 1, 1);
      
      toast({
        title: 'Search Complete',
        description: `Found ${filteredProfiles.length} matching profiles`,
      });
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleSendInterest = (profileId: string) => {
    const profile = searchResults.find(p => p.id === profileId);
    if (profile) {
      const interest = {
        id: Date.now().toString(),
        senderProfileId: 'current-user-id',
        receiverProfileId: profileId,
        interestType: 'regular' as const,
        status: 'pending' as const,
        sentAt: new Date(),
        receiverProfile: profile,
      };
      
      addSentInterest(interest);
      
      toast({
        title: 'Interest Sent!',
        description: `Your interest has been sent to ${profile.firstName}`,
      });
    }
  };

  const handleShortlist = (profileId: string) => {
    const profile = searchResults.find(p => p.id === profileId);
    const isShortlisted = useIsProfileShortlisted(profileId);
    
    if (profile) {
      if (isShortlisted) {
        removeFromShortlist(profileId);
        toast({
          title: 'Removed from Shortlist',
          description: `${profile.firstName} has been removed from your shortlist`,
        });
      } else {
        addToShortlist(profile);
        toast({
          title: 'Added to Shortlist',
          description: `${profile.firstName} has been added to your shortlist`,
        });
      }
    }
  };

  const handleViewProfile = (profile: UserProfile) => {
    addToRecentlyViewed(profile);
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreProfiles) return;
    
    setLoadingMore(true);
    try {
      // Simulate API call for more profiles
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate more mock profiles
      const moreProfiles = [
        {
          ...mockProfiles[0],
          id: `${Date.now()}-1`,
          firstName: 'Kavya',
          lastName: 'Reddy',
          age: 25,
          city: 'Hyderabad',
          state: 'Telangana',
        },
        {
          ...mockProfiles[0],
          id: `${Date.now()}-2`,
          firstName: 'Shreya',
          lastName: 'Gupta',
          age: 27,
          city: 'Pune',
          state: 'Maharashtra',
        },
      ];
      
      // Add to existing results
      const updatedResults = [...searchResults, ...moreProfiles];
      setSearchResults(updatedResults, updatedResults.length, 1, 1);
      
      // Simulate end of results after a few loads
      if (updatedResults.length > 10) {
        setHasMoreProfiles(false);
      }
      
      toast({
        title: 'More Profiles Loaded',
        description: `Loaded ${moreProfiles.length} more profiles`,
      });
    } catch (error) {
      toast({
        title: 'Failed to Load More',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const formatHeight = (heightCm: number) => {
    const feet = Math.floor(heightCm / 30.48);
    const inches = Math.round((heightCm % 30.48) / 2.54);
    return `${feet}'${inches}"`;
  };

  const getLocationString = (city?: string, state?: string) => {
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'Location not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Profiles</h1>
              {hasActiveFilters && (
                <p className="text-sm text-gray-600 mt-1">
                  {totalResults} profiles found with active filters
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Filters</h2>
              
              {/* Quick Search */}
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or profession"
                    className="pl-10"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Age Range */}
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range: {filters.ageMin || 18} - {filters.ageMax || 35} years
                </Label>
                <Slider
                  value={[filters.ageMin || 18, filters.ageMax || 35]}
                  onValueChange={(value) => {
                    updateFilter('ageMin', value[0]);
                    updateFilter('ageMax', value[1]);
                  }}
                  max={60}
                  min={18}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch} 
                className="w-full bg-rose-600 hover:bg-rose-700 mb-3"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search Profiles'}
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {totalResults} profiles found
                  </h3>
                  <p className="text-sm text-gray-600">
                    {hasActiveFilters ? 'Showing filtered results' : 'Showing all profiles'}
                  </p>
                </div>
                
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="age-low">Age: Low to High</SelectItem>
                    <SelectItem value="age-high">Age: High to Low</SelectItem>
                    <SelectItem value="last-active">Recently Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profile Cards */}
            {isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResults.map((profile) => {
                  const isShortlisted = useIsProfileShortlisted(profile.id);
                  const primaryPhoto = profile.photos?.find(p => p.isPrimary)?.photoUrl || '/api/placeholder/300/400';
                  
                  return (
                    <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={primaryPhoto}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="w-full h-64 object-cover"
                        />
                        
                        {/* Verification Badge */}
                        {profile.isVerified && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-green-500 text-white">
                              ✓ Verified
                            </Badge>
                          </div>
                        )}
                        
                        {/* Match Score */}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-rose-500 text-white">
                            {profile.profileCompletionPercentage}% Complete
                          </Badge>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white"
                            onClick={() => handleShortlist(profile.id)}
                          >
                            {isShortlisted ? (
                              <BookmarkCheck className="h-4 w-4 text-rose-500" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white"
                            onClick={() => handleViewProfile(profile)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {profile.age} years • {formatHeight(profile.heightCm || 165)}
                          </p>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            {getLocationString(profile.city, profile.state)}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                            {profile.professional?.[0]?.occupation || 'Not specified'}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
                            {profile.education?.[0]?.degreeName || 'Not specified'}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-rose-600 hover:bg-rose-700"
                            onClick={() => handleSendInterest(profile.id)}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            Send Interest
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleViewProfile(profile)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {/* Load More */}
            {searchResults.length > 0 && hasMoreProfiles && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More Profiles'}
                </Button>
              </div>
            )}
            
            {/* No More Results */}
            {!hasMoreProfiles && searchResults.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-gray-500">No more profiles to show</p>
              </div>
            )}
            
            {/* No Results */}
            {!isSearching && searchResults.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No profiles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters to find more matches
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        profile={selectedProfile}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedProfile(null);
        }}
      />
    </div>
  );
}
