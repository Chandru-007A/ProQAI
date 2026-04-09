import { NextRequest } from "next/server";
import { verifyToken, AUTH_COOKIE, JWTPayload } from "./auth";

/** Read the current user from the request cookie. Returns null if no valid token. */
export async function getCurrentUser(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Standard JSON response helpers */
export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function notFound(msg = "Not found") {
  return Response.json({ error: msg }, { status: 404 });
}

export function badRequest(msg: string) {
  return Response.json({ error: msg }, { status: 400 });
}

export function serverError(err: unknown) {
  console.error("[API Error]", err);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
