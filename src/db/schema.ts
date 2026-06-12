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

export const timestamp = customType<{ data: Temporal.Instant; driverData: string }>({
  dataType() {
    return "timestamp with time zone";
  },
  fromDriver(value) {
    return Temporal.PlainDateTime.from(value).toZonedDateTime("UTC").toInstant();
  },
  toDriver(value) {
    return value.toJSON();
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
  insertedAt: timestamp().notNull().default(sql`now()`),
  updatedAt: timestamp().notNull().default(sql`now()`),
});

export type User = typeof usersTable.$inferSelect;
