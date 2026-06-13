import type { DbContext } from "@db/schema.js";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateUserRegistrationSchema, UserRegistrationInput } from "@schemata";
import { UserRegistrationService } from "@services";

export function UserRegistrationController(dbContext: DbContext) {
  const handler = new Hono();
  const userRegistrationService = new UserRegistrationService(dbContext);

  handler.post(
    "/api/v1/user-registrations",
    zValidator("json", CreateUserRegistrationSchema),
    async (c) => {
      const params = c.req.valid("json");
      const user = await userRegistrationService.createUserRegistration(
        UserRegistrationInput.from(params),
      );
    },
  );

  return handler;
}
