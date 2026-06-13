import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

// A single field-level error, per the validation example in RFC 9457 §3.
// `pointer` is an RFC 6901 JSON Pointer into the request body, e.g. "#/email".
export type ProblemError = {
  detail: string;
  pointer?: string;
};

// An RFC 9457 (Problem Details for HTTP APIs) document. The standard members
// are spelled out; the index signature allows extension members beyond `errors`.
export type ProblemDetails = {
  type?: string;
  title: string;
  status: ContentfulStatusCode;
  detail?: string;
  instance?: string;
  errors?: ProblemError[];
  [key: string]: unknown;
};

// Render a problem+json response. `status` drives both the HTTP status and the
// body's `status` member, so the two can't drift. `type` defaults to
// "about:blank", which per the RFC means "the title is just the status phrase".
export function problemDetails(c: Context, problem: ProblemDetails) {
  const { type = "about:blank", status, ...rest } = problem;
  return c.json({ type, status, ...rest }, status, {
    "Content-Type": "application/problem+json",
  });
}

// Convenience for the common case: a validation failure carrying field errors.
// Defaults to 422 (well-formed but semantically invalid); override `status` to
// 400 if you'd rather keep parity with zValidator's default for shape errors.
export function validationProblem(
  c: Context,
  errors: ProblemError[],
  overrides?: Partial<Pick<ProblemDetails, "type" | "title" | "status" | "detail">>,
) {
  return problemDetails(c, {
    title: "Unprocessable Entity",
    status: 422,
    ...overrides,
    errors,
  });
}
