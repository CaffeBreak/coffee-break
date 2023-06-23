import { Module } from "@nestjs/common";

import { tRPCModule } from "./api/trpcModule";
import { tRPCService } from "./api/trpcService";
import { ServerService } from "./serverService";
import { SocketService } from "./socket/socketService";

import { CoreModule } from "@/core/coreModule";

@Module({
  imports: [CoreModule, tRPCModule],
  providers: [ServerService, tRPCService, SocketService],
  exports: [ServerService, tRPCService],
})
export class ServerModule {}
