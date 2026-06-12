import { Factory } from "fishery";
import { type DbContext, type User, usersTable } from "@db/schema.js";
import argon2 from "argon2";
import { v7 as uuidv7 } from "uuid";
import { randomBytes } from "node:crypto";

type TransientDeps = { db: DbContext; password?: string };

export const userFactory = Factory.define<User, TransientDeps>(({ onCreate, transientParams }) => {
  onCreate(async (user) => {
    const passwordHash = await argon2.hash(transientParams.password ?? "foobar", {
      memoryCost: 256,
      timeCost: 1,
      parallelism: 1,
    });

    const [inserted] = await transientParams
      .db!.insert(usersTable)
      .values({
        email: user.email,
        displayName: user.displayName,
        passwordHash,
      })
      .returning();
    return inserted;
  });

  const rand = randomBytes(3).toHex();

  return {
    id: uuidv7(),
    displayName: "Example User",
    email: `user-${rand}@example.com`,
    passwordHash: "",
    insertedAt: Temporal.Now.instant(),
    updatedAt: Temporal.Now.instant(),
  };
});
