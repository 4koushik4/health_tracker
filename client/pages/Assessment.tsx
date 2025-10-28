import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Heart, Stethoscope, Brain, ArrowLeft, ArrowRight,
  CheckCircle, AlertCircle, Calculator, TrendingUp,
  Activity, Scale, Clock, Zap, MapPin, Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { userDataService } from "@/lib/userDataService";
import { DiabetesForm, HypertensionForm, HeartDiseaseForm } from "@/components/AssessmentForms";
import { predict, type AssessmentType } from "@/lib/predictionService";

// Enhanced type definitions for ML model specific fields
interface HealthAssessmentData {
  // Common fields
  age: string;
  sex: string;
  bmi: number | null;

  // Heart Disease specific fields
  education: string;
  currentSmoker: string;
  cigsPerDay: string;
  BPMeds: string;
  prevalentStroke: string;
  prevalentHyp: string;
  diabetes: string;
  totChol: string;
  sysBP: string;
  diaBP: string;
  heartRate: string;
  glucose: string;

  // Hypertension specific fields
  saltIntake: string;
  stressScore: string;
  bpHistory: string;
  sleepDuration: string;
  familyHistory: string;
  smokingStatusSmoker: boolean;

  // Diabetes specific fields
  pregnancies: string;
  glucoseDiabetes: string;
  bloodPressure: string;
  skinThickness: string;
  insulin: string;
  diabetesPedigreeFunction: string;

  // Helper fields for BMI calculation
  height: string;
  weight: string;
}

interface PredictionResult {
  risk_percentage: number;
  risk_category: string;
  confidence_score: number;
  key_factors: string[];
  recommendations: string[];
}

