import { injectable } from "tsyringe";
import { z } from "zod";

import { changePhaseEE, ee } from "../stream";
import { publicProcedure, router } from "../trpc";

const startGameSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
});

@injectable()
export class GameRouter {
  public execute() {
    return router({
      start: publicProcedure.input(startGameSchema).mutation((_opts) => {
        ee.emit(changePhaseEE, {
          eventType: "changePhase",
          phase: "FINISHED",
          day: 255,
        });
      }),
    });
  }
}
