"use client";

import { useState } from "react";
import { Heart, Calendar, MapPin, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SuccessStoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const successStories = [
    {
      id: 1,
      couple: {
        bride: { name: "Priya Sharma", age: 26, city: "Mumbai" },
        groom: { name: "Rajesh Kumar", age: 29, city: "Delhi" },
      },
      weddingDate: "2024-02-14",
      story:
        "We found each other through Jeevanik and instantly connected over our shared love for classical music and travel. Our families met, and everything fell into place perfectly. The platform's detailed profiles helped us understand each other's values before we even met. We're grateful for bringing us together and making our dream wedding come true!",
      images: ["/placeholder.jpg", "/placeholder.jpg"],
      tags: [
        "Love Marriage",
        "Inter-city",
        "Music Lovers",
        "Travel Enthusiasts",
      ],
      featured: true,
    },
    {
      id: 2,
      couple: {
        bride: { name: "Anita Patel", age: 24, city: "Ahmedabad" },
        groom: { name: "Vikram Singh", age: 27, city: "Jaipur" },
      },
      weddingDate: "2024-01-20",
      story:
        "Our families were looking for a traditional match, and Jeevanik's detailed filters helped us find each other. The horoscope matching feature gave our families confidence in our compatibility. We had a beautiful traditional wedding with all the rituals our families wanted.",
      images: ["/placeholder.jpg", "/placeholder.jpg"],
      tags: [
        "Traditional",
        "Horoscope Match",
        "Family Approved",
        "Gujarati Wedding",
      ],
      featured: false,
    },
    {
      id: 3,
      couple: {
        bride: { name: "Deepika Reddy", age: 28, city: "Hyderabad" },
        groom: { name: "Arjun Nair", age: 31, city: "Bangalore" },
      },
      weddingDate: "2023-12-10",
      story:
        "As working professionals, we appreciated the platform's focus on career and education compatibility. We connected over our shared ambitions and values, leading to a beautiful relationship. Our wedding was a perfect blend of South Indian traditions.",
      images: ["/placeholder.jpg", "/placeholder.jpg"],
      tags: ["Professionals", "Career Focused", "Modern", "South Indian"],
      featured: true,
    },
    {
      id: 4,
      couple: {
        bride: { name: "Meera Gupta", age: 25, city: "Pune" },
        groom: { name: "Rohit Jain", age: 28, city: "Mumbai" },
      },
      weddingDate: "2023-11-25",
      story:
        "We were both looking for someone who shared our spiritual values and love for yoga. The platform's lifestyle preferences helped us find each other. Our wedding was an intimate ceremony focused on our spiritual journey together.",
      images: ["/placeholder.jpg", "/placeholder.jpg"],
      tags: ["Spiritual", "Yoga Lovers", "Intimate Wedding", "Jain Community"],
      featured: false,
    },
    {
      id: 5,
      couple: {
        bride: { name: "Kavya Iyer", age: 26, city: "Chennai" },
        groom: { name: "Aditya Menon", age: 30, city: "Kochi" },
      },
      weddingDate: "2023-10-15",
      story:
        "Being from different states but same culture, we found each other through the platform's regional filters. Our families connected instantly, and we had a grand Kerala-style wedding that celebrated both our traditions.",
      images: ["/placeholder.jpg", "/placeholder.jpg"],
      tags: [
        "Regional Match",
        "Kerala Wedding",
        "Cultural Celebration",
        "Family Unity",
      ],
      featured: false,
    },
    {
      id: 6,
      couple: {
        bride: { name: "Riya Agarwal", age: 27, city: "Kolkata" },
        groom: { name: "Siddharth Bansal", age: 32, city: "Delhi" },
      },
      weddingDate: "2023-09-08",
      story:
        "We both were focused on our careers and thought marriage could wait. But when we found each other on the platform, we realized we had found our perfect partner. Our wedding was a beautiful Bengali ceremony with all traditional rituals.",
      images: ["/placeholder.jpg", "/placeholder.jpg"],
      tags: [
        "Career First",
        "Bengali Wedding",
        "Traditional Rituals",
        "Perfect Timing",
      ],
      featured: true,
    },
  ];

  const stats = [
    { number: "50,000+", label: "Success Stories", icon: Heart },
    { number: "2M+", label: "Happy Families", icon: Heart },
    { number: "95%", label: "Success Rate", icon: Heart },
    { number: "150+", label: "Cities Covered", icon: MapPin },
  ];

  const filteredStories = successStories.filter((story) => {
    const matchesSearch =
      searchTerm === "" ||
      story.couple.bride.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      story.couple.groom.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      story.story.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      filterLocation === "" ||
      story.couple.bride.city === filterLocation ||
      story.couple.groom.city === filterLocation;

    const matchesYear =
      filterYear === "" ||
      new Date(story.weddingDate).getFullYear().toString() === filterYear;

    return matchesSearch && matchesLocation && matchesYear;
  });

  const featuredStories = filteredStories.filter((story) => story.featured);
  const regularStories = filteredStories.filter((story) => !story.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Love Stories That Inspire
            </h1>
            <p className="text-xl text-rose-100 max-w-3xl mx-auto mb-8">
              Real couples, real love stories. Discover how thousands of couples
              found their perfect match and started their journey of love
              through our platform.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-rose-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Kolkata">Kolkata</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterLocation("");
                setFilterYear("");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStories.map((story) => (
                <Card key={story.id} className="overflow-hidden shadow-lg">
                  <div className="relative">
                    <img
                      src={story.images[0]}
                      alt={`${story.couple.bride.name} & ${story.couple.groom.name}`}
                      className="w-full h-64 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-rose-600 text-white">
                      Featured
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {story.couple.bride.name} & {story.couple.groom.name}
                      </h3>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {story.couple.bride.city} & {story.couple.groom.city}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(story.weddingDate).toLocaleDateString(
                            "en-IN",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {story.story}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {story.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Stories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Success Stories ({filteredStories.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularStories.map((story) => (
              <Card
                key={story.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={story.images[0]}
                    alt={`${story.couple.bride.name} & ${story.couple.groom.name}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                    <Heart className="h-4 w-4 text-rose-600 fill-current" />
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {story.couple.bride.name} & {story.couple.groom.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {story.couple.bride.city}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(story.weddingDate).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">
                    {story.story.substring(0, 120)}...
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {story.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {story.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{story.tags.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Read Full Story
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No stories found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria to find more stories.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Your Love Story Awaits
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of couples who found their perfect match. Start
              your journey today and become our next success story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700 px-8">
                Find Your Match
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50 px-8"
              >
                Share Your Story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
