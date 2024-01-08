import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { ChangePhaseEventPayload, GameEvent } from "./event";

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
import { NotEnoughPlayersError, RoomNotFoundError } from "@/error/usecase/room";
import { ee } from "@/event";
import { EventPort } from "@/misc/event";
import { voidType } from "@/misc/type";

const playerUpdateEventSchema = z.object({
  eventType: z.literal("playerUpdate"),
  id: z.string().regex(/^[0-9a-z]{10}$/),
  name: z.string().regex(/^[^\s]{1,16}$/),
  role: z.union([z.literal("PENDING"), z.literal("VILLAGER"), z.literal("WEREWOLF")]),
  status: z.union([z.literal("ALIVE"), z.literal("DEAD")]),
});
type PlayerUpdateEventPayload = z.infer<typeof playerUpdateEventSchema>;

@injectable()
export class StartGameUseCase {
  constructor(
    @inject("RoomRepository") private readonly roomRepository: IRoomRepository,
    @inject("PlayerRepository") private readonly playerRepository: IPlayerRepository,
    @inject(GameEvent) private readonly gameEvent: GameEvent,
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

    // 部屋に参加してる人が7人じゃなければ開始できない
    if (room.players.length !== 7) {
      return new Err(new NotEnoughPlayersError());
    }

    // 部屋内のすべてのプレイヤーに役職を割り当てする
    const playersResult = await this.playerRepository.findByRoomId(room.id);
    if (playersResult.isErr()) {
      return new Err(new RepositoryOperationError(playersResult.unwrapErr()));
    }
    const players = playersResult.unwrap();

    // 役職を割り振る 人狼2 村人5
    const indexes = [...Array<number>(players.length)].map((_, i) => i);
    const werewolves = [
      ...indexes.splice(Math.floor(Math.random() * indexes.length), 1),
      ...indexes.splice(Math.floor(Math.random() * (indexes.length - 1))),
    ];
    players.map((player, index) => {
      player.role = index === werewolves[0] || index === werewolves[1] ? "WEREWOLF" : "VILLAGER";
    });

    const phase = room.nextPhase();
    const roomRepoResult = await this.roomRepository.save(room);
    const playerRepoResult = await this.playerRepository.saveMany(players);
    if (roomRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(roomRepoResult.unwrapErr()));
    }
    if (playerRepoResult.isErr()) {
      return new Err(new RepositoryOperationError(playerRepoResult.unwrapErr()));
    }

    // 各プレイヤーに役職を通知する
    players.map((player) => {
      const playerUpdateEE: EventPort<(payload: PlayerUpdateEventPayload) => void> = new EventPort(
        `playerUpdate-${player.id}`,
        ee,
      );

      ee.emit(playerUpdateEE, {
        eventType: "playerUpdate",
        id: player.id,
        name: player.name,
        role: player.role,
        status: player.status,
      });
    });

    // ゲームの開始を通知する
    const changePhaseEE: EventPort<(payload: ChangePhaseEventPayload) => void> = new EventPort(
      `changePhase-${room.id}`,
      ee,
    );

    void this.gameEvent.execute(changePhaseEE);
    ee.emit(changePhaseEE, {
      eventType: "changePhase",
      roomId: room.id,
      phase,
      day: room.day,
    });

    return new Ok(voidType);
  }
}
