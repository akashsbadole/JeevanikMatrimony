'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, Users, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Hero() {
  const [searchData, setSearchData] = useState({
    lookingFor: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    city: '',
  });

  const stats = [
    { icon: Users, label: 'Active Members', value: '2M+' },
    { icon: Heart, label: 'Success Stories', value: '50K+' },
    { icon: Shield, label: 'Verified Profiles', value: '95%' },
    { icon: Star, label: 'Trust Rating', value: '4.8/5' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find Your
              <span className="text-rose-600 block">Perfect Life Partner</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl">
              Join India's most trusted matrimony platform with over 2 million verified profiles. 
              Your journey to finding true love starts here.
            </p>

            {/* Quick Search Form */}
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-rose-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Partner Search
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                <Select value={searchData.lookingFor} onValueChange={(value) => setSearchData(prev => ({ ...prev, lookingFor: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Looking for" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride</SelectItem>
                    <SelectItem value="groom">Groom</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                  <Select value={searchData.ageFrom} onValueChange={(value) => setSearchData(prev => ({ ...prev, ageFrom: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Age from" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 43 }, (_, i) => i + 18).map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={searchData.ageTo} onValueChange={(value) => setSearchData(prev => ({ ...prev, ageTo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Age to" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 43 }, (_, i) => i + 18).map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select value={searchData.religion} onValueChange={(value) => setSearchData(prev => ({ ...prev, religion: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Religion" />
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

                <Input
                  placeholder="City"
                  value={searchData.city}
                  onChange={(e) => setSearchData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/search" className="flex-1">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Search Now
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex-1">
                  <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50">
                    Register Free
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mb-2">
                    <stat.icon className="h-6 w-6 text-rose-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Hero Image */}
              <div className="relative bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img
                    src="/api/placeholder/600/600"
                    alt="Happy couple"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating Success Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-rose-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Priya & Raj</div>
                      <div className="text-xs text-gray-500">Just got engaged!</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-rose-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">500+ matches</div>
                      <div className="text-xs text-gray-500">found today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-rose-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-0 w-12 h-12 bg-orange-200 rounded-full opacity-20 animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Trusted by millions of families across India
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-sm font-medium">Featured in:</div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-500">Times of India</span>
              <span className="text-gray-500">Economic Times</span>
              <span className="text-gray-500">Hindustan Times</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
