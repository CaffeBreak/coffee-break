import { createTRPCReact } from "@trpc/react-query";

import type { Router } from "@/server/api/trpc";

export const trpc = createTRPCReact<Router>();
