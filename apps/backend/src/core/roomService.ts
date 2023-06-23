import { Injectable } from "@nestjs/common";
import { Prisma, Room } from "@prisma/client";

import { PrismaService } from "./prismaService";

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRoom(data: Prisma.RoomCreateInput): Promise<Room> {
    return this.prismaService.room.create({
      data,
    });
  }

  async joinRoom(
    player: { id: string; name: string },
    where: Prisma.RoomWhereUniqueInput,
  ): Promise<Room> {
    return this.prismaService.room.update({
      where,
      data: {
        players: {
          connectOrCreate: {
            where: {
              id: player.id,
            },
            create: {
              id: player.id,
              name: player.name,
            },
          },
        },
      },
    });
  }
}
