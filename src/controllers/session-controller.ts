import type { DbContext } from "@db/schema.js";
import { Hono } from "hono";
import { UserService } from "@services";
import { zValidator } from "@hono/zod-validator";
import { CreateSessionSchema } from "@schemata";

export function SessionController(dbContext: DbContext) {
  const handler = new Hono();
  const userService = new UserService(dbContext);

  handler.post("/", zValidator("json", CreateSessionSchema), async (c) => {
    const params = c.req.valid("json");
    const user = await userService.authenticateUserByEmailPassword(params.email, params.password);
  });

  return handler;
}
