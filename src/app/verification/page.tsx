'use client';

import { useState } from 'react';
import { Shield, FileText, GraduationCap, Building, Users, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface VerificationService {
  id: string;
  name: string;
  description: string;
  icon: any;
  price: number;
  duration: string;
  documents: string[];
  features: string[];
  popular?: boolean;
}

interface VerificationStatus {
  id: string;
  service: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  submittedDate: Date;
  completedDate?: Date;
  documents: string[];
  remarks?: string;
}

export default function VerificationPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<VerificationStatus[]>([]);
  const { toast } = useToast();

  const verificationServices: VerificationService[] = [
    {
      id: 'identity',
      name: 'Identity Verification',
      description: 'Verify identity using government-issued documents',
      icon: FileText,
      price: 500,
      duration: '24-48 hours',
      documents: ['Aadhar Card', 'PAN Card', 'Passport', 'Driving License'],
      features: ['Government database verification', 'Photo matching', 'Address verification', 'Digital certificate'],
      popular: true
    },
    {
      id: 'education',
      name: 'Education Verification',
      description: 'Verify educational qualifications and certificates',
      icon: GraduationCap,
      price: 800,
      duration: '3-5 business days',
      documents: ['Degree Certificates', 'Mark Sheets', 'School/College ID', 'Transcript'],
      features: ['Institution verification', 'Degree authentication', 'Grade verification', 'Detailed report']
    },
    {
      id: 'employment',
      name: 'Employment Verification',
      description: 'Verify current and previous employment details',
      icon: Building,
      price: 1200,
      duration: '5-7 business days',
      documents: ['Salary Slips', 'Employment Letter', 'Experience Certificate', 'Company ID'],
      features: ['HR verification', 'Salary confirmation', 'Designation verification', 'Employment history']
    },
    {
      id: 'background',
      name: 'Background Check',
      description: 'Comprehensive background verification including criminal records',
      icon: Shield,
      price: 2500,
      duration: '7-10 business days',
      documents: ['Police Verification', 'Court Records', 'Reference Contacts', 'Address Proof'],
      features: ['Criminal record check', 'Court case verification', 'Reference verification', 'Comprehensive report']
    },
    {
      id: 'family',
      name: 'Family Verification',
      description: 'Verify family background and social standing',
      icon: Users,
      price: 1500,
      duration: '5-7 business days',
      documents: ['Family Photos', 'Property Documents', 'Reference Contacts', 'Social Verification'],
      features: ['Family background check', 'Property verification', 'Social standing', 'Reference calls']
    }
  ];

  const mockVerificationHistory: VerificationStatus[] = [
    {
      id: '1',
      service: 'Identity Verification',
      status: 'completed',
      submittedDate: new Date('2024-01-15'),
      completedDate: new Date('2024-01-16'),
      documents: ['Aadhar Card', 'PAN Card'],
      remarks: 'All documents verified successfully'
    },
    {
      id: '2',
      service: 'Education Verification',
      status: 'in_progress',
      submittedDate: new Date('2024-01-18'),
      documents: ['B.Tech Degree', 'Mark Sheets'],
      remarks: 'Verification in progress with university'
    }
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = verificationServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const proceedToPayment = () => {
    if (selectedServices.length === 0) {
      toast({
        title: 'No Services Selected',
        description: 'Please select at least one verification service.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Proceeding to Payment',
      description: `Total amount: ₹${calculateTotal().toLocaleString()}. You will be redirected to payment gateway.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Background Verification Services
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Build trust with comprehensive background verification. Get verified profiles for safer matrimonial connections.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="services" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Verification Services</TabsTrigger>
            <TabsTrigger value="status">My Verifications</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Services List */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Choose Verification Services</h2>
                
                {verificationServices.map((service) => {
                  const IconComponent = service.icon;
                  const isSelected = selectedServices.includes(service.id);
                  
                  return (
                    <Card 
                      key={service.id} 
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                      } ${service.popular ? 'border-blue-500' : ''}`}
                      onClick={() => toggleService(service.id)}
                    >
                      {service.popular && (
                        <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">
                          Most Popular
                        </div>
                      )}
                      
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">₹{service.price.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">{service.duration}</div>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Required Documents:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {service.documents.map((doc, index) => (
                                    <li key={index} className="flex items-center">
                                      <FileText className="h-3 w-3 mr-2 text-gray-400" />
                                      {doc}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {service.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedServices.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">
                        No services selected
                      </p>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {selectedServices.map(serviceId => {
                            const service = verificationServices.find(s => s.id === serviceId);
                            return service ? (
                              <div key={serviceId} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{service.name}</span>
                                <span className="font-medium">₹{service.price.toLocaleString()}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span className="text-lg text-blue-600">₹{calculateTotal().toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <Button onClick={proceedToPayment} className="w-full">
                          Proceed to Payment
                        </Button>
                        
                        <div className="text-xs text-gray-500 text-center">
                          Secure payment • 100% refund if verification fails
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Verification Status</h2>
              
              {mockVerificationHistory.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Verifications Yet</h3>
                    <p className="text-gray-500 mb-6">Start your verification process to build trust with potential matches.</p>
                    <Button>Start Verification</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mockVerificationHistory.map((verification) => (
                    <Card key={verification.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{verification.service}</h3>
                          <Badge className={getStatusColor(verification.status)}>
                            {getStatusIcon(verification.status)}
                            <span className="ml-1 capitalize">{verification.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Submitted</p>
                            <p className="font-medium">{verification.submittedDate.toLocaleDateString()}</p>
                          </div>
                          
                          {verification.completedDate && (
                            <div>
                              <p className="text-sm text-gray-600">Completed</p>
                              <p className="font-medium">{verification.completedDate.toLocaleDateString()}</p>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-sm text-gray-600">Documents</p>
                            <p className="font-medium">{verification.documents.length} files</p>
                          </div>
                        </div>
                        
                        {verification.remarks && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{verification.remarks}</p>
                          </div>
                        )}
                        
                        {verification.status === 'in_progress' && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progress</span>
                              <span>60%</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Get Verified?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Verification builds trust and increases your chances of finding the right match by 5x.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Trust</h3>
                    <p className="text-gray-600">
                      Verified profiles receive 5x more interests and responses from serious prospects.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
                    <p className="text-gray-600">
                      Comprehensive background checks ensure you connect with genuine, trustworthy people.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Access</h3>
                    <p className="text-gray-600">
                      Verified users get priority listing and access to other verified profiles.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Verified?</h3>
                <p className="text-blue-100 mb-6">
                  Join thousands of verified users who found their perfect match through our trusted platform.
                </p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Verification Process
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
