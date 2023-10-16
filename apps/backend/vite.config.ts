import { defineConfig } from "vite";
import { VitePluginNode, VitePluginNodeConfig } from "vite-plugin-node";

const vitePluginNodeConfig: VitePluginNodeConfig = {
  adapter: "fastify",
  appPath: "src/devserver.ts",
  exportName: "server",
  tsCompiler: "swc",
  swcOptions: {
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: false,
        dynamicImport: false,
        decorators: true,
      },
      transform: {
        decoratorMetadata: true,
      },
      target: "esnext",
      loose: false,
      externalHelpers: true,
      keepClassNames: true,
      paths: {
        "@/*": ["./src/*"],
      },
    },
    minify: false,
    module: {
      type: "es6",
    },
  },
};

export default defineConfig({
  server: {
    port: 5000,
    hmr: true,
  },
  resolve: {
    alias: [
      {
        find: "@/",
        replacement: "src/",
      },
    ],
  },
  plugins: [
    {
      ...VitePluginNode({
        ...vitePluginNodeConfig,
        appPath: "src/index.ts",
      }),
      apply: "build",
    },
    ...VitePluginNode(vitePluginNodeConfig),
  ],
});
