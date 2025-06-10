'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, MapPin, Camera, Heart, User, Briefcase, GraduationCap, Home, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { locationService } from '@/lib/services/location-service';

interface OnboardingData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  
  // Step 2: Location
  currentCity: string;
  currentState: string;
  hometown: string;
  coordinates?: { lat: number; lng: number };
  
  // Step 3: Education & Career
  education: string;
  occupation: string;
  company: string;
  annualIncome: string;
  
  // Step 4: Family & Background
  religion: string;
  caste: string;
  motherTongue: string;
  familyType: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  
  // Step 5: Physical Attributes
  height: string;
  weight: string;
  bodyType: string;
  complexion: string;
  
  // Step 6: Lifestyle & Interests
  diet: string;
  drinking: string;
  smoking: string;
  hobbies: string[];
  interests: string[];
  
  // Step 7: Partner Preferences
  preferredAgeMin: string;
  preferredAgeMax: string;
  preferredHeight: string;
  preferredEducation: string;
  preferredOccupation: string;
  preferredLocation: string;
  preferredIncome: string;
  
  // Step 8: About & Photos
  aboutMe: string;
  lookingFor: string;
  profilePhotos: string[];
}

const TOTAL_STEPS = 8;

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
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
    preferredAgeMin: '',
    preferredAgeMax: '',
    preferredHeight: '',
    preferredEducation: '',
    preferredOccupation: '',
    preferredLocation: '',
    preferredIncome: '',
    aboutMe: '',
    lookingFor: '',
    profilePhotos: [],
  });

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    // Pre-fill user data from Clerk
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumbers[0]?.phoneNumber || '',
      }));
    }
  }, [user]);

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const detectLocation = async () => {
    setIsLoading(true);
    try {
      const location = await locationService.getLocationWithFallback();
      updateFormData('currentCity', location.city || '');
      updateFormData('currentState', location.state || '');
      updateFormData('coordinates', { lat: location.latitude, lng: location.longitude });
      
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

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Here you would save the data to your database
      console.log('Onboarding data:', formData);
      
      toast({
        title: 'Profile Created Successfully!',
        description: 'Welcome to Indian Matrimony. Your profile is now live.',
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (step: number) => {
    const icons = [
      User, MapPin, Briefcase, Home, Heart, Star, Heart, Camera
    ];
    const IconComponent = icons[step - 1];
    return <IconComponent className="h-5 w-5" />;
  };

  const getStepTitle = (step: number) => {
    const titles = [
      'Basic Information',
      'Location Details',
      'Education & Career',
      'Family Background',
      'Physical Attributes',
      'Lifestyle & Interests',
      'Partner Preferences',
      'About & Photos'
    ];
    return titles[step - 1];
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender;
      case 2:
        return formData.currentCity && formData.currentState;
      case 3:
        return formData.education && formData.occupation;
      case 4:
        return formData.religion && formData.motherTongue;
      case 5:
        return formData.height && formData.complexion;
      case 6:
        return formData.diet && formData.hobbies.length > 0;
      case 7:
        return formData.preferredAgeMin && formData.preferredAgeMax;
      case 8:
        return formData.aboutMe && formData.lookingFor;
      default:
        return false;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us find your perfect match by completing your profile</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Step {currentStep} of {TOTAL_STEPS}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / TOTAL_STEPS) * 100} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step < currentStep
                    ? 'bg-green-600 border-green-600 text-white'
                    : step === currentStep
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {step < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  getStepIcon(step)
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {getStepIcon(currentStep)}
              <span className="ml-2">{getStepTitle(currentStep)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Location Information</h3>
                  <Button onClick={detectLocation} disabled={isLoading} variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    {isLoading ? 'Detecting...' : 'Detect Location'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currentCity">Current City *</Label>
                    <Input
                      id="currentCity"
                      value={formData.currentCity}
                      onChange={(e) => updateFormData('currentCity', e.target.value)}
                      placeholder="Enter your current city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentState">Current State *</Label>
                    <Input
                      id="currentState"
                      value={formData.currentState}
                      onChange={(e) => updateFormData('currentState', e.target.value)}
                      placeholder="Enter your current state"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="hometown">Hometown</Label>
                    <Input
                      id="hometown"
                      value={formData.hometown}
                      onChange={(e) => updateFormData('hometown', e.target.value)}
                      placeholder="Enter your hometown"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional steps would be implemented here... */}
            {/* For brevity, I'll show the structure for the remaining steps */}
            
            {currentStep > 2 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Step {currentStep}: {getStepTitle(currentStep)}
                </h3>
                <p className="text-gray-600 mb-6">
                  This step is under construction. Click Next to continue.
                </p>
                <div className="bg-gray-100 rounded-lg p-8">
                  <p className="text-sm text-gray-500">
                    Step {currentStep} form fields will be implemented here
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === TOTAL_STEPS ? (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid(currentStep) || isLoading}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isLoading ? 'Creating Profile...' : 'Complete Profile'}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
