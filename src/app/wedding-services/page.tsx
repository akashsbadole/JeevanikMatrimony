"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Star,
  MapPin,
  Clock,
  Camera,
  Shield,
  Heart,
  Users,
  Car,
  Music,
  Utensils,
  Calendar,
  Gift,
  Palette,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import {
  useServices,
  useCartItems,
  useCartTotal,
  useCartItemCount,
  useServiceCategories,
  useSelectedCategory,
  useFilteredServices,
  useServicesActions,
  Service,
} from "@/lib/stores/services-store";

const categoryIcons = {
  photography: Camera,
  verification: Shield,
  astrology: Star,
  counseling: Heart,
  profile_writing: Users,
  invitation: Calendar,
  catering: Utensils,
  event_management: Users,
  transportation: Car,
  decoration: Palette,
  music: Music,
  venue: MapPin,
};

const categoryLabels = {
  photography: "Photography",
  verification: "Background Verification",
  astrology: "Astrology Consultation",
  counseling: "Relationship Counseling",
  profile_writing: "Profile Writing",
  invitation: "Invitation Cards",
  catering: "Catering Services",
  event_management: "Event Management",
  transportation: "Transportation",
  decoration: "Decoration",
  music: "Music & Entertainment",
  venue: "Venue Booking",
};

