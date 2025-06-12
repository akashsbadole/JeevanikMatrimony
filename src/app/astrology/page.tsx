"use client";

import { useState } from "react";
import {
  Star,
  Calendar,
  Clock,
  Video,
  MessageCircle,
  Phone,
  Award,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Astrologer {
  id: string;
  name: string;
  photo: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  consultationFee: {
    chat: number;
    call: number;
    video: number;
  };
  availability: "online" | "busy" | "offline";
  nextAvailable?: Date;
  verified: boolean;
  awards: string[];
}

interface ConsultationPackage {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  duration: string;
  popular?: boolean;
}

export default function AstrologyPage() {
  const [selectedAstrologer, setSelectedAstrologer] = useState<string | null>(
    null
  );
  const [selectedConsultationType, setSelectedConsultationType] = useState<
    "chat" | "call" | "video"
  >("video");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const { toast } = useToast();

  const astrologers: Astrologer[] = [
    {
      id: "1",
      name: "Pandit Rajesh Sharma",
      photo: "/api/placeholder/100/100",
      specialization: [
        "Kundli Matching",
        "Marriage Prediction",
        "Career Guidance",
        "Remedies",
      ],
      experience: 25,
      rating: 4.9,
      reviewCount: 1250,
      languages: ["Hindi", "English", "Sanskrit"],
      consultationFee: {
        chat: 500,
        call: 800,
        video: 1200,
      },
      availability: "online",
      verified: true,
      awards: ["Jyotish Ratna", "Vedic Scholar"],
    },
    {
      id: "2",
      name: "Dr. Meera Iyer",
      photo: "/api/placeholder/100/100",
      specialization: [
        "Horoscope Analysis",
        "Manglik Dosha",
        "Gemstone Consultation",
        "Muhurat",
      ],
      experience: 18,
      rating: 4.8,
      reviewCount: 890,
      languages: ["Tamil", "English", "Hindi"],
      consultationFee: {
        chat: 400,
        call: 700,
        video: 1000,
      },
      availability: "online",
      verified: true,
      awards: ["Jyotish Acharya"],
    },
    {
      id: "3",
      name: "Acharya Vikram Joshi",
      photo: "/api/placeholder/100/100",
      specialization: ["Vedic Astrology", "Palmistry", "Numerology", "Vastu"],
      experience: 30,
      rating: 4.9,
      reviewCount: 2100,
      languages: ["Hindi", "English", "Gujarati", "Marathi"],
      consultationFee: {
        chat: 600,
        call: 1000,
        video: 1500,
      },
      availability: "busy",
      nextAvailable: new Date("2024-01-25T14:00:00"),
      verified: true,
      awards: ["Jyotish Shiromani", "Vedic Master"],
    },
  ];

  const consultationPackages: ConsultationPackage[] = [
    {
      id: "basic",
      name: "Basic Kundli Analysis",
      description: "Complete birth chart analysis with basic predictions",
      services: [
        "Birth chart creation",
        "Planetary positions",
        "Basic predictions",
        "Written report",
      ],
      price: 1500,
      duration: "30 minutes",
    },
    {
      id: "marriage",
      name: "Marriage Consultation",
      description: "Comprehensive marriage and compatibility analysis",
      services: [
        "Kundli matching",
        "Guna Milan",
        "Manglik analysis",
        "Marriage timing",
        "Remedies",
      ],
      price: 2500,
      duration: "45 minutes",
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Life Consultation",
      description: "Complete life analysis covering all aspects",
      services: [
        "Detailed horoscope",
        "Career guidance",
        "Health predictions",
        "Relationship advice",
        "Remedies & gemstones",
        "Follow-up session",
      ],
      price: 5000,
      duration: "90 minutes",
    },
  ];

  const specializations = [
    "Kundli Matching",
    "Marriage Prediction",
    "Career Guidance",
    "Health Astrology",
    "Remedies",
    "Gemstone Consultation",
  ];

  const filteredAstrologers = astrologers.filter((astrologer) => {
    return (
      !selectedSpecialization ||
      astrologer.specialization.includes(selectedSpecialization)
    );
  });

  const bookConsultation = (
    astrologerId: string,
    type: "chat" | "call" | "video"
  ) => {
    const astrologer = astrologers.find((a) => a.id === astrologerId);
    if (astrologer) {
      const fee = astrologer.consultationFee[type];
      toast({
        title: "Booking Consultation",
        description: `Booking ${type} consultation with ${astrologer.name} for ₹${fee}. You will be redirected to payment.`,
      });
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Astrology Consultation
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Get expert astrological guidance from certified Vedic astrologers
              for marriage, career, and life decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="astrologers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="astrologers">Expert Astrologers</TabsTrigger>
            <TabsTrigger value="packages">Consultation Packages</TabsTrigger>
            <TabsTrigger value="services">Our Services</TabsTrigger>
          </TabsList>

          {/* Astrologers Tab */}
          <TabsContent value="astrologers">
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <Select
                  value={selectedSpecialization}
                  onValueChange={setSelectedSpecialization}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filter by specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedConsultationType}
                  onValueChange={(value) =>
                    setSelectedConsultationType(
                      value as "chat" | "call" | "video"
                    )
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chat">Chat Consultation</SelectItem>
                    <SelectItem value="call">Voice Call</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Astrologers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAstrologers.map((astrologer) => (
                  <Card
                    key={astrologer.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={astrologer.photo}
                              alt={astrologer.name}
                            />
                            <AvatarFallback>
                              {astrologer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getAvailabilityColor(
                              astrologer.availability
                            )}`}
                          ></div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {astrologer.name}
                            </h3>
                            {astrologer.verified && (
                              <Badge className="bg-orange-100 text-orange-800">
                                Verified
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(astrologer.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {astrologer.rating} ({astrologer.reviewCount}{" "}
                              reviews)
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {astrologer.experience} years experience
                          </p>

                          <div className="flex items-center text-sm text-gray-600">
                            <span>
                              Languages: {astrologer.languages.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Specializations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {astrologer.specialization.map((spec, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Awards */}
                      {astrologer.awards.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Awards & Recognition
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {astrologer.awards.map((award, index) => (
                              <Badge
                                key={index}
                                className="bg-yellow-100 text-yellow-800 text-xs"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                {award}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Consultation Options */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                          Consultation Options
                        </h4>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 border rounded-lg">
                            <MessageCircle className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                            <div className="text-xs text-gray-600">Chat</div>
                            <div className="font-semibold text-sm">
                              ₹{astrologer.consultationFee.chat}
                            </div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <Phone className="h-5 w-5 mx-auto mb-1 text-green-600" />
                            <div className="text-xs text-gray-600">Call</div>
                            <div className="font-semibold text-sm">
                              ₹{astrologer.consultationFee.call}
                            </div>
                          </div>

                          <div className="text-center p-3 border rounded-lg">
                            <Video className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                            <div className="text-xs text-gray-600">Video</div>
                            <div className="font-semibold text-sm">
                              ₹{astrologer.consultationFee.video}
                            </div>
                          </div>
                        </div>

                        {/* Availability Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${getAvailabilityColor(
                                astrologer.availability
                              )}`}
                            ></div>
                            {astrologer.availability === "online" &&
                              "Available Now"}
                            {astrologer.availability === "busy" &&
                              "Currently Busy"}
                            {astrologer.availability === "offline" && "Offline"}
                            {astrologer.nextAvailable && (
                              <span className="text-gray-500 ml-2">
                                Next available:{" "}
                                {astrologer.nextAvailable.toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Book Button */}
                        <Button
                          onClick={() =>
                            bookConsultation(
                              astrologer.id,
                              selectedConsultationType
                            )
                          }
                          disabled={astrologer.availability === "offline"}
                          className="w-full"
                        >
                          {astrologer.availability === "online"
                            ? "Book Now"
                            : "Schedule Consultation"}
                          <span className="ml-2">
                            ₹
                            {
                              astrologer.consultationFee[
                                selectedConsultationType
                              ]
                            }
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Consultation Packages
                </h2>
                <p className="text-gray-600">
                  Choose from our specially designed consultation packages
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {consultationPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative ${
                      pkg.popular ? "ring-2 ring-orange-500" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600">
                        Most Popular
                      </Badge>
                    )}

                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      <p className="text-gray-600 text-sm">{pkg.description}</p>
                      <div className="text-3xl font-bold text-orange-600 mt-2">
                        ₹{pkg.price.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">{pkg.duration}</p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Includes:
                        </h4>
                        <ul className="space-y-2">
                          {pkg.services.map((service, index) => (
                            <li
                              key={index}
                              className="flex items-start text-sm"
                            >
                              <Star className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full">Book Package</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Astrology Services
                </h2>
                <p className="text-gray-600">
                  Comprehensive astrological guidance for all aspects of life
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Kundli Matching",
                    description:
                      "Complete horoscope compatibility analysis for marriage",
                    icon: Users,
                    features: [
                      "36-point Guna Milan",
                      "Manglik analysis",
                      "Compatibility report",
                    ],
                  },
                  {
                    title: "Marriage Prediction",
                    description:
                      "Timing and prospects of marriage based on planetary positions",
                    icon: Calendar,
                    features: [
                      "Marriage timing",
                      "Partner characteristics",
                      "Obstacles analysis",
                    ],
                  },
                  {
                    title: "Career Guidance",
                    description:
                      "Professional guidance based on astrological analysis",
                    icon: Award,
                    features: [
                      "Career path analysis",
                      "Business prospects",
                      "Success timing",
                    ],
                  },
                  {
                    title: "Remedies & Solutions",
                    description:
                      "Effective astrological remedies for various life problems",
                    icon: Star,
                    features: [
                      "Gemstone consultation",
                      "Mantra suggestions",
                      "Ritual guidance",
                    ],
                  },
                  {
                    title: "Health Astrology",
                    description: "Health predictions and preventive measures",
                    icon: Clock,
                    features: [
                      "Health analysis",
                      "Disease prediction",
                      "Preventive remedies",
                    ],
                  },
                  {
                    title: "Muhurat Selection",
                    description: "Auspicious timing for important life events",
                    icon: Calendar,
                    features: [
                      "Wedding muhurat",
                      "Business launch",
                      "Property purchase",
                    ],
                  },
                ].map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                          <IconComponent className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {service.description}
                        </p>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
