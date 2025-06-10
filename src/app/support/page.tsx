'use client';

import { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  FileText, 
  Send,
  Star,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'support',
      message: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const supportCategories = [
    { id: 'profile', name: 'Profile Issues', description: 'Profile creation, editing, verification' },
    { id: 'matching', name: 'Matching & Search', description: 'Finding matches, search filters' },
    { id: 'communication', name: 'Communication', description: 'Messages, interests, contact sharing' },
    { id: 'billing', name: 'Billing & Subscription', description: 'Payment issues, plan changes' },
    { id: 'technical', name: 'Technical Issues', description: 'App bugs, login problems' },
    { id: 'safety', name: 'Safety & Privacy', description: 'Report profiles, privacy concerns' },
    { id: 'other', name: 'Other', description: 'General inquiries and feedback' },
  ];

  const myTickets = [
    {
      id: 'TKT-001',
      subject: 'Profile verification pending',
      category: 'Profile Issues',
      status: 'in_progress',
      priority: 'high',
      created: '2024-01-15',
      lastUpdate: '2024-01-16',
      assignedTo: 'Priya Sharma',
    },
    {
      id: 'TKT-002',
      subject: 'Payment not reflected',
      category: 'Billing & Subscription',
      status: 'resolved',
      priority: 'medium',
      created: '2024-01-10',
      lastUpdate: '2024-01-12',
      assignedTo: 'Rajesh Kumar',
    },
    {
      id: 'TKT-003',
      subject: 'Unable to send interests',
      category: 'Technical Issues',
      status: 'open',
      priority: 'low',
      created: '2024-01-08',
      lastUpdate: '2024-01-08',
      assignedTo: 'Unassigned',
    },
  ];

  const supportAgents = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Senior Support Specialist',
      avatar: '/api/placeholder/50/50',
      rating: 4.9,
      specialties: ['Profile Issues', 'Verification'],
      languages: ['Hindi', 'English'],
      available: true,
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Billing Specialist',
      avatar: '/api/placeholder/50/50',
      rating: 4.8,
      specialties: ['Billing', 'Subscriptions'],
      languages: ['Hindi', 'English', 'Gujarati'],
      available: true,
    },
    {
      id: 3,
      name: 'Anita Patel',
      role: 'Technical Support',
      avatar: '/api/placeholder/50/50',
      rating: 4.7,
      specialties: ['Technical Issues', 'App Support'],
      languages: ['English', 'Gujarati'],
      available: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'bg-blue-100 text-blue-800', text: 'Open' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
      resolved: { color: 'bg-green-100 text-green-800', text: 'Resolved' },
      closed: { color: 'bg-gray-100 text-gray-800', text: 'Closed' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-green-100 text-green-800', text: 'Low' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
      high: { color: 'bg-red-100 text-red-800', text: 'High' },
      urgent: { color: 'bg-red-200 text-red-900', text: 'Urgent' },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle ticket submission
    console.log('Submitting ticket:', ticketForm);
    // Reset form
    setTicketForm({ subject: '', category: '', priority: 'medium', description: '' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'user',
        message: newMessage,
        timestamp: new Date(),
      }]);
      setNewMessage('');
      
      // Simulate support response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'support',
          message: 'Thank you for your message. I\'m looking into this for you.',
          timestamp: new Date(),
        }]);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Customer Support</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We're here to help you with any questions or issues you may have
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get instant help from our support team
              </p>
              <Badge className="bg-green-100 text-green-800 mb-4">Available Now</Badge>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Call us for immediate assistance
              </p>
              <div className="text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Mon-Sat: 9 AM - 8 PM
                </div>
                <div className="font-medium">+91 1800-123-4567</div>
              </div>
              <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <div className="text-sm text-gray-600 mb-4">
                <div>support@indianmatrimony.com</div>
              </div>
              <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Support Interface */}
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="create">Create Ticket</TabsTrigger>
            <TabsTrigger value="agents">Support Team</TabsTrigger>
          </TabsList>

          {/* Live Chat */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Live Chat Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Tickets */}
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  My Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                          <p className="text-sm text-gray-600">Ticket ID: {ticket.id}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <div className="font-medium">{ticket.category}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Created:</span>
                          <div className="font-medium">{ticket.created}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Update:</span>
                          <div className="font-medium">{ticket.lastUpdate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Assigned To:</span>
                          <div className="font-medium">{ticket.assignedTo}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Ticket */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Create Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Select 
                        value={ticketForm.category} 
                        onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <Select 
                        value={ticketForm.priority} 
                        onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      placeholder="Please provide detailed information about your issue..."
                      rows={6}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Team */}
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Our Support Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {supportAgents.map((agent) => (
                    <Card key={agent.id}>
                      <CardContent className="p-6 text-center">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-16 h-16 rounded-full mx-auto mb-4"
                        />
                        <h3 className="font-semibold text-gray-900 mb-1">{agent.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{agent.role}</p>
                        
                        <div className="flex items-center justify-center mb-3">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1">{agent.rating}</span>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Specialties:</p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {agent.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-600 mb-1">Languages:</p>
                          <p className="text-sm">{agent.languages.join(', ')}</p>
                        </div>

                        <div className="flex items-center justify-center">
                          {agent.available ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Busy
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
