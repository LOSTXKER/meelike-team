/**
 * Seed Data Generator for Development
 * 
 * Generates realistic mock data for testing
 */

import type {
  Order,
  StoreService,
  Team,
  TeamMember,
  Job,
  HubPost,
  OutsourceJob,
  OutsourceBid,
  Seller,
  Worker,
  WorkerAccount,
} from "@/types";
import { Transaction } from "./api/storage-helpers";
import {
  saveOrdersToStorage,
  saveServicesToStorage,
  saveTeamsToStorage,
  saveTeamMembersToStorage,
  saveJobsToStorage,
  saveTransactionsToStorage,
  saveHubPostsToStorage,
  saveOutsourceJobsToStorage,
  saveOutsourceBidsToStorage,
  saveSellersToStorage,
  saveWorkersToStorage,
  saveWorkerAccountsToStorage,
  saveTeamPayoutsToStorage,
} from "./api/storage-helpers";

// ============================================
// HELPER FUNCTIONS
// ============================================

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// SEED: SELLERS
// ============================================

export function seedSellers(): Seller[] {
  const sellers: Seller[] = [
    {
      id: "seller-1",
      userId: "user-1",
      name: "ร้านมี Like",
      displayName: "ร้านมี Like",
      slug: "meelike-store",
      description: "บริการ Social Media Marketing ครบวงจร",
      subscription: "pro",
      plan: "pro",
      sellerRank: "gold",
      platformFeePercent: 10,
      rollingAvgSpend: 75000,
      balance: 125000,
      totalSpentOnWorkers: 45000,
      totalRevenue: 850000,
      totalOrders: 156,
      rating: 4.8,
      ratingCount: 142,
      theme: "meelike",
      isActive: true,
      isVerified: true,
      createdAt: randomDate(180),
      updatedAt: randomDate(1),
    },
  ];

  saveSellersToStorage(sellers);
  return sellers;
}

// ============================================
// SEED: SERVICES
// ============================================

export function seedServices(): StoreService[] {
  const services: StoreService[] = [
    {
      id: "svc-1",
      sellerId: "seller-1",
      name: "Facebook Like โพสต์ [Bot]",
      description: "ไลค์เร็ว ราคาถูก ทำงานอัตโนมัติ 100%",
      category: "facebook",
      type: "like",
      serviceType: "bot",
      sellPrice: 1.2,
      costPrice: 0.8,
      minQuantity: 100,
      maxQuantity: 50000,
      estimatedTime: "1-6 ชม.",
      isActive: true,
      showInStore: true,
      meelikeServiceId: "fb-like-001",
      orderCount: 45,
      createdAt: randomDate(90),
      updatedAt: randomDate(10),
    },
    {
      id: "svc-2",
      sellerId: "seller-1",
      name: "Instagram Follower [คนจริง]",
      description: "ฟอลโลว์จากคนจริง คุณภาพสูง มีการันตี",
      category: "instagram",
      type: "follow",
      serviceType: "human",
      sellPrice: 5.0,
      workerRate: 3.5, // ค่าจ้าง Worker
      minQuantity: 50,
      maxQuantity: 5000,
      estimatedTime: "24-72 ชม.",
      isActive: true,
      showInStore: true,
      orderCount: 28,
      createdAt: randomDate(60),
      updatedAt: randomDate(5),
    },
    {
      id: "svc-3",
      sellerId: "seller-1",
      name: "TikTok View + Like [Bot]",
      description: "เพิ่มยอดวิวและไลค์พร้อมกัน",
      category: "tiktok",
      type: "view",
      serviceType: "bot",
      sellPrice: 0.8,
      costPrice: 0.5,
      minQuantity: 500,
      maxQuantity: 100000,
      estimatedTime: "1-12 ชม.",
      isActive: true,
      showInStore: true,
      meelikeServiceId: "tiktok-view-001",
      orderCount: 67,
      createdAt: randomDate(45),
      updatedAt: randomDate(3),
    },
    {
      id: "svc-4",
      sellerId: "seller-1",
      name: "YouTube Comment [คนจริง]",
      description: "คอมเมนต์จากคนจริง เนื้อหาตามที่กำหนด",
      category: "youtube",
      type: "comment",
      serviceType: "human",
      sellPrice: 15.0,
      workerRate: 10.0, // ค่าจ้าง Worker
      minQuantity: 10,
      maxQuantity: 500,
      estimatedTime: "48-96 ชม.",
      isActive: true,
      showInStore: true,
      orderCount: 12,
      createdAt: randomDate(30),
      updatedAt: randomDate(2),
    },
  ];

  saveServicesToStorage(services);
  return services;
}

