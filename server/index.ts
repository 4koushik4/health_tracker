import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Proxy to external ML model (Render)
  app.post("/api/predict", async (req, res) => {
    const renderUrl = "https://health-advisor-jogw.onrender.com/predict";
    try {
      const { assessment, data, ...rest } = req.body || {};
      const merged = data && typeof data === "object" ? { assessment, ...data } : { assessment, ...rest };

      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 20000);
      const upstream = await fetch(renderUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
        signal: controller.signal,
      });
      clearTimeout(t);

      const text = await upstream.text();
      let json: any;
      try { json = JSON.parse(text); } catch {
        json = { raw: text };
      }

      if (!upstream.ok) {
        return res.status(upstream.status).json({ error: "Upstream error", status: upstream.status, data: json });
        }

      return res.json(json);
    } catch (e: any) {
      return res.status(500).json({ error: "Proxy failed", message: e?.message || String(e) });
    }
  });

  return app;
}
