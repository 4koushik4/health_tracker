export type IcsEvent = {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  filename?: string;
};

function toIcsDate(dt: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = dt.getUTCFullYear();
  const mm = pad(dt.getUTCMonth() + 1);
  const dd = pad(dt.getUTCDate());
  const hh = pad(dt.getUTCHours());
  const min = pad(dt.getUTCMinutes());
  const ss = pad(dt.getUTCSeconds());
  return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
}

export function downloadICS(event: IcsEvent) {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@preventive-care`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Preventive Care Planner//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SUMMARY:${event.summary}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : undefined,
    event.location ? `LOCATION:${event.location}` : undefined,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(event.start)}`,
    `DTEND:${toIcsDate(event.end)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean) as string[];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (event.filename || "preventive-care-reminder") + ".ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
