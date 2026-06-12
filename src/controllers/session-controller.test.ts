import { it, describe, beforeAll, afterAll } from "vitest";
import { SessionController } from "@controllers/session-controller.js";
import type { DbContext } from "@db/schema.js";
import { MustGetenv } from "@/config/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { App } from "@controllers/router.js";

describe(SessionController, () => {
  let db = drizzle({ connection: MustGetenv("TEST_DATABASE_URL"), casing: "snake_case" });
  let app = App(db);

  describe("POST /api/v1/sessions", () => {
    it("returns 201 response with access_token cookie with valid params", async () => {
      const res = await app.request("/api/v1/sessions", {
        method: "POST",
        body: JSON.stringify({ email: "user@example.com", password: "validPassword" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
    });
  });
});
