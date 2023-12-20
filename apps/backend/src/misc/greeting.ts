import pc from "picocolors";

export const greet = () => {
  console.log(pc.bold(pc.yellow("  ____       __  __      ____                 _    ")));
  console.log(pc.bold(pc.yellow(" / ___|__ _ / _|/ _| ___| __ ) _ __ ___  __ _| | __")));
  console.log(pc.bold(pc.yellow("| |   / _` | |_| |_ / _ \\  _ \\| '__/ _ \\/ _` | |/ /")));
  console.log(pc.bold(pc.yellow("| |__| (_| |  _|  _|  __/ |_) | | |  __/ (_| |   < ")));
  console.log(pc.bold(pc.yellow(" \\____\\__,_|_| |_|  \\___|____/|_|  \\___|\\__,_|_|\\_\\")));
  console.log();
};
