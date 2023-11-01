import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: "./vitest.setup.ts",
    coverage: {
      enabled: true,
      include: ["src/**"],
      reporter: ["html"],
    },
  },
  resolve: {
    alias: [{ find: "@/", replacement: "src/" }],
  },
});
