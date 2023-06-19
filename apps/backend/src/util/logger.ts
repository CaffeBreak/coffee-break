import { boundMethod } from "autobind-decorator";
import pino from "pino";

export class Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
    });
  }

  @boundMethod
  public info(msg: string) {
    this.logger.info(msg);
  }

  @boundMethod
  public warn(msg: string) {
    this.logger.warn(msg);
  }

  @boundMethod
  public error(msg: string | Error) {
    if (msg instanceof Error) {
      this.logger.error(msg.stack ?? msg.message);
      return;
    }
    this.logger.error(msg);
  }

  @boundMethod
  public debug(msg: string) {
    this.logger.debug(msg);
  }
}
