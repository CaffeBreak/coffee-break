import "reflect-metadata";
import { container } from "tsyringe";

import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/player";
import { InMemoryRoomRepository } from "@/domain/repository/inMemory/room";
import { greet } from "@/misc/greeting";
import { startServer } from "@/server";

// show greeting
greet();

// dependency injection
container.registerSingleton("PlayerRepository", InMemoryPlayerRepository);
container.registerSingleton("RoomRepository", InMemoryRoomRepository);

// start server
startServer();
