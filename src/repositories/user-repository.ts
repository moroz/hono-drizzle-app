import { type DbContext, type User, usersTable } from "../db/schema.ts";

export default class UserRepository {
  constructor(private dbContext: DbContext) {}

  listUsers(): Promise<ReadonlyArray<User>> {
    return this.dbContext.select().from(usersTable).orderBy(usersTable.id);
  }
}
