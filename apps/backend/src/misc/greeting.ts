import pc from "picocolors";

export const greet = () => {
  console.log(pc.yellow(pc.bold("  _____        __  __    ______                _    ")));
  console.log(pc.yellow(pc.bold(" /  __ \\      / _|/ _|   | ___ \\              | |   ")));
  console.log(pc.yellow(pc.bold(" | /  \\/ __ _| |_| |_ ___| |_/ /_ __ ___  __ _| | __")));
  console.log(pc.yellow(pc.bold(" | |    / _` |  _|  _/ _ \\ ___ \\ '__/ _ \\/ _` | |/ /")));
  console.log(pc.yellow(pc.bold(" | \\__/\\ (_| | | | ||  __/ |_/ / | |  __/ (_| |   < ")));
  console.log(pc.yellow(pc.bold("  \\____/\\__,_|_| |_| \\___\\____/|_|  \\___|\\__,_|_|\\_\\")));
  console.log();
};
