import "reflect-metadata";
import { greet } from "./misc/greeting";
import { startServer } from "./server";

// show greeting
greet();

// start server
export const server = await startServer();