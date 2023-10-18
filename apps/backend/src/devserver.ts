import "reflect-metadata";
import { container } from "tsyringe";

import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/player";
import { InMemoryRoomRepository } from "@/domain/repository/inMemory/room";
import { greet } from "@/misc/greeting";
import { startServer } from "@/server";

// show greeting
greet();

// dependency injection
container.register("PlayerRepository", InMemoryPlayerRepository);
container.register("RoomRepository", InMemoryRoomRepository);

// start server
export const server = await startServer();
