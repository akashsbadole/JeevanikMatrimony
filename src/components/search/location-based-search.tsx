'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Users, Filter, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface LocationBasedSearchProps {
  onLocationUpdate: (location: LocationData) => void;
  onNearbyMatches: (matches: any[]) => void;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  accuracy: number;
}

interface NearbyMatch {
  id: string;
  name: string;
  age: number;
  photo: string;
  distance: number;
  city: string;
  profession: string;
  lastActive: string;
  isOnline: boolean;
}

export function LocationBasedSearch({ onLocationUpdate, onNearbyMatches }: LocationBasedSearchProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchRadius, setSearchRadius] = useState([50]); // km
  const [enableAutoLocation, setEnableAutoLocation] = useState(false);
  const [nearbyMatches, setNearbyMatches] = useState<NearbyMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const { toast } = useToast();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (currentLocation && enableAutoLocation) {
      searchNearbyMatches();
    }
  }, [currentLocation, searchRadius, enableAutoLocation]);

  const checkLocationPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(permission.state);
        
        permission.addEventListener('change', () => {
          setLocationPermission(permission.state);
        });
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    }
  };

  const getCurrentLocation = async () => {
    if (!('geolocation' in navigator)) {
      toast({
        title: 'Location Not Supported',
        description: 'Your browser does not support location services.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      // Reverse geocoding to get address
      const locationData = await reverseGeocode(latitude, longitude);
      
      const location: LocationData = {
        latitude,
        longitude,
        accuracy: accuracy || 0,
        ...locationData,
      };

      setCurrentLocation(location);
      onLocationUpdate(location);

      toast({
        title: 'Location Updated',
        description: `Your location has been set to ${location.city}, ${location.state}`,
      });

    } catch (error: any) {
      console.error('Error getting location:', error);
      
      let errorMessage = 'Failed to get your location';
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location services.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please try again.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }

      toast({
        title: 'Location Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<{
    city: string;
    state: string;
    country: string;
  }> => {
    try {
      // In a real implementation, you would use a geocoding service like Google Maps API
      // For demo purposes, returning mock data
      return {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown',
      };
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  const searchNearbyMatches = async () => {
    if (!currentLocation) return;

    setIsSearching(true);

    try {
      // Mock nearby matches data
      const mockMatches: NearbyMatch[] = [
        {
          id: '1',
          name: 'Priya Sharma',
          age: 26,
          photo: '/api/placeholder/100/100',
          distance: 2.5,
          city: 'Mumbai',
          profession: 'Software Engineer',
          lastActive: '2 hours ago',
          isOnline: true,
        },
        {
          id: '2',
          name: 'Anita Patel',
          age: 24,
          photo: '/api/placeholder/100/100',
          distance: 5.8,
          city: 'Mumbai',
          profession: 'Doctor',
          lastActive: '1 day ago',
          isOnline: false,
        },
        {
          id: '3',
          name: 'Kavya Reddy',
          age: 28,
          photo: '/api/placeholder/100/100',
          distance: 12.3,
          city: 'Navi Mumbai',
          profession: 'Teacher',
          lastActive: '3 hours ago',
          isOnline: true,
        },
        {
          id: '4',
          name: 'Sneha Singh',
          age: 25,
          photo: '/api/placeholder/100/100',
          distance: 18.7,
          city: 'Thane',
          profession: 'Marketing Manager',
          lastActive: '5 hours ago',
          isOnline: false,
        },
      ];

      // Filter by search radius
      const filteredMatches = mockMatches.filter(match => 
        match.distance <= searchRadius[0]
      );

      setNearbyMatches(filteredMatches);
      onNearbyMatches(filteredMatches);

      toast({
        title: 'Nearby Matches Found',
        description: `Found ${filteredMatches.length} matches within ${searchRadius[0]}km`,
      });

    } catch (error) {
      console.error('Error searching nearby matches:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to find nearby matches. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Location-Based Search
          </CardTitle>
          <p className="text-gray-600">
            Find matches near your location for easier meetups and connections.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Location */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Current Location</h4>
            {currentLocation ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-900">
                      {currentLocation.city}, {currentLocation.state}
                    </p>
                    <p className="text-sm text-green-700">
                      Accuracy: ±{Math.round(currentLocation.accuracy)}m
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 mb-3">No location set</p>
                <Button
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation || locationPermission === 'denied'}
                  className="w-full"
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Current Location
                    </>
                  )}
                </Button>
                
                {locationPermission === 'denied' && (
                  <p className="text-sm text-red-600 mt-2">
                    Location access denied. Please enable location services in your browser settings.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Search Radius */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Search Radius</h4>
              <span className="text-sm text-gray-600">{searchRadius[0]} km</span>
            </div>
            <Slider
              value={searchRadius}
              onValueChange={setSearchRadius}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
              <span>100 km</span>
            </div>
          </div>

          {/* Auto Location Updates */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto-update Location</h4>
              <p className="text-sm text-gray-600">
                Automatically search for matches when your location changes
              </p>
            </div>
            <Switch
              checked={enableAutoLocation}
              onCheckedChange={setEnableAutoLocation}
            />
          </div>

          {/* Manual Search */}
          <Button
            onClick={searchNearbyMatches}
            disabled={!currentLocation || isSearching}
            className="w-full"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Find Nearby Matches
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Nearby Matches */}
      {nearbyMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Nearby Matches
              </span>
              <Badge>{nearbyMatches.length} found</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nearbyMatches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={match.photo}
                        alt={match.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {match.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{match.name}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {match.distance} km away
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">
                        {match.age} years • {match.profession}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{match.city}</p>
                        <div className="flex items-center space-x-2">
                          {match.isOnline ? (
                            <Badge className="bg-green-100 text-green-800">Online</Badge>
                          ) : (
                            <span className="text-xs text-gray-500">Active {match.lastActive}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <Button size="sm" className="flex-1">
                      Send Interest
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Privacy Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <h5 className="font-medium text-blue-900 mb-1">Privacy & Security</h5>
              <p className="text-blue-700">
                Your exact location is never shared with other users. Only approximate distances 
                are shown to maintain your privacy while enabling location-based matching.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
