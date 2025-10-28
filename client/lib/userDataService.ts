interface UserProfile {
  id: string;
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    emergencyContact?: string;
  };
  healthData: {
    age: string;
    sex: string;
    height: string;
    weight: string;
    waistCircumference: string;
    bmi: number | null;
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
  };
  vitals: {
    systolicBP: string;
    diastolicBP: string;
    heartRate: string;
    fastingGlucose: string;
    totalCholesterol: string;
    hdlCholesterol: string;
    ldlCholesterol: string;
    triglycerides: string;
  };
  lifestyle: {
    smokingStatus: string;
    alcoholUse: string;
    physicalActivityLevel: string;
    sleepDuration: string;
    sleepQuality: string;
    dietQualityScore: string;
    stressLevel: string;
    screenTime: string;
  };
  medicalHistory: {
    familyDiabetes: boolean;
    familyHeartDisease: boolean;
    familyHypertension: boolean;
    personalDiabetes: boolean;
    personalHeartDisease: boolean;
    personalHypertension: boolean;
    medications: string;
    surgeries?: string;
    hospitalizations?: string;
  };
  socialFactors: {
    educationLevel: string;
    occupationType: string;
    residenceType: string;
    socialSupportScore: string;
    mentalHealthScore: string;
  };
  assessmentHistory: {
    assessmentId: string;
    timestamp: string;
    type: string;
    riskScore: number;
    riskCategory: string;
    recommendations: string[];
  }[];
  preferences: {
    units: 'metric' | 'imperial';
    language: string;
    notifications: boolean;
    privacyLevel: 'public' | 'private' | 'healthcare_only';
  };
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

class UserDataService {
  private static instance: UserDataService;
  private storageKey = 'healthPredict_userProfile';
  private assessmentKey = 'healthPredict_assessments';

  private constructor() {}

