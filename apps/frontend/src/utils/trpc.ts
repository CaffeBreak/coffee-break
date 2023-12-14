"use client";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createWSClient, httpBatchLink, loggerLink, splitLink, wsLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createSWRProxyHooks } from "@trpc-swr/client";
import superjson from "superjson";

import type { Router } from "backend/src/api/trpc";

const url = "http://localhost:5555/trpc";
const wsClient = createWSClient({
  url: "ws://localhost:5555/trpc",
});

export const trpc = createTRPCReact<Router>();

export const trpcSWR = createSWRProxyHooks<Router>({
  links: [
    loggerLink({
      enabled: () => true,
    }),
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url,
      }),
    }),
  ],
  transformer: superjson,
});
