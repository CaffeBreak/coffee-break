import { Err, Ok, Result } from "@cffnpwr/result-ts";

export const OkOrErr = <T, E extends Error>(
  value: T | undefined | null,
  error: E,
): Result<T, E> => {
  if (value !== undefined && value !== null) {
    return new Ok(value);
  }

  return new Err(error);
};
