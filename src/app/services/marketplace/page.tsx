"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Users,
  ShoppingCart,
  Heart,
  Phone,
  Mail,
  Award,
  CheckCircle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Cart } from "@/components/services/cart";
import {
  useCartItems,
  useCartItemCount,
  useFilteredServices,
  useServicesActions,
  useSelectedCategory,
} from "@/lib/stores/services-store";
import { useUser } from "@clerk/nextjs";
import { Service } from "@/lib/stores/services-store";

export default function ServicesMarketplacePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const cartItems = useCartItems();
  const cartItemCount = useCartItemCount();
  const filteredServices = useFilteredServices();
  const selectedCategory = useSelectedCategory();

  const {
    setServices,
    filterServicesByCategory,
    addToCart,
    setLoadingServices,
  } = useServicesActions();

  // Mock services data
  const mockServices: Service[] = [
    {
      id: "1",
      name: "Professional Wedding Photography",
      description:
        "Capture your special moments with our expert wedding photographers",
      category: "photography",
      price: 25000,
      currency: "INR",
      duration: "8 hours",
      features: [
        "Pre-wedding shoot",
        "Wedding day coverage",
        "500+ edited photos",
        "Online gallery",
      ],
      vendorId: "vendor1",
      vendorName: "Rajesh Photography Studio",
      vendorRating: 4.8,
      vendorReviews: 156,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Mumbai, Maharashtra",
      availability: {
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        timeSlots: ["morning", "afternoon", "evening"],
      },
    },
    {
      id: "2",
      name: "Background Verification Service",
      description:
        "Comprehensive background check for your potential life partner",
      category: "verification",
      price: 3500,
      currency: "INR",
      duration: "5-7 days",
      features: [
        "Education verification",
        "Employment check",
        "Criminal record check",
        "Reference verification",
      ],
      vendorId: "vendor2",
      vendorName: "SecureCheck Services",
      vendorRating: 4.9,
      vendorReviews: 89,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Delhi, India",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["morning", "afternoon"],
      },
    },
    {
      id: "3",
      name: "Astrology Consultation",
      description:
        "Expert astrologer consultation for horoscope matching and guidance",
      category: "astrology",
      price: 1200,
      currency: "INR",
      duration: "1 hour",
      features: [
        "Kundli matching",
        "Compatibility analysis",
        "Remedies suggestion",
        "Future predictions",
      ],
      vendorId: "vendor3",
      vendorName: "Pandit Sharma Astrology",
      vendorRating: 4.7,
      vendorReviews: 234,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Varanasi, Uttar Pradesh",
      availability: {
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        timeSlots: ["morning", "afternoon", "evening"],
      },
    },
    {
      id: "4",
      name: "Wedding Invitation Design",
      description:
        "Beautiful custom wedding invitation cards and digital designs",
      category: "invitation",
      price: 5000,
      currency: "INR",
      duration: "3-5 days",
      features: [
        "Custom design",
        "Multiple revisions",
        "Print-ready files",
        "Digital versions",
      ],
      vendorId: "vendor4",
      vendorName: "Creative Cards Studio",
      vendorRating: 4.6,
      vendorReviews: 78,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Bangalore, Karnataka",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: ["morning", "afternoon"],
      },
    },
    {
      id: "5",
      name: "Wedding Catering Service",
      description:
        "Delicious multi-cuisine catering for your wedding celebration",
      category: "catering",
      price: 800,
      currency: "INR",
      duration: "Per person",
      features: [
        "Multi-cuisine menu",
        "Live counters",
        "Professional service",
        "Decoration included",
      ],
      vendorId: "vendor5",
      vendorName: "Royal Caterers",
      vendorRating: 4.5,
      vendorReviews: 145,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Pune, Maharashtra",
      availability: {
        days: ["Friday", "Saturday", "Sunday"],
        timeSlots: ["afternoon", "evening"],
      },
    },
    {
      id: "6",
      name: "Event Management Service",
      description: "Complete wedding event planning and management",
      category: "event_management",
      price: 50000,
      currency: "INR",
      duration: "Full event",
      features: [
        "Complete planning",
        "Vendor coordination",
        "Day-of management",
        "Decoration setup",
      ],
      vendorId: "vendor6",
      vendorName: "Dream Events",
      vendorRating: 4.8,
      vendorReviews: 92,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Chennai, Tamil Nadu",
      availability: {
        days: ["Friday", "Saturday", "Sunday"],
        timeSlots: ["morning", "afternoon", "evening"],
      },
    },
  ];

  useEffect(() => {
    setServices(mockServices);
  }, [setServices]);

  const handleAddToCart = (service: Service) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add services to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(service);
    toast({
      title: "Added to Cart",
      description: `${service.name} has been added to your cart`,
    });
  };

  const categories = [
    { value: "all", label: "All Services" },
    { value: "photography", label: "Photography" },
    { value: "verification", label: "Background Verification" },
    { value: "astrology", label: "Astrology" },
    { value: "counseling", label: "Counseling" },
    { value: "invitation", label: "Invitations" },
    { value: "catering", label: "Catering" },
    { value: "event_management", label: "Event Management" },
    { value: "transportation", label: "Transportation" },
    { value: "decoration", label: "Decoration" },
    { value: "music", label: "Music & Entertainment" },
    { value: "venue", label: "Venues" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Services Marketplace
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Find and book wedding services from verified vendors
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <Button
                  variant="outline"
                  onClick={() => setIsCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Services
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search services..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) =>
                    filterServicesByCategory(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices
                .filter(
                  (service) =>
                    !searchQuery ||
                    service.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    service.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    service.vendorName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((service) => (
                  <Card
                    key={service.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={service.images[0]}
                        alt={service.name}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                        {service.category.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {service.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">
                              {service.vendorRating}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">
                              ({service.vendorReviews})
                            </span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {service.vendorName}
                          </p>
                          <p className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {service.location}
                          </p>
                          <p className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              ₹{service.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">
                              {service.category === "catering" ? "/person" : ""}
                            </span>
                          </div>

                          <Button
                            onClick={() => handleAddToCart(service)}
                            size="sm"
                            className="bg-rose-600 hover:bg-rose-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
