/**
 * API Abstraction Layer
 * 
 * This module provides a unified interface for data fetching.
 * Currently uses mock data, but can be easily switched to real API calls.
 * 
 * Usage:
 * ```ts
 * import { api } from '@/lib/api';
 * 
 * const stats = await api.seller.getStats();
 * const orders = await api.seller.getOrders();
 * ```
 */

import {
  mockSeller,
  mockServices,
  mockOrders,
  mockSellerStats,
  mockWorkers,
  mockWorkerStats,
  mockWorkerJobs,
  mockActiveJobs,
  mockWorkerAccounts,
  mockTeams,
  mockTeam,
  mockTeamMembers,
  mockJobClaims,
  mockTeamJobs,
  mockTeamPayouts,
  mockJobs,
  mockHubPosts,
  mockHubStats,
  mockFindTeamPosts,
  mockOutsourceJobs,
} from "@/lib/mock-data";

import { getStorage, setStorage, STORAGE_KEYS, getCurrentWorkerId, getCurrentSellerId, getCurrentUserRole } from "@/lib/storage";
import { generateOrderNumber, generateId } from "@/lib/utils/helpers";

import type {
  Seller,
  Worker,
  StoreService,
  Order,
  OrderItem,
  Job,
  JobClaim,
  Team,
  TeamMember,
  TeamJob,
  TeamPayout,
  WorkerAccount,
  HubPost,
  FindTeamPost,
  OutsourceJob,
  WorkerJob,
} from "@/types";

// Simulate network delay (remove in production)
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== ORDERS STORAGE HELPERS =====

function getOrdersFromStorage(): Order[] {
  const orders = getStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  
  // Seed with mockOrders on first access
  if (orders.length === 0) {
    setStorage(STORAGE_KEYS.ORDERS, mockOrders);
    return mockOrders;
  }
  
  return orders;
}

function saveOrdersToStorage(orders: Order[]): void {
  setStorage(STORAGE_KEYS.ORDERS, orders);
}

function calculateOrderProgress(items: OrderItem[]): number {
  if (items.length === 0) return 0;
  
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const completedQuantity = items.reduce((sum, item) => sum + item.completedQuantity, 0);
  
  return Math.round((completedQuantity / totalQuantity) * 100);
}

// ===== SERVICES STORAGE HELPERS =====

function getServicesFromStorage(): StoreService[] {
  const services = getStorage<StoreService[]>(STORAGE_KEYS.SERVICES, []);
  
  // Seed with mockServices on first access
  if (services.length === 0) {
    setStorage(STORAGE_KEYS.SERVICES, mockServices);
    return mockServices;
  }
  
  return services;
}

function saveServicesToStorage(services: StoreService[]): void {
  setStorage(STORAGE_KEYS.SERVICES, services);
}

// ===== TEAMS STORAGE HELPERS =====

function getTeamsFromStorage(): Team[] {
  const teams = getStorage<Team[]>(STORAGE_KEYS.TEAMS, []);
  
  if (teams.length === 0) {
    setStorage(STORAGE_KEYS.TEAMS, mockTeams);
    return mockTeams;
  }
  
  // Ensure all teams have required fields (for backwards compatibility)
  return teams.map(team => ({
    ...team,
    rating: team.rating ?? 0,
    ratingCount: team.ratingCount ?? 0,
  }));
}

function saveTeamsToStorage(teams: Team[]): void {
  setStorage(STORAGE_KEYS.TEAMS, teams);
}

function getTeamMembersFromStorage(): TeamMember[] {
  const members = getStorage<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS, []);
  
  if (members.length === 0) {
    setStorage(STORAGE_KEYS.TEAM_MEMBERS, mockTeamMembers);
    return mockTeamMembers;
  }
  
  return members;
}

function saveTeamMembersToStorage(members: TeamMember[]): void {
  setStorage(STORAGE_KEYS.TEAM_MEMBERS, members);
}

function getTeamJobsFromStorage(): TeamJob[] {
  const jobs = getStorage<TeamJob[]>(STORAGE_KEYS.TEAM_JOBS, []);
  
  if (jobs.length === 0) {
    setStorage(STORAGE_KEYS.TEAM_JOBS, mockTeamJobs);
    return mockTeamJobs;
  }
  
  return jobs;
}

function saveTeamJobsToStorage(jobs: TeamJob[]): void {
  setStorage(STORAGE_KEYS.TEAM_JOBS, jobs);
}

function getTeamPayoutsFromStorage(): TeamPayout[] {
  const payouts = getStorage<TeamPayout[]>(STORAGE_KEYS.PAYOUTS, []);
  
  if (payouts.length === 0) {
    setStorage(STORAGE_KEYS.PAYOUTS, mockTeamPayouts);
    return mockTeamPayouts;
  }
  
  // Validate and filter out payouts with missing worker data (backwards compatibility)
  // This happens when localStorage has old/corrupted payout data
  const validPayouts = payouts.filter(p => p.worker && typeof p.worker === 'object');
  
  // If we filtered out invalid payouts, reseed with fresh mock data
  if (validPayouts.length < payouts.length) {
    console.warn(`Filtered out ${payouts.length - validPayouts.length} invalid payouts, reseeding...`);
    setStorage(STORAGE_KEYS.PAYOUTS, mockTeamPayouts);
    return mockTeamPayouts;
  }
  
  return validPayouts;
}

function saveTeamPayoutsToStorage(payouts: TeamPayout[]): void {
  setStorage(STORAGE_KEYS.PAYOUTS, payouts);
}

// ===== TRANSACTIONS STORAGE HELPERS =====

