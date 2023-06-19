import { LoggerService } from "@nestjs/common";

import { Logger } from "./logger";

const logger = new Logger();

export class NestLogger implements LoggerService {
  log(message: string, ...optionalParams: unknown[]) {
    const ctx = optionalParams[0] as string;

    logger.info(`${ctx}: ${message}`);
  }
  error(message: string, ...optionalParams: unknown[]) {
    const ctx = optionalParams[0] as string;

    logger.error(`${ctx}: ${message}`);
  }
  warn(message: string, ...optionalParams: unknown[]) {
    const ctx = optionalParams[0] as string;

    logger.warn(`${ctx}: ${message}`);
  }
  debug?(message: string, ...optionalParams: unknown[]) {
    const ctx = optionalParams[0] as string;

    logger.debug(`${ctx}: ${message}`);
  }
  verbose?(message: string, ...optionalParams: unknown[]) {
    const ctx = optionalParams[0] as string;

    logger.debug(`${ctx}: ${message}`);
  }
}
