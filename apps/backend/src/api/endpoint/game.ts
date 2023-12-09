import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

import { playerIdSchema } from "@/domain/entity/player";
import { roomIdSchema } from "@/domain/entity/room";
import { StartGameUseCase } from "@/usecase/game/start";

const startGameSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
});
const skipPhaseSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
});

@injectable()
export class GameRouter {
  constructor(@inject(StartGameUseCase) private readonly startGameUseCase: StartGameUseCase) {}

  public execute() {
    return router({
      start: publicProcedure.input(startGameSchema).mutation(async (opts) => {
        const { input } = opts;
        const { playerId, roomId } = input;

        const result = await this.startGameUseCase.execute(
          playerIdSchema.parse(playerId),
          roomIdSchema.parse(roomId),
        );

        return result.isOk();
      }),
      // skipPhase: publicProcedure.input(skipPhaseSchema).mutation(async (opts) => {
      //   const { input } = opts;
      //   const { playerId } = input;
      // }),
    });
  }
}
