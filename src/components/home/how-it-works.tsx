import { UserPlus, Search, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up and create a detailed profile with your preferences, photos, and family information.',
      details: [
        'Add personal and family details',
        'Upload photos and documents',
        'Set partner preferences',
        'Complete profile verification'
      ]
    },
    {
      icon: Search,
      title: 'Search & Discover',
      description: 'Use our advanced search filters to find compatible matches based on your criteria.',
      details: [
        'Filter by age, location, education',
        'Search by caste and community',
        'View detailed profiles',
        'Get AI-powered suggestions'
      ]
    },
    {
      icon: Heart,
      title: 'Express Interest',
      description: 'Send interests to profiles you like and wait for them to accept or decline.',
      details: [
        'Send personalized interest messages',
        'View who showed interest in you',
        'Accept or decline interests',
        'Get mutual match notifications'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Connect & Communicate',
      description: 'Start conversations with mutual matches and take the relationship forward.',
      details: [
        'Secure messaging platform',
        'Share contact information',
        'Video call integration',
        'Plan meetings safely'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Finding your life partner is simple with our step-by-step process. 
            Join thousands of happy couples who found love through our platform.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4 pt-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 rounded-xl">
                      <step.icon className="h-6 w-6 text-rose-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Details List */}
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-xs text-gray-500">
                        <div className="w-1 h-1 bg-rose-400 rounded-full mr-2 flex-shrink-0"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-2 z-20">
                    <div className="w-4 h-4 bg-white border-2 border-rose-300 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Find Your Life Partner?
            </h3>
            <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
              Join over 2 million verified members and start your journey to finding true love. 
              Registration is free and takes less than 5 minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100 px-8">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-rose-600 px-8">
                  Browse Profiles
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center items-center space-x-8 text-rose-100 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Free Registration
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Verified Profiles
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                100% Privacy
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
