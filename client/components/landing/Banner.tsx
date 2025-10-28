import * as React from "react";
import { X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Banner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Prefer session-only persistence to avoid storing long-term state
    const dismissed = sessionStorage.getItem("hp_banner_dismissed");
    if (dismissed === "1") setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative isolate overflow-hidden border-b bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <p>
            New: Preventive Care Chatbot — get a personalized plan in minutes.
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open_chatbot"))}
              className="ml-2 underline underline-offset-4 hover:opacity-90"
            >
              Chat now
            </button>
          </p>
        </div>
        <button
          aria-label="Dismiss banner"
          className="rounded p-1 hover:bg-white/10"
          onClick={() => {
            setVisible(false);
            sessionStorage.setItem("hp_banner_dismissed", "1");
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
