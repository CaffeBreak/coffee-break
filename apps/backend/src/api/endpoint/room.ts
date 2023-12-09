import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { SafeParseError, z } from "zod";

import { JoinRoomUseCase } from "./../../usecase/room/join";
import { ee, roomUpdateEE } from "../stream";
import { publicProcedure, router } from "../trpc";

import { playerIdSchema } from "@/domain/entity/player";
import { roomIdSchema, roomPasswordSchema } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { CreateRoomUseCase } from "@/usecase/room/create";
import { LeaveRoomUseCase } from "@/usecase/room/leave";

export const roomObjSchema = z.object({
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
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
});

const joinRoomSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
});

const leaveRoomSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
});

@injectable()
export class RoomRouter {
  constructor(
    @inject(CreateRoomUseCase) private readonly createRoomUseCase: CreateRoomUseCase,
    @inject(JoinRoomUseCase) private readonly joinRoomUseCase: JoinRoomUseCase,
    @inject(LeaveRoomUseCase) private readonly leaveRoomUseCase: LeaveRoomUseCase,
  ) {}

  public execute() {
    return router({
      create: publicProcedure
        .input(createRoomSchema)
        .output(roomObjSchema)
        .mutation(async (opts) => {
          const { input } = opts;

          const playerIdResult = playerIdSchema.safeParse(input.playerId);
          const passwordResult = roomPasswordSchema.safeParse(input.password);
          if (!playerIdResult.success || !passwordResult.success) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: "BAD_REQUEST",
              cause: !playerIdResult.success
                ? playerIdResult.error
                : (passwordResult as SafeParseError<string>).error,
            };

            throw new TRPCError(errorOpts);
          }
          const createRoomResult = await this.createRoomUseCase.execute(
            passwordResult.data,
            playerIdResult.data,
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
      join: publicProcedure
        .input(joinRoomSchema)
        .output(roomObjSchema)
        .mutation(async (opts) => {
          const { input } = opts;

          const playerIdResult = playerIdSchema.safeParse(input.playerId);
          const roomIdResult = roomIdSchema.safeParse(input.roomId);
          const passwordResult = roomPasswordSchema.safeParse(input.password);
          if (!playerIdResult.success || !roomIdResult.success || !passwordResult.success) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: "BAD_REQUEST",
              cause: !playerIdResult.success
                ? playerIdResult.error
                : !roomIdResult.success
                  ? roomIdResult.error
                  : (passwordResult as SafeParseError<string>).error,
            };

            throw new TRPCError(errorOpts);
          }
          const joinRoomResult = await this.joinRoomUseCase.execute(
            roomIdResult.data,
            passwordResult.data,
            playerIdResult.data,
          );
          if (joinRoomResult.isErr()) {
            const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
              if (e instanceof RepositoryOperationError)
                return {
                  message: "Repository operation error",
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              else return { message: "Something was happend", code: "INTERNAL_SERVER_ERROR" };
            })(joinRoomResult.unwrapErr());

            throw new TRPCError(errorOpts);
          }

          const room = joinRoomResult.unwrap();
          const roomObj = {
            id: room.id,
            password: room.password,
            ownerId: room.ownerId,
            state: room.state,
            players: room.players,
          };

          ee.emit(roomUpdateEE, {
            eventType: "roomUpdate",
            ...roomObj,
          });

          return roomObj;
        }),
      leave: publicProcedure
        .input(leaveRoomSchema)
        .output(roomObjSchema)
        .mutation(async (opts) => {
          const { input } = opts;

          const playerIdResult = playerIdSchema.safeParse(input.playerId);
          if (!playerIdResult.success)
            throw new TRPCError({
              code: "BAD_REQUEST",
              cause: playerIdResult.error,
            });

          const leaveRoomResult = await this.leaveRoomUseCase.execute(playerIdResult.data);
          if (leaveRoomResult.isErr()) {
            const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
              if (e instanceof RepositoryOperationError)
                return {
                  message: "Repository operation error",
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              else return { message: "Something was happend", code: "INTERNAL_SERVER_ERROR" };
            })(leaveRoomResult.unwrapErr());

            throw new TRPCError(errorOpts);
          }

          const room = leaveRoomResult.unwrap();
          const roomObj = {
            id: room.id,
            password: room.password,
            ownerId: room.ownerId,
            state: room.state,
            players: room.players,
          };

          ee.emit(roomUpdateEE, {
            eventType: "roomUpdate",
            ...roomObj,
          });

          return roomObj;
        }),
    });
  }
}
