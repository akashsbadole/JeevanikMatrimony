"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Star,
  Crown,
  Zap,
  Heart,
  Shield,
  Users,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      duration: "Forever",
      description: "Perfect for getting started",
      icon: Star,
      color: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      popular: false,
      features: [
        "Create detailed profile",
        "Browse unlimited profiles",
        "Send up to 5 interests per month",
        "Basic search filters",
        "View contact info of accepted interests",
        "Mobile app access",
        "Basic customer support",
        "Profile photo upload (up to 3)",
      ],
      limitations: [
        "Limited interest sends (5/month)",
        "No advanced search filters",
        "No priority listing",
        "No horoscope matching",
        "No direct messaging",
        "No profile analytics",
      ],
    },
    {
      name: "Premium",
      price: { monthly: 2999, yearly: 29990 },
      duration: isYearly ? "12 months" : "3 months",
      description: "Most popular choice for serious seekers",
      icon: Crown,
      color: "border-rose-300 ring-2 ring-rose-200",
      buttonColor: "bg-rose-600 hover:bg-rose-700",
      popular: true,
      features: [
        "Everything in Free plan",
        "Unlimited interests",
        "Advanced search filters",
        "See who viewed your profile",
        "Priority listing in search results",
        "Horoscope matching & compatibility",
        "Direct messaging with matches",
        "Contact info access for all matches",
        "Profile highlighting",
        "Photo gallery (up to 20 photos)",
        "Priority customer support",
        "Mobile app premium features",
        "Profile verification assistance",
      ],
      limitations: [],
    },
    {
      name: "Elite",
      price: { monthly: 7999, yearly: 79990 },
      duration: isYearly ? "12 months" : "6 months",
      description: "For those who want the best experience",
      icon: Zap,
      color: "border-purple-300",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false,
      features: [
        "Everything in Premium plan",
        "Dedicated relationship manager",
        "Profile writing assistance",
        "Professional photo guidance",
        "Personalized match recommendations",
        "Background verification service",
        "Wedding planning assistance",
        "Exclusive member events access",
        "Premium customer support (24/7)",
        "Profile promotion in search",
        "Advanced analytics & insights",
        "Video profile introduction",
        "Priority verification (24 hours)",
        "Unlimited photo uploads",
        "Custom search alerts",
      ],
      limitations: [],
    },
  ];

  const features = [
    {
      category: "Profile & Search",
      items: [
        { name: "Profile Creation", free: true, premium: true, elite: true },
        {
          name: "Photo Upload",
          free: "3 photos",
          premium: "20 photos",
          elite: "Unlimited",
        },
        { name: "Basic Search", free: true, premium: true, elite: true },
        { name: "Advanced Filters", free: false, premium: true, elite: true },
        { name: "Saved Searches", free: false, premium: true, elite: true },
        { name: "Profile Analytics", free: false, premium: true, elite: true },
      ],
    },
    {
      category: "Communication",
      items: [
        {
          name: "Send Interests",
          free: "5/month",
          premium: "Unlimited",
          elite: "Unlimited",
        },
        { name: "Direct Messaging", free: false, premium: true, elite: true },
        {
          name: "Contact Info Access",
          free: "Mutual only",
          premium: "All matches",
          elite: "All matches",
        },
        { name: "Video Calls", free: false, premium: false, elite: true },
        { name: "Priority Support", free: false, premium: true, elite: "24/7" },
      ],
    },
    {
      category: "Matching & Verification",
      items: [
        { name: "Horoscope Matching", free: false, premium: true, elite: true },
        {
          name: "Profile Verification",
          free: "Basic",
          premium: "Enhanced",
          elite: "Priority",
        },
        { name: "Background Check", free: false, premium: false, elite: true },
        {
          name: "Personalized Recommendations",
          free: false,
          premium: "Basic",
          elite: "Advanced",
        },
      ],
    },
  ];

  const testimonials = [
    {
      name: "Priya & Rajesh",
      location: "Mumbai",
      plan: "Premium",
      quote:
        "We found each other through the Premium plan. The advanced search filters helped us connect based on our specific preferences.",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Anita & Vikram",
      location: "Delhi",
      plan: "Elite",
      quote:
        "The dedicated relationship manager made all the difference. They guided us through the entire process professionally.",
      image: "/api/placeholder/60/60",
    },
  ];

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Yes, you can upgrade your plan at any time. When upgrading, you'll only pay the difference for the remaining period. Downgrades take effect at the end of your current billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our encrypted payment gateway.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact us within 30 days for a full refund.",
    },
    {
      question: "What happens when my subscription expires?",
      answer:
        "When your subscription expires, your account will automatically switch to the Free plan. You'll retain access to your profile and matches, but premium features will be disabled.",
    },
    {
      question: "Can I pause my subscription?",
      answer:
        "Yes, Premium and Elite subscribers can pause their subscription for up to 3 months due to personal circumstances. Contact our support team to arrange this.",
    },
  ];

  const getPrice = (plan: any) => {
    const price = isYearly ? plan.price.yearly : plan.price.monthly;
    if (price === 0) return "Free";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getMonthlyPrice = (plan: any) => {
    if (plan.price.monthly === 0) return "";
    const monthlyPrice = isYearly ? plan.price.yearly / 12 : plan.price.monthly;
    return `₹${Math.round(monthlyPrice).toLocaleString("en-IN")} per month`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and upgrade when you're ready. All plans include our
              core features to help you find your perfect life partner.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <span
                className={`text-sm ${
                  !isYearly ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span
                className={`text-sm ${
                  isYearly ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                Yearly
              </span>
              {isYearly && (
                <Badge className="bg-green-100 text-green-800 ml-2">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.color} ${
                plan.popular ? "transform scale-105 shadow-xl" : "shadow-lg"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-rose-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4 mx-auto">
                  <plan.icon className="h-8 w-8 text-gray-600" />
                </div>

                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>

                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {getPrice(plan)}
                  </span>
                  {plan.price.monthly > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      {getMonthlyPrice(plan)}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
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
                <Link
                  href={
                    plan.price.monthly === 0
                      ? "/auth/signup"
                      : `/checkout?plan=${plan.name.toLowerCase()}`
                  }
                >
                  <Button
                    className={`w-full ${plan.buttonColor} text-white`}
                    size="lg"
                  >
                    {plan.price.monthly === 0
                      ? "Get Started Free"
                      : "Choose Plan"}
                  </Button>
                </Link>

                {/* Money Back Guarantee */}
                {plan.price.monthly > 0 && (
                  <div className="mt-4 text-center">
                    <div className="text-xs text-gray-500">
                      30-day money-back guarantee
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Compare All Features
          </h2>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      Premium
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      Elite
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {features.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-gray-50">
                        <td
                          colSpan={4}
                          className="px-6 py-3 text-sm font-semibold text-gray-900"
                        >
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {typeof item.free === "boolean" ? (
                              item.free ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-400">—</span>
                              )
                            ) : (
                              <span className="text-gray-700">{item.free}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {typeof item.premium === "boolean" ? (
                              item.premium ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-400">—</span>
                              )
                            ) : (
                              <span className="text-gray-700">
                                {item.premium}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {typeof item.elite === "boolean" ? (
                              item.elite ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-400">—</span>
                              )
                            ) : (
                              <span className="text-gray-700">
                                {item.elite}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Success Stories from Our Members
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <Badge variant="outline">{testimonial.plan}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {testimonial.location}
                      </p>
                      <p className="text-gray-700 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Find Your Life Partner?
            </h3>
            <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
              Join over 2 million verified members and start your journey to
              finding true love. Registration is free and takes less than 5
              minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-rose-600 hover:bg-gray-100 px-8"
                >
                  Start Your Journey Free
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-rose-600 px-8"
                >
                  Browse Profiles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