// ============================================
// SEED: TEAMS
// ============================================

export function seedTeams(): Team[] {
  const teams: Team[] = [
    {
      id: "team-1",
      sellerId: "seller-1",
      name: "ทีมมือโปร",
      description: "ทีมงานมืออาชีพ รับงานหลากหลาย",
      inviteCode: "TEAM1PRO",
      requireApproval: false,
      isPublic: true,
      isRecruiting: true,
      memberCount: 8,
      activeJobCount: 3,
      totalJobsCompleted: 42,
      rating: 4.7,
      ratingCount: 38,
      status: "active",
      isActive: true,
      platforms: ["facebook", "instagram", "tiktok"],
      createdAt: randomDate(120),
      updatedAt: randomDate(5),
    },
    {
      id: "team-2",
      sellerId: "seller-1",
      name: "Social Media Squad",
      description: "เชี่ยวชาญด้าน Social Media",
      inviteCode: "TEAM2SMS",
      requireApproval: true,
      isPublic: true,
      isRecruiting: true,
      memberCount: 12,
      activeJobCount: 7,
      totalJobsCompleted: 71,
      rating: 4.9,
      ratingCount: 65,
      status: "active",
      isActive: true,
      platforms: ["instagram", "youtube", "twitter"],
      createdAt: randomDate(150),
      updatedAt: randomDate(2),
    },
  ];

  saveTeamsToStorage(teams);
  return teams;
}

// ============================================
// SEED: TEAM MEMBERS
// ============================================

export function seedTeamMembers(): TeamMember[] {
  const members: TeamMember[] = [
    {
      id: "member-1",
      teamId: "team-1",
      workerId: "worker-1",
      status: "active",
      role: "lead",
      jobsCompleted: 28,
      totalEarned: 25000,
      rating: 4.8,
      ratingCount: 22,
      joinedAt: randomDate(120),
      lastActiveAt: randomDate(1),
    },
    {
      id: "member-2",
      teamId: "team-1",
      workerId: "worker-2",
      status: "active",
      role: "worker",
      jobsCompleted: 22,
      totalEarned: 18000,
      rating: 4.6,
      ratingCount: 18,
      joinedAt: randomDate(90),
      lastActiveAt: randomDate(2),
    },
    {
      id: "member-3",
      teamId: "team-2",
      workerId: "worker-3",
      status: "active",
      role: "lead",
      jobsCompleted: 45,
      totalEarned: 42000,
      rating: 4.9,
      ratingCount: 40,
      joinedAt: randomDate(150),
      lastActiveAt: randomDate(0),
    },
  ];

  saveTeamMembersToStorage(members);
  return members;
}

// ============================================
// SEED: ORDERS
// ============================================

