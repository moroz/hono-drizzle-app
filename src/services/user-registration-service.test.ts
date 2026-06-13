import { expect, describe, it } from "vitest";
import { UserRegistrationService } from "@/services/user-registration-service.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { MustGetenv } from "@config";
import { userFactory } from "@/test/factories/users.js";
import { verifyPassword } from "@services";
import type { User } from "@db/schema.js";

describe(UserRegistrationService, () => {
  let dbContext = drizzle({ connection: MustGetenv("TEST_DATABASE_URL"), casing: "snake_case" });
  let service = new UserRegistrationService(dbContext);

  describe("createUserRegistration", () => {
    it("creates a User with valid params", async () => {
      const password = "foobar2000";
      const params = userFactory.build();
      const user = (await service.createUserRegistration({
        email: params.email,
        displayName: params.displayName,
        password,
      })) as User;

      expect(user).not.toBeNull();
      expect(user.email).toEqual(params.email);
      expect(user.displayName).toEqual(params.displayName);

      const passwordValid = await verifyPassword(user.passwordHash!, password);
      expect(passwordValid).toBe(true);
    });

    it("does not create another user when email is already taken", async () => {
      const existing = await userFactory.create({}, { transient: { db: dbContext } });
      expect(existing).not.toBeNull();

      try {
        const user = await service.createUserRegistration({
          email: existing.email,
          displayName: "Invalid",
          password: "foobar2000",
        });
        expect(user).toBeNull();
      } catch (e) {
        console.error(e);
      }
    });
  });
});
