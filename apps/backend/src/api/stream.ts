import { inject, injectable } from "tsyringe";

import { GameStream } from "./stream/game";
import { mergeRouters } from "./trpc";

@injectable()
export class StreamRouter {
  constructor(@inject(GameStream) private readonly gameStream: GameStream) {}

  public execute() {
    return mergeRouters(this.gameStream.execute());
  }
}