export function seedOrders(): Order[] {
  const orders: Order[] = [
    {
      id: "order-1",
      sellerId: "seller-1",
      orderNumber: "ORD-2024-001",
      status: "pending",
      paymentStatus: "pending",
      trackingUrl: "https://meelike.com/track/order-1",
      customer: {
        name: "คุณสมชาย",
        contactType: "line",
        contactValue: "@somchai123",
      },
      items: [
        {
          id: "item-1",
          orderId: "order-1",
          serviceId: "svc-1",
          serviceName: "Facebook Like โพสต์ [Bot]",
          serviceType: "bot",
          platform: "facebook",
          type: "like",
          targetUrl: "https://facebook.com/post/123",
          quantity: 1000,
          unitPrice: 1.2,
          costPerUnit: 0.8,
          subtotal: 1200,
          totalCost: 800,
          profit: 400,
          profitPercent: 33.3,
          progress: 0,
          completedQuantity: 0,
          status: "pending",
        },
      ],
      subtotal: 1200,
      discount: 0,
      total: 1200,
      totalCost: 800,
      totalProfit: 400,
      progress: 0,
      createdAt: randomDate(1),
      updatedAt: randomDate(1),
    },
    {
      id: "order-2",
      sellerId: "seller-1",
      orderNumber: "ORD-2024-002",
      status: "processing",
      paymentStatus: "paid",
      trackingUrl: "https://meelike.com/track/order-2",
      customer: {
        name: "คุณสมหญิง",
        contactType: "phone",
        contactValue: "0812345678",
      },
      items: [
        {
          id: "item-2",
          orderId: "order-2",
          serviceId: "svc-2",
          serviceName: "Instagram Follower [คนจริง]",
          serviceType: "human",
          platform: "instagram",
          type: "follow",
          targetUrl: "https://instagram.com/user123",
          quantity: 500,
          unitPrice: 5.0,
          costPerUnit: 3.5,
          subtotal: 2500,
          totalCost: 1750,
          profit: 750,
          profitPercent: 30,
          progress: 50,
          completedQuantity: 250,
          status: "processing",
          jobs: [
            {
              jobId: "job-1",
              teamId: "team-1",
              teamName: "ทีมมือโปร",
              quantity: 500,
              completedQuantity: 250,
              status: "in_progress",
            },
          ],
        },
      ],
      subtotal: 2500,
      discount: 0,
      total: 2500,
      totalCost: 1750,
      totalProfit: 750,
      progress: 50,
      paymentProof: "https://example.com/proof.jpg",
      paidAt: randomDate(2),
      confirmedAt: randomDate(2),
      createdAt: randomDate(2),
      updatedAt: randomDate(0),
    },
    {
      id: "order-3",
      sellerId: "seller-1",
      orderNumber: "ORD-2024-003",
      status: "completed",
      paymentStatus: "paid",
      trackingUrl: "https://meelike.com/track/order-3",
      customer: {
        name: "คุณสมศรี",
        contactType: "facebook",
        contactValue: "somsri.fb",
      },
      items: [
        {
          id: "item-3",
          orderId: "order-3",
          serviceId: "svc-3",
          serviceName: "TikTok View + Like [Bot]",
          serviceType: "bot",
          platform: "tiktok",
          type: "view",
          targetUrl: "https://tiktok.com/@user/video/123",
          quantity: 10000,
          unitPrice: 0.8,
          costPerUnit: 0.5,
          subtotal: 8000,
          totalCost: 5000,
          profit: 3000,
          profitPercent: 37.5,
          progress: 100,
          completedQuantity: 10000,
          status: "completed",
          completedAt: randomDate(5),
        },
      ],
      subtotal: 8000,
      discount: 0,
      total: 8000,
      totalCost: 5000,
      totalProfit: 3000,
      progress: 100,
      paymentProof: "https://example.com/proof2.jpg",
      paidAt: randomDate(7),
      confirmedAt: randomDate(7),
      completedAt: randomDate(5),
      createdAt: randomDate(7),
      updatedAt: randomDate(5),
    },
  ];

  saveOrdersToStorage(orders);
  return orders;
}

// ============================================
// SEED: TRANSACTIONS
// ============================================

