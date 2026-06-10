import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
import { pgTable, customType } from "drizzle-orm/pg-core";

export type DbContext = ReturnType<typeof drizzle>;

export const citext = customType<{ data: string }>({
  dataType() {
    return "citext";
  },
});

export const usersTable = pgTable("users", {
  id: p
    .uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  email: citext().unique().notNull(),
  passwordHash: p.varchar({ length: 255 }),
  displayName: p.varchar({ length: 255 }).notNull(),
  insertedAt: p.timestamp().defaultNow().notNull(),
  updatedAt: p.timestamp().defaultNow().notNull(),
});
