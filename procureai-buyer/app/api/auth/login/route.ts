import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, AUTH_COOKIE } from "@/lib/auth";
import { json, badRequest, serverError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email: string; password: string };
    const { email, password } = body;

    if (!email || !password) {
      return badRequest("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return badRequest("Invalid email or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return badRequest("Invalid email or password");

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      vendorId: user.vendorId,
    });

    const res = json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, vendorId: user.vendorId },
    });

    res.headers.set(
      "Set-Cookie",
      `${AUTH_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return res;
  } catch (err) {
    return serverError(err);
  }
}