export function seedTransactions(): Transaction[] {
  const transactions: Transaction[] = [
    {
      id: "txn-1",
      type: "income",
      category: "order",
      title: "รายได้จากออเดอร์ #ORD-2024-003",
      description: "TikTok View + Like [Bot] x 10,000",
      amount: 8000,
      relatedOrderId: "order-3",
      date: randomDate(5),
    },
    {
      id: "txn-2",
      type: "expense",
      category: "api",
      title: "ค่า API TikTok View",
      description: "ต้นทุนบริการ Bot",
      amount: -5000,
      relatedOrderId: "order-3",
      date: randomDate(5),
    },
    {
      id: "txn-3",
      type: "expense",
      category: "payout",
      title: "จ่ายค่าจ้างทีมมือโปร",
      description: "งาน Instagram Follower",
      amount: -2000,
      date: randomDate(3),
    },
    {
      id: "txn-4",
      type: "income",
      category: "topup",
      title: "เติมเงินเข้ากระเป๋า",
      description: "โอนผ่านธนาคาร",
      amount: 50000,
      date: randomDate(10),
    },
  ];

  saveTransactionsToStorage(transactions);
  return transactions;
}

// ============================================
// SEED: HUB POSTS
// ============================================

export function seedHubPosts(): HubPost[] {
  const posts: HubPost[] = [
    {
      id: "post-1",
      type: "recruit",
      title: "หาทีม Instagram Follower คุณภาพสูง",
      description: "ต้องการทีมที่มีประสบการณ์ รับงานได้ 1000+ follows/day",
      author: {
        name: "ร้านมี Like",
        avatar: "",
        rating: 4.8,
        verified: true,
        type: "seller",
        totalPaid: 250000,
      },
      platforms: ["instagram"],
      requirements: ["มีประสบการณ์ 6 เดือนขึ้นไป", "Rating 4.5+"],
      payRate: { min: 3, max: 5, unit: "per follow" },
      openSlots: 5,
      applicants: 8,
      views: 45,
      interested: 8,
      createdAt: randomDate(3),
      isHot: true,
    },
    {
      id: "post-2",
      type: "recruit",
      title: "รับสมัครทีม YouTube Comment",
      description: "รับทีมที่พร้อมทำ comment ภาษาไทย คุณภาพดี",
      author: {
        name: "ร้านมี Like",
        avatar: "",
        rating: 4.8,
        verified: true,
        type: "seller",
        totalPaid: 250000,
      },
      platforms: ["youtube"],
      requirements: ["เขียนภาษาไทยได้ดี", "มีความคิดสร้างสรรค์"],
      payRate: { min: 10, max: 15, unit: "per comment" },
      openSlots: 3,
      applicants: 5,
      views: 32,
      interested: 5,
      createdAt: randomDate(5),
    },
  ];

  saveHubPostsToStorage(posts);
  return posts;
}

// ============================================
// SEED: WORKERS
// ============================================

export function seedWorkers(): Worker[] {
  const workers: Worker[] = [
    {
      id: "worker-1",
      userId: "user-worker-1",
      displayName: "Worker Pro",
      totalJobs: 30,
      totalEarned: 25000,
      completionRate: 93,
      rating: 4.8,
      ratingCount: 45,
      level: "gold",
      totalJobsCompleted: 28,
      pendingBalance: 1500,
      availableBalance: 5000,
      isActive: true,
      isBanned: false,
      teamIds: ["team-1"],
      createdAt: randomDate(120),
      lastActiveAt: randomDate(1),
    },
    {
      id: "worker-2",
      userId: "user-worker-2",
      displayName: "Social Expert",
      totalJobs: 25,
      totalEarned: 18000,
      completionRate: 88,
      rating: 4.6,
      ratingCount: 32,
      level: "silver",
      totalJobsCompleted: 22,
      pendingBalance: 800,
      availableBalance: 3200,
      isActive: true,
      isBanned: false,
      teamIds: ["team-1"],
      createdAt: randomDate(90),
      lastActiveAt: randomDate(2),
    },
    {
      id: "worker-3",
      userId: "user-worker-3",
      displayName: "Media Master",
      totalJobs: 50,
      totalEarned: 42000,
      completionRate: 96,
      rating: 4.9,
      ratingCount: 58,
      level: "platinum",
      totalJobsCompleted: 45,
      pendingBalance: 2500,
      availableBalance: 12000,
      isActive: true,
      isBanned: false,
      teamIds: ["team-2"],
      createdAt: randomDate(150),
      lastActiveAt: randomDate(0),
    },
  ];

  saveWorkersToStorage(workers);
  return workers;
}

