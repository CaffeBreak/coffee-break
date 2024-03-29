import * as cp from "child_process";

import * as chokidar from "chokidar";

let prevServer: cp.ChildProcessWithoutNullStreams | undefined;
const swcProcess = cp.spawn("pnpm", [
  "swc",
  "--config-file",
  ".dev.swcrc",
  "src",
  "-d",
  "dist",
  "-D",
  "-w",
]);

swcProcess.stdout.on("data", (chunk: Buffer) => {
  console.log(chunk.toString());
});

chokidar.watch("./dist").on("all", () => {
  if (prevServer) {
    prevServer.kill();
  }
  prevServer = cp.spawn("node", ["./dist/devserver.js"]);
  prevServer.stdout.on("data", (chunk: Buffer) => {
    process.stdout.write(chunk.toString());
  });
  prevServer.stderr.on("data", (chunk: Buffer) => {
    process.stderr.write(chunk.toString());
  });
});
