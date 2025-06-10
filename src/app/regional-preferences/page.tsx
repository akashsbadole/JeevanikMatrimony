'use client';

import { useState } from 'react';
import { Globe, MapPin, Heart, Star, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegionalPreferencesPage() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedFestivals, setSelectedFestivals] = useState<string[]>([]);

  const indianStates = [
    { id: 'maharashtra', name: 'Maharashtra', capital: 'Mumbai', language: 'Marathi' },
    { id: 'karnataka', name: 'Karnataka', capital: 'Bangalore', language: 'Kannada' },
    { id: 'tamil-nadu', name: 'Tamil Nadu', capital: 'Chennai', language: 'Tamil' },
    { id: 'gujarat', name: 'Gujarat', capital: 'Gandhinagar', language: 'Gujarati' },
    { id: 'rajasthan', name: 'Rajasthan', capital: 'Jaipur', language: 'Hindi' },
    { id: 'punjab', name: 'Punjab', capital: 'Chandigarh', language: 'Punjabi' },
    { id: 'west-bengal', name: 'West Bengal', capital: 'Kolkata', language: 'Bengali' },
    { id: 'kerala', name: 'Kerala', capital: 'Thiruvananthapuram', language: 'Malayalam' },
    { id: 'andhra-pradesh', name: 'Andhra Pradesh', capital: 'Amaravati', language: 'Telugu' },
    { id: 'odisha', name: 'Odisha', capital: 'Bhubaneswar', language: 'Odia' },
  ];

  const languages = [
    { id: 'hindi', name: 'Hindi', speakers: '600M+', script: 'Devanagari' },
    { id: 'english', name: 'English', speakers: '125M+', script: 'Latin' },
    { id: 'bengali', name: 'Bengali', speakers: '100M+', script: 'Bengali' },
    { id: 'marathi', name: 'Marathi', speakers: '83M+', script: 'Devanagari' },
    { id: 'telugu', name: 'Telugu', speakers: '81M+', script: 'Telugu' },
    { id: 'tamil', name: 'Tamil', speakers: '75M+', script: 'Tamil' },
    { id: 'gujarati', name: 'Gujarati', speakers: '56M+', script: 'Gujarati' },
    { id: 'urdu', name: 'Urdu', speakers: '52M+', script: 'Arabic' },
    { id: 'kannada', name: 'Kannada', speakers: '44M+', script: 'Kannada' },
    { id: 'malayalam', name: 'Malayalam', speakers: '35M+', script: 'Malayalam' },
    { id: 'punjabi', name: 'Punjabi', speakers: '33M+', script: 'Gurmukhi' },
    { id: 'odia', name: 'Odia', speakers: '38M+', script: 'Odia' },
  ];

  const regionalCuisines = [
    { id: 'north-indian', name: 'North Indian', description: 'Rich gravies, naan, tandoor dishes' },
    { id: 'south-indian', name: 'South Indian', description: 'Rice-based, coconut, spices' },
    { id: 'gujarati', name: 'Gujarati', description: 'Sweet and savory, vegetarian' },
    { id: 'punjabi', name: 'Punjabi', description: 'Butter-rich, hearty meals' },
    { id: 'bengali', name: 'Bengali', description: 'Fish, rice, sweets' },
    { id: 'maharashtrian', name: 'Maharashtrian', description: 'Spicy, street food culture' },
    { id: 'rajasthani', name: 'Rajasthani', description: 'Dal-baati, desert cuisine' },
    { id: 'kerala', name: 'Kerala', description: 'Coconut-based, seafood' },
    { id: 'hyderabadi', name: 'Hyderabadi', description: 'Biryani, Mughlai influence' },
    { id: 'kashmiri', name: 'Kashmiri', description: 'Aromatic spices, wazwan' },
  ];

  const festivals = [
    { id: 'diwali', name: 'Diwali', type: 'Hindu', season: 'Autumn', description: 'Festival of Lights' },
    { id: 'holi', name: 'Holi', type: 'Hindu', season: 'Spring', description: 'Festival of Colors' },
    { id: 'eid', name: 'Eid', type: 'Islamic', season: 'Variable', description: 'Festival of Breaking Fast' },
    { id: 'christmas', name: 'Christmas', type: 'Christian', season: 'Winter', description: 'Birth of Jesus Christ' },
    { id: 'dussehra', name: 'Dussehra', type: 'Hindu', season: 'Autumn', description: 'Victory of Good over Evil' },
    { id: 'ganesh-chaturthi', name: 'Ganesh Chaturthi', type: 'Hindu', season: 'Monsoon', description: 'Lord Ganesha Festival' },
    { id: 'karva-chauth', name: 'Karva Chauth', type: 'Hindu', season: 'Autumn', description: 'Married Women\'s Fast' },
    { id: 'navratri', name: 'Navratri', type: 'Hindu', season: 'Autumn', description: 'Nine Nights of Goddess' },
    { id: 'onam', name: 'Onam', type: 'Hindu', season: 'Monsoon', description: 'Kerala Harvest Festival' },
    { id: 'pongal', name: 'Pongal', type: 'Hindu', season: 'Winter', description: 'Tamil Harvest Festival' },
  ];

  const culturalValues = [
    { id: 'traditional', name: 'Traditional', description: 'Strong adherence to customs and rituals' },
    { id: 'modern', name: 'Modern', description: 'Contemporary lifestyle with cultural awareness' },
    { id: 'balanced', name: 'Balanced', description: 'Mix of traditional values and modern thinking' },
    { id: 'progressive', name: 'Progressive', description: 'Forward-thinking with respect for heritage' },
  ];

  const weddingStyles = [
    { id: 'traditional', name: 'Traditional Wedding', description: 'Full rituals, extended ceremonies' },
    { id: 'modern', name: 'Modern Wedding', description: 'Contemporary style with key rituals' },
    { id: 'destination', name: 'Destination Wedding', description: 'Wedding at exotic locations' },
    { id: 'simple', name: 'Simple Wedding', description: 'Intimate ceremony with close family' },
    { id: 'grand', name: 'Grand Wedding', description: 'Elaborate celebration with all traditions' },
  ];

  const handleRegionToggle = (regionId: string) => {
    setSelectedRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId) 
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Globe className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Regional Preferences</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Customize your matrimony experience based on your cultural background and regional preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="regions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="cuisine">Cuisine</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
          </TabsList>

          {/* Regions Tab */}
          <TabsContent value="regions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Preferred Regions & States
                </CardTitle>
                <p className="text-gray-600">
                  Select the regions where you'd like to find matches. This helps us show you profiles from your preferred areas.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {indianStates.map((state) => (
                    <div
                      key={state.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedRegions.includes(state.id)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleRegionToggle(state.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{state.name}</h3>
                        <Checkbox 
                          checked={selectedRegions.includes(state.id)}
                          onChange={() => handleRegionToggle(state.id)}
                        />
                      </div>
                      <p className="text-sm text-gray-600">Capital: {state.capital}</p>
                      <p className="text-sm text-gray-600">Language: {state.language}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {selectedRegions.length} regions selected
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Save Regional Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Language Preferences
                </CardTitle>
                <p className="text-gray-600">
                  Select languages you speak or prefer for communication. This helps in better matching.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {languages.map((language) => (
                    <div
                      key={language.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedLanguages.includes(language.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleLanguageToggle(language.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{language.name}</h3>
                        <Checkbox 
                          checked={selectedLanguages.includes(language.id)}
                          onChange={() => handleLanguageToggle(language.id)}
                        />
                      </div>
                      <p className="text-sm text-gray-600">Speakers: {language.speakers}</p>
                      <p className="text-sm text-gray-600">Script: {language.script}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Communication Preference</h4>
                  <Select>
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue placeholder="Primary communication language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="regional">Regional Language</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cuisine Tab */}
          <TabsContent value="cuisine">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Cuisine Preferences
                </CardTitle>
                <p className="text-gray-600">
                  Share your food preferences to find matches with similar tastes and dietary habits.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {regionalCuisines.map((cuisine) => (
                    <div
                      key={cuisine.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedCuisines.includes(cuisine.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedCuisines(prev => 
                          prev.includes(cuisine.id) 
                            ? prev.filter(id => id !== cuisine.id)
                            : [...prev, cuisine.id]
                        );
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{cuisine.name}</h3>
                        <Checkbox 
                          checked={selectedCuisines.includes(cuisine.id)}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{cuisine.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Festivals Tab */}
          <TabsContent value="festivals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Festival & Celebration Preferences
                </CardTitle>
                <p className="text-gray-600">
                  Select festivals and celebrations that are important to you and your family.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {festivals.map((festival) => (
                    <div
                      key={festival.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedFestivals.includes(festival.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedFestivals(prev => 
                          prev.includes(festival.id) 
                            ? prev.filter(id => id !== festival.id)
                            : [...prev, festival.id]
                        );
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{festival.name}</h3>
                        <Checkbox 
                          checked={selectedFestivals.includes(festival.id)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">{festival.type}</Badge>
                        <p className="text-sm text-gray-600">{festival.description}</p>
                        <p className="text-xs text-gray-500">Season: {festival.season}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Culture Tab */}
          <TabsContent value="culture">
            <div className="space-y-6">
              {/* Cultural Values */}
              <Card>
                <CardHeader>
                  <CardTitle>Cultural Values & Lifestyle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {culturalValues.map((value) => (
                      <div key={value.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{value.name}</h3>
                        <p className="text-sm text-gray-600">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Wedding Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Wedding Style Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weddingStyles.map((style) => (
                      <div key={style.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{style.name}</h3>
                        <p className="text-sm text-gray-600">{style.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Religious Observance */}
              <Card>
                <CardHeader>
                  <CardTitle>Religious Observance Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select>
                    <SelectTrigger className="w-full max-w-md">
                      <SelectValue placeholder="Select your religious observance level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very_religious">Very Religious - Strict adherence to all practices</SelectItem>
                      <SelectItem value="moderately_religious">Moderately Religious - Follow major practices</SelectItem>
                      <SelectItem value="culturally_religious">Culturally Religious - Celebrate festivals and traditions</SelectItem>
                      <SelectItem value="not_religious">Not Religious - Respect traditions but not practicing</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save All Preferences */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            <Star className="h-5 w-5 mr-2" />
            Save All Regional Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
