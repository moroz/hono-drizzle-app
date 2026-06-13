import { z } from "zod";

export const CreateUserRegistrationSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8).max(128),
    passwordConfirmation: z.string(),
    displayName: z.string().min(1),
  })
  .refine((params) => params.password === params.passwordConfirmation, {
    error: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type CreateUserRegistrationParams = z.infer<typeof CreateUserRegistrationSchema>;

export class UserRegistrationInput {
  static from(params: CreateUserRegistrationParams): UserRegistrationInput {
    return {
      email: params.email,
      displayName: params.displayName,
      password: params.password,
    };
  }

  private constructor(
    readonly email: string,
    readonly displayName: string,
    readonly password: string,
  ) {}
}