export default function WeddingServicesPage() {
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showCart, setShowCart] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Store hooks
  const services = useFilteredServices();
  const cartItems = useCartItems();
  const cartTotal = useCartTotal();
  const cartItemCount = useCartItemCount();
  const categories = useServiceCategories();
  const selectedCategory = useSelectedCategory();

  const {
    setServices,
    filterServicesByCategory,
    filterServicesByPrice,
    searchServices,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    createOrder,
  } = useServicesActions();

  // Mock services data
  const mockServices: Service[] = [
    {
      id: "1",
      name: "Professional Wedding Photography",
      description:
        "Complete wedding photography package with pre-wedding, ceremony, and reception coverage",
      category: "photography",
      price: 50000,
      currency: "INR",
      duration: "8 hours",
      features: [
        "Pre-wedding shoot",
        "Ceremony coverage",
        "Reception photography",
        "500+ edited photos",
        "Online gallery",
      ],
      vendorId: "vendor1",
      vendorName: "Capture Moments Studio",
      vendorRating: 4.8,
      vendorReviews: 156,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Mumbai, Maharashtra",
      availability: {
        days: ["Saturday", "Sunday"],
        timeSlots: ["Morning", "Evening"],
      },
    },
    {
      id: "2",
      name: "Background Verification Service",
      description:
        "Comprehensive background verification including education, employment, and character verification",
      category: "verification",
      price: 5000,
      currency: "INR",
      duration: "7-10 days",
      features: [
        "Education verification",
        "Employment verification",
        "Character certificate",
        "Criminal background check",
        "Detailed report",
      ],
      vendorId: "vendor2",
      vendorName: "TrustVerify Services",
      vendorRating: 4.9,
      vendorReviews: 89,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Pan India",
    },
    {
      id: "3",
      name: "Kundli Matching & Astrology Consultation",
      description:
        "Expert astrologer consultation for kundli matching and marriage compatibility analysis",
      category: "astrology",
      price: 2500,
      currency: "INR",
      duration: "1 hour",
      features: [
        "Kundli matching",
        "Compatibility analysis",
        "Manglik dosha check",
        "Remedies suggestion",
        "Written report",
      ],
      vendorId: "vendor3",
      vendorName: "Pandit Raj Sharma",
      vendorRating: 4.7,
      vendorReviews: 234,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Delhi, India",
    },
    {
      id: "4",
      name: "Premium Invitation Card Design",
      description:
        "Custom wedding invitation card design with printing and delivery",
      category: "invitation",
      price: 15000,
      currency: "INR",
      duration: "5-7 days",
      features: [
        "Custom design",
        "Premium paper",
        "100 cards included",
        "Digital version",
        "Free delivery",
      ],
      vendorId: "vendor4",
      vendorName: "Royal Cards & Prints",
      vendorRating: 4.6,
      vendorReviews: 78,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Bangalore, Karnataka",
    },
    {
      id: "5",
      name: "Wedding Catering Service",
      description:
        "Traditional Indian wedding catering with variety of cuisines",
      category: "catering",
      price: 800,
      currency: "INR",
      duration: "Per person",
      features: [
        "Multi-cuisine menu",
        "Live counters",
        "Professional service",
        "Decoration included",
        "Unlimited servings",
      ],
      vendorId: "vendor5",
      vendorName: "Spice Garden Caterers",
      vendorRating: 4.5,
      vendorReviews: 145,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Pune, Maharashtra",
    },
    {
      id: "6",
      name: "Luxury Car Rental for Wedding",
      description: "Premium car rental service for wedding ceremonies",
      category: "transportation",
      price: 12000,
      currency: "INR",
      duration: "12 hours",
      features: [
        "Luxury sedan",
        "Professional driver",
        "Decoration included",
        "Fuel included",
        "Insurance covered",
      ],
      vendorId: "vendor6",
      vendorName: "Elite Car Rentals",
      vendorRating: 4.4,
      vendorReviews: 67,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Chennai, Tamil Nadu",
    },
    {
      id: "7",
      name: "Wedding Event Management",
      description: "Complete wedding planning and event management services",
      category: "event_management",
      price: 75000,
      currency: "INR",
      duration: "Full wedding",
      features: [
        "Complete planning",
        "Vendor coordination",
        "Day-of coordination",
        "Timeline management",
        "Emergency support",
      ],
      vendorId: "vendor7",
      vendorName: "Dream Weddings Co.",
      vendorRating: 4.9,
      vendorReviews: 203,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Goa, India",
    },
    {
      id: "8",
      name: "Wedding Decoration & Flowers",
      description:
        "Beautiful floral arrangements and wedding decoration services",
      category: "decoration",
      price: 25000,
      currency: "INR",
      duration: "Full day",
      features: [
        "Floral arrangements",
        "Stage decoration",
        "Entrance decor",
        "Table settings",
        "Lighting setup",
      ],
      vendorId: "vendor8",
      vendorName: "Bloom & Bliss Decorators",
      vendorRating: 4.6,
      vendorReviews: 112,
      isActive: true,
      images: ["/placeholder.jpg"],
      location: "Jaipur, Rajasthan",
    },
  ];

  useEffect(() => {
    // Load services on component mount
    setServices(mockServices);
  }, [setServices]);

  const handleAddToCart = (service: Service) => {
    if (!isSignedIn) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add services to cart",
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

  const handleRemoveFromCart = (serviceId: string) => {
    const item = cartItems.find((item) => item.serviceId === serviceId);
    removeFromCart(serviceId);
    toast({
      title: "Removed from Cart",
      description: `${item?.service.name} has been removed from your cart`,
    });
  };

  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(serviceId);
      return;
    }
    updateCartItem(serviceId, { quantity });
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add some services to your cart first",
        variant: "destructive",
      });
      return;
    }

    try {
      const order = await createOrder(cartItems);
      clearCart();
      setShowCart(false);

      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.id} has been created. Vendors will contact you soon.`,
      });
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isInCart = (serviceId: string) => {
    return cartItems.some((item) => item.serviceId === serviceId);
  };

  const getCartItemQuantity = (serviceId: string) => {
    const item = cartItems.find((item) => item.serviceId === serviceId);
    return item?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Wedding Services Marketplace
              </h1>
              <p className="text-xl text-rose-100 max-w-3xl">
                Find the perfect services for your special day from verified
                vendors
              </p>
            </div>
            <Button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-white text-rose-600 hover:bg-gray-100"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({cartItemCount})
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <Input
                  placeholder="Search by name or vendor"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchServices(e.target.value);
                  }}
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={selectedCategory || ""}
                  onValueChange={filterServicesByCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {
                          categoryLabels[
                            category as keyof typeof categoryLabels
                          ]
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                  {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value as [number, number]);
                    filterServicesByPrice(value as [number, number]);
                  }}
                  max={100000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  filterServicesByCategory(null);
                  filterServicesByPrice([0, 100000]);
                  setPriceRange([0, 100000]);
                  setSearchQuery("");
                  setServices(mockServices);
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {/* Category Tabs */}
            <Tabs
              value={selectedCategory || "all"}
              onValueChange={filterServicesByCategory}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="">All</TabsTrigger>
                <TabsTrigger value="photography">Photography</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="astrology">Astrology</TabsTrigger>
                <TabsTrigger value="catering">Catering</TabsTrigger>
                <TabsTrigger value="event_management">Events</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service) => {
                const IconComponent = categoryIcons[service.category];
                const inCart = isInCart(service.id);
                const quantity = getCartItemQuantity(service.id);

                return (
                  <Card
                    key={service.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={service.images[0]}
                        alt={service.name}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => {
                          setSelectedService(service);
                          setShowServiceModal(true);
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-rose-500 text-white">
                          <IconComponent className="h-3 w-3 mr-1" />
                          {categoryLabels[service.category]}
                        </Badge>
                      </div>
                      {service.vendorRating && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-500 text-white">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {service.vendorRating}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {service.description}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {/* Vendor Info */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {service.vendorName}
                          </span>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                            {service.vendorRating} ({service.vendorReviews})
                          </div>
                        </div>

                        {/* Location & Duration */}
                        <div className="space-y-1">
                          {service.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              {service.location}
                            </div>
                          )}
                          {service.duration && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration}
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1">
                          {service.features
                            .slice(0, 2)
                            .map((feature, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          {service.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{service.features.length - 2} more
                            </Badge>
                          )}
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <span className="text-xl font-bold text-rose-600">
                              {formatPrice(service.price, service.currency)}
                            </span>
                            {service.category === "catering" && (
                              <span className="text-sm text-gray-600 ml-1">
                                per person
                              </span>
                            )}
                          </div>

                          {inCart ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateQuantity(service.id, quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateQuantity(service.id, quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleAddToCart(service)}
                              className="bg-rose-600 hover:bg-rose-700"
                              size="sm"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No Results */}
            {services.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to find more services
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-[#1ec3da] bg-opacity-50"
            onClick={() => setShowCart(false)}
          />
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <Button variant="ghost" onClick={() => setShowCart(false)}>
                  ×
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.serviceId}
                        className="border rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">
                            {item.service.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.serviceId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {item.service.vendorName}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.serviceId,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.serviceId,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-medium">
                            {formatPrice(
                              item.service.price * item.quantity,
                              item.service.currency
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-rose-600">
                      {formatPrice(cartTotal, "INR")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-rose-600 hover:bg-rose-700"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="w-full"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="max-w-2xl">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedService.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedService.images[0]}
                  alt={selectedService.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-600">{selectedService.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Features</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold text-rose-600">
                      {formatPrice(
                        selectedService.price,
                        selectedService.currency
                      )}
                    </span>
                    <p className="text-sm text-gray-600">
                      by {selectedService.vendorName}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      handleAddToCart(selectedService);
                      setShowServiceModal(false);
                    }}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
