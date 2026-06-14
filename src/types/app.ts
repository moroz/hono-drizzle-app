import type { User } from "@db/schema.js";

export type AppVariables = {
  user: User | null;
};
