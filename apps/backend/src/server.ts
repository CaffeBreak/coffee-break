import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { container } from "tsyringe";

import { AppRouter } from "./api/trpc";

const server = fastify({
  maxParamLength: 5000,
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

  void server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router },
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