export interface Transaction {
  id: string;
  type: "income" | "expense" | "topup";
  category: "order" | "payout" | "api" | "topup" | "refund" | "fee";
  title: string;
  description: string;
  amount: number;
  relatedOrderId?: string;
  relatedPayoutId?: string;
  date: string;
}

// Mock seed transactions
const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    type: "income",
    category: "order",
    title: "รายได้จากออเดอร์ ORD-2024-001",
    description: "ไลค์ Facebook 1,000 + เม้น 50",
    amount: 385,
    date: "2024-12-30T14:30:00",
  },
  {
    id: "txn-2",
    type: "expense",
    category: "payout",
    title: "จ่ายค่าจ้าง Worker @นุ่น",
    description: "งาน JOB-001 - ไลค์ Facebook 30",
    amount: -50,
    date: "2024-12-30T12:00:00",
  },
  {
    id: "txn-3",
    type: "topup",
    category: "topup",
    title: "เติมเงินผ่าน PromptPay",
    description: "Ref: PP202412290915",
    amount: 500,
    date: "2024-12-29T09:15:00",
  },
  {
    id: "txn-4",
    type: "income",
    category: "order",
    title: "รายได้จากออเดอร์ ORD-2024-002",
    description: "Follow Instagram 200",
    amount: 150,
    date: "2024-12-28T16:45:00",
  },
  {
    id: "txn-5",
    type: "expense",
    category: "api",
    title: "ค่า MeeLike API (Bot)",
    description: "ไลค์ Facebook Bot 1,000",
    amount: -80,
    date: "2024-12-28T10:00:00",
  },
  {
    id: "txn-6",
    type: "expense",
    category: "payout",
    title: "จ่ายค่าจ้าง Worker @มิ้นท์",
    description: "งาน JOB-002 - เม้น 50",
    amount: -75,
    date: "2024-12-27T18:00:00",
  },
  {
    id: "txn-7",
    type: "income",
    category: "order",
    title: "รายได้จากออเดอร์ ORD-2024-003",
    description: "View TikTok 5,000",
    amount: 400,
    date: "2024-12-27T11:30:00",
  },
  {
    id: "txn-8",
    type: "topup",
    category: "topup",
    title: "เติมเงินผ่านโอนเงิน",
    description: "Ref: KBANK202412251000",
    amount: 1000,
    date: "2024-12-25T10:00:00",
  },
];

function getTransactionsFromStorage(): Transaction[] {
  const transactions = getStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  
  if (transactions.length === 0) {
    setStorage(STORAGE_KEYS.TRANSACTIONS, mockTransactions);
    return mockTransactions;
  }
  
  return transactions;
}

function saveTransactionsToStorage(transactions: Transaction[]): void {
  setStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
}

function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, txn) => sum + txn.amount, 0);
}

// ===== JOB CLAIMS STORAGE HELPERS =====

function getJobClaimsFromStorage(): JobClaim[] {
  const claims = getStorage<JobClaim[]>(STORAGE_KEYS.JOB_CLAIMS, []);
  
  if (claims.length === 0) {
    setStorage(STORAGE_KEYS.JOB_CLAIMS, mockJobClaims);
    return mockJobClaims as unknown as JobClaim[];
  }
  
  return claims;
}

function saveJobClaimsToStorage(claims: JobClaim[]): void {
  setStorage(STORAGE_KEYS.JOB_CLAIMS, claims);
}

// ===== HUB POSTS STORAGE HELPERS =====

function getHubPostsFromStorage(): HubPost[] {
  const posts = getStorage<HubPost[]>(STORAGE_KEYS.HUB_POSTS, []);
  
  if (posts.length === 0) {
    setStorage(STORAGE_KEYS.HUB_POSTS, mockHubPosts);
    return mockHubPosts;
  }
  
  return posts;
}

function saveHubPostsToStorage(posts: HubPost[]): void {
  setStorage(STORAGE_KEYS.HUB_POSTS, posts);
}

// ===== TEAM APPLICATIONS STORAGE HELPERS =====

export interface TeamApplication {
  id: string;
  teamId: string;
  workerId: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

function getTeamApplicationsFromStorage(): TeamApplication[] {
  const applications = getStorage<TeamApplication[]>(STORAGE_KEYS.TEAM_APPLICATIONS, []);
  return applications;
}

function saveTeamApplicationsToStorage(applications: TeamApplication[]): void {
  setStorage(STORAGE_KEYS.TEAM_APPLICATIONS, applications);
}

// ===== SELLER API =====
export const sellerApi = {
  async getSeller(): Promise<Seller> {
    await delay();
    return mockSeller;
  },

  async getStats() {
    await delay();
    return mockSellerStats;
  },

  async getServices(): Promise<StoreService[]> {
    await delay();
    return getServicesFromStorage();
  },

  async createServices(services: Partial<StoreService>[]): Promise<StoreService[]> {
    await delay();
    
    const existingServices = getServicesFromStorage();
    const now = new Date().toISOString();
    
    const newServices: StoreService[] = services.map((service) => ({
      id: `svc-${generateId()}`,
      sellerId: "seller-1",
      name: service.name || "",
      description: service.description,
      category: service.category || "facebook",
      type: service.type || "like",
      serviceType: service.serviceType || "bot",
      costPrice: service.costPrice || 0,
      sellPrice: service.sellPrice || 0,
      minQuantity: service.minQuantity || 100,
      maxQuantity: service.maxQuantity || 10000,
      meelikeServiceId: service.meelikeServiceId,
      estimatedTime: service.estimatedTime,
      isActive: service.isActive ?? true,
      showInStore: service.showInStore ?? true,
      orderCount: 0,
      createdAt: now,
      updatedAt: now,
    }));
    
    const updatedServices = [...newServices, ...existingServices];
    saveServicesToStorage(updatedServices);
    
    return newServices;
  },

  async updateService(id: string, patch: Partial<StoreService>): Promise<StoreService | null> {
    await delay();
    
    const services = getServicesFromStorage();
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) return null;
    
    const now = new Date().toISOString();
    services[serviceIndex] = {
      ...services[serviceIndex],
      ...patch,
      updatedAt: now,
    };
    
    saveServicesToStorage(services);
    return services[serviceIndex];
  },

