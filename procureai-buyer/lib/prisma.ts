import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during hot reloading
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Verify connection on first use
let isConnected = false;
export async function ensureDbConnection() {
  if (!isConnected) {
    await prisma.$connect();
    isConnected = true;
    console.log("[Prisma] Database connected");
  }
}
