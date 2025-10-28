interface OSMHospital {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'doctors';
  specialties: string[];
  latitude: number;
  longitude: number;
  distance?: number;
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  openingHours?: string;
  emergency?: boolean;
  capacity?: number;
  amenities: string[];
  wheelchair?: boolean;
}

interface OverpassResponse {
  elements: Array<{
    type: string;
    id: number;
    lat: number;
    lon: number;
    tags: {
      name?: string;
      amenity?: string;
      healthcare?: string;
      'healthcare:speciality'?: string;
      'addr:street'?: string;
      'addr:housenumber'?: string;
      'addr:city'?: string;
      'addr:postcode'?: string;
      phone?: string;
      website?: string;
      email?: string;
      'opening_hours'?: string;
      emergency?: string;
      'emergency:healthcare'?: string;
      wheelchair?: string;
      'bed:count'?: string;
      [key: string]: any;
    };
  }>;
}

class OSMService {
  private static instance: OSMService;
  private overpassEndpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.osm.ch/api/interpreter'
  ];
  private nominatimUrl = 'https://nominatim.openstreetmap.org';
  private lastUsedFallback = false;

  private constructor() {}

  static getInstance(): OSMService {
    if (!OSMService.instance) {
      OSMService.instance = new OSMService();
    }
    return OSMService.instance;
  }

  // Search for healthcare facilities near a location
  async searchNearbyHealthcare(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    healthcareType?: string
  ): Promise<OSMHospital[]> {
    this.lastUsedFallback = false;
    const query = this.buildOverpassQuery(latitude, longitude, radiusKm, healthcareType);

    // Try multiple endpoints with a short timeout and simple retry
    for (const endpoint of this.overpassEndpoints) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'User-Agent': 'HealthPredict Demo (contact: demo@example.com)'
          },
          body: query,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          // On rate limit or server overload, try next endpoint
          if ([429, 502, 503, 504].includes(response.status)) {
            continue;
          }
          throw new Error(`Overpass API error: ${response.status}`);
        }

        const data: OverpassResponse = await response.json();
        const hospitals = await this.processOverpassResponse(data, latitude, longitude);
        return hospitals.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      } catch (err) {
        // AbortError or network error: try next endpoint
        continue;
      }
    }

    // Fallback demo data when all endpoints fail
    console.warn('Overpass API unavailable, using demo data.');
    this.lastUsedFallback = true;
    const fallback = this.generateDemoHospitals(latitude, longitude, radiusKm);
    return fallback.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  // Build Overpass API query
  private buildOverpassQuery(
    latitude: number,
    longitude: number,
    radiusKm: number,
    healthcareType?: string
  ): string {
    const radiusMeters = radiusKm * 1000;
    
    // Base query for healthcare facilities
    let healthcareQuery = '';
    
    if (healthcareType) {
      switch (healthcareType.toLowerCase()) {
        case 'hospital':
          healthcareQuery = `
            (
              node["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});
              way["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});
              node["healthcare"="hospital"](around:${radiusMeters},${latitude},${longitude});
              way["healthcare"="hospital"](around:${radiusMeters},${latitude},${longitude});
            );
          `;
          break;
        case 'clinic':
          healthcareQuery = `
            (
              node["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude});
              way["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude});
              node["healthcare"="clinic"](around:${radiusMeters},${latitude},${longitude});
              way["healthcare"="clinic"](around:${radiusMeters},${latitude},${longitude});
            );
          `;
          break;
        case 'pharmacy':
          healthcareQuery = `
            (
              node["amenity"="pharmacy"](around:${radiusMeters},${latitude},${longitude});
              way["amenity"="pharmacy"](around:${radiusMeters},${latitude},${longitude});
            );
          `;
          break;
        case 'doctor':
        case 'doctors':
          healthcareQuery = `
            (
              node["amenity"="doctors"](around:${radiusMeters},${latitude},${longitude});
              way["amenity"="doctors"](around:${radiusMeters},${latitude},${longitude});
              node["healthcare"="doctor"](around:${radiusMeters},${latitude},${longitude});
              way["healthcare"="doctor"](around:${radiusMeters},${latitude},${longitude});
            );
          `;
          break;
        default:
          healthcareQuery = `
            (
              node["amenity"~"^(hospital|clinic|pharmacy|doctors)$"](around:${radiusMeters},${latitude},${longitude});
              way["amenity"~"^(hospital|clinic|pharmacy|doctors)$"](around:${radiusMeters},${latitude},${longitude});
              node["healthcare"~"^(hospital|clinic|doctor|pharmacy)$"](around:${radiusMeters},${latitude},${longitude});
              way["healthcare"~"^(hospital|clinic|doctor|pharmacy)$"](around:${radiusMeters},${latitude},${longitude});
            );
          `;
      }
    } else {
      // Search for all healthcare facilities
      healthcareQuery = `
        (
          node["amenity"~"^(hospital|clinic|pharmacy|doctors)$"](around:${radiusMeters},${latitude},${longitude});
          way["amenity"~"^(hospital|clinic|pharmacy|doctors)$"](around:${radiusMeters},${latitude},${longitude});
          node["healthcare"~"^(hospital|clinic|doctor|pharmacy)$"](around:${radiusMeters},${latitude},${longitude});
          way["healthcare"~"^(hospital|clinic|doctor|pharmacy)$"](around:${radiusMeters},${latitude},${longitude});
        );
      `;
    }

    return `
      [out:json][timeout:25];
      ${healthcareQuery}
      out center meta;
    `;
  }

  wasFallbackUsed(): boolean {
    return this.lastUsedFallback;
  }

  // Process Overpass API response
  private async processOverpassResponse(
    data: OverpassResponse,
    userLat: number,
    userLon: number
  ): Promise<OSMHospital[]> {
    const hospitals: OSMHospital[] = [];

    for (const element of data.elements) {
      const { tags } = element;
      
      // Skip if no name
      if (!tags.name) continue;

      const lat = element.type === 'way' ? element.lat || 0 : element.lat;
      const lon = element.type === 'way' ? element.lon || 0 : element.lon;

      // Calculate distance
      const distance = this.calculateDistance(userLat, userLon, lat, lon);

      // Determine facility type
      const type = this.getFacilityType(tags);
      
      // Get specialties
      const specialties = this.extractSpecialties(tags);

      // Build address
      const address = this.buildAddress(tags);

      // Extract amenities
      const amenities = this.extractAmenities(tags);

      const hospital: OSMHospital = {
        id: `osm_${element.type}_${element.id}`,
        name: tags.name,
        type,
        specialties,
        latitude: lat,
        longitude: lon,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        address,
        phone: tags.phone,
        website: tags.website,
        email: tags.email,
        openingHours: tags['opening_hours'],
        emergency: tags.emergency === 'yes' || tags['emergency:healthcare'] === 'yes',
        capacity: tags['bed:count'] ? parseInt(tags['bed:count']) : undefined,
        amenities,
        wheelchair: tags.wheelchair === 'yes',
      };

      hospitals.push(hospital);
    }

    return hospitals;
  }

  // Calculate distance between two points using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Determine facility type from tags
  private getFacilityType(tags: any): OSMHospital['type'] {
    if (tags.amenity === 'hospital' || tags.healthcare === 'hospital') return 'hospital';
    if (tags.amenity === 'clinic' || tags.healthcare === 'clinic') return 'clinic';
    if (tags.amenity === 'pharmacy') return 'pharmacy';
    if (tags.amenity === 'doctors' || tags.healthcare === 'doctor') return 'doctors';
    return 'clinic'; // Default
  }

  // Extract specialties from tags
  private extractSpecialties(tags: any): string[] {
    const specialties: string[] = [];
    
    if (tags['healthcare:speciality']) {
      const specs = tags['healthcare:speciality'].split(';');
      specialties.push(...specs.map((s: string) => s.trim()));
    }

    // Map common specialties
    const specialtyMap: { [key: string]: string } = {
      'cardiology': 'Cardiology',
      'neurology': 'Neurology',
      'endocrinology': 'Endocrinology',
      'internal_medicine': 'Internal Medicine',
      'family_medicine': 'Family Medicine',
      'emergency': 'Emergency Medicine',
      'surgery': 'Surgery',
      'orthopedics': 'Orthopedics',
      'pediatrics': 'Pediatrics',
      'psychiatry': 'Psychiatry',
      'dermatology': 'Dermatology',
      'ophthalmology': 'Ophthalmology',
      'dentistry': 'Dentistry',
    };

    Object.keys(specialtyMap).forEach(key => {
      if (tags[key] === 'yes' || tags[`healthcare:speciality:${key}`] === 'yes') {
        specialties.push(specialtyMap[key]);
      }
    });

    // If hospital and no specific specialties, add general ones
    if (specialties.length === 0 && (tags.amenity === 'hospital' || tags.healthcare === 'hospital')) {
      specialties.push('General Medicine', 'Emergency Care');
    }

    return [...new Set(specialties)]; // Remove duplicates
  }

  // Build address from tags
  private buildAddress(tags: any): string {
    const addressParts = [];
    
    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
    if (tags['addr:street']) addressParts.push(tags['addr:street']);
    if (tags['addr:city']) addressParts.push(tags['addr:city']);
    if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);

    return addressParts.join(', ') || 'Address not available';
  }

  // Extract amenities from tags
  private extractAmenities(tags: any): string[] {
    const amenities: string[] = [];

    const amenityChecks = {
      'parking': 'Parking Available',
      'wheelchair': 'Wheelchair Accessible',
      'wifi': 'WiFi Available',
      'cafe': 'Cafeteria',
      'atm': 'ATM',
      'pharmacy': 'Pharmacy',
      'laboratory': 'Laboratory',
      'imaging': 'Medical Imaging',
      'emergency': '24/7 Emergency',
    };

    Object.keys(amenityChecks).forEach(key => {
      if (tags[key] === 'yes') {
        amenities.push(amenityChecks[key]);
      }
    });

    return amenities;
  }

  // Generate demo hospitals when API is unavailable
  private generateDemoHospitals(lat: number, lon: number, radiusKm: number): OSMHospital[] {
    const mk = (
      id: string,
      name: string,
      type: OSMHospital['type'],
      dKm: number,
      address: string,
      extras: Partial<OSMHospital> = {}
    ): OSMHospital => ({
      id,
      name,
      type,
      specialties: type === 'hospital' ? ['General Medicine', 'Emergency Care'] : ['Family Medicine'],
      latitude: lat + (Math.random() - 0.5) * 0.05,
      longitude: lon + (Math.random() - 0.5) * 0.05,
      distance: Math.round(dKm * 100) / 100,
      address,
      phone: extras.phone,
      website: extras.website,
      email: extras.email,
      openingHours: extras.openingHours || 'Mo-Fr 08:00-18:00',
      emergency: type === 'hospital',
      capacity: type === 'hospital' ? 120 : undefined,
      amenities: ['Parking Available', 'Wheelchair Accessible'],
      wheelchair: true,
    });

    const base = Math.min(Math.max(radiusKm, 5), 50);
    return [
      mk('demo_1', 'City General Hospital', 'hospital', base * 0.3, '123 Main St, Downtown', { phone: '+1 555-0101', website: 'https://example-hospital.test' }),
      mk('demo_2', 'Downtown Clinic', 'clinic', base * 0.45, '45 Elm Ave, Central'),
      mk('demo_3', 'Community Pharmacy', 'pharmacy', base * 0.2, '78 Oak Rd, Midtown'),
      mk('demo_4', 'Family Doctors Center', 'doctors', base * 0.6, '22 Pine St, Westside')
    ];
  }

  // Search by address or city
  async searchLocationByAddress(address: string): Promise<{ latitude: number; longitude: number; displayName: string } | null> {
    try {
      const response = await fetch(
        `${this.nominatimUrl}/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          displayName: result.display_name,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error searching location:', error);
      return null;
    }
  }

  // Get detailed hospital information (if available from OSM)
  async getHospitalDetails(hospitalId: string): Promise<any> {
    try {
      const osmId = hospitalId.replace('osm_', '').replace('node_', '').replace('way_', '');
      const query = `
        [out:json][timeout:25];
        (
          node(${osmId});
          way(${osmId});
        );
        out center meta;
      `;

      const response = await fetch(this.overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: query,
      });

      const data = await response.json();
      return data.elements[0] || null;
    } catch (error) {
      console.error('Error fetching hospital details:', error);
      return null;
    }
  }

  // Check API availability (tries the first available endpoint)
  async checkAPIAvailability(): Promise<boolean> {
    for (const endpoint of this.overpassEndpoints) {
      try {
        const response = await fetch(`${endpoint}?data=[out:json];out;`, {
          method: 'GET',
          headers: { 'User-Agent': 'HealthPredict Demo (contact: demo@example.com)' }
        });
        if (response.ok) return true;
      } catch (error) {
        continue;
      }
    }
    return false;
  }
}

export const osmService = OSMService.getInstance();
export type { OSMHospital };
