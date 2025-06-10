'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Filter,
  Search,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useOrders, useServicesActions } from '@/lib/stores/services-store';

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const orders = useOrders();
  const { updateOrderStatus } = useServicesActions();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Revenue',
      value: '₹2,45,000',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Active Vendors',
      value: '156',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      customerName: 'Priya Sharma',
      service: 'Wedding Photography',
      vendor: 'Rajesh Photography',
      amount: 25000,
      status: 'pending',
      date: '2024-01-15',
      priority: 'high',
    },
    {
      id: 'ORD-002',
      customerName: 'Amit Kumar',
      service: 'Background Verification',
      vendor: 'SecureCheck Services',
      amount: 3500,
      status: 'in_progress',
      date: '2024-01-14',
      priority: 'medium',
    },
    {
      id: 'ORD-003',
      customerName: 'Kavya Reddy',
      service: 'Astrology Consultation',
      vendor: 'Pandit Sharma',
      amount: 1200,
      status: 'completed',
      date: '2024-01-13',
      priority: 'low',
    },
    {
      id: 'ORD-004',
      customerName: 'Rohit Patel',
      service: 'Event Management',
      vendor: 'Dream Events',
      amount: 50000,
      status: 'confirmed',
      date: '2024-01-12',
      priority: 'high',
    },
  ];

  const backgroundVerificationRequests = [
    {
      id: 'BG-001',
      requestedBy: 'Priya Sharma',
      targetPerson: 'Amit Kumar',
      type: 'comprehensive',
      status: 'pending',
      assignedTo: 'Officer A',
      requestDate: '2024-01-15',
      priority: 'high',
    },
    {
      id: 'BG-002',
      requestedBy: 'Kavya Reddy',
      targetPerson: 'Rohit Patel',
      type: 'basic',
      status: 'in_progress',
      assignedTo: 'Officer B',
      requestDate: '2024-01-14',
      priority: 'medium',
    },
  ];

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    toast({
      title: 'Status Updated',
      description: `Order ${orderId} status updated to ${newStatus}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage services, orders, and vendor requests
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last period
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Service Orders</TabsTrigger>
            <TabsTrigger value="verification">Background Verification</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Service Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Service Orders</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        className="pl-10 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium text-gray-900">{order.id}</h3>
                              <p className="text-sm text-gray-600">{order.customerName}</p>
                            </div>
                            <div>
                              <p className="font-medium">{order.service}</p>
                              <p className="text-sm text-gray-600">by {order.vendor}</p>
                            </div>
                            <div>
                              <p className="font-medium">₹{order.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{order.date}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                          
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Background Verification Tab */}
          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Background Verification Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backgroundVerificationRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium text-gray-900">{request.id}</h3>
                              <p className="text-sm text-gray-600">Requested by: {request.requestedBy}</p>
                            </div>
                            <div>
                              <p className="font-medium">Target: {request.targetPerson}</p>
                              <p className="text-sm text-gray-600">Type: {request.type}</p>
                            </div>
                            <div>
                              <p className="font-medium">Assigned to: {request.assignedTo}</p>
                              <p className="text-sm text-gray-600">{request.requestDate}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                          
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Assign Officer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendor Management Tab */}
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor Management</h3>
                  <p className="text-gray-600 mb-4">
                    Manage vendor applications, approvals, and performance monitoring.
                  </p>
                  <Button>View All Vendors</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600 mb-4">
                    Detailed analytics and reporting for service performance and revenue.
                  </p>
                  <Button>View Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
