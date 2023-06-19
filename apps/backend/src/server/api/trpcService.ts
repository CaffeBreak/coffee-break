import { Injectable } from "@nestjs/common";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { boundMethod } from "autobind-decorator";

import { createContext } from "./context";
import { appRouter } from "./router";

import type { FastifyInstance, FastifyPluginOptions } from "fastify";

import { LoggerService } from "@/core/loggerService";
import { Logger } from "@/util/logger";

@Injectable()
export class tRPCService {
  private logger: Logger;

  constructor(private readonly loggerService: LoggerService) {
    this.logger = this.loggerService.getLogger();
  }

  @boundMethod
  public createServer(
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: (error?: Error) => void,
  ) {
    fastify
      .register(fastifyTRPCPlugin, {
        prefix: "/trpc",
        trpcOptions: {
          router: appRouter,
          createContext,
        },
      })
      .then(
        () => {
          this.logger.info("tRPC plugin attached");
        },
        (error: Error) => {
          this.logger.error(error);
        },
      );

    done();
  }
}
