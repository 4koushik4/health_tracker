import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, Activity, Apple, Moon, Brain, Calendar, Target,
  CheckCircle, Clock, TrendingUp, Shield, AlertCircle,
  Dumbbell, Utensils, Stethoscope, Pills, BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";

interface PreventionPlan {
  riskLevel: string;
  primaryFocus: string[];
  shortTermGoals: Goal[];
  longTermGoals: Goal[];
  weeklyPlan: WeeklyActivity[];
  dietPlan: DietRecommendation[];
  exercisePlan: ExerciseRecommendation[];
  monitoringSchedule: MonitoringItem[];
}

interface Goal {
  title: string;
  description: string;
  timeframe: string;
  priority: "high" | "medium" | "low";
  progress: number;
}

interface WeeklyActivity {
  day: string;
  activities: string[];
  focus: string;
}

interface DietRecommendation {
  category: string;
  recommendations: string[];
  avoid: string[];
}

interface ExerciseRecommendation {
  type: string;
  duration: string;
  frequency: string;
  intensity: string;
  examples: string[];
}

interface MonitoringItem {
  metric: string;
  frequency: string;
  target: string;
  method: string;
}

export default function PreventionPlan() {
  const [activeTab, setActiveTab] = useState("overview");
  const [predictionResult, setPredictionResult] = useState<any>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("predictionResult");
    if (storedResult) {
      setPredictionResult(JSON.parse(storedResult));
    }
  }, []);

  // Generate personalized prevention plan based on assessment results
  const generatePreventionPlan = (): PreventionPlan => {
    const riskLevel = predictionResult?.risk_percentage || 25;
    const assessmentType = predictionResult?.assessmentType || "general";

    return {
      riskLevel: riskLevel < 30 ? "Low" : riskLevel < 60 ? "Moderate" : "High",
      primaryFocus: assessmentType === "diabetes" 
        ? ["Blood Sugar Control", "Weight Management", "Physical Activity"]
        : assessmentType === "hypertension"
        ? ["Blood Pressure Management", "Cardiovascular Health", "Stress Reduction"]
        : ["Neurological Health", "Vascular Protection", "Lifestyle Modification"],
      shortTermGoals: [
        {
          title: "Establish Daily Exercise Routine",
          description: "Begin with 30 minutes of moderate activity daily",
          timeframe: "2 weeks",
          priority: "high",
          progress: 0
        },
        {
          title: "Implement Healthy Diet Changes",
          description: "Focus on whole foods and reduce processed food intake",
          timeframe: "1 month",
          priority: "high",
          progress: 0
        },
        {
          title: "Optimize Sleep Schedule",
          description: "Maintain 7-9 hours of quality sleep nightly",
          timeframe: "2 weeks",
          priority: "medium",
          progress: 0
        },
        {
          title: "Regular Health Monitoring",
          description: "Track key health metrics weekly",
          timeframe: "Ongoing",
          priority: "high",
          progress: 0
        }
      ],
      longTermGoals: [
        {
          title: "Achieve Target Weight/BMI",
          description: "Reach and maintain healthy BMI range (18.5-24.9)",
          timeframe: "6 months",
          priority: "high",
          progress: 0
        },
        {
          title: "Reduce Disease Risk Factors",
          description: "Lower overall risk score by 25% through lifestyle changes",
          timeframe: "1 year",
          priority: "high",
          progress: 0
        },
        {
          title: "Build Sustainable Health Habits",
          description: "Maintain healthy lifestyle for long-term wellness",
          timeframe: "Lifelong",
          priority: "medium",
          progress: 0
        }
      ],
      weeklyPlan: [
        { day: "Monday", activities: ["30min brisk walk", "Meal prep", "Blood pressure check"], focus: "Cardio & Planning" },
        { day: "Tuesday", activities: ["Strength training", "Healthy cooking", "Stress management"], focus: "Strength & Nutrition" },
        { day: "Wednesday", activities: ["Yoga/stretching", "Grocery shopping", "Sleep hygiene"], focus: "Recovery & Preparation" },
        { day: "Thursday", activities: ["Interval training", "Social activity", "Health tracking"], focus: "Intensity & Social" },
        { day: "Friday", activities: ["Long walk", "Meal planning", "Relaxation"], focus: "Endurance & Planning" },
        { day: "Saturday", activities: ["Outdoor activity", "Cooking healthy meals", "Weekly review"], focus: "Active Recovery" },
        { day: "Sunday", activities: ["Gentle exercise", "Meal prep", "Goal setting"], focus: "Preparation & Reflection" }
      ],
      dietPlan: [
        {
          category: "Macronutrients",
          recommendations: [
            "Complex carbohydrates (40-45%): quinoa, brown rice, oats",
            "Lean proteins (25-30%): fish, poultry, legumes, tofu",
            "Healthy fats (25-30%): avocado, nuts, olive oil, fatty fish"
          ],
          avoid: ["Refined sugars", "Processed foods", "Trans fats", "Excessive sodium"]
        },
        {
          category: "Meal Timing",
          recommendations: [
            "Eat regular meals at consistent times",
            "Include protein in every meal",
            "Practice portion control",
            "Stay hydrated (8-10 glasses water daily)"
          ],
          avoid: ["Skipping meals", "Late night eating", "Excessive snacking", "Sugary drinks"]
        }
      ],
      exercisePlan: [
        {
          type: "Aerobic Exercise",
          duration: "30-45 minutes",
          frequency: "5 days/week",
          intensity: "Moderate",
          examples: ["Brisk walking", "Swimming", "Cycling", "Dancing"]
        },
        {
          type: "Strength Training",
          duration: "20-30 minutes",
          frequency: "2-3 days/week",
          intensity: "Moderate to High",
          examples: ["Bodyweight exercises", "Resistance bands", "Weight lifting", "Functional movements"]
        },
        {
          type: "Flexibility & Balance",
          duration: "15-20 minutes",
          frequency: "3-4 days/week",
          intensity: "Low to Moderate",
          examples: ["Yoga", "Tai Chi", "Stretching", "Balance exercises"]
        }
      ],
      monitoringSchedule: [
        { metric: "Blood Pressure", frequency: "Weekly", target: "<120/80 mmHg", method: "Home monitor" },
        { metric: "Weight", frequency: "Weekly", target: "BMI 18.5-24.9", method: "Home scale" },
        { metric: "Blood Glucose", frequency: "Monthly", target: "<100 mg/dL fasting", method: "Home glucometer or lab" },
        { metric: "Physical Activity", frequency: "Daily", target: "150 min/week", method: "Activity tracker" },
        { metric: "Sleep Quality", frequency: "Daily", target: "7-9 hours", method: "Sleep diary/tracker" }
      ]
    };
  };

  const preventionPlan = generatePreventionPlan();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
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
            <Link to="/results" className="text-sm font-medium text-gray-600 hover:text-gray-900">Results</Link>
            <Link to="/prevention-plan" className="text-sm font-medium text-gray-900">Prevention Plan</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</Link>
          </div>
          <Button asChild>
            <Link to="/hospitals">Find Specialists</Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Personalized Prevention Plan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your AI-generated, evidence-based action plan for optimal health and disease prevention
            </p>
            <Badge variant="secondary" className="mt-2">
              {preventionPlan.riskLevel} Risk Level
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Plan</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="exercise">Exercise</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Primary Focus Areas */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span>Primary Focus Areas</span>
                  </CardTitle>
                  <CardDescription>
                    Key areas identified by AI for maximum health impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {preventionPlan.primaryFocus.map((focus, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg border border-primary/20">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            {focus.includes("Blood") && <Stethoscope className="w-6 h-6 text-primary" />}
                            {focus.includes("Weight") && <Target className="w-6 h-6 text-primary" />}
                            {focus.includes("Activity") && <Activity className="w-6 h-6 text-primary" />}
                            {focus.includes("Stress") && <Brain className="w-6 h-6 text-primary" />}
                            {focus.includes("Neurological") && <Brain className="w-6 h-6 text-primary" />}
                            {focus.includes("Vascular") && <Heart className="w-6 h-6 text-primary" />}
                            {focus.includes("Lifestyle") && <Activity className="w-6 h-6 text-primary" />}
                          </div>
                          <h3 className="font-semibold text-gray-900">{focus}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">25%</div>
                    <div className="text-sm text-green-600">Risk Reduction Goal</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-700">90</div>
                    <div className="text-sm text-blue-600">Days to First Goal</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6 text-center">
                    <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-700">150</div>
                    <div className="text-sm text-purple-600">Min Exercise/Week</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-700">5</div>
                    <div className="text-sm text-orange-600">Health Metrics Tracked</div>
                  </CardContent>
                </Card>
              </div>

              {/* Plan Summary */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>Your Personalized Plan Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Immediate Actions (Next 30 days)
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Start daily 30-minute walks
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Implement Mediterranean diet principles
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Establish sleep routine (7-9 hours)
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Begin weekly health monitoring
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                        Long-term Milestones
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Achieve target BMI within 6 months
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Reduce overall disease risk by 25%
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Establish sustainable lifestyle habits
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Regular health assessment follow-ups
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Short-term Goals */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-500" />
                      <span>Short-term Goals (1-3 months)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {preventionPlan.shortTermGoals.map((goal, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          <Badge className={`${getPriorityColor(goal.priority)} text-white text-xs`}>
                            {goal.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">Timeline: {goal.timeframe}</span>
                          <span className="text-xs text-gray-500">{goal.progress}% complete</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Long-term Goals */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <span>Long-term Goals (6+ months)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {preventionPlan.longTermGoals.map((goal, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          <Badge className={`${getPriorityColor(goal.priority)} text-white text-xs`}>
                            {goal.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">Timeline: {goal.timeframe}</span>
                          <span className="text-xs text-gray-500">{goal.progress}% complete</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Weekly Plan Tab */}
            <TabsContent value="weekly" className="space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>7-Day Action Plan</span>
                  </CardTitle>
                  <CardDescription>
                    Your structured weekly routine for optimal health outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {preventionPlan.weeklyPlan.map((day, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{day.day}</h4>
                          <Badge variant="outline" className="text-xs">
                            {day.focus}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-3 gap-2">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Nutrition Tab */}
            <TabsContent value="nutrition" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {preventionPlan.dietPlan.map((category, index) => (
                  <Card key={index} className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Apple className="w-5 h-5 text-primary" />
                        <span>{category.category}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Recommended
                        </h4>
                        <ul className="space-y-2">
                          {category.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} className="text-sm text-gray-600 pl-4 border-l-2 border-green-200">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Avoid or Limit
                        </h4>
                        <ul className="space-y-2">
                          {category.avoid.map((avoid, avoidIndex) => (
                            <li key={avoidIndex} className="text-sm text-gray-600 pl-4 border-l-2 border-red-200">
                              {avoid}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Exercise Tab */}
            <TabsContent value="exercise" className="space-y-6">
              <div className="grid gap-6">
                {preventionPlan.exercisePlan.map((exercise, index) => (
                  <Card key={index} className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Dumbbell className="w-5 h-5 text-primary" />
                        <span>{exercise.type}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">{exercise.duration}</div>
                          <div className="text-sm text-gray-600">Duration</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">{exercise.frequency}</div>
                          <div className="text-sm text-gray-600">Frequency</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">{exercise.intensity}</div>
                          <div className="text-sm text-gray-600">Intensity</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">{exercise.examples.length}</div>
                          <div className="text-sm text-gray-600">Options</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Exercise Examples:</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {exercise.examples.map((example, exIndex) => (
                            <div key={exIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                              <Activity className="w-3 h-3 text-primary" />
                              <span>{example}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Monitoring Tab */}
            <TabsContent value="monitoring" className="space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    <span>Health Monitoring Schedule</span>
                  </CardTitle>
                  <CardDescription>
                    Track your progress with regular health measurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {preventionPlan.monitoringSchedule.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.metric}</h4>
                            <p className="text-sm text-gray-600">Health Metric</p>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item.frequency}</div>
                            <p className="text-sm text-gray-600">Check Frequency</p>
                          </div>
                          <div>
                            <div className="font-medium text-green-700">{item.target}</div>
                            <p className="text-sm text-gray-600">Target Range</p>
                          </div>
                          <div>
                            <div className="font-medium text-blue-700">{item.method}</div>
                            <p className="text-sm text-gray-600">Measurement Method</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/dashboard">
                Track Progress in Dashboard
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline">
              <Link to="/hospitals">
                Find Healthcare Providers
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" onClick={() => {
              const start = new Date();
              start.setDate(start.getDate() + 7);
              start.setHours(9,0,0,0);
              const end = new Date(start.getTime() + 60*60*1000);
              import("@/utils/calendar").then(({ downloadICS }) => {
                downloadICS({
                  summary: "Health Monitoring Reminder",
                  description: "Follow your prevention plan activities.",
                  start,
                  end,
                  location: "Your preferred clinic or home",
                  filename: "prevention-plan-reminder",
                });
              });
            }}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Reminders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
