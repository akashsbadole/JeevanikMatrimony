// Location Detection and Management Service

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  address?: string;
}

interface IPLocationData {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
}

interface GeocodeResult {
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

class LocationService {
  private watchId: number | null = null;
  private currentLocation: LocationData | null = null;

  // Get user's current location using GPS
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          // Get address details using reverse geocoding
          try {
            const addressData = await this.reverseGeocode(
              locationData.latitude,
              locationData.longitude
            );
            Object.assign(locationData, addressData);
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
          }

          this.currentLocation = locationData;
          resolve(locationData);
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(new Error(`Geolocation failed: ${error.message}`));
        },
        options
      );
    });
  }

  // Get location based on IP address
  async getLocationByIP(): Promise<LocationData> {
    try {
      // Using ipapi.co as a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data: IPLocationData = await response.json();

      const locationData: LocationData = {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        state: data.region,
        country: data.country,
        postalCode: data.postal_code,
      };

      this.currentLocation = locationData;
      return locationData;
    } catch (error) {
      console.error('IP location detection failed:', error);
      throw new Error('Failed to detect location by IP');
    }
  }

  // Reverse geocoding to get address from coordinates
  async reverseGeocode(lat: number, lng: number): Promise<Partial<LocationData>> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status !== 'OK' || !data.results.length) {
        throw new Error('Geocoding failed');
      }

      const result: GeocodeResult = data.results[0];
      const addressComponents = result.address_components;

      const locationData: Partial<LocationData> = {
        address: result.formatted_address,
      };

      // Extract specific address components
      addressComponents.forEach((component) => {
        if (component.types.includes('locality')) {
          locationData.city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          locationData.state = component.long_name;
        } else if (component.types.includes('country')) {
          locationData.country = component.long_name;
        } else if (component.types.includes('postal_code')) {
          locationData.postalCode = component.long_name;
        }
      });

      return locationData;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
  }

  // Forward geocoding to get coordinates from address
  async geocodeAddress(address: string): Promise<LocationData> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status !== 'OK' || !data.results.length) {
        throw new Error('Address not found');
      }

      const result: GeocodeResult = data.results[0];
      const location = result.geometry.location;
      const addressComponents = result.address_components;

      const locationData: LocationData = {
        latitude: location.lat,
        longitude: location.lng,
        address: result.formatted_address,
      };

      // Extract specific address components
      addressComponents.forEach((component) => {
        if (component.types.includes('locality')) {
          locationData.city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          locationData.state = component.long_name;
        } else if (component.types.includes('country')) {
          locationData.country = component.long_name;
        } else if (component.types.includes('postal_code')) {
          locationData.postalCode = component.long_name;
        }
      });

      return locationData;
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw error;
    }
  }

  // Calculate distance between two points (in kilometers)
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Watch position changes
  watchPosition(callback: (location: LocationData) => void): void {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported');
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    };

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        try {
          const addressData = await this.reverseGeocode(
            locationData.latitude,
            locationData.longitude
          );
          Object.assign(locationData, addressData);
        } catch (error) {
          console.warn('Reverse geocoding failed:', error);
        }

        this.currentLocation = locationData;
        callback(locationData);
      },
      (error) => {
        console.error('Position watch error:', error);
      },
      options
    );
  }

  // Stop watching position
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get cached location
  getCachedLocation(): LocationData | null {
    return this.currentLocation;
  }

  // Save location to localStorage
  saveLocationToStorage(location: LocationData): void {
    try {
      localStorage.setItem('userLocation', JSON.stringify(location));
    } catch (error) {
      console.error('Failed to save location to storage:', error);
    }
  }

  // Load location from localStorage
  loadLocationFromStorage(): LocationData | null {
    try {
      const stored = localStorage.getItem('userLocation');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load location from storage:', error);
    }
    return null;
  }

  // Get location with fallback strategy
  async getLocationWithFallback(): Promise<LocationData> {
    // Try cached location first
    const cached = this.getCachedLocation();
    if (cached) {
      return cached;
    }

    // Try stored location
    const stored = this.loadLocationFromStorage();
    if (stored) {
      this.currentLocation = stored;
      return stored;
    }

    try {
      // Try GPS location
      const gpsLocation = await this.getCurrentLocation();
      this.saveLocationToStorage(gpsLocation);
      return gpsLocation;
    } catch (gpsError) {
      console.warn('GPS location failed, trying IP location:', gpsError);
      
      try {
        // Fallback to IP location
        const ipLocation = await this.getLocationByIP();
        this.saveLocationToStorage(ipLocation);
        return ipLocation;
      } catch (ipError) {
        console.error('All location methods failed:', ipError);
        throw new Error('Unable to determine location');
      }
    }
  }

  // Find nearby cities/areas
  async findNearbyCities(radius: number = 50): Promise<string[]> {
    const location = await this.getLocationWithFallback();
    
    // This would typically call a places API
    // For now, return some common Indian cities as example
    const indianCities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
      'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
      'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad'
    ];

    // Filter based on location (simplified)
    return indianCities.slice(0, 10);
  }
}

// Export singleton instance
export const locationService = new LocationService();

// Export types
export type { LocationData, IPLocationData };

// Utility functions
export const getDistanceString = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km away`;
  } else {
    return `${Math.round(distance)}km away`;
  }
};

export const isLocationPermissionGranted = (): boolean => {
  return 'geolocation' in navigator;
};

export const requestLocationPermission = async (): Promise<boolean> => {
  if (!('permissions' in navigator)) {
    return false;
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state === 'granted';
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};
