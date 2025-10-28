import { jsPDF } from "jspdf";

export type UserProfile = {
  age: number;
  gender: "male" | "female" | "other";
  smoker: boolean;
  sedentary: boolean;
  alcohol: "none" | "moderate" | "high";
  familyHistory: string[];
};

export type Plan = {
  title: string;
  vaccines: string[];
  screenings: string[];
  lifestyle: string[];
};

export function downloadPlanPDF(user: UserProfile, plan: Plan) {
  const doc = new jsPDF();
  const mm = 10;
  let y = 20;

  doc.setFontSize(18);
  doc.text("Personalized Preventive Care Plan", mm, y);
  y += 8;

  doc.setFontSize(12);
  doc.text(`Profile: Age ${user.age}, Gender ${user.gender}`, mm, y);
  y += 6;
  doc.text(`Lifestyle: ${user.smoker ? "Smoker" : "Non-smoker"}, ${user.sedentary ? "Sedentary" : "Active"}, Alcohol: ${user.alcohol}`, mm, y);
  y += 6;
  if (user.familyHistory.length) {
    doc.text(`Family history: ${user.familyHistory.join(", ")}`, mm, y);
  } else {
    doc.text("Family history: None reported", mm, y);
  }
  y += 10;

  doc.setFontSize(14);
  doc.text(plan.title, mm, y);
  y += 8;

  const section = (title: string, items: string[]) => {
    doc.setFontSize(13);
    doc.text(title, mm, y);
    y += 6;
    doc.setFontSize(12);
    items.forEach((it) => {
      const lines = doc.splitTextToSize("• " + it, 190);
      lines.forEach((line: string) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, mm, y);
        y += 6;
      });
    });
    y += 4;
  };

  section("Vaccines", plan.vaccines);
  section("Screenings", plan.screenings);
  section("Lifestyle Goals", plan.lifestyle);

  doc.save("preventive-care-plan.pdf");
}
