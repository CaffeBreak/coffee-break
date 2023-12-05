import { Ok, Result } from "@cffnpwr/result-ts";
import { CookieSerializeOptions } from "@fastify/cookie";
import { TRPCError } from "@trpc/server";
import { container } from "tsyringe";
import { describe, expect, it, vi } from "vitest";

import { AppRouter } from "../trpc";

import { Player, PlayerName, playerRoleSchema, playerStatusSchema } from "@/domain/entity/player";
import { UseCaseError } from "@/error/usecase/common";
import { genId } from "@/misc/id";
import { CreatePlayerUseCase } from "@/usecase/player/create";

class MockedCreatePlayerUseCase extends CreatePlayerUseCase {
  public async execute(name: PlayerName): Promise<Result<Player, UseCaseError>> {
    return new Promise((resolve) =>
      resolve(
        new Ok(
          new Player(
            genId(),
            name,
            playerRoleSchema.parse("PENDING"),
            playerStatusSchema.parse("ALIVE"),
            undefined,
          ),
        ),
      ),
    );
  }
}

describe("player API", () => {
  container.register(CreatePlayerUseCase, MockedCreatePlayerUseCase);

  const fakeSetCookie = vi.fn((name: string, value: string) => ({ name, value }));
  const router = container.resolve(AppRouter).execute();
  const caller = router.createCaller({
    ogt: undefined,
    // これはモックなので許容
    // eslint-disable-next-line @typescript-eslint/require-await
    setCookie: async (name: string, value: string, _options?: CookieSerializeOptions) => {
      fakeSetCookie(name, value);
    },
  });

  describe("create", () => {
    it("新しいプレイヤーを作れる", async () => {
      const name = "cffnpwr";

      const created = await caller.player.create({
        name: name,
      });

      expect(created.name).toBe(name);
      expect(fakeSetCookie).toHaveBeenCalledOnce();
      expect(fakeSetCookie).toHaveReturnedWith({
        name: "ogt",
        value: created.id,
      });
    });

    it("空白以外の1~16文字でない名前ではBad Requestで弾かれる", async () => {
      const name = "12345678901234567890";

      const error = await caller.player
        .create({
          name,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });

    it("名前に空白を入れるとBad Requestで弾かれる", async () => {
      const name = "aaa bbb";

      const error = await caller.player
        .create({
          name,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });
  });
});
