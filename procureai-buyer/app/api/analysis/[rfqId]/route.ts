import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError, notFound } from "@/lib/api";
import { rankVendors, BidSignal } from "@/lib/gemini";

export async function GET(req: NextRequest, { params }: { params: Promise<{ rfqId: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const { rfqId } = await params;
  try {
    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: { items: true },
    });
    if (!rfq) return notFound("RFQ not found");

    const bids = await prisma.bid.findMany({
      where: { rfqId },
      include: { vendor: true },
    });

    if (!bids.length) return json({ rfq, bids: [], ranking: [] });

    // Build bid signals for AI ranking
    const signals: BidSignal[] = bids.map((b) => ({
      vendorId: b.vendorId,
      vendorName: b.vendor.name,
      price: b.price,
      rating: b.vendor.rating,
      deliveryDays: b.deliveryDays ?? 7,
      qualityScore: b.qualityScore ?? 80,
    }));

    const ranking = await rankVendors(rfq.title, rfq.budget ?? 0, signals);

    // Persist AI rank/score back to bids
    for (const r of ranking) {
      await prisma.bid.updateMany({
        where: { rfqId, vendorId: r.vendorId },
        data: { aiScore: r.aiScore, aiRank: r.rank, aiReason: r.reason },
      });
    }

    const enrichedBids = bids.map((b) => {
      const rank = ranking.find((r) => r.vendorId === b.vendorId);
      return { ...b, aiScore: rank?.aiScore, aiRank: rank?.rank, aiReason: rank?.reason, savings: rank?.savings ?? 0 };
    }).sort((a, b) => (a.aiRank ?? 99) - (b.aiRank ?? 99));

    // Identify the winner
    const winner = enrichedBids[0];
    const recommendation = winner
      ? `Based on price competitiveness, quality score, and delivery performance, ${winner.vendor.name} is the best value vendor for this RFQ. Estimated savings: ₹${winner.savings?.toLocaleString("en-IN") ?? 0}.`
      : "No bids received yet.";

    return json({ rfq, bids: enrichedBids, ranking, recommendation, winner });
  } catch (err) {
    return serverError(err);
  }
}
