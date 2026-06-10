import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { UserController } from "./controllers/user-controller.ts";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import type { DbContext } from "./db/schema.ts";

const db: DbContext = drizzle({ connection: process.env.DATABASE_URL!, casing: "snake_case" });

const app = new Hono();

app.use(logger());
app.use(cors());

const users = UserController(db);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/users", users);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
