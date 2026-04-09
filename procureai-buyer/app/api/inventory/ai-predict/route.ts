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

    // Persist predictions back to DB
    for (const [sku, pred] of Object.entries(predictions)) {
      await prisma.inventoryItem.updateMany({
        where: { sku },
        data: { aiPrediction: `${pred.urgency === "high" ? "🔴 Urgent:" : pred.urgency === "medium" ? "🟡" : "🟢"} ${pred.prediction}` },
      });
    }

    return json({ predictions });
  } catch (err) {
    return serverError(err);
  }
}
