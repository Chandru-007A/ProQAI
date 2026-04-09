import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError, notFound, badRequest } from "@/lib/api";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user || user.role === "VENDOR") return unauthorized();

  const { id } = await params;
  try {
    const rfq = await prisma.rFQ.findUnique({ where: { id } });
    if (!rfq) return notFound();
    if (rfq.status !== "REVIEW") return badRequest("RFQ must be in REVIEW status to approve");

    const updated = await prisma.rFQ.update({
      where: { id },
      data: { status: "APPROVED", approvedBy: user.name, approvedAt: new Date() },
    });
    return json(updated);
  } catch (err) {
    return serverError(err);
  }
}
