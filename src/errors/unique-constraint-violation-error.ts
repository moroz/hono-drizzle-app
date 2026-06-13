import type { DrizzleQueryError } from "drizzle-orm";
import type { DatabaseError } from "pg";

export class UniqueConstraintViolationError {
  column: string | null = null;
  cause: DrizzleQueryError;

  constructor(e: DrizzleQueryError) {
    this.cause = e;
    const dbError = e.cause as DatabaseError;
    if (dbError.column) {
      this.column = dbError.column;
    }
  }
}
