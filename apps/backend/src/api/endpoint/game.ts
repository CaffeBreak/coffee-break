import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { SafeParseError, z } from "zod";

import { publicProcedure, router } from "../trpc";

import { playerIdSchema } from "@/domain/entity/player";
import { roomIdSchema } from "@/domain/entity/room";
import {
  OperationNotAllowedError,
  RepositoryOperationError,
  UseCaseError,
} from "@/error/usecase/common";
import { PlayerNotFoundError } from "@/error/usecase/player";
import {
  NotEnoughPlayersError,
  PlayerNotJoinedRoomError,
  RoomNotFoundError,
} from "@/error/usecase/room";
import { SkipPhaseUseCase } from "@/usecase/game/skipPhase";
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
  constructor(
    @inject(StartGameUseCase) private readonly startGameUseCase: StartGameUseCase,
    @inject(SkipPhaseUseCase) private readonly skipPhaseUseCase: SkipPhaseUseCase,
  ) {}

  public execute() {
    return router({
      start: publicProcedure
        .meta({ openapi: { method: "POST", path: "/game/{roomId}" } })
        .input(startGameSchema)
        .output(z.object({}))
        .mutation(async (opts) => {
          const { input } = opts;
          const { playerId, roomId } = input;

          const playerIdResult = playerIdSchema.safeParse(playerId);
          const roomIdResult = roomIdSchema.safeParse(roomId);
          if (!playerIdResult.success || !roomIdResult.success) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: "BAD_REQUEST",
              cause: !playerIdResult.success
                ? playerIdResult.error
                : (roomIdResult as SafeParseError<string>).error,
            };

            throw new TRPCError(errorOpts);
          }

          const result = await this.startGameUseCase.execute(
            playerIdResult.data,
            roomIdResult.data,
          );
          if (result.isErr()) {
            const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
              if (e instanceof RepositoryOperationError) {
                return {
                  message: "Repository operation error",
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              } else if (
                e instanceof RoomNotFoundError ||
                e instanceof PlayerNotFoundError ||
                e instanceof OperationNotAllowedError
              ) {
                return {
                  message: e.message,
                  code: "BAD_REQUEST",
                  cause: e,
                };
              } else if (e instanceof NotEnoughPlayersError) {
                return {
                  message: e.message,
                  code: "METHOD_NOT_SUPPORTED",
                  cause: e,
                };
              } else {
                return { message: e.message, code: "INTERNAL_SERVER_ERROR", cause: e };
              }
            })(result.unwrapErr());

            throw new TRPCError(errorOpts);
          }

          return {};
        }),
      skipPhase: publicProcedure
        .meta({ openapi: { method: "POST", path: "/game/skipPhase" } })
        .input(skipPhaseSchema)
        .output(z.object({}))
        .mutation(async (opts) => {
          const { input } = opts;
          const { playerId } = input;

          const playerIdResult = playerIdSchema.safeParse(playerId);
          if (!playerIdResult.success) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: "BAD_REQUEST",
              cause: playerIdResult.error,
            };

            throw new TRPCError(errorOpts);
          }

          const result = await this.skipPhaseUseCase.execute(playerIdResult.data);
          if (result.isErr()) {
            const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
              if (e instanceof RepositoryOperationError) {
                return {
                  message: e.message,
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              } else if (
                e instanceof PlayerNotFoundError ||
                e instanceof OperationNotAllowedError ||
                e instanceof RoomNotFoundError ||
                e instanceof PlayerNotJoinedRoomError
              ) {
                return {
                  message: e.message,
                  code: "BAD_REQUEST",
                  cause: e,
                };
              } else {
                return {
                  message: "Something went wrong.",
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              }
            })(result.unwrapErr());

            throw new TRPCError(errorOpts);
          }

          return {};
        }),
    });
  }
}
