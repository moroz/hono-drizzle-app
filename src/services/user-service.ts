import type { DbContext, User } from "@db/schema.js";
import { UserRepository } from "@/repositories/user-repository.js";
import { verifyPassword } from "@/services/password-service.js";
import { verifyToken } from "@/services/token-service.js";

export class UserService {
  private userRepository: UserRepository;

  constructor(private dbContext: DbContext) {
    this.userRepository = new UserRepository(dbContext);
  }

  async authenticateUserByEmailPassword(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user?.passwordHash) return null;

    try {
      if (await verifyPassword(user.passwordHash, password)) {
        return user;
      }
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  async getUserByAccessToken(token: string | null | undefined): Promise<User | null> {
    if (!token) return null;

    const claims = await verifyToken(token);
    if (!claims?.sub) return null;

    return this.userRepository.getUserById(claims.sub);
  }
}
