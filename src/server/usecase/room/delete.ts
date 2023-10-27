import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import { PlayerId } from "@/server/domain/entity/player";
import { RoomId } from "@/server/domain/entity/room";
import {
  OperationNotAllowedError,
  RepositoryOperationError,
  UseCaseError,
} from "@/server/error/usecase/common";
import { RoomNotFoundError } from "@/server/error/usecase/room";

import type { IPlayerRepository } from "@/server/domain/repository/interface/player";
import type { IRoomRepository } from "@/server/domain/repository/interface/room";

@injectable()
export class DeleteRoomUseCase {
  constructor(
    @inject("RoomRepository") private roomRepository: IRoomRepository,
    @inject("PlayerRepository") private playerRepository: IPlayerRepository,
  ) {}

  public execute(id: RoomId, operator: PlayerId): Result<void, UseCaseError> {
    // 該当の部屋が存在しないなら消せない
    const roomResult = this.roomRepository.findById(id);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // 削除実行者が部屋作成者でなければ部屋の削除はできない
    if (room.ownerId !== operator) {
      return new Err(new OperationNotAllowedError());
    }

    // 部屋に参加していたプレイヤーは部屋から退出する
    const playerRepoResult = room.players.map((playerId) => {
      const player = this.playerRepository.findById(playerId).unwrap();
      player.leaveRoom();

      return this.playerRepository.save(player);
    });
    const errIndex = playerRepoResult.findIndex((result) => result.isErr());
    if (errIndex !== -1) {
      return new Err(new RepositoryOperationError(playerRepoResult[errIndex].unwrapErr()));
    }

    // 部屋を削除する
    const roomRepoResult = this.roomRepository.delete(room.id);
    if (roomRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(roomRepoResult.unwrapErr()));
    }

    return new Ok(roomRepoResult.unwrap());
  }
}
