import { container } from "tsyringe";
import { expect, it } from "vitest";

import { CreatePlayerUseCase } from "./create";

import { playerNameSchema } from "@/domain/entity/player";

const createPlayerUseCase = container.resolve(CreatePlayerUseCase);

it("新しいプレイヤーを作成できる", async () => {
  const result = await createPlayerUseCase.execute(playerNameSchema.parse("Alice"));

  expect(result.isOk()).toBe(true);
  expect(result.unwrap().name).toBe("Alice");
});
