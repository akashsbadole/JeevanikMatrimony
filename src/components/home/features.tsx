import {
  Shield,
  Search,
  Heart,
  MessageCircle,
  Star,
  Users,
  Globe,
  Lock,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description:
        "All profiles are manually verified with document checks to ensure authenticity and safety.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Find your perfect match with detailed filters including caste, education, profession, and more.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Heart,
      title: "Smart Matching",
      description:
        "AI-powered compatibility algorithm suggests the most suitable matches based on your preferences.",
      color: "bg-rose-100 text-rose-600",
    },
    {
      icon: MessageCircle,
      title: "Secure Messaging",
      description:
        "Connect with potential matches through our secure messaging platform with privacy controls.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Star,
      title: "Horoscope Matching",
      description:
        "Traditional Kundli matching with detailed astrological compatibility analysis.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Users,
      title: "Family Involvement",
      description:
        "Allow family members to help in the search process with controlled access and permissions.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connect with Indian families worldwide with location-based search and preferences.",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: Lock,
      title: "Privacy Protection",
      description:
        "Complete control over who can view your profile and contact information.",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Jeevanik?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide a comprehensive platform with advanced features designed
            specifically for Indian families to find the perfect life partner.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Designed for Indian Traditions
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Caste & Community Preferences
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Detailed caste, sub-caste, and community filters to
                        respect traditional preferences.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Regional Language Support
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Platform available in multiple Indian languages for
                        better accessibility.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Family Background Details
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Comprehensive family information including values,
                        status, and background.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Manglik & Astrological Matching
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Traditional horoscope matching with detailed
                        astrological compatibility.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-rose-100">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Success Rate
                    </h4>
                    <div className="text-3xl font-bold text-rose-600">
                      94.5%
                    </div>
                    <p className="text-sm text-gray-600">
                      of our members find their life partner within 6 months
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Profile Verification
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        99.2%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "99.2%" }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        User Satisfaction
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        96.8%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "96.8%" }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Match Accuracy
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        91.5%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: "91.5%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
