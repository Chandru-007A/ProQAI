import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError, badRequest } from "@/lib/api";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return json(items);
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role === "VENDOR") return unauthorized();

  try {
    const body = await req.json();
    const { name, sku, category, currentStock, reorderLevel, unit } = body;
    if (!name || !sku || !category) return badRequest("name, sku, category required");

    const stock = Number(currentStock) || 0;
    const reorder = Number(reorderLevel) || 10;
    const status = stock === 0 ? "OUT_OF_STOCK" : stock <= reorder ? "LOW_STOCK" : "IN_STOCK";

    const item = await prisma.inventoryItem.create({
      data: { name, sku, category, currentStock: stock, reorderLevel: reorder, unit: unit || "Units", status },
    });
    return json(item, 201);
  } catch (err) {
    return serverError(err);
  }
}
