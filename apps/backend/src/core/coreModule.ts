import { Module } from "@nestjs/common";

import { LoggerService } from "./loggerService";

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CoreModule {}
