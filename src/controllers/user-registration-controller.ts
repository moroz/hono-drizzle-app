import type { DbContext } from "@db/schema.js";
import { Hono } from "hono";
import { CreateUserRegistrationSchema, UserRegistrationInput } from "@schemata";
import { UserRegistrationService } from "@services";
import { UserDto } from "@dto";
import { UniqueConstraintViolationError } from "@/errors/index.js";
import { jsonValidator } from "@/middleware/index.js";
import { validationProblem } from "@/http/problem-details.js";

export function UserRegistrationController(dbContext: DbContext) {
  const handler = new Hono();
  const userRegistrationService = new UserRegistrationService(dbContext);

  handler.post("/", jsonValidator(CreateUserRegistrationSchema), async (c) => {
    try {
      const params = c.req.valid("json");
      const user = await userRegistrationService.createUserRegistration(
        UserRegistrationInput.from(params),
      );
      return c.json({ data: UserDto.from(user) }, 201);
    } catch (e) {
      if (e instanceof UniqueConstraintViolationError) {
        return validationProblem(c, [
          { detail: "has already been taken", pointer: `#/${e.column}` },
        ]);
      }
      throw e;
    }
  });

  return handler;
}
