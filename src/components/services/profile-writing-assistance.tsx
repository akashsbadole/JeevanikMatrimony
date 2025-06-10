'use client';

import { useState } from 'react';
import { Edit3, Sparkles, CheckCircle, User, FileText, Star, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface ProfileWriter {
  id: string;
  name: string;
  photo: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  completedProfiles: number;
  priceRange: string;
  turnaroundTime: string;
  languages: string[];
}

interface ProfilePackage {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  turnaroundTime: string;
  revisions: number;
  popular?: boolean;
}

export function ProfileWritingAssistance() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedWriter, setSelectedWriter] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState('');
  const [profileType, setProfileType] = useState('');
  const [requirements, setRequirements] = useState('');
  const { toast } = useToast();

  const writers: ProfileWriter[] = [
    {
      id: '1',
      name: 'Priya Mehta',
      photo: '/api/placeholder/100/100',
      specialization: ['Traditional Profiles', 'Family-oriented', 'Cultural Values'],
      experience: 5,
      rating: 4.9,
      reviewCount: 156,
      completedProfiles: 450,
      priceRange: '₹1,500 - ₹3,000',
      turnaroundTime: '2-3 days',
      languages: ['Hindi', 'English', 'Gujarati']
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      photo: '/api/placeholder/100/100',
      specialization: ['Professional Profiles', 'Modern Approach', 'Career-focused'],
      experience: 7,
      rating: 4.8,
      reviewCount: 203,
      completedProfiles: 680,
      priceRange: '₹2,000 - ₹4,000',
      turnaroundTime: '1-2 days',
      languages: ['Hindi', 'English', 'Punjabi']
    },
    {
      id: '3',
      name: 'Meera Iyer',
      photo: '/api/placeholder/100/100',
      specialization: ['Creative Writing', 'Unique Personalities', 'Artistic Profiles'],
      experience: 4,
      rating: 4.9,
      reviewCount: 98,
      completedProfiles: 320,
      priceRange: '₹1,800 - ₹3,500',
      turnaroundTime: '2-4 days',
      languages: ['Tamil', 'English', 'Hindi']
    }
  ];

  const packages: ProfilePackage[] = [
    {
      id: 'basic',
      name: 'Basic Profile Enhancement',
      description: 'Perfect for improving your existing profile',
      features: [
        'Profile review and analysis',
        'Improved "About Me" section',
        'Better partner preferences description',
        'Grammar and language correction',
        '1 revision included'
      ],
      price: 1500,
      turnaroundTime: '2-3 days',
      revisions: 1
    },
    {
      id: 'premium',
      name: 'Complete Profile Makeover',
      description: 'Comprehensive profile rewriting service',
      features: [
        'Complete profile rewrite',
        'Compelling "About Me" section',
        'Detailed partner preferences',
        'Family background enhancement',
        'Lifestyle and interests optimization',
        '2 revisions included',
        'Profile optimization tips'
      ],
      price: 2500,
      turnaroundTime: '3-4 days',
      revisions: 2,
      popular: true
    },
    {
      id: 'premium-plus',
      name: 'Premium Plus with Consultation',
      description: 'Complete service with personal consultation',
      features: [
        'Everything in Premium package',
        '30-minute consultation call',
        'Personalized writing strategy',
        'Multiple profile versions',
        'Photo selection guidance',
        '3 revisions included',
        'Ongoing support for 1 month'
      ],
      price: 4000,
      turnaroundTime: '4-5 days',
      revisions: 3
    }
  ];

  const sampleProfiles = {
    before: `I am a simple person who likes to spend time with family. I work in IT and earn good salary. Looking for a good girl from good family who can take care of family and is well educated.`,
    after: `I'm a passionate software engineer who finds joy in solving complex problems and creating innovative solutions. When I'm not coding, you'll find me exploring new cuisines, reading about emerging technologies, or spending quality time with my close-knit family who means the world to me.

I believe in maintaining a perfect balance between tradition and modernity. While I deeply respect our cultural values and family traditions, I also embrace progressive thinking and believe in equality and mutual respect in relationships.

I'm looking for a life partner who shares similar values - someone who is educated, independent, and has her own aspirations while also valuing family bonds. I believe that the best relationships are built on friendship, trust, and shared dreams for the future.`
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    toast({
      title: 'Package Selected',
      description: 'Please provide your current profile and requirements to proceed.',
    });
  };

  const handleWriterSelect = (writerId: string) => {
    setSelectedWriter(writerId);
    const writer = writers.find(w => w.id === writerId);
    if (writer) {
      toast({
        title: 'Writer Selected',
        description: `${writer.name} has been selected for your profile writing.`,
      });
    }
  };

  const submitRequest = () => {
    if (!selectedPackage || !currentProfile || !requirements) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Request Submitted!',
      description: 'Your profile writing request has been submitted. You will receive a confirmation email shortly.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Writing Assistance</h1>
        <p className="text-gray-600">Get professional help to create an attractive and compelling matrimony profile</p>
      </div>

      <Tabs defaultValue="packages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="writers">Writers</TabsTrigger>
          <TabsTrigger value="samples">Samples</TabsTrigger>
          <TabsTrigger value="request">Submit Request</TabsTrigger>
        </TabsList>

        {/* Packages Tab */}
        <TabsContent value="packages">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedPackage === pkg.id ? 'ring-2 ring-blue-500' : ''
                } ${pkg.popular ? 'border-blue-500' : ''}`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    ₹{pkg.price.toLocaleString()}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Turnaround Time:</span>
                    <span className="font-medium">{pkg.turnaroundTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Revisions:</span>
                    <span className="font-medium">{pkg.revisions} included</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Features Included:</h4>
                    <ul className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className={`w-full ${selectedPackage === pkg.id ? 'bg-blue-600' : ''}`}
                    variant={selectedPackage === pkg.id ? 'default' : 'outline'}
                  >
                    {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Writers Tab */}
        <TabsContent value="writers">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {writers.map((writer) => (
              <Card 
                key={writer.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedWriter === writer.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleWriterSelect(writer.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{writer.name}</h3>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(writer.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {writer.rating} ({writer.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-1">
                      {writer.specialization.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Experience:</span>
                      <div className="font-medium">{writer.experience} years</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Completed:</span>
                      <div className="font-medium">{writer.completedProfiles} profiles</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Range:</span>
                      <span className="font-medium">{writer.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Turnaround:</span>
                      <span className="font-medium">{writer.turnaroundTime}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 text-sm">Languages:</span>
                    <p className="text-sm font-medium">{writer.languages.join(', ')}</p>
                  </div>
                  
                  <Button 
                    className={`w-full ${selectedWriter === writer.id ? 'bg-blue-600' : ''}`}
                    variant={selectedWriter === writer.id ? 'default' : 'outline'}
                  >
                    {selectedWriter === writer.id ? 'Selected' : 'Select Writer'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Samples Tab */}
        <TabsContent value="samples">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Before & After Sample
                </CardTitle>
                <p className="text-gray-600">See how our professional writers transform profiles</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-red-600 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                      Before (Original Profile)
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {sampleProfiles.before}
                      </p>
                    </div>
                    <div className="mt-3 text-sm text-red-600">
                      <strong>Issues:</strong> Generic, lacks personality, poor grammar, unclear expectations
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      After (Professional Rewrite)
                    </h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {sampleProfiles.after}
                      </p>
                    </div>
                    <div className="mt-3 text-sm text-green-600">
                      <strong>Improvements:</strong> Personal, engaging, clear values, specific preferences
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-900 mb-2">3x More Profile Views</h3>
                  <p className="text-sm text-blue-700">
                    Professionally written profiles receive significantly more views and interests
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-900 mb-2">Higher Response Rate</h3>
                  <p className="text-sm text-green-700">
                    Better profiles lead to more meaningful conversations and connections
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-purple-900 mb-2">Stand Out</h3>
                  <p className="text-sm text-purple-700">
                    Unique and compelling profiles that showcase your personality effectively
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Request Tab */}
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit3 className="h-5 w-5 mr-2" />
                Submit Profile Writing Request
              </CardTitle>
              <p className="text-gray-600">Provide your details to get started with professional profile writing</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Type
                  </label>
                  <Select value={profileType} onValueChange={setProfileType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select profile type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">For Myself</SelectItem>
                      <SelectItem value="son">For Son</SelectItem>
                      <SelectItem value="daughter">For Daughter</SelectItem>
                      <SelectItem value="brother">For Brother</SelectItem>
                      <SelectItem value="sister">For Sister</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Package
                  </label>
                  <Input 
                    value={selectedPackage ? packages.find(p => p.id === selectedPackage)?.name || '' : ''} 
                    placeholder="Please select a package first"
                    readOnly 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Profile Content
                </label>
                <Textarea
                  value={currentProfile}
                  onChange={(e) => setCurrentProfile(e.target.value)}
                  placeholder="Paste your current profile content here, or write what you currently have..."
                  className="min-h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements & Preferences
                </label>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Tell us about your personality, interests, what makes you unique, what you're looking for in a partner, any specific tone or style preferences..."
                  className="min-h-32"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">💡 Tips for Better Results</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Be specific about your interests and hobbies</li>
                  <li>• Mention your career goals and achievements</li>
                  <li>• Describe your family values and traditions</li>
                  <li>• Share what you're looking for in a life partner</li>
                  <li>• Include any unique qualities or experiences</li>
                </ul>
              </div>

              <Button 
                onClick={submitRequest}
                className="w-full"
                size="lg"
              >
                Submit Request & Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
