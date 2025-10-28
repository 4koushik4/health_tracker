import { downloadICS } from "@/utils/calendar";
import { downloadPlanPDF, type Plan, type UserProfile } from "@/utils/pdf";

import { toast } from "@/hooks/use-toast";

export default function PlanDisplay({ plan, user }: { plan: Plan; user: UserProfile }) {
  const handlePdf = () => {
    toast({ title: "Generating PDF", description: "Your plan PDF is being prepared..." });
    setTimeout(() => {
      try {
        downloadPlanPDF(user, plan);
        toast({ title: "Download ready", description: "Saved as preventive-care-plan.pdf" });
      } catch (e) {
        toast({ title: "PDF failed", description: "Please try again." });
      }
    }, 0);
  };

  const handleIcs = () => {
    const start = new Date();
    start.setDate(start.getDate() + 14);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    downloadICS({
      summary: "Preventive Care Appointment",
      description:
        "Schedule time for vaccines/screenings from your Preventive Care Plan.",
      start,
      end,
      location: "Your preferred clinic",
      filename: "preventive-care-reminder",
    });
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("My Preventive Care Plan");
    const body = encodeURIComponent([
      `Profile: Age ${user.age}, Gender ${user.gender}`,
      "",
      plan.title,
      "",
      "Vaccines:",
      ...plan.vaccines.map((v) => `- ${v}`),
      "",
      "Screenings:",
      ...plan.screenings.map((s) => `- ${s}`),
      "",
      "Lifestyle Goals:",
      ...plan.lifestyle.map((l) => `- ${l}`),
    ].join("\n"));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Preventive Care Plan</h2>
          <p className="text-sm text-muted-foreground">{plan.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePdf}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Download PDF
          </button>
          <button
            onClick={handleIcs}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Add Calendar Reminder (.ics)
          </button>
          <button
            onClick={handleEmail}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Email Plan
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <section className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 font-medium text-green-900">Vaccines</h3>
          <ul className="list-disc space-y-1 pl-4 text-sm text-green-900/90">
            {plan.vaccines.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-900">Screenings</h3>
          <ul className="list-disc space-y-1 pl-4 text-sm text-blue-900/90">
            {plan.screenings.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="mb-2 font-medium text-amber-900">Lifestyle Goals</h3>
          <ul className="list-disc space-y-1 pl-4 text-sm text-amber-900/90">
            {plan.lifestyle.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
