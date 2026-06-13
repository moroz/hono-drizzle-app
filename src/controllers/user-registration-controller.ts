import type { DbContext } from "@db/schema.js";
import { Hono } from "hono";
import { UserService } from "@services";
import { zValidator } from "@hono/zod-validator";
import { CreateUserRegistrationSchema } from "@/schemata/index.js";

export function UserRegistrationController(dbContext: DbContext) {
  const handler = new Hono();
  const userService = new UserService(dbContext);

  handler.post(
    "/api/v1/user-registrations",
    zValidator("json", CreateUserRegistrationSchema),
    async (c) => {},
  );

  return handler;
}
