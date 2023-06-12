import fastifyCors from "@fastify/cors";
import fastify, { FastifyPluginCallback } from "fastify";
import Next from "next";

import $server from "@/server/$server";

const dev = process.env.NODE_ENV !== "production";
const port = 3000;

const fastifyServer = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
  pluginTimeout: dev ? 10000 : 0,
});

export const nextJsCustomServerPlugin: FastifyPluginCallback<{ isDev: boolean }> = (
  serve,
  option,
  done,
) => {
  const app = Next({ dev: option.isDev });
  const handle = app.getRequestHandler();

  app.prepare().catch((err: Error) => {
    serve.log.error("error", err);
    done(err);
  });

  serve.get("*", async (req, reply) => {
    await handle(req.raw, reply.raw);
    reply.sent = true;
  });

  $server(serve, { basePath: "/api" });

  done();
};

fastifyServer.register(fastifyCors).after(() => {
  fastifyServer.log.info("CORS enabled");
});
fastifyServer.register(nextJsCustomServerPlugin, { isDev: dev }).after(() => {
  fastifyServer.log.info("Next.js enabled");
});

fastifyServer.listen({ port, host: "0.0.0.0" }).catch((err) => {
  throw err;
});
