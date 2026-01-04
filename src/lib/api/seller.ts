/**
 * Seller API Module
 * 
 * Handles all seller-related operations including:
 * - Seller profile and stats
 * - Services management
 * - Orders management
 * - Teams management
 * - Finance and transactions
 * - Job review and approval
 */

import { getCurrentSellerId } from "@/lib/storage";
import { generateOrderNumber, generateId } from "@/lib/utils/helpers";

import {
  delay,
  Transaction,
  getOrdersFromStorage,
  saveOrdersToStorage,
  calculateOrderProgress,
  getServicesFromStorage,
  saveServicesToStorage,
  getTeamsFromStorage,
  saveTeamsToStorage,
  getTeamMembersFromStorage,
  saveTeamMembersToStorage,
  getTeamJobsFromStorage,
  saveTeamJobsToStorage,
  getTeamPayoutsFromStorage,
  saveTeamPayoutsToStorage,
  getTransactionsFromStorage,
  saveTransactionsToStorage,
  calculateBalance,
  getJobClaimsFromStorage,
  saveJobClaimsToStorage,
  getSellersFromStorage,
  saveSellersToStorage,
  getWorkersFromStorage,
  getJobsFromStorage,
  saveJobsToStorage,
} from "./storage-helpers";

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
  TeamPayout,
} from "@/types";

// ===== DEFAULT DATA =====

