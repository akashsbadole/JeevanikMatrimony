'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Eye,
  Calendar,
  MapPin,
  Star,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    // Mock analytics data
    const mockData = {
      overview: {
        profileViews: 1234,
        profileViewsChange: 12.5,
        interestsSent: 45,
        interestsSentChange: -5.2,
        interestsReceived: 67,
        interestsReceivedChange: 23.1,
        messagesExchanged: 89,
        messagesExchangedChange: 8.7,
        matchScore: 85,
        matchScoreChange: 3.2,
      },
      demographics: {
        ageGroups: [
          { range: '21-25', count: 234, percentage: 28 },
          { range: '26-30', count: 345, percentage: 41 },
          { range: '31-35', count: 156, percentage: 19 },
          { range: '36-40', count: 89, percentage: 11 },
          { range: '40+', count: 12, percentage: 1 },
        ],
        locations: [
          { city: 'Mumbai', count: 156, percentage: 35 },
          { city: 'Delhi', count: 134, percentage: 30 },
          { city: 'Bangalore', count: 89, percentage: 20 },
          { city: 'Chennai', count: 45, percentage: 10 },
          { city: 'Others', count: 23, percentage: 5 },
        ],
        professions: [
          { profession: 'Software Engineer', count: 189, percentage: 42 },
          { profession: 'Doctor', count: 78, percentage: 17 },
          { profession: 'Teacher', count: 67, percentage: 15 },
          { profession: 'Business', count: 56, percentage: 12 },
          { profession: 'Others', count: 63, percentage: 14 },
        ],
      },
      engagement: {
        dailyViews: [
          { date: '2024-01-15', views: 45 },
          { date: '2024-01-16', views: 52 },
          { date: '2024-01-17', views: 38 },
          { date: '2024-01-18', views: 67 },
          { date: '2024-01-19', views: 73 },
          { date: '2024-01-20', views: 89 },
          { date: '2024-01-21', views: 94 },
        ],
        interestTrends: [
          { date: '2024-01-15', sent: 5, received: 8 },
          { date: '2024-01-16', sent: 7, received: 6 },
          { date: '2024-01-17', sent: 3, received: 9 },
          { date: '2024-01-18', sent: 8, received: 12 },
          { date: '2024-01-19', sent: 6, received: 7 },
          { date: '2024-01-20', sent: 9, received: 11 },
          { date: '2024-01-21', sent: 11, received: 14 },
        ],
      },
      success: {
        responseRate: 68,
        averageResponseTime: '4.2 hours',
        successfulMatches: 12,
        conversationRate: 45,
        meetingRate: 23,
      },
    };

    setAnalyticsData(mockData);
  };

  const formatChange = (change: number) => {
    const isPositive = change > 0;
    return (
      <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className={`h-3 w-3 mr-1 ${isPositive ? '' : 'rotate-180'}`} />
        {Math.abs(change)}%
      </span>
    );
  };

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Analytics</h1>
              <p className="text-gray-600">Track your profile performance and engagement metrics</p>
            </div>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.profileViews}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                {formatChange(analyticsData.overview.profileViewsChange)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interests Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.interestsSent}</p>
                </div>
                <Heart className="h-8 w-8 text-rose-600" />
              </div>
              <div className="mt-2">
                {formatChange(analyticsData.overview.interestsSentChange)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interests Received</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.interestsReceived}</p>
                </div>
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                {formatChange(analyticsData.overview.interestsReceivedChange)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.messagesExchanged}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                {formatChange(analyticsData.overview.messagesExchangedChange)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Match Score</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.matchScore}%</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-2">
                {formatChange(analyticsData.overview.matchScoreChange)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="engagement" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="success">Success Metrics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Engagement Tab */}
          <TabsContent value="engagement">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Profile Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.engagement.dailyViews.map((day: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {new Date(day.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(day.views / 100) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{day.views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interest Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.engagement.interestTrends.map((day: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {new Date(day.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Sent</span>
                            <Badge variant="outline" className="text-rose-600">
                              {day.sent}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Received</span>
                            <Badge variant="outline" className="text-green-600">
                              {day.received}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.ageGroups.map((group: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{group.range} years</span>
                          <span className="text-sm font-medium">{group.percentage}%</span>
                        </div>
                        <Progress value={group.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.locations.map((location: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{location.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{location.count}</span>
                          <Badge variant="outline">{location.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.professions.map((profession: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{profession.profession}</span>
                          <span className="text-sm font-medium">{profession.percentage}%</span>
                        </div>
                        <Progress value={profession.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Success Metrics Tab */}
          <TabsContent value="success">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analyticsData.success.responseRate}%
                  </div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of interests that received responses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analyticsData.success.averageResponseTime}
                  </div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Average time to receive responses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {analyticsData.success.successfulMatches}
                  </div>
                  <p className="text-sm text-gray-600">Successful Matches</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mutual interests leading to conversations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-rose-600 mb-2">
                    {analyticsData.success.meetingRate}%
                  </div>
                  <p className="text-sm text-gray-600">Meeting Rate</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Conversations that led to meetings
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Profile Optimization Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">✓ Strong Points</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• High profile view rate</li>
                        <li>• Good response rate to interests</li>
                        <li>• Active engagement with matches</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">⚠ Areas for Improvement</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Add more photos to increase profile views</li>
                        <li>• Update your "About Me" section</li>
                        <li>• Complete horoscope details for better matching</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900">Best Time to Be Active</h4>
                      <p className="text-sm text-gray-600">
                        Most profile views occur between 7-9 PM on weekdays
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-gray-900">Profile Completeness</h4>
                      <p className="text-sm text-gray-600">
                        Your profile is 85% complete. Add family details to reach 100%
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-medium text-gray-900">Matching Preferences</h4>
                      <p className="text-sm text-gray-600">
                        Consider expanding your location preferences to get more matches
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
