import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { container } from "tsyringe";

import { AppRouter, createContext } from "./api/trpc";

const server = fastify({
  maxParamLength: 5000,
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:yyyy/mm/dd HH:MM:ss o",
        colorize: true,
        ignore: "pid,hostname,reqId,responseTime,req,res",
        messageFormat: "{msg}: [{reqId} {req.method}{res.statusCode} {req.url}] ",
      },
    },
  },
});

export const startServer = () => {
  const router = container.resolve(AppRouter).execute();

  void server.register(cors, {
    origin: "*",
  });
  // .then(
  //   () => {
  //     console.log("CORS Adapter is loaded");
  //   },
  //   (resson) => {
  //     console.error("Could not load tRPC Adapter");
  //     console.error(resson);
  //   },
  // );
  void server.register(fastifyCookie, {});

  void server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router, createContext },
  });
  // .then(
  //   () => console.log("tRPC Adapter is loaded"),
  //   (resson) => {
  //     console.error("Could not load tRPC Adapter");
  //     console.error(resson);
  //   },
  // );

  server
    .listen({ port: 5555, host: "0.0.0.0" })
    .then(() => console.log("Listening in port 5555"))
    .catch((reason) => console.error(reason));
};
