import "reflect-metadata";
import { container } from "tsyringe";

import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/playerRepository";
import { InMemoryRoomRepository } from "@/domain/repository/inMemory/roomRepository";

// dependency injection
container.register("PlayerRepository", InMemoryPlayerRepository);
container.register("RoomRepository", InMemoryRoomRepository);
