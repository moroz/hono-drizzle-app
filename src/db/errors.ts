import { DatabaseError } from "pg";
import { DrizzleQueryError } from "drizzle-orm";

export function isUniqueViolation(e: Error) {
  if (!(e instanceof DrizzleQueryError)) return false;
  const cause = e.cause as any;
  return "code" in cause && cause.code === "23505";
}
