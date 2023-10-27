import { container } from "tsyringe";

import { env } from "@/env";

import { InMemoryPlayerRepository } from "./domain/repository/inMemory/player";
import { InMemoryRoomRepository } from "./domain/repository/inMemory/room";

if (env.NODE_ENV !== "production") {
  // dependency injection
  container.registerSingleton("PlayerRepository", InMemoryPlayerRepository);
  container.registerSingleton("RoomRepository", InMemoryRoomRepository);
}

export { container };
