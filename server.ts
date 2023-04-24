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

fastifyServer.register(fastifyCors);

app.prepare().then(() => {
  fastifyServer.get("*", (req, res) => handle(req.raw, res.raw, parse(req.url, true)));

  $server(fastifyServer, { basePath: "/api" });

  fastifyServer.listen({ port }).then(() => {
    fastifyServer.log.info("aaaaa");
  });
});
