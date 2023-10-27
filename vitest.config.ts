import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: "./vitest.setup.ts",
    coverage: {
      enabled: true,
      include: ["src/**"],
      reporter: ["html"],
    },
    exclude: [
      ...configDefaults.exclude,
      "data/**",
    ],
  },
  resolve: {
    alias: [{ find: "@/", replacement: "src/" }],
  },
});
