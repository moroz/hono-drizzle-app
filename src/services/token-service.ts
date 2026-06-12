import type { JwtSigningClaims } from "@/types/jwt.js";
import * as jose from "jose";
import { JWT_SIGNING_KEY, JWT_VERIFYING_KEY } from "@/config/config.js";
import type { User } from "@db/schema.js";

export function signToken(payload: JwtSigningClaims): Promise<string> {
  return new jose.SignJWT(payload as jose.JWTPayload)
    .setProtectedHeader({ alg: "EdDSA" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SIGNING_KEY);
}

export function issueTokenForUser(user: User): Promise<string> {
  return signToken({
    sub: user.id,
  });
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_VERIFYING_KEY, {});
    return payload;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function peekExpirationTime(token: string): Temporal.Instant {
  const claims = jose.decodeJwt(token);
  if (!claims.iat) {
    throw new Error("The provided token does not contain an iat claim");
  }
  return Temporal.Instant.fromEpochMilliseconds(claims.iat * 1000);
}
