import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { OpenApiMeta } from "trpc-openapi";
import { inject, injectable } from "tsyringe";

import { GameRouter } from "./endpoint/game";
import { NPCRouter } from "./endpoint/npc";
import { PlayerRouter } from "./endpoint/player";
import { RoomRouter } from "./endpoint/room";
import { StreamRouter } from "./stream";

const t = initTRPC.meta<OpenApiMeta>().create({
  transformer: superjson,
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

@injectable()
export class AppRouter {
  constructor(
    @inject(PlayerRouter) private readonly playerRouter: PlayerRouter,
    @inject(RoomRouter) private readonly roomRouter: RoomRouter,
    @inject(GameRouter) private readonly gameRouter: GameRouter,
    @inject(NPCRouter) private readonly npcRouter: NPCRouter,
    @inject(StreamRouter) private readonly stramRouter: StreamRouter,
  ) {}

  public execute() {
    return router({
      player: this.playerRouter.execute(),
      room: this.roomRouter.execute(),
      game: this.gameRouter.execute(),
      npc: this.npcRouter.execute(),
      stream: this.stramRouter.execute(),
    });
  }
}

export type Router = ReturnType<typeof AppRouter.prototype.execute>;
