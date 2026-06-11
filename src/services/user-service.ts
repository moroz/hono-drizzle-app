import type { DbContext, User } from "@db/schema.js";
import { UserRepository } from "@/repositories/user-repository.js";
import argon2 from "argon2";

export class UserService {
  private userRepository: UserRepository;

  constructor(private dbContext: DbContext) {
    this.userRepository = new UserRepository(dbContext);
  }

  async authenticateUserByEmailPassword(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user?.passwordHash) return null;

    try {
      if (await argon2.verify(user.passwordHash, password)) {
        return user;
      }
    } catch (e) {
      console.log(e);
    }

    return null;
  }
}
