import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { ChatStream } from "./stream/chat";
import { ChangePhaseEventPayload, GameStream, RoomUpdateEventPayload } from "./stream/game";
import { mergeRouters } from "./trpc";

import { EventEmitter, EventPort } from "@/misc/event";

const idSchema = z
  .string()
  .regex(/^[0-9a-z]{10}$/)
  .brand("id");

const playerIdSchema = idSchema.brand("playerId");

const comessageSchema = z.object({
  type: z.literal("co"),
  cardtype: z.literal("test"),
});

const protectmessageSchema = z.object({
  type: z.literal("protect"),
  target: playerIdSchema,
});

const messageSchema = z.union([comessageSchema, protectmessageSchema]);

type messagetype = z.infer<typeof messageSchema>;

export const ee = new EventEmitter();
export const changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void> = new EventPort(
  "changePhase",
  ee,
);
export const roomUpdateEE: EventPort<(payload: RoomUpdateEventPayload) => void> = new EventPort(
  "roomUpdate",
  ee,
);
export const chatReceiveEE: EventPort<(message: messagetype) => void> = new EventPort(
  "chatReceive",
  ee,
);

@injectable()
export class StreamRouter {
  constructor(
    @inject(GameStream) private readonly gameStream: GameStream,
    @inject(ChatStream) private readonly chatStream: ChatStream,
  ) {}

  public execute() {
    return mergeRouters(this.gameStream.execute(), this.chatStream.execute());
  }
}