  static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  // Get user profile
  getUserProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Save or update user profile
  saveUserProfile(profileData: Partial<UserProfile>): boolean {
    try {
      const existingProfile = this.getUserProfile();
      const now = new Date().toISOString();
      
      const updatedProfile: UserProfile = {
        id: existingProfile?.id || this.generateId(),
        personalInfo: { ...existingProfile?.personalInfo, ...profileData.personalInfo },
        healthData: { ...existingProfile?.healthData, ...profileData.healthData },
        vitals: { ...existingProfile?.vitals, ...profileData.vitals },
        lifestyle: { ...existingProfile?.lifestyle, ...profileData.lifestyle },
        medicalHistory: { ...existingProfile?.medicalHistory, ...profileData.medicalHistory },
        socialFactors: { ...existingProfile?.socialFactors, ...profileData.socialFactors },
        assessmentHistory: existingProfile?.assessmentHistory || [],
        preferences: { 
          units: 'metric',
          language: 'en',
          notifications: true,
          privacyLevel: 'private',
          ...existingProfile?.preferences, 
          ...profileData.preferences 
        },
        location: { ...existingProfile?.location, ...profileData.location },
        createdAt: existingProfile?.createdAt || now,
        updatedAt: now,
      };

      localStorage.setItem(this.storageKey, JSON.stringify(updatedProfile));
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  // Save assessment result
  saveAssessmentResult(assessmentData: any, predictionResult: any): boolean {
    try {
      const profile = this.getUserProfile();
      if (!profile) return false;

      const assessment = {
        assessmentId: this.generateId(),
        timestamp: new Date().toISOString(),
        type: predictionResult.assessmentType,
        riskScore: predictionResult.risk_percentage,
        riskCategory: predictionResult.risk_category,
        recommendations: predictionResult.recommendations || [],
      };

      profile.assessmentHistory.unshift(assessment);
      
      // Keep only last 10 assessments
      if (profile.assessmentHistory.length > 10) {
        profile.assessmentHistory = profile.assessmentHistory.slice(0, 10);
      }

      // Update health data from assessment
      this.updateHealthDataFromAssessment(profile, assessmentData);
      
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving assessment result:', error);
      return false;
    }
  }

  // Update health data from assessment
  private updateHealthDataFromAssessment(profile: UserProfile, assessmentData: any): void {
    if (assessmentData.age) profile.healthData.age = assessmentData.age;
    if (assessmentData.sex) profile.healthData.sex = assessmentData.sex;
    if (assessmentData.height) profile.healthData.height = assessmentData.height;
    if (assessmentData.weight) profile.healthData.weight = assessmentData.weight;
    if (assessmentData.bmi) profile.healthData.bmi = assessmentData.bmi;
    if (assessmentData.waistCircumference) profile.healthData.waistCircumference = assessmentData.waistCircumference;

    if (assessmentData.systolicBP) profile.vitals.systolicBP = assessmentData.systolicBP;
    if (assessmentData.diastolicBP) profile.vitals.diastolicBP = assessmentData.diastolicBP;
    if (assessmentData.heartRate) profile.vitals.heartRate = assessmentData.heartRate;
    if (assessmentData.fastingGlucose) profile.vitals.fastingGlucose = assessmentData.fastingGlucose;
    if (assessmentData.totalCholesterol) profile.vitals.totalCholesterol = assessmentData.totalCholesterol;

    if (assessmentData.smokingStatus) profile.lifestyle.smokingStatus = assessmentData.smokingStatus;
    if (assessmentData.alcoholUse) profile.lifestyle.alcoholUse = assessmentData.alcoholUse;
    if (assessmentData.physicalActivityLevel) profile.lifestyle.physicalActivityLevel = assessmentData.physicalActivityLevel;
    if (assessmentData.sleepDuration) profile.lifestyle.sleepDuration = assessmentData.sleepDuration;
    if (assessmentData.dietQualityScore) profile.lifestyle.dietQualityScore = assessmentData.dietQualityScore;
    if (assessmentData.stressLevel) profile.lifestyle.stressLevel = assessmentData.stressLevel;

    profile.medicalHistory.familyDiabetes = assessmentData.familyDiabetes || false;
    profile.medicalHistory.familyHeartDisease = assessmentData.familyHeartDisease || false;
    profile.medicalHistory.familyHypertension = assessmentData.familyHypertension || false;
    profile.medicalHistory.personalDiabetes = assessmentData.personalDiabetes || false;
    profile.medicalHistory.personalHeartDisease = assessmentData.personalHeartDisease || false;
    profile.medicalHistory.personalHypertension = assessmentData.personalHypertension || false;
    if (assessmentData.medications) profile.medicalHistory.medications = assessmentData.medications;

    if (assessmentData.educationLevel) profile.socialFactors.educationLevel = assessmentData.educationLevel;
    if (assessmentData.occupationType) profile.socialFactors.occupationType = assessmentData.occupationType;
    if (assessmentData.residenceType) profile.socialFactors.residenceType = assessmentData.residenceType;
  }

  // Get assessment history
  getAssessmentHistory(): UserProfile['assessmentHistory'] {
    const profile = this.getUserProfile();
    return profile?.assessmentHistory || [];
  }

  // Get latest assessment
  getLatestAssessment(): UserProfile['assessmentHistory'][0] | null {
    const history = this.getAssessmentHistory();
    return history.length > 0 ? history[0] : null;
  }

  // Update location
  async updateLocation(latitude: number, longitude: number): Promise<boolean> {
    try {
      // Reverse geocoding to get city, state, country
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      
      const location = {
        latitude,
        longitude,
        city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
        state: data.address?.state || data.address?.region || 'Unknown',
        country: data.address?.country || 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      return this.saveUserProfile({ location });
    } catch (error) {
      console.error('Error updating location:', error);
      return false;
    }
  }

  // Get current location with permission
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.updateLocation(latitude, longitude);
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all user data
  clearUserData(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.assessmentKey);
      localStorage.removeItem('assessmentData');
      localStorage.removeItem('predictionResult');
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }

  // Export user data
  exportUserData(): string | null {
    try {
      const profile = this.getUserProfile();
      if (!profile) return null;
      
      return JSON.stringify(profile, null, 2);
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }

  // Import user data
  importUserData(jsonData: string): boolean {
    try {
      const profileData = JSON.parse(jsonData);
      return this.saveUserProfile(profileData);
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }
}

export const userDataService = UserDataService.getInstance();
export type { UserProfile };
