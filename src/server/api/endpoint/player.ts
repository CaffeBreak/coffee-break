import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import {
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/server/domain/entity/player";
import { roomIdSchema } from "@/server/domain/entity/room";
import { UseCaseError } from "@/server/error/usecase/common";
import { RepositoryOperationError } from "@/server/error/usecase/common";
import { CreatePlayerUseCase } from "@/server/usecase/player/create";

import { publicProcedure, router } from "../trpc";

const playerObjSchema = z.object({
  id: playerIdSchema,
  name: playerNameSchema,
  role: playerRoleSchema,
  status: playerStatusSchema,
  roomId: roomIdSchema.optional(),
});
const createPlayerSchema = z.object({
  name: playerNameSchema,
});

@injectable()
export class PlayerRouter {
  constructor(@inject(CreatePlayerUseCase) private createPlayerUseCase: CreatePlayerUseCase) {}

  public execute() {
    return router({
      create: publicProcedure
        .input(createPlayerSchema)
        .mutation((opts): z.infer<typeof playerObjSchema> => {
          const { input } = opts;

          const createPlayerResult = this.createPlayerUseCase.execute(input.name);
          if (createPlayerResult.isErr()) {
            const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
              if (e instanceof RepositoryOperationError)
                return {
                  message: "Repository operation error",
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              else return { message: "Something was happend", code: "INTERNAL_SERVER_ERROR" };
            })(createPlayerResult.unwrapErr());
            throw new TRPCError(errorOpts);
          }

          const player = createPlayerResult.unwrap();

          return {
            id: player.id,
            name: player.name,
            role: player.role,
            status: player.status,
            roomId: player.roomId,
          };
        }),
    });
  }
}
