'use client';

import { useState } from 'react';
import { X, Heart, MessageCircle, Eye, MapPin, Briefcase, GraduationCap, Star, Shield, Calendar, Phone, Mail, Camera, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/lib/stores/types';
import { useCommunicationActions } from '@/lib/stores/communication-store';
import { useSearchActions } from '@/lib/stores/search-store';

interface ProfileModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ profile, isOpen, onClose }: ProfileModalProps) {
  const { toast } = useToast();
  const [interestMessage, setInterestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  
  const { addSentInterest } = useCommunicationActions();
  const { addToRecentlyViewed, addToShortlist } = useSearchActions();

  if (!profile) return null;

  const handleSendInterest = async () => {
    setIsLoading(true);
    try {
      const interest = {
        id: Date.now().toString(),
        senderProfileId: 'current-user-id', // Would come from user store
        receiverProfileId: profile.id,
        interestType: 'regular' as const,
        status: 'pending' as const,
        message: interestMessage,
        sentAt: new Date(),
        receiverProfile: profile,
      };
      
      addSentInterest(interest);
      
      toast({
        title: 'Interest Sent Successfully!',
        description: `Your interest has been sent to ${profile.firstName}. They will be notified.`,
      });
      
      setInterestMessage('');
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to Send Interest',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShortlist = () => {
    addToShortlist(profile);
    toast({
      title: 'Added to Shortlist',
      description: `${profile.firstName} has been added to your shortlist.`,
    });
  };

  const handleViewProfile = () => {
    addToRecentlyViewed(profile);
  };

  const formatHeight = (heightCm?: number) => {
    if (!heightCm) return 'Not specified';
    const feet = Math.floor(heightCm / 30.48);
    const inches = Math.round((heightCm % 30.48) / 2.54);
    return `${feet}'${inches}" (${heightCm} cm)`;
  };

  const getLocationString = (city?: string, state?: string) => {
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'Location not specified';
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const primaryPhoto = profile.photos?.find(p => p.isPrimary)?.photoUrl || '/api/placeholder/400/500';
  const allPhotos = profile.photos?.map(p => p.photoUrl) || [primaryPhoto];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{profile.firstName} {profile.lastName}</span>
            <div className="flex items-center space-x-2">
              {profile.isVerified && (
                <Badge className="bg-green-500 text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant="outline">
                {profile.profileCompletionPercentage}% Complete
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Photos */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Main Photo */}
              <div className="relative">
                <img
                  src={allPhotos[activePhotoIndex]}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-80 object-cover rounded-lg"
                />
                {allPhotos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {allPhotos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActivePhotoIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === activePhotoIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Gallery */}
              {allPhotos.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {allPhotos.slice(0, 6).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                        index === activePhotoIndex ? 'border-rose-500' : 'border-transparent'
                      }`}
                      onClick={() => setActivePhotoIndex(index)}
                    />
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleSendInterest}
                  disabled={isLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {isLoading ? 'Sending...' : 'Send Interest'}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleShortlist}>
                    <Star className="h-4 w-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Age</span>
                        <p className="font-medium">{calculateAge(profile.dateOfBirth)} years</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Height</span>
                        <p className="font-medium">{formatHeight(profile.heightCm)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Marital Status</span>
                        <p className="font-medium capitalize">{profile.maritalStatus.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Religion</span>
                        <p className="font-medium">{profile.religion || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Caste</span>
                        <p className="font-medium">{profile.caste || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Mother Tongue</span>
                        <p className="font-medium">{profile.motherTongue || 'Not specified'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{getLocationString(profile.city, profile.state)}</span>
                    </div>
                    {profile.willingToRelocate && (
                      <p className="text-sm text-green-600 mt-2">Willing to relocate</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Education & Career</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.education && profile.education.length > 0 && (
                      <div className="flex items-start">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium">{profile.education[0].degreeName}</p>
                          <p className="text-sm text-gray-600">{profile.education[0].institutionName}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.professional && profile.professional.length > 0 && (
                      <div className="flex items-start">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium">{profile.professional[0].occupation}</p>
                          <p className="text-sm text-gray-600">{profile.professional[0].companyName}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {profile.aboutMe && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{profile.aboutMe}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Family Information */}
              <TabsContent value="family" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Family Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.family ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Family Type</span>
                            <p className="font-medium capitalize">{profile.family.familyType || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Family Values</span>
                            <p className="font-medium capitalize">{profile.family.familyValues || 'Not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Father's Occupation</span>
                            <p className="font-medium">{profile.family.fatherOccupation || 'Not specified'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Mother's Occupation</span>
                            <p className="font-medium">{profile.family.motherOccupation || 'Not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Brothers</span>
                            <p className="font-medium">{profile.family.totalBrothers} ({profile.family.marriedBrothers} married)</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Sisters</span>
                            <p className="font-medium">{profile.family.totalSisters} ({profile.family.marriedSisters} married)</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Family information not provided</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lifestyle */}
              <TabsContent value="lifestyle" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lifestyle Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.lifestyle ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Diet</span>
                          <p className="font-medium capitalize">{profile.lifestyle.diet?.replace('_', ' ') || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Drinking</span>
                          <p className="font-medium capitalize">{profile.lifestyle.drinking || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Smoking</span>
                          <p className="font-medium capitalize">{profile.lifestyle.smoking || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Exercise</span>
                          <p className="font-medium capitalize">{profile.lifestyle.exerciseHabits?.replace('_', ' ') || 'Not specified'}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Lifestyle information not provided</p>
                    )}
                  </CardContent>
                </Card>

                {profile.hobbiesInterests && profile.hobbiesInterests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Hobbies & Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.hobbiesInterests.map((hobby, index) => (
                          <Badge key={index} variant="secondary">
                            {hobby}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Partner Preferences */}
              <TabsContent value="preferences" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Partner Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.partnerPreferences ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Age Range</span>
                            <p className="font-medium">
                              {profile.partnerPreferences.ageMin || 'Any'} - {profile.partnerPreferences.ageMax || 'Any'} years
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Height Range</span>
                            <p className="font-medium">
                              {profile.partnerPreferences.heightMinCm ? formatHeight(profile.partnerPreferences.heightMinCm) : 'Any'} - 
                              {profile.partnerPreferences.heightMaxCm ? formatHeight(profile.partnerPreferences.heightMaxCm) : 'Any'}
                            </p>
                          </div>
                        </div>
                        
                        {profile.lookingFor && (
                          <div>
                            <span className="text-sm text-gray-600">Looking For</span>
                            <p className="text-gray-700 mt-1">{profile.lookingFor}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">Partner preferences not specified</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Interest Message */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Send Interest Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write a personal message (optional)..."
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  rows={3}
                  className="mb-4"
                />
                <Button
                  onClick={handleSendInterest}
                  disabled={isLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {isLoading ? 'Sending Interest...' : 'Send Interest'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
