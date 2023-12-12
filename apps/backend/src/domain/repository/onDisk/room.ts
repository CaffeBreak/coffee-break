import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { Player, PrismaClient, RoomPhase } from "@prisma/client";
import { singleton } from "tsyringe";

import { convertPlayer } from "./player";
import { IRoomRepository } from "../interface/room";

import { playerIdSchema } from "@/domain/entity/player";
import {
  Room,
  RoomId,
  RoomPassword,
  roomIdSchema,
  roomPasswordSchema,
  roomPhaseSchema,
} from "@/domain/entity/room";
import { DataNotFoundError, RepositoryError } from "@/error/repository";
import { voidType } from "@/misc/type";

const convertRoom = (prismaRoom: {
  id: string;
  password: string;
  ownerId: string;
  phase: RoomPhase;
  players: Player[];
  day: number;
}) =>
  new Room(
    roomIdSchema.parse(prismaRoom.id),
    roomPasswordSchema.parse(prismaRoom.password),
    playerIdSchema.parse(prismaRoom.ownerId),
    roomPhaseSchema.parse(prismaRoom.phase),
    prismaRoom.players.map((player) => convertPlayer(player)),
    prismaRoom.day,
  );

@singleton()
export class OnDiskRoomRepository implements IRoomRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findById(id: RoomId): Promise<Result<Room, RepositoryError>> {
    const res = await this.prismaClient.room.findUnique({
      where: {
        id: id,
      },
      include: {
        players: true,
      },
    });
    if (!res) {
      return new Err(new DataNotFoundError());
    }
    const room: Room = convertRoom(res);

    return new Ok(room);
  }
  async findByPassword(password: RoomPassword): Promise<Result<Room, RepositoryError>> {
    const res = await this.prismaClient.room.findUnique({
      where: {
        password: password,
      },
      include: {
        players: true,
      },
    });
    if (!res) {
      return new Err(new DataNotFoundError());
    }
    const room: Room = convertRoom(res);

    return new Ok(room);
  }

  async save(room: Room): Promise<Result<Room, RepositoryError>> {
    const res = await this.prismaClient.room.upsert({
      where: {
        id: room.id,
      },
      include: {
        players: true,
      },
      update: {
        phase: room.phase,
        password: room.password,
        ownerId: room.ownerId,
        day: room.day,
      },
      create: {
        id: room.id,
        phase: room.phase,
        password: room.password,
        ownerId: room.ownerId,
        day: room.day,
      },
    });
    const createRoom = convertRoom(res);

    return new Ok(createRoom);
  }
  async delete(id: RoomId): Promise<Result<void, RepositoryError>> {
    const deleted = await this.prismaClient.room
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
