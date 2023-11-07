import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { Router } from "../../../backend/src/api/trpc";

export const trpc = createTRPCNext<Router>({
  config(opts) {
    return {
      links: [
        httpBatchLink({
          url: "http://localhost:5000/trpc",
        }),
      ],
    };
  },
  ssr: false,
});
