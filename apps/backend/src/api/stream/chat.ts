import { observable } from "@trpc/server/observable";
import { injectable } from "tsyringe";
import { z } from "zod";

import { publicProcedure, router } from "../trpc";

import { ee } from "@/event";
import { EventPort } from "@/misc/event";

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
  roomId: z
    .string()
    .regex(/^[0-9a-z]{10}$/)
    .optional(),
});

export type messagetype = z.infer<typeof postSchema>;

@injectable()
export class ChatStream {
  public execute() {
    return router({
      chatStream: publicProcedure.input(z.string().regex(/^[0-9a-z]{10}$/)).subscription((opts) => {
        const { input } = opts;

        const chatReceiveEE: EventPort<(message: messagetype) => void> = new EventPort(
          `chatReceive-${input}`,
          ee,
        );

        // this.chatEvent.execute(chatReceiveEE)

        return observable<messagetype>((emit) => {
          const onReceiveChat = (message: messagetype) => {
            emit.next(message);
          };
          chatReceiveEE.on(onReceiveChat);
          return () => {
            chatReceiveEE.off(onReceiveChat);
          };
        });
      }),
    });
  }
}