  async deleteService(id: string): Promise<boolean> {
    await delay();
    
    const services = getServicesFromStorage();
    const filtered = services.filter(s => s.id !== id);
    
    if (filtered.length === services.length) return false;
    
    saveServicesToStorage(filtered);
    return true;
  },

  async bulkUpdateServices(ids: string[], patch: Partial<StoreService>): Promise<number> {
    await delay();
    
    const services = getServicesFromStorage();
    const now = new Date().toISOString();
    let updateCount = 0;
    
    const updatedServices = services.map(service => {
      if (ids.includes(service.id)) {
        updateCount++;
        return {
          ...service,
          ...patch,
          updatedAt: now,
        };
      }
      return service;
    });
    
    saveServicesToStorage(updatedServices);
    return updateCount;
  },

  async getOrders(): Promise<Order[]> {
    await delay();
    return getOrdersFromStorage();
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    await delay();
    const orders = getOrdersFromStorage();
    return orders.find((order) => order.id === id);
  },

  // Seller มีได้หลายทีม
  async getTeams(): Promise<Team[]> {
    await delay();
    const teams = getTeamsFromStorage();
    return teams.filter((team) => team.sellerId === "seller-1");
  },

  // Legacy: เข้ากันได้กับ code เดิม (return ทีมแรก)
  async getTeam(): Promise<Team> {
    await delay();
    const teams = getTeamsFromStorage();
    const sellerTeams = teams.filter((team) => team.sellerId === "seller-1");
    return sellerTeams[0] || mockTeam;
  },

  async getTeamById(id: string): Promise<Team | undefined> {
    await delay();
    const teams = getTeamsFromStorage();
    return teams.find((team) => team.id === id);
  },

  async getTeamMembers(teamId?: string): Promise<TeamMember[]> {
    await delay();
    const members = getTeamMembersFromStorage();
    if (teamId) {
      return members.filter((m) => m.teamId === teamId);
    }
    return members;
  },

