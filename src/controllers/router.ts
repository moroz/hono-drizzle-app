import type { DbContext } from "@db/schema.js";
import { SessionController } from "./session-controller.js";
import { UserController } from "./user-controller.js";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { JWT_VERIFYING_KEY } from "@config";

export function App(dbContext: DbContext) {
  const app = new Hono();

  if (process.env.NODE_ENV !== "test") {
    app.use(logger());
  }
  app.use(cors());

  app.get("/", (c) => {
    return c.text("Hello Hono!");
  });

  app.get("/.well-known/jwks.json", async (c) => {
    const jwk = await crypto.subtle.exportKey("jwk", JWT_VERIFYING_KEY);
    return c.json({ keys: [jwk] });
  });

  const userController = UserController(dbContext);
  app.route("/api/v1/users", userController);

  const sessionController = SessionController(dbContext);
  app.route("/api/v1/sessions", sessionController);

  return app;
}
