import { Err, Ok, Result } from "@cffnpwr/ts-results";
import { Player, PrismaClient, RoomState } from "@prisma/client";
import { singleton } from "tsyringe";

import { IRoomRepository } from "../interface/roomRepository";

import { playerIdSchema } from "@/domain/entity/player";
import {
  Room,
  RoomId,
  RoomPassword,
  roomIdSchema,
  roomPasswordSchema,
  roomStateSchema,
} from "@/domain/entity/room";
import { RepositoryError } from "@/error/repository";
import { RoomNotFoundError } from "@/error/usecase/room";
import { voidType } from "@/misc/type";

const prisma = new PrismaClient();

const convertRoom = (prismaRoom: {
  id: string;
  password: string;
  ownerId: string;
  state: RoomState;
  players: Player[];
}) =>
  new Room(
    roomIdSchema.parse(prismaRoom.id),
    roomPasswordSchema.parse(prismaRoom.password),
    playerIdSchema.parse(prismaRoom.ownerId),
    roomStateSchema.parse(prismaRoom.state),
    prismaRoom.players.map((player) => playerIdSchema.parse(player.id)),
  );

@singleton()
export class InMemoryRoomRepository implements IRoomRepository {
  async findById(id: RoomId): Promise<Result<Room, RepositoryError>> {
    const res = await prisma.room.findUnique({
      where: {
        id: id,
      },
      include: {
        players: true,
      },
    });
    if (!res) {
      return Err(new RoomNotFoundError());
    }
    const room: Room = convertRoom(res);

    return Ok(room);
  }
  async findByPassword(password: RoomPassword): Promise<Result<Room, RepositoryError>> {
    const res = await prisma.room.findUnique({
      where: {
        password: password,
      },
      include: {
        players: true,
      },
    });
    if (!res) {
      return Err(new RoomNotFoundError());
    }
    const room: Room = convertRoom(res);

    return Ok(room);
  }

  async save(room: Room): Promise<Result<Room, RepositoryError>> {
    const res = await prisma.room.upsert({
      where: {
        id: room.id,
      },
      include: {
        players: true,
      },
      update: {
        state: room.state,
        password: room.password,
        ownerId: room.ownerId,
      },
      create: {
        id: room.id,
        state: room.state,
        password: room.password,
        ownerId: room.ownerId,
      },
    });
    const createRoom = convertRoom(res);

    return Ok(createRoom);
  }
  async delete(id: RoomId): Promise<Result<void, RepositoryError>> {
    void (await prisma.player.delete({
      where: {
        id: id,
      },
    }));

    return Ok(voidType);
  }
}
