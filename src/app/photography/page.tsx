"use client";

import { useState } from "react";
import {
  Camera,
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Award,
  CheckCircle,
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

interface Photographer {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  experience: number;
  specialization: string[];
  location: string;
  priceRange: string;
  portfolio: string[];
  packages: Package[];
  availability: "available" | "busy" | "booked";
  verified: boolean;
}

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  includes: string[];
  deliverables: string[];
  popular?: boolean;
}

export default function PhotographyPage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedPhotographer, setSelectedPhotographer] = useState<
    string | null
  >(null);
  const { toast } = useToast();

  const photographers: Photographer[] = [
    {
      id: "1",
      name: "Rajesh Kumar Photography",
      photo: "/api/placeholder/100/100",
      rating: 4.9,
      reviewCount: 156,
      experience: 8,
      specialization: [
        "Wedding Photography",
        "Pre-wedding Shoots",
        "Traditional Ceremonies",
      ],
      location: "Mumbai, Maharashtra",
      priceRange: "₹50,000 - ₹2,00,000",
      portfolio: [
        "/api/placeholder/300/200",
        "/api/placeholder/300/200",
        "/api/placeholder/300/200",
      ],
      availability: "available",
      verified: true,
      packages: [
        {
          id: "basic",
          name: "Basic Wedding Package",
          description: "Essential wedding photography coverage",
          price: 50000,
          duration: "8 hours",
          includes: [
            "1 Photographer",
            "300+ edited photos",
            "Online gallery",
            "Basic album",
          ],
          deliverables: [
            "Digital photos within 15 days",
            "Basic photo album (50 photos)",
          ],
        },
        {
          id: "premium",
          name: "Premium Wedding Package",
          description: "Comprehensive wedding photography with videography",
          price: 120000,
          duration: "12 hours",
          includes: [
            "2 Photographers",
            "1 Videographer",
            "500+ edited photos",
            "4K video highlights",
            "Premium album",
            "Online gallery",
          ],
          deliverables: [
            "Digital photos within 10 days",
            "Premium album (100 photos)",
            "Wedding highlight video (5-7 mins)",
          ],
          popular: true,
        },
        {
          id: "luxury",
          name: "Luxury Wedding Package",
          description:
            "Complete wedding documentation with cinematic experience",
          price: 250000,
          duration: "2 days",
          includes: [
            "3 Photographers",
            "2 Videographers",
            "1000+ edited photos",
            "Cinematic wedding film",
            "Luxury album",
            "Pre-wedding shoot",
            "Drone coverage",
          ],
          deliverables: [
            "Digital photos within 7 days",
            "Luxury album (150 photos)",
            "Cinematic wedding film (15-20 mins)",
            "Pre-wedding album",
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Priya Lens Studio",
      photo: "/api/placeholder/100/100",
      rating: 4.8,
      reviewCount: 203,
      experience: 6,
      specialization: [
        "Candid Photography",
        "Portrait Sessions",
        "Family Photos",
      ],
      location: "Bangalore, Karnataka",
      priceRange: "₹40,000 - ₹1,50,000",
      portfolio: [
        "/api/placeholder/300/200",
        "/api/placeholder/300/200",
        "/api/placeholder/300/200",
      ],
      availability: "available",
      verified: true,
      packages: [
        {
          id: "candid",
          name: "Candid Wedding Package",
          description: "Natural and candid wedding moments",
          price: 75000,
          duration: "10 hours",
          includes: [
            "2 Photographers",
            "400+ candid shots",
            "Same-day highlights",
            "Online gallery",
          ],
          deliverables: [
            "Digital photos within 12 days",
            "Candid photo album (75 photos)",
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Arjun Visual Arts",
      photo: "/api/placeholder/100/100",
      rating: 4.7,
      reviewCount: 89,
      experience: 5,
      specialization: [
        "Destination Weddings",
        "Cultural Ceremonies",
        "Fashion Photography",
      ],
      location: "Delhi, Delhi",
      priceRange: "₹60,000 - ₹3,00,000",
      portfolio: [
        "/api/placeholder/300/200",
        "/api/placeholder/300/200",
        "/api/placeholder/300/200",
      ],
      availability: "busy",
      verified: true,
      packages: [
        {
          id: "destination",
          name: "Destination Wedding Package",
          description: "Complete destination wedding coverage",
          price: 200000,
          duration: "3 days",
          includes: [
            "Travel included",
            "3 Photographers",
            "2 Videographers",
            "800+ photos",
            "Destination album",
          ],
          deliverables: [
            "Digital photos within 20 days",
            "Destination wedding album (120 photos)",
            "Travel documentary video",
          ],
        },
      ],
    },
  ];

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Pune",
    "Hyderabad",
    "Kolkata",
  ];
  const specializations = [
    "Wedding Photography",
    "Pre-wedding Shoots",
    "Candid Photography",
    "Traditional Ceremonies",
    "Destination Weddings",
  ];

  const filteredPhotographers = photographers.filter((photographer) => {
    const cityMatch =
      !selectedCity || photographer.location.includes(selectedCity);
    const specializationMatch =
      !selectedSpecialization ||
      photographer.specialization.includes(selectedSpecialization);
    return cityMatch && specializationMatch;
  });

  const bookPhotographer = (photographerId: string, packageId: string) => {
    const photographer = photographers.find((p) => p.id === photographerId);
    const pkg = photographer?.packages.find((p) => p.id === packageId);

    if (photographer && pkg) {
      toast({
        title: "Booking Request Sent",
        description: `Your booking request for ${pkg.name} with ${photographer.name} has been sent. You will receive a confirmation call within 24 hours.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Wedding Photography
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Capture your special moments with India's top wedding
              photographers. Professional, verified, and experienced.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSpecialization}
              onValueChange={setSelectedSpecialization}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
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

            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Check Availability
            </Button>
          </div>
        </div>

        {/* Photographers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPhotographers.map((photographer) => (
            <Card
              key={photographer.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={photographer.photo}
                      alt={photographer.name}
                    />
                    <AvatarFallback>
                      {photographer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {photographer.name}
                      </h3>
                      {photographer.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
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
                              i < Math.floor(photographer.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {photographer.rating} ({photographer.reviewCount}{" "}
                        reviews)
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {photographer.location}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-1" />
                      {photographer.experience} years experience
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Specializations */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Specializations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {photographer.specialization.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Portfolio Preview */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Portfolio</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {photographer.portfolio.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                </div>

                {/* Packages */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Packages</h4>
                  <div className="space-y-3">
                    {photographer.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`border rounded-lg p-4 ${
                          pkg.popular
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">
                            {pkg.name}
                          </h5>
                          {pkg.popular && (
                            <Badge className="bg-purple-600 text-white">
                              Popular
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {pkg.description}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-semibold text-purple-600">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600">
                            {pkg.duration}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <h6 className="text-xs font-medium text-gray-700 mb-1">
                              Includes:
                            </h6>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {pkg.includes.slice(0, 3).map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="h-3 w-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h6 className="text-xs font-medium text-gray-700 mb-1">
                              Deliverables:
                            </h6>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {pkg.deliverables
                                .slice(0, 2)
                                .map((item, index) => (
                                  <li key={index} className="flex items-start">
                                    <Clock className="h-3 w-3 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>

                        <Button
                          onClick={() =>
                            bookPhotographer(photographer.id, pkg.id)
                          }
                          disabled={photographer.availability === "booked"}
                          className="w-full"
                          size="sm"
                        >
                          {photographer.availability === "booked"
                            ? "Fully Booked"
                            : "Book Now"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    View Portfolio
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Our Photographers */}
        <div className="mt-16 bg-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Our Photographers?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verified Professionals
              </h3>
              <p className="text-gray-600">
                All photographers are verified with portfolio reviews and client
                testimonials.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Top Rated
              </h3>
              <p className="text-gray-600">
                Only photographers with 4+ star ratings and proven track
                records.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Award Winners
              </h3>
              <p className="text-gray-600">
                Many of our photographers have won national and international
                awards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
