import "reflect-metadata";

import { env } from "./env";

export const register = async () => {
  if (env.NEXT_RUNTIME === "nodejs") {
    await import("./server/di");
  }
};
