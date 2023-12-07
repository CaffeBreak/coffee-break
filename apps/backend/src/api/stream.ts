import EventEmitter from "events";

import { inject, injectable } from "tsyringe";

import { GameStream } from "./stream/game";
import { mergeRouters } from "./trpc";

export const ee = new EventEmitter();

@injectable()
export class StreamRouter {
  constructor(@inject(GameStream) private readonly gameStream: GameStream) {}

  public execute() {
    return mergeRouters(this.gameStream.execute());
  }
}
