import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function databaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    const isPooler = url.hostname.includes("pooler.supabase.com") || url.port === "6543";
    if (isPooler) {
      if (!url.searchParams.has("pgbouncer")) url.searchParams.set("pgbouncer", "true");
      if (!url.searchParams.has("connection_limit")) url.searchParams.set("connection_limit", "1");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: databaseUrl()
    ? {
        db: {
          url: databaseUrl()
        }
      }
    : undefined
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
