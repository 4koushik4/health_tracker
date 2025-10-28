import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    server: {
      host: "::",
      port: 8080,
      fs: {
        allow: ["./client", "./shared"],
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
      },
    },

    build: {
      outDir: "dist/spa",
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Separate React
            if (id.includes("node_modules/react")) return "react";
            // Separate routing
            if (id.includes("react-router")) return "router";
            // Separate charting (if used)
            if (id.includes("recharts") || id.includes("chart.js")) return "charts";
            // Separate UI libs (if used)
            if (id.includes("@mui/") || id.includes("chakra")) return "ui";
            // Utilities
            if (id.includes("date-fns") || id.includes("lodash")) return "utils";
            // Everything else from node_modules
            if (id.includes("node_modules")) return "vendor";
          },
        },
      },
    },

    plugins: [react(), isDev ? expressPlugin() : null].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };
});

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
