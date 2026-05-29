import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
