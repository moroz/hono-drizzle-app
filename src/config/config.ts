import { deriveEd25519KeyPair } from "@/config/keys.js";

function MustGetenv(key: string) {
  const value = process.env[key];
  if (!value) {
    console.error(`FATAL: Environment variable ${key} is not set!`);
    process.exit(1);
  }
  return value;
}

function MustGetenvBase64(key: string) {
  const value = MustGetenv(key);
  const buf = Buffer.from(value, "base64");
  const isValid = buf.toBase64() === value;
  if (!isValid) {
    console.error(`FATAL: Failed to parse environment variable ${key} from Base64!`);
    process.exit(1);
  }
  return Uint8Array.from(buf);
}

export const DATABASE_URL = MustGetenv("DATABASE_URL");

const HKDF_SALT = Uint8Array.from(
  Buffer.from(
    "WjqyS5ug93YZVto3N8xQtRxIJNAI4zb1VOuHFxcQgbZJz3uQne5WWj9BOPiJ+Gta49BYB5C22+Bo3SGFiFSZ1g==",
    "base64",
  ),
);
const SECRET_KEY_BASE = MustGetenvBase64("SECRET_KEY_BASE");

const { publicKey, privateKey } = await deriveEd25519KeyPair(
  SECRET_KEY_BASE,
  HKDF_SALT,
  "JWT signer",
);

export const JWT_SIGNING_KEY = privateKey;
export const JWT_VERIFYING_KEY = publicKey;
