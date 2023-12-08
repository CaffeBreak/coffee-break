import { inject, injectable } from "tsyringe";

import { ChangePhaseEventPayload, GameStream, RoomUpdateEventPayload } from "./stream/game";
import { mergeRouters } from "./trpc";

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

@injectable()
export class StreamRouter {
  constructor(@inject(GameStream) private readonly gameStream: GameStream) {}

  public execute() {
    return mergeRouters(this.gameStream.execute());
  }
}
