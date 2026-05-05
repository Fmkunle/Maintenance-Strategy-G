import path from "node:path";
import { defineConfig } from "vite";

/**
 * The web workspace is intentionally configured as a multi-entry Vite app for the
 * first migration phase. This keeps today's screens working while we progressively
 * move toward a single routed product shell.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@maint/contracts": path.resolve(__dirname, "../../packages/contracts/src"),
      "@maint/domain": path.resolve(__dirname, "../../packages/domain/src"),
      "@maint/shared": path.resolve(__dirname, "../../packages/shared/src")
    }
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, "index.html"),
        maintenanceNew: path.resolve(__dirname, "maintenance-strategy.html"),
        maintenanceExisting: path.resolve(__dirname, "maintenance-strategy-existing.html")
      }
    }
  },
  server: {
    port: 5173
  }
});