// ============================================
// SEED: WORKER ACCOUNTS
// ============================================

export function seedWorkerAccounts(): WorkerAccount[] {
  const accounts: WorkerAccount[] = [
    {
      id: "acc-1",
      workerId: "worker-1",
      platform: "facebook",
      username: "myfb123",
      profileUrl: "https://facebook.com/myfb123",
      screenshotUrl: "https://example.com/screenshot1.jpg",
      verificationStatus: "verified",
      verifiedAt: randomDate(30),
      verifiedBy: "ai",
      aiResult: {
        passed: true,
        confidence: 0.95,
        hasProfilePicture: true,
        detectedFollowers: 520,
        usernameMatch: true,
        notes: "Account verified successfully",
      },
      followers: 520,
      profilePictureExists: true,
      accountAge: "2 years",
      isActive: true,
      lastUsedAt: randomDate(2),
      jobsCompleted: 15,
      createdAt: randomDate(60),
      updatedAt: randomDate(2),
    },
    {
      id: "acc-2",
      workerId: "worker-1",
      platform: "instagram",
      username: "myig456",
      profileUrl: "https://instagram.com/myig456",
      screenshotUrl: "https://example.com/screenshot2.jpg",
      verificationStatus: "verified",
      verifiedAt: randomDate(25),
      verifiedBy: "ai",
      aiResult: {
        passed: true,
        confidence: 0.92,
        hasProfilePicture: true,
        detectedFollowers: 1200,
        usernameMatch: true,
        notes: "Account verified successfully",
      },
      followers: 1200,
      profilePictureExists: true,
      accountAge: "3 years",
      isActive: true,
      lastUsedAt: randomDate(1),
      jobsCompleted: 22,
      createdAt: randomDate(45),
      updatedAt: randomDate(1),
    },
  ];

  saveWorkerAccountsToStorage(accounts);
  return accounts;
}

// ============================================
// SEED: OUTSOURCE JOBS
// ============================================

export function seedOutsourceJobs(): OutsourceJob[] {
  const jobs: OutsourceJob[] = [
    {
      id: "outsource-1",
      sellerId: "seller-1",
      title: "Facebook Like 5000 ไลค์",
      author: {
        id: "seller-1",
        name: "ร้านมี Like",
        rating: 4.8,
        verified: true,
        totalOutsourced: 15,
      },
      description: "ต้องการทีมรับงาน Like Facebook โพสต์ 5000 ไลค์",
      platform: "facebook",
      jobType: "like",
      quantity: 5000,
      completedQuantity: 0,
      budget: 4000,
      suggestedPricePerUnit: 0.8,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      targetUrl: "https://facebook.com/post/456",
      requirements: ["ทำงานเร็ว", "คุณภาพดี", "ไม่ Drop"],
      status: "open",
      views: 28,
      bidsCount: 3,
      createdAt: randomDate(2),
      updatedAt: randomDate(1),
    },
  ];

  saveOutsourceJobsToStorage(jobs);
  return jobs;
}

// ============================================
// SEED: TEAM JOBS
// ============================================

import { setStorage, STORAGE_KEYS } from "./storage";

