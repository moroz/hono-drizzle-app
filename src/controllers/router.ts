import type { DbContext } from "@db/schema.js";
import { SessionController } from "./session-controller.js";
import { UserController } from "./user-controller.js";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { JWT_VERIFYING_KEY } from "@config";
import { fetchUser } from "@/middleware/index.js";
import { UserRegistrationController } from "@controllers/user-registration-controller.js";

export function App(dbContext: DbContext) {
  const app = new Hono();

  if (process.env.NODE_ENV !== "test") {
    app.use(logger());
  }
  app.use(cors());

  app.use(fetchUser(dbContext));

  app.get("/", (c) => {
    return c.text("Hello Hono!");
  });

  app.get("/.well-known/jwks.json", async (c) => {
    const jwk = await crypto.subtle.exportKey("jwk", JWT_VERIFYING_KEY);
    return c.json({ keys: [jwk] });
  });

  const userController = UserController(dbContext);
  app.route("/", userController);

  const sessionController = SessionController(dbContext);
  app.route("/", sessionController);

  const userRegistrations = UserRegistrationController(dbContext);
  app.route("/", userRegistrations);

  return app;
}
