"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createWSClient, httpBatchLink, loggerLink, splitLink, wsLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

import { trpc } from "./trpc";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5000 } },
      }),
  );

  const url = "http://localhost:5555/trpc";
  const wsClient = createWSClient({
    url: "ws://localhost:5555/trpc",
  });

  const [trpcClient] = useState(() =>
    trpc.createClient({
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
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
