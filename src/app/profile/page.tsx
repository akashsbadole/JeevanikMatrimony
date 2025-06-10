'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Camera, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Star, 
  Edit, 
  Save,
  X,
  Plus,
  Upload,
  Shield,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { locationService } from '@/lib/services/location-service';

interface UserProfile {
  // Basic Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  
  // Location
  currentCity: string;
  currentState: string;
  hometown: string;
  
  // Education & Career
  education: string;
  occupation: string;
  company: string;
  annualIncome: string;
  
  // Family & Background
  religion: string;
  caste: string;
  motherTongue: string;
  familyType: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  
  // Physical Attributes
  height: string;
  weight: string;
  bodyType: string;
  complexion: string;
  
  // Lifestyle
  diet: string;
  drinking: string;
  smoking: string;
  hobbies: string[];
  interests: string[];
  
  // About
  aboutMe: string;
  lookingFor: string;
  
  // Photos
  profilePhotos: string[];
  
  // Verification
  isVerified: boolean;
  verificationBadges: string[];
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    currentCity: '',
    currentState: '',
    hometown: '',
    education: '',
    occupation: '',
    company: '',
    annualIncome: '',
    religion: '',
    caste: '',
    motherTongue: '',
    familyType: '',
    fatherOccupation: '',
    motherOccupation: '',
    siblings: '',
    height: '',
    weight: '',
    bodyType: '',
    complexion: '',
    diet: '',
    drinking: '',
    smoking: '',
    hobbies: [],
    interests: [],
    aboutMe: '',
    lookingFor: '',
    profilePhotos: [],
    isVerified: false,
    verificationBadges: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    // Load profile data
    if (user) {
      setProfile(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        phoneNumber: user.phoneNumbers[0]?.phoneNumber || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    // Calculate profile completion
    const calculateCompletion = () => {
      const fields = [
        profile.firstName, profile.lastName, profile.dateOfBirth, profile.gender,
        profile.currentCity, profile.education, profile.occupation, profile.religion,
        profile.height, profile.aboutMe, profile.lookingFor
      ];
      
      const filledFields = fields.filter(field => field && field.trim() !== '').length;
      const completion = Math.round((filledFields / fields.length) * 100);
      setProfileCompletion(completion);
    };

    calculateCompletion();
  }, [profile]);

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const detectLocation = async () => {
    setIsLoading(true);
    try {
      const location = await locationService.getLocationWithFallback();
      updateProfile('currentCity', location.city || '');
      updateProfile('currentState', location.state || '');
      
      toast({
        title: 'Location Detected',
        description: `Found your location: ${location.city}, ${location.state}`,
      });
    } catch (error) {
      toast({
        title: 'Location Detection Failed',
        description: 'Please enter your location manually.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      // Here you would save to your database
      console.log('Saving profile:', profile);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addHobby = (hobby: string) => {
    if (hobby && !profile.hobbies.includes(hobby)) {
      updateProfile('hobbies', [...profile.hobbies, hobby]);
    }
  };

  const removeHobby = (hobby: string) => {
    updateProfile('hobbies', profile.hobbies.filter(h => h !== hobby));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">
                Manage your profile information and preferences
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <>
                  <Button 
                    onClick={() => setIsEditing(false)} 
                    variant="outline"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveProfile}
                    disabled={isLoading}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
              <span className="text-sm font-medium text-gray-600">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2 mb-4" />
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">Complete your profile to get better matches</span>
              </div>
              {profile.isVerified && (
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="about">About Me</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => updateProfile('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => updateProfile('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => updateProfile('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={profile.gender} 
                      onValueChange={(value) => updateProfile('gender', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled={true}
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={(e) => updateProfile('phoneNumber', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Location</h4>
                    {isEditing && (
                      <Button onClick={detectLocation} disabled={isLoading} variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {isLoading ? 'Detecting...' : 'Detect Location'}
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentCity">Current City</Label>
                      <Input
                        id="currentCity"
                        value={profile.currentCity}
                        onChange={(e) => updateProfile('currentCity', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentState">Current State</Label>
                      <Input
                        id="currentState"
                        value={profile.currentState}
                        onChange={(e) => updateProfile('currentState', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="hometown">Hometown</Label>
                      <Input
                        id="hometown"
                        value={profile.hometown}
                        onChange={(e) => updateProfile('hometown', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Education & Career */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Education & Career
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="education">Education</Label>
                      <Select 
                        value={profile.education} 
                        onValueChange={(value) => updateProfile('education', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={profile.occupation}
                        onChange={(e) => updateProfile('occupation', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => updateProfile('company', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="annualIncome">Annual Income</Label>
                      <Select 
                        value={profile.annualIncome} 
                        onValueChange={(value) => updateProfile('annualIncome', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-3">₹0 - ₹3 Lakhs</SelectItem>
                          <SelectItem value="3-5">₹3 - ₹5 Lakhs</SelectItem>
                          <SelectItem value="5-10">₹5 - ₹10 Lakhs</SelectItem>
                          <SelectItem value="10-15">₹10 - ₹15 Lakhs</SelectItem>
                          <SelectItem value="15-25">₹15 - ₹25 Lakhs</SelectItem>
                          <SelectItem value="25+">₹25+ Lakhs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Background Tab */}
          <TabsContent value="background">
            <Card>
              <CardHeader>
                <CardTitle>Family & Background</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Background Information
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This section will include family background, religion, caste, and other cultural information.
                  </p>
                  <div className="bg-gray-100 rounded-lg p-8">
                    <p className="text-sm text-gray-500">
                      Background form fields will be implemented here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lifestyle Tab */}
          <TabsContent value="lifestyle">
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle & Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Lifestyle Information
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This section will include diet preferences, hobbies, interests, and lifestyle choices.
                  </p>
                  <div className="bg-gray-100 rounded-lg p-8">
                    <p className="text-sm text-gray-500">
                      Lifestyle form fields will be implemented here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Me Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="aboutMe">About Me</Label>
                  <Textarea
                    id="aboutMe"
                    value={profile.aboutMe}
                    onChange={(e) => updateProfile('aboutMe', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="lookingFor">What I'm Looking For</Label>
                  <Textarea
                    id="lookingFor"
                    value={profile.lookingFor}
                    onChange={(e) => updateProfile('lookingFor', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Describe your ideal partner..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Profile Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Upload Your Photos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add photos to make your profile more attractive to potential matches.
                  </p>
                  <Button className="bg-rose-600 hover:bg-rose-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
