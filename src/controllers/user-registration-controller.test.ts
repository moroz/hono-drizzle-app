import { describe, expect, it } from "vitest";
import { UserRegistrationController } from "@controllers/user-registration-controller.js";
import { DbContext, usersTable } from "@db/schema.js";
import { DATABASE_URL } from "@/config/index.js";
import { App } from "@controllers/router.js";
import { uniqueEmail, VALID_PASSWORD } from "@/test/factories/users.js";
import type { CreateUserRegistrationParams } from "@/schemata/index.js";
import { UserRegistrationService } from "@/services/index.js";

describe(UserRegistrationController, () => {
  const db = DbContext(DATABASE_URL);
  const app = App(db);

  const validParams: CreateUserRegistrationParams = {
    email: uniqueEmail(),
    password: VALID_PASSWORD,
    passwordConfirmation: VALID_PASSWORD,
    displayName: "Vcerg Fxira",
  };

  describe("POST create", () => {
    function makeRequest(params: any) {
      return app.request("/api/v1/user_registrations", {
        method: "POST",
        body: JSON.stringify(params),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
    }

    it("creates a new user with valid params", async () => {
      const count = await db.$count(usersTable);

      const res = await makeRequest(validParams);
      expect(res.status).toEqual(201);

      const newCount = await db.$count(usersTable);
      expect(newCount).toEqual(count + 1);
    });

    it("rejects with invalid email", async () => {
      const existingEmail = uniqueEmail();
      const existingUser = await new UserRegistrationService(db).createUserRegistration({
        ...validParams,
        email: existingEmail,
      });
      expect(existingUser).not.toBeNull();

      const invalidEmails = [
        existingEmail,
        existingEmail.toUpperCase(),
        "user@example",
        "invalid@",
        "@example.com",
      ];

      for (const email of invalidEmails) {
        const params = {
          ...validParams,
          email: email,
        };

        const count = await db.$count(usersTable);

        const res = await makeRequest(params);
        expect(res.status).toEqual(422);

        const countAfter = await db.$count(usersTable);
        expect(countAfter).toEqual(count);

        const body = (await res.json()) as any;
        expect(body.errors).toBeInstanceOf(Array);
        expect(body.errors[0].pointer).toEqual("#/email");
      }
    });
  });
});
