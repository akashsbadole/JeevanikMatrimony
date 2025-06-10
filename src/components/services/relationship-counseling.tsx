"use client";

import { useState } from "react";
import {
  Heart,
  Calendar,
  Video,
  MessageCircle,
  Star,
  Clock,
  User,
  Award,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Counselor {
  id: string;
  name: string;
  photo: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  availability: "available" | "busy" | "offline";
  pricePerSession: number;
  bio: string;
  qualifications: string[];
  successStories: number;
}

interface Session {
  id: string;
  counselorId: string;
  counselorName: string;
  date: Date;
  duration: number;
  type: "video" | "audio" | "chat";
  status: "upcoming" | "completed" | "cancelled";
  topic: string;
  notes?: string;
}

export function RelationshipCounseling() {
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(
    null
  );
  const [selectedSessionType, setSelectedSessionType] = useState<
    "video" | "audio" | "chat"
  >("video");
  const { toast } = useToast();

  const counselors: Counselor[] = [
    {
      id: "1",
      name: "Dr. Priya Sharma",
      photo: "/api/placeholder/100/100",
      specialization: [
        "Marriage Counseling",
        "Pre-marital Guidance",
        "Family Therapy",
      ],
      experience: 12,
      rating: 4.9,
      reviewCount: 245,
      languages: ["Hindi", "English", "Gujarati"],
      availability: "available",
      pricePerSession: 1500,
      bio: "Experienced marriage counselor with over 12 years of helping couples build stronger relationships. Specialized in Indian family dynamics and cultural considerations.",
      qualifications: [
        "PhD Psychology",
        "Certified Marriage Counselor",
        "Family Therapy Specialist",
      ],
      successStories: 180,
    },
    {
      id: "2",
      name: "Dr. Rajesh Kumar",
      photo: "/api/placeholder/100/100",
      specialization: [
        "Relationship Building",
        "Communication Skills",
        "Conflict Resolution",
      ],
      experience: 8,
      rating: 4.8,
      reviewCount: 156,
      languages: ["Hindi", "English", "Punjabi"],
      availability: "available",
      pricePerSession: 1200,
      bio: "Helping couples understand each other better and build lasting relationships. Focus on practical communication techniques and conflict resolution.",
      qualifications: ["M.Phil Psychology", "Relationship Coach Certification"],
      successStories: 120,
    },
    {
      id: "3",
      name: "Dr. Meera Iyer",
      photo: "/api/placeholder/100/100",
      specialization: [
        "Cultural Integration",
        "Inter-caste Marriages",
        "Family Acceptance",
      ],
      experience: 15,
      rating: 4.9,
      reviewCount: 320,
      languages: ["Tamil", "English", "Hindi", "Malayalam"],
      availability: "busy",
      pricePerSession: 1800,
      bio: "Specialist in helping couples navigate cultural differences and family dynamics. Extensive experience with inter-caste and inter-cultural marriages.",
      qualifications: [
        "PhD Clinical Psychology",
        "Cultural Therapy Specialist",
        "Family Mediation Certified",
      ],
      successStories: 250,
    },
  ];

  const upcomingSessions: Session[] = [
    {
      id: "1",
      counselorId: "1",
      counselorName: "Dr. Priya Sharma",
      date: new Date("2024-01-25T15:00:00"),
      duration: 60,
      type: "video",
      status: "upcoming",
      topic: "Communication Improvement",
    },
    {
      id: "2",
      counselorId: "2",
      counselorName: "Dr. Rajesh Kumar",
      date: new Date("2024-01-28T10:30:00"),
      duration: 45,
      type: "video",
      status: "upcoming",
      topic: "Pre-marriage Counseling",
    },
  ];

  const bookSession = (counselorId: string) => {
    const counselor = counselors.find((c) => c.id === counselorId);
    if (counselor) {
      toast({
        title: "Session Booking",
        description: `Booking session with ${counselor.name}. You will be redirected to payment.`,
      });
      // In real app, this would open booking modal or redirect to payment
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Available Now";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Relationship Counseling
        </h1>
        <p className="text-gray-600">
          Professional guidance for stronger relationships and successful
          marriages
        </p>
      </div>

      <Tabs defaultValue="counselors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="counselors">Find Counselors</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Counselors Tab */}
        <TabsContent value="counselors">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <Card
                key={counselor.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={counselor.photo}
                          alt={counselor.name}
                        />
                        <AvatarFallback>
                          {counselor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getAvailabilityColor(
                          counselor.availability
                        )}`}
                      ></div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {counselor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getAvailabilityText(counselor.availability)}
                      </p>

                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(counselor.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {counselor.rating} ({counselor.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Specializations */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {counselor.specialization.map((spec, index) => (
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

                  {/* Experience & Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {counselor.experience}
                      </div>
                      <div className="text-xs text-gray-600">
                        Years Experience
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {counselor.successStories}
                      </div>
                      <div className="text-xs text-gray-600">
                        Success Stories
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Languages
                    </h4>
                    <p className="text-sm text-gray-600">
                      {counselor.languages.join(", ")}
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {counselor.bio}
                    </p>
                  </div>

                  {/* Price & Booking */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{counselor.pricePerSession}
                      </span>
                      <span className="text-sm text-gray-600">per session</span>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => bookSession(counselor.id)}
                        disabled={counselor.availability === "offline"}
                        className="w-full"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Book Video Session
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <User className="h-3 w-3 mr-1" />
                          Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {session.counselorName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {session.topic}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {session.type === "video" && (
                              <Video className="h-3 w-3 mr-1" />
                            )}
                            {session.type === "audio" && (
                              <MessageCircle className="h-3 w-3 mr-1" />
                            )}
                            {session.type === "chat" && (
                              <MessageCircle className="h-3 w-3 mr-1" />
                            )}
                            {session.type}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {session.date.toLocaleDateString()} at{" "}
                            {session.date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            <Clock className="h-4 w-4 ml-3 mr-1" />
                            {session.duration} minutes
                          </div>

                          <div className="space-x-2">
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                            <Button size="sm">Join Session</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No Upcoming Sessions
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Book a session with one of our expert counselors
                    </p>
                    <Button>Browse Counselors</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session History */}
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No Previous Sessions
                  </h3>
                  <p className="text-gray-500">
                    Your completed sessions will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Relationship Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-medium text-gray-900">
                      Building Trust in Marriage
                    </h4>
                    <p className="text-sm text-gray-600">
                      Essential tips for creating lasting trust
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <h4 className="font-medium text-gray-900">
                      Communication Techniques
                    </h4>
                    <p className="text-sm text-gray-600">
                      Effective ways to express your feelings
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <h4 className="font-medium text-gray-900">
                      Managing Family Expectations
                    </h4>
                    <p className="text-sm text-gray-600">
                      Balancing couple and family needs
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Articles
                </Button>
              </CardContent>
            </Card>

            {/* Workshops */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Upcoming Workshops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">
                      Pre-Marriage Workshop
                    </h4>
                    <p className="text-sm text-blue-700">
                      Jan 30, 2024 • 2:00 PM
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      ₹500 per couple
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900">
                      Communication Skills
                    </h4>
                    <p className="text-sm text-green-700">
                      Feb 5, 2024 • 3:00 PM
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ₹300 per person
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Register for Workshop
                </Button>
              </CardContent>
            </Card>

            {/* Self-Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Self-Assessment Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Relationship Health Check
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Communication Style Quiz
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Compatibility Assessment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Conflict Resolution Style
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
