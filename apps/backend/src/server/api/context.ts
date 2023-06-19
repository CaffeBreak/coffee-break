import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  const ogt = req.cookies.ogt ?? null;

  return {
    req,
    res,
    ogt,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;
