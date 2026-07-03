import { prisma } from "./prisma";

export async function ensureDemoUser() {
  const email = process.env.DEMO_USER_EMAIL || "demo@local.test";
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email }
  });
}
