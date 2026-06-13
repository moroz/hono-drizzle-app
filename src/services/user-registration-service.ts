import { type DbContext, usersTable } from "@db/schema.js";
import { type CreateUserRegistrationParams, UserRegistrationInput } from "@/schemata/index.js";
import { hashPassword } from "@/services/password-service.js";

export class UserRegistrationService {
  constructor(private dbContext: DbContext) {}

  async createUserRegistration(params: UserRegistrationInput) {
    return this.dbContext.insert(usersTable).values({
      email: params.email,
      displayName: params.displayName,
      passwordHash: await hashPassword(params.password),
    });
  }
}
