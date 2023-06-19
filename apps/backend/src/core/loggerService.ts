import { Injectable } from "@nestjs/common";
import { boundMethod } from "autobind-decorator";

import { Logger } from "@/util/logger";

@Injectable()
export class LoggerService {
  @boundMethod
  public getLogger() {
    return new Logger();
  }
}
