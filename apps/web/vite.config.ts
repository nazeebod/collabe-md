import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**"],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/collaboration": {
        target: "http://localhost:3002",
        ws: true,
        changeOrigin: true,
        rewrite: () => "/",
      },
    },
  },
});
