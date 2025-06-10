'use client';

import { useState } from 'react';
import { Heart, Clock, Check, X, Eye, MessageCircle, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, calculateAge, formatHeight } from '@/lib/utils';

export default function InterestsPage() {
  const [activeTab, setActiveTab] = useState('received');

  // Mock data for interests
  const interestsReceived = [
    {
      id: '1',
      sender: {
        id: 'user1',
        firstName: 'Priya',
        lastName: 'Sharma',
        age: 26,
        profilePhotoUrl: '/api/placeholder/150/200',
        city: 'Mumbai',
        state: 'Maharashtra',
        occupation: 'Software Engineer',
        education: 'B.Tech Computer Science',
        heightCm: 165,
        isVerified: true,
      },
      interestType: 'standard',
      message: 'Hi! I found your profile interesting and would like to connect. Looking forward to hearing from you.',
      sentAt: new Date('2024-01-15'),
      status: 'pending',
    },
    {
      id: '2',
      sender: {
        id: 'user2',
        firstName: 'Anita',
        lastName: 'Patel',
        age: 24,
        profilePhotoUrl: '/api/placeholder/150/200',
        city: 'Ahmedabad',
        state: 'Gujarat',
        occupation: 'Doctor',
        education: 'MBBS',
        heightCm: 160,
        isVerified: true,
      },
      interestType: 'premium',
      message: 'Hello! Your profile caught my attention. I believe we share similar values and interests.',
      sentAt: new Date('2024-01-14'),
      status: 'pending',
    },
  ];

  const interestsSent = [
    {
      id: '3',
      receiver: {
        id: 'user3',
        firstName: 'Deepika',
        lastName: 'Singh',
        age: 28,
        profilePhotoUrl: '/api/placeholder/150/200',
        city: 'Delhi',
        state: 'Delhi',
        occupation: 'Marketing Manager',
        education: 'MBA Marketing',
        heightCm: 168,
        isVerified: true,
      },
      interestType: 'standard',
      message: 'Hi Deepika! I really liked your profile and would love to get to know you better.',
      sentAt: new Date('2024-01-13'),
      status: 'pending',
    },
    {
      id: '4',
      receiver: {
        id: 'user4',
        firstName: 'Kavya',
        lastName: 'Reddy',
        age: 25,
        profilePhotoUrl: '/api/placeholder/150/200',
        city: 'Hyderabad',
        state: 'Telangana',
        occupation: 'Teacher',
        education: 'M.Ed',
        heightCm: 162,
        isVerified: true,
      },
      interestType: 'standard',
      message: 'Hello! I found your profile very interesting. Would love to connect.',
      sentAt: new Date('2024-01-12'),
      status: 'accepted',
    },
  ];

  const handleAcceptInterest = (interestId: string) => {
    console.log('Accepting interest:', interestId);
    // Handle accept logic
  };

  const handleDeclineInterest = (interestId: string) => {
    console.log('Declining interest:', interestId);
    // Handle decline logic
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'declined':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Declined</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getInterestTypeBadge = (type: string) => {
    switch (type) {
      case 'premium':
        return <Badge className="bg-purple-500">Premium</Badge>;
      case 'super':
        return <Badge className="bg-gold-500">Super</Badge>;
      default:
        return <Badge variant="outline">Standard</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interests</h1>
              <p className="text-gray-600">Manage your sent and received interests</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-600">{interestsReceived.length}</div>
                <div className="text-sm text-gray-600">Received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{interestsSent.length}</div>
                <div className="text-sm text-gray-600">Sent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Received ({interestsReceived.length})</span>
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Sent ({interestsSent.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Received Interests */}
          <TabsContent value="received" className="mt-6">
            <div className="space-y-6">
              {interestsReceived.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No interests received yet</h3>
                    <p className="text-gray-600">When someone shows interest in your profile, it will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                interestsReceived.map((interest) => (
                  <Card key={interest.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={interest.sender.profilePhotoUrl}
                              alt={`${interest.sender.firstName} ${interest.sender.lastName}`}
                              className="w-32 h-40 object-cover rounded-lg"
                            />
                            {interest.sender.isVerified && (
                              <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Profile Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {interest.sender.firstName} {interest.sender.lastName}
                              </h3>
                              <p className="text-gray-600">
                                {calculateAge(new Date(Date.now() - interest.sender.age * 365 * 24 * 60 * 60 * 1000))} years • {formatHeight(interest.sender.heightCm)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {getInterestTypeBadge(interest.interestType)}
                              {getStatusBadge(interest.status)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {interest.sender.city}, {interest.sender.state}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Briefcase className="h-4 w-4 mr-2" />
                              {interest.sender.occupation}
                            </div>
                          </div>

                          {/* Interest Message */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                            <p className="text-gray-700 text-sm">{interest.message}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Sent {formatDate(interest.sentAt, 'relative')}
                            </div>
                            
                            {interest.status === 'pending' && (
                              <div className="flex space-x-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeclineInterest(interest.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Decline
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-rose-600 hover:bg-rose-700"
                                  onClick={() => handleAcceptInterest(interest.id)}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Sent Interests */}
          <TabsContent value="sent" className="mt-6">
            <div className="space-y-6">
              {interestsSent.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No interests sent yet</h3>
                    <p className="text-gray-600">Start browsing profiles and send interests to connect with potential matches.</p>
                    <Button className="mt-4 bg-rose-600 hover:bg-rose-700">
                      Browse Profiles
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                interestsSent.map((interest) => (
                  <Card key={interest.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={interest.receiver.profilePhotoUrl}
                              alt={`${interest.receiver.firstName} ${interest.receiver.lastName}`}
                              className="w-32 h-40 object-cover rounded-lg"
                            />
                            {interest.receiver.isVerified && (
                              <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Profile Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {interest.receiver.firstName} {interest.receiver.lastName}
                              </h3>
                              <p className="text-gray-600">
                                {calculateAge(new Date(Date.now() - interest.receiver.age * 365 * 24 * 60 * 60 * 1000))} years • {formatHeight(interest.receiver.heightCm)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {getInterestTypeBadge(interest.interestType)}
                              {getStatusBadge(interest.status)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {interest.receiver.city}, {interest.receiver.state}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Briefcase className="h-4 w-4 mr-2" />
                              {interest.receiver.occupation}
                            </div>
                          </div>

                          {/* Your Message */}
                          <div className="bg-rose-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Your Message:</h4>
                            <p className="text-gray-700 text-sm">{interest.message}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Sent {formatDate(interest.sentAt, 'relative')}
                            </div>
                            
                            <div className="flex space-x-3">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>
                              
                              {interest.status === 'accepted' && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Start Chat
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
