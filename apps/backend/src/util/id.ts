import * as crypto from "node:crypto";

const TIME2000 = 946684800000;
let counter = crypto.randomBytes(2).readUInt16LE(0);

export const genId = () => {
  const time = new Date().getTime();
  const time_delta = Math.max(time - TIME2000, 0)
    .toString(36)
    .padStart(8, "0");
  const noise = counter.toString(36).padStart(2, "0").slice(-2);

  counter += 1;

  return `${time_delta}${noise}`;
};
