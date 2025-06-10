"use client";

import Link from "next/link";
import {
  Heart,
  Camera,
  Edit3,
  Users,
  Gift,
  Star,
  Video,
  MessageCircle,
  Shield,
  MapPin,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ServicesPage() {
  const services = [
    {
      id: "discover",
      title: "Swipe & Discover",
      description:
        "Modern swipe-based matching interface to discover your perfect match",
      icon: Heart,
      href: "/discover",
      features: [
        "Swipe-based matching",
        "Smart recommendations",
        "Instant connections",
        "Undo actions",
      ],
      price: "Free",
      popular: true,
    },
    {
      id: "counseling",
      title: "Relationship Counseling",
      description:
        "Professional guidance from certified relationship counselors",
      icon: MessageCircle,
      href: "/counseling",
      features: [
        "Expert counselors",
        "Video sessions",
        "Pre-marriage guidance",
        "Ongoing support",
      ],
      price: "From ₹1,200/session",
    },
    {
      id: "profile-writing",
      title: "Profile Writing Assistance",
      description:
        "Professional writers to create compelling matrimony profiles",
      icon: Edit3,
      href: "/profile-writing",
      features: [
        "Professional writers",
        "Multiple revisions",
        "Personalized approach",
        "Quick turnaround",
      ],
      price: "From ₹1,500",
    },
    {
      id: "photography",
      title: "Photography Services",
      description: "Professional photography for stunning profile pictures",
      icon: Camera,
      href: "/photography",
      features: [
        "Professional photographers",
        "Multiple outfits",
        "Home/studio shoots",
        "Quick delivery",
      ],
      price: "From ₹3,000",
    },
    {
      id: "verification",
      title: "Background Verification",
      description: "Comprehensive background checks for safety and trust",
      icon: Shield,
      href: "/verification",
      features: [
        "Document verification",
        "Education checks",
        "Employment verification",
        "Reference checks",
      ],
      price: "From ₹2,500",
    },
    {
      id: "astrology",
      title: "Astrology Consultation",
      description: "Professional astrology consultation and horoscope matching",
      icon: Star,
      href: "/astrology",
      features: [
        "Kundli matching",
        "Compatibility analysis",
        "Expert astrologers",
        "Remedies & guidance",
      ],
      price: "From ₹500",
    },
    {
      id: "mobile-app",
      title: "Mobile App",
      description: "Download our mobile app for the best matrimony experience",
      icon: Smartphone,
      href: "/mobile-app",
      features: [
        "Swipe matching",
        "Offline access",
        "Push notifications",
        "Biometric security",
      ],
      price: "Free Download",
    },
    {
      id: "wedding-services",
      title: "Wedding Services Marketplace",
      description: "Complete wedding planning services from verified vendors",
      icon: Gift,
      href: "/wedding-services",
      features: [
        "Photography & Videography",
        "Catering Services",
        "Event Management",
        "Transportation & Venues",
      ],
      price: "Starting from ₹5,000",
      popular: false,
    },
    {
      id: "referral",
      title: "Referral Program",
      description: "Earn rewards by referring friends and family",
      icon: Gift,
      href: "/referral",
      features: [
        "Cash rewards",
        "Premium benefits",
        "Tier system",
        "Bonus credits",
      ],
      price: "Earn up to ₹1,000",
    },
    {
      id: "video-intro",
      title: "Video Introductions",
      description: "Create engaging video profiles to stand out",
      icon: Video,
      href: "/video-intro",
      features: [
        "Video recording",
        "Professional editing",
        "Multiple takes",
        "Privacy controls",
      ],
      price: "From ₹1,000",
    },
    {
      id: "location-matching",
      title: "Location-Based Matching",
      description: "Find matches near your location for easier meetups",
      icon: MapPin,
      href: "/location-matching",
      features: [
        "GPS integration",
        "Nearby matches",
        "Distance filters",
        "Privacy protection",
      ],
      price: "Premium feature",
    },
  ];

  const testimonials = [
    {
      name: "Priya & Rajesh",
      service: "Relationship Counseling",
      feedback:
        "The pre-marriage counseling helped us understand each other better and build a strong foundation for our marriage.",
      rating: 5,
    },
    {
      name: "Anita Sharma",
      service: "Profile Writing",
      feedback:
        "My profile views increased by 300% after the professional rewrite. Found my perfect match within a month!",
      rating: 5,
    },
    {
      name: "Vikram Patel",
      service: "Photography",
      feedback:
        "The professional photos made such a difference. Got so many more interests after updating my pictures.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Matrimony Services
            </h1>
            <p className="text-xl text-rose-100 max-w-3xl mx-auto">
              Comprehensive services to help you find your perfect life partner
              and build a successful relationship
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow relative"
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <p className="text-sm text-gray-600">{service.price}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Features:
                    </h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-rose-600 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={service.href}>
                    <Button className="w-full">Learn More</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Why Choose Our Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive support throughout your matrimony journey
              with professional expertise and personalized care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Professionals
              </h3>
              <p className="text-gray-600">
                Certified counselors, professional writers, and experienced
                photographers to help you succeed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trusted & Secure
              </h3>
              <p className="text-gray-600">
                All our services maintain the highest standards of privacy,
                security, and professional ethics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Proven Results
              </h3>
              <p className="text-gray-600">
                Thousands of successful matches and satisfied customers who
                found their perfect life partners.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600">
              Real feedback from couples who used our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.feedback}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.service}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-rose-100 mb-6 max-w-2xl mx-auto">
            Start your journey today with our comprehensive matrimony services.
            Get professional help and increase your chances of finding true
            love.
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-rose-600 hover:bg-gray-100"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-rose-600"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
