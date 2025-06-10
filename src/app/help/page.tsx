'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      description: 'Learn the basics of using our platform',
    },
    {
      id: 'profile-management',
      title: 'Profile Management',
      icon: '👤',
      description: 'How to create and manage your profile',
    },
    {
      id: 'search-matching',
      title: 'Search & Matching',
      icon: '🔍',
      description: 'Finding and connecting with potential matches',
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: '💬',
      description: 'Messaging and interaction features',
    },
    {
      id: 'subscription-billing',
      title: 'Subscription & Billing',
      icon: '💳',
      description: 'Payment plans and billing questions',
    },
    {
      id: 'safety-privacy',
      title: 'Safety & Privacy',
      icon: '🔒',
      description: 'Keeping your information secure',
    },
  ];

  const faqs = [
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I create an account?',
      answer: 'To create an account, click on "Join Free" on our homepage. Fill in your basic details including email, phone number, and create a password. You\'ll receive a verification email to activate your account.',
    },
    {
      id: '2',
      category: 'getting-started',
      question: 'Is registration really free?',
      answer: 'Yes, registration is completely free. You can create your profile, browse other profiles, and send limited interests without any cost. Premium features are available with paid subscriptions.',
    },
    {
      id: '3',
      category: 'profile-management',
      question: 'How do I make my profile more attractive?',
      answer: 'Complete all sections of your profile, add multiple high-quality photos, write a compelling "About Me" section, and get your profile verified. Profiles with more information get 3x more responses.',
    },
    {
      id: '4',
      category: 'profile-management',
      question: 'Can I edit my profile after creating it?',
      answer: 'Yes, you can edit most of your profile information anytime. Go to "Edit Profile" in your dashboard. Some basic information like date of birth may have restrictions.',
    },
    {
      id: '5',
      category: 'profile-management',
      question: 'How do I verify my profile?',
      answer: 'Upload clear photos of your government ID and a recent photo. Our verification team will review and approve within 24-48 hours. Verified profiles get more visibility and trust.',
    },
    {
      id: '6',
      category: 'search-matching',
      question: 'How does the matching algorithm work?',
      answer: 'Our AI-powered algorithm considers your preferences, lifestyle choices, education, profession, location, and family background to suggest compatible matches. The more complete your profile, the better the matches.',
    },
    {
      id: '7',
      category: 'search-matching',
      question: 'Can I search for profiles outside my city?',
      answer: 'Yes, you can search across cities, states, and even countries. Use the location filters in advanced search to specify your preferred locations.',
    },
    {
      id: '8',
      category: 'communication',
      question: 'How do I send an interest to someone?',
      answer: 'Click on "Send Interest" on any profile you like. You can add a personal message to make your interest more appealing. Free users can send 5 interests per month.',
    },
    {
      id: '9',
      category: 'communication',
      question: 'What happens after someone accepts my interest?',
      answer: 'Once your interest is accepted, you can start messaging each other and exchange contact information. You\'ll also get access to their full profile details.',
    },
    {
      id: '10',
      category: 'subscription-billing',
      question: 'What are the benefits of premium membership?',
      answer: 'Premium members get unlimited interests, advanced search filters, direct messaging, profile highlighting, contact info access, and priority customer support.',
    },
    {
      id: '11',
      category: 'subscription-billing',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription anytime. Your premium features will remain active until the end of your billing period. No cancellation fees apply.',
    },
    {
      id: '12',
      category: 'safety-privacy',
      question: 'How do you ensure profile authenticity?',
      answer: 'We manually verify all profiles with document checks, photo verification, and phone number verification. We also have AI systems to detect fake profiles and suspicious activity.',
    },
    {
      id: '13',
      category: 'safety-privacy',
      question: 'Can I control who sees my profile?',
      answer: 'Yes, you have full control over your profile visibility. You can make it public, visible to premium members only, or completely private. You can also block specific users.',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How Can We Help You?
            </h1>
            <p className="text-xl text-rose-100 max-w-2xl mx-auto mb-8">
              Find answers to common questions or get in touch with our support team
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-gray-900 bg-white border-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
            {searchTerm && (
              <Badge variant="secondary" className="ml-3">
                {filteredFaqs.length} results
              </Badge>
            )}
          </h2>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="border-t pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try searching with different keywords or browse our categories above.
              </p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600">
              Our support team is here to help you with any questions or concerns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get instant help from our support team
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Chat
              </Button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Call us for immediate assistance
              </p>
              <div className="text-sm text-gray-600 mb-2">
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Mon-Sat: 9 AM - 8 PM
                </div>
              </div>
              <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                +91 1800-123-4567
              </Button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                support@indianmatrimony.com
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