  async createTeam(payload: { name: string; description?: string }): Promise<Team> {
    await delay();
    
    const teams = getTeamsFromStorage();
    const now = new Date().toISOString();
    
    const newTeam: Team = {
      id: `team-${generateId()}`,
      sellerId: "seller-1",
      name: payload.name,
      description: payload.description,
      inviteCode: `TEAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      requireApproval: false,
      isPublic: true,
      isRecruiting: true,
      memberCount: 0,
      activeJobCount: 0,
      totalJobsCompleted: 0,
      rating: 0,
      ratingCount: 0,
      status: 'active',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    
    teams.push(newTeam);
    saveTeamsToStorage(teams);
    
    return newTeam;
  },

  async updateTeam(teamId: string, patch: Partial<Team>): Promise<Team | null> {
    await delay();
    
    const teams = getTeamsFromStorage();
    const teamIndex = teams.findIndex(t => t.id === teamId);
    
    if (teamIndex === -1) return null;
    
    const now = new Date().toISOString();
    teams[teamIndex] = {
      ...teams[teamIndex],
      ...patch,
      updatedAt: now,
    };
    
    saveTeamsToStorage(teams);
    return teams[teamIndex];
  },

  async deleteTeam(teamId: string): Promise<boolean> {
    await delay();
    
    const teams = getTeamsFromStorage();
    const filtered = teams.filter(t => t.id !== teamId);
    
    if (filtered.length === teams.length) return false;
    
    // Also remove team members
    const members = getTeamMembersFromStorage();
    const filteredMembers = members.filter(m => m.teamId !== teamId);
    saveTeamMembersToStorage(filteredMembers);
    
    saveTeamsToStorage(filtered);
    return true;
  },

  async removeTeamMember(teamId: string, workerId: string): Promise<boolean> {
    await delay();
    
    const members = getTeamMembersFromStorage();
    const filtered = members.filter(m => !(m.teamId === teamId && m.workerId === workerId));
    
    if (filtered.length === members.length) return false;
    
    // Update team member count
    const teams = getTeamsFromStorage();
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.memberCount = Math.max(0, team.memberCount - 1);
      saveTeamsToStorage(teams);
    }
    
    saveTeamMembersToStorage(filtered);
    return true;
  },

  async updateTeamMemberRole(teamId: string, workerId: string, role: string): Promise<TeamMember | null> {
    await delay();
    
    const members = getTeamMembersFromStorage();
    const memberIndex = members.findIndex(m => m.teamId === teamId && m.workerId === workerId);
    
    if (memberIndex === -1) return null;
    
    members[memberIndex] = {
      ...members[memberIndex],
      role: role as any,
    };
    
    saveTeamMembersToStorage(members);
    return members[memberIndex];
  },

  async getJobs(): Promise<Job[]> {
    await delay();
    return mockJobs;
  },

  // Note: mockJobClaims uses a different structure for V2 marketplace
  // Using 'unknown' cast as temporary workaround until mock data is unified
  async getJobClaims(): Promise<JobClaim[]> {
    await delay();
    return getJobClaimsFromStorage();
  },

  async getPendingReviews(): Promise<JobClaim[]> {
    await delay();
    return this.getPendingJobClaims();
  },

  async getTeamJobs(): Promise<TeamJob[]> {
    await delay();
    return getTeamJobsFromStorage();
  },

  async getTeamPayouts(): Promise<TeamPayout[]> {
    await delay();
    return getTeamPayoutsFromStorage();
  },

  async processTeamPayout(payoutId: string): Promise<TeamPayout | null> {
    await delay(800); // Simulate payment processing
    
    const payouts = getTeamPayoutsFromStorage();
    const payoutIndex = payouts.findIndex(p => p.id === payoutId);
    
    if (payoutIndex === -1) return null;
    
    const payout = payouts[payoutIndex];
    const now = new Date().toISOString();
    const txnRef = `TXN-${Date.now()}-${generateId()}`;
    
    // Update payout status
    payouts[payoutIndex] = {
      ...payout,
      status: "completed",
      completedAt: now,
      transactionRef: txnRef,
    };
    
    saveTeamPayoutsToStorage(payouts);
    
    // Create transaction entry (expense)
    const transactions = getTransactionsFromStorage();
    const newTransaction: Transaction = {
      id: `txn-${generateId()}`,
      type: "expense",
      category: "payout",
      title: `จ่ายค่าจ้าง Worker @${payout.worker.displayName}`,
      description: `${payout.jobCount} งานที่ทำเสร็จ - Ref: ${txnRef}`,
      amount: -payout.amount,
      relatedPayoutId: payout.id,
      date: now,
    };
    
    transactions.unshift(newTransaction);
    saveTransactionsToStorage(transactions);
    
    return payouts[payoutIndex];
  },

  async processAllPendingPayouts(teamId?: string): Promise<number> {
    await delay(1000);
    
    const payouts = getTeamPayoutsFromStorage();
    const transactions = getTransactionsFromStorage();
    const now = new Date().toISOString();
    let processedCount = 0;
    
    const updatedPayouts = payouts.map(payout => {
      if (payout.status === "pending" && (!teamId || payout.worker.teamIds?.includes(teamId))) {
        processedCount++;
        const txnRef = `TXN-${Date.now()}-${generateId()}`;
        
        // Create transaction for each payout
        const newTransaction: Transaction = {
          id: `txn-${generateId()}`,
          type: "expense",
          category: "payout",
          title: `จ่ายค่าจ้าง Worker @${payout.worker.displayName}`,
          description: `${payout.jobCount} งานที่ทำเสร็จ - Ref: ${txnRef}`,
          amount: -payout.amount,
          relatedPayoutId: payout.id,
          date: now,
        };
        
        transactions.unshift(newTransaction);
        
        return {
          ...payout,
          status: "completed" as const,
          completedAt: now,
          transactionRef: txnRef,
        };
      }
      return payout;
    });
    
    saveTeamPayoutsToStorage(updatedPayouts);
    saveTransactionsToStorage(transactions);
    
    return processedCount;
  },

  // ===== FINANCE / TRANSACTIONS =====

  async getTransactions(): Promise<Transaction[]> {
    await delay();
    return getTransactionsFromStorage();
  },

  async getBalance(): Promise<number> {
    await delay();
    const transactions = getTransactionsFromStorage();
    return calculateBalance(transactions);
  },

  async createTopupTransaction(payload: {
    amount: number;
    method: "promptpay" | "bank";
    reference?: string;
  }): Promise<Transaction> {
    await delay(800);
    
    const transactions = getTransactionsFromStorage();
    const now = new Date().toISOString();
    
    const newTransaction: Transaction = {
      id: `txn-${generateId()}`,
      type: "topup",
      category: "topup",
      title: `เติมเงินผ่าน ${payload.method === "promptpay" ? "PromptPay" : "โอนเงิน"}`,
      description: payload.reference || `Ref: ${payload.method.toUpperCase()}-${Date.now()}`,
      amount: payload.amount,
      date: now,
    };
    
    transactions.unshift(newTransaction);
    saveTransactionsToStorage(transactions);
    
    return newTransaction;
  },

  async getWorkerBalances(): Promise<Array<{
    worker: Worker;
    pendingBalance: number;
    availableBalance: number;
    totalEarned: number;
  }>> {
    await delay();
    return mockWorkers.map((worker) => ({
      worker,
      pendingBalance: worker.pendingBalance || 0,
      availableBalance: worker.availableBalance || 0,
      totalEarned: worker.totalEarned || 0,
    }));
  },

  // ===== ORDER MUTATIONS =====

  async createOrder(payload: {
    customer: {
      name: string;
      contactType: "line" | "facebook" | "phone" | "email";
      contactValue: string;
      note?: string;
    };
    items: Array<{
      serviceId: string;
      serviceName: string;
      serviceType: "bot" | "human";
      platform: string;
      type: string;
      targetUrl: string;
      quantity: number;
      unitPrice: number;
      costPerUnit: number;
      commentTemplates?: string[];
    }>;
    discount?: number;
  }): Promise<Order> {
    await delay();
    
    const orders = getOrdersFromStorage();
    const now = new Date().toISOString();
    
    // Calculate totals
    const subtotal = payload.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discount = payload.discount || 0;
    const total = subtotal - discount;
    const totalCost = payload.items.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);
    const totalProfit = total - totalCost;
    
    // Create order items
    const orderItems: OrderItem[] = payload.items.map((item) => ({
      id: `item-${generateId()}`,
      orderId: "", // Will be set below
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      serviceType: item.serviceType as "bot" | "human",
      platform: item.platform as any,
      type: item.type as any,
      targetUrl: item.targetUrl,
      quantity: item.quantity,
      commentTemplates: item.commentTemplates,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
      costPerUnit: item.costPerUnit,
      totalCost: item.quantity * item.costPerUnit,
      profit: (item.quantity * item.unitPrice) - (item.quantity * item.costPerUnit),
      profitPercent: ((item.unitPrice - item.costPerUnit) / item.costPerUnit) * 100,
      status: "pending",
      progress: 0,
      completedQuantity: 0,
    }));
    
    // Create order
    const newOrder: Order = {
      id: `order-${generateId()}`,
      orderNumber: generateOrderNumber(),
      sellerId: "seller-1",
      customer: payload.customer,
      items: orderItems,
      subtotal,
      discount,
      total,
      totalCost,
      totalProfit,
      paymentStatus: "pending",
      status: "pending",
      progress: 0,
      trackingUrl: `seller.meelike.com/track/${generateOrderNumber()}`,
      createdAt: now,
      updatedAt: now,
    };
    
    // Set orderId for items
    newOrder.items.forEach(item => {
      item.orderId = newOrder.id;
    });
    
    // Save to storage
    orders.unshift(newOrder); // Add to beginning of array
    saveOrdersToStorage(orders);
    
    return newOrder;
  },

  async confirmPayment(orderId: string, paymentProof?: string): Promise<Order | null> {
    await delay();
    
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return null;
    
    const now = new Date().toISOString();
    orders[orderIndex] = {
      ...orders[orderIndex],
      paymentStatus: "paid",
      paidAt: now,
      confirmedAt: now,
      status: "processing",
      paymentProof,
      updatedAt: now,
    };
    
    saveOrdersToStorage(orders);
    return orders[orderIndex];
  },

  async dispatchBotItem(orderId: string, itemId: string): Promise<Order | null> {
    await delay(800); // Simulate API call to MeeLike
    
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return null;
    
    const order = orders[orderIndex];
    const itemIndex = order.items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return null;
    
    const now = new Date().toISOString();
    const mockMeeLikeOrderId = `ML-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Update item
    order.items[itemIndex] = {
      ...order.items[itemIndex],
      status: "processing",
      meelikeOrderId: mockMeeLikeOrderId,
      startedAt: now,
    };
    
    // Update order progress
    order.progress = calculateOrderProgress(order.items);
    order.updatedAt = now;
    
    saveOrdersToStorage(orders);
    return order;
  },

  async assignHumanItemToTeam(
    orderId: string,
    itemId: string,
    teamId: string,
    quantity: number,
    payRate: number,
    requirements?: string
  ): Promise<Order | null> {
    await delay(600);
    
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return null;
    
    const order = orders[orderIndex];
    const itemIndex = order.items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return null;
    
    const now = new Date().toISOString();
    const mockJobId = `job-${generateId()}`;
    const item = order.items[itemIndex];
    
    // Create TeamJob entry
    const jobs = getTeamJobsFromStorage();
    const newJob: TeamJob = {
      id: mockJobId,
      teamId: teamId, // Add teamId for proper linking
      orderId: orderId,
      orderNumber: order.orderNumber,
      serviceName: item.serviceName,
      platform: item.platform,
      quantity: quantity,
      completedQuantity: 0,
      pricePerUnit: payRate,
      totalPayout: quantity * payRate,
      targetUrl: item.targetUrl || "",
      status: "pending",
      createdAt: now,
    };
    
    jobs.push(newJob);
    saveTeamJobsToStorage(jobs);
    
    // Update item
    order.items[itemIndex] = {
      ...order.items[itemIndex],
      status: "processing",
      jobId: mockJobId,
      startedAt: now,
    };
    
    // Update order progress
    order.progress = calculateOrderProgress(order.items);
    order.updatedAt = now;
    
    saveOrdersToStorage(orders);
    return order;
  },

  async cancelOrder(orderId: string, reason?: string): Promise<Order | null> {
    await delay();
    
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return null;
    
    const now = new Date().toISOString();
    
    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: "cancelled",
      cancelReason: reason || "Cancelled by seller",
      cancelledAt: now,
      updatedAt: now,
    };
    
    // Update all items to cancelled
    orders[orderIndex].items = orders[orderIndex].items.map(item => ({
      ...item,
      status: "cancelled",
    }));
    
    saveOrdersToStorage(orders);
    return orders[orderIndex];
  },
  
