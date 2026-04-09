import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/api";
import { json, unauthorized } from "@/lib/api";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();
  return json({ user });
}
