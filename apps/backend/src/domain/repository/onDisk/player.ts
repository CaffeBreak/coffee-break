import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { PlayerRole, PrismaClient } from "@prisma/client";
import { singleton } from "tsyringe";

import { IPlayerRepository } from "./../interface/player";

import {
  Player,
  PlayerId,
  playerIdSchema,
  playerNameSchema,
  playerRoleSchema,
  playerStatusSchema,
} from "@/domain/entity/player";
import { RoomId, roomIdSchema } from "@/domain/entity/room";
import { DataNotFoundError, DataSaveError, RepositoryError } from "@/error/repository";
import { OkOrErr } from "@/misc/result";
import { voidType } from "@/misc/type";

export const convertPlayer = (prismaPlayer: {
  id: string;
  name: string;
  isDead: boolean;
  joinedRoomId: string | null;
  role: PlayerRole;
  skipFlag: boolean;
  voteTargetId: string | null;
  votedPlayers: {
    id: string;
    name: string;
    isDead: boolean;
    joinedRoomId: string | null;
    role: PlayerRole;
    skipFlag: boolean;
    voteTargetId: string | null;
  }[];
}) =>
  new Player(
    playerIdSchema.parse(prismaPlayer.id),
    playerNameSchema.parse(prismaPlayer.name),
    playerRoleSchema.parse(prismaPlayer.role),
    playerStatusSchema.parse(prismaPlayer.isDead ? "DEAD" : "ALIVE"),
    prismaPlayer.skipFlag,
    prismaPlayer.votedPlayers.map(
      (player) =>
        new Player(
          playerIdSchema.parse(player.id),
          playerNameSchema.parse(player.name),
          playerRoleSchema.parse(player.role),
          playerStatusSchema.parse(player.isDead ? "DEAD" : "ALIVE"),
          player.skipFlag,
          [],
          prismaPlayer.joinedRoomId ? roomIdSchema.parse(prismaPlayer.joinedRoomId) : undefined,
          player.voteTargetId ? playerIdSchema.parse(player.voteTargetId) : undefined,
        ),
    ),
    prismaPlayer.joinedRoomId ? roomIdSchema.parse(prismaPlayer.joinedRoomId) : undefined,
    prismaPlayer.voteTargetId ? playerIdSchema.parse(prismaPlayer.voteTargetId) : undefined,
  );

@singleton()
export class OnDiskPlayerRepository implements IPlayerRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findById(id: PlayerId): Promise<Result<Player, RepositoryError>> {
    const res = await this.prismaClient.player.findUnique({
      where: {
        id: id,
      },
      include: {
        votedPlayers: true,
      },
    });
    if (!res) {
      return new Err(new DataNotFoundError());
    }

    const player = convertPlayer(res);

    return new Ok(player);
  }

  async findByRoomId(roomId: RoomId): Promise<Result<Player[], RepositoryError>> {
    const res = await this.prismaClient.player.findMany({
      where: {
        joinedRoomId: roomId,
      },
      include: {
        votedPlayers: true,
      },
    });
    if (!res) {
      return new Err(new DataNotFoundError());
    }

    const players: Player[] = res.map((player) => convertPlayer(player));
    return OkOrErr(players, new DataNotFoundError());
  }

  async save(player: Player): Promise<Result<Player, RepositoryError>> {
    //2択をToFに変換するアロー関数ぶっちゃけキモい
    //明日くらいに直しておく
    const checkDead = (isD: "ALIVE" | "DEAD") => isD !== "ALIVE";
    const res = await this.prismaClient.player.upsert({
      where: {
        // ここはidが必須
        id: player.id,
      },

      update: {
        name: player.name,
        isDead: checkDead(player.status),
        joinedRoomId: player.roomId,
        role: player.role,
        skipFlag: player.skipFlag,
        voteTargetId: player.voteTarget,
      },
      create: {
        id: player.id,
        name: player.name,
      },
    });
    //型変換して保存したplayerを返す
    const returnplayer: Player = convertPlayer({
      votedPlayers: [],
      ...res,
    });
    return new Ok(returnplayer);
  }

  async saveMany(players: Player[]): Promise<Result<Player[], RepositoryError>> {
    const checkDead = (isD: "ALIVE" | "DEAD") => isD !== "ALIVE";
    const query = players.map((player) =>
      this.prismaClient.player.upsert({
        where: {
          id: player.id,
        },

        update: {
          name: player.name,
          isDead: checkDead(player.status),
          joinedRoomId: player.roomId,
          role: player.role,
          skipFlag: player.skipFlag,
          voteTargetId: player.voteTarget,
        },
        create: {
          id: player.id,
          name: player.name,
        },
      }),
    );

    const result = await this.prismaClient
      .$transaction(query)
      .then(
        (result) =>
          new Ok(
            result.map((r) =>
              convertPlayer({
                votedPlayers: [],
                ...r,
              }),
            ),
          ),
      )
      .catch((error: Error) => new Err(new DataSaveError(error)));

    return result;
  }

  async delete(id: PlayerId): Promise<Result<void, RepositoryError>> {
    const deleted = await this.prismaClient.player
      .delete({
        where: {
          id: id,
        },
      })
      .catch(() => null);
    if (!deleted) {
      return new Err(new DataNotFoundError());
    }

    return new Ok(voidType);
  }
}
