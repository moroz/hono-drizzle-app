import * as crypto from "node:crypto";

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

async function DeriveKey(baseKey: CryptoKey, salt: Uint8Array, info: string, bitLength: number) {
  const bits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-512",
      salt: Uint8Array.from(salt),
      info: new TextEncoder().encode(info),
    },
    baseKey,
    bitLength,
  );

  return new Uint8Array(bits);
}

async function DeriveEd25519SigningKey(seed: Uint8Array) {
  const pkcs8 = new Uint8Array([
    0x30,
    0x2e,
    0x02,
    0x01,
    0x00,
    0x30,
    0x05,
    0x06,
    0x03,
    0x2b,
    0x65,
    0x70,
    0x04,
    0x22,
    0x04,
    0x20,
    ...seed,
  ]);

  return crypto.subtle.importKey("pkcs8", pkcs8, "Ed25519", false, ["sign"]);
}

export const DATABASE_URL = MustGetenv("DATABASE_URL");

const HKDF_SALT = Uint8Array.from(
  Buffer.from(
    "WjqyS5ug93YZVto3N8xQtRxIJNAI4zb1VOuHFxcQgbZJz3uQne5WWj9BOPiJ+Gta49BYB5C22+Bo3SGFiFSZ1g==",
    "base64",
  ),
);
export const SECRET_KEY_BASE = MustGetenvBase64("SECRET_KEY_BASE");
const HKDF_KEY_BASE = await crypto.subtle.importKey("raw", SECRET_KEY_BASE, "HKDF", false, [
  "deriveBits",
]);
export const JWT_SIGNING_KEY = await DeriveEd25519SigningKey(
  await DeriveKey(HKDF_KEY_BASE, HKDF_SALT, "JWT signer", 32 * 8),
);
export const JWT_VERIFYING_KEY = JWT_SIGNING_KEY;
