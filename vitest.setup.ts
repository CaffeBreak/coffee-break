import "reflect-metadata";
import { container } from "tsyringe";

import { InMemoryPlayerRepository } from "@/server/domain/repository/inMemory/player";
import { InMemoryRoomRepository } from "@/server/domain/repository/inMemory/room";

// dependency injection
container.registerSingleton("PlayerRepository", InMemoryPlayerRepository);
container.registerSingleton("RoomRepository", InMemoryRoomRepository);
