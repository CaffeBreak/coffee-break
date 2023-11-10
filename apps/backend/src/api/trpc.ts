import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { inject, injectable } from "tsyringe";

import { PlayerRouter } from "./endpoint/player";

const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

@injectable()
export class AppRouter {
  constructor(@inject(PlayerRouter) private playerRouter: PlayerRouter) {}

  public execute() {
    return router({
      player: this.playerRouter.execute(),
    });
  }
}

export type Router = ReturnType<typeof AppRouter.prototype.execute>;
