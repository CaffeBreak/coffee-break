import { Module } from "@nestjs/common";

import { ServerModule } from "./server/serverModule";

@Module({
  imports: [ServerModule],
})
export class MainModule {}
