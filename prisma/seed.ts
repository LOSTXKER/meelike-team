/**
 * Prisma seed script — CLI entry point for `npx prisma db seed`
 *
 * Runs in standalone mode (creates its own seed users).
 * For user-aware seeding (data linked to logged-in seller), use the DevTools panel.
 *
 * To run:  npx prisma db seed
 * To reset + seed:  npx prisma migrate reset
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

// ──────────────────────────────────────────────
// CLEAR ALL (preserves @meelike.com auth users)
// ──────────────────────────────────────────────

async function clearAll() {
  await prisma.contentReport.deleteMany();
  await prisma.storeReview.deleteMany();
  await prisma.store.deleteMany();
  await prisma.outsourceBid.deleteMany();
  await prisma.outsourceJob.deleteMany();
  await prisma.hubPost.deleteMany();
  await prisma.jobClaim.deleteMany();
  await prisma.job.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.teamJoinRequest.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.overageBill.deleteMany();
  await prisma.orderUsage.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.paymentSchedule.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.workerAccount.deleteMany();
  await prisma.sellerMeeLikeConfig.deleteMany();
  await prisma.worker.deleteMany({ where: { user: { email: { not: { endsWith: "@meelike.com" } } } } });
  await prisma.seller.deleteMany({ where: { user: { email: { not: { endsWith: "@meelike.com" } } } } });
  await prisma.user.deleteMany({ where: { email: { not: { endsWith: "@meelike.com" } } } });
}

// ──────────────────────────────────────────────
// SEED (standalone mode — creates its own users)
// ──────────────────────────────────────────────

async function seed() {
  const SELLER_USER_ID = "10000000-0000-0000-0000-000000000001";
  const WORKER_IDS = [
    "20000000-0000-0000-0000-000000000001",
    "20000000-0000-0000-0000-000000000002",
    "20000000-0000-0000-0000-000000000003",
  ];

  // Seller user
  const existingUser = await prisma.user.findUnique({ where: { id: SELLER_USER_ID } });
  if (!existingUser) {
    await prisma.user.create({ data: { id: SELLER_USER_ID, email: "seller1@seed.local", name: "มณี ใจดี (seed)", role: "seller" } });
  }
  let seller = await prisma.seller.findUnique({ where: { userId: SELLER_USER_ID } });
  if (!seller) {
    seller = await prisma.seller.create({ data: { userId: SELLER_USER_ID, displayName: "ทีม มณี โซเชียล", slug: "mani-social-seed", plan: "pro" } });
  }

  // Worker users
  const workerMeta = [
    { email: "worker1@seed.local", name: "นิด ขยัน", display: "นิด ขยัน", level: "gold" as const, totalJobs: 58, totalEarned: 8700, completionRate: 97 },
    { email: "worker2@seed.local", name: "เบิ้ล มือโปร", display: "เบิ้ล มือโปร", level: "silver" as const, totalJobs: 23, totalEarned: 3450, completionRate: 92 },
    { email: "worker3@seed.local", name: "ฟ้า หัดใหม่", display: "ฟ้า หัดใหม่", level: "bronze" as const, totalJobs: 5, totalEarned: 750, completionRate: 80 },
  ];

  const workers = [];
  for (let i = 0; i < WORKER_IDS.length; i++) {
    const wId = WORKER_IDS[i];
    const wMeta = workerMeta[i];
    const eu = await prisma.user.findUnique({ where: { id: wId } });
    if (!eu) {
      await prisma.user.create({ data: { id: wId, email: wMeta.email, name: wMeta.name, role: "worker" } });
    }
    let w = await prisma.worker.findUnique({ where: { userId: wId } });
    if (!w) {
      w = await prisma.worker.create({ data: { userId: wId, displayName: wMeta.display, level: wMeta.level, totalJobs: wMeta.totalJobs, totalEarned: wMeta.totalEarned, completionRate: wMeta.completionRate } });
    }
    workers.push(w);
  }

  // Team
  const team = await prisma.team.create({
    data: { sellerId: seller.id, name: "ทีม A มณี (seed)", description: "ทีมหลักจาก CLI seed", isActive: true, memberCount: 3, totalJobsCompleted: 40 },
  });
  for (let i = 0; i < workers.length; i++) {
    await prisma.teamMember.create({ data: { teamId: team.id, workerId: workers[i].id, role: i === 0 ? "lead" : "worker", status: "active", jobsCompleted: [30, 10, 0][i] } });
  }

  // Services
  const svc = await prisma.service.create({
    data: { sellerId: seller.id, name: "ไลค์ Facebook โพสต์", platform: "facebook", serviceType: "like", mode: "human", sellPrice: 3.5, minQty: 100, maxQty: 5000, isActive: true, showInStore: true },
  });
  await prisma.service.create({
    data: { sellerId: seller.id, name: "คอมเมนต์ Instagram", platform: "instagram", serviceType: "comment", mode: "human", sellPrice: 8, minQty: 10, maxQty: 500, isActive: true },
  });

  // Order
  const order = await prisma.order.create({
    data: { sellerId: seller.id, orderNumber: "ORD-SEED-0001", customerName: "ลูกค้า Seed", contactType: "line", contactValue: "@seedcustomer", status: "processing", subtotal: 1750, total: 1750, paymentStatus: "paid" },
  });
  const oItem = await prisma.orderItem.create({
    data: { orderId: order.id, serviceId: svc.id, serviceName: svc.name, serviceType: "like", platform: "facebook", targetUrl: "https://facebook.com/example/seed", quantity: 500, unitPrice: 3.5, subtotal: 1750 },
  });
  await prisma.orderTimeline.createMany({ data: [{ orderId: order.id, event: "created", message: "สร้างออเดอร์" }, { orderId: order.id, event: "payment_confirmed", message: "ยืนยันชำระเงิน" }] });

  // Job
  const job = await prisma.job.create({
    data: { sellerId: seller.id, teamId: team.id, orderId: order.id, orderItemId: oItem.id, serviceName: svc.name, platform: "facebook", serviceType: "like", targetUrl: oItem.targetUrl, quantity: 500, pricePerUnit: 2.5, totalPayout: 1250, visibility: "team", status: "in_progress" },
  });
  await prisma.jobClaim.createMany({
    data: [
      { jobId: job.id, workerId: workers[0].id, quantity: 300, earnAmount: 750, status: "submitted" },
      { jobId: job.id, workerId: workers[1].id, quantity: 200, earnAmount: 500, status: "claimed" },
    ],
  });

  // Hub posts
  await prisma.hubPost.createMany({
    data: [
      { authorId: SELLER_USER_ID, type: "recruit", title: "รับสมัครลูกทีม (seed)", content: "ทีม seed กำลังมองหาลูกทีม", tags: ["facebook"], viewCount: 10, replyCount: 2 },
    ],
  });
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────

async function main() {
  console.log("Clearing existing seed data...");
  await clearAll();
  console.log("Seeding...");
  await seed();
  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
