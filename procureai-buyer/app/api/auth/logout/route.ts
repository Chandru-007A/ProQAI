import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear cookie using NextResponse cookies API
  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
