import { Injectable } from "@nestjs/common";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { boundMethod } from "autobind-decorator";

import { createContext } from "./context";
import { AppRouter } from "./router";

import type { FastifyInstance, FastifyPluginOptions } from "fastify";

import { LoggerService } from "@/core/loggerService";
import { Logger } from "@/util/logger";

@Injectable()
export class tRPCService {
  private logger: Logger;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly appRouter: AppRouter,
  ) {
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
          router: this.appRouter.getAppRouter(),
          createContext,
          onError: (error) => {
            this.logger.error(error as Error);
          },
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
