import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, json, unauthorized, serverError, badRequest } from "@/lib/api";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  try {
    const where = user.role === "VENDOR" && user.vendorId
      ? { vendors: { some: { vendorId: user.vendorId } }, status: { in: ["SENT", "CLOSED"] } }
      : {};

    const rfqs = await prisma.rFQ.findMany({
      where,
      include: {
        items: true,
        vendors: { include: { vendor: true } },
        bids: { include: { vendor: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return json(rfqs);
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role === "VENDOR") return unauthorized();

  try {
    const body = await req.json();
    const { title, description, budget, deadline, items, vendorIds } = body;
    if (!title) return badRequest("Title is required");
    if (!items?.length) return badRequest("At least one item is required");

    const rfq = await prisma.rFQ.create({
      data: {
        title,
        description,
        budget: budget ? parseFloat(String(budget)) : null,
        deadline: deadline ? new Date(deadline) : null,
        status: "DRAFT",
        items: {
          create: items.map((i: { name: string; qty: string; unit: string; estPrice: string }) => ({
            name: i.name,
            qty: parseFloat(i.qty) || 1,
            unit: i.unit || "Units",
            estPrice: i.estPrice ? parseFloat(i.estPrice) : null,
          })),
        },
        vendors: vendorIds?.length
          ? { create: vendorIds.map((vid: string) => ({ vendorId: vid })) }
          : undefined,
      },
      include: { items: true, vendors: true },
    });
    return json(rfq, 201);
  } catch (err) {
    return serverError(err);
  }
}
