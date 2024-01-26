import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

import { roomIdSchema } from "@/domain/entity/room";
import { GetRoomUseCase } from "@/usecase/room/get";

const joinNPCSchema = z.object({
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
  number: z.number().int().positive(),
});

@injectable()
export class NPCRouter {
  constructor(@inject(GetRoomUseCase) private readonly getRoomUseCase: GetRoomUseCase) {}

  public execute() {
    return router({
      join: publicProcedure
        .input(joinNPCSchema)
        .output(z.object({}))
        .mutation(async (opts) => {
          const { input } = opts;
          const { roomId, number } = input;

          const roomIdResult = roomIdSchema.safeParse(roomId);
          if (!roomIdResult.success) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: "BAD_REQUEST",
              cause: roomIdResult.error,
            };
            throw new TRPCError(errorOpts);
          }

          const roomResult = await this.getRoomUseCase.execute(roomIdResult.data);
          if (roomResult.isErr()) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: "BAD_REQUEST",
              cause: roomResult.unwrapErr(),
            };
            throw new TRPCError(errorOpts);
          }

          const room = roomResult.unwrap();

          const res = await fetch(`http://npc:6000/createnpc/${room.password}/${number}`);
          if (!res.ok) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: "INTERNAL_SERVER_ERROR",
            };
            throw new TRPCError(errorOpts);
          }

          return {};
        }),
    });
  }
}
