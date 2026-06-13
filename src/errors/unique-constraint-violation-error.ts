import type { DrizzleQueryError } from "drizzle-orm";

export class UniqueConstraintViolationError extends Error {
  declare cause: DrizzleQueryError;

  constructor(
    cause: DrizzleQueryError,
    readonly column: string,
  ) {
    super(`Unique constraint violation on "${column}"`, { cause });
    this.name = "UniqueConstraintViolationError";
    Error.captureStackTrace?.(this, UniqueConstraintViolationError);
  }
}
