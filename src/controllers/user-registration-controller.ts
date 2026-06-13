import type { DbContext } from "@db/schema.js";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateUserRegistrationSchema, UserRegistrationInput } from "@schemata";
import { UserRegistrationService } from "@services";
import { UserDto } from "@dto";
import { UniqueConstraintViolationError } from "@/errors/index.js";
import { z } from "zod";

export function UserRegistrationController(dbContext: DbContext) {
  const handler = new Hono();
  const userRegistrationService = new UserRegistrationService(dbContext);

  handler.post(
    "/api/v1/user-registrations",
    zValidator("json", CreateUserRegistrationSchema),
    async (c) => {
      try {
        const params = c.req.valid("json");
        const user = await userRegistrationService.createUserRegistration(
          UserRegistrationInput.from(params),
        );
        return c.json(
          {
            data: UserDto.from(user),
          },
          201,
        );
      } catch (e) {
        if (e instanceof UniqueConstraintViolationError) {
          c.json({
            success: false,
            error: new z.ZodError([
              { code: "custom", path: [e.column!], message: "has already been taken" },
            ]),
          });
        }
      }
    },
  );

  return handler;
}
