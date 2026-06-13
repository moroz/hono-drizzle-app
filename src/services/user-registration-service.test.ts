import { describe } from "vitest";
import { UserRegistrationService } from "@/services/user-registration-service.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { MustGetenv } from "@config";

describe(UserRegistrationService, () => {
  let db = drizzle({ connection: MustGetenv("TEST_DATABASE_URL"), casing: "snake_case" });

  describe("createUserRegistration", async () => {});
});