  // ===== JOB REVIEW & APPROVAL =====
  
  async getPendingJobClaims(): Promise<JobClaim[]> {
    await delay();
    const claims = getJobClaimsFromStorage();
    return claims.filter(c => c.status === "submitted");
  },
  
  async approveJobClaim(claimId: string, payload?: {
    rating?: number;
    review?: string;
  }): Promise<JobClaim> {
    await delay(800);
    const claims = getJobClaimsFromStorage();
    const claimIndex = claims.findIndex(c => c.id === claimId);
    
    if (claimIndex === -1) throw new Error("Claim not found");
    
    const claim = claims[claimIndex];
    const now = new Date().toISOString();
    
    // Update claim to approved
    claims[claimIndex] = {
      ...claim,
      status: "approved",
      reviewedAt: now,
      reviewedBy: getCurrentSellerId() || "seller",
      sellerRating: payload?.rating,
      sellerReview: payload?.review,
      updatedAt: now,
    };
    
    saveJobClaimsToStorage(claims);
    
    // Update team job completed quantity
    const teamJobs = getTeamJobsFromStorage();
    const jobIndex = teamJobs.findIndex(j => j.id === claim.jobId);
    
    if (jobIndex !== -1) {
      teamJobs[jobIndex].completedQuantity += claim.actualQuantity || 0;
      
      // Update job status
      if (teamJobs[jobIndex].completedQuantity >= teamJobs[jobIndex].quantity) {
        teamJobs[jobIndex].status = "completed";
        teamJobs[jobIndex].completedAt = now;
      }
      
      saveTeamJobsToStorage(teamJobs);
    }
    
    // Create/update payout for worker
    const payouts = getTeamPayoutsFromStorage();
    const workers = mockWorkers;
    const worker = workers.find(w => w.id === claim.workerId);
    
    if (worker) {
      // Check if there's already a pending payout for this worker
      const existingPayoutIndex = payouts.findIndex(
        p => p.workerId === claim.workerId && p.status === "pending"
      );
      
      if (existingPayoutIndex !== -1) {
        // Add to existing payout
        payouts[existingPayoutIndex].amount += claim.earnAmount;
        payouts[existingPayoutIndex].jobCount += 1;
      } else {
        // Create new payout
        const newPayout: TeamPayout = {
          id: `payout-${generateId()}`,
          workerId: claim.workerId,
          worker,
          amount: claim.earnAmount,
          jobCount: 1,
          status: "pending",
          requestedAt: now,
          paymentMethod: worker.promptPayId ? "promptpay" : "bank",
          paymentAccount: worker.promptPayId || worker.bankAccount || "",
          bankName: worker.bankName,
          accountName: worker.bankAccountName,
        };
        
        payouts.push(newPayout);
      }
      
      saveTeamPayoutsToStorage(payouts);
    }
    
    // Update team member stats
    const members = getTeamMembersFromStorage();
    const memberIndex = members.findIndex(m => 
      m.workerId === claim.workerId && 
      teamJobs[jobIndex]?.orderId // Would need proper team linking
    );
    
    if (memberIndex !== -1) {
      members[memberIndex].jobsCompleted += 1;
      members[memberIndex].totalEarned += claim.earnAmount;
      saveTeamMembersToStorage(members);
    }
    
    return claims[claimIndex];
  },
  
