import { inject, injectable } from "tsyringe";

import { ChatStream } from "./stream/chat";
import { ChangePhaseEventPayload, GameStream, RoomUpdateEventPayload } from "./stream/game";
import { mergeRouters } from "./trpc";

import { messagetype } from "@/domain/entity/post";
import { EventEmitter, EventPort } from "@/misc/event";

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
