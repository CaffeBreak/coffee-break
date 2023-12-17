import pc from "picocolors";

type Literal = string | number | symbol | boolean | bigint;

export const log = (literal: Literal, ...expr: Literal[]): void => {
  console.log(
    `${pc.dim(`[${padSide(String(literal), 4)}]`)} ${expr.map((e) => String(e)).join("")}`,
  );
};
export const genLogStr = (literal: Literal, ...expr: Literal[]) =>
  `${pc.dim(`[${padSide(String(literal), 4)}]`)} ${expr.map((e) => String(e)).join("")}`;

const padSide = (str: string, len: number) => {
  if (str.length > len) return str;

  const lPadstr = " ".repeat(Math.floor(len / 2));
  const rPadstr = " ".repeat(Math.ceil(len / 2));
  const padded = `${lPadstr}${str}${rPadstr}`;
  const start = Math.floor((padded.length - len) / 2);

  return padded.slice(start, start + len);
};
