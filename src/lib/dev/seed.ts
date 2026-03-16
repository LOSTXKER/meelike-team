import { prisma } from "@/lib/prisma";

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────

export interface SeedOptions {
  /** Logged-in seller's Prisma Seller.id — seed data will belong to this seller */
  sellerId?: string;
  /** Logged-in user's Prisma User.id */
  userId?: string;
}

// ──────────────────────────────────────────────
// CLEAR — preserves Supabase Auth-linked users
// ──────────────────────────────────────────────

export async function clearAll() {
  // Delete child tables first (reverse FK order)
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

  // Delete only seed-created workers/sellers/users — preserve @meelike.com (Supabase Auth)
  await prisma.worker.deleteMany({ where: { user: { email: { not: { endsWith: "@meelike.com" } } } } });
  await prisma.seller.deleteMany({ where: { user: { email: { not: { endsWith: "@meelike.com" } } } } });
  await prisma.user.deleteMany({ where: { email: { not: { endsWith: "@meelike.com" } } } });
}

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

const WORKER_SEED_IDS = {
  user1: "20000000-0000-0000-0000-000000000001",
  user2: "20000000-0000-0000-0000-000000000002",
  user3: "20000000-0000-0000-0000-000000000003",
  user4: "20000000-0000-0000-0000-000000000004",
  user5: "20000000-0000-0000-0000-000000000005",
  user6: "20000000-0000-0000-0000-000000000006",
  user7: "20000000-0000-0000-0000-000000000007",
  user8: "20000000-0000-0000-0000-000000000008",
  user9: "20000000-0000-0000-0000-000000000009",
  user10: "20000000-0000-0000-0000-000000000010",
  user11: "20000000-0000-0000-0000-000000000011",
  user12: "20000000-0000-0000-0000-000000000012",
};

