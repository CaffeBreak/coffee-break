import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { SafeParseError, z } from "zod";

import { JoinRoomUseCase } from "./../../usecase/room/join";
import { publicProcedure, router } from "../trpc";

import { roomIdSchema, roomPasswordSchema } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { CreateRoomUseCase } from "@/usecase/room/create";
import { LeaveRoomUseCase } from "@/usecase/room/leave";

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
});

const joinRoomSchema = z.object({
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
  password: z.string().regex(/^[^\s]{1,16}$/),
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
          const { input, ctx } = opts;
          const { ogt } = ctx;

          const passwordResult = roomPasswordSchema.safeParse(input.password);
          if (!ogt || !passwordResult.success) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: !ogt ? "UNAUTHORIZED" : "BAD_REQUEST",
              cause: !ogt
                ? new Error("OGT is not found")
                : (passwordResult as SafeParseError<string>).error,
            };

            throw new TRPCError(errorOpts);
          }
          const createRoomResult = await this.createRoomUseCase.execute(passwordResult.data, ogt);
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
          const { input, ctx } = opts;
          const { ogt } = ctx;

          const roomIdResult = roomIdSchema.safeParse(input.roomId);
          const passwordResult = roomPasswordSchema.safeParse(input.password);
          if (!ogt || !roomIdResult.success || !passwordResult.success) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: !ogt ? "UNAUTHORIZED" : "BAD_REQUEST",
              cause: !ogt
                ? new Error("OGT is not found")
                : !roomIdResult.success
                  ? roomIdResult.error
                  : (passwordResult as SafeParseError<string>).error,
            };

            throw new TRPCError(errorOpts);
          }
          const joinRoomResult = await this.joinRoomUseCase.execute(
            roomIdResult.data,
            passwordResult.data,
            ogt,
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

          return {
            id: room.id,
            password: room.password,
            ownerId: room.ownerId,
            state: room.state,
            players: room.players,
          };
        }),
      leave: publicProcedure.output(roomObjSchema).mutation(async (opts) => {
        const { ctx } = opts;
        const { ogt } = ctx;

        if (!ogt)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            cause: new Error("OGT is not found"),
          });

        const leaveRoomResult = await this.leaveRoomUseCase.execute(ogt);
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