export default function Assessment() {
  const [activeTab, setActiveTab] = useState("selection");
  const [selectedAssessment, setSelectedAssessment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const [assessmentData, setAssessmentData] = useState<HealthAssessmentData>({
    // Common fields
    age: "", sex: "", bmi: null, height: "", weight: "",

    // Heart Disease fields
    education: "", currentSmoker: "", cigsPerDay: "", BPMeds: "",
    prevalentStroke: "", prevalentHyp: "", diabetes: "", totChol: "",
    sysBP: "", diaBP: "", heartRate: "", glucose: "",

    // Hypertension fields
    saltIntake: "", stressScore: "", bpHistory: "", sleepDuration: "",
    familyHistory: "", smokingStatusSmoker: false,

    // Diabetes fields
    pregnancies: "", glucoseDiabetes: "", bloodPressure: "", skinThickness: "",
    insulin: "", diabetesPedigreeFunction: ""
  });

  // Auto-calculate BMI
  useEffect(() => {
    const height = parseFloat(assessmentData.height);
    const weight = parseFloat(assessmentData.weight);

    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      setAssessmentData(prev => ({ ...prev, bmi: parseFloat(bmi.toFixed(1)) }));
    }
  }, [assessmentData.height, assessmentData.weight]);

  const updateAssessmentData = (field: keyof HealthAssessmentData, value: string | boolean | number) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
  };

  const getCompletionPercentage = () => {
    let requiredFields: string[] = [];

    if (selectedAssessment === "diabetes") {
      requiredFields = ['age', 'pregnancies', 'glucoseDiabetes', 'bloodPressure', 'skinThickness', 'insulin', 'diabetesPedigreeFunction'];
    } else if (selectedAssessment === "hypertension") {
      requiredFields = ['age', 'saltIntake', 'stressScore', 'bpHistory', 'sleepDuration', 'familyHistory'];
    } else if (selectedAssessment === "stroke") {
      requiredFields = ['age', 'sex', 'education', 'currentSmoker', 'cigsPerDay', 'BPMeds', 'prevalentStroke', 'prevalentHyp', 'diabetes', 'totChol', 'sysBP', 'diaBP', 'heartRate', 'glucose'];
    }

    const completedFields = requiredFields.filter(field => {
      const value = assessmentData[field as keyof HealthAssessmentData];
      return value !== "" && value !== null && value !== undefined && value !== false;
    }).length;

    return requiredFields.length > 0 ? Math.round((completedFields / requiredFields.length) * 100) : 0;
  };

  const prepareDataForBackend = () => {
    if (selectedAssessment === "diabetes") {
      return {
        "Pregnancies": parseInt(assessmentData.pregnancies) || 0,
        "Glucose": parseInt(assessmentData.glucoseDiabetes) || 0,
        "BloodPressure": parseInt(assessmentData.bloodPressure) || 0,
        "SkinThickness": parseInt(assessmentData.skinThickness) || 0,
        "Insulin": parseInt(assessmentData.insulin) || 0,
        "BMI": assessmentData.bmi || 0,
        "DiabetesPedigreeFunction": parseFloat(assessmentData.diabetesPedigreeFunction) || 0,
        "Age": parseInt(assessmentData.age) || 0
      };
    } else if (selectedAssessment === "hypertension") {
      return {
        "Age": parseInt(assessmentData.age) || 0,
        "Salt_Intake": parseFloat(assessmentData.saltIntake) || 0,
        "Stress_Score": parseInt(assessmentData.stressScore) || 0,
        "BP_History": parseInt(assessmentData.bpHistory) || 0,
        "Sleep_Duration": parseFloat(assessmentData.sleepDuration) || 0,
        "BMI": assessmentData.bmi || 0,
        "Family_History": parseInt(assessmentData.familyHistory) || 0,
        "Smoking_Status_Smoker": assessmentData.smokingStatusSmoker
      };
    } else if (selectedAssessment === "stroke") {
      return {
        "male": assessmentData.sex === "1" ? 1 : 0,
        "age": parseInt(assessmentData.age) || 0,
        "education": parseFloat(assessmentData.education) || 0,
        "currentSmoker": parseInt(assessmentData.currentSmoker) || 0,
        "cigsPerDay": parseFloat(assessmentData.cigsPerDay) || 0,
        "BPMeds": parseFloat(assessmentData.BPMeds) || 0,
        "prevalentStroke": parseInt(assessmentData.prevalentStroke) || 0,
        "prevalentHyp": parseInt(assessmentData.prevalentHyp) || 0,
        "diabetes": parseInt(assessmentData.diabetes) || 0,
        "totChol": parseFloat(assessmentData.totChol) || 0,
        "sysBP": parseFloat(assessmentData.sysBP) || 0,
        "diaBP": parseFloat(assessmentData.diaBP) || 0,
        "BMI": assessmentData.bmi || 0,
        "heartRate": parseFloat(assessmentData.heartRate) || 0,
        "glucose": parseFloat(assessmentData.glucose) || 0
      };
    }

    return {};
  };



  const submitAssessment = async () => {
    setIsLoading(true);

    try {
      const data = prepareDataForBackend();

      if (!selectedAssessment) throw new Error("No assessment selected");

      let result: PredictionResult;

      try {
        const unified = await predict(selectedAssessment as AssessmentType, data);
        result = {
          risk_percentage: unified.risk_percentage,
          risk_category: unified.risk_category,
          confidence_score: unified.confidence_score,
          key_factors: unified.key_factors,
          recommendations: unified.recommendations,
        } as PredictionResult;
      } catch (fetchError: any) {
        console.error("Prediction service error:", fetchError);
        throw new Error(`Failed to get prediction from ML service: ${fetchError.message || fetchError}`);
      }

      const enrichedResult = {
        ...result,
        assessmentType: selectedAssessment,
        timestamp: new Date().toISOString()
      };

      // Store results in localStorage (for backward compatibility)
      localStorage.setItem("assessmentData", JSON.stringify(assessmentData));
      localStorage.setItem("predictionResult", JSON.stringify(enrichedResult));

      // Save to user data service
      userDataService.saveUserProfile({
        healthData: {
          age: assessmentData.age,
          sex: assessmentData.sex,
          height: assessmentData.height,
          weight: assessmentData.weight,
          waistCircumference: assessmentData.waistCircumference,
          bmi: assessmentData.bmi,
        },
        vitals: {
          systolicBP: assessmentData.systolicBP,
          diastolicBP: assessmentData.diastolicBP,
          heartRate: assessmentData.heartRate,
          fastingGlucose: assessmentData.fastingGlucose,
          totalCholesterol: assessmentData.totalCholesterol,
          hdlCholesterol: assessmentData.hdlCholesterol,
          ldlCholesterol: assessmentData.ldlCholesterol,
          triglycerides: assessmentData.triglycerides,
        },
        lifestyle: {
          smokingStatus: assessmentData.smokingStatus,
          alcoholUse: assessmentData.alcoholUse,
          physicalActivityLevel: assessmentData.physicalActivityLevel,
          sleepDuration: assessmentData.sleepDuration,
          sleepQuality: assessmentData.sleepQuality,
          dietQualityScore: assessmentData.dietQualityScore,
          stressLevel: assessmentData.stressLevel,
          screenTime: assessmentData.screenTime,
        },
        medicalHistory: {
          familyDiabetes: assessmentData.familyDiabetes,
          familyHeartDisease: assessmentData.familyHeartDisease,
          familyHypertension: assessmentData.familyHypertension,
          personalDiabetes: assessmentData.personalDiabetes,
          personalHeartDisease: assessmentData.personalHeartDisease,
          personalHypertension: assessmentData.personalHypertension,
          medications: assessmentData.medications,
        },
        socialFactors: {
          educationLevel: assessmentData.educationLevel,
          occupationType: assessmentData.occupationType,
          residenceType: assessmentData.residenceType,
          socialSupportScore: assessmentData.socialSupportScore,
          mentalHealthScore: assessmentData.mentalHealthScore,
        }
      });

      // Save assessment result
      userDataService.saveAssessmentResult(assessmentData, enrichedResult);

      navigate("/results");
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Error submitting assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startAssessment = (type: string) => {
    setSelectedAssessment(type);
    setActiveTab("comprehensive");
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Overweight", color: "text-orange-600" };
    return { category: "Obese", color: "text-red-600" };
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
            <Link to="/assessment" className="text-sm font-medium text-gray-900">Assessment</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</Link>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="selection">Choose Assessment</TabsTrigger>
              <TabsTrigger value="comprehensive" disabled={!selectedAssessment}>
                Comprehensive Assessment
              </TabsTrigger>
            </TabsList>

            {/* Assessment Selection */}
            <TabsContent value="selection" className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Health Risk Assessment</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our advanced machine learning models analyze your comprehensive health profile to predict chronic disease risks with clinical-grade accuracy.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Diabetes Assessment */}
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100/50 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Stethoscope className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Type 2 Diabetes Risk</CardTitle>
                    <CardDescription className="text-gray-600">
                      AI-powered diabetes risk prediction using lifestyle and metabolic factors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="font-bold text-purple-600">95.2%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="font-bold text-purple-600">5 min</div>
                        <div className="text-xs text-gray-600">Duration</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-purple-500 mr-2" />
                        Metabolic syndrome analysis
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-purple-500 mr-2" />
                        Family history assessment
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-purple-500 mr-2" />
                        Lifestyle risk factors
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-purple-500 hover:bg-purple-600 transition-all duration-200" 
                      onClick={() => startAssessment("diabetes")}
                    >
                      Start Diabetes Assessment
                    </Button>
                  </CardContent>
                </Card>

                {/* Hypertension Assessment */}
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-red-50 to-red-100/50 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Cardiovascular Disease Risk</CardTitle>
                    <CardDescription className="text-gray-600">
                      Advanced heart disease and hypertension risk evaluation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="font-bold text-red-600">94.8%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="font-bold text-red-600">4 min</div>
                        <div className="text-xs text-gray-600">Duration</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-red-500 mr-2" />
                        Blood pressure analysis
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-red-500 mr-2" />
                        Lipid profile assessment
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-red-500 mr-2" />
                        Cardiac risk factors
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600 transition-all duration-200" 
                      onClick={() => startAssessment("hypertension")}
                    >
                      Start Heart Assessment
                    </Button>
                  </CardContent>
                </Card>

                {/* Heart Disease Assessment */}
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100/50 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Heart Disease Risk Assessment</CardTitle>
                    <CardDescription className="text-gray-600">
                      Advanced cardiac risk evaluation with AI-powered insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="font-bold text-orange-600">94.2%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="font-bold text-orange-600">4 min</div>
                        <div className="text-xs text-gray-600">Duration</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-orange-500 mr-2" />
                        Cardiac risk factors
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-orange-500 mr-2" />
                        Cholesterol analysis
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-orange-500 mr-2" />
                        Cardiovascular health indicators
                      </div>
                    </div>

                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200"
                      onClick={() => startAssessment("stroke")}
                    >
                      Start Heart Disease Assessment
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-4">
                  <Zap className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">AI-Powered Clinical Intelligence</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Our machine learning models are trained on large clinical datasets and provide:
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                        Risk prediction with confidence scores
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                        Personalized prevention plans
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                        Explainable AI insights
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                        Hospital recommendations
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Comprehensive Assessment Form */}
            <TabsContent value="comprehensive" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2 text-2xl">
                        {selectedAssessment === "diabetes" && <Stethoscope className="w-6 h-6 text-purple-500" />}
                        {selectedAssessment === "hypertension" && <Heart className="w-6 h-6 text-red-500" />}
                        {selectedAssessment === "stroke" && <Brain className="w-6 h-6 text-orange-500" />}
                        <span>Comprehensive Health Assessment</span>
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Complete your detailed health profile for AI-powered risk prediction
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{getCompletionPercentage()}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>
                  <Progress value={getCompletionPercentage()} className="w-full h-3" />
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Assessment-specific forms */}
                  {selectedAssessment === "diabetes" && (
                    <DiabetesForm
                      assessmentType={selectedAssessment}
                      assessmentData={assessmentData}
                      updateAssessmentData={updateAssessmentData}
                      getBMICategory={getBMICategory}
                    />
                  )}

                  {selectedAssessment === "hypertension" && (
                    <HypertensionForm
                      assessmentType={selectedAssessment}
                      assessmentData={assessmentData}
                      updateAssessmentData={updateAssessmentData}
                      getBMICategory={getBMICategory}
                    />
                  )}

                  {selectedAssessment === "stroke" && (
                    <HeartDiseaseForm
                      assessmentType={selectedAssessment}
                      assessmentData={assessmentData}
                      updateAssessmentData={updateAssessmentData}
                      getBMICategory={getBMICategory}
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Scale className="w-5 h-5 mr-2 text-primary" />
                      Demographics & Body Measurements
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age (years)</Label>
                        <Input 
                          id="age" 
                          type="number" 
                          placeholder="e.g., 35"
                          value={assessmentData.age}
                          onChange={(e) => updateAssessmentData('age', e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Biological Sex</Label>
                        <RadioGroup 
                          value={assessmentData.sex} 
                          onValueChange={(value) => updateAssessmentData('sex', value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input 
                          id="height" 
                          type="number" 
                          placeholder="e.g., 170"
                          value={assessmentData.height}
                          onChange={(e) => updateAssessmentData('height', e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input 
                          id="weight" 
                          type="number" 
                          step="0.1"
                          placeholder="e.g., 70.5"
                          value={assessmentData.weight}
                          onChange={(e) => updateAssessmentData('weight', e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="waist">Waist Circumference (cm)</Label>
                        <Input 
                          id="waist" 
                          type="number" 
                          placeholder="e.g., 85"
                          value={assessmentData.waistCircumference}
                          onChange={(e) => updateAssessmentData('waistCircumference', e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      {/* Auto-calculated BMI */}
                      {assessmentData.bmi && (
                        <div className="space-y-2">
                          <Label>Calculated BMI</Label>
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                              {assessmentData.bmi}
                            </Badge>
                            <span className={`text-sm font-medium ${getBMICategory(assessmentData.bmi).color}`}>
                              {getBMICategory(assessmentData.bmi).category}
                            </span>
                            <Calculator className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      Vital Signs
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="systolic">Systolic Blood Pressure (mmHg)</Label>
                        <Input 
                          id="systolic" 
                          type="number" 
                          placeholder="e.g., 120"
                          value={assessmentData.systolicBP}
                          onChange={(e) => updateAssessmentData('systolicBP', e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="diastolic">Diastolic Blood Pressure (mmHg)</Label>
                        <Input 
                          id="diastolic" 
                          type="number" 
                          placeholder="e.g., 80"
                          value={assessmentData.diastolicBP}
                          onChange={(e) => updateAssessmentData('diastolicBP', e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="heartrate">Resting Heart Rate (bpm)</Label>
                        <Input 
                          id="heartrate" 
                          type="number" 
                          placeholder="e.g., 72"
                          value={assessmentData.heartRate}
                          onChange={(e) => updateAssessmentData('heartRate', e.target.value)}
                          className="text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Laboratory Values */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Stethoscope className="w-5 h-5 mr-2 text-primary" />
                      Laboratory Values <Badge variant="outline" className="ml-2">Optional</Badge>
                    </h3>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="glucose">Fasting Glucose (mg/dL)</Label>
                        <Input 
                          id="glucose" 
                          type="number" 
                          placeholder="e.g., 95"
                          value={assessmentData.fastingGlucose}
                          onChange={(e) => updateAssessmentData('fastingGlucose', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalchol">Total Cholesterol (mg/dL)</Label>
                        <Input 
                          id="totalchol" 
                          type="number" 
                          placeholder="e.g., 180"
                          value={assessmentData.totalCholesterol}
                          onChange={(e) => updateAssessmentData('totalCholesterol', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
                        <Input 
                          id="hdl" 
                          type="number" 
                          placeholder="e.g., 55"
                          value={assessmentData.hdlCholesterol}
                          onChange={(e) => updateAssessmentData('hdlCholesterol', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle Factors */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-primary" />
                      Lifestyle & Behavioral Factors
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Smoking Status</Label>
                          <Select value={assessmentData.smokingStatus} onValueChange={(value) => updateAssessmentData('smokingStatus', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select smoking status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never smoked</SelectItem>
                              <SelectItem value="former">Former smoker</SelectItem>
                              <SelectItem value="current">Current smoker</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Alcohol Consumption</Label>
                          <Select value={assessmentData.alcoholUse} onValueChange={(value) => updateAssessmentData('alcoholUse', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select alcohol use" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="light">Light (1-7 drinks/week)</SelectItem>
                              <SelectItem value="moderate">Moderate (8-14 drinks/week)</SelectItem>
                              <SelectItem value="heavy">Heavy (15+ drinks/week)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Physical Activity Level</Label>
                          <Select value={assessmentData.physicalActivityLevel} onValueChange={(value) => updateAssessmentData('physicalActivityLevel', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low (sedentary)</SelectItem>
                              <SelectItem value="moderate">Moderate (150 min/week)</SelectItem>
                              <SelectItem value="high">High (300+ min/week)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sleep">Sleep Duration (hours/night)</Label>
                          <Input 
                            id="sleep" 
                            type="number" 
                            step="0.5"
                            placeholder="e.g., 7.5"
                            value={assessmentData.sleepDuration}
                            onChange={(e) => updateAssessmentData('sleepDuration', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label>Diet Quality Score (1-10)</Label>
                          <div className="px-4">
                            <Slider
                              value={[parseInt(assessmentData.dietQualityScore) || 5]}
                              onValueChange={(value) => updateAssessmentData('dietQualityScore', value[0].toString())}
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Poor</span>
                              <span>{assessmentData.dietQualityScore || 5}</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Stress Level (1-10)</Label>
                          <div className="px-4">
                            <Slider
                              value={[parseInt(assessmentData.stressLevel) || 5]}
                              onValueChange={(value) => updateAssessmentData('stressLevel', value[0].toString())}
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Low</span>
                              <span>{assessmentData.stressLevel || 5}</span>
                              <span>High</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="screentime">Daily Screen Time (hours)</Label>
                          <Input 
                            id="screentime" 
                            type="number" 
                            step="0.5"
                            placeholder="e.g., 8"
                            value={assessmentData.screenTime}
                            onChange={(e) => updateAssessmentData('screenTime', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Sleep Quality</Label>
                          <Select value={assessmentData.sleepQuality} onValueChange={(value) => updateAssessmentData('sleepQuality', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Rate sleep quality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="poor">Poor</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="excellent">Excellent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Family & Medical History */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-primary" />
                      Medical & Family History
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Family History</h4>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assessmentData.familyDiabetes}
                              onChange={(e) => updateAssessmentData('familyDiabetes', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span>Family history of diabetes</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assessmentData.familyHeartDisease}
                              onChange={(e) => updateAssessmentData('familyHeartDisease', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span>Family history of heart disease</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assessmentData.familyHypertension}
                              onChange={(e) => updateAssessmentData('familyHypertension', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span>Family history of hypertension</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Personal Medical History</h4>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assessmentData.personalDiabetes}
                              onChange={(e) => updateAssessmentData('personalDiabetes', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span>Diagnosed with diabetes</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assessmentData.personalHeartDisease}
                              onChange={(e) => updateAssessmentData('personalHeartDisease', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span>Diagnosed with heart disease</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assessmentData.personalHypertension}
                              onChange={(e) => updateAssessmentData('personalHypertension', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span>Diagnosed with hypertension</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea 
                        id="medications" 
                        placeholder="List any medications you're currently taking..."
                        value={assessmentData.medications}
                        onChange={(e) => updateAssessmentData('medications', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      Additional Information
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Education Level</Label>
                        <Select value={assessmentData.educationLevel} onValueChange={(value) => updateAssessmentData('educationLevel', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high_school">High School</SelectItem>
                            <SelectItem value="college">College</SelectItem>
                            <SelectItem value="graduate">Graduate Degree</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Occupation Type</Label>
                        <Select value={assessmentData.occupationType} onValueChange={(value) => updateAssessmentData('occupationType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select occupation type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desk">Desk/Office Work</SelectItem>
                            <SelectItem value="physical">Physical Labor</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Residence Type</Label>
                        <Select value={assessmentData.residenceType} onValueChange={(value) => updateAssessmentData('residenceType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select residence type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urban">Urban</SelectItem>
                            <SelectItem value="rural">Rural</SelectItem>
                            <SelectItem value="suburban">Suburban</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-8 border-t">
                    <Button variant="outline" onClick={() => setActiveTab("selection")} className="px-8">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Selection
                    </Button>
                    
                    <Button 
                      onClick={submitAssessment}
                      disabled={getCompletionPercentage() < 80 || isLoading}
                      className="px-8 bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Get AI Risk Prediction
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {getCompletionPercentage() < 80 && (
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <div>
                          <h4 className="font-medium text-amber-900">Complete Assessment</h4>
                          <p className="text-sm text-amber-700">
                            Please complete at least 80% of the assessment for accurate AI predictions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
