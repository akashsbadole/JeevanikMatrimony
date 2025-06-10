"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Upload, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Basic Information", description: "Tell us about yourself" },
  { id: 2, title: "Physical Details", description: "Your physical attributes" },
  {
    id: 3,
    title: "Location & Religion",
    description: "Where you are and your beliefs",
  },
  {
    id: 4,
    title: "Education & Career",
    description: "Your qualifications and profession",
  },
  { id: 5, title: "Family Details", description: "About your family" },
  {
    id: 6,
    title: "Lifestyle & Preferences",
    description: "Your lifestyle choices",
  },
  {
    id: 7,
    title: "Partner Preferences",
    description: "What you are looking for",
  },
  {
    id: 8,
    title: "Photos & Verification",
    description: "Add photos and verify your profile",
  },
];

export default function CreateProfilePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",

    // Physical Details
    heightCm: "",
    weightKg: "",
    bodyType: "",
    complexion: "",
    physicalStatus: "",

    // Location & Religion
    country: "India",
    state: "",
    city: "",
    willingToRelocate: false,
    religion: "",
    caste: "",
    subCaste: "",
    motherTongue: "",

    // Education & Career
    highestEducation: "",
    educationField: "",
    institutionName: "",
    occupation: "",
    designation: "",
    companyName: "",
    annualIncomeRange: "",

    // Family Details
    familyType: "",
    familyStatus: "",
    familyValues: "",
    fatherOccupation: "",
    motherOccupation: "",
    brothersCount: 0,
    sistersCount: 0,

    // Lifestyle
    diet: "",
    smoking: "",
    drinking: "",
    hobbies: "",

    // About
    aboutMe: "",
    partnerExpectations: "",
  });

  const router = useRouter();
  const { toast } = useToast();

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would submit the form data to your API
      console.log("Submitting profile data:", formData);

      toast({
        title: "Profile Created!",
        description: "Your profile has been created successfully.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <Select
                value={formData.gender}
                onValueChange={(value) => updateFormData("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status *
              </label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) =>
                  updateFormData("maritalStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never_married">Never Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm) *
                </label>
                <Input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => updateFormData("heightCm", e.target.value)}
                  placeholder="Enter height in cm"
                  min="140"
                  max="220"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => updateFormData("weightKg", e.target.value)}
                  placeholder="Enter weight in kg"
                  min="30"
                  max="200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Type
              </label>
              <Select
                value={formData.bodyType}
                onValueChange={(value) => updateFormData("bodyType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Slim</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complexion
              </label>
              <Select
                value={formData.complexion}
                onValueChange={(value) => updateFormData("complexion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select complexion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_fair">Very Fair</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="wheatish">Wheatish</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="very_dark">Very Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Physical Status
              </label>
              <Select
                value={formData.physicalStatus}
                onValueChange={(value) =>
                  updateFormData("physicalStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select physical status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="physically_challenged">
                    Physically Challenged
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => updateFormData("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <Input
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  placeholder="Enter your state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="willingToRelocate"
                checked={formData.willingToRelocate}
                onChange={(e) =>
                  updateFormData("willingToRelocate", e.target.checked)
                }
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <label
                htmlFor="willingToRelocate"
                className="text-sm text-gray-700"
              >
                Willing to relocate after marriage
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion *
                </label>
                <Select
                  value={formData.religion}
                  onValueChange={(value) => updateFormData("religion", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="christian">Christian</SelectItem>
                    <SelectItem value="sikh">Sikh</SelectItem>
                    <SelectItem value="buddhist">Buddhist</SelectItem>
                    <SelectItem value="jain">Jain</SelectItem>
                    <SelectItem value="parsi">Parsi</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mother Tongue *
                </label>
                <Select
                  value={formData.motherTongue}
                  onValueChange={(value) =>
                    updateFormData("motherTongue", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mother tongue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                    <SelectItem value="punjabi">Punjabi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caste
                </label>
                <Input
                  value={formData.caste}
                  onChange={(e) => updateFormData("caste", e.target.value)}
                  placeholder="Enter your caste"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Caste
                </label>
                <Input
                  value={formData.subCaste}
                  onChange={(e) => updateFormData("subCaste", e.target.value)}
                  placeholder="Enter your sub caste"
                />
              </div>
            </div>
          </div>
        );

      // Continue with other steps...
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Step {currentStep} content will be implemented here.
            </p>
          </div>
        );
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Heart className="h-8 w-8 text-rose-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Your Profile
                </h1>
                <p className="text-gray-600">
                  Step {currentStep} of {steps.length}:{" "}
                  {steps[currentStep - 1].title}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="w-32">
                <Progress value={progress} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step.id < currentStep ? "bg-rose-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleSubmit}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Create Profile
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
