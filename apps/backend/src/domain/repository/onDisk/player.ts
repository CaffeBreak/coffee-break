import { Err, Ok, Result } from "@cffnpwr/ts-results";
import { PlayerState, PrismaClient } from "@prisma/client";
import { singleton } from "tsyringe";

import { IPlayerRepository } from "./../interface/playerRepository";

import {
  Player,
  PlayerId,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/domain/entity/player";
import { RoomId, roomIdSchema } from "@/domain/entity/room";
import { DataNotFoundError, RepositoryError } from "@/error/repository";
import { PlayerNotFoundError } from "@/error/usecase/player";
import { OkOrErr } from "@/misc/result";
import { voidType } from "@/misc/type";

const prisma = new PrismaClient();

const convertPlayer = (prismaPlayer: {
  id: string;
  name: string;
  isDead: boolean;
  joinedRoomId: string | null;
  role: PlayerState;
}) =>
  new Player(
    playerIdSchema.parse(prismaPlayer.id),
    playerNameSchema.parse(prismaPlayer.name),
    playerRoleSchema.parse(prismaPlayer.role),
    playerStatusSchema.parse(prismaPlayer.isDead ? "DEAD" : "ALIVE"),
    roomIdSchema.parse(prismaPlayer.joinedRoomId),
  );

@singleton()
export class InMemoryPlayerRepository implements IPlayerRepository {
  async findById(id: PlayerId): Promise<Result<Player, RepositoryError>> {
    const res = await prisma.player.findUnique({
      where: {
        id: id,
      },
    });
    if (!res) {
      return Err(new PlayerNotFoundError());
    }

    const player = convertPlayer(res);

    return Ok(player);
  }
  async findByRoomId(roomId: RoomId): Promise<Result<Player[], RepositoryError>> {
    const res = await prisma.player.findMany({
      where: {
        joinedRoomId: roomId,
      },
    });
    if (!res) {
      return Err(new PlayerNotFoundError());
    }

    const players: Player[] = res.map((player) => convertPlayer(player));
    return OkOrErr(players, new DataNotFoundError());
  }

  async save(player: Player): Promise<Result<Player, RepositoryError>> {
    //2択をToFに変換するアロー関数ぶっちゃけキモい
    //明日くらいに直しておく
    const checkDead = (isD: "ALIVE" | "DEAD") => isD !== "ALIVE";
    const res = await prisma.player.upsert({
      where: {
        // ここはidが必須
        id: player.id,
      },

      update: {
        name: player.name,
        isDead: checkDead(player.status),
        joinedRoomId: player.roomId,
        role: player.role,
      },
      create: {
        id: player.id,
        name: player.name,
        isDead: checkDead(player.status),
        role: "PENDING",
      },
    });
    //型変換して保存したplayerを返す
    const returnplayer: Player = convertPlayer(res);
    return Ok(returnplayer);
  }

  async delete(id: PlayerId): Promise<Result<void, RepositoryError>> {
    void (await prisma.player.delete({
      where: {
        id: id,
      },
    }));

    return Ok(voidType);
  }
}
