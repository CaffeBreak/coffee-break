import { Injectable } from "@nestjs/common";
import { boundMethod } from "autobind-decorator";
import socket from "fastify-socket.io";

import type { FastifyInstance, FastifyPluginOptions } from "fastify";

import { LoggerService } from "@/core/loggerService";
import { Logger } from "@/util/logger";

@Injectable()
export class SocketService {
  private logger: Logger;

  constructor(private readonly loggerService: LoggerService) {
    this.logger = this.loggerService.getLogger();
  }

  @boundMethod
  public attach(
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: (error?: Error) => void,
  ) {
    fastify.register(socket).then(
      () => {
        this.logger.info("Socket.io plugin attached");
      },
      (error: Error) => {
        this.logger.error(error);
      },
    );

    done();
  }
}
