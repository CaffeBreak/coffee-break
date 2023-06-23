import { Module } from "@nestjs/common";

import { LoggerService } from "./loggerService";
import { PrismaService } from "./prismaService";
import { RoomService } from "./roomService";

@Module({
  providers: [LoggerService, PrismaService, RoomService],
  exports: [LoggerService, PrismaService, RoomService],
})
export class CoreModule {}
