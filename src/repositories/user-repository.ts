import { type DbContext, type User, usersTable } from "@db/schema.js";
import { eq } from "drizzle-orm";

export class UserRepository {
  constructor(private dbContext: DbContext) {}

  listUsers(): Promise<ReadonlyArray<User>> {
    return this.dbContext.select().from(usersTable).orderBy(usersTable.id);
  }

  async getUserById(id: string): Promise<User | null> {
    const [user] = await this.dbContext
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return user ?? null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await this.dbContext
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return user ?? null;
  }
}
