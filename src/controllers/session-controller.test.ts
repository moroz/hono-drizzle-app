import { it, describe, expect } from "vitest";
import { SessionController } from "@controllers/session-controller.js";
import { MustGetenv } from "@/config/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { App } from "@controllers/router.js";
import { userFactory } from "@/test/factories/users.js";

describe(SessionController, () => {
  let db = drizzle({ connection: MustGetenv("TEST_DATABASE_URL"), casing: "snake_case" });
  let app = App(db);

  describe("POST /api/v1/sessions", () => {
    it("returns 201 response with access_token cookie with valid params", async () => {
      const password = "Foobar2000!";
      const user = await userFactory.create({}, { transient: { db, password } });
      expect(user).not.toBeNull();

      const res = await app.request("/api/v1/sessions", {
        method: "POST",
        body: JSON.stringify({ email: user.email, password }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      expect(res.status).toEqual(201);
    });
  });
});
