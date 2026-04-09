import { json } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = json({ success: true });
  res.headers.set(
    "Set-Cookie",
    `${AUTH_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
  );
  return res;
}