  async rejectJobClaim(claimId: string, reason?: string): Promise<JobClaim> {
    await delay();
    const claims = getJobClaimsFromStorage();
    const claimIndex = claims.findIndex(c => c.id === claimId);
    
    if (claimIndex === -1) throw new Error("Claim not found");
    
    const now = new Date().toISOString();
    
    claims[claimIndex] = {
      ...claims[claimIndex],
      status: "rejected",
      reviewedAt: now,
      reviewedBy: getCurrentSellerId() || "seller",
      reviewNote: reason,
      updatedAt: now,
    };
    
    saveJobClaimsToStorage(claims);
    return claims[claimIndex];
  },
};

// ===== WORKER API =====
export const workerApi = {
  async getWorker(id?: string): Promise<Worker | undefined> {
    await delay();
    const workerId = id || getCurrentWorkerId();
    if (!workerId) return mockWorkers[0];
    
    return mockWorkers.find((w) => w.id === workerId) || mockWorkers[0];
  },

  async getStats() {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return mockWorkerStats;
    
    const claims = getJobClaimsFromStorage();
    const workerClaims = claims.filter(c => c.workerId === workerId);
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayClaims = workerClaims.filter(c => new Date(c.createdAt) >= todayStart);
    const todayEarned = todayClaims
      .filter(c => c.status === "approved")
      .reduce((sum, c) => sum + c.earnAmount, 0);
    
    const pendingBalance = workerClaims
      .filter(c => c.status === "submitted")
      .reduce((sum, c) => sum + c.earnAmount, 0);
    
    const availableBalance = workerClaims
      .filter(c => c.status === "approved")
      .reduce((sum, c) => sum + c.earnAmount, 0);
    
    const totalJobsCompleted = workerClaims.filter(c => c.status === "approved").length;
    
    return {
      todayEarned,
      weekEarned: todayEarned * 5, // Mock for now
      totalEarned: availableBalance,
      pendingBalance,
      availableBalance,
      activeJobs: workerClaims.filter(c => c.status === "claimed").length,
      completedJobs: totalJobsCompleted,
      pendingReviews: workerClaims.filter(c => c.status === "submitted").length,
      totalJobsCompleted,
    };
  },

  async getActiveJobs() {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return mockActiveJobs;
    
    const claims = getJobClaimsFromStorage();
    const teamJobs = getTeamJobsFromStorage();
    const teams = getTeamsFromStorage();
    
    const activeClaims = claims.filter(c => c.workerId === workerId && c.status === "claimed");
    
    return activeClaims.map(claim => {
      const job = teamJobs.find(j => j.id === claim.jobId);
      if (!job) return null;
      
      const team = teams.find(t => t.id === job.teamId);
      
      return {
        id: claim.id,
        teamName: team?.name || "Team",
        serviceName: job.serviceName,
        platform: job.platform,
        type: "human",
        targetUrl: job.targetUrl,
        quantity: claim.quantity,
        completedQuantity: claim.actualQuantity || 0,
        pricePerUnit: job.pricePerUnit,
        status: "in_progress" as const,
        deadline: job.deadline,
      } as WorkerJob;
    });
  },

  async getJobs(): Promise<{
    in_progress: WorkerJob[];
    pending_review: WorkerJob[];
    completed: WorkerJob[];
  }> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return mockWorkerJobs;
    
    const claims = getJobClaimsFromStorage();
    const teamJobs = getTeamJobsFromStorage();
    const teams = getTeamsFromStorage();
    
    const workerClaims = claims.filter(c => c.workerId === workerId);
    
    const mapClaimToWorkerJob = (claim: JobClaim): WorkerJob | null => {
      const job = teamJobs.find(j => j.id === claim.jobId);
      if (!job) return null;
      
      const team = teams.find(t => t.id === job.teamId);
      
      return {
        id: claim.id,
        teamName: team?.name || "Team",
        serviceName: job.serviceName,
        platform: job.platform,
        type: "human",
        targetUrl: job.targetUrl,
        quantity: claim.quantity,
        completedQuantity: claim.actualQuantity || 0,
        pricePerUnit: job.pricePerUnit,
        status: claim.status === "claimed" ? "in_progress" 
              : claim.status === "submitted" ? "pending_review" 
              : "completed",
        deadline: job.deadline,
        submittedAt: claim.submittedAt,
        completedAt: claim.status === "approved" ? claim.reviewedAt : undefined,
        earnings: claim.status === "approved" ? claim.earnAmount : undefined,
      };
    };
    
    const allJobs = workerClaims.map(mapClaimToWorkerJob).filter((j): j is WorkerJob => j !== null);
    
    return {
      in_progress: allJobs.filter(j => j.status === "in_progress"),
      pending_review: allJobs.filter(j => j.status === "pending_review"),
      completed: allJobs.filter(j => j.status === "completed"),
    };
  },

  async getAccounts(): Promise<WorkerAccount[]> {
    await delay();
    return mockWorkerAccounts;
  },

  async getTeams(): Promise<Team[]> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return mockTeams.filter((team) => ["team-1", "team-2"].includes(team.id));
    
    const members = getTeamMembersFromStorage();
    const teams = getTeamsFromStorage();
    
    const workerTeamIds = members
      .filter(m => m.workerId === workerId && m.status === "active")
      .map(m => m.teamId);
    
    return teams.filter(t => workerTeamIds.includes(t.id));
  },
  
  // ===== WORKER MUTATIONS =====
  
  async claimTeamJob(jobId: string, quantity: number): Promise<JobClaim> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) throw new Error("Worker not authenticated");
    
    const teamJobs = getTeamJobsFromStorage();
    const claims = getJobClaimsFromStorage();
    const now = new Date().toISOString();
    
    const job = teamJobs.find(j => j.id === jobId);
    if (!job) throw new Error("Job not found");
    
    const remaining = job.quantity - job.completedQuantity;
    const claimQty = Math.min(quantity, remaining);
    
    // Create new claim
    const newClaim: JobClaim = {
      id: `claim-${generateId()}`,
      jobId: job.id,
      workerId,
      workerAccountId: "", // Would need to select account
      quantity: claimQty,
      earnAmount: claimQty * job.pricePerUnit,
      status: "claimed",
      createdAt: now,
      updatedAt: now,
    };
    
    claims.push(newClaim);
    saveJobClaimsToStorage(claims);
    
    // Update job status
    const jobIndex = teamJobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      teamJobs[jobIndex].status = "in_progress";
      saveTeamJobsToStorage(teamJobs);
    }
    
    return newClaim;
  },
  
  async submitJobClaim(claimId: string, payload: {
    actualQuantity: number;
    proofUrls?: string[];
    note?: string;
  }): Promise<JobClaim> {
    await delay();
    const claims = getJobClaimsFromStorage();
    const claimIndex = claims.findIndex(c => c.id === claimId);
    
    if (claimIndex === -1) throw new Error("Claim not found");
    
    const now = new Date().toISOString();
    
    claims[claimIndex] = {
      ...claims[claimIndex],
      status: "submitted",
      actualQuantity: payload.actualQuantity,
      proofUrls: payload.proofUrls,
      workerNote: payload.note,
      submittedAt: now,
      updatedAt: now,
    };
    
    saveJobClaimsToStorage(claims);
    
    // Update job status to pending_review
    const teamJobs = getTeamJobsFromStorage();
    const job = teamJobs.find(j => j.id === claims[claimIndex].jobId);
    if (job && job.status !== "pending_review") {
      const jobIndex = teamJobs.findIndex(j => j.id === job.id);
      if (jobIndex !== -1) {
        teamJobs[jobIndex].status = "pending_review";
        saveTeamJobsToStorage(teamJobs);
      }
    }
    
    return claims[claimIndex];
  },
  
  async updateClaimProgress(claimId: string, completedQuantity: number): Promise<JobClaim> {
    await delay();
    const claims = getJobClaimsFromStorage();
    const claimIndex = claims.findIndex(c => c.id === claimId);
    
    if (claimIndex === -1) throw new Error("Claim not found");
    
    claims[claimIndex] = {
      ...claims[claimIndex],
      actualQuantity: completedQuantity,
      updatedAt: new Date().toISOString(),
    };
    
    saveJobClaimsToStorage(claims);
    return claims[claimIndex];
  },
};

