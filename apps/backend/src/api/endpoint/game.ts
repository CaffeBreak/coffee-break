import { injectable } from "tsyringe";
import { z } from "zod";

import { ee } from "../stream";
import { publicProcedure, router } from "../trpc";

const startGameSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
});

@injectable()
export class GameRouter {
  public execute() {
    return router({
      start: publicProcedure.input(startGameSchema).mutation((opts) => {
        ee.emit("changePhase", {
          eventType: "changePhase",
          phase: "finished",
          day: 0,
        });

        return opts.input;
      }),
    });
  }
}
