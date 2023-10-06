import "reflect-metadata";
import { container } from "tsyringe";

import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/playerRepository";
import { InMemoryRoomRepository } from "@/domain/repository/inMemory/roomRepository";
import { greet } from "@/misc/greeting";
import { startServer } from "@/server";

// show greeting
greet();

// dependency injection
container.register("PlayerRepository", InMemoryPlayerRepository);
container.register("RoomRepository", InMemoryRoomRepository);

// start server
startServer();
