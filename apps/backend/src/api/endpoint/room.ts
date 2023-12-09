import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { SafeParseError, z } from "zod";

import { JoinRoomUseCase } from "./../../usecase/room/join";
import { roomUpdateEE } from "../stream/game";
import { publicProcedure, router } from "../trpc";

import { playerIdSchema } from "@/domain/entity/player";
import { roomIdSchema, roomPasswordSchema } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { ee } from "@/event/common";
import { CreateRoomUseCase } from "@/usecase/room/create";
import { DeleteRoomUseCase } from "@/usecase/room/delete";
import { LeaveRoomUseCase } from "@/usecase/room/leave";

export const roomObjSchema = z.object({
  id: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
  ownerId: z.string().regex(/^[0-9a-z]{10}$/),
  phase: z.union([
    z.literal("EXPULSION"),
    z.literal("KILLED"),
    z.literal("BEFORE_START"),
    z.literal("USING"),
    z.literal("DISCUSSION"),
    z.literal("VOTING"),
    z.literal("FINISHED"),
  ]),
  players: z.array(
    z.object({
      id: z.string().regex(/^[0-9a-z]{10}$/),
      name: z.string().regex(/^[^\s]{1,16}$/),
      role: z.union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")]),
      status: z.union([z.literal("ALIVE"), z.literal("DEAD")]),
    }),
  ),
  day: z.number().int().nonnegative(),
});
const createRoomSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
});

const joinRoomSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
});

const leaveRoomSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
});

const deleteRoomSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
});

@injectable()
export class RoomRouter {
  constructor(
    @inject(CreateRoomUseCase) private readonly createRoomUseCase: CreateRoomUseCase,
    @inject(JoinRoomUseCase) private readonly joinRoomUseCase: JoinRoomUseCase,
    @inject(LeaveRoomUseCase) private readonly leaveRoomUseCase: LeaveRoomUseCase,
    @inject(DeleteRoomUseCase) private readonly deleteRoomUseCase: DeleteRoomUseCase,
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
            phase: room.phase,
            players: room.players.map((player) => ({
              id: player.id,
              name: player.name,
              role: player.role,
              status: player.status,
              roomId: player.roomId,
            })),
            day: room.day,
          };
        }),
      delete: publicProcedure.input(deleteRoomSchema).mutation(async (opts) => {
        const { input } = opts;

        const playerIdResult = playerIdSchema.safeParse(input.playerId);
        const roomIdResult = roomIdSchema.safeParse(input.roomId);
        if (!playerIdResult.success || !roomIdResult.success) {
          const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
            code: "BAD_REQUEST",
            cause: !playerIdResult.success
              ? playerIdResult.error
              : (roomIdResult as SafeParseError<string>).error,
          };

          throw new TRPCError(errorOpts);
        }

        const deleteRoomResult = await this.deleteRoomUseCase.execute(
          roomIdResult.data,
          playerIdResult.data,
        );

        if (deleteRoomResult.isErr()) {
          const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
            if (e instanceof RepositoryOperationError)
              return {
                message: "Repository operation error",
                code: "INTERNAL_SERVER_ERROR",
                cause: e,
              };
            else return { message: "Something was happend", code: "INTERNAL_SERVER_ERROR" };
          })(deleteRoomResult.unwrapErr());

          throw new TRPCError(errorOpts);
        }

        return;
      }),
      join: publicProcedure
        .input(joinRoomSchema)
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
          const joinRoomResult = await this.joinRoomUseCase.execute(
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
            phase: room.phase,
            players: room.players.map((player) => ({
              id: player.id,
              name: player.name,
              role: player.role,
              status: player.status,
              roomId: player.roomId,
            })),
            day: room.day,
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
            phase: room.phase,
            players: room.players.map((player) => ({
              id: player.id,
              name: player.name,
              role: player.role,
              status: player.status,
              roomId: player.roomId,
            })),
            day: room.day,
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