export function seedTeamJobs() {
  const teamJobs = [
    {
      id: "job-1",
      teamId: "team-1",
      orderId: "order-1",
      orderNumber: "ORD-001",
      sellerId: "seller-1",
      serviceId: "svc-1",
      serviceName: "Facebook Like โพสต์ [Bot]",
      platform: "facebook",
      quantity: 100,
      completedQuantity: 100,
      pricePerUnit: 0.5,
      totalPayout: 50,
      targetUrl: "https://facebook.com/post/123",
      instructions: "กด Like ให้ครบ",
      status: "completed",
      priority: "normal",
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedAt: randomDate(3),
      completedAt: randomDate(1),
      createdAt: randomDate(3),
      updatedAt: randomDate(1),
    },
    {
      id: "job-2",
      teamId: "team-1",
      orderId: "order-2",
      orderNumber: "ORD-002",
      sellerId: "seller-1",
      serviceId: "svc-2",
      serviceName: "Facebook Follow เพจ [คนจริง]",
      platform: "facebook",
      quantity: 50,
      completedQuantity: 35,
      pricePerUnit: 1.2,
      totalPayout: 60,
      targetUrl: "https://facebook.com/page/xyz",
      instructions: "Follow เพจ",
      status: "in_progress",
      priority: "high",
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedAt: randomDate(1),
      createdAt: randomDate(1),
      updatedAt: randomDate(0),
    },
    {
      id: "job-3",
      teamId: "team-2",
      orderId: "order-3",
      orderNumber: "ORD-003",
      sellerId: "seller-1",
      serviceId: "svc-3",
      serviceName: "Instagram Follow [คนจริง]",
      platform: "instagram",
      quantity: 200,
      completedQuantity: 0,
      pricePerUnit: 1.5,
      totalPayout: 300,
      targetUrl: "https://instagram.com/user/abc",
      instructions: "Follow บัญชี",
      status: "pending",
      priority: "normal",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: randomDate(0),
      updatedAt: randomDate(0),
    },
  ];

  setStorage(STORAGE_KEYS.TEAM_JOBS, teamJobs);
  return teamJobs;
}

// ============================================
// SEED: JOB CLAIMS (รอตรวจสอบ)
// ============================================

export function seedJobClaims() {
  const jobClaims = [
    {
      id: "claim-1",
      jobId: "job-2",
      workerId: "worker-1",
      teamId: "team-1",
      quantity: 20,
      actualQuantity: 20,
      earnAmount: 240,
      status: "submitted", // <-- Important: must be "submitted" for pending reviews
      proofUrls: ["https://example.com/proof1.jpg", "https://example.com/proof2.jpg"],
      workerNote: "ทำครบ 20 แล้วครับ",
      submittedAt: randomDate(0),
      createdAt: randomDate(1),
      updatedAt: randomDate(0),
    },
    {
      id: "claim-2",
      jobId: "job-2",
      workerId: "worker-2",
      teamId: "team-1",
      quantity: 15,
      actualQuantity: 15,
      earnAmount: 180,
      status: "submitted", // <-- Important: must be "submitted" for pending reviews
      proofUrls: ["https://example.com/proof3.jpg"],
      workerNote: "เสร็จแล้วค่ะ",
      submittedAt: randomDate(0),
      createdAt: randomDate(1),
      updatedAt: randomDate(0),
    },
    {
      id: "claim-3",
      jobId: "job-3",
      workerId: "worker-3",
      teamId: "team-2",
      quantity: 100,
      actualQuantity: 100,
      earnAmount: 150,
      status: "submitted",
      proofUrls: ["https://example.com/proof5.jpg", "https://example.com/proof6.jpg"],
      workerNote: "ส่งครบแล้วครับ",
      submittedAt: randomDate(0),
      createdAt: randomDate(0),
      updatedAt: randomDate(0),
    },
    {
      id: "claim-4",
      jobId: "job-1",
      workerId: "worker-1",
      teamId: "team-1",
      quantity: 50,
      actualQuantity: 50,
      earnAmount: 250,
      status: "approved",
      proofUrls: ["https://example.com/proof4.jpg"],
      workerNote: "",
      submittedAt: randomDate(2),
      reviewedAt: randomDate(1),
      reviewedBy: "seller-1",
      createdAt: randomDate(3),
      updatedAt: randomDate(1),
    },
  ];

  setStorage(STORAGE_KEYS.JOB_CLAIMS, jobClaims);
  return jobClaims;
}

