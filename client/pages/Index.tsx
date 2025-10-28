import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, CheckCircle, ArrowRight, Stethoscope, BarChart3, Star, Target, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Banner from "@/components/landing/Banner";
import Hero3D from "@/components/landing/Hero3D";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Banner */}
      <Banner />

      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HealthPredict</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-900">Home</Link>
            <Link to="/assessment" className="text-sm font-medium text-gray-600 hover:text-gray-900">Assessment</Link>
            <Link to="/preventive-care" className="text-sm font-medium text-gray-600 hover:text-gray-900">Preventive Care</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</Link>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/assessment">Start Assessment</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.dispatchEvent(new CustomEvent("open_chatbot"))}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chatbot
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero: Chatbot-focused with 3D background */}
      <section className="relative">
        <Hero3D />
        <div className="container mx-auto px-4 pt-20 pb-24">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">AI Preventive Care Chatbot</span>
              <span className="block text-gray-900">Personalized plans and risk guidance</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Chat in a simple, form-like flow. Answer a few questions and instantly get a tailored preventive plan with vaccines, screenings, and lifestyle goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90" onClick={() => window.dispatchEvent(new CustomEvent("open_chatbot"))}>
                Chat Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/preventive-care">Open Full Page</Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">3</div>
                  <div className="text-sm text-gray-600">Disease Models</div>
                  <div className="text-xs text-gray-500 mt-1">Diabetes, Hypertension, Stroke</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Based on clinical validation</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50k+</div>
                  <div className="text-sm text-gray-600">Assessments</div>
                  <div className="text-xs text-gray-500 mt-1">Completed successfully</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Assessment Tools */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Risk Assessment Tools</h2>
            <p className="text-lg text-gray-600">Choose from our comprehensive assessment tools to evaluate your chronic disease risks</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Diabetes Risk */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Diabetes Risk</CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive diabetes risk assessment using lifestyle and health factors
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    18 health indicators
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    Lifestyle factors analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    BMI and health metrics
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                    Family history assessment
                  </div>
                </div>
                <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
                  <Link to="/assessment">Take Assessment</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Heart Disease Risk */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-red-50 to-red-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Heart Disease Risk</CardTitle>
                <CardDescription className="text-gray-600">
                  Advanced cardiovascular risk prediction using clinical parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-red-500 mr-2" />
                    13 cardiac indicators
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-red-500 mr-2" />
                    Blood pressure analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-red-500 mr-2" />
                    Cholesterol levels
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-red-500 mr-2" />
                    ECG and stress test data
                  </div>
                </div>
                <Button asChild className="w-full bg-red-500 hover:bg-red-600">
                  <Link to="/assessment">Take Assessment</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Stroke Risk */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Stroke Risk</CardTitle>
                <CardDescription className="text-gray-600">
                  Neurological risk assessment using comprehensive health data
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                    11 neurological factors
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                    Glucose level analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                    Lifestyle risk factors
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                    Hypertension history
                  </div>
                </div>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                  <Link to="/assessment">Take Assessment</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-gray-50 to-gray-100/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-gray-600">Advanced health risk assessment with personalized insights and evidence-based recommendations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scientific Accuracy</h3>
              <p className="text-gray-600 text-sm">
                Based on peer-reviewed research and validated clinical datasets
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600 text-sm">
                Intuitive interface with step-by-step guided assessments
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preventive Care Chatbot</h3>
              <p className="text-gray-600 text-sm">
                Guided, form-like chat that builds a personalized plan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Results</h3>
              <p className="text-gray-600 text-sm">
                Tailored recommendations based on your unique health profile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Chat with Your Health Assistant?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get your preventive care plan in minutes.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90" onClick={() => window.dispatchEvent(new CustomEvent("open_chatbot"))}>
                Chatbot
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <Link to="/assessment">Start Risk Assessment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">HealthPredict</span>
              </div>
              <p className="text-gray-600 text-sm">
                AI-powered preventive care and risk assessment platform.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/assessment" className="hover:text-primary">Risk Assessment</Link></li>
                <li><Link to="/preventive-care" className="hover:text-primary">Preventive Care Chatbot</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Health Topics</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/assessment" className="hover:text-primary">Diabetes Risk</Link></li>
                <li><Link to="/assessment" className="hover:text-primary">Heart Disease</Link></li>
                <li><Link to="/assessment" className="hover:text-primary">Stroke Risk</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 mt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 HealthPredict. Empowering preventive healthcare through AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
