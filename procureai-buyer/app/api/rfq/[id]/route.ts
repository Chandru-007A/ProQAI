import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError, notFound, badRequest } from "@/lib/api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const { id } = await params;
  try {
    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: {
        items: true,
        vendors: { include: { vendor: true } },
        bids: { include: { vendor: true } },
      },
    });
    if (!rfq) return notFound("RFQ not found");
    return json(rfq);
  } catch (err) {
    return serverError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user || user.role === "VENDOR") return unauthorized();

  const { id } = await params;
  try {
    const body = await req.json();
    const rfq = await prisma.rFQ.update({ where: { id }, data: body });
    return json(rfq);
  } catch (err) {
    return serverError(err);
  }
}
