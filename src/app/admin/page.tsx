'use client';

import { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Heart, 
  MessageCircle, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Shield,
  Eye,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Mock admin data
  const stats = {
    totalUsers: 125430,
    activeUsers: 89234,
    newRegistrations: 1234,
    verifiedProfiles: 95678,
    totalMatches: 45678,
    successStories: 2345,
    revenue: 2456789,
    pendingVerifications: 234,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'registration',
      user: 'Priya Sharma',
      action: 'New user registration',
      time: '2 minutes ago',
      status: 'pending_verification',
    },
    {
      id: 2,
      type: 'verification',
      user: 'Rajesh Kumar',
      action: 'Profile verification completed',
      time: '15 minutes ago',
      status: 'approved',
    },
    {
      id: 3,
      type: 'report',
      user: 'Anonymous',
      action: 'Profile reported for fake information',
      time: '1 hour ago',
      status: 'investigating',
    },
    {
      id: 4,
      type: 'subscription',
      user: 'Anita Patel',
      action: 'Upgraded to Premium plan',
      time: '2 hours ago',
      status: 'completed',
    },
  ];

  const pendingVerifications = [
    {
      id: 1,
      name: 'Deepika Singh',
      type: 'Document Verification',
      submitted: '2024-01-15',
      documents: ['Aadhar Card', 'Education Certificate'],
      priority: 'high',
    },
    {
      id: 2,
      name: 'Vikram Patel',
      type: 'Photo Verification',
      submitted: '2024-01-15',
      documents: ['Profile Photo'],
      priority: 'medium',
    },
    {
      id: 3,
      name: 'Kavya Reddy',
      type: 'Background Check',
      submitted: '2024-01-14',
      documents: ['Employment Verification'],
      priority: 'low',
    },
  ];

  const reportedProfiles = [
    {
      id: 1,
      reportedUser: 'John Doe',
      reportedBy: 'Jane Smith',
      reason: 'Fake profile information',
      date: '2024-01-15',
      status: 'investigating',
      severity: 'high',
    },
    {
      id: 2,
      reportedUser: 'Mike Johnson',
      reportedBy: 'Sarah Wilson',
      reason: 'Inappropriate messages',
      date: '2024-01-14',
      status: 'pending',
      severity: 'medium',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      investigating: { color: 'bg-blue-100 text-blue-800', text: 'Investigating' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      pending_verification: { color: 'bg-orange-100 text-orange-800', text: 'Pending Verification' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 text-red-800', text: 'High' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
      low: { color: 'bg-green-100 text-green-800', text: 'Low' },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, verifications, and platform analytics</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{stats.newRegistrations} new</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified Profiles</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.verifiedProfiles.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {Math.round((stats.verifiedProfiles / stats.totalUsers) * 100)}% verified
                  </p>
                </div>
                <UserCheck className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Matches</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalMatches.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12% this month</p>
                </div>
                <Heart className="h-12 w-12 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹{(stats.revenue / 100000).toFixed(1)}L</p>
                  <p className="text-sm text-green-600">+8% this month</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.user}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        {getStatusBadge(activity.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex flex-col items-center justify-center">
                      <UserCheck className="h-6 w-6 mb-2" />
                      <span className="text-sm">Verify Profiles</span>
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <AlertTriangle className="h-6 w-6 mb-2" />
                      <span className="text-sm">Review Reports</span>
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <TrendingUp className="h-6 w-6 mb-2" />
                      <span className="text-sm">View Analytics</span>
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Users className="h-6 w-6 mb-2" />
                      <span className="text-sm">Manage Users</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pending Verifications
                  <Badge className="bg-orange-100 text-orange-800">
                    {pendingVerifications.length} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{verification.name}</h4>
                          <p className="text-sm text-gray-600">{verification.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(verification.priority)}
                          <span className="text-sm text-gray-500">
                            Submitted: {verification.submitted}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          {verification.documents.map((doc, index) => (
                            <Badge key={index} variant="outline">{doc}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Reported Profiles
                  <Badge className="bg-red-100 text-red-800">
                    {reportedProfiles.length} active reports
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportedProfiles.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {report.reportedUser} reported by {report.reportedBy}
                          </h4>
                          <p className="text-sm text-gray-600">{report.reason}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(report.severity)}
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Reported: {report.date}</span>
                        <div className="flex space-x-3">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Investigate
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Shield className="h-4 w-4 mr-2" />
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>New Registrations</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profile Completions</span>
                        <span>72%</span>
                      </div>
                      <Progress value={72} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Verification Rate</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Active Users</span>
                      <span className="font-medium">12,345</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Session Duration</span>
                      <span className="font-medium">24 minutes</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium">18.5%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Conversion</span>
                      <span className="font-medium">12.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    User Management Tools
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Advanced user management features will be available here
                  </p>
                  <Button>
                    Access User Management
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
