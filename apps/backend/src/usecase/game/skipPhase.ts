import { Err, Ok } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/player";
import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { OperationNotAllowedError } from "@/error/usecase/common";
import { PlayerNotFoundError } from "@/error/usecase/player";
import { PlayerNotJoinedRoomError, RoomNotFoundError } from "@/error/usecase/room";
import { ee } from "@/event";
import { voidType } from "@/misc/type";

@injectable()
export class SkipPhaseUseCase {
  constructor(
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
  ) {}

  public async execute(playerId: PlayerId) {
    // 該当のプレイヤーが存在しないならスキップはできない
    const playerResult = await this.playerRepository.findById(playerId);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // プレイヤーが部屋に参加していなければスキップは無効
    if (!player.roomId) {
      return new Err(new PlayerNotJoinedRoomError());
    }

    // 該当の部屋が存在しないならスキップはできない
    const roomResult = await this.roomRepository.findById(player.roomId);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // スキップ可能なフェーズでなければスキップできない
    if (!["DISCUSSION", "VOTING"].includes(room.phase)) {
      return new Err(new OperationNotAllowedError());
    }

    // スキップフラグを有効化する
    player.setSkipFlag();
    await this.playerRepository.save(player);
    const index = room.players.findIndex((player) => player.id === playerId);
    room.players[index] = player;

    // 部屋内のすべてのプレイヤーのスキップフラグが有効ならばスキップする
    if (room.canSkipPhase) {
      ee.emit(`skipPhase-${room.id}`);
    }

    return new Ok(voidType);
  }
}
