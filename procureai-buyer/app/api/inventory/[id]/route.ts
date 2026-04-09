import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError, notFound } from "@/lib/api";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user || user.role === "VENDOR") return unauthorized();

  const { id } = await params;
  try {
    const body = await req.json();
    const stock = body.currentStock !== undefined ? Number(body.currentStock) : undefined;
    const reorder = body.reorderLevel !== undefined ? Number(body.reorderLevel) : undefined;

    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) return notFound();

    const newStock  = stock  ?? existing.currentStock;
    const newReorder = reorder ?? existing.reorderLevel;
    const status = newStock === 0 ? "OUT_OF_STOCK" : newStock <= newReorder ? "LOW_STOCK" : "IN_STOCK";

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { ...body, currentStock: newStock, reorderLevel: newReorder, status, lastUpdated: new Date() },
    });
    return json(item);
  } catch (err) {
    return serverError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user || user.role === "VENDOR") return unauthorized();

  const { id } = await params;
  try {
    await prisma.inventoryItem.delete({ where: { id } });
    return json({ success: true });
  } catch (err) {
    return serverError(err);
  }
}
