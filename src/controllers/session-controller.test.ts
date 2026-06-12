import { it, describe, expect } from "vitest";
import { SessionController } from "@controllers/session-controller.js";
import { ACCESS_TOKEN_COOKIE, MustGetenv } from "@/config/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { App } from "@controllers/router.js";
import { userFactory } from "@/test/factories/users.js";
import { type CreateSessionParams, CreateSessionSchema } from "@schemata";
import { parseSetCookie } from "set-cookie-parser";
import * as jose from "jose";

describe(SessionController, () => {
  let db = drizzle({ connection: MustGetenv("TEST_DATABASE_URL"), casing: "snake_case" });
  let app = App(db);

  describe("POST /api/v1/sessions", () => {
    it("returns 201 response with access_token cookie with valid params", async () => {
      const password = "Foobar2000!";
      const user = await userFactory.create({}, { transient: { db, password } });
      expect(user).not.toBeNull();

      const inputs: CreateSessionParams[] = [
        { email: user.email, password },
        { email: user.email.toUpperCase(), password },
      ];

      for (const input of inputs) {
        const res = await app.request("/api/v1/sessions", {
          method: "POST",
          body: JSON.stringify(input),
          headers: new Headers({ "Content-Type": "application/json" }),
        });

        expect(res.status).toEqual(201);

        const setCookieHeader = res.headers.get("set-cookie");
        const [cookie] = parseSetCookie(setCookieHeader ?? "");
        expect(cookie.name).toEqual(ACCESS_TOKEN_COOKIE);
        expect(cookie.httpOnly).toBe(true);

        const claims = jose.decodeJwt(cookie.value);
        expect(claims.sub).toEqual(user.id);
      }
    });

    it("returns 401 response without cookie with invalid params", async () => {
      const password = "Foobar2000!";
      const user = await userFactory.create({}, { transient: { db, password } });
      expect(user).not.toBeNull();

      const inputs: CreateSessionParams[] = [
        { email: user.email, password: "invalid" },
        { email: "invalid@email.com", password },
      ];

      for (const input of inputs) {
        const res = await app.request("/api/v1/sessions", {
          method: "POST",
          body: JSON.stringify(input),
          headers: new Headers({ "Content-Type": "application/json" }),
        });

        expect(res.status).toEqual(401);

        const setCookieHeader = res.headers.get("set-cookie");
        expect(setCookieHeader).toBeFalsy();
      }
    });

    it("returns 400 response when called with bad request", async () => {
      const inputs: string[] = [
        "{}",
        new URLSearchParams({ email: "user@example.com", password: "foobar" }).toString(),
        "gibberish",
      ];

      for (const input of inputs) {
        const res = await app.request("/api/v1/sessions", {
          method: "POST",
          body: input,
          headers: new Headers({ "Content-Type": "application/json" }),
        });

        expect(res.status).toEqual(400);

        const setCookieHeader = res.headers.get("set-cookie");
        expect(setCookieHeader).toBeFalsy();
      }
    });
  });
});
