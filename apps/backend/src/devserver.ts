import "reflect-metadata";
import { container } from "tsyringe";

import { InMemoryPostRepository } from "./domain/repository/inMemory/post";

import { InMemoryPlayerRepository } from "@/domain/repository/inMemory/player";
import { InMemoryRoomRepository } from "@/domain/repository/inMemory/room";
import { greet } from "@/misc/greeting";
import { startServer } from "@/server";

// show greeting
greet();

// dependency injection
container.registerSingleton("PlayerRepository", InMemoryPlayerRepository);
container.registerSingleton("RoomRepository", InMemoryRoomRepository);
container.registerSingleton("PostRepository", InMemoryPostRepository);

// start server
startServer();
