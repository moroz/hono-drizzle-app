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
