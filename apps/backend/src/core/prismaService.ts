import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { LoggerService } from "./loggerService";

import { Logger } from "@/util/logger";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger: Logger;

  constructor(private readonly loggerService: LoggerService) {
    super();
    this.logger = this.loggerService.getLogger();
  }

  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", () => {
      app.close().catch((e: Error | string) => {
        this.logger.error(e);
      });
    });
  }
}
