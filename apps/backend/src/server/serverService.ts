import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { boundMethod } from "autobind-decorator";
import Fastify, { FastifyInstance } from "fastify";

import { tRPCService } from "./api/trpcService";
import { SocketService } from "./socket/socketService";

import { LoggerService } from "@/core/loggerService";
import { Logger } from "@/util/logger";

@Injectable()
export class ServerService implements OnApplicationShutdown {
  private fastify!: FastifyInstance;
  private logger: Logger;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly trpcService: tRPCService,
    private readonly socketService: SocketService,
  ) {
    this.logger = this.loggerService.getLogger();
  }

  @boundMethod
  public async launch() {
    this.fastify = Fastify();

    await this.fastify.register(cors, {
      origin: "*",
    });
    await this.fastify.register(cookie, {});

    // eslint-disable-next-line @typescript-eslint/unbound-method -- bound by autobind-decorator
    await this.fastify.register(this.trpcService.createServer);
    // eslint-disable-next-line @typescript-eslint/unbound-method -- bound by autobind-decorator
    await this.fastify.register(this.socketService.attach);

    this.fastify.listen({ port: 3000, host: "0.0.0.0" }, (error: Error | null, addr: string) => {
      if (error) {
        this.logger.error(error);
        process.exit(1);
      }

      this.logger.info(`Server listening at ${addr}`);
    });
  }

  @boundMethod
  public async dispose() {
    await this.fastify.close();
  }

  @boundMethod
  async onApplicationShutdown(_signal?: string | undefined) {
    await this.dispose();
  }
}
