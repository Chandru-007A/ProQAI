import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ProQ.AI database...");

  // ─── Vendors ──────────────────────────────────────────────
  const vendors = await Promise.all([
    prisma.vendor.upsert({
      where: { email: "techvendors@example.com" },
      update: {},
      create: { name: "TechVendors Co.", email: "techvendors@example.com", category: "IT Supplies", rating: 4.6 },
    }),
    prisma.vendor.upsert({
      where: { email: "primestar@example.com" },
      update: {},
      create: { name: "PrimeStar Traders", email: "primestar@example.com", category: "Stationery", rating: 4.8 },
    }),
    prisma.vendor.upsert({
      where: { email: "global@example.com" },
      update: {},
      create: { name: "Global Supplies Ltd.", email: "global@example.com", category: "General", rating: 4.4 },
    }),
    prisma.vendor.upsert({
      where: { email: "fasttrack@example.com" },
      update: {},
      create: { name: "FastTrack Logistics", email: "fasttrack@example.com", category: "Logistics", rating: 4.3 },
    }),
    prisma.vendor.upsert({
      where: { email: "bestbuy@example.com" },
      update: {},
      create: { name: "BestBuy Wholesale", email: "bestbuy@example.com", category: "General", rating: 4.7 },
    }),
    prisma.vendor.upsert({
      where: { email: "smartsource@example.com" },
      update: {},
      create: { name: "SmartSource India", email: "smartsource@example.com", category: "IT Supplies", rating: 4.4 },
    }),
  ]);

  console.log(`✅ ${vendors.length} vendors created`);

  // ─── Users ────────────────────────────────────────────────
  const hash = async (pw: string) => bcrypt.hash(pw, 10);

  await prisma.user.upsert({
    where: { email: "buyer@proq.ai" },
    update: {},
    create: { name: "Arjun Mehta", email: "buyer@proq.ai", password: await hash("password123"), role: "BUYER" },
  });

  await prisma.user.upsert({
    where: { email: "vendor1@techvendors.com" },
    update: {},
    create: { name: "Priya Sharma", email: "vendor1@techvendors.com", password: await hash("password123"), role: "VENDOR", vendorId: vendors[0].id },
  });

  await prisma.user.upsert({
    where: { email: "vendor2@primestar.com" },
    update: {},
    create: { name: "Rahul Gupta", email: "vendor2@primestar.com", password: await hash("password123"), role: "VENDOR", vendorId: vendors[1].id },
  });

  await prisma.user.upsert({
    where: { email: "vendor3@global.com" },
    update: {},
    create: { name: "Sneha Iyer", email: "vendor3@global.com", password: await hash("password123"), role: "VENDOR", vendorId: vendors[2].id },
  });

  await prisma.user.upsert({
    where: { email: "vendor4@fasttrack.com" },
    update: {},
    create: { name: "Kiran Patel", email: "vendor4@fasttrack.com", password: await hash("password123"), role: "VENDOR", vendorId: vendors[3].id },
  });

  await prisma.user.upsert({
    where: { email: "vendor5@bestbuy.com" },
    update: {},
    create: { name: "Ravi Kumar", email: "vendor5@bestbuy.com", password: await hash("password123"), role: "VENDOR", vendorId: vendors[4].id },
  });

  await prisma.user.upsert({
    where: { email: "vendor6@smartsource.com" },
    update: {},
    create: { name: "Anita Singh", email: "vendor6@smartsource.com", password: await hash("password123"), role: "VENDOR", vendorId: vendors[5].id },
  });

  console.log("✅ 7 users created (1 buyer, 6 vendors)");

  // ─── Inventory ────────────────────────────────────────────
  const inventoryItems = [
    { name: "Printer Paper A4", sku: "PPR-A4-001", category: "Stationery", currentStock: 12, reorderLevel: 50, unit: "Reams", status: "LOW_STOCK" },
    { name: "Office Chair — Ergonomic", sku: "FRN-CHR-002", category: "Furniture", currentStock: 8, reorderLevel: 5, unit: "Units", status: "IN_STOCK" },
    { name: "Toner Cartridge (Black)", sku: "INK-BLK-003", category: "IT Supplies", currentStock: 0, reorderLevel: 10, unit: "Units", status: "OUT_OF_STOCK" },
    { name: "Sticky Notes (Pack)", sku: "STT-YLW-004", category: "Stationery", currentStock: 145, reorderLevel: 30, unit: "Packs", status: "IN_STOCK" },
    { name: "USB-C Hub 7-Port", sku: "IT-HUB-005", category: "IT Supplies", currentStock: 3, reorderLevel: 8, unit: "Units", status: "LOW_STOCK" },
    { name: "Whiteboard Markers", sku: "MRK-WHT-006", category: "Stationery", currentStock: 64, reorderLevel: 20, unit: "Packs", status: "IN_STOCK" },
    { name: "Laptop Stand — Adjustable", sku: "IT-STD-007", category: "IT Supplies", currentStock: 0, reorderLevel: 5, unit: "Units", status: "OUT_OF_STOCK" },
    { name: "Hand Sanitizer (5L)", sku: "SAN-LIQ-008", category: "Hygiene", currentStock: 20, reorderLevel: 10, unit: "Bottles", status: "IN_STOCK" },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: item as Parameters<typeof prisma.inventoryItem.create>[0]["data"],
    });
  }
  console.log(`✅ ${inventoryItems.length} inventory items created`);

  // ─── RFQ + Bids ───────────────────────────────────────────
  const rfq = await prisma.rFQ.create({
    data: {
      title: "Q2 Office Stationery Procurement",
      description: "Quarterly replenishment of office stationery items for 3 office locations.",
      budget: 60000,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "SENT",
      sentAt: new Date(),
      approvedBy: "Arjun Mehta",
      approvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      items: {
        create: [
          { name: "Printer Paper A4", qty: 200, unit: "Reams", estPrice: 150 },
          { name: "Sticky Notes", qty: 50, unit: "Packs", estPrice: 80 },
          { name: "Whiteboard Markers", qty: 30, unit: "Packs", estPrice: 120 },
        ],
      },
      vendors: {
        create: [
          { vendorId: vendors[0].id },
          { vendorId: vendors[1].id },
          { vendorId: vendors[2].id },
        ],
      },
    },
  });

  // Create bids
  await prisma.bid.createMany({
    data: [
      { rfqId: rfq.id, vendorId: vendors[0].id, price: 52000, notes: "Can deliver in 3 working days", deliveryDays: 3, qualityScore: 91, status: "SUBMITTED", aiRank: 2, aiScore: 81.2 },
      { rfqId: rfq.id, vendorId: vendors[1].id, price: 47500, notes: "Best price guaranteed, ISO certified", deliveryDays: 2, qualityScore: 96, status: "SUBMITTED", aiRank: 1, aiScore: 91.5 },
      { rfqId: rfq.id, vendorId: vendors[2].id, price: 55000, notes: "Includes free delivery and packaging", deliveryDays: 5, qualityScore: 88, status: "SUBMITTED", aiRank: 3, aiScore: 72.0 },
    ],
  });

  console.log("✅ RFQ with bids created");
  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login credentials:");
  console.log("  Buyer:          buyer@proq.ai             / password123");
  console.log("  Vendor (Tech):  vendor1@techvendors.com   / password123");
  console.log("  Vendor (Prime): vendor2@primestar.com     / password123");
  console.log("  Vendor (Global):vendor3@global.com        / password123");
  console.log("  Vendor (Fast):  vendor4@fasttrack.com     / password123");
  console.log("  Vendor (Best):  vendor5@bestbuy.com       / password123");
  console.log("  Vendor (Smart): vendor6@smartsource.com   / password123");
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
