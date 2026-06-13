import { zValidator } from "@hono/zod-validator";
import type { z } from "zod";
import { validationProblem, type ProblemError } from "@/http/problem-details.js";

function toProblemErrors(
  issues: ReadonlyArray<{ message: string; path: PropertyKey[] }>,
): ProblemError[] {
  return issues.map((issue) => ({
    detail: issue.message,
    pointer: `#/${issue.path.join("/")}`,
  }));
}

export function jsonValidator<T extends z.ZodType>(schema: T) {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return validationProblem(c, toProblemErrors(result.error.issues));
    }
  });
}
