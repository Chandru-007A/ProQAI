import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError } from "@/lib/api";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  try {
    const vendors = await prisma.vendor.findMany({ orderBy: { name: "asc" } });
    return json(vendors);
  } catch (err) {
    return serverError(err);
  }
}
