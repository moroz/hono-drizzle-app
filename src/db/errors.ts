import { DatabaseError } from "pg";
import { DrizzleQueryError } from "drizzle-orm";

export function isUniqueViolation(e: Error, constraint: string) {
  if (!(e instanceof DrizzleQueryError)) return false;
  const cause = e.cause as DatabaseError;
  return "code" in cause && cause.code === "23505" && cause.constraint === constraint;
}
