import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import HumanBody from "@/components/ui/human-body";
import {
  Heart, Activity, TrendingUp, Calendar, User, Scale,
  ArrowLeft, Droplets, Brain, Gauge, Clock, Target,
  AlertTriangle, CheckCircle, Zap, BarChart3, MapPin,
  Stethoscope, Bell, Settings, Download, Share2, Plus,
  Award, Flame, Moon, Apple, Dumbbell, Eye, RefreshCw,
  Calculator
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { userDataService, type UserProfile } from "@/lib/userDataService";

interface DashboardData {
  predictionResult?: any;
  assessmentData?: any;
  lastAssessment?: string;
  riskTrend?: "improving" | "stable" | "concerning";
}

interface HealthGoal {
  id: string;
  title: string;
  target: string;
  current: string;
  progress: number;
  category: "fitness" | "nutrition" | "sleep" | "mental";
  dueDate: string;
}

export default function Dashboard() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("72");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "body" | "goals" | "trends">("overview");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setRefreshing(true);
    
    // Load user profile from service
    const profile = userDataService.getUserProfile();
    setUserProfile(profile);

    // Get latest assessment
    const latestAssessment = userDataService.getLatestAssessment();

    // Load stored assessment data (fallback)
    const storedResult = localStorage.getItem("predictionResult");
    const storedAssessment = localStorage.getItem("assessmentData");
    
    if (latestAssessment || (storedResult && storedAssessment)) {
      setDashboardData({
        predictionResult: latestAssessment ? {
          risk_percentage: latestAssessment.riskScore,
          risk_category: latestAssessment.riskCategory,
          assessmentType: latestAssessment.type,
          timestamp: latestAssessment.timestamp,
          confidence_score: 0.95
        } : JSON.parse(storedResult),
        assessmentData: profile?.healthData || (storedAssessment ? JSON.parse(storedAssessment) : null),
        lastAssessment: latestAssessment?.timestamp || (storedResult ? JSON.parse(storedResult).timestamp : undefined),
        riskTrend: "stable"
      });
    }

    // Pre-fill BMI calculator if user data exists
    if (profile?.healthData) {
      if (profile.healthData.height) setHeight(profile.healthData.height);
      if (profile.healthData.weight) setWeight(profile.healthData.weight);
      if (profile.healthData.bmi) setBmiResult(profile.healthData.bmi);
    }

    setTimeout(() => setRefreshing(false), 1000);
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h && w) {
      const bmi = w / (h * h);
      setBmiResult(parseFloat(bmi.toFixed(1)));
      
      // Update user profile
      userDataService.saveUserProfile({
        healthData: {
          ...userProfile?.healthData,
          height,
          weight,
          bmi: parseFloat(bmi.toFixed(1))
        }
      });
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600", bgColor: "bg-green-100" };
    if (bmi < 30) return { category: "Overweight", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { category: "Obese", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const getRiskColor = (percentage: number) => {
    if (percentage < 20) return "text-green-600";
    if (percentage < 50) return "text-yellow-600";
    if (percentage < 75) return "text-orange-600";
    return "text-red-600";
  };

  const getHealthMetrics = () => {
    const vitals = userProfile?.vitals || dashboardData.assessmentData;
    
    if (vitals) {
      return {
        bloodSugar: { 
          value: vitals.fastingGlucose || 85, 
          unit: "mg/dL", 
          status: (parseInt(vitals.fastingGlucose) || 85) < 100 ? "Normal" : "Elevated", 
          trend: "+2%",
          icon: Droplets,
          color: "red"
        },
        heartRate: { 
          value: vitals.heartRate || 68, 
          unit: "bpm", 
          status: "Normal", 
          trend: "-1%",
          icon: Heart,
          color: "pink"
        },
        bloodPressure: { 
          value: `${vitals.systolicBP || 120}/${vitals.diastolicBP || 80}`, 
          unit: "mmHg", 
          status: (parseInt(vitals.systolicBP) || 120) < 120 && (parseInt(vitals.diastolicBP) || 80) < 80 ? "Normal" : "Elevated", 
          trend: "stable",
          icon: Gauge,
          color: "blue"
        }
      };
    }
    
    return {
      bloodSugar: { value: 85, unit: "mg/dL", status: "Normal", trend: "+2%", icon: Droplets, color: "red" },
      heartRate: { value: 68, unit: "bpm", status: "Normal", trend: "-1%", icon: Heart, color: "pink" },
      bloodPressure: { value: "120/80", unit: "mmHg", status: "Normal", trend: "stable", icon: Gauge, color: "blue" }
    };
  };

  const healthMetrics = getHealthMetrics();

  // Mock health goals
  const healthGoals: HealthGoal[] = [
    {
      id: "1",
      title: "Weekly Exercise Goal",
      target: "150 minutes",
      current: "120 minutes",
      progress: 80,
      category: "fitness",
      dueDate: "2024-03-15"
    },
    {
      id: "2", 
      title: "Daily Water Intake",
      target: "8 glasses",
      current: "6 glasses",
      progress: 75,
      category: "nutrition",
      dueDate: "2024-03-08"
    },
    {
      id: "3",
      title: "Sleep Quality",
      target: "8 hours",
      current: "7.5 hours",
      progress: 94,
      category: "sleep",
      dueDate: "2024-03-08"
    }
  ];

  const getGoalIcon = (category: string) => {
    switch (category) {
      case "fitness": return Dumbbell;
      case "nutrition": return Apple;
      case "sleep": return Moon;
      case "mental": return Brain;
      default: return Target;
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Enhanced Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HealthPredict</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Home</Link>
            <Link to="/assessment" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Assessment</Link>
            <Link to="/results" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Results</Link>
            <Link to="/prevention-plan" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Prevention Plan</Link>
            <Link to="/hospitals" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Find Specialists</Link>
            <Link to="/dashboard" className="text-sm font-medium text-primary font-semibold">Dashboard</Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadDashboardData}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Settings", description: "This is a demo. Configure preferences soon." })}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Notifications", description: "You’re all caught up!" })}>
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {getWelcomeMessage()}{userProfile?.personalInfo?.name ? `, ${userProfile.personalInfo.name}` : ''}! 👋
                </h1>
                <p className="text-lg text-gray-600 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {dashboardData.lastAssessment 
                    ? `Last updated: ${new Date(dashboardData.lastAssessment).toLocaleDateString()}`
                    : "Welcome to your personalized health dashboard"
                  }
                </p>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" onClick={() => {
                  try {
                    const data = JSON.stringify(dashboardData, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = "dashboard-report.json"; document.body.appendChild(a); a.click(); a.remove();
                    URL.revokeObjectURL(url);
                    toast({ title: "Exported", description: "Saved dashboard-report.json" });
                  } catch {}
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm" onClick={async () => {
                  const url = window.location.origin + "/dashboard";
                  if (navigator.share) {
                    try { await navigator.share({ title: "HealthPredict Dashboard", url }); } catch {}
                  } else {
                    try { await navigator.clipboard.writeText(url); toast({ title: "Link copied" }); } catch {}
                  }
                }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button asChild>
                  <Link to="/assessment">
                    <Plus className="w-4 h-4 mr-2" />
                    New Assessment
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Health Score */}
            {userProfile && (
              <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Overall Health Score</h3>
                    <p className="text-gray-600">Based on your latest assessment and profile</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {dashboardData.predictionResult 
                        ? Math.round(100 - dashboardData.predictionResult.risk_percentage)
                        : 85}
                    </div>
                    <Badge className="bg-primary/20 text-primary">
                      {dashboardData.predictionResult?.risk_category === "Low" ? "Excellent" :
                       dashboardData.predictionResult?.risk_category === "Moderate" ? "Good" : "Needs Attention"}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={dashboardData.predictionResult 
                    ? 100 - dashboardData.predictionResult.risk_percentage
                    : 85} 
                  className="mt-4 h-3"
                />
              </div>
            )}
          </div>

          {/* Interactive Tab Navigation */}
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="body" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Body Map</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Health Metrics */}
                <div className="lg:col-span-2 space-y-6">
                  {/* AI Risk Assessment Results */}
                  {dashboardData.predictionResult && (
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-2xl transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-primary" />
                          <span>Latest AI Risk Assessment</span>
                        </CardTitle>
                        <CardDescription>
                          {dashboardData.predictionResult.assessmentType.charAt(0).toUpperCase() + 
                           dashboardData.predictionResult.assessmentType.slice(1)} risk prediction with AI insights
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className={`text-5xl font-bold ${getRiskColor(dashboardData.predictionResult.risk_percentage)}`}>
                              {dashboardData.predictionResult.risk_percentage}%
                            </div>
                            <div className="text-sm text-gray-600">Risk Level</div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-primary text-white text-lg px-4 py-2">
                              {dashboardData.predictionResult.risk_category} Risk
                            </Badge>
                            <div className="text-xs text-gray-500 mt-2">
                              Confidence: {(dashboardData.predictionResult.confidence_score * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <Progress value={dashboardData.predictionResult.risk_percentage} className="mb-4 h-3" />
                        <div className="flex space-x-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link to="/results">View Detailed Results</Link>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="flex-1">
                            <Link to="/prevention-plan">Prevention Plan</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Enhanced Vital Signs Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(healthMetrics).map(([key, metric]) => {
                      const IconComponent = metric.icon;
                      return (
                        <Card key={key} className={`border-0 shadow-lg bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100/50 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 bg-${metric.color}-500/10 rounded-xl flex items-center justify-center`}>
                                  <IconComponent className={`w-6 h-6 text-${metric.color}-500`} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                  <p className="text-xs text-gray-500">
                                    {key === 'bloodSugar' ? 'Fasting glucose' :
                                     key === 'heartRate' ? 'Resting rate' : 'Systolic/Diastolic'}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {metric.trend}
                              </Badge>
                            </div>
                            <div className="mb-3">
                              <div className="text-3xl font-bold text-gray-900 mb-1">
                                {metric.value}
                                <span className="text-lg font-normal text-gray-500 ml-1">
                                  {metric.unit}
                                </span>
                              </div>
                              <p className={`text-sm font-medium ${metric.status === "Normal" ? "text-green-600" : "text-red-600"}`}>
                                {metric.status}
                              </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className={`bg-${metric.color}-500 h-3 rounded-full transition-all duration-500`} 
                                   style={{ width: metric.status === "Normal" ? '75%' : '40%' }}>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Interactive Health Progress Chart */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <span>Health Progress Tracking</span>
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Last 6 months</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
                        <div className="text-center z-10">
                          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 text-lg font-medium">Health Trends Visualization</p>
                          <p className="text-sm text-gray-400">Interactive charts with your health data</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-600">Risk Score</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-600">Health Metrics</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-600">Activity Level</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions Grid */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button asChild className="h-16 justify-start text-left hover:shadow-md transition-shadow">
                          <Link to="/assessment">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-semibold">Take New Assessment</div>
                                <div className="text-xs text-gray-500">AI-powered health evaluation</div>
                              </div>
                            </div>
                          </Link>
                        </Button>
                        
                        <Button asChild variant="outline" className="h-16 justify-start text-left hover:shadow-md transition-shadow">
                          <Link to="/hospitals">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold">Find Specialists</div>
                                <div className="text-xs text-gray-500">Nearby healthcare providers</div>
                              </div>
                            </div>
                          </Link>
                        </Button>
                        
                        <Button asChild variant="outline" className="h-16 justify-start text-left hover:shadow-md transition-shadow">
                          <Link to="/prevention-plan">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="font-semibold">Prevention Plan</div>
                                <div className="text-xs text-gray-500">Personalized recommendations</div>
                              </div>
                            </div>
                          </Link>
                        </Button>
                        
                        <Button variant="outline" className="h-16 justify-start text-left hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-semibold">Schedule Appointment</div>
                              <div className="text-xs text-gray-500">Book with healthcare provider</div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - BMI Calculator & Personal Info */}
                <div className="space-y-6">
                  {/* Enhanced BMI Calculator */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Scale className="w-5 h-5 text-orange-500" />
                        <span>BMI Calculator</span>
                      </CardTitle>
                      <CardDescription>Track your body mass index</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <div className="relative">
                            <Input
                              id="height"
                              type="number"
                              placeholder="170"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                              cm
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <div className="relative">
                            <Input
                              id="weight"
                              type="number"
                              placeholder="72"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                              kg
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={calculateBMI} 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculate BMI
                      </Button>

                      {bmiResult && (
                        <div className={`text-center p-4 rounded-lg border-2 ${getBMICategory(bmiResult).bgColor} border-opacity-50`}>
                          <div className="text-4xl font-bold text-gray-900 mb-2">
                            {bmiResult}
                          </div>
                          <div className={`text-lg font-medium ${getBMICategory(bmiResult).color}`}>
                            {getBMICategory(bmiResult).category}
                          </div>
                          <Progress 
                            value={bmiResult > 30 ? 100 : (bmiResult / 30) * 100} 
                            className="mt-3 h-2"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-blue-600">Underweight:</span>
                          <span>&lt; 18.5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Normal:</span>
                          <span>18.5 - 24.9</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-600">Overweight:</span>
                          <span>25.0 - 29.9</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">Obese:</span>
                          <span>&gt; 30.0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Health Profile */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-primary" />
                        <span>Health Profile</span>
                      </CardTitle>
                      <CardDescription>Your comprehensive health summary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userProfile ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                            <span className="text-sm font-medium">Age</span>
                            <span className="font-bold text-lg">{userProfile.healthData?.age} years</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                            <span className="text-sm font-medium">Sex</span>
                            <Badge variant="outline" className="font-bold">
                              {userProfile.healthData?.sex === "1" ? "Male" : "Female"}
                            </Badge>
                          </div>
                          {userProfile.healthData?.bmi && (
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                              <span className="text-sm font-medium">BMI</span>
                              <span className="font-bold text-lg">{userProfile.healthData.bmi}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                            <span className="text-sm font-medium">Activity Level</span>
                            <Badge variant="outline" className="capitalize">
                              {userProfile.lifestyle?.physicalActivityLevel || "Moderate"}
                            </Badge>
                          </div>
                          
                          {userProfile.assessmentHistory.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2">Assessment History</h4>
                              <div className="text-sm text-blue-700">
                                <div className="flex justify-between">
                                  <span>Total Assessments:</span>
                                  <span className="font-bold">{userProfile.assessmentHistory.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Latest Risk Score:</span>
                                  <span className="font-bold">{userProfile.assessmentHistory[0]?.riskScore}%</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
                          <p className="text-gray-500 mb-4">Take an assessment to see your personalized health profile</p>
                          <Button asChild size="sm" className="w-full">
                            <Link to="/assessment">Start Assessment</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Daily Health Tips */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-emerald-500" />
                        <span>Today's Health Tips</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Stay Hydrated</p>
                            <p className="text-xs text-gray-600">Aim for 8 glasses of water today</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Move More</p>
                            <p className="text-xs text-gray-600">Take a 10-minute walk after meals</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Mindful Breathing</p>
                            <p className="text-xs text-gray-600">5 minutes of deep breathing</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Reminders */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>Health Reminders</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Next Assessment</p>
                          <p className="text-xs text-gray-500">
                            {dashboardData.predictionResult?.risk_percentage > 50 ? "3 months" : "6 months"}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Scheduled", description: "A reminder was added to your calendar (.ics)." })}>
                  Schedule
                </Button>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg bg-green-50">
                        <Stethoscope className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Annual Checkup</p>
                          <p className="text-xs text-gray-500">Physical examination</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Booking simulated", description: "This would open a provider booking flow." })}>
                  Book
                </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Interactive Body Map Tab */}
            <TabsContent value="body" className="space-y-6">
              <HumanBody 
                userProfile={userProfile} 
                healthMetrics={healthMetrics}
                className="animate-in slide-in-from-bottom-4 duration-500"
              />
            </TabsContent>

            {/* Health Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthGoals.map((goal) => {
                  const IconComponent = getGoalIcon(goal.category);
                  return (
                    <Card key={goal.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{goal.title}</CardTitle>
                            <Badge variant="outline" className="text-xs capitalize">
                              {goal.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{goal.current} / {goal.target}</span>
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Due: {goal.dueDate}</span>
                          <Badge className={goal.progress >= 90 ? "bg-green-500" : goal.progress >= 70 ? "bg-yellow-500" : "bg-red-500"}>
                            {goal.progress}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {/* Add New Goal Card */}
                <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-center h-full p-6">
                    <div className="text-center">
                      <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 font-medium">Add New Goal</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Health Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
              <div className="grid gap-6">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span>Health Trends Analysis</span>
                    </CardTitle>
                    <CardDescription>Track your health metrics over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analytics Coming Soon</h3>
                        <p className="text-gray-600">Advanced charting and trend analysis for your health data</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
