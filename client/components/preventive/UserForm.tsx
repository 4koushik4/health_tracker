import { useState } from "react";
import type { UserProfile } from "@/utils/pdf";

export type UserFormProps = {
  onSubmit: (profile: UserProfile, labFile?: File | null) => void;
};

export default function UserForm({ onSubmit }: UserFormProps) {
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<UserProfile["gender"]>("other");
  const [smoker, setSmoker] = useState(false);
  const [sedentary, setSedentary] = useState(false);
  const [alcohol, setAlcohol] = useState<UserProfile["alcohol"]>("moderate");
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [lab, setLab] = useState<File | null>(null);

  const toggleHistory = (key: string) => {
    setFamilyHistory((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      age: Number(age),
      gender,
      smoker,
      sedentary,
      alcohol,
      familyHistory,
    };
    onSubmit(profile, lab);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Age</span>
          <input
            type="number"
            min={0}
            className="rounded-md border px-3 py-2"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value || "0", 10))}
            required
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Gender</span>
          <select
            className="rounded-md border px-3 py-2"
            value={gender}
            onChange={(e) => setGender(e.target.value as UserProfile["gender"])}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={smoker}
            onChange={(e) => setSmoker(e.target.checked)}
          />
          Smoker
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sedentary}
            onChange={(e) => setSedentary(e.target.checked)}
          />
          Sedentary
        </label>
      </div>

      <label className="flex flex-col text-sm">
        <span className="mb-1 font-medium">Alcohol intake</span>
        <select
          className="rounded-md border px-3 py-2"
          value={alcohol}
          onChange={(e) => setAlcohol(e.target.value as UserProfile["alcohol"])}
        >
          <option value="none">None</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
      </label>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium">Family medical history</legend>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            "diabetes",
            "heart disease",
            "cancer",
            "hypertension",
          ].map((key) => (
            <label key={key} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={familyHistory.includes(key)}
                onChange={() => toggleHistory(key)}
              />
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col text-sm">
        <span className="mb-1 font-medium">Upload sample lab report (optional)</span>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setLab(e.target.files?.[0] || null)}
          className="rounded-md border px-3 py-2"
        />
        <span className="mt-1 text-xs text-muted-foreground">Simulated upload; file is not sent anywhere.</span>
      </label>

      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
      >
        Generate Preventive Care Plan
      </button>
    </form>
  );
}
