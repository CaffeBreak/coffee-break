import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import { ChangePhaseEventPayload } from "./event";

import type { IPlayerRepository } from "@/domain/repository/interface/player";
import type { IRoomRepository } from "@/domain/repository/interface/room";

import { PlayerId } from "@/domain/entity/player";
import { RoomId } from "@/domain/entity/room";
import {
  OperationNotAllowedError,
  RepositoryOperationError,
  UseCaseError,
} from "@/error/usecase/common";
import { PlayerNotFoundError } from "@/error/usecase/player";
import { RoomNotFoundError } from "@/error/usecase/room";
import { ee } from "@/event";
import { EventPort } from "@/misc/event";
import { voidType } from "@/misc/type";

@injectable()
export class StartGameUseCase {
  constructor(
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
  ) {}

  public async execute(operator: PlayerId, roomId: RoomId): Promise<Result<void, UseCaseError>> {
    // 該当の部屋が存在しないならゲームの開始はできない
    const roomResult = await this.roomRepository.findById(roomId);
    if (roomResult.isErr()) {
      return new Err(new RoomNotFoundError());
    }
    const room = roomResult.unwrap();

    // 該当のプレイヤーが存在しないならゲームの開始はできない
    const playerResult = await this.playerRepository.findById(operator);
    if (playerResult.isErr()) {
      return new Err(new PlayerNotFoundError());
    }
    const player = playerResult.unwrap();

    // 実行者が部屋作成者でなければゲームの開始はできない
    if (room.ownerId !== player.id) {
      return new Err(new OperationNotAllowedError());
    }

    const phase = room.nextPhase();
    const roomRepoResult = await this.roomRepository.save(room);
    if (roomRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(roomRepoResult.unwrapErr()));
    }

    const changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void> = new EventPort(
      `changePhase-${room.id}`,
      ee,
    );

    ee.emit(changePhaseEE, {
      eventType: "changePhase",
      roomId: room.id,
      phase,
      day: room.day,
    });

    return new Ok(voidType);
  }
}
