import Chat from "@/components/preventive/Chat";

export default function PreventiveCare() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-bold">Personalized Preventive Care Planner</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Chat />
      </main>
    </div>
  );
}
