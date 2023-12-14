import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { CreatePostUseCase } from "../../usecase/post/createpost";
// import { chatReceiveEE } from "../stream/chat"
import { publicProcedure, router } from "../trpc";

import { roomIdSchema } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";
import { ee } from "@/event";
import { EventPort } from "@/misc/event";
import { GetPostUseCase } from "@/usecase/post/getpost";

const idSchema = z
  .string()
  .regex(/^[0-9a-z]{10}$/)
  .brand("id");

const getroomIdSchema = z.string().regex(/^[0-9a-z]{10}$/);

const playerIdSchema = idSchema.brand("playerId");

export const comessageSchema = z.object({
  type: z.literal("co"),
  cardtype: z.literal("test"),
});

export const protectmessageSchema = z.object({
  type: z.literal("protect"),
  target: z
    .string()
    .regex(/^[0-9a-z]{10}$/)
    .brand("id")
    .brand("playerId"),
});

export const messageSchema = z.union([comessageSchema, protectmessageSchema]);
const postSchema = z.object({
  playerId: z.string().regex(/^[0-9a-z]{10}$/),
  message: messageSchema,
  roomId: z.string().regex(/^[0-9a-z]{10}$/),
});

type messagetype = z.infer<typeof postSchema>;

@injectable()
export class ChatRouter {
  constructor(
    @inject(CreatePostUseCase) private createPostUseCase: CreatePostUseCase,
    @inject(GetPostUseCase) private readonly getPostUseCase: GetPostUseCase,
  ) {}

  public execute() {
    return router({
      create: publicProcedure.input(postSchema).mutation(async (opts) => {
        const { input } = opts;

        const postResilt = postSchema.safeParse(input);
        if (!postResilt.success) {
          const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
            code: "BAD_REQUEST",
            cause: postResilt.error,
          };

          throw new TRPCError(errorOpts);
        }

        const createPostResult = await this.createPostUseCase.execute(
          playerIdSchema.parse(postResilt.data.playerId),
          postResilt.data.message,
          roomIdSchema.parse(postResilt.data.roomId),
        );
        if (createPostResult.isErr()) {
          const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
            if (e instanceof RepositoryOperationError)
              return {
                message: "Repository operation error",
                code: "INTERNAL_SERVER_ERROR",
                cause: e,
              };
            else return { message: "Something was happend", code: "INTERNAL_SERVER_ERROR" };
          })(createPostResult.unwrapErr());

          throw new TRPCError(errorOpts);
        }

        const post = createPostResult.unwrap();

        const chatReceiveEE: EventPort<(message: messagetype) => void> = new EventPort(
          `chatReceive-${post.roomId}`,
          ee,
        );

        ee.emit(chatReceiveEE, {
          playerId: post.playerId,
          roomId: post.roomId,
          message: post.message,
        });

        return {
          message: post.message,
        };
      }),
      get: publicProcedure
        .input(getroomIdSchema)
        .output(z.array(postSchema))
        .mutation(async (opts) => {
          const { input } = opts;

          const roomResult = roomIdSchema.safeParse(input);
          if (!roomResult.success) {
            const errorOpts: ConstructorParameters<typeof TRPCError>[0] = {
              code: "BAD_REQUEST",
              cause: roomResult.error,
            };

            throw new TRPCError(errorOpts);
          }

          const getpostResult = await this.getPostUseCase.execute(roomResult.data);
          if (getpostResult.isErr()) {
            const errorOpts = ((e: UseCaseError): ConstructorParameters<typeof TRPCError>[0] => {
              if (e instanceof RepositoryOperationError)
                return {
                  message: "Repository operation error",
                  code: "INTERNAL_SERVER_ERROR",
                  cause: e,
                };
              else return { message: "Something was happend", code: "INTERNAL_SERVER_ERROR" };
            })(getpostResult.unwrapErr());

            throw new TRPCError(errorOpts);
          }

          const posts = getpostResult.unwrap();

          return posts;
        }),
    });
  }
}
