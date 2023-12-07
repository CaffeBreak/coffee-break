import { Ok, Result } from "@cffnpwr/result-ts";
import { TRPCError } from "@trpc/server";
import { container } from "tsyringe";
import { describe, expect, it } from "vitest";

import { AppRouter } from "../trpc";

import { PlayerId } from "@/domain/entity/player";
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

describe("room API", () => {
  container.register(CreateRoomUseCase, MockedCreateRoomUseCase);
  container.register(JoinRoomUseCase, MockedJoinRoomUseCase);
  container.register(LeaveRoomUseCase, MockedLeaveRoomuseCase);

  const router = container.resolve(AppRouter).execute();
  const caller = router.createCaller({});

  describe("create", () => {
    it("部屋を作れる", async () => {
      const playerId = genId();
      const password = "hogehoge";

      const created = await caller.room.create({
        playerId,
        password,
      });

      expect(created.ownerId).toBe(playerId);
      expect(created.password).toBe(password);
    });

    it("空白以外の1~16文字でない合言葉ではBad Requestで弾かれる", async () => {
      const playerId = genId();
      const password = "12345678901234567890";

      const error = await caller.room
        .create({
          playerId,
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });

    it("合言葉に空白を入れるとBad Requestで弾かれる", async () => {
      const playerId = genId();
      const password = "aaa bbb";

      const error = await caller.room
        .create({
          playerId,
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });
  });

  describe("join", () => {
    it("部屋に参加できる", async () => {
      const playerId = genId();
      const roomId = genId();

      const joined = await caller.room.join({
        playerId,
        roomId,
        password: "hogehoge",
      });

      expect(joined.id).toBe(roomId);
    });

    it("空白以外の1~16文字でない合言葉ではBad Requestで弾かれる", async () => {
      const playerId = genId();
      const password = "12345678901234567890";

      const error = await caller.room
        .join({
          playerId,
          roomId: genId(),
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });

    it("合言葉に空白を入れるとBad Requestで弾かれる", async () => {
      const playerId = genId();
      const password = "aaa bbb";

      const error = await caller.room
        .join({
          playerId,
          roomId: genId(),
          password,
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });

    it("IDとして正しくない形式はBad Requestで弾かれる", async () => {
      const playerId = genId();

      const error = await caller.room
        .join({
          playerId,
          roomId: "hogehoge",
          password: "aaaaa",
        })
        .catch((error) => error as Error);

      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("BAD_REQUEST");
    });
  });

  describe("leave", () => {
    it("部屋から退出できる", async () => {
      const playerId = genId();

      const leaved = await caller.room.leave({ playerId });

      expect(leaved).not.toBeInstanceOf(Error);
    });
  });
});
