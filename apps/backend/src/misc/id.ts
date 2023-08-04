import { randomBytes } from "crypto";

import { z } from "zod";

export const idSchema = z
  .string()
  .regex(/^[0-9a-z]{10}$/)
  .brand("id");

export type Id = z.infer<typeof idSchema>;

const TIME_2000 = 946684800000;
let counter = randomBytes(2).readUint16LE(0);

export const genId = <T extends Id>(): T => {
  let nowTime = Date.now();
  nowTime = nowTime - TIME_2000;
  if (nowTime < 0) nowTime = 0;

  const nowTime36 = nowTime.toString(36).padStart(8, "0");
  const noise = counter.toString(36).padStart(2, "0").slice(-2);
  counter += 1;

  return idSchema.parse(nowTime36 + noise) as T;
};

export const parseId = <T extends Id>(id: T): Date => {
  const time = parseInt(id.slice(0, 8), 36) + TIME_2000;

  return new Date(time);
};
