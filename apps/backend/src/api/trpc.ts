import { initTRPC } from "@trpc/server";
import { container } from "tsyringe";

import { PlayerRouter } from "./endpoint/player";

const t = initTRPC.create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

export const appRouter = router({ player: container.resolve(PlayerRouter).execute() });
export type AppRouter = typeof appRouter;
