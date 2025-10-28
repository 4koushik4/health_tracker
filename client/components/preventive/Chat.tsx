import { useEffect, useMemo, useState } from "react";
import type { Plan, UserProfile } from "@/utils/pdf";
import { samplePlans } from "@/data/samplePlans";
import PlanDisplay from "./PlanDisplay";
import { predict, type AssessmentType } from "@/lib/predictionService";

function choosePlan(profile: UserProfile): Plan {
  const hasDiabetesHistory = profile.familyHistory.includes("diabetes");

  if (profile.age < 30 && !profile.smoker && !hasDiabetesHistory) {
    return samplePlans.youngAdult;
  }

  if (
    profile.age >= 40 && profile.age < 60 && (profile.smoker || hasDiabetesHistory)
  ) {
    return samplePlans.middleAgeSmoker;
  }

  if (profile.age >= 60 || profile.sedentary) {
    return samplePlans.seniorSedentary;
  }

  return samplePlans.youngAdult;
}

type Step =
  | "age"
  | "gender"
  | "smoker"
  | "sedentary"
  | "alcohol"
  | "familyHistory"
  | "metrics"
  | "lab"
  | "done";

const FAMILY_KEYS = ["diabetes", "heart disease", "cancer", "hypertension"] as const;

type Draft = {
  age?: number;
  gender?: UserProfile["gender"];
  smoker?: boolean;
  sedentary?: boolean;
  alcohol?: UserProfile["alcohol"];
  familyHistory: string[];
  systolicBP?: number;
  diastolicBP?: number;
  fastingGlucose?: number;
  totalCholesterol?: number;
  heartRate?: number;
};

