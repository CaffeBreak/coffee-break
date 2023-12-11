import { TRPCError } from "@trpc/server";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { CreatePostUseCase } from "../../usecase/post/createpost";
import { publicProcedure, router } from "../trpc";

// import { chatReceiveEE, ee } from "@/api/event";
import { roomIdSchema } from "@/domain/entity/room";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";

const idSchema = z
  .string()
  .regex(/^[0-9a-z]{10}$/)
  .brand("id");

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
  playerid: z.string().regex(/^[0-9a-z]{10}$/),
  message: messageSchema,
  roomId: z
    .string()
    .regex(/^[0-9a-z]{10}$/)
    .optional(),
});

// type messagetype = z.infer<typeof postSchema>;

@injectable()
export class ChatRouter {
  constructor(@inject(CreatePostUseCase) private createPostUseCase: CreatePostUseCase) {}

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
          playerIdSchema.parse(postResilt.data.playerid),
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

        // ee.emit(chatReceiveEE, post,{
        //   eventType: "chatReceive",
        //   roomId: post.roomId,
        // });
        // ee.emit(chatReceiveEE, post as unknown as messagetype);

        return {
          message: post.message,
        };
      }),
    });
  }
}
