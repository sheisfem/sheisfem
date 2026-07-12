import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/content.config.ts",
        "src/**/*.astro",
        "src/scripts/**",
        "src/styles/**",
        "src/env.d.ts",
      ],
      thresholds: {
        branches: 86,
        functions: 86,
        lines: 86,
        statements: 86,
      },
    },
  },
});
