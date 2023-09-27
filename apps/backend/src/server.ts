import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import { appRouter } from "./api/trpc";

const server = fastify({
  maxParamLength: 5000,
});

server
  .register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: appRouter },
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
  .then(() => console.log("Listening in port 3000"))
  .catch((reason) => console.error(reason));
