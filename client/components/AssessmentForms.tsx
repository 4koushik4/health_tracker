import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calculator, Heart, Stethoscope, Brain } from "lucide-react";

interface AssessmentFormsProps {
  assessmentType: string;
  assessmentData: any;
  updateAssessmentData: (field: string, value: string | boolean | number) => void;
  getBMICategory: (bmi: number) => { category: string; color: string };
}

export function DiabetesForm({ assessmentData, updateAssessmentData }: AssessmentFormsProps) {
  return (
    <div className="space-y-8">
      {/* Common Fields for BMI calculation */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-purple-500" />
          Basic Information
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="e.g., 45"
              value={assessmentData.age || ""}
              onChange={(e) => updateAssessmentData('age', e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input 
              id="height" 
              type="number" 
              placeholder="e.g., 170"
              value={assessmentData.height || ""}
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
              value={assessmentData.weight || ""}
              onChange={(e) => updateAssessmentData('weight', e.target.value)}
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
                <Calculator className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Diabetes Specific Fields */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-purple-500" />
          Diabetes Assessment
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pregnancies">Number of Pregnancies</Label>
            <Input 
              id="pregnancies" 
              type="number" 
              placeholder="e.g., 3"
              value={assessmentData.pregnancies || ""}
              onChange={(e) => updateAssessmentData('pregnancies', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
            <Input 
              id="glucose" 
              type="number" 
              placeholder="e.g., 130"
              value={assessmentData.glucoseDiabetes || ""}
              onChange={(e) => updateAssessmentData('glucoseDiabetes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
            <Input 
              id="bloodPressure" 
              type="number" 
              placeholder="e.g., 70"
              value={assessmentData.bloodPressure || ""}
              onChange={(e) => updateAssessmentData('bloodPressure', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skinThickness">Skin Thickness (mm)</Label>
            <Input 
              id="skinThickness" 
              type="number" 
              placeholder="e.g., 25"
              value={assessmentData.skinThickness || ""}
              onChange={(e) => updateAssessmentData('skinThickness', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insulin">Insulin Level (μU/mL)</Label>
            <Input 
              id="insulin" 
              type="number" 
              placeholder="e.g., 100"
              value={assessmentData.insulin || ""}
              onChange={(e) => updateAssessmentData('insulin', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diabetesPedigree">Diabetes Pedigree Function</Label>
            <Input 
              id="diabetesPedigree" 
              type="number" 
              step="0.001"
              placeholder="e.g., 0.5"
              value={assessmentData.diabetesPedigreeFunction || ""}
              onChange={(e) => updateAssessmentData('diabetesPedigreeFunction', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HypertensionForm({ assessmentData, updateAssessmentData }: AssessmentFormsProps) {
  return (
    <div className="space-y-8">
      {/* Common Fields for BMI calculation */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Basic Information
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="e.g., 50"
              value={assessmentData.age || ""}
              onChange={(e) => updateAssessmentData('age', e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input 
              id="height" 
              type="number" 
              placeholder="e.g., 170"
              value={assessmentData.height || ""}
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
              value={assessmentData.weight || ""}
              onChange={(e) => updateAssessmentData('weight', e.target.value)}
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
                <Calculator className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hypertension Specific Fields */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-red-500" />
          Hypertension Assessment
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="saltIntake">Daily Salt Intake (grams)</Label>
            <Input 
              id="saltIntake" 
              type="number" 
              step="0.1"
              placeholder="e.g., 6.5"
              value={assessmentData.saltIntake || ""}
              onChange={(e) => updateAssessmentData('saltIntake', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stressScore">Stress Score (1-10)</Label>
            <Input 
              id="stressScore" 
              type="number" 
              min="1"
              max="10"
              placeholder="e.g., 3"
              value={assessmentData.stressScore || ""}
              onChange={(e) => updateAssessmentData('stressScore', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Blood Pressure History</Label>
            <RadioGroup 
              value={assessmentData.bpHistory || ""} 
              onValueChange={(value) => updateAssessmentData('bpHistory', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="no-bp-history" />
                <Label htmlFor="no-bp-history">No History</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="bp-history" />
                <Label htmlFor="bp-history">Has History</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleepDuration">Sleep Duration (hours)</Label>
            <Input 
              id="sleepDuration" 
              type="number" 
              step="0.1"
              placeholder="e.g., 7.0"
              value={assessmentData.sleepDuration || ""}
              onChange={(e) => updateAssessmentData('sleepDuration', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Family History</Label>
            <RadioGroup 
              value={assessmentData.familyHistory || ""} 
              onValueChange={(value) => updateAssessmentData('familyHistory', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="no-family-history" />
                <Label htmlFor="no-family-history">No Family History</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="family-history" />
                <Label htmlFor="family-history">Has Family History</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Smoking Status</Label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="smoking-status"
                checked={assessmentData.smokingStatusSmoker || false}
                onChange={(e) => updateAssessmentData('smokingStatusSmoker', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="smoking-status">Currently a smoker</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeartDiseaseForm({ assessmentData, updateAssessmentData }: AssessmentFormsProps) {
  return (
    <div className="space-y-8">
      {/* Common Fields for BMI calculation */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-orange-500" />
          Basic Information
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="e.g., 60"
              value={assessmentData.age || ""}
              onChange={(e) => updateAssessmentData('age', e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Biological Sex</Label>
            <RadioGroup 
              value={assessmentData.sex || ""} 
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
              value={assessmentData.height || ""}
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
              value={assessmentData.weight || ""}
              onChange={(e) => updateAssessmentData('weight', e.target.value)}
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
                <Calculator className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Heart Disease Specific Fields */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-orange-500" />
          Heart Disease Assessment
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Education Level</Label>
            <Select value={assessmentData.education || ""} onValueChange={(value) => updateAssessmentData('education', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">High School</SelectItem>
                <SelectItem value="2.0">College</SelectItem>
                <SelectItem value="3.0">Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Current Smoker</Label>
            <RadioGroup 
              value={assessmentData.currentSmoker || ""} 
              onValueChange={(value) => updateAssessmentData('currentSmoker', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="non-smoker" />
                <Label htmlFor="non-smoker">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="smoker" />
                <Label htmlFor="smoker">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cigsPerDay">Cigarettes Per Day</Label>
            <Input 
              id="cigsPerDay" 
              type="number" 
              step="0.1"
              placeholder="e.g., 0.0"
              value={assessmentData.cigsPerDay || ""}
              onChange={(e) => updateAssessmentData('cigsPerDay', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="BPMeds">Blood Pressure Medication</Label>
            <Select value={assessmentData.BPMeds || ""} onValueChange={(value) => updateAssessmentData('BPMeds', value)}>
              <SelectTrigger>
                <SelectValue placeholder="BP Medication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.0">No</SelectItem>
                <SelectItem value="1.0">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Prevalent Stroke</Label>
            <RadioGroup 
              value={assessmentData.prevalentStroke || ""} 
              onValueChange={(value) => updateAssessmentData('prevalentStroke', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="no-stroke" />
                <Label htmlFor="no-stroke">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="stroke" />
                <Label htmlFor="stroke">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Prevalent Hypertension</Label>
            <RadioGroup 
              value={assessmentData.prevalentHyp || ""} 
              onValueChange={(value) => updateAssessmentData('prevalentHyp', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="no-hyp" />
                <Label htmlFor="no-hyp">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="hyp" />
                <Label htmlFor="hyp">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Diabetes</Label>
            <RadioGroup 
              value={assessmentData.diabetes || ""} 
              onValueChange={(value) => updateAssessmentData('diabetes', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="no-diabetes" />
                <Label htmlFor="no-diabetes">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="diabetes" />
                <Label htmlFor="diabetes">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totChol">Total Cholesterol (mg/dL)</Label>
            <Input 
              id="totChol" 
              type="number" 
              step="0.1"
              placeholder="e.g., 250.5"
              value={assessmentData.totChol || ""}
              onChange={(e) => updateAssessmentData('totChol', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sysBP">Systolic Blood Pressure (mmHg)</Label>
            <Input 
              id="sysBP" 
              type="number" 
              step="0.1"
              placeholder="e.g., 140.0"
              value={assessmentData.sysBP || ""}
              onChange={(e) => updateAssessmentData('sysBP', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diaBP">Diastolic Blood Pressure (mmHg)</Label>
            <Input 
              id="diaBP" 
              type="number" 
              step="0.1"
              placeholder="e.g., 90.0"
              value={assessmentData.diaBP || ""}
              onChange={(e) => updateAssessmentData('diaBP', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
            <Input 
              id="heartRate" 
              type="number" 
              step="0.1"
              placeholder="e.g., 75.0"
              value={assessmentData.heartRate || ""}
              onChange={(e) => updateAssessmentData('heartRate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
            <Input 
              id="glucose" 
              type="number" 
              step="0.1"
              placeholder="e.g., 100.0"
              value={assessmentData.glucose || ""}
              onChange={(e) => updateAssessmentData('glucose', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
