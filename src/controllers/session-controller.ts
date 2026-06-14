import type { DbContext } from "@db/schema.js";
import { Hono } from "hono";
import { issueTokenForUser, peekExpirationTime, UserService } from "@services";
import { zValidator } from "@hono/zod-validator";
import { CreateSessionSchema } from "@schemata";
import { ACCESS_TOKEN_COOKIE } from "@config";
import { setCookie } from "hono/cookie";
import { UserDto } from "@dto";
import { problemDetails } from "@/http/problem-details.js";
import type { AppVariables } from "@/types/app.js";

export function SessionController(dbContext: DbContext) {
  const handler = new Hono<{ Variables: AppVariables }>();
  const userService = new UserService(dbContext);

  handler.get("/session", (c) => {
    const user = c.get("user");
    return c.json({ data: user && UserDto.from(user) });
  });

  handler.post("/sessions", zValidator("json", CreateSessionSchema), async (c) => {
    const params = c.req.valid("json");
    const user = await userService.authenticateUserByEmailPassword(params.email, params.password);
    if (!user) {
      return problemDetails(c, {
        title: "Unauthorized",
        status: 401,
        detail: "Invalid email or password.",
      });
    }

    const token = await issueTokenForUser(user);
    const expiresAt = peekExpirationTime(token);
    setCookie(c, ACCESS_TOKEN_COOKIE, token, { httpOnly: true, sameSite: "Lax" });

    return c.json(
      {
        data: {
          user: UserDto.from(user),
          expiresAt,
        },
      },
      201,
    );
  });

  return handler;
}
