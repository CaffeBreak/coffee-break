import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { CreatePlayerUseCase } from "./../../usecase/player/create";
import { publicProcedure, router } from "../trpc";

import { playerNameSchema } from "@/domain/entity/player";
import { UseCaseError } from "@/error/usecase/common";
import { RepositoryOperationError } from "@/error/usecase/common";

const playerObjSchema = z.object({
  id: z.string().regex(/^[0-9a-z]{10}$/),
  name: z.string().regex(/^[^\s]{1,16}$/),
  role: z.union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")]),
  status: z.union([z.literal("ALIVE"), z.literal("DEAD")]),
  roomId: z
    .string()
    .regex(/^[0-9a-z]{10}$/)
    .optional(),
});
const createPlayerSchema = z.object({
  name: z.string().regex(/^[^\s]{1,16}$/),
});

@injectable()
export class PlayerRouter {
  constructor(@inject(CreatePlayerUseCase) private createPlayerUseCase: CreatePlayerUseCase) {}

  public execute() {
    return router({
      create: publicProcedure
        .input(createPlayerSchema)
        .output(playerObjSchema)
        .mutation(async (opts) => {
          const { input } = opts;

          const createPlayerResult = this.createPlayerUseCase.execute(
            playerNameSchema.parse(input.name),
          );
          if ((await createPlayerResult).isErr()) {
            const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
              if (e instanceof RepositoryOperationError)
                return {
                  message: "Repository operation error",
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              else return { message: "Something was happend", code: "INTERNAL_SERVER_ERROR" };
            })((await createPlayerResult).unwrapErr());
            throw new TRPCError(errorOpts);
          }

          const player = (await createPlayerResult).unwrap();

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
