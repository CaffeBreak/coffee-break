import { observable } from "@trpc/server/observable";
import { injectable } from "tsyringe";
import { z } from "zod";

import { chatReceiveEE } from "../stream";
import { publicProcedure, router } from "../trpc";

export const comessageSchema = z.object({
  type: z.literal("co"),
  cardtype: z.literal("test"),
});

type messagetype = z.infer<typeof comessageSchema>;

// const chatSchema = z.;

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
