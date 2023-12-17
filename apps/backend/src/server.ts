import cors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import ws from "@fastify/websocket";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import pc from "picocolors";
import { fastifyTRPCOpenApiPlugin, generateOpenApiDocument } from "trpc-openapi";
import { container } from "tsyringe";

import { AppRouter } from "./api/trpc";
import { log } from "./misc/log";

const server = fastify({
  maxParamLength: 5000,
});
server.addHook("preHandler", (req, _, done) => {
  if (req) {
    log("tRPC", pc.cyan(`<<< Receive request: ${req.method} ${req.url}`));
    if (req.body && typeof req.body === "string") {
      log(
        "DEBUG",
        pc.dim(`Request body:\n${String(JSON.stringify(JSON.parse(req.body), null, 2))}`),
      );
    }
  }

  done();
});
server.addHook("onSend", (_, res, payload, done) => {
  log("tRPC", pc.cyan(`<<< Sent response: ${res.statusCode}`));
  if (payload && typeof payload === "string") {
    log("DEBUG", pc.dim(`Response body:\n${String(JSON.stringify(JSON.parse(payload), null, 2))}`));
  }
  done();
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
    .then(() => log("SERVER", pc.yellow("Listening in port 5555")))
    .catch((reason) => console.error(reason));
};
