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

import { getSeller, getStats } from "./profile";
import {
  getServices,
  createServices,
  updateService,
  deleteService,
  bulkUpdateServices,
} from "./services";
import {
  getOrders,
  getOrderById,
  createOrder,
  confirmPayment,
  dispatchBotItem,
  cancelOrder,
} from "./orders";
import {
  getTeams,
  getTeam,
  getTeamMembers,
  createTeam,
  updateTeam,
  deleteTeam,
  removeTeamMember,
  updateTeamMemberRole,
} from "./teams";
import {
  getJobs,
  getJobClaims,
  getPendingReviews,
  getTeamJobs,
  getTeamJobById,
  getJobClaimsByTeamJobId,
  getPendingJobClaims,
  updateTeamJob,
  deleteTeamJob,
  cancelTeamJob,
  approveJobClaim,
  rejectJobClaim,
  assignHumanItemToTeam,
  splitJobToTeams,
  reassignJob,
  syncOrderItemProgress,
  createStandaloneJob,
} from "./jobs";
import {
  getTeamPayouts,
  processTeamPayout,
  processAllPendingPayouts,
  getTransactions,
  getBalance,
  createTopupTransaction,
  getWorkerBalances,
} from "./finance";

// ===== COMBINED SELLER API =====

export const sellerApi = {
  // Profile & Stats
  getSeller,
  getStats,

  // Services
  getServices,
  createServices,
  updateService,
  deleteService,
  bulkUpdateServices,

  // Orders
  getOrders,
  getOrderById,
  createOrder,
  confirmPayment,
  dispatchBotItem,
  cancelOrder,

  // Teams
  getTeams,
  getTeam,
  getTeamMembers,
  createTeam,
  updateTeam,
  deleteTeam,
  removeTeamMember,
  updateTeamMemberRole,

  // Jobs & Claims
  getJobs,
  getJobClaims,
  getPendingReviews,
  getTeamJobs,
  getTeamJobById,
  getJobClaimsByTeamJobId,
  getPendingJobClaims,
  updateTeamJob,
  deleteTeamJob,
  cancelTeamJob,
  approveJobClaim,
  rejectJobClaim,

  // Order-Job Integration
  assignHumanItemToTeam,
  splitJobToTeams,
  reassignJob,
  syncOrderItemProgress,

  // Standalone Jobs
  createStandaloneJob,

  // Finance
  getTeamPayouts,
  processTeamPayout,
  processAllPendingPayouts,
  getTransactions,
  getBalance,
  createTopupTransaction,
  getWorkerBalances,
};
