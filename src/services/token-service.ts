import type { JwtSigningClaims } from "@/types/jwt.js";
import * as jose from "jose";
import { JWT_SIGNING_KEY } from "@/config/config.js";

export async function signToken(payload: JwtSigningClaims): Promise<string> {
  return new jose.SignJWT(payload as jose.JWTPayload)
    .setProtectedHeader({ alg: "EdDSA" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SIGNING_KEY);
}
