import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, Brain, TrendingUp, AlertTriangle, CheckCircle, 
  Target, Shield, BarChart3, Activity, MapPin, 
  ArrowRight, Download, Share2, Calendar
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface PredictionResult {
  risk_percentage: number;
  risk_category: string;
  confidence_score: number;
  key_factors: string[];
  recommendations: string[];
  assessmentType: string;
  timestamp: string;
}

interface AssessmentData {
  age: string;
  sex: string;
  bmi: number | null;
  [key: string]: any;
}

export default function Results() {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = localStorage.getItem("predictionResult");
    const storedData = localStorage.getItem("assessmentData");
    
    if (storedResult && storedData) {
      setPredictionResult(JSON.parse(storedResult));
      setAssessmentData(JSON.parse(storedData));
    } else {
      navigate("/assessment");
    }
  }, [navigate]);

  if (!predictionResult || !assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (percentage: number) => {
    if (percentage < 20) return "text-green-600";
    if (percentage < 50) return "text-yellow-600";
    if (percentage < 75) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskColorBg = (percentage: number) => {
    if (percentage < 20) return "from-green-50 to-green-100";
    if (percentage < 50) return "from-yellow-50 to-yellow-100";
    if (percentage < 75) return "from-orange-50 to-orange-100";
    return "from-red-50 to-red-100";
  };

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case "diabetes": return <Target className="w-8 h-8 text-purple-500" />;
      case "hypertension": return <Heart className="w-8 h-8 text-red-500" />;
      case "stroke": return <Brain className="w-8 h-8 text-orange-500" />;
      default: return <Activity className="w-8 h-8 text-primary" />;
    }
  };

  const getAssessmentColor = (type: string) => {
    switch (type) {
      case "diabetes": return "purple";
      case "hypertension": return "red";
      case "stroke": return "orange";
      default: return "primary";
    }
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
            <Link to="/results" className="text-sm font-medium text-gray-900">Results</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</Link>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => {
              try {
                const result = localStorage.getItem("predictionResult");
                if (!result) return toast({ title: "No results to export" });
                const blob = new Blob([result], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "ai-results.json";
                document.body.appendChild(a); a.click(); a.remove();
                URL.revokeObjectURL(url);
                toast({ title: "Exported", description: "Saved ai-results.json" });
              } catch (e) {
                toast({ title: "Export failed", description: "Please try again." });
              }
            }}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={async () => {
              const url = window.location.origin + "/results";
              if (navigator.share) {
                try { await navigator.share({ title: "My AI Results", url }); }
                catch {}
              } else {
                try { await navigator.clipboard.writeText(url); toast({ title: "Link copied" }); } catch {}
              }
            }}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Risk Assessment Results
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Comprehensive analysis completed on {new Date(predictionResult.timestamp).toLocaleDateString()}
            </p>
            <Badge variant="secondary" className="text-sm">
              Assessment ID: {predictionResult.timestamp.slice(-8)}
            </Badge>
          </div>

          {/* Main Risk Score */}
          <Card className={`border-0 shadow-2xl bg-gradient-to-br ${getRiskColorBg(predictionResult.risk_percentage)}`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {getAssessmentIcon(predictionResult.assessmentType)}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      {predictionResult.assessmentType} Risk Assessment
                    </h2>
                    <p className="text-gray-600">AI-powered prediction with {(predictionResult.confidence_score * 100).toFixed(1)}% confidence</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-6xl font-bold ${getRiskColor(predictionResult.risk_percentage)}`}>
                    {predictionResult.risk_percentage}%
                  </div>
                  <Badge 
                    className={`mt-2 text-lg px-4 py-1 bg-${getAssessmentColor(predictionResult.assessmentType)}-500 text-white`}
                  >
                    {predictionResult.risk_category} Risk
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Risk Level</span>
                    <span className="text-sm text-gray-600">{predictionResult.risk_percentage}%</span>
                  </div>
                  <Progress value={predictionResult.risk_percentage} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Prediction Confidence</span>
                    <span className="text-sm text-gray-600">{(predictionResult.confidence_score * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={predictionResult.confidence_score * 100} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Key Risk Factors (Explainability) */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>Key Risk Factors</span>
                </CardTitle>
                <CardDescription>
                  AI-identified factors contributing to your risk score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictionResult.key_factors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full bg-${getAssessmentColor(predictionResult.assessmentType)}-500`}></div>
                    <span className="text-sm font-medium text-gray-800">{factor}</span>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">AI Explainability</h4>
                      <p className="text-sm text-blue-700">
                        These factors were identified by our machine learning model as the most significant 
                        contributors to your risk assessment. Focus on modifiable factors for the best impact.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Profile Summary */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Health Profile Summary</span>
                </CardTitle>
                <CardDescription>
                  Your key health metrics at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{assessmentData.age}</div>
                    <div className="text-sm text-gray-600">Age (years)</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {assessmentData.sex === "1" ? "Male" : "Female"}
                    </div>
                    <div className="text-sm text-gray-600">Sex</div>
                  </div>
                  {assessmentData.bmi && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{assessmentData.bmi}</div>
                      <div className="text-sm text-gray-600">BMI</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {assessmentData.systolicBP || "N/A"}/{assessmentData.diastolicBP || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Blood Pressure</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Risk Category Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Genetic Factors</span>
                      <Badge variant="outline" className="text-xs">
                        {assessmentData.familyDiabetes || assessmentData.familyHeartDisease ? "Present" : "None"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lifestyle Factors</span>
                      <Badge variant="outline" className="text-xs">
                        {assessmentData.smokingStatus === "current" ? "High Risk" : "Low Risk"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Metabolic Health</span>
                      <Badge variant="outline" className="text-xs">
                        {assessmentData.bmi && assessmentData.bmi > 30 ? "Attention Needed" : "Good"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Immediate Recommendations */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Personalized Recommendations</span>
              </CardTitle>
              <CardDescription>
                AI-generated action plan based on your risk profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Immediate Actions
                  </h4>
                  <div className="space-y-3">
                    {predictionResult.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span className="text-sm text-green-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                    Long-term Goals
                  </h4>
                  <div className="space-y-3">
                    {predictionResult.recommendations.slice(3).map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                        <span className="text-sm text-blue-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Timeline & Monitoring */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Risk Monitoring Schedule</span>
              </CardTitle>
              <CardDescription>
                Recommended follow-up timeline based on your risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-900">Next Assessment</div>
                  <div className="text-sm text-green-700 mt-1">
                    {predictionResult.risk_percentage > 50 ? "3 months" : "6 months"}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-900">Health Checkup</div>
                  <div className="text-sm text-blue-700 mt-1">
                    {predictionResult.risk_percentage > 75 ? "1 month" : "Annual"}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-purple-900">Lifestyle Review</div>
                  <div className="text-sm text-purple-700 mt-1">Monthly</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/prevention-plan">
                View Detailed Prevention Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline">
              <Link to="/hospitals">
                <MapPin className="w-4 h-4 mr-2" />
                Find Nearby Specialists
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Important Medical Disclaimer</h4>
                <p className="text-sm text-amber-800">
                  This AI assessment is for educational and screening purposes only. It does not constitute 
                  medical diagnosis, treatment, or professional medical advice. Please consult with qualified 
                  healthcare professionals for proper medical evaluation, diagnosis, and treatment decisions. 
                  Do not delay seeking medical care based on these results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
