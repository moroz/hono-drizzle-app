import { describe, it, expect } from "vitest";
import { signToken } from "./token-service.js";

describe("signToken", () => {
  it("returns a JWT string", async () => {
    const token = await signToken({ sub: "user-123" });
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });
});
