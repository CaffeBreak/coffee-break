import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: "./vitest.setup.ts",
  },
  resolve: {
    alias: [{ find: "@/", replacement: "src/" }],
  },
});
