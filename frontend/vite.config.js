import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Allow using environment variables like import.meta.env.VITE_API_BASE_URL
  define: {
    "process.env": process.env,
  },

  // Ensures PNG, JPG, SVG, and other assets build correctly on Render
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],

  server: {
    port: 5173, // optional, but helps local dev consistency
  },
});