const EXTRA_SELLER_IDS = {
  s1: "30000000-0000-0000-0000-000000000001",
  s2: "30000000-0000-0000-0000-000000000002",
  s3: "30000000-0000-0000-0000-000000000003",
  s4: "30000000-0000-0000-0000-000000000004",
  s5: "30000000-0000-0000-0000-000000000005",
  s6: "30000000-0000-0000-0000-000000000006",
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function monthStart() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ──────────────────────────────────────────────
// SEED — user-aware
// ──────────────────────────────────────────────

export async function seedDemo(opts?: SeedOptions) {
  // ── Resolve seller ────────────────────────
  let sellerId: string;
  let sellerUserId: string;

  if (opts?.sellerId && opts?.userId) {
    // API mode: use the logged-in seller
    sellerId = opts.sellerId;
    sellerUserId = opts.userId;
  } else {
    // CLI mode: create a standalone seller
    const STANDALONE_USER_ID = "10000000-0000-0000-0000-000000000001";
    const existing = await prisma.user.findUnique({ where: { id: STANDALONE_USER_ID } });
    if (!existing) {
      await prisma.user.create({
        data: { id: STANDALONE_USER_ID, email: "seller1@seed.local", name: "มณี ใจดี", role: "seller" },
      });
    }
    const existingSeller = await prisma.seller.findUnique({ where: { userId: STANDALONE_USER_ID } });
    if (!existingSeller) {
      const s = await prisma.seller.create({
        data: { userId: STANDALONE_USER_ID, displayName: "ทีม มณี โซเชียล", slug: "mani-social-seed", plan: "pro" },
      });
      sellerId = s.id;
    } else {
      sellerId = existingSeller.id;
    }
    sellerUserId = STANDALONE_USER_ID;
  }

  // ── Workers (always created with fixed IDs, idempotent) ──
  const workerData = [
    { id: WORKER_SEED_IDS.user1, email: "worker1@seed.local", name: "นิด ขยัน", display: "นิด ขยัน", level: "gold" as const, totalJobs: 58, totalEarned: 8700, completionRate: 97, rating: 4.8 },
    { id: WORKER_SEED_IDS.user2, email: "worker2@seed.local", name: "เบิ้ล มือโปร", display: "เบิ้ล มือโปร", level: "silver" as const, totalJobs: 23, totalEarned: 3450, completionRate: 92, rating: 4.5 },
    { id: WORKER_SEED_IDS.user3, email: "worker3@seed.local", name: "ฟ้า หัดใหม่", display: "ฟ้า หัดใหม่", level: "bronze" as const, totalJobs: 5, totalEarned: 750, completionRate: 80, rating: 3.9 },
    { id: WORKER_SEED_IDS.user4, email: "worker4@seed.local", name: "แก้ว สู้งาน", display: "แก้ว สู้งาน", level: "platinum" as const, totalJobs: 120, totalEarned: 18000, completionRate: 99, rating: 4.9 },
    { id: WORKER_SEED_IDS.user5, email: "worker5@seed.local", name: "โอ๋ รับจ๊อบ", display: "โอ๋ รับจ๊อบ", level: "silver" as const, totalJobs: 15, totalEarned: 2250, completionRate: 88, rating: 4.2 },
    { id: WORKER_SEED_IDS.user6, email: "worker6@seed.local", name: "มิ้น ไวไว", display: "มิ้น ไวไว", level: "gold" as const, totalJobs: 75, totalEarned: 11250, completionRate: 95, rating: 4.7 },
    { id: WORKER_SEED_IDS.user7, email: "worker7@seed.local", name: "ต้น รักงาน", display: "ต้น รักงาน", level: "platinum" as const, totalJobs: 200, totalEarned: 30000, completionRate: 98, rating: 4.95 },
    { id: WORKER_SEED_IDS.user8, email: "worker8@seed.local", name: "อุ้ย ทำเพลิน", display: "อุ้ย ทำเพลิน", level: "silver" as const, totalJobs: 32, totalEarned: 4800, completionRate: 90, rating: 4.3 },
    { id: WORKER_SEED_IDS.user9, email: "worker9@seed.local", name: "แนน โซเชียล", display: "แนน โซเชียล", level: "gold" as const, totalJobs: 88, totalEarned: 13200, completionRate: 96, rating: 4.6 },
    { id: WORKER_SEED_IDS.user10, email: "worker10@seed.local", name: "เจ มาร์เก็ต", display: "เจ มาร์เก็ต", level: "bronze" as const, totalJobs: 10, totalEarned: 1500, completionRate: 85, rating: 4.0 },
    { id: WORKER_SEED_IDS.user11, email: "worker11@seed.local", name: "พลอย ดิจิทัล", display: "พลอย ดิจิทัล", level: "gold" as const, totalJobs: 65, totalEarned: 9750, completionRate: 94, rating: 4.65 },
    { id: WORKER_SEED_IDS.user12, email: "worker12@seed.local", name: "กัน ออนไลน์", display: "กัน ออนไลน์", level: "silver" as const, totalJobs: 42, totalEarned: 6300, completionRate: 91, rating: 4.4 },
  ];

  const workers: Array<{ id: string }> = [];
  for (const w of workerData) {
    const existingUser = await prisma.user.findUnique({ where: { id: w.id } });
    if (!existingUser) {
      await prisma.user.create({ data: { id: w.id, email: w.email, name: w.name, role: "worker" } });
    }
    const existingWorker = await prisma.worker.findUnique({ where: { userId: w.id } });
    if (!existingWorker) {
      const created = await prisma.worker.create({
        data: { userId: w.id, displayName: w.display, level: w.level, totalJobs: w.totalJobs, totalEarned: w.totalEarned, completionRate: w.completionRate, rating: w.rating },
      });
      workers.push(created);
    } else {
      workers.push(existingWorker);
    }
  }

  // ── Clear this seller's existing seed data before re-seeding ──
  // Delete in FK order: claims → jobs → timeline → items → orders → services → store stuff → billing
  await prisma.jobClaim.deleteMany({ where: { job: { sellerId } } });
  await prisma.job.deleteMany({ where: { sellerId } });
  await prisma.orderTimeline.deleteMany({ where: { order: { sellerId } } });
  await prisma.orderItem.deleteMany({ where: { order: { sellerId } } });
  await prisma.order.deleteMany({ where: { sellerId } });
  await prisma.service.deleteMany({ where: { sellerId } });
  await prisma.storeReview.deleteMany({ where: { store: { sellerId } } });
  await prisma.store.deleteMany({ where: { sellerId } });
  await prisma.paymentRecord.deleteMany({ where: { sellerId } });
  await prisma.paymentSchedule.deleteMany({ where: { sellerId } });
  await prisma.overageBill.deleteMany({ where: { sellerId } });
  await prisma.orderUsage.deleteMany({ where: { sellerId } });
  await prisma.subscription.deleteMany({ where: { sellerId } });
  await prisma.outsourceBid.deleteMany({ where: { outsourceJob: { sellerId } } });
  await prisma.outsourceJob.deleteMany({ where: { sellerId } });
  await prisma.teamJoinRequest.deleteMany({ where: { team: { sellerId } } });
  await prisma.teamMember.deleteMany({ where: { team: { sellerId } } });
  await prisma.team.deleteMany({ where: { sellerId } });
  await prisma.hubPost.deleteMany({ where: { authorId: sellerUserId } });
  const seedWorkerIds = Object.values(WORKER_SEED_IDS);
  await prisma.workerAccount.deleteMany({ where: { worker: { userId: { in: seedWorkerIds } } } });

  // ── Subscription ──────────────────────────
  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 1);

  const seller = await prisma.seller.findUnique({ where: { id: sellerId } });
  if (seller) {
    await prisma.subscription.create({
      data: {
        sellerId,
        plan: seller.plan,
        status: "active",
        startDate: monthStart(),
        endDate,
        price: seller.plan === "pro" ? 990 : seller.plan === "starter" ? 290 : 0,
        autoRenew: true,
      },
    });
  }

  // ── OrderUsage (current month) ────────────
  await prisma.orderUsage.create({
    data: {
      sellerId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      ordersUsed: 12,
      quotaLimit: seller?.plan === "pro" ? 500 : 50,
    },
  });

  // ── PaymentSchedule ──────────────────────
  await prisma.paymentSchedule.create({
    data: { sellerId, dayOfWeek: 5, isActive: true },
  });

  // ── Team ──────────────────────────────────
  const team = await prisma.team.create({
    data: {
      sellerId,
      name: "ทีม A หลัก",
      description: "ทีมหลักสำหรับงาน engagement",
      isActive: true,
      isRecruiting: true,
      memberCount: 5,
      totalJobsCompleted: 85,
      rating: 4.6,
      ratingCount: 12,
    },
  });

  for (let i = 0; i < workers.length; i++) {
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        workerId: workers[i].id,
        role: i === 0 ? "lead" : "worker",
        status: "active",
        jobsCompleted: [30, 20, 5, 25, 5][i],
        totalEarned: [4500, 3000, 750, 3750, 750][i],
        rating: [4.8, 4.5, 3.9, 4.9, 4.2][i],
      },
    });
  }

  // ── Services ─────────────────────────────
  const servicesData = [
    { name: "ไลค์ Facebook โพสต์", platform: "facebook" as const, serviceType: "like" as const, mode: "human" as const, sellPrice: 3.5, minQty: 100, maxQty: 5000, showInStore: true },
    { name: "คอมเมนต์ Instagram", platform: "instagram" as const, serviceType: "comment" as const, mode: "human" as const, sellPrice: 8, minQty: 10, maxQty: 500, showInStore: true },
    { name: "ฟอลโล่ TikTok", platform: "tiktok" as const, serviceType: "follow" as const, mode: "bot" as const, sellPrice: 1.5, minQty: 500, maxQty: 50000, showInStore: true },
    { name: "วิว YouTube", platform: "youtube" as const, serviceType: "view" as const, mode: "bot" as const, sellPrice: 2, minQty: 1000, maxQty: 100000, showInStore: true },
    { name: "แชร์ Facebook", platform: "facebook" as const, serviceType: "share" as const, mode: "human" as const, sellPrice: 5, minQty: 50, maxQty: 2000, showInStore: false },
    { name: "ไลค์ Instagram โพสต์", platform: "instagram" as const, serviceType: "like" as const, mode: "human" as const, sellPrice: 2.5, minQty: 100, maxQty: 10000, showInStore: true },
  ];

  const services = [];
  for (const s of servicesData) {
    const svc = await prisma.service.create({
      data: { sellerId, ...s, isActive: true },
    });
    services.push(svc);
  }

  // ── Orders (varied statuses) ──────────────
  const sellerPrefix = sellerId.slice(0, 6).toUpperCase();
  const ordersData = [
    { num: `ORD-${sellerPrefix}-0001`, customer: "คุณสมชาย ธุรกิจดี", contact: "@somchai_biz", status: "completed" as const, payStatus: "paid" as const, svcIdx: 0, qty: 500, daysAgo: 7 },
    { num: `ORD-${sellerPrefix}-0002`, customer: "คุณปิยะ ร้านอาหาร", contact: "@piya_food", status: "processing" as const, payStatus: "paid" as const, svcIdx: 1, qty: 30, daysAgo: 3 },
    { num: `ORD-${sellerPrefix}-0003`, customer: "คุณนภา บิวตี้", contact: "@napa_beauty", status: "pending" as const, payStatus: "pending" as const, svcIdx: 2, qty: 2000, daysAgo: 1 },
    { num: `ORD-${sellerPrefix}-0004`, customer: "คุณธนา การตลาด", contact: "@tana_mkt", status: "completed" as const, payStatus: "paid" as const, svcIdx: 3, qty: 5000, daysAgo: 14 },
    { num: `ORD-${sellerPrefix}-0005`, customer: "คุณมานี ครีเอทีฟ", contact: "@manee_create", status: "cancelled" as const, payStatus: "refunded" as const, svcIdx: 4, qty: 100, daysAgo: 10 },
    { num: `ORD-${sellerPrefix}-0006`, customer: "คุณแพร ออนไลน์", contact: "@prae_online", status: "confirmed" as const, payStatus: "paid" as const, svcIdx: 5, qty: 300, daysAgo: 0 },
  ];

  const orders = [];
  const orderItems = [];
  for (const o of ordersData) {
    const svc = services[o.svcIdx];
    const subtotal = svc.sellPrice * o.qty;
    const order = await prisma.order.create({
      data: {
        sellerId,
        orderNumber: o.num,
        customerName: o.customer,
        contactType: "line",
        contactValue: o.contact,
        status: o.status,
        subtotal,
        total: subtotal,
        paymentStatus: o.payStatus,
        createdAt: daysAgo(o.daysAgo),
      },
    });
    orders.push(order);

    const item = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        serviceId: svc.id,
        serviceName: svc.name,
        serviceType: svc.serviceType,
        platform: svc.platform,
        targetUrl: `https://${svc.platform}.com/example/post/${order.id.slice(0, 8)}`,
        quantity: o.qty,
        unitPrice: svc.sellPrice,
        subtotal,
        status: o.status === "completed" ? "completed" : "pending",
        completedQuantity: o.status === "completed" ? o.qty : 0,
      },
    });
    orderItems.push(item);

    // Timeline events
    const events: Array<{ event: string; message: string }> = [{ event: "created", message: "สร้างออเดอร์" }];
    if (o.payStatus === "paid") events.push({ event: "payment_confirmed", message: "ยืนยันการชำระเงิน" });
    if (o.status === "processing") events.push({ event: "processing", message: "กำลังดำเนินการ" });
    if (o.status === "completed") events.push({ event: "completed", message: "ดำเนินการเสร็จสิ้น" });
    if (o.status === "cancelled") events.push({ event: "cancelled", message: "ยกเลิกออเดอร์" });

    await prisma.orderTimeline.createMany({
      data: events.map((e) => ({ orderId: order.id, ...e })),
    });
  }

  // ── Jobs (from processing/completed orders, assigned to team) ──
  const jobOrders = orders.filter((_, i) => ["completed", "processing"].includes(ordersData[i].status));
  const jobs = [];
  for (let i = 0; i < jobOrders.length; i++) {
    const orderIdx = orders.indexOf(jobOrders[i]);
    const svc = services[ordersData[orderIdx].svcIdx];
    const oItem = orderItems[orderIdx];
    const qty = ordersData[orderIdx].qty;
    const isComplete = ordersData[orderIdx].status === "completed";

    const job = await prisma.job.create({
      data: {
        sellerId,
        teamId: team.id,
        orderId: jobOrders[i].id,
        orderItemId: oItem.id,
        title: `${svc.name} — ${ordersData[orderIdx].customer}`,
        serviceName: svc.name,
        platform: svc.platform,
        serviceType: svc.serviceType,
        targetUrl: oItem.targetUrl,
        quantity: qty,
        completedQuantity: isComplete ? qty : Math.floor(qty * 0.6),
        claimedQuantity: qty,
        pricePerUnit: svc.sellPrice * 0.7,
        totalPayout: qty * svc.sellPrice * 0.7,
        visibility: "team",
        status: isComplete ? "completed" : "in_progress",
      },
    });
    jobs.push(job);
  }

  // ── JobClaims ─────────────────────────────
  for (let j = 0; j < jobs.length; j++) {
    const job = jobs[j];
    const claimWorkers = workers.slice(0, 3);
    const totalQty = job.quantity;
    const split = [Math.floor(totalQty * 0.5), Math.floor(totalQty * 0.3), totalQty - Math.floor(totalQty * 0.5) - Math.floor(totalQty * 0.3)];

    for (let w = 0; w < claimWorkers.length; w++) {
      const isJobComplete = job.status === "completed";
      await prisma.jobClaim.create({
        data: {
          jobId: job.id,
          workerId: claimWorkers[w].id,
          quantity: split[w],
          earnAmount: split[w] * job.pricePerUnit,
          status: isJobComplete ? "approved" : (w === 0 ? "submitted" : "claimed"),
          submittedAt: isJobComplete || w === 0 ? daysAgo(2) : undefined,
          reviewedAt: isJobComplete ? daysAgo(1) : undefined,
        },
      });
    }
  }

  // ── PaymentRecords ────────────────────────
  for (let w = 0; w < 3; w++) {
    await prisma.paymentRecord.create({
      data: {
        sellerId,
        workerId: workers[w].id,
        amount: [4500, 3000, 750][w],
        method: "promptpay",
        status: w < 2 ? "confirmed" : "pending",
        confirmedAt: w < 2 ? daysAgo(3) : undefined,
        periodStart: daysAgo(14),
        periodEnd: daysAgo(0),
      },
    });
  }

  // ── Store + Reviews ──────────────────────
  const sellerRecord = await prisma.seller.findUnique({ where: { id: sellerId } });
  const storeSlug = `store-${sellerId.slice(0, 8)}`;

  const store = await prisma.store.create({
    data: {
      sellerId,
      slug: storeSlug,
      name: sellerRecord?.displayName ? `${sellerRecord.displayName} Shop` : "Demo Shop",
      bio: "บริการ Social Media Marketing ครบวงจร ราคาดี งานเร็ว มีทีมคุณภาพ",
      level: "basic",
      isPublic: true,
      showPricing: true,
      showReviews: true,
    },
  });

  const reviewData = [
    { customer: "คุณสมชาย", rating: 5, comment: "งานเร็วมาก คุณภาพดี สั่งซ้ำแน่นอน" },
    { customer: "คุณปิยะ", rating: 4, comment: "ใช้บริการมาหลายครั้ง ราคาสมเหตุสมผล" },
    { customer: "คุณนภา", rating: 5, comment: "ทีมงานตอบเร็ว ทำงานตรงเวลา" },
    { customer: "คุณธนา", rating: 4, comment: "โดยรวมดี แต่อยากให้มี report ละเอียดขึ้น" },
    { customer: "คุณแพร", rating: 5, comment: "แนะนำเลย! engagement เพิ่มขึ้นจริง" },
  ];

  await prisma.storeReview.createMany({
    data: reviewData.map((r) => ({
      storeId: store.id,
      customerName: r.customer,
      rating: r.rating,
      comment: r.comment,
      isVerified: true,
    })),
  });

  // ── Hub Posts ─────────────────────────────
  await prisma.hubPost.createMany({
    data: [
      {
        authorId: sellerUserId,
        type: "recruit" as const,
        title: "รับสมัครลูกทีม Facebook & Instagram",
        content: "กำลังมองหาลูกทีมที่มีประสบการณ์ทำ engagement บน Facebook และ Instagram รับทั้ง Like, Comment, Follow มีงานต่อเนื่อง",
        platforms: ["facebook", "instagram"],
        tags: ["facebook", "instagram", "like", "comment", "รับสมัคร"],
        viewCount: 42,
        replyCount: 8,
      },
      {
        authorId: sellerUserId,
        type: "outsource" as const,
        title: "หาทีมรับงาน TikTok Follow",
        content: "มีออเดอร์ TikTok Follow เข้ามาต่อเนื่อง ต้องการทีมที่รับงาน 5,000-10,000 follow ได้ภายใน 3 วัน",
        platforms: ["tiktok"],
        tags: ["tiktok", "follow", "โยนงาน"],
        viewCount: 18,
        replyCount: 3,
      },
    ],
  });

  // ── Worker Accounts ──────────────────────
  await prisma.workerAccount.createMany({
    data: [
      { workerId: workers[0].id, platform: "facebook", username: "nid.social.fb", verificationStatus: "approved", followers: 2500, isActive: true, jobsCompleted: 30 },
      { workerId: workers[0].id, platform: "instagram", username: "nid_ig_work", verificationStatus: "approved", followers: 1800, isActive: true, jobsCompleted: 15 },
      { workerId: workers[1].id, platform: "facebook", username: "bern.pro.fb", verificationStatus: "approved", followers: 1200, isActive: true, jobsCompleted: 20 },
      { workerId: workers[3].id, platform: "tiktok", username: "kaew_tiktok", verificationStatus: "approved", followers: 5000, isActive: true, jobsCompleted: 45 },
    ],
  });

  // ══════════════════════════════════════════
  // LEADERBOARD SEED — extra sellers, teams, orders, jobs
  // ══════════════════════════════════════════

  const extraSellersData = [
    { id: EXTRA_SELLER_IDS.s1, email: "seller-a@seed.local", name: "สมศักดิ์ ดิจิทัล", display: "สมศักดิ์ ดิจิทัล", slug: "somsak-digital-seed", plan: "business" as const },
    { id: EXTRA_SELLER_IDS.s2, email: "seller-b@seed.local", name: "จิรา มาร์เก็ตติ้ง", display: "จิรา มาร์เก็ตติ้ง", slug: "jira-marketing-seed", plan: "pro" as const },
    { id: EXTRA_SELLER_IDS.s3, email: "seller-c@seed.local", name: "ณัฐ ครีเอทีฟ", display: "ณัฐ ครีเอทีฟ", slug: "nat-creative-seed", plan: "enterprise" as const },
    { id: EXTRA_SELLER_IDS.s4, email: "seller-d@seed.local", name: "ปิยะ โซเชียลโปร", display: "ปิยะ โซเชียลโปร", slug: "piya-socialpro-seed", plan: "pro" as const },
    { id: EXTRA_SELLER_IDS.s5, email: "seller-e@seed.local", name: "วรรณ เอเจนซี่", display: "วรรณ เอเจนซี่", slug: "wan-agency-seed", plan: "starter" as const },
    { id: EXTRA_SELLER_IDS.s6, email: "seller-f@seed.local", name: "ภูมิ บูสต์ทีม", display: "ภูมิ บูสต์ทีม", slug: "poom-boost-seed", plan: "business" as const },
  ];

  const extraSellerIds: string[] = [];
  for (const s of extraSellersData) {
    const existingUser = await prisma.user.findUnique({ where: { id: s.id } });
    if (!existingUser) {
      await prisma.user.create({ data: { id: s.id, email: s.email, name: s.name, role: "seller" } });
    }
    const existingSeller = await prisma.seller.findUnique({ where: { userId: s.id } });
    if (!existingSeller) {
      const created = await prisma.seller.create({
        data: { userId: s.id, displayName: s.display, slug: s.slug, plan: s.plan },
      });
      extraSellerIds.push(created.id);
    } else {
      extraSellerIds.push(existingSeller.id);
    }
  }

  // Clean old leaderboard seed data for extra sellers
  for (const esId of extraSellerIds) {
    await prisma.job.deleteMany({ where: { sellerId: esId } });
    await prisma.orderTimeline.deleteMany({ where: { order: { sellerId: esId } } });
    await prisma.orderItem.deleteMany({ where: { order: { sellerId: esId } } });
    await prisma.order.deleteMany({ where: { sellerId: esId } });
    await prisma.service.deleteMany({ where: { sellerId: esId } });
    await prisma.teamMember.deleteMany({ where: { team: { sellerId: esId } } });
    await prisma.team.deleteMany({ where: { sellerId: esId } });
  }

  // Create services + completed orders for each extra seller (varied amounts for ranking)
  const completedOrderCounts = [18, 12, 25, 8, 5, 15];
  for (let si = 0; si < extraSellerIds.length; si++) {
    const esId = extraSellerIds[si];
    const prefix = esId.slice(0, 6).toUpperCase();

    const svc = await prisma.service.create({
      data: {
        sellerId: esId,
        name: "ไลค์ Facebook",
        platform: "facebook",
        serviceType: "like",
        mode: "human",
        sellPrice: 3,
        minQty: 100,
        maxQty: 5000,
        isActive: true,
        showInStore: false,
      },
    });

    const orderCount = completedOrderCounts[si];
    for (let oi = 0; oi < orderCount; oi++) {
      const createdDate = daysAgo(Math.floor(Math.random() * 25));
      await prisma.order.create({
        data: {
          sellerId: esId,
          orderNumber: `ORD-${prefix}-LB${String(oi + 1).padStart(3, "0")}`,
          customerName: `ลูกค้า ${oi + 1}`,
          contactType: "line",
          contactValue: `@cust${oi + 1}`,
          status: "completed",
          subtotal: 300,
          total: 300,
          paymentStatus: "paid",
          createdAt: createdDate,
        },
      });
    }
  }

  // Create extra teams for leaderboard
  const extraTeamsData = [
    { sellIdx: 0, name: "ทีม Alpha Digital", members: 8, completed: 150, rating: 4.8, ratingCount: 25 },
    { sellIdx: 1, name: "ทีม Beta Marketing", members: 5, completed: 95, rating: 4.5, ratingCount: 18 },
    { sellIdx: 2, name: "ทีม Gamma Creative", members: 12, completed: 220, rating: 4.9, ratingCount: 40 },
    { sellIdx: 3, name: "ทีม Delta Social", members: 4, completed: 45, rating: 4.2, ratingCount: 10 },
    { sellIdx: 5, name: "ทีม Zeta Boost", members: 6, completed: 110, rating: 4.6, ratingCount: 20 },
  ];

  const extraTeams = [];
  for (const t of extraTeamsData) {
    const created = await prisma.team.create({
      data: {
        sellerId: extraSellerIds[t.sellIdx],
        name: t.name,
        isActive: true,
        isRecruiting: true,
        memberCount: t.members,
        totalJobsCompleted: t.completed,
        rating: t.rating,
        ratingCount: t.ratingCount,
      },
    });
    extraTeams.push(created);
  }

  // Add some workers as members of extra teams
  const teamWorkerAssignments = [
    { teamIdx: 0, workerIdxs: [5, 6, 7] },
    { teamIdx: 1, workerIdxs: [8, 9] },
    { teamIdx: 2, workerIdxs: [10, 11] },
    { teamIdx: 3, workerIdxs: [3] },
    { teamIdx: 4, workerIdxs: [0, 1] },
  ];
  for (const assign of teamWorkerAssignments) {
    for (let wi = 0; wi < assign.workerIdxs.length; wi++) {
      const wIdx = assign.workerIdxs[wi];
      if (workers[wIdx]) {
        const exists = await prisma.teamMember.findFirst({
          where: { teamId: extraTeams[assign.teamIdx].id, workerId: workers[wIdx].id },
        });
        if (!exists) {
          await prisma.teamMember.create({
            data: {
              teamId: extraTeams[assign.teamIdx].id,
              workerId: workers[wIdx].id,
              role: wi === 0 ? "lead" : "worker",
              status: "active",
              jobsCompleted: Math.floor(Math.random() * 30) + 5,
              totalEarned: Math.floor(Math.random() * 5000) + 500,
              rating: 4 + Math.random() * 0.9,
            },
          });
        }
      }
    }
  }

  // Create completed jobs for extra teams (needed for week/month leaderboard queries)
  for (let ti = 0; ti < extraTeams.length; ti++) {
    const t = extraTeams[ti];
    const tSellerId = extraSellerIds[extraTeamsData[ti].sellIdx];
    const svc = await prisma.service.findFirst({ where: { sellerId: tSellerId } });
    if (!svc) continue;

    const jobCount = Math.min(extraTeamsData[ti].completed, 10);
    for (let ji = 0; ji < jobCount; ji++) {
      const completedDate = daysAgo(Math.floor(Math.random() * 20));
      await prisma.job.create({
        data: {
          sellerId: tSellerId,
          teamId: t.id,
          title: `งาน ${svc.name} #${ji + 1}`,
          serviceName: svc.name,
          platform: svc.platform,
          serviceType: svc.serviceType,
          targetUrl: `https://facebook.com/example/${t.id.slice(0, 8)}/${ji}`,
          quantity: 100 + ji * 50,
          completedQuantity: 100 + ji * 50,
          claimedQuantity: 100 + ji * 50,
          pricePerUnit: 2,
          totalPayout: (100 + ji * 50) * 2,
          visibility: "team",
          status: "completed",
          updatedAt: completedDate,
        },
      });
    }
  }

  // Create approved job claims for workers (needed for week/month worker leaderboard)
  for (let wi = 0; wi < workers.length; wi++) {
    const w = workers[wi];
    const claimCount = Math.max(1, Math.floor(workerData[wi].totalJobs / 10));
    const allJobs = await prisma.job.findMany({
      where: { status: "completed" },
      take: claimCount,
      skip: wi * 2,
    });
    for (const job of allJobs) {
      const exists = await prisma.jobClaim.findFirst({
        where: { jobId: job.id, workerId: w.id },
      });
      if (!exists) {
        await prisma.jobClaim.create({
          data: {
            jobId: job.id,
            workerId: w.id,
            quantity: Math.floor(job.quantity / 3),
            earnAmount: Math.floor(job.quantity / 3) * job.pricePerUnit,
            status: "approved",
            submittedAt: daysAgo(Math.floor(Math.random() * 10) + 1),
            reviewedAt: daysAgo(Math.floor(Math.random() * 5)),
          },
        });
      }
    }
  }

  return { sellerId };
}

// ──────────────────────────────────────────────
// MAIN — used by prisma/seed.ts CLI
// ──────────────────────────────────────────────

export async function main() {
  await seedDemo();
}
