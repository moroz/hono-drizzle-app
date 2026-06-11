import { z } from "zod";

export const CreateSessionSchema = z.object({
  email: z.email(),
  password: z.string(),
});
