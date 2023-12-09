import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { inject, injectable } from "tsyringe";

import { GameRouter } from "./endpoint/game";
import { PlayerRouter } from "./endpoint/player";
import { ChatRouter } from "./endpoint/post";
import { RoomRouter } from "./endpoint/room";
import { StreamRouter } from "./stream";

const t = initTRPC.create({
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
    @inject(ChatRouter) private readonly chatRouter: ChatRouter,
    @inject(StreamRouter) private readonly stramRouter: StreamRouter,
  ) {}

  public execute() {
    return router({
      player: this.playerRouter.execute(),
      room: this.roomRouter.execute(),
      game: this.gameRouter.execute(),
      chat: this.chatRouter.execute(),
      stream: this.stramRouter.execute(),
    });
  }
}

export type Router = ReturnType<typeof AppRouter.prototype.execute>;
