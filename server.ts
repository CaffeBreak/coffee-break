import { parse } from "url";

import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import next from "next";

import $server from "@/server/$server";

const dev = process.env.NODE_ENV !== "production";
const port = 3000;

const app = next({ dev, port });
const handle = app.getRequestHandler();
const fastifyServer = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastifyServer.register(fastifyCors).then(
  () => {
    fastifyServer.log.info("Register fastify cors");
  },
  () => {
    return new Error("Can't register fastify cors");
  },
);

app
  .prepare()
  .then(async () => {
    fastifyServer.get("*", (req, res) => handle(req.raw, res.raw, parse(req.url, true)));

    $server(fastifyServer, { basePath: "/api" });

    await fastifyServer.listen({ port, host: "0.0.0.0" });
  })
  .catch(() => {
    return new Error("Can't start server");
  });
