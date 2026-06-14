import { type DbContext, type User, usersTable } from "@db/schema.js";
import { type CreateUserRegistrationParams, UserRegistrationInput } from "@/schemata/index.js";
import { hashPassword } from "@/services/password-service.js";
import { isUniqueViolation } from "@db/errors.js";
import { UniqueConstraintViolationError } from "@/errors/index.js";

export class UserRegistrationService {
  constructor(private dbContext: DbContext) {}

  async createUserRegistration(params: UserRegistrationInput): Promise<User> {
    try {
      const [user] = await this.dbContext
        .insert(usersTable)
        .values({
          email: params.email.toLowerCase(),
          displayName: params.displayName,
          passwordHash: await hashPassword(params.password),
        })
        .returning();
      return user;
    } catch (e: any) {
      if (isUniqueViolation(e, "users_email_key")) {
        throw new UniqueConstraintViolationError(e, "email");
      }
      throw e;
    }
  }
}
