import { Ok, Result } from "@cffnpwr/result-ts";
import { CookieSerializeOptions } from "@fastify/cookie";
import { TRPCError } from "@trpc/server";
import { container } from "tsyringe";
import { describe, expect, it, vi } from "vitest";

import { AppRouter } from "../trpc";

import { PlayerId, playerIdSchema } from "@/domain/entity/player";
import {
  Room,
  RoomId,
  RoomPassword,
  roomPasswordSchema,
  roomStateSchema,
} from "@/domain/entity/room";
import { UseCaseError } from "@/error/usecase/common";
import { genId } from "@/misc/id";
import { CreateRoomUseCase } from "@/usecase/room/create";
import { JoinRoomUseCase } from "@/usecase/room/join";
import { LeaveRoomUseCase } from "@/usecase/room/leave";

class MockedCreateRoomUseCase extends CreateRoomUseCase {
  public execute(password: RoomPassword, ownerId: PlayerId): Promise<Result<Room, UseCaseError>> {
    return new Promise((resolve) =>
      resolve(
        new Ok(
          new Room(genId(), password, ownerId, roomStateSchema.parse("BEFORE_START"), [ownerId]),
        ),
      ),
    );
  }
}

class MockedJoinRoomUseCase extends JoinRoomUseCase {
  public execute(
    roomId: RoomId,
    password: RoomPassword,
    playerId: PlayerId,
  ): Promise<Result<Room, UseCaseError>> {
    const ownerId: PlayerId = genId();

    return new Promise((resolve) =>
      resolve(
        new Ok(
          new Room(roomId, password, ownerId, roomStateSchema.parse("BEFORE_START"), [
            ownerId,
            playerId,
          ]),
        ),
      ),
    );
  }
}

class MockedLeaveRoomuseCase extends LeaveRoomUseCase {
  public execute(_: PlayerId): Promise<Result<Room, UseCaseError>> {
    const roomId: RoomId = genId();
    const ownerId: PlayerId = genId();

    return new Promise((resolve) =>
      resolve(
        new Ok(
          new Room(
            roomId,
            roomPasswordSchema.parse("password"),
            ownerId,
            roomStateSchema.parse("BEFORE_START"),
            [ownerId],
          ),
        ),
      ),
    );
  }
}

const fakeSetCookie = vi.fn((name: string, value: string) => ({ name, value }));

describe("room API", () => {
  container.register(CreateRoomUseCase, MockedCreateRoomUseCase);
  container.register(JoinRoomUseCase, MockedJoinRoomUseCase);
  container.register(LeaveRoomUseCase, MockedLeaveRoomuseCase);

  const router = container.resolve(AppRouter).execute();
  const caller = router.createCaller({
    ogt: undefined,
    // これはモックなので許容
    // eslint-disable-next-line @typescript-eslint/require-await
    setCookie: async (name: string, value: string, _options?: CookieSerializeOptions) => {
      fakeSetCookie(name, value);
    },
  });
  const callerWithOGT = router.createCaller({
    ogt: playerIdSchema.parse(genId()),
    // これはモックなので許容
    // eslint-disable-next-line @typescript-eslint/require-await
    setCookie: async (name: string, value: string, _options?: CookieSerializeOptions) => {
      fakeSetCookie(name, value);
    },
  });

  describe("create", () => {
    it("OGTを持っていなければ部屋は作れず、UNAUTHORIZEDを返す", async () => {
      const password = "hogehoge";

      const error = await caller.room
        .create({
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("UNAUTHORIZED");
    });

    it("部屋を作れる", async () => {
      const password = "hogehoge";

      const created = await callerWithOGT.room.create({
        password,
      });

      expect(created.password).toBe(password);
    });

    it("空白以外の1~16文字でない合言葉ではBad Requestで弾かれる", async () => {
      const password = "12345678901234567890";

      const error = await callerWithOGT.room
        .create({
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });

    it("合言葉に空白を入れるとBad Requestで弾かれる", async () => {
      const password = "aaa bbb";

      const error = await callerWithOGT.room
        .create({
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });
  });

  describe("join", () => {
    it("OGTを持っていなければ部屋に参加できず、UNAUTHORIZEDを返す", async () => {
      const error = await caller.room
        .join({
          roomId: genId(),
          password: "asdfghjkl",
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("UNAUTHORIZED");
    });

    it("部屋に参加できる", async () => {
      const roomId = genId();

      const joined = await callerWithOGT.room.join({
        roomId,
        password: "hogehoge",
      });

      expect(joined.id).toBe(roomId);
    });

    it("空白以外の1~16文字でない合言葉ではBad Requestで弾かれる", async () => {
      const password = "12345678901234567890";

      const error = await callerWithOGT.room
        .join({
          roomId: genId(),
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });

    it("合言葉に空白を入れるとBad Requestで弾かれる", async () => {
      const password = "aaa bbb";

      const error = await callerWithOGT.room
        .join({
          roomId: genId(),
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });

    it("IDとして正しくない形式はBad Requestで弾かれる", async () => {
      const error = await callerWithOGT.room
        .join({
          roomId: "hogehoge",
          password: "aaaaa",
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });
  });

  describe("leave", () => {
    it("OGTを持っていなければ部屋から退出できず、UNAUTHORIZEDを返す", async () => {
      const error = await caller.room.leave().catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("UNAUTHORIZED");
    });

    it("部屋から退出できる", async () => {
      const leaved = await callerWithOGT.room.leave();

      expect(leaved).not.toBeInstanceOf(Error);
    });
  });
});
