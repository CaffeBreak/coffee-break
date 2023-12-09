import { observable } from "@trpc/server/observable";
import { injectable } from "tsyringe";
import { z } from "zod";

import { chatReceiveEE } from "../stream";
import { publicProcedure, router } from "../trpc";

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
  target: playerIdSchema,
});

export const messageSchema = z.union([comessageSchema, protectmessageSchema]);

export type messagetype = z.infer<typeof messageSchema>;

@injectable()
export class ChatStream {
  public execute() {
    return router({
      chatStream: publicProcedure.subscription(() =>
        observable<messagetype>((emit) => {
          const onReceiveChat = (message: messagetype) => {
            emit.next(message);
          };
          chatReceiveEE.on(onReceiveChat);

          return () => {
            chatReceiveEE.off(onReceiveChat);
          };
        }),
      ),
    });
  }
}
