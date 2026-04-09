import { NextRequest } from "next/server";
import { getCurrentUser, json, unauthorized, serverError, badRequest } from "@/lib/api";
import { suggestQuote } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "VENDOR") return unauthorized();

  try {
    const body = await req.json();
    const { rfqId } = body;
    if (!rfqId) return badRequest("rfqId required");

    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: { items: true },
    });
    if (!rfq) return json({ error: "RFQ not found" }, 404);

    const vendor = user.vendorId
      ? await prisma.vendor.findUnique({ where: { id: user.vendorId } })
      : null;

    const suggestion = await suggestQuote({
      rfqTitle: rfq.title,
      budget: rfq.budget ?? 100000,
      items: rfq.items.map((i) => ({ name: i.name, qty: i.qty, unit: i.unit })),
      vendorCategory: vendor?.category ?? "General",
      vendorRating: vendor?.rating ?? 4.0,
    });

    return json(suggestion);
  } catch (err) {
    return serverError(err);
  }
}
