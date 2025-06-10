'use client';

import { useState, useEffect } from 'react';
import { SwipeInterface } from '@/components/matching/swipe-interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Star, Settings } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  age: number;
  height: string;
  profession: string;
  education: string;
  location: string;
  photos: string[];
  bio: string;
  interests: string[];
  isVerified: boolean;
  isOnline: boolean;
  lastActive: string;
  compatibility: number;
  religion: string;
  caste: string;
  motherTongue: string;
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState({
    todayLikes: 0,
    todayMatches: 0,
    totalLikes: 0,
    remainingLikes: 10
  });

  useEffect(() => {
    // Mock profiles data
    const mockProfiles: Profile[] = [
      {
        id: '1',
        name: 'Priya Sharma',
        age: 26,
        height: '5\'4"',
        profession: 'Software Engineer',
        education: 'B.Tech Computer Science',
        location: 'Mumbai, Maharashtra',
        photos: ['/api/placeholder/400/600', '/api/placeholder/400/600', '/api/placeholder/400/600'],
        bio: 'Love traveling, reading books, and exploring new cuisines. Looking for someone who shares similar interests and values.',
        interests: ['Travel', 'Reading', 'Cooking', 'Music', 'Photography'],
        isVerified: true,
        isOnline: true,
        lastActive: 'Online now',
        compatibility: 92,
        religion: 'Hindu',
        caste: 'Brahmin',
        motherTongue: 'Hindi'
      },
      {
        id: '2',
        name: 'Anita Patel',
        age: 24,
        height: '5\'2"',
        profession: 'Doctor',
        education: 'MBBS',
        location: 'Ahmedabad, Gujarat',
        photos: ['/api/placeholder/400/600', '/api/placeholder/400/600'],
        bio: 'Passionate about helping others and making a difference. Love classical music and traditional dance.',
        interests: ['Medicine', 'Classical Music', 'Dance', 'Yoga', 'Volunteering'],
        isVerified: true,
        isOnline: false,
        lastActive: '2 hours ago',
        compatibility: 88,
        religion: 'Hindu',
        caste: 'Patel',
        motherTongue: 'Gujarati'
      },
      {
        id: '3',
        name: 'Kavya Reddy',
        age: 28,
        height: '5\'6"',
        profession: 'Marketing Manager',
        education: 'MBA Marketing',
        location: 'Bangalore, Karnataka',
        photos: ['/api/placeholder/400/600', '/api/placeholder/400/600', '/api/placeholder/400/600', '/api/placeholder/400/600'],
        bio: 'Creative professional who loves art, movies, and good food. Seeking a life partner who appreciates life\'s simple pleasures.',
        interests: ['Art', 'Movies', 'Food', 'Travel', 'Fitness'],
        isVerified: true,
        isOnline: true,
        lastActive: 'Online now',
        compatibility: 85,
        religion: 'Hindu',
        caste: 'Reddy',
        motherTongue: 'Telugu'
      },
      {
        id: '4',
        name: 'Sneha Singh',
        age: 25,
        height: '5\'3"',
        profession: 'Teacher',
        education: 'M.Ed',
        location: 'Delhi, Delhi',
        photos: ['/api/placeholder/400/600', '/api/placeholder/400/600'],
        bio: 'Educator by profession, learner by nature. Love spending time with family and exploring new places.',
        interests: ['Teaching', 'Reading', 'Family Time', 'Nature', 'Spirituality'],
        isVerified: false,
        isOnline: false,
        lastActive: '1 day ago',
        compatibility: 90,
        religion: 'Hindu',
        caste: 'Rajput',
        motherTongue: 'Hindi'
      },
      {
        id: '5',
        name: 'Meera Iyer',
        age: 27,
        height: '5\'5"',
        profession: 'Chartered Accountant',
        education: 'CA, B.Com',
        location: 'Chennai, Tamil Nadu',
        photos: ['/api/placeholder/400/600', '/api/placeholder/400/600', '/api/placeholder/400/600'],
        bio: 'Numbers person by day, creative soul by night. Love classical music, cooking, and spending time with loved ones.',
        interests: ['Finance', 'Music', 'Cooking', 'Books', 'Temple Visits'],
        isVerified: true,
        isOnline: true,
        lastActive: 'Online now',
        compatibility: 87,
        religion: 'Hindu',
        caste: 'Iyer',
        motherTongue: 'Tamil'
      }
    ];

    setProfiles(mockProfiles);
  }, []);

  const handleLike = (profileId: string) => {
    setStats(prev => ({
      ...prev,
      todayLikes: prev.todayLikes + 1,
      totalLikes: prev.totalLikes + 1,
      remainingLikes: Math.max(0, prev.remainingLikes - 1)
    }));
    
    // Simulate match (20% chance)
    if (Math.random() < 0.2) {
      setStats(prev => ({
        ...prev,
        todayMatches: prev.todayMatches + 1
      }));
    }
  };

  const handlePass = (profileId: string) => {
    // Handle pass logic
    console.log('Passed profile:', profileId);
  };

  const handleSuperLike = (profileId: string) => {
    setStats(prev => ({
      ...prev,
      todayLikes: prev.todayLikes + 1,
      totalLikes: prev.totalLikes + 1,
      remainingLikes: Math.max(0, prev.remainingLikes - 1)
    }));
    
    // Simulate match (50% chance for super like)
    if (Math.random() < 0.5) {
      setStats(prev => ({
        ...prev,
        todayMatches: prev.todayMatches + 1
      }));
    }
  };

  const handleMessage = (profileId: string) => {
    // Navigate to messaging
    console.log('Message profile:', profileId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Your Perfect Match</h1>
          <p className="text-gray-600">Swipe through profiles and find your life partner</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Heart className="h-5 w-5 mr-2 text-rose-600" />
                  Today's Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Likes Sent</span>
                  <Badge variant="outline">{stats.todayLikes}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Matches</span>
                  <Badge className="bg-green-100 text-green-800">{stats.todayMatches}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Remaining Likes</span>
                  <Badge variant={stats.remainingLikes > 5 ? "outline" : "destructive"}>
                    {stats.remainingLikes}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Settings className="h-5 w-5 mr-2 text-gray-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View Matches
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Discovery Settings
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">💡 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Complete your profile for better matches</li>
                  <li>• Add more photos to increase likes</li>
                  <li>• Use Super Like for special profiles</li>
                  <li>• Check compatibility scores</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Swipe Interface */}
          <div className="lg:col-span-2">
            <SwipeInterface
              profiles={profiles}
              onLike={handleLike}
              onPass={handlePass}
              onSuperLike={handleSuperLike}
              onMessage={handleMessage}
            />
          </div>

          {/* Right Sidebar - Recent Activity */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Heart className="h-5 w-5 mr-2 text-rose-600" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.todayMatches > 0 ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Heart className="h-8 w-8 text-rose-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {stats.todayMatches} New Match{stats.todayMatches > 1 ? 'es' : ''}!
                      </p>
                      <p className="text-xs text-gray-600">Start a conversation</p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No matches yet today</p>
                      <p className="text-xs">Keep swiping!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Prompt */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-900 mb-2">Unlock Premium Features</h3>
                <p className="text-sm text-purple-700 mb-4">
                  Get unlimited likes, see who liked you, and boost your profile
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
