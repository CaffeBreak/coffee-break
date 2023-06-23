
import { Injectable } from "@nestjs/common";

import { RoomRouter } from "./routers/room";
import { router } from "./trpc";

@Injectable()
export class AppRouter {
  constructor(
    private readonly roomRouter: RoomRouter,
  ) {}

  public getAppRouter() {
    return router({
      room: this.roomRouter.getRoomRouter(),
    });
  }
}

export type AppRouterType = ReturnType<AppRouter["getAppRouter"]>;
