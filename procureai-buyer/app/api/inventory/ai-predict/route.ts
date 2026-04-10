import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError } from "@/lib/api";
import { predictDemand } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  try {
    const items = await prisma.inventoryItem.findMany();
    const signals = items.map((i) => ({
      name: i.name,
      sku: i.sku,
      currentStock: i.currentStock,
      reorderLevel: i.reorderLevel,
      unit: i.unit,
    }));

    const predictions = await predictDemand(signals);

    // Persist predictions back to DB and Auto-Generate RFQ
    const highUrgencyItems = [];

    for (const [sku, pred] of Object.entries(predictions)) {
      await prisma.inventoryItem.updateMany({
        where: { sku },
        data: { aiPrediction: `${pred.urgency === "high" ? "🔴 Urgent:" : pred.urgency === "medium" ? "🟡" : "🟢"} ${pred.prediction}` },
      });

      if (pred.urgency === "high") {
        const item = items.find((i) => i.sku === sku);
        if (item) highUrgencyItems.push(item);
      }
    }

    if (highUrgencyItems.length > 0) {
      await prisma.rFQ.create({
        data: {
          title: `Auto-Generated RFQ for Urgent Restock (${new Date().toLocaleDateString()})`,
          description: `AI detected urgent demand for ${highUrgencyItems.map((i) => i.name).join(", ")}.`,
          status: "REVIEW",
          items: {
            create: highUrgencyItems.map((i) => ({
              name: i.name,
              qty: i.reorderLevel * 2 || 10,
              unit: i.unit,
            })),
          },
        },
      });
    }

    return json({ predictions });
  } catch (err) {
    return serverError(err);
  }
}
