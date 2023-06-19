import { NestFactory } from "@nestjs/core";
import chalk from "chalk";

import { MainModule } from "@/mainModule";
import { ServerService } from "@/server/serverService";
import { NestLogger } from "@/util/nestLogger";

const coffee = chalk.hex("#6B474C").bold;

const greet = () => {
  console.log();
  console.log(coffee("   _____       __  __            ____                 _    "));
  console.log(coffee("  / ____|     / _|/ _|          |  _ \\               | |   "));
  console.log(coffee(" | |     ___ | |_| |_ ___  ___  | |_) |_ __ ___  __ _| | __"));
  console.log(coffee(" | |    / _ \\|  _|  _/ _ \\/ _ \\ |  _ <| '__/ _ \\/ _\\` | |/ /"));
  console.log(coffee(" | |___| (_) | | | ||  __/  __/ | |_) | | |  __/ (_| |   < "));
  console.log(coffee("  \\_____\\___/|_| |_| \\___|\\___| |____/|_|  \\___|\\__,_|_|\\_\\"));
  console.log(coffee("                                                           "));
};

const server = async () => {
  const app = await NestFactory.createApplicationContext(MainModule, {
    logger: new NestLogger(),
  });
  app.enableShutdownHooks();

  const serverService = app.get(ServerService);
  await serverService.launch();

  return app;
};

greet();

await server();
