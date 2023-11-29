import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

import { playerIdSchema } from "@/domain/entity/player";
import { roomPasswordSchema } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { CreateRoomUseCase } from "@/usecase/room/create";

const roomObjSchema = z.object({
  id: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
  ownerId: z.string().regex(/^[0-9a-z]{10}$/),
  state: z.union([
    z.literal("BEFORE_START"),
    z.literal("USING"),
    z.literal("DISCUSSION"),
    z.literal("VOTING"),
    z.literal("FINISHED"),
  ]),
  players: z.array(z.string().regex(/^[0-9a-z]{10}$/)),
});
const createRoomSchema = z.object({
  password: z.string().regex(/^[^\s]{1,16}$/),
  ownerId: z.string().regex(/^[0-9a-z]{10}$/),
});

@injectable()
export class RoomRouter {
  constructor(@inject(CreateRoomUseCase) private createRoomUseCase: CreateRoomUseCase) {}

  public execute() {
    return router({
      create: publicProcedure
        .input(createRoomSchema)
        .output(roomObjSchema)
        .mutation(async (opts) => {
          const { input } = opts;

          const createRoomResult = await this.createRoomUseCase.execute(
            roomPasswordSchema.parse(input.password),
            playerIdSchema.parse(input.ownerId),
          );
          if (createRoomResult.isErr()) {
            const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
              if (e instanceof RepositoryOperationError)
                return {
                  message: "Repository operation error",
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              else return { message: "Something was happend", code: "INTERNAL_SERVER_ERROR" };
            })(createRoomResult.unwrapErr());
            throw new TRPCError(errorOpts);
          }

          const room = createRoomResult.unwrap();

          return {
            id: room.id,
            password: room.password,
            ownerId: room.ownerId,
            state: room.state,
            players: room.players,
          };
        }),
    });
  }
}
