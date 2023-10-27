import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z.union([z.literal("production"), z.literal("development"), z.literal("test")]),
  },
  server: {
    NEXT_RUNTIME: z.union([z.literal("nodejs"), z.literal("edge")]),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
  },
});
