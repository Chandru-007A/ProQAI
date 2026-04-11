import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("[Auth] JWT_SECRET not set - using fallback. Set JWT_SECRET in Vercel environment variables!");
}

const secret = new TextEncoder().encode(
  JWT_SECRET || "fallback-secret-change-in-production"
);

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  vendorId?: string | null;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE = "proqai_token";