// ============================================
// SEED: PAYOUTS
// ============================================

export function seedPayouts() {
  const payouts = [
    {
      id: "payout-1",
      teamId: "team-1",
      workerId: "worker-1",
      claimId: "claim-3",
      amount: 250,
      jobCount: 2,
      status: "completed",
      completedAt: randomDate(1),
      transactionRef: "TXN-001",
      worker: {
        id: "worker-1",
        displayName: "Worker Pro",
        level: "gold",
        avatar: "",
        teamIds: ["team-1"],
      },
      createdAt: randomDate(2),
      updatedAt: randomDate(1),
    },
    {
      id: "payout-2",
      teamId: "team-1",
      workerId: "worker-1",
      claimId: "claim-1",
      amount: 420,
      jobCount: 3,
      status: "pending",
      worker: {
        id: "worker-1",
        displayName: "Worker Pro",
        level: "gold",
        avatar: "",
        teamIds: ["team-1"],
      },
      createdAt: randomDate(0),
      updatedAt: randomDate(0),
    },
    {
      id: "payout-3",
      teamId: "team-1",
      workerId: "worker-2",
      claimId: "claim-2",
      amount: 180,
      jobCount: 1,
      status: "pending",
      worker: {
        id: "worker-2",
        displayName: "Social Expert",
        level: "silver",
        avatar: "",
        teamIds: ["team-1"],
      },
      createdAt: randomDate(0),
      updatedAt: randomDate(0),
    },
    {
      id: "payout-4",
      teamId: "team-2",
      workerId: "worker-3",
      amount: 350,
      jobCount: 2,
      status: "pending",
      worker: {
        id: "worker-3",
        displayName: "Media Master",
        level: "platinum",
        avatar: "",
        teamIds: ["team-2"],
      },
      createdAt: randomDate(0),
      updatedAt: randomDate(0),
    },
  ];

  setStorage(STORAGE_KEYS.PAYOUTS, payouts);
  return payouts;
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

export function seedAllData() {
  console.log("🌱 Starting seed data generation...");

  const sellers = seedSellers();
  console.log(`✅ Seeded ${sellers.length} sellers`);

  const services = seedServices();
  console.log(`✅ Seeded ${services.length} services`);

  const teams = seedTeams();
  console.log(`✅ Seeded ${teams.length} teams`);

  const members = seedTeamMembers();
  console.log(`✅ Seeded ${members.length} team members`);

  const teamJobs = seedTeamJobs();
  console.log(`✅ Seeded ${teamJobs.length} team jobs`);

  const jobClaims = seedJobClaims();
  console.log(`✅ Seeded ${jobClaims.length} job claims`);

  const payouts = seedPayouts();
  console.log(`✅ Seeded ${payouts.length} payouts`);

  const orders = seedOrders();
  console.log(`✅ Seeded ${orders.length} orders`);

  const transactions = seedTransactions();
  console.log(`✅ Seeded ${transactions.length} transactions`);

  const posts = seedHubPosts();
  console.log(`✅ Seeded ${posts.length} hub posts`);

  const workers = seedWorkers();
  console.log(`✅ Seeded ${workers.length} workers`);

  const accounts = seedWorkerAccounts();
  console.log(`✅ Seeded ${accounts.length} worker accounts`);

  const outsourceJobs = seedOutsourceJobs();
  console.log(`✅ Seeded ${outsourceJobs.length} outsource jobs`);

  console.log("✨ Seed data generation complete!");

  return {
    sellers,
    services,
    teams,
    members,
    teamJobs,
    jobClaims,
    payouts,
    orders,
    transactions,
    posts,
    workers,
    accounts,
    outsourceJobs,
  };
}
