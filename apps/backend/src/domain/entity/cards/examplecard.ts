import { Card } from "../card";
import { Player } from "../player";

export class Example extends Card {
  constructor() {
    super("EXAMPLE_CARD", "これはてすとでーす", "COMMON", 0, 0);
  }

  public use(target: Player): Player {
    target.kill();

    return target;
  }
}
