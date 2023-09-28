import { Err, Ok, Result } from "ts-results";

export const OkOrErr = <T, E extends Error>(
  value: T | undefined | null,
  error: E,
): Result<T, E> => {
  if (value !== undefined && value !== null) {
    return Ok(value);
  }

  return Err(error);
};
