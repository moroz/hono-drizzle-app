import argon2 from "argon2";

const isTest = process.env.NODE_ENV === "test";

// Centralized argon2id parameters so every password hash in the app shares the
// same cost. Test settings are lowered so the suite isn't dominated by KDF time.
const HASH_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  parallelism: 1,
  timeCost: isTest ? 2 : 3,
  memoryCost: isTest ? 512 : 65536,
};

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, HASH_OPTIONS);
}

// Cost parameters are encoded in the stored digest, so verification reads them
// from the hash itself and needs no options.
export function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}
