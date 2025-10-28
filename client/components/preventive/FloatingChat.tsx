import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chat from "./Chat";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    const closeHandler = () => setOpen(false);
    window.addEventListener("open_chatbot", openHandler);
    window.addEventListener("close_chatbot", closeHandler);
    return () => {
      window.removeEventListener("open_chatbot", openHandler);
      window.removeEventListener("close_chatbot", closeHandler);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 sm:w-[380px] sm:h-[560px] w-screen h-[calc(100vh-2rem)] sm:max-w-[90vw] rounded-xl border bg-white shadow-2xl overflow-hidden sm:fixed sm:bottom-4 sm:right-4 fixed inset-0 sm:inset-auto">
          <div className="flex items-center justify-between border-b px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <div className="text-sm font-semibold">Preventive Care Chatbot</div>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[calc(100%-40px)] sm:h-[calc(560px-40px)] overflow-auto p-2 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <Chat embedded className="space-y-3" />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Toggle chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
