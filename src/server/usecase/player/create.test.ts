import { container } from "tsyringe";
import { expect, it } from "vitest";

import { playerNameSchema } from "@/server/domain/entity/player";

import { CreatePlayerUseCase } from "./create";

const createPlayerUseCase = container.resolve(CreatePlayerUseCase);

it("新しいプレイヤーを作成できる", () => {
  const result = createPlayerUseCase.execute(playerNameSchema.parse("Alice"));

  expect(result.isOk()).toBe(true);
  expect(result.unwrap().name).toBe("Alice");
});
