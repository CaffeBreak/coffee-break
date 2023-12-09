import cors from "@fastify/cors";
import ws from "@fastify/websocket";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { container } from "tsyringe";

import { AppRouter } from "./api/trpc";
import { EventUseCase } from "./usecase/event/game";

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
  container.resolve(EventUseCase).execute();

  void server.register(cors, {
    origin: "*",
  });
  void server.register(ws);

  void server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    useWSS: true,
    trpcOptions: { router },
  });

  server
    .listen({ port: 5555, host: "0.0.0.0" })
    .then(() => console.log("Listening in port 5555"))
    .catch((reason) => console.error(reason));
};
