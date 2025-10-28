import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart, Brain, Lungs, Activity, Eye, Ear,
  Shield, AlertTriangle, CheckCircle, Info
} from "lucide-react";

interface BodyPart {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  status: "healthy" | "attention" | "risk";
  metrics?: {
    label: string;
    value: string;
    status: "normal" | "elevated" | "low";
  }[];
  description: string;
  recommendations?: string[];
}

interface HumanBodyProps {
  userProfile?: any;
  healthMetrics?: any;
  className?: string;
}

export default function HumanBody({ userProfile, healthMetrics, className = "" }: HumanBodyProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Define body parts with their health status based on user data
  const bodyParts: BodyPart[] = [
    {
      id: "brain",
      name: "Brain & Mental Health",
      position: { x: 50, y: 8 },
      size: { width: 15, height: 12 },
      status: userProfile?.lifestyle?.stressLevel > 7 ? "attention" : "healthy",
      metrics: [
        {
          label: "Stress Level",
          value: `${userProfile?.lifestyle?.stressLevel || 5}/10`,
          status: (userProfile?.lifestyle?.stressLevel || 5) > 7 ? "elevated" : "normal"
        },
        {
          label: "Sleep Quality",
          value: userProfile?.lifestyle?.sleepQuality || "Good",
          status: "normal"
        }
      ],
      description: "Cognitive function and mental wellbeing indicators",
      recommendations: [
        "Practice mindfulness meditation",
        "Maintain 7-9 hours of sleep",
        "Consider stress management techniques"
      ]
    },
    {
      id: "heart",
      name: "Cardiovascular System",
      position: { x: 45, y: 35 },
      size: { width: 10, height: 10 },
      status: healthMetrics?.bloodPressure?.status === "Normal" ? "healthy" : "attention",
      metrics: [
        {
          label: "Blood Pressure",
          value: healthMetrics?.bloodPressure?.value || "120/80",
          status: healthMetrics?.bloodPressure?.status === "Normal" ? "normal" : "elevated"
        },
        {
          label: "Heart Rate",
          value: `${healthMetrics?.heartRate?.value || 68} bpm`,
          status: "normal"
        }
      ],
      description: "Heart health and circulation status",
      recommendations: [
        "Regular cardio exercise",
        "Reduce sodium intake",
        "Monitor blood pressure weekly"
      ]
    },
    {
      id: "lungs",
      name: "Respiratory System",
      position: { x: 40, y: 30 },
      size: { width: 20, height: 15 },
      status: userProfile?.lifestyle?.smokingStatus === "current" ? "risk" : "healthy",
      metrics: [
        {
          label: "Smoking Status",
          value: userProfile?.lifestyle?.smokingStatus || "Never",
          status: userProfile?.lifestyle?.smokingStatus === "current" ? "elevated" : "normal"
        }
      ],
      description: "Lung function and respiratory health",
      recommendations: [
        "Avoid smoking and pollutants",
        "Regular breathing exercises",
        "Include cardio in exercise routine"
      ]
    },
    {
      id: "liver",
      name: "Metabolic System",
      position: { x: 55, y: 45 },
      size: { width: 12, height: 8 },
      status: healthMetrics?.bloodSugar?.status === "Normal" ? "healthy" : "attention",
      metrics: [
        {
          label: "Blood Sugar",
          value: `${healthMetrics?.bloodSugar?.value || 85} mg/dL`,
          status: healthMetrics?.bloodSugar?.status === "Normal" ? "normal" : "elevated"
        },
        {
          label: "BMI",
          value: userProfile?.healthData?.bmi?.toString() || "N/A",
          status: (userProfile?.healthData?.bmi || 25) < 25 ? "normal" : "elevated"
        }
      ],
      description: "Metabolism and blood sugar regulation",
      recommendations: [
        "Maintain healthy diet",
        "Regular meal timing",
        "Monitor blood glucose levels"
      ]
    },
    {
      id: "muscles",
      name: "Musculoskeletal",
      position: { x: 30, y: 55 },
      size: { width: 40, height: 35 },
      status: userProfile?.lifestyle?.physicalActivityLevel === "high" ? "healthy" : "attention",
      metrics: [
        {
          label: "Activity Level",
          value: userProfile?.lifestyle?.physicalActivityLevel || "Moderate",
          status: userProfile?.lifestyle?.physicalActivityLevel === "low" ? "low" : "normal"
        }
      ],
      description: "Muscle strength and bone health",
      recommendations: [
        "150 minutes exercise per week",
        "Include strength training",
        "Maintain good posture"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-600 bg-green-100";
      case "attention": return "text-yellow-600 bg-yellow-100";
      case "risk": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="w-4 h-4" />;
      case "attention": return <AlertTriangle className="w-4 h-4" />;
      case "risk": return <Shield className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-600";
      case "elevated": return "text-red-600";
      case "low": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const selectedBodyPart = bodyParts.find(part => part.id === selectedPart);

  return (
    <div className={`grid lg:grid-cols-2 gap-6 ${className}`}>
      {/* Interactive Human Body */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Interactive Health Map</span>
          </CardTitle>
          <CardDescription>
            Click on body parts to view detailed health information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative mx-auto" style={{ width: '280px', height: '400px' }}>
            {/* Human Body SVG */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full"
              style={{ maxWidth: '280px', maxHeight: '400px' }}
            >
              {/* Body outline */}
              <path
                d="M50 5 C45 5, 40 8, 40 15 L40 25 C38 25, 35 28, 35 32 L35 45 C35 48, 32 50, 30 55 L30 85 C30 88, 32 90, 35 90 L65 90 C68 90, 70 88, 70 85 L70 55 C68 50, 65 48, 65 45 L65 32 C65 28, 62 25, 60 25 L60 15 C60 8, 55 5, 50 5 Z"
                fill="#f0f4f8"
                stroke="#cbd5e0"
                strokeWidth="0.5"
                className="transition-all duration-200"
              />

              {/* Interactive body parts */}
              {bodyParts.map((part) => (
                <g key={part.id}>
                  {/* Body part area */}
                  <ellipse
                    cx={part.position.x}
                    cy={part.position.y}
                    rx={part.size.width / 2}
                    ry={part.size.height / 2}
                    fill={selectedPart === part.id ? "#3b82f6" : 
                          hoveredPart === part.id ? "#60a5fa" : 
                          part.status === "healthy" ? "#10b981" :
                          part.status === "attention" ? "#f59e0b" : "#ef4444"}
                    fillOpacity={hoveredPart === part.id || selectedPart === part.id ? 0.8 : 0.6}
                    stroke={selectedPart === part.id ? "#1d4ed8" : "#ffffff"}
                    strokeWidth={selectedPart === part.id ? "1" : "0.5"}
                    className="cursor-pointer transition-all duration-200 hover:stroke-2"
                    onClick={() => setSelectedPart(part.id)}
                    onMouseEnter={() => setHoveredPart(part.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                  
                  {/* Status indicator */}
                  <circle
                    cx={part.position.x + part.size.width / 3}
                    cy={part.position.y - part.size.height / 3}
                    r="2"
                    fill={part.status === "healthy" ? "#10b981" :
                          part.status === "attention" ? "#f59e0b" : "#ef4444"}
                    className="animate-pulse"
                  />

                  {/* Body part label on hover */}
                  {hoveredPart === part.id && (
                    <text
                      x={part.position.x}
                      y={part.position.y - part.size.height / 2 - 3}
                      textAnchor="middle"
                      className="fill-gray-800 text-xs font-medium"
                      style={{ fontSize: '3px' }}
                    >
                      {part.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Healthy</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Attention</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Risk</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {bodyParts.filter(p => p.status === "healthy").length}
              </div>
              <div className="text-xs text-green-700">Healthy</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">
                {bodyParts.filter(p => p.status === "attention").length}
              </div>
              <div className="text-xs text-yellow-700">Attention</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {bodyParts.filter(p => p.status === "risk").length}
              </div>
              <div className="text-xs text-red-700">Risk Areas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Panel */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {selectedBodyPart ? (
              <>
                {getStatusIcon(selectedBodyPart.status)}
                <span>{selectedBodyPart.name}</span>
              </>
            ) : (
              <>
                <Info className="w-5 h-5 text-primary" />
                <span>Health System Details</span>
              </>
            )}
          </CardTitle>
          {selectedBodyPart && (
            <Badge className={getStatusColor(selectedBodyPart.status)}>
              {selectedBodyPart.status.charAt(0).toUpperCase() + selectedBodyPart.status.slice(1)}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedBodyPart ? (
            <>
              {/* Description */}
              <div>
                <p className="text-gray-600">{selectedBodyPart.description}</p>
              </div>

              {/* Metrics */}
              {selectedBodyPart.metrics && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Current Metrics</h4>
                  <div className="space-y-3">
                    {selectedBodyPart.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className={`font-bold ${getMetricStatusColor(metric.status)}`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedBodyPart.recommendations && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {selectedBodyPart.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress indicator */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">System Health Score</span>
                  <span className="text-sm text-gray-600">
                    {selectedBodyPart.status === "healthy" ? "85%" : 
                     selectedBodyPart.status === "attention" ? "65%" : "40%"}
                  </span>
                </div>
                <Progress 
                  value={selectedBodyPart.status === "healthy" ? 85 : 
                         selectedBodyPart.status === "attention" ? 65 : 40} 
                  className="h-2"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Explore Your Health Map
              </h3>
              <p className="text-gray-600 mb-4">
                Click on any body part to view detailed health information and personalized recommendations.
              </p>
              <div className="grid grid-cols-1 gap-2 text-sm">
                {bodyParts.map((part) => (
                  <Button
                    key={part.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPart(part.id)}
                    className="justify-start"
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      part.status === "healthy" ? "bg-green-500" :
                      part.status === "attention" ? "bg-yellow-500" : "bg-red-500"
                    }`}></div>
                    {part.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
