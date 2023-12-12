import cors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import ws from "@fastify/websocket";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { fastifyTRPCOpenApiPlugin, generateOpenApiDocument } from "trpc-openapi";
import { container } from "tsyringe";

import { AppRouter } from "./api/trpc";

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
  void server.register(ws);

  const openApiDocument = generateOpenApiDocument(router, {
    title: "Caffe Break API",
    version: "1.0.0",
    baseUrl: "/api",
  });

  void server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    useWSS: true,
    trpcOptions: { router },
  });
  void server.register(fastifyTRPCOpenApiPlugin, { prefix: "/api", router });

  server.get("/openapi.json", () => openApiDocument);

  void server.register(fastifySwagger, {
    specification: { document: openApiDocument },
    mode: "static",
  });
  void server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: { displayOperationId: true },
  });

  server
    .listen({ port: 5555, host: "0.0.0.0" })
    .then(() => console.log("Listening in port 5555"))
    .catch((reason) => console.error(reason));
};
