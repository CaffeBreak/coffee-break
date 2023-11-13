import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.union([z.literal("production"), z.literal("development")]),
});

export type env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