export default function Chat({ embedded = false, className = "" }: { embedded?: boolean; className?: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [labName, setLabName] = useState<string | null>(null);

  const [step, setStep] = useState<Step>("age");
  const [draft, setDraft] = useState<Draft>({ familyHistory: [] });
  const [ageInput, setAgeInput] = useState<string>("");
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<{
    risk_percentage: number;
    risk_category: string;
    confidence_score: number;
    vaccines?: string[];
    screenings?: string[];
    recommendations?: string[];
  } | null>(null);

  useEffect(() => {
    // Initial greeting
    if (!profile && step === "age" && !ageInput) {
      // no-op UI wise; greeting is rendered below
    }
  }, [profile, step, ageInput]);

  const plan = useMemo(() => (profile ? choosePlan(profile) : null), [profile]);

  const next = () => {
    if (step === "age") return setStep("gender");
    if (step === "gender") return setStep("smoker");
    if (step === "smoker") return setStep("sedentary");
    if (step === "sedentary") return setStep("alcohol");
    if (step === "alcohol") return setStep("familyHistory");
    if (step === "familyHistory") return setStep("metrics");
    if (step === "metrics") return setStep("lab");
    if (step === "lab") return finalize();
  };

  const finalize = async () => {
    if (
      draft.age == null ||
      draft.gender == null ||
      draft.smoker == null ||
      draft.sedentary == null ||
      draft.alcohol == null
    ) {
      return;
    }
    const full: UserProfile = {
      age: draft.age,
      gender: draft.gender,
      smoker: draft.smoker,
      sedentary: draft.sedentary,
      alcohol: draft.alcohol,
      familyHistory: draft.familyHistory,
    } as UserProfile;
    setProfile(full);

    // Try prediction with available metrics; fallback gracefully
    setPredicting(true);
    setPrediction(null);
    try {
      const assessment: AssessmentType = "hypertension";
      const payload: any = {
        age: draft.age,
        gender: draft.gender, // expected by upstream
        lifestyle: {
          smoker: draft.smoker,
          sedentary: draft.sedentary,
          alcohol: draft.alcohol,
        },
        family_history: draft.familyHistory,
        sysBP: draft.systolicBP ?? undefined,
        diaBP: draft.diastolicBP ?? undefined,
        glucose: draft.fastingGlucose ?? undefined,
        totChol: draft.totalCholesterol ?? undefined,
        heartRate: draft.heartRate ?? undefined,
        currentSmoker: draft.smoker ? 1 : 0,
        prevalentHyp: draft.diastolicBP && draft.diastolicBP > 89 ? 1 : 0,
      };
      const unified = await predict(assessment, payload);
      setPrediction({
        risk_percentage: unified.risk_percentage,
        risk_category: unified.risk_category,
        confidence_score: unified.confidence_score,
        vaccines: unified.vaccines,
        screenings: unified.screenings,
        recommendations: unified.recommendations,
      });
    } catch (e) {
      setPrediction(null);
    } finally {
      setPredicting(false);
    }

    setStep("done");
  };

  const toggleHistory = (key: string) => {
    setDraft((d) => ({
      ...d,
      familyHistory: d.familyHistory.includes(key)
        ? d.familyHistory.filter((k) => k !== key)
        : [...d.familyHistory, key],
    }));
  };

  return (
    <div className={embedded ? className : "mx-auto max-w-3xl space-y-6 p-4"}>
      <div className={embedded ? "rounded-xl border bg-card p-3" : "rounded-xl border bg-card p-4"}>
        <div className={embedded ? "mb-3 flex items-center gap-3" : "mb-4 flex items-center gap-3"}>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-emerald-600" />
          <div>
            <h1 className="text-lg font-semibold">Preventive Care Chatbot</h1>
            <p className="text-xs text-muted-foreground">
              Answers are processed locally and predictions fetch securely from /api/predict (Render).
            </p>
          </div>
        </div>

        {!profile && (
          <div className="space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3 text-sm border">
              <div className="font-medium">Hi there! 👋</div>
              <div>This chat asks one question at a time to personalize your plan. Your data stays in your browser.</div>
            </div>

            {step === "age" && (
              <div className="space-y-2">
                <div className="text-sm">First, how old are you?</div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    className="w-32 rounded-md border px-3 py-2"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                  />
                  <button
                    className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
                    onClick={() => {
                      const n = parseInt(ageInput, 10);
                      if (!isNaN(n) && n >= 0) {
                        setDraft((d) => ({ ...d, age: n }));
                        next();
                      }
                    }}
                    disabled={!ageInput}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === "gender" && (
              <div className="space-y-2">
                <div className="text-sm">What is your gender?</div>
                <div className="flex flex-wrap gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => {
                        setDraft((d) => ({ ...d, gender: g }));
                        next();
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "smoker" && (
              <div className="space-y-2">
                <div className="text-sm">Do you smoke?</div>
                <div className="flex gap-2">
                  <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted" onClick={() => { setDraft((d)=>({...d, smoker: true})); next(); }}>Yes</button>
                  <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted" onClick={() => { setDraft((d)=>({...d, smoker: false})); next(); }}>No</button>
                </div>
              </div>
            )}

            {step === "sedentary" && (
              <div className="space-y-2">
                <div className="text-sm">Would you describe your lifestyle as sedentary?</div>
                <div className="flex gap-2">
                  <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted" onClick={() => { setDraft((d)=>({...d, sedentary: true})); next(); }}>Yes</button>
                  <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted" onClick={() => { setDraft((d)=>({...d, sedentary: false})); next(); }}>No</button>
                </div>
              </div>
            )}

            {step === "alcohol" && (
              <div className="space-y-2">
                <div className="text-sm">How would you describe your alcohol intake?</div>
                <div className="flex flex-wrap gap-2">
                  {(["none", "moderate", "high"] as const).map((a) => (
                    <button
                      key={a}
                      className="rounded-md border px-3 py-2 text-sm capitalize hover:bg-muted"
                      onClick={() => {
                        setDraft((d) => ({ ...d, alcohol: a }));
                        next();
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "familyHistory" && (
              <div className="space-y-2">
                <div className="text-sm">Any family medical history? (Select all that apply)</div>
                <div className="flex flex-wrap gap-2">
                  {FAMILY_KEYS.map((k) => (
                    <button
                      key={k}
                      className={`rounded-full border px-4 py-2 text-sm capitalize transition-colors ${draft.familyHistory.includes(k) ? "bg-primary text-white" : "hover:bg-muted"}`}
                      onClick={() => toggleHistory(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <div>
                  <button className="mt-2 rounded-md bg-primary px-4 py-2 text-white" onClick={next}>Next</button>
                </div>
              </div>
            )}

            {step === "metrics" && (
              <div className="space-y-2">
                <div className="text-sm">Optional: Provide basic health metrics for AI prediction.</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Systolic (mmHg)"
                    className="rounded-md border px-3 py-2"
                    value={draft.systolicBP ?? ""}
                    onChange={(e)=>setDraft(d=>({...d, systolicBP: e.target.value? parseInt(e.target.value,10): undefined}))}
                  />
                  <input
                    type="number"
                    placeholder="Diastolic (mmHg)"
                    className="rounded-md border px-3 py-2"
                    value={draft.diastolicBP ?? ""}
                    onChange={(e)=>setDraft(d=>({...d, diastolicBP: e.target.value? parseInt(e.target.value,10): undefined}))}
                  />
                  <input
                    type="number"
                    placeholder="Glucose (mg/dL)"
                    className="rounded-md border px-3 py-2"
                    value={draft.fastingGlucose ?? ""}
                    onChange={(e)=>setDraft(d=>({...d, fastingGlucose: e.target.value? parseInt(e.target.value,10): undefined}))}
                  />
                  <input
                    type="number"
                    placeholder="Total Cholesterol"
                    className="rounded-md border px-3 py-2"
                    value={draft.totalCholesterol ?? ""}
                    onChange={(e)=>setDraft(d=>({...d, totalCholesterol: e.target.value? parseInt(e.target.value,10): undefined}))}
                  />
                  <input
                    type="number"
                    placeholder="Heart Rate (bpm)"
                    className="rounded-md border px-3 py-2"
                    value={draft.heartRate ?? ""}
                    onChange={(e)=>setDraft(d=>({...d, heartRate: e.target.value? parseInt(e.target.value,10): undefined}))}
                  />
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md bg-primary px-4 py-2 text-white" onClick={next}>Continue</button>
                  <button className="rounded-md border px-4 py-2" onClick={next}>Skip</button>
                </div>
              </div>
            )}

            {step === "lab" && (
              <div className="space-y-2">
                <div className="text-sm">Optionally, upload a sample lab report (not uploaded anywhere).</div>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setLabName(e.target.files?.[0]?.name || null)}
                  className="rounded-md border px-3 py-2"
                />
                <div className="flex gap-2">
                  <button className="rounded-md bg-primary px-4 py-2 text-white" onClick={finalize}>Generate Plan</button>
                  <button className="rounded-md border px-4 py-2" onClick={finalize}>Skip</button>
                </div>
              </div>
            )}
          </div>
        )}

        {profile && plan && (
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-emerald-100 p-3">
                Great! Based on your answers, here’s a preventive care plan.
              </div>
              {labName && (
                <div className="rounded-md bg-muted p-3">
                  Noted sample lab file: <span className="font-medium">{labName}</span>
                </div>
              )}
            </div>

            {/* Prediction summary bubble */}
            <div className="rounded-xl border p-3 bg-white/70">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">AI Risk Prediction</div>
                {predicting && <div className="text-xs text-muted-foreground">Analyzing…</div>}
              </div>
              {prediction ? (
                <>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-emerald-50">
                      <div className="text-xs text-emerald-700">Risk</div>
                      <div className="text-lg font-semibold text-emerald-900">{prediction.risk_percentage}%</div>
                    </div>
                    <div className="p-2 rounded bg-amber-50">
                      <div className="text-xs text-amber-700">Category</div>
                      <div className="text-sm font-semibold text-amber-900">{prediction.risk_category}</div>
                    </div>
                    <div className="p-2 rounded bg-sky-50">
                      <div className="text-xs text-sky-700">Confidence</div>
                      <div className="text-sm font-semibold text-sky-900">{Math.round(prediction.confidence_score*100)}%</div>
                    </div>
                  </div>

                  {(prediction.vaccines || prediction.screenings || prediction.recommendations) && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {!!prediction.vaccines?.length && (
                        <section className="rounded-lg border border-green-200 bg-green-50 p-3">
                          <h3 className="mb-2 text-sm font-medium text-green-900">Vaccines</h3>
                          <ul className="list-disc space-y-1 pl-4 text-xs text-green-900/90">
                            {prediction.vaccines.map((v) => <li key={v}>{v}</li>)}
                          </ul>
                        </section>
                      )}
                      {!!prediction.screenings?.length && (
                        <section className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <h3 className="mb-2 text-sm font-medium text-blue-900">Screenings</h3>
                          <ul className="list-disc space-y-1 pl-4 text-xs text-blue-900/90">
                            {prediction.screenings.map((s) => <li key={s}>{s}</li>)}
                          </ul>
                        </section>
                      )}
                      {!!prediction.recommendations?.length && (
                        <section className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                          <h3 className="mb-2 text-sm font-medium text-amber-900">Recommendations</h3>
                          <ul className="list-disc space-y-1 pl-4 text-xs text-amber-900/90">
                            {prediction.recommendations.map((r) => <li key={r}>{r}</li>)}
                          </ul>
                        </section>
                      )}
                    </div>
                  )}
                </>
              ) : (
                !predicting && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Provide metrics above for a more accurate prediction, or continue with the plan.
                  </div>
                )
              )}
            </div>

            <PlanDisplay plan={{
              title: prediction ? "AI Preventive Plan" : plan.title,
              vaccines: prediction?.vaccines && prediction.vaccines.length ? prediction.vaccines : plan.vaccines,
              screenings: prediction?.screenings && prediction.screenings.length ? prediction.screenings : plan.screenings,
              lifestyle: prediction?.recommendations && prediction.recommendations.length ? prediction.recommendations : plan.lifestyle,
            }} user={profile} />

            <div className="text-center text-xs text-muted-foreground">
              Want to start over?{' '}
              <button
                onClick={() => {
                  setProfile(null);
                  setLabName(null);
                  setDraft({ familyHistory: [] });
                  setAgeInput("");
                  setStep("age");
                  setPrediction(null);
                }}
                className="underline"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
