import { Module } from "@nestjs/common";

import { tRPCService } from "./api/trpcService";
import { ServerService } from "./serverService";
import { SocketService } from "./socket/socketService";

import { CoreModule } from "@/core/coreModule";

@Module({
  imports: [CoreModule],
  providers: [ServerService, tRPCService, SocketService],
  exports: [ServerService],
})
export class ServerModule {}
