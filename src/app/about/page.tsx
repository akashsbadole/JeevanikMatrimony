import { Heart, Users, Shield, Star, Award, Globe, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  const stats = [
    { number: '2M+', label: 'Active Members', icon: Users },
    { number: '50K+', label: 'Success Stories', icon: Heart },
    { number: '95%', label: 'Verified Profiles', icon: Shield },
    { number: '4.8/5', label: 'User Rating', icon: Star },
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Founded',
      description: 'Started with a vision to help Indian families find perfect matches',
    },
    {
      year: '2015',
      title: '100K Members',
      description: 'Reached our first major milestone of 100,000 registered members',
    },
    {
      year: '2018',
      title: 'Mobile App Launch',
      description: 'Launched our mobile app to make matrimony search more accessible',
    },
    {
      year: '2020',
      title: 'AI Matching',
      description: 'Introduced AI-powered matching algorithm for better compatibility',
    },
    {
      year: '2022',
      title: '1M+ Marriages',
      description: 'Celebrated over 1 million successful marriages through our platform',
    },
    {
      year: '2024',
      title: '2M+ Members',
      description: 'Reached 2 million active members across 150+ countries',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Trust & Authenticity',
      description: 'We verify every profile to ensure genuine connections and maintain the highest standards of authenticity.',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your personal information is protected with industry-leading security measures and privacy controls.',
    },
    {
      icon: Users,
      title: 'Family Values',
      description: 'We understand the importance of family in Indian culture and facilitate meaningful family connections.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting Indian families worldwide while respecting local customs and traditions.',
    },
  ];

  const team = [
    {
      name: 'Rajesh Sharma',
      role: 'Founder & CEO',
      image: '/api/placeholder/150/150',
      description: 'Visionary leader with 15+ years in technology and matrimony services.',
    },
    {
      name: 'Priya Patel',
      role: 'Head of Product',
      image: '/api/placeholder/150/150',
      description: 'Product expert focused on creating user-centric matrimony experiences.',
    },
    {
      name: 'Amit Kumar',
      role: 'CTO',
      image: '/api/placeholder/150/150',
      description: 'Technology leader ensuring platform security and scalability.',
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Customer Success',
      image: '/api/placeholder/150/150',
      description: 'Dedicated to ensuring every member finds their perfect match.',
    },
  ];

  const awards = [
    {
      year: '2023',
      title: 'Best Matrimony Platform',
      organization: 'Digital India Awards',
    },
    {
      year: '2022',
      title: 'Most Trusted Brand',
      organization: 'Indian Consumer Awards',
    },
    {
      year: '2021',
      title: 'Innovation in Technology',
      organization: 'Tech Excellence Awards',
    },
    {
      year: '2020',
      title: 'Customer Choice Award',
      organization: 'Service Excellence Awards',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Indian Matrimony
            </h1>
            <p className="text-xl text-rose-100 max-w-3xl mx-auto mb-8">
              For over a decade, we've been India's most trusted matrimony platform, 
              helping millions of families find their perfect life partners with 
              authenticity, security, and cultural understanding.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold">{stat.number}</div>
                  <div className="text-rose-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <Card className="p-8">
            <CardContent>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To create meaningful connections that lead to lifelong partnerships by providing 
                a secure, authentic, and culturally-aware platform where Indian families can 
                find their perfect matches with confidence and trust.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardContent>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To be the world's most trusted matrimony platform, bridging traditional 
                values with modern technology to help every Indian family find happiness 
                through meaningful relationships and successful marriages.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These values guide everything we do and shape the experience we create for our members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                    <value.icon className="h-8 w-8 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Journey */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From a small startup to India's leading matrimony platform - here's how we've grown
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-rose-200 hidden lg:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1 lg:pr-8">
                    <Card className={`p-6 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <CardContent>
                        <Badge className="mb-3 bg-rose-600">{milestone.year}</Badge>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden lg:block w-4 h-4 bg-rose-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  <div className="flex-1 lg:pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the passionate team behind India's most trusted matrimony platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-rose-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're honored to be recognized for our commitment to excellence and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {award.title}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {award.organization}
                  </div>
                  <Badge variant="outline">{award.year}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Families Trust Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here's what makes us different from other matrimony platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Manual profile verification',
              'AI-powered matching',
              'Family-centric approach',
              'Cultural sensitivity',
              '24/7 customer support',
              'Privacy protection',
              'Mobile-first experience',
              'Success guarantee',
              'Global Indian community',
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
