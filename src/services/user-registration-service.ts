import { type DbContext, usersTable } from "@db/schema.js";
import type { CreateUserRegistrationParams } from "@/schemata/index.js";
import { hashPassword } from "@/services/password-service.js";

export class UserRegistrationService {
  constructor(private dbContext: DbContext) {}

  async createUserRegistration(params: CreateUserRegistrationParams) {
    return await this.dbContext.insert(usersTable).values({
      email: params.email,
      displayName: params.displayName,
      passwordHash: await hashPassword(params.password),
    });
  }
}
