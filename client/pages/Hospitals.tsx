import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Heart, Phone, Clock, Star, Navigation,
  Search, Filter, Calendar, Users, Award, Shield,
  Stethoscope, Brain, Activity, Target, Loader2,
  AlertCircle, CheckCircle, ExternalLink, Map
} from "lucide-react";
import { Link } from "react-router-dom";
import { osmService, type OSMHospital } from "@/lib/osmService";
import { userDataService, type UserProfile } from "@/lib/userDataService";

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  displayName: string;
}

export default function Hospitals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [hospitals, setHospitals] = useState<OSMHospital[]>([]);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchRadius, setSearchRadius] = useState(10); // km
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    // Load stored data
    const storedResult = localStorage.getItem("predictionResult");
    if (storedResult) {
      setPredictionResult(JSON.parse(storedResult));
    }

    const profile = userDataService.getUserProfile();
    setUserProfile(profile);

    // Check API availability
    checkAPIStatus();

    // Auto-detect location
    handleGetCurrentLocation();
  }, []);

  const checkAPIStatus = async () => {
    const available = await osmService.checkAPIAvailability();
    setApiAvailable(available);
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await userDataService.getCurrentLocation();
      if (location) {
        const profile = userDataService.getUserProfile();
        if (profile?.location) {
          setLocationData({
            latitude: profile.location.latitude,
            longitude: profile.location.longitude,
            city: profile.location.city,
            state: profile.location.state,
            displayName: `${profile.location.city}, ${profile.location.state}`
          });
          
          // Load nearby hospitals
          await loadNearbyHospitals(profile.location.latitude, profile.location.longitude);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSearch = async (address: string) => {
    if (!address.trim()) return;
    
    setIsLoadingLocation(true);
    try {
      const result = await osmService.searchLocationByAddress(address);
      if (result) {
        setLocationData({
          latitude: result.latitude,
          longitude: result.longitude,
          city: address,
          state: '',
          displayName: result.displayName
        });
        
        await loadNearbyHospitals(result.latitude, result.longitude);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const loadNearbyHospitals = async (latitude: number, longitude: number, type?: string) => {
    setIsLoadingHospitals(true);
    try {
      const healthcareType = type || (selectedSpecialty !== "all" ? selectedSpecialty : undefined);
      const nearbyHospitals = await osmService.searchNearbyHealthcare(
        latitude,
        longitude,
        searchRadius,
        healthcareType
      );
      setHospitals(nearbyHospitals);
      if (osmService.wasFallbackUsed()) {
        setApiAvailable(false);
      }
    } catch (error) {
      console.error('Error loading hospitals:', error);
      setHospitals([]);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const getRecommendedSpecialty = () => {
    if (!predictionResult) return "General Medicine";
    
    switch (predictionResult.assessmentType) {
      case "diabetes":
        return "Endocrinology";
      case "hypertension":
        return "Cardiology";
      case "stroke":
        return "Neurology";
      default:
        return "General Medicine";
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case "cardiology":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "neurology":
        return <Brain className="w-4 h-4 text-purple-500" />;
      case "endocrinology":
        return <Stethoscope className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDirectionsUrl = (hospital: OSMHospital) => {
    return `https://www.openstreetmap.org/directions?from=${locationData?.latitude},${locationData?.longitude}&to=${hospital.latitude},${hospital.longitude}`;
  };

  const getOSMUrl = (hospital: OSMHospital) => {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(hospital.name)}#map=16/${hospital.latitude}/${hospital.longitude}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HealthPredict</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/assessment" className="text-sm font-medium text-gray-600 hover:text-gray-900">Assessment</Link>
            <Link to="/results" className="text-sm font-medium text-gray-600 hover:text-gray-900">Results</Link>
            <Link to="/prevention-plan" className="text-sm font-medium text-gray-600 hover:text-gray-900">Prevention Plan</Link>
            <Link to="/hospitals" className="text-sm font-medium text-gray-900">Find Specialists</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</Link>
          </div>
          <Button asChild variant="outline">
            <Link to="/results">Back to Results</Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Healthcare Specialists Near You
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover nearby hospitals, clinics, and specialists using real-time data from OpenStreetMap
            </p>
            {predictionResult && (
              <Badge variant="secondary" className="mt-2">
                Recommended: {getRecommendedSpecialty()} Specialists
              </Badge>
            )}
          </div>

          {/* API Status Alert */}
          {!apiAvailable && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-900">Limited Functionality</h4>
                  <p className="text-sm text-amber-700">
                    OpenStreetMap API is currently unavailable. Showing cached/demo data.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Location & Search */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Current Location</label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleGetCurrentLocation}
                      disabled={isLoadingLocation}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {isLoadingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4 mr-2" />
                      )}
                      Detect Location
                    </Button>
                  </div>
                  {locationData && (
                    <p className="text-xs text-gray-500">{locationData.displayName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search Location</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter city or address..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleLocationSearch((e.target as HTMLInputElement).value);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Enter city or address..."]') as HTMLInputElement;
                        if (input) handleLocationSearch(input.value);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Facility Type</label>
                  <select
                    value={selectedSpecialty}
                    onChange={async (e) => {
                      setSelectedSpecialty(e.target.value);
                      if (locationData) {
                        await loadNearbyHospitals(
                          locationData.latitude, 
                          locationData.longitude, 
                          e.target.value !== "all" ? e.target.value : undefined
                        );
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Facilities</option>
                    <option value="hospital">Hospitals</option>
                    <option value="clinic">Clinics</option>
                    <option value="doctors">Doctors</option>
                    <option value="pharmacy">Pharmacies</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search Radius</label>
                  <select
                    value={searchRadius}
                    onChange={async (e) => {
                      const radius = parseInt(e.target.value);
                      setSearchRadius(radius);
                      if (locationData) {
                        await loadNearbyHospitals(locationData.latitude, locationData.longitude);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                    <option value="50">50 km</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search hospitals, doctors, or specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Based on Assessment */}
          {predictionResult && (
            <Card className="border-0 shadow-xl mb-8 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Personalized Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Based on your {predictionResult.assessmentType} risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-gray-900 mb-2">Recommended Specialists</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Primary: {getRecommendedSpecialty()}</span>
                        <Badge className="bg-primary text-white">High Priority</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Secondary: General Medicine</span>
                        <Badge variant="outline">Recommended</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-gray-900 mb-2">Search Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Facilities Found</span>
                        <Badge variant="outline">{filteredHospitals.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Search Radius</span>
                        <Badge variant="outline">{searchRadius} km</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoadingHospitals && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Searching for nearby healthcare facilities...</p>
            </div>
          )}

          {/* Results */}
          {!isLoadingHospitals && locationData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Healthcare Facilities Near You
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{filteredHospitals.length} facilities found</span>
                </div>
              </div>

              {filteredHospitals.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Facilities Found</h3>
                    <p className="text-gray-600 mb-4">
                      No healthcare facilities found in the selected radius. Try increasing the search radius or searching a different location.
                    </p>
                    <Button onClick={() => setSearchRadius(25)}>
                      Expand Search to 25km
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredHospitals.map((hospital) => (
                    <Card key={hospital.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{hospital.name}</h3>
                                <div className="flex items-center space-x-4 mb-2">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {hospital.type}
                                  </Badge>
                                  {hospital.emergency && (
                                    <Badge className="bg-red-500 text-white text-xs">
                                      Emergency Care
                                    </Badge>
                                  )}
                                  {hospital.wheelchair && (
                                    <Badge className="bg-blue-500 text-white text-xs">
                                      Wheelchair Accessible
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center text-gray-600 mb-2">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  <span>{hospital.distance} km away</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-gray-600 text-sm">
                              {hospital.address}
                            </div>

                            {hospital.specialties.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                                <div className="flex flex-wrap gap-2">
                                  {hospital.specialties.slice(0, 4).map((spec, index) => (
                                    <div key={index} className="flex items-center space-x-1">
                                      {getSpecialtyIcon(spec)}
                                      <Badge variant="secondary" className="text-xs">
                                        {spec}
                                      </Badge>
                                    </div>
                                  ))}
                                  {hospital.specialties.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{hospital.specialties.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {hospital.amenities.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                                <div className="grid grid-cols-2 gap-1">
                                  {hospital.amenities.slice(0, 4).map((amenity, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                      <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                                      {amenity}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="text-gray-600">{hospital.address}</span>
                                </div>
                                {hospital.phone && (
                                  <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="text-gray-600">{hospital.phone}</span>
                                  </div>
                                )}
                                {hospital.openingHours && (
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="text-gray-600 text-xs">{hospital.openingHours}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={() => window.open(`tel:${hospital.phone}`, '_blank')}
                                disabled={!hospital.phone}
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Call Hospital
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => window.open(getDirectionsUrl(hospital), '_blank')}
                              >
                                <Navigation className="w-4 h-4 mr-2" />
                                Get Directions
                              </Button>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(getOSMUrl(hospital), '_blank')}
                                >
                                  <Map className="w-4 h-4 mr-1" />
                                  Map
                                </Button>
                                
                                {hospital.website && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(hospital.website, '_blank')}
                                  >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Website
                                  </Button>
                                )}
                              </div>
                            </div>

                            {hospital.capacity && (
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-lg font-bold text-blue-700">{hospital.capacity}</div>
                                <div className="text-xs text-blue-600">Hospital Beds</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Location Message */}
          {!isLoadingLocation && !locationData && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Required</h3>
                <p className="text-gray-600 mb-6">
                  Please allow location access or search for a specific location to find nearby healthcare facilities.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleGetCurrentLocation}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Detect My Location
                  </Button>
                  <Button variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Search by Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Information */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-900">
                <Shield className="w-5 h-5" />
                <span>Emergency Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-900">When to Seek Immediate Care</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Chest pain or pressure</li>
                    <li>• Severe shortness of breath</li>
                    <li>• Sudden weakness or numbness</li>
                    <li>• Severe headache or confusion</li>
                    <li>• Blood sugar extremely high/low</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-900">Emergency Contacts</h4>
                  <div className="text-sm text-red-800 space-y-1">
                    <p><strong>Emergency:</strong> 911</p>
                    <p><strong>Poison Control:</strong> 1-800-222-1222</p>
                    <p><strong>Mental Health Crisis:</strong> 988</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Source Attribution */}
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>Healthcare data provided by OpenStreetMap and Overpass API</p>
            <p>© OpenStreetMap contributors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
