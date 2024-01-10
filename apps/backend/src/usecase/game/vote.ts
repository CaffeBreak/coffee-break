import { Err, Ok } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPlayerRepository } from "@/domain/repository/interface/player";
import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { OperationNotAllowedError } from "@/error/usecase/common";
import { PlayerNotFoundError } from "@/error/usecase/player";
import {
  PlayerNotJoinedRoomError,
  RoomNotFoundError,
  VotingTargetNotFoundError,
} from "@/error/usecase/room";
import { ee } from "@/event";

@injectable()
export class VotingUseCase {
  constructor(
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
  ) {}
  public async execute(playerId: PlayerId, targetId: PlayerId) {
    // 該当のプレイヤーが存在しないなら投票はできない
    const playerResult = await this.playerRepository.findById(playerId);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // 死んでいるプレイヤーは投票できない
    if (player.status === "DEAD") {
      return new Err(new OperationNotAllowedError());
    }

    // 対象とするが存在しないなら投票はできない
    const targetResult = await this.playerRepository.findById(targetId);
    if (targetResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const target = targetResult.unwrap();

    // プレイヤーが部屋に参加していなければ投票は無効
    if (!player.roomId || !target.roomId) {
      return new Err(new PlayerNotJoinedRoomError());
    }

    // プレイやーと対象が同じ部屋にいなければ投票は無効
    if (player.roomId !== target.roomId) {
      return new Err(new VotingTargetNotFoundError());
    }

    // 該当の部屋が存在しないならスキップはできない
    const roomResult = await this.roomRepository.findById(player.roomId);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // スキップ可能なフェーズでなければスキップできない
    if (room.phase !== "VOTING") {
      return new Err(new OperationNotAllowedError());
    }

    // 投票する
    player.vote(targetId);
    const saveResult = await this.playerRepository.save(player);
    if (saveResult.isErr()) {
      return new Err(saveResult.unwrapErr());
    }
    const index = room.players.findIndex((player) => player.id === playerId);
    room.players[index] = player;

    // 部屋の中のプレイヤー全員が投票 or スキップしたら投票を終了する
    if (room.canSkipPhase) {
      ee.emit(`skipPhase-${room.id}`);
    }

    return new Ok(target);
  }
}
