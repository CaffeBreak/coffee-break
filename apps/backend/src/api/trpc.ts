import { CookieSerializeOptions } from "@fastify/cookie";
import { initTRPC } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import superjson from "superjson";
import { inject, injectable } from "tsyringe";

import { PlayerRouter } from "./endpoint/player";
import { RoomRouter } from "./endpoint/room";

import { playerIdSchema } from "@/domain/entity/player";

export const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  const ogtResult = playerIdSchema.safeParse(req.cookies);
  const ogt = ogtResult.success ? ogtResult.data : undefined;

  return {
    ogt,
    setCookie: async (name: string, value: string, options?: CookieSerializeOptions) => {
      await res.setCookie(name, value, options);
    },
  };
};

const t = initTRPC.context<ReturnType<typeof createContext>>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

@injectable()
export class AppRouter {
  constructor(
    @inject(PlayerRouter) private playerRouter: PlayerRouter,
    @inject(RoomRouter) private roomRouter: RoomRouter,
  ) {}

  public execute() {
    return router({
      player: this.playerRouter.execute(),
      room: this.roomRouter.execute(),
    });
  }
}

export type Router = ReturnType<typeof AppRouter.prototype.execute>;