const createDefaultSeller = (id: string): Seller => ({
  id,
  userId: id,
  displayName: "My Store",
  name: "My Store",
  slug: "my-store",
  subscription: "free",
  theme: "meelike",
  storeName: "My Store",
  storeSlug: "my-store",
  plan: "free",
  sellerRank: "bronze",
  platformFeePercent: 15,
  rollingAvgSpend: 0,
  totalSpentOnWorkers: 0,
  balance: 0,
  totalOrders: 0,
  totalRevenue: 0,
  rating: 0,
  ratingCount: 0,
  storeTheme: "meelike",
  isActive: true,
  isVerified: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ===== SELLER API =====
export const sellerApi = {
  async getSeller(): Promise<Seller> {
    await delay();
    const sellerId = getCurrentSellerId() || "seller-1";
    const sellers = getSellersFromStorage();
    
    let seller = sellers.find(s => s.id === sellerId);
    
    // Create default seller if not exists
    if (!seller) {
      seller = createDefaultSeller(sellerId);
      sellers.push(seller);
      saveSellersToStorage(sellers);
    }
    
    return seller;
  },

  async getStats() {
    await delay();
    const orders = getOrdersFromStorage();
    const payouts = getTeamPayoutsFromStorage();
    const members = getTeamMembersFromStorage();
    const claims = getJobClaimsFromStorage();
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= todayStart);
    const monthOrders = orders.filter(o => new Date(o.createdAt) >= monthStart);
    
    return {
      todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
      monthRevenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
      todayOrders: todayOrders.length,
      monthOrders: monthOrders.length,
      activeTeamMembers: members.filter(m => m.status === "active").length,
      pendingReviews: claims.filter(c => c.status === "submitted").length,
      pendingPayouts: payouts.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    };
  },

  async getServices(): Promise<StoreService[]> {
    await delay();
    return getServicesFromStorage();
  },

  async createServices(services: Partial<StoreService>[]): Promise<StoreService[]> {
    await delay();
    
    const existingServices = getServicesFromStorage();
    const now = new Date().toISOString();
    const sellerId = getCurrentSellerId() || "seller-1";
    
    const newServices: StoreService[] = services.map((service) => ({
      id: `svc-${generateId()}`,
      sellerId,
      name: service.name || "",
      description: service.description,
      category: service.category || "facebook",
      type: service.type || "like",
      serviceType: service.serviceType || "bot",
      // Bot: ใช้ costPrice, Human: ค่าจ้าง Worker กรอกตอนสร้าง Job
      costPrice: service.serviceType === "bot" ? (service.costPrice || 0) : undefined,
      // workerRate ไม่ต้องกรอกตอนสร้างบริการ - จะกรอกตอนสร้าง Job
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
    const sellerId = getCurrentSellerId() || "seller-1";
    const teams = getTeamsFromStorage();
    return teams.filter((team) => team.sellerId === sellerId);
  },

  // Legacy: เข้ากันได้กับ code เดิม (return ทีมแรก)
  async getTeam(): Promise<Team | null> {
    await delay();
    const sellerId = getCurrentSellerId() || "seller-1";
    const teams = getTeamsFromStorage();
    const sellerTeams = teams.filter((team) => team.sellerId === sellerId);
    return sellerTeams[0] || null;
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
    
    const sellerId = getCurrentSellerId() || "seller-1";
    const teams = getTeamsFromStorage();
    const now = new Date().toISOString();
    
    const newTeam: Team = {
      id: `team-${generateId()}`,
      sellerId,
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
      role: role as TeamMember['role'],
    };
    
    saveTeamMembersToStorage(members);
    return members[memberIndex];
  },

  async getJobs(): Promise<Job[]> {
    await delay();
    return getJobsFromStorage();
  },

  async getJobClaims(): Promise<JobClaim[]> {
    await delay();
    return getJobClaimsFromStorage();
  },

  async getPendingReviews(): Promise<JobClaim[]> {
    await delay();
    return this.getPendingJobClaims();
  },

  async getTeamJobs(): Promise<Job[]> {
    await delay();
    return getTeamJobsFromStorage();
  },

  async getTeamJobById(teamJobId: string): Promise<Job | null> {
    await delay();
    const jobs = getTeamJobsFromStorage();
    return jobs.find(j => j.id === teamJobId) || null;
  },

  async getJobClaimsByTeamJobId(teamJobId: string): Promise<JobClaim[]> {
    await delay();
    const claims = getJobClaimsFromStorage();
    const workers = getWorkersFromStorage();
    
    const jobClaims = claims.filter(c => c.jobId === teamJobId);
    
    // Join worker data
    return jobClaims.map(claim => {
      const worker = workers.find(w => w.id === claim.workerId);
      return {
        ...claim,
        worker,
      };
    });
  },

  async getTeamPayouts(): Promise<TeamPayout[]> {
    await delay();
    return getTeamPayoutsFromStorage();
  },

  async processTeamPayout(payoutId: string): Promise<TeamPayout | null> {
    await delay(800);
    
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
      title: `จ่ายค่าจ้าง Worker @${payout.worker?.displayName || 'Worker'}`,
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
      if (payout.status === "pending" && (!teamId || payout.worker?.teamIds?.includes(teamId))) {
        processedCount++;
        const txnRef = `TXN-${Date.now()}-${generateId()}`;
        
        // Create transaction for each payout
        const newTransaction: Transaction = {
          id: `txn-${generateId()}`,
          type: "expense",
          category: "payout",
          title: `จ่ายค่าจ้าง Worker @${payout.worker?.displayName || 'Worker'}`,
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
    const workers = getWorkersFromStorage();
    return workers.map((worker) => ({
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
    autoCreateJobs?: boolean;
    jobConfig?: {
      teamId: string;
      payRate: number;
      splitToTeams?: { teamId: string; quantity: number; payRate?: number }[];
    };
  }): Promise<Order> {
    await delay();
    
    const sellerId = getCurrentSellerId() || "seller-1";
    const orders = getOrdersFromStorage();
    const teams = getTeamsFromStorage();
    const jobs = getTeamJobsFromStorage();
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
      orderId: "",
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      serviceType: item.serviceType as "bot" | "human",
      platform: item.platform as OrderItem['platform'],
      type: item.type as OrderItem['type'],
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
      jobs: [],
    }));
    
    // Generate order ID and number
    const orderId = `order-${generateId()}`;
    const orderNumber = generateOrderNumber();
    
    // Create order
    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNumber,
      sellerId,
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
      trackingUrl: `seller.meelike.com/track/${orderNumber}`,
      createdAt: now,
      updatedAt: now,
    };
    
    // Set orderId for items
    newOrder.items.forEach(item => {
      item.orderId = newOrder.id;
    });
    
    // Auto create jobs if enabled (only for human services)
    if (payload.autoCreateJobs && payload.jobConfig) {
      const { jobConfig } = payload;
      
      for (let i = 0; i < newOrder.items.length; i++) {
        const item = newOrder.items[i];
        
        if (item.serviceType !== "human") continue;
        
        if (jobConfig.splitToTeams && jobConfig.splitToTeams.length > 0) {
          for (const split of jobConfig.splitToTeams) {
            const team = teams.find(t => t.id === split.teamId);
            if (!team) continue;
            
            const jobId = `job-${generateId()}`;
            const payRate = split.payRate ?? jobConfig.payRate;
            
            const newJob: Job = {
              id: jobId,
              sellerId,
              teamId: split.teamId,
              orderId: newOrder.id,
              orderItemId: item.id,
              orderNumber: newOrder.orderNumber,
              serviceName: item.serviceName,
              type: item.type,
              platform: item.platform,
              quantity: split.quantity,
              completedQuantity: 0,
              claimedQuantity: 0,
              pricePerUnit: payRate,
              totalPayout: split.quantity * payRate,
              targetUrl: item.targetUrl || "",
              instructions: item.commentTemplates?.join('\n'),
              visibility: "all_members",
              status: "pending",
              createdAt: now,
              updatedAt: now,
            };
            
            jobs.push(newJob);
            
            item.jobs!.push({
              jobId: jobId,
              teamId: split.teamId,
              teamName: team.name,
              quantity: split.quantity,
              completedQuantity: 0,
              status: "pending",
            });
          }
        } else {
          const team = teams.find(t => t.id === jobConfig.teamId);
          if (team) {
            const jobId = `job-${generateId()}`;
            
            const newJob: Job = {
              id: jobId,
              sellerId,
              teamId: jobConfig.teamId,
              orderId: newOrder.id,
              orderItemId: item.id,
              orderNumber: newOrder.orderNumber,
              serviceName: item.serviceName,
              type: item.type,
              platform: item.platform,
              quantity: item.quantity,
              completedQuantity: 0,
              claimedQuantity: 0,
              pricePerUnit: jobConfig.payRate,
              totalPayout: item.quantity * jobConfig.payRate,
              targetUrl: item.targetUrl || "",
              instructions: item.commentTemplates?.join('\n'),
              visibility: "all_members",
              status: "pending",
              createdAt: now,
              updatedAt: now,
            };
            
            jobs.push(newJob);
            
            item.jobs!.push({
              jobId: jobId,
              teamId: jobConfig.teamId,
              teamName: team.name,
              quantity: item.quantity,
              completedQuantity: 0,
              status: "pending",
            });
            
            item.jobId = jobId;
          }
        }
        
        if (item.jobs && item.jobs.length > 0) {
          item.status = "processing";
          item.startedAt = now;
        }
      }
      
      const hasJobs = newOrder.items.some(item => item.jobs && item.jobs.length > 0);
      if (hasJobs) {
        newOrder.status = "processing";
      }
      
      saveTeamJobsToStorage(jobs);
    }
    
    orders.unshift(newOrder);
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
    await delay(800);
    
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return null;
    
    const order = orders[orderIndex];
    const itemIndex = order.items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return null;
    
    const now = new Date().toISOString();
    const mockMeeLikeOrderId = `ML-${Math.floor(10000 + Math.random() * 90000)}`;
    
    order.items[itemIndex] = {
      ...order.items[itemIndex],
      status: "processing",
      meelikeOrderId: mockMeeLikeOrderId,
      startedAt: now,
    };
    
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
    
    const sellerId = getCurrentSellerId() || "seller-1";
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return null;
    
    const order = orders[orderIndex];
    const itemIndex = order.items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return null;
    
    const now = new Date().toISOString();
    const jobId = `job-${generateId()}`;
    const item = order.items[itemIndex];
    
    const jobs = getTeamJobsFromStorage();
    
    let instructions = requirements || "";
    if (!instructions && item.commentTemplates && item.commentTemplates.length > 0) {
      instructions = `ตัวอย่างความคิดเห็น:\n${item.commentTemplates.join('\n')}`;
    }
    
    const teams = getTeamsFromStorage();
    const team = teams.find(t => t.id === teamId);

    const newJob: Job = {
      id: jobId,
      sellerId,
      teamId: teamId,
      orderId: orderId,
      orderItemId: itemId,
      orderNumber: order.orderNumber,
      serviceName: item.serviceName,
      type: item.type,
      platform: item.platform,
      quantity: quantity,
      completedQuantity: 0,
      claimedQuantity: 0,
      pricePerUnit: payRate,
      totalPayout: quantity * payRate,
      targetUrl: item.targetUrl || "",
      instructions: instructions || undefined,
      visibility: "all_members",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    jobs.push(newJob);

    if (!order.items[itemIndex].jobs) {
      order.items[itemIndex].jobs = [];
    }
    order.items[itemIndex].jobs.push({
      jobId: jobId,
      teamId: teamId,
      teamName: team?.name || "Unknown Team",
      quantity: quantity,
      completedQuantity: 0,
      status: "pending",
    });
    saveTeamJobsToStorage(jobs);
    
    order.items[itemIndex] = {
      ...order.items[itemIndex],
      status: "processing",
      jobId: jobId,
      startedAt: now,
    };
    
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
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: "cancelled",
      cancelReason: reason || "Cancelled by seller",
      cancelledAt: now,
      updatedAt: now,
    };
    
    orders[orderIndex].items = orders[orderIndex].items.map(item => ({
      ...item,
      status: "cancelled",
    }));
    
    saveOrdersToStorage(orders);
    return orders[orderIndex];
  },

  // ===== TEAM JOB MANAGEMENT =====

  async updateTeamJob(jobId: string, updates: {
    quantity?: number;
    pricePerUnit?: number;
    instructions?: string;
    deadline?: string;
  }): Promise<Job | null> {
    await delay();
    
    const jobs = getTeamJobsFromStorage();
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) return null;
    
    const job = jobs[jobIndex];
    
    if (job.status !== "pending") {
      throw new Error("Cannot edit job that is already in progress or completed");
    }
    
    const now = new Date().toISOString();
    
    jobs[jobIndex] = {
      ...job,
      ...updates,
      totalPayout: (updates.quantity ?? job.quantity) * (updates.pricePerUnit ?? job.pricePerUnit),
      updatedAt: now,
    };
    
    saveTeamJobsToStorage(jobs);
    return jobs[jobIndex];
  },

  async deleteTeamJob(jobId: string): Promise<boolean> {
    await delay();
    
    const jobs = getTeamJobsFromStorage();
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) return false;
    
    const job = jobs[jobIndex];
    
    if (job.status !== "pending") {
      throw new Error("Cannot delete job that is already in progress or completed");
    }
    
    const claims = getJobClaimsFromStorage();
    const hasClaims = claims.some(c => c.jobId === jobId);
    
    if (hasClaims) {
      throw new Error("Cannot delete job that has worker claims");
    }
    
    jobs.splice(jobIndex, 1);
    saveTeamJobsToStorage(jobs);
    
    return true;
  },

  async cancelTeamJob(jobId: string, reason?: string): Promise<{
    success: boolean;
    payoutAmount: number;
    payoutCreated?: TeamPayout;
  }> {
    await delay(800);
    
    const jobs = getTeamJobsFromStorage();
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      throw new Error("Job not found");
    }
    
    const job = jobs[jobIndex];
    
    if (job.status === "completed" || job.status === "cancelled") {
      throw new Error("Cannot cancel completed or already cancelled job");
    }
    
    const now = new Date().toISOString();
    const claims = getJobClaimsFromStorage();
    const workers = getWorkersFromStorage();
    
    const jobClaims = claims.filter(c => c.jobId === jobId);
    
    let totalPayoutAmount = 0;
    let payoutCreated: TeamPayout | undefined;
    
    if (job.status === "pending") {
      totalPayoutAmount = 0;
    } else if (job.status === "in_progress") {
      jobClaims.forEach(claim => {
        if (claim.status === "claimed") {
          const partialAmount = (claim.actualQuantity || 0) * job.pricePerUnit;
          totalPayoutAmount += partialAmount;
        }
      });
    } else if (job.status === "pending_review") {
      jobClaims.forEach(claim => {
        if (claim.status === "submitted") {
          totalPayoutAmount += claim.earnAmount;
        }
      });
    }
    
    jobs[jobIndex] = {
      ...job,
      status: "cancelled",
      cancelledAt: now,
      cancelReason: reason,
      updatedAt: now,
    };
    
    saveTeamJobsToStorage(jobs);
    
    const updatedClaims = claims.map(claim => {
      if (claim.jobId === jobId && claim.status !== "approved") {
        return {
          ...claim,
          status: "cancelled" as const,
          updatedAt: now,
        };
      }
      return claim;
    });
    
    saveJobClaimsToStorage(updatedClaims);
    
    if (totalPayoutAmount > 0 && jobClaims.length > 0) {
      const payouts = getTeamPayoutsFromStorage();
      const workerPayments = new Map<string, number>();
      
      jobClaims.forEach(claim => {
        if ((job.status === "in_progress" && claim.status === "claimed") ||
            (job.status === "pending_review" && claim.status === "submitted")) {
          const amount = job.status === "in_progress" 
            ? (claim.actualQuantity || 0) * job.pricePerUnit
            : claim.earnAmount;
          
          workerPayments.set(
            claim.workerId,
            (workerPayments.get(claim.workerId) || 0) + amount
          );
        }
      });
      
      workerPayments.forEach((amount, workerId) => {
        const worker = workers.find(w => w.id === workerId);
        
        if (worker) {
          const existingPayoutIndex = payouts.findIndex(
            p => p.workerId === workerId && p.status === "pending"
          );
          
          if (existingPayoutIndex !== -1) {
            payouts[existingPayoutIndex].amount += amount;
            payouts[existingPayoutIndex].jobCount += 1;
          } else {
            const newPayout: TeamPayout = {
              id: `payout-${generateId()}`,
              workerId,
              worker,
              amount,
              jobCount: 1,
              status: "pending",
              requestedAt: now,
              paymentMethod: worker.promptPayId ? "promptpay" : "bank",
              paymentAccount: worker.promptPayId || worker.bankAccount || "",
              bankName: worker.bankName,
              accountName: worker.bankAccountName,
            };
            
            payouts.push(newPayout);
            
            if (!payoutCreated) {
              payoutCreated = newPayout;
            }
          }
        }
      });
      
      saveTeamPayoutsToStorage(payouts);
    }
    
    return {
      success: true,
      payoutAmount: totalPayoutAmount,
      payoutCreated,
    };
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
    
    const teamJobs = getTeamJobsFromStorage();
    const jobIndex = teamJobs.findIndex(j => j.id === claim.jobId);
    
    if (jobIndex !== -1) {
      teamJobs[jobIndex].completedQuantity += claim.actualQuantity || 0;
      
      if (teamJobs[jobIndex].completedQuantity >= teamJobs[jobIndex].quantity) {
        teamJobs[jobIndex].status = "completed";
        teamJobs[jobIndex].completedAt = now;
      }
      
      saveTeamJobsToStorage(teamJobs);
    }
    
    const payouts = getTeamPayoutsFromStorage();
    const workers = getWorkersFromStorage();
    const worker = workers.find(w => w.id === claim.workerId);
    
    if (worker) {
      const existingPayoutIndex = payouts.findIndex(
        p => p.workerId === claim.workerId && p.status === "pending"
      );
      
      if (existingPayoutIndex !== -1) {
        payouts[existingPayoutIndex].amount += claim.earnAmount;
        payouts[existingPayoutIndex].jobCount += 1;
      } else {
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
    
    const members = getTeamMembersFromStorage();
    const memberIndex = members.findIndex(m => 
      m.workerId === claim.workerId && 
      teamJobs[jobIndex]?.orderId
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

  // ===== ORDER-JOB INTEGRATION =====

  async splitJobToTeams(
    orderId: string,
    itemId: string,
    splits: { teamId: string; quantity: number; payRate: number }[]
  ): Promise<Job[]> {
    await delay(600);

    const sellerId = getCurrentSellerId() || "seller-1";
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error("Order not found");

    const order = orders[orderIndex];
    const itemIndex = order.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) throw new Error("Order item not found");

    const item = order.items[itemIndex];
    const teams = getTeamsFromStorage();
    const jobs = getTeamJobsFromStorage();
    const now = new Date().toISOString();

    const totalSplitQuantity = splits.reduce((sum, s) => sum + s.quantity, 0);
    const remainingQuantity = item.quantity - item.completedQuantity;
    if (totalSplitQuantity > remainingQuantity) {
      throw new Error(`จำนวนรวม (${totalSplitQuantity}) เกินจำนวนที่เหลือ (${remainingQuantity})`);
    }

    const createdJobs: Job[] = [];

    for (const split of splits) {
      const team = teams.find(t => t.id === split.teamId);
      if (!team) {
        throw new Error(`Team ${split.teamId} not found`);
      }

      const newJobId = `job-${generateId()}`;
      const newJob: Job = {
        id: newJobId,
        sellerId,
        teamId: split.teamId,
        orderId: orderId,
        orderItemId: itemId,
        orderNumber: order.orderNumber,
        serviceName: item.serviceName,
        type: item.type,
        platform: item.platform,
        quantity: split.quantity,
        completedQuantity: 0,
        claimedQuantity: 0,
        pricePerUnit: split.payRate,
        totalPayout: split.quantity * split.payRate,
        targetUrl: item.targetUrl || "",
        instructions: item.commentTemplates?.join('\n'),
        visibility: "all_members",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      jobs.push(newJob);
      createdJobs.push(newJob);

      if (!order.items[itemIndex].jobs) {
        order.items[itemIndex].jobs = [];
      }
      order.items[itemIndex].jobs.push({
        jobId: newJobId,
        teamId: split.teamId,
        teamName: team.name,
        quantity: split.quantity,
        completedQuantity: 0,
        status: "pending",
      });
    }

    order.items[itemIndex].status = "processing";
    if (!order.items[itemIndex].startedAt) {
      order.items[itemIndex].startedAt = now;
    }

    if (order.status === "confirmed" || order.status === "pending") {
      order.status = "processing";
    }
    order.updatedAt = now;

    saveTeamJobsToStorage(jobs);
    saveOrdersToStorage(orders);

    return createdJobs;
  },

  async reassignJob(
    jobId: string,
    payload: { toTeamId: string; reason?: string }
  ): Promise<Job> {
    await delay(600);

    const sellerId = getCurrentSellerId() || "seller-1";
    const jobs = getTeamJobsFromStorage();
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) throw new Error("Job not found");

    const oldJob = jobs[jobIndex];

    if (oldJob.status === "completed" || oldJob.status === "cancelled") {
      throw new Error("Cannot reassign completed or cancelled job");
    }

    const teams = getTeamsFromStorage();
    const newTeam = teams.find(t => t.id === payload.toTeamId);
    if (!newTeam) throw new Error("Target team not found");

    const orders = getOrdersFromStorage();
    const now = new Date().toISOString();

    const remainingQuantity = oldJob.quantity - oldJob.completedQuantity;

    const newJobId = `job-${generateId()}`;
    const newJob: Job = {
      id: newJobId,
      sellerId,
      teamId: payload.toTeamId,
      orderId: oldJob.orderId,
      orderItemId: oldJob.orderItemId,
      sourceJobId: oldJob.id,
      orderNumber: oldJob.orderNumber,
      serviceName: oldJob.serviceName,
      type: oldJob.type,
      platform: oldJob.platform,
      quantity: remainingQuantity,
      completedQuantity: 0,
      claimedQuantity: 0,
      pricePerUnit: oldJob.pricePerUnit,
      totalPayout: remainingQuantity * oldJob.pricePerUnit,
      targetUrl: oldJob.targetUrl,
      instructions: oldJob.instructions,
      visibility: "all_members",
      status: "pending",
      deadline: oldJob.deadline,
      createdAt: now,
      updatedAt: now,
    };

    jobs[jobIndex] = {
      ...oldJob,
      status: "cancelled",
      cancelledAt: now,
      cancelReason: payload.reason || `โยนงานไปทีม ${newTeam.name}`,
      updatedAt: now,
    };

    jobs.push(newJob);
    saveTeamJobsToStorage(jobs);

    if (oldJob.orderItemId) {
      const orderIndex = orders.findIndex(o => o.id === oldJob.orderId);
      if (orderIndex !== -1) {
        const itemIndex = orders[orderIndex].items.findIndex(
          i => i.id === oldJob.orderItemId
        );
        if (itemIndex !== -1 && orders[orderIndex].items[itemIndex].jobs) {
          const jobArrayIndex = orders[orderIndex].items[itemIndex].jobs!.findIndex(
            j => j.jobId === oldJob.id
          );
          if (jobArrayIndex !== -1) {
            orders[orderIndex].items[itemIndex].jobs![jobArrayIndex].status = "cancelled";
          }

          orders[orderIndex].items[itemIndex].jobs!.push({
            jobId: newJobId,
            teamId: payload.toTeamId,
            teamName: newTeam.name,
            quantity: remainingQuantity,
            completedQuantity: 0,
            status: "pending",
          });

          saveOrdersToStorage(orders);
        }
      }
    }

    return newJob;
  },

  async syncOrderItemProgress(orderItemId: string): Promise<void> {
    await delay();

    const orders = getOrdersFromStorage();
    const jobs = getTeamJobsFromStorage();

    let orderIndex = -1;
    let itemIndex = -1;

    for (let i = 0; i < orders.length; i++) {
      const idx = orders[i].items.findIndex(item => item.id === orderItemId);
      if (idx !== -1) {
        orderIndex = i;
        itemIndex = idx;
        break;
      }
    }

    if (orderIndex === -1 || itemIndex === -1) {
      throw new Error("Order item not found");
    }

    const order = orders[orderIndex];
    const item = order.items[itemIndex];

    const linkedJobs = jobs.filter(j => j.orderItemId === orderItemId);

    if (linkedJobs.length === 0) {
      return;
    }

    const totalCompleted = linkedJobs.reduce((sum, j) => sum + j.completedQuantity, 0);

    order.items[itemIndex].completedQuantity = totalCompleted;
    order.items[itemIndex].progress = Math.round((totalCompleted / item.quantity) * 100);

    if (order.items[itemIndex].jobs) {
      order.items[itemIndex].jobs = order.items[itemIndex].jobs!.map(jobSummary => {
        const fullJob = linkedJobs.find(j => j.id === jobSummary.jobId);
        if (fullJob) {
          return {
            ...jobSummary,
            completedQuantity: fullJob.completedQuantity,
            status: fullJob.status,
          };
        }
        return jobSummary;
      });
    }

    if (totalCompleted >= item.quantity) {
      order.items[itemIndex].status = "completed";
      order.items[itemIndex].completedAt = new Date().toISOString();
    }

    const allItems = order.items;
    const totalQuantity = allItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalCompletedOrder = allItems.reduce((sum, i) => sum + i.completedQuantity, 0);
    order.progress = Math.round((totalCompletedOrder / totalQuantity) * 100);

    const allItemsCompleted = allItems.every(
      i => i.status === "completed" || i.status === "cancelled"
    );
    if (allItemsCompleted && order.status === "processing") {
      order.status = "completed";
      order.completedAt = new Date().toISOString();
    }

    order.updatedAt = new Date().toISOString();
    saveOrdersToStorage(orders);
  },
};
