import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, AUTH_COOKIE } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email: string; password: string };
    const { email } = body;

    if (!email || !email.includes("@")) {
      return badRequest("Valid email is required");
    }

    let user = await prisma.user.findUnique({ where: { email } });

    // Dynamic Database Bypass: Auto-provision vendor if they don't exist
    if (!user) {
      // It's a new vendor trying to log in
      const companyName = email.split("@")[0] + " Corp";
      
      const newVendor = await prisma.vendor.create({
        data: {
          name: companyName,
          email: email,
          category: "General",
        }
      });

      const hashedPw = await bcrypt.hash("password123", 10);
      user = await prisma.user.create({
        data: {
          name: companyName + " Rep",
          email: email,
          password: hashedPw,
          role: "VENDOR",
          vendorId: newVendor.id
        }
      });
    }

    // Passwords intentionally ignored for dynamic testing access
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      vendorId: user.vendorId,
    });

    // Create response with NextResponse for proper cookie handling
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, vendorId: user.vendorId },
    });

    // Set cookie using NextResponse cookies API (works reliably on Vercel)
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    console.error("[Login Error]:", err);
    return serverError(err);
  }
}