// ===== HUB API =====
export const hubApi = {
  async getPosts(type?: "all" | "recruit" | "find-team" | "outsource"): Promise<HubPost[]> {
    await delay();
    const posts = getHubPostsFromStorage();
    
    if (!type || type === "all") {
      return posts;
    }
    return posts.filter((post) => post.type === type);
  },

  async getStats() {
    await delay();
    const posts = getHubPostsFromStorage();
    
    return [
      { label: "หาลูกทีม", value: posts.filter(p => p.type === "recruit").length },
      { label: "หาทีม", value: posts.filter(p => p.type === "find-team").length },
      { label: "โยนงาน", value: posts.filter(p => p.type === "outsource").length },
      { label: "ทั้งหมด", value: posts.length },
    ];
  },

  async getFindTeamPosts(): Promise<FindTeamPost[]> {
    await delay();
    return mockFindTeamPosts;
  },

  async getOutsourceJobs(): Promise<OutsourceJob[]> {
    await delay();
    return mockOutsourceJobs;
  },

  async getRecruitPosts(): Promise<HubPost[]> {
    await delay();
    const posts = getHubPostsFromStorage();
    return posts.filter((post) => post.type === "recruit");
  },
  
  // ===== HUB MUTATIONS =====
  
  async createPost(payload: {
    type: "recruit" | "find-team" | "outsource";
    title: string;
    description: string;
    platforms: string[];
    payRate?: string | { min: number; max: number; unit: string };
    requirements?: string[];
    benefits?: string[];
    openSlots?: number;
    experience?: string;
    expectedPay?: string;
    availability?: string;
    jobType?: string;
    quantity?: number;
    budget?: string;
    deadline?: string;
  }): Promise<HubPost> {
    await delay();
    const posts = getHubPostsFromStorage();
    const now = new Date().toISOString();
    
    // Get author info from auth
    const role = getCurrentUserRole();
    const workerId = getCurrentWorkerId();
    const sellerId = getCurrentSellerId();
    
    let authorInfo;
    if (role === "seller" && sellerId) {
      const seller = mockSeller; // Would get from storage in real app
      authorInfo = {
        name: seller.displayName,
        avatar: seller.displayName.charAt(0),
        rating: seller.rating,
        verified: seller.isVerified,
        type: "seller" as const,
        memberCount: 0, // Would calculate from teams
        totalPaid: seller.totalSpentOnWorkers,
      };
    } else if (role === "worker" && workerId) {
      const worker = mockWorkers.find(w => w.id === workerId) || mockWorkers[0];
      authorInfo = {
        name: worker.displayName,
        avatar: worker.displayName.charAt(0),
        rating: worker.rating,
        verified: true,
        type: "worker" as const,
      };
    } else {
      throw new Error("User not authenticated");
    }
    
    const newPost: HubPost = {
      id: `post-${generateId()}`,
      type: payload.type,
      title: payload.title,
      author: authorInfo,
      description: payload.description,
      platforms: payload.platforms,
      payRate: payload.payRate,
      requirements: payload.requirements,
      benefits: payload.benefits,
      openSlots: payload.openSlots,
      applicants: 0,
      experience: payload.experience,
      expectedPay: payload.expectedPay,
      availability: payload.availability,
      jobType: payload.jobType,
      quantity: payload.quantity,
      budget: payload.budget,
      deadline: payload.deadline,
      views: 0,
      interested: 0,
      createdAt: now,
    };
    
    posts.unshift(newPost); // Add to beginning
    saveHubPostsToStorage(posts);
    
    return newPost;
  },
  
  async applyToTeam(teamId: string, workerId?: string, message?: string): Promise<TeamApplication> {
    await delay();
    const wId = workerId || getCurrentWorkerId();
    if (!wId) throw new Error("Worker not authenticated");
    
    const applications = getTeamApplicationsFromStorage();
    const now = new Date().toISOString();
    
    // Check if already applied
    const existing = applications.find(a => a.teamId === teamId && a.workerId === wId && a.status === "pending");
    if (existing) {
      throw new Error("Already applied to this team");
    }
    
    const newApplication: TeamApplication = {
      id: `app-${generateId()}`,
      teamId,
      workerId: wId,
      message,
      status: "pending",
      createdAt: now,
    };
    
    applications.push(newApplication);
    saveTeamApplicationsToStorage(applications);
    
    return newApplication;
  },
  
  async approveApplication(applicationId: string): Promise<boolean> {
    await delay();
    const applications = getTeamApplicationsFromStorage();
    const appIndex = applications.findIndex(a => a.id === applicationId);
    
    if (appIndex === -1) return false;
    
    const application = applications[appIndex];
    const now = new Date().toISOString();
    
    // Update application status
    applications[appIndex] = {
      ...application,
      status: "approved",
      reviewedAt: now,
      reviewedBy: getCurrentSellerId() || "seller",
    };
    saveTeamApplicationsToStorage(applications);
    
    // Add member to team
    const members = getTeamMembersFromStorage();
    const newMember: TeamMember = {
      id: `member-${generateId()}`,
      teamId: application.teamId,
      workerId: application.workerId,
      status: "active",
      role: "worker",
      jobsCompleted: 0,
      totalEarned: 0,
      rating: 0,
      ratingCount: 0,
      joinedAt: now,
      lastActiveAt: now,
    };
    
    members.push(newMember);
    saveTeamMembersToStorage(members);
    
    // Update team member count
    const teams = getTeamsFromStorage();
    const teamIndex = teams.findIndex(t => t.id === application.teamId);
    if (teamIndex !== -1) {
      teams[teamIndex].memberCount += 1;
      saveTeamsToStorage(teams);
    }
    
    return true;
  },
};

// ===== TEAM API =====
export const teamApi = {
  async getTeamById(id: string): Promise<Team | undefined> {
    await delay();
    return mockTeams.find((team) => team.id === id);
  },

  async getAllTeams(): Promise<Team[]> {
    await delay();
    return mockTeams;
  },

  async getPublicTeams(): Promise<Team[]> {
    await delay();
    return mockTeams.filter((team) => team.isPublic && team.isRecruiting);
  },

  async getMembers(teamId: string): Promise<TeamMember[]> {
    await delay();
    return mockTeamMembers.filter((m) => m.teamId === teamId);
  },

  async getWorkers(): Promise<Worker[]> {
    await delay();
    return mockWorkers;
  },
};

// ===== COMBINED API OBJECT =====
export const api = {
  seller: sellerApi,
  worker: workerApi,
  hub: hubApi,
  team: teamApi,
};

export default api;
