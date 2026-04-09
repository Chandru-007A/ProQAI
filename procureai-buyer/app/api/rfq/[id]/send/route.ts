import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError, notFound, badRequest } from "@/lib/api";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user || user.role === "VENDOR") return unauthorized();

  const { id } = await params;
  try {
    const rfq = await prisma.rFQ.findUnique({ where: { id }, include: { vendors: { include: { vendor: true } } } });
    if (!rfq) return notFound();
    if (rfq.status !== "APPROVED") return badRequest("RFQ must be approved before sending");

    const updated = await prisma.rFQ.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date() },
    });

    // In production: trigger email/notification to each vendor
    const vendorNames = rfq.vendors.map((v) => v.vendor.name);
    return json({ rfq: updated, notifiedVendors: vendorNames });
  } catch (err) {
    return serverError(err);
  }
}
