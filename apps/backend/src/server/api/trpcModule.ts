import { Module } from "@nestjs/common";

import { AppRouter } from "./router";
import { RoomRouter } from "./routers/room";
import { tRPCService } from "./trpcService";

import { CoreModule } from "@/core/coreModule";

@Module({
  imports: [
    CoreModule,
  ],
  providers: [
    tRPCService,
    AppRouter,
    RoomRouter,
  ],
  exports: [
    tRPCService,
    AppRouter,
    RoomRouter,
  ],
})
export class tRPCModule {}
