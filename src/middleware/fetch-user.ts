import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { ACCESS_TOKEN_COOKIE } from "@/config/index.js";
import type { DbContext, User } from "@db/schema.js";
import { UserService } from "@/services/index.js";

export function fetchUser(dbContext: DbContext) {
  const userService = new UserService(dbContext);

  return createMiddleware(async (c, next) => {
    const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE);
    c.set("user", await userService.getUserByAccessToken(accessToken));
    await next();
  });
}
