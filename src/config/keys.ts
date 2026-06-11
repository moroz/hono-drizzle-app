import { ed25519 } from "@noble/curves/ed25519.js";
import * as crypto from "node:crypto";

const Ed25519PrivateKeyPKCS8Envelope = [
  0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20,
] as const;

const Ed25519PublicKeySPKIEnvelope = [
  0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
] as const;

export async function deriveEd25519KeyPair(masterKey: Uint8Array, salt: Uint8Array, info: string) {
  const baseKey = await crypto.subtle.importKey("raw", Uint8Array.from(masterKey), "HKDF", false, [
    "deriveBits",
  ]);

  const bits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-512",
      salt: Uint8Array.from(salt),
      info: new TextEncoder().encode(info),
    },
    baseKey,
    256,
  );

  const seed = new Uint8Array(bits);
  const publicKey = ed25519.getPublicKey(seed);

  const pkcs8 = new Uint8Array([...Ed25519PrivateKeyPKCS8Envelope, ...seed]);

  const privateKey = await crypto.subtle.importKey("pkcs8", pkcs8, "Ed25519", false, ["sign"]);

  return { publicKey, privateKey };
}
