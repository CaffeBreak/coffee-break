import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { container } from "tsyringe";

import { AppRouter } from "./api/trpc";

const server = fastify({
  maxParamLength: 5000,
});

export const startServer = () => {
  const router = container.resolve(AppRouter).execute();

  server
    .register(fastifyTRPCPlugin, {
      prefix: "/trpc",
      trpcOptions: { router },
    })
    .then(
      () => console.log("tRPC Adapter is loaded"),
      (resson) => {
        console.error("Could not load tRPC Adapter");
        console.error(resson);
      },
    );

  server
    .listen({ port: 5000 })
    .then(() => console.log("Listening in port 5000"))
    .catch((reason) => console.error(reason));
};
