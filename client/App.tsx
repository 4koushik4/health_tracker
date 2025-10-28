import * as React from "react";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import PreventionPlan from "./pages/PreventionPlan";
import Hospitals from "./pages/Hospitals";
import Dashboard from "./pages/Dashboard";
import PreventiveCare from "./pages/PreventiveCare";
import NotFound from "./pages/NotFound";
import FloatingChat from "@/components/preventive/FloatingChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/prevention-plan" element={<PreventionPlan />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preventive-care" element={<PreventiveCare />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Floating chatbot mounted globally */}
        <FloatingChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Prevent duplicate mounting during HMR: only mount once
if (typeof window !== "undefined") {
  const winAny = window as any;
  if (!winAny.__preventive_care_root_mounted) {
    const container = document.getElementById("root");
    if (container) {
      createRoot(container).render(<App />);
      winAny.__preventive_care_root_mounted = true;
    }
  }
}
