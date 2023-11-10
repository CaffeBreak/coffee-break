import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { CreatePlayerUseCase } from "./../../usecase/player/create";
import { publicProcedure, router } from "../trpc";

import { UseCaseError } from "@/error/usecase/common";
import { RepositoryOperationError } from "@/error/usecase/common";

const playerObjSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")]),
  status: z.union([z.literal("ALIVE"), z.literal("DEAD")]),
  roomId: z.string().optional(),
});
const createPlayerSchema = z.object({
  name: z
    .string()
    .regex(/^[^\s]{1,16}$/)
    .brand("playerName"),
});

@injectable()
export class PlayerRouter {
  constructor(@inject(CreatePlayerUseCase) private createPlayerUseCase: CreatePlayerUseCase) {}

  public execute() {
    return router({
      create: publicProcedure
        .input(createPlayerSchema)
        .output(playerObjSchema)
        .mutation((opts) => {
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
