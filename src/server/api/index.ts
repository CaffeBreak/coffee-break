import { DefineMethods } from "aspida";

export type Methods = DefineMethods<{
  get: {
    resBody: { msg: string; hoge: string };
  };
}>;
