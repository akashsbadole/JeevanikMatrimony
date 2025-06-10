"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  Download,
  Star,
  Shield,
  Heart,
  Zap,
  QrCode,
  Apple,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function MobileAppPage() {
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "unknown">(
    "unknown"
  );
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDeviceType("ios");
    } else if (/Android/.test(userAgent)) {
      setDeviceType("android");
    }
  }, []);

  const downloadApp = (platform: "ios" | "android") => {
    if (platform === "ios") {
      // In real app, this would redirect to App Store
      toast({
        title: "Redirecting to App Store",
        description: "You will be redirected to download the iOS app.",
      });
      window.open("https://apps.apple.com/app/indian-matrimony", "_blank");
    } else {
      // In real app, this would redirect to Google Play Store
      toast({
        title: "Redirecting to Play Store",
        description: "You will be redirected to download the Android app.",
      });
      window.open(
        "https://play.google.com/store/apps/details?id=com.indianmatrimony",
        "_blank"
      );
    }
  };

  const appFeatures = [
    {
      icon: Heart,
      title: "Smart Matching",
      description:
        "AI-powered compatibility matching with instant notifications",
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description:
        "Enhanced security with biometric authentication and verified profiles",
    },
    {
      icon: Zap,
      title: "Instant Messaging",
      description: "Real-time chat, voice messages, and video calling",
    },
    {
      icon: Star,
      title: "Offline Access",
      description: "Browse profiles and access features even without internet",
    },
  ];

  const appStats = [
    { label: "Downloads", value: "10M+" },
    { label: "Success Stories", value: "50K+" },
    { label: "App Rating", value: "4.8★" },
    { label: "Countries", value: "25+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge className="bg-blue-100 text-blue-800 mb-4">
                <Smartphone className="h-4 w-4 mr-2" />
                Now Available on Mobile
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find Your Perfect Match
                <span className="text-blue-600 block">On The Go</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Download our mobile app for the best matrimony experience.
                Swipe, match, and connect with verified profiles anytime,
                anywhere.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button
                  onClick={() => downloadApp("ios")}
                  size="lg"
                  className="bg-[#1ec3da] hover:bg-gray-800 text-white px-8 py-4 h-auto"
                >
                  <Apple className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </Button>

                <Button
                  onClick={() => downloadApp("android")}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 h-auto"
                >
                  <Play className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>

              {/* QR Code Option */}
              <div className="flex items-center justify-center lg:justify-start">
                <Button
                  variant="outline"
                  onClick={() => setShowQR(!showQR)}
                  className="mr-4"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR Code
                </Button>

                {showQR && (
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Scan to download
                    </p>
                  </div>
                )}
              </div>

              {/* App Stats */}
              <div className="grid grid-cols-4 gap-4 mt-12">
                {appStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                  {/* Phone Screen Content */}
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-20 flex items-center justify-center">
                    <h3 className="text-white font-semibold">
                      Indian Matrimony
                    </h3>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white border rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                          <div className="h-2 bg-gray-100 rounded w-16"></div>
                        </div>
                      </div>
                    </div>

                    {/* Match Percentage */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">
                          95% Match
                        </span>
                        <Heart className="h-4 w-4 text-red-500" />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-8 bg-blue-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Mobile App?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of matrimony with our feature-rich mobile
              application designed for modern Indian families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {appFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* App Screenshots */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              App Screenshots
            </h2>
            <p className="text-gray-600">
              Take a look at our beautiful and intuitive mobile interface
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="aspect-[9/16] bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-center text-sm text-gray-600 mt-3">
                  {index === 1 && "Profile Discovery"}
                  {index === 2 && "Chat Interface"}
                  {index === 3 && "Match Results"}
                  {index === 4 && "Video Calling"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya & Rajesh",
                review:
                  "Found my perfect match through the mobile app. The swipe feature made it so easy to browse profiles!",
                rating: 5,
                location: "Mumbai",
              },
              {
                name: "Anita Sharma",
                review:
                  "Love the offline feature. I can browse profiles even during my commute without internet.",
                rating: 5,
                location: "Delhi",
              },
              {
                name: "Vikram Patel",
                review:
                  "The video calling feature helped us connect better before meeting in person. Highly recommended!",
                rating: 5,
                location: "Bangalore",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
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
                    "{testimonial.review}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Life Partner?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Download our app today and start your journey to happiness
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => downloadApp("ios")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 h-auto"
            >
              <Apple className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </Button>

            <Button
              onClick={() => downloadApp("android")}
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 h-auto"
            >
              <Play className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
