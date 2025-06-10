import { Check, Star, Crown, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      duration: 'Forever',
      description: 'Perfect for getting started',
      icon: Star,
      color: 'border-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      popular: false,
      features: [
        'Create detailed profile',
        'Browse unlimited profiles',
        'Send up to 5 interests per month',
        'Basic search filters',
        'View contact info of accepted interests',
        'Mobile app access',
        'Basic customer support'
      ],
      limitations: [
        'Limited interest sends',
        'No advanced search',
        'No priority listing',
        'No horoscope matching'
      ]
    },
    {
      name: 'Premium',
      price: 2999,
      duration: '3 months',
      description: 'Most popular choice',
      icon: Crown,
      color: 'border-rose-300 ring-2 ring-rose-200',
      buttonColor: 'bg-rose-600 hover:bg-rose-700',
      popular: true,
      features: [
        'Everything in Free plan',
        'Unlimited interests',
        'Advanced search filters',
        'See who viewed your profile',
        'Priority listing in search',
        'Horoscope matching',
        'Direct messaging',
        'Contact info access',
        'Profile highlighting',
        'Priority customer support'
      ],
      limitations: []
    },
    {
      name: 'Elite',
      price: 7999,
      duration: '6 months',
      description: 'For serious seekers',
      icon: Zap,
      color: 'border-purple-300',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: false,
      features: [
        'Everything in Premium plan',
        'Dedicated relationship manager',
        'Profile verification assistance',
        'Personalized match recommendations',
        'Wedding planning assistance',
        'Background verification',
        'Exclusive member events',
        'Premium customer support',
        'Profile writing assistance',
        'Professional photo guidance'
      ],
      limitations: []
    }
  ];

  const faqs = [
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can upgrade your plan at any time. The remaining amount will be adjusted in your new plan.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely! We use industry-standard encryption and secure payment gateways to protect your information.'
    },
    {
      question: 'What if I don\'t find a match?',
      answer: 'We offer a satisfaction guarantee. If you don\'t find suitable matches, we provide additional months at no extra cost.'
    },
    {
      question: 'Can I pause my subscription?',
      answer: 'Yes, you can pause your subscription for up to 3 months if needed due to personal circumstances.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade when you're ready. All plans include our core features 
            to help you find your perfect life partner.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl shadow-lg ${plan.color} p-8 ${
                plan.popular ? 'transform scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-rose-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                  <plan.icon className="h-8 w-8 text-gray-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 ml-2">
                      / {plan.duration}
                    </span>
                  )}
                </div>
                
                {plan.price > 0 && (
                  <div className="text-sm text-gray-500">
                    ₹{Math.round(plan.price / (plan.duration === '3 months' ? 3 : 6)).toLocaleString('en-IN')} per month
                  </div>
                )}
              </div>

              {/* Features List */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link href={plan.price === 0 ? '/auth/signup' : `/pricing/${plan.name.toLowerCase()}`}>
                <Button
                  className={`w-full ${plan.buttonColor} text-white`}
                  size="lg"
                >
                  {plan.price === 0 ? 'Get Started Free' : 'Choose Plan'}
                </Button>
              </Link>

              {/* Money Back Guarantee */}
              {plan.price > 0 && (
                <div className="mt-4 text-center">
                  <div className="text-xs text-gray-500">
                    30-day money-back guarantee
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Premium Plans?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium members are 5x more likely to find their life partner within 3 months
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-rose-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Priority Visibility</h4>
              <p className="text-gray-600 text-sm">Your profile appears first in search results, increasing visibility by 300%</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Advanced Matching</h4>
              <p className="text-gray-600 text-sm">AI-powered compatibility analysis and horoscope matching for better matches</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Dedicated Support</h4>
              <p className="text-gray-600 text-sm">Personal relationship manager and priority customer support</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-600 text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
