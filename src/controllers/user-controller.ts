import { Hono } from "hono";
import { type DbContext, usersTable } from "../db/schema.ts";
import UserRepository from "../repositories/user-repository.ts";

export function UserController(db: DbContext) {
  const handler = new Hono();
  const userRepository = new UserRepository(db);

  handler.get("/", async (c) => {
    const users = await userRepository.listUsers();
    return c.json({ data: users });
  });

  return handler;
}
