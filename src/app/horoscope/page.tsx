"use client";

import { useState } from "react";
import {
  Star,
  Calendar,
  MapPin,
  Clock,
  Heart,
  AlertTriangle,
  CheckCircle,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HoroscopePage() {
  const [activeTab, setActiveTab] = useState("matching");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Mock horoscope data
  const userHoroscope = {
    birthDetails: {
      date: "1995-03-15",
      time: "14:30",
      place: "Mumbai, Maharashtra",
      latitude: 19.076,
      longitude: 72.8777,
    },
    astrological: {
      sunSign: "Pisces",
      moonSign: "Cancer",
      ascendant: "Gemini",
      nakshatra: "Pushya",
      pada: 2,
      gana: "Deva",
      nadi: "Madhya",
      yoni: "Sarpa",
      vashya: "Jalachara",
      varna: "Brahmin",
      tara: 5,
    },
    doshas: {
      manglik: { status: true, severity: "Medium" },
      kaalSarp: { status: false },
      shani: { status: false },
      rahuKetu: { status: false },
    },
    gunaScore: 28,
  };

  const compatibilityResults = [
    {
      id: "1",
      name: "Priya Sharma",
      photo: "/api/placeholder/100/100",
      age: 26,
      city: "Delhi",
      totalScore: 32,
      percentage: 89,
      level: "Excellent",
      scores: {
        varna: 1,
        vashya: 2,
        tara: 3,
        yoni: 4,
        grahaMaitri: 5,
        gana: 6,
        bhakoot: 7,
        nadi: 4,
      },
      manglikCompatible: true,
      strengths: [
        "Excellent mental compatibility",
        "Strong emotional bond",
        "Good financial prospects",
      ],
      challenges: ["Minor differences in family values"],
    },
    {
      id: "2",
      name: "Anita Patel",
      photo: "/api/placeholder/100/100",
      age: 24,
      city: "Ahmedabad",
      totalScore: 26,
      percentage: 72,
      level: "Good",
      scores: {
        varna: 1,
        vashya: 1,
        tara: 3,
        yoni: 3,
        grahaMaitri: 4,
        gana: 6,
        bhakoot: 6,
        nadi: 2,
      },
      manglikCompatible: true,
      strengths: ["Good spiritual compatibility", "Similar life goals"],
      challenges: [
        "Different communication styles",
        "Family background differences",
      ],
    },
  ];

  const gunaDetails = [
    { name: "Varna", description: "Spiritual compatibility", maxScore: 1 },
    { name: "Vashya", description: "Mutual attraction", maxScore: 2 },
    { name: "Tara", description: "Health and well-being", maxScore: 3 },
    { name: "Yoni", description: "Sexual compatibility", maxScore: 4 },
    { name: "Graha Maitri", description: "Mental compatibility", maxScore: 5 },
    { name: "Gana", description: "Temperament matching", maxScore: 6 },
    { name: "Bhakoot", description: "Love and affection", maxScore: 7 },
    { name: "Nadi", description: "Health of progeny", maxScore: 8 },
  ];

  const renderCompatibilityCard = (result: any) => (
    <Card key={result.id} className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={result.photo}
              alt={result.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{result.name}</h3>
              <p className="text-gray-600">
                {result.age} years • {result.city}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-rose-600">
              {result.totalScore}/36
            </div>
            <Badge
              className={`${
                result.level === "Excellent"
                  ? "bg-green-100 text-green-800"
                  : result.level === "Good"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {result.level} ({result.percentage}%)
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Guna Milan Breakdown */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Guna Milan Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gunaDetails.map((guna, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-600">{guna.name}</div>
                <div className="text-lg font-semibold">
                  {Object.values(result.scores)[index] as number}/
                  {guna.maxScore}
                </div>
                <Progress
                  value={
                    ((Object.values(result.scores)[index] as number) /
                      guna.maxScore) *
                    100
                  }
                  className="h-2 mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Manglik Compatibility */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            {result.manglikCompatible ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">
              Manglik Compatibility:{" "}
              {result.manglikCompatible ? "Compatible" : "Not Compatible"}
            </span>
          </div>
        </div>

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h5 className="font-medium text-green-700 mb-2">Strengths</h5>
            <ul className="text-sm space-y-1">
              {result.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-orange-700 mb-2">
              Areas to Consider
            </h5>
            <ul className="text-sm space-y-1">
              {result.challenges.map((challenge: string, index: number) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button className="bg-rose-600 hover:bg-rose-700">
            View Detailed Report
          </Button>
          <Button variant="outline">Send Interest</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Star className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Horoscope Matching</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Find your perfect match through traditional Vedic astrology and
              Guna Milan
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matching">Compatibility</TabsTrigger>
            <TabsTrigger value="horoscope">My Horoscope</TabsTrigger>
            <TabsTrigger value="upload">Upload Kundli</TabsTrigger>
            <TabsTrigger value="astrologer">Consult Astrologer</TabsTrigger>
          </TabsList>

          {/* Compatibility Matching */}
          <TabsContent value="matching" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Horoscope Compatibility Results
              </h2>
              <p className="text-gray-600">
                Based on traditional Guna Milan system with 36-point
                compatibility scoring
              </p>
            </div>

            {compatibilityResults.map(renderCompatibilityCard)}
          </TabsContent>

          {/* My Horoscope */}
          <TabsContent value="horoscope" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Birth Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Birth Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium">
                        {userHoroscope.birthDetails.date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time of Birth:</span>
                      <span className="font-medium">
                        {userHoroscope.birthDetails.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Place of Birth:</span>
                      <span className="font-medium">
                        {userHoroscope.birthDetails.place}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Astrological Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Astrological Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Sun Sign</span>
                      <div className="font-medium">
                        {userHoroscope.astrological.sunSign}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Moon Sign</span>
                      <div className="font-medium">
                        {userHoroscope.astrological.moonSign}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Ascendant</span>
                      <div className="font-medium">
                        {userHoroscope.astrological.ascendant}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Nakshatra</span>
                      <div className="font-medium">
                        {userHoroscope.astrological.nakshatra}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Gana</span>
                      <div className="font-medium">
                        {userHoroscope.astrological.gana}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Nadi</span>
                      <div className="font-medium">
                        {userHoroscope.astrological.nadi}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Doshas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Doshas Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Manglik Dosha</span>
                      <div className="flex items-center space-x-2">
                        {userHoroscope.doshas.manglik.status ? (
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        <span
                          className={
                            userHoroscope.doshas.manglik.status
                              ? "text-orange-600"
                              : "text-green-600"
                          }
                        >
                          {userHoroscope.doshas.manglik.status
                            ? `Yes (${userHoroscope.doshas.manglik.severity})`
                            : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Kaal Sarp Dosha</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">No</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Shani Dosha</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">No</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guna Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Compatibility Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-rose-600 mb-2">
                      {userHoroscope.gunaScore}/36
                    </div>
                    <Progress
                      value={(userHoroscope.gunaScore / 36) * 100}
                      className="mb-4"
                    />
                    <p className="text-gray-600">
                      Your horoscope shows good compatibility potential with
                      suitable matches
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Upload Kundli */}
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Kundli</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload Kundli Document
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upload your birth chart or kundli for detailed astrological
                    analysis
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Choose File
                  </Button>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Supported Formats:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PDF documents</li>
                    <li>• Image files (JPG, PNG)</li>
                    <li>• Maximum file size: 5MB</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consult Astrologer */}
          <TabsContent value="astrologer" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <img
                        src={`/api/placeholder/80/80`}
                        alt="Astrologer"
                        className="w-20 h-20 rounded-full mx-auto mb-4"
                      />
                      <h3 className="font-semibold mb-1">Pandit Raj Kumar</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        25+ years experience
                      </p>
                      <div className="flex items-center justify-center mb-4">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">4.8 (120 reviews)</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Specializes in marriage compatibility and Kundli
                        matching
                      </p>
                      <div className="text-lg font-semibold text-green-600 mb-4">
                        ₹500/consultation
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Book Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
