import { type DbContext, type User, usersTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export class UserRepository {
  constructor(private dbContext: DbContext) {}

  listUsers(): Promise<ReadonlyArray<User>> {
    return this.dbContext.select().from(usersTable).orderBy(usersTable.id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const rows = await this.dbContext
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return rows[0] ?? null;
  }
}
