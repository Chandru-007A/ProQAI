import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError, badRequest } from "@/lib/api";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const rfqId = new URL(req.url).searchParams.get("rfqId");

  try {
    const bids = await prisma.bid.findMany({
      where: rfqId ? { rfqId } : user.role === "VENDOR" && user.vendorId ? { vendorId: user.vendorId } : {},
      include: { vendor: true, rfq: { include: { items: true } } },
      orderBy: { createdAt: "desc" },
    });
    return json(bids);
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "VENDOR") return unauthorized();

  try {
    const body = await req.json();
    const { rfqId, price, notes, deliveryDays, qualityScore } = body;
    if (!rfqId || !price) return badRequest("rfqId and price are required");
    if (!user.vendorId) return badRequest("Vendor account not linked");

    const bid = await prisma.bid.upsert({
      where: { rfqId_vendorId: { rfqId, vendorId: user.vendorId } },
      create: {
        rfqId,
        vendorId: user.vendorId,
        price: parseFloat(String(price)),
        notes,
        deliveryDays: deliveryDays ? parseInt(String(deliveryDays)) : null,
        qualityScore: qualityScore ? parseFloat(String(qualityScore)) : null,
        status: "SUBMITTED",
      },
      update: {
        price: parseFloat(String(price)),
        notes,
        deliveryDays: deliveryDays ? parseInt(String(deliveryDays)) : null,
        qualityScore: qualityScore ? parseFloat(String(qualityScore)) : null,
      },
      include: { vendor: true },
    });
    return json(bid, 201);
  } catch (err) {
    return serverError(err);
  }
}
