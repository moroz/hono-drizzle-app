import { Hono } from "hono";
import { type DbContext, usersTable } from "../db/schema/schema.ts";

export function UserController(db: DbContext) {
  const handler = new Hono();

  handler.get("/", async (c) => {
    const users = await db.select().from(usersTable).orderBy(usersTable.id);
    return c.json({ data: users });
  });

  return handler;
}
