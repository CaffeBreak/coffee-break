import EventEmitter from "events";

import { inject, injectable } from "tsyringe";

import { ChatStream } from "./stream/chat";
import { GameStream } from "./stream/game";
import { mergeRouters } from "./trpc";

export const ee = new EventEmitter();

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
