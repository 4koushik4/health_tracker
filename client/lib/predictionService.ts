export type AssessmentType = "diabetes" | "hypertension" | "stroke";

export interface UnifiedPrediction {
  risk_percentage: number; // 0-100
  risk_category: string;   // Low/Moderate/High
  confidence_score: number; // 0-1
  key_factors: string[];
  recommendations: string[];
  vaccines?: string[];
  screenings?: string[];
  raw?: any;
}

const DEFAULT_ENDPOINT = "/api/predict";

function categorize(prob: number): string {
  if (prob >= 0.75) return "High Risk";
  if (prob >= 0.4) return "Moderate Risk";
  return "Low Risk";
}

export async function predict(assessment: AssessmentType, payload: any, endpoint = DEFAULT_ENDPOINT, timeoutMs = 20000): Promise<UnifiedPrediction> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const body = { assessment, data: payload };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
    mode: "cors",
  });
  clearTimeout(timer);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Prediction failed: ${res.status} ${res.statusText} ${txt}`);
  }

  const raw = await res.json().catch(() => ({}));
  // Flexible mapping: support various backend shapes
  const prob = typeof raw.probability === "number"
    ? raw.probability
    : typeof raw.risk_probability === "number"
      ? raw.risk_probability
      : typeof raw.risk_percentage === "number"
        ? Math.max(0, Math.min(100, raw.risk_percentage)) / 100
        : typeof raw.score === "number" && raw.score > 1
          ? Math.max(0, Math.min(100, raw.score)) / 100
          : typeof raw.score === "number"
            ? Math.max(0, Math.min(1, raw.score))
            : 0.5;

  const percentage = Math.round(prob * 100);

  const unified: UnifiedPrediction = {
    risk_percentage: typeof raw.risk_percentage === "number" ? Math.round(raw.risk_percentage) : percentage,
    risk_category: raw.risk_category || categorize(prob),
    confidence_score: typeof raw.confidence_score === "number" ? raw.confidence_score : (typeof raw.confidence === "number" ? raw.confidence : 0.9),
    key_factors: Array.isArray(raw.key_factors) ? raw.key_factors : (Array.isArray(raw.factors) ? raw.factors : []),
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : (Array.isArray(raw.lifestyle) ? raw.lifestyle : []),
    vaccines: Array.isArray(raw.vaccines) ? raw.vaccines : undefined,
    screenings: Array.isArray(raw.screenings) ? raw.screenings : undefined,
    raw,
  };

  return unified;
}
