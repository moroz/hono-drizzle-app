import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { UserController } from "@controllers/user-controller.js";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import type { DbContext } from "./db/schema.ts";
import { SessionController } from "@controllers/session-controller.js";
import { DATABASE_URL } from "@config";

const db: DbContext = drizzle({ connection: DATABASE_URL, casing: "snake_case" });

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const userController = UserController(db);
app.route("/api/v1/users", userController);

const sessionController = SessionController(db);
app.route("/api/v1/sessions", sessionController);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
