import type { User } from "@db/schema.js";

export class UserDto {
  static from(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    };
  }

  constructor(
    readonly id: string,
    readonly email: string,
    readonly displayName: string,
  ) {}
}
