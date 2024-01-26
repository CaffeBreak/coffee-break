export const unreachable = (msg?: string) => {
  throw new Error(msg ?? "Something went wrong");
};
