/**
 * MSW Seller Handlers
 *
 * Maps HTTP endpoints to seller API functions.
 */

import { http, HttpResponse, delay } from "msw";
import { sellerApi } from "@/lib/api/seller";
import { verifyMockJWT } from "@/lib/auth/jwt";

const BASE = "/api/seller";

/**
 * Extract and verify JWT from request. Returns null if invalid.
 */
function getAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyMockJWT(authHeader.slice(7));
}

function unauthorized() {
  return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export const sellerHandlers = [
  // ===== PROFILE & STATS =====

  http.get(`${BASE}/profile`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getSeller();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/stats`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getStats();
    return HttpResponse.json(data);
  }),

  // ===== SERVICES =====

  http.get(`${BASE}/services`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getServices();
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/services`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.createServices(body as any);
    return HttpResponse.json(data, { status: 201 });
  }),

  http.patch(`${BASE}/services/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.updateService(params.id as string, body as any);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.delete(`${BASE}/services/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await sellerApi.deleteService(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  http.patch(`${BASE}/services/bulk`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as { ids: string[]; patch: any };
    const count = await sellerApi.bulkUpdateServices(body.ids, body.patch);
    return HttpResponse.json({ updatedCount: count });
  }),

  // ===== ORDERS =====

  http.get(`${BASE}/orders`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getOrders();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/orders/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getOrderById(params.id as string);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post(`${BASE}/orders`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.createOrder(body as any);
    return HttpResponse.json(data, { status: 201 });
  }),

  http.post(`${BASE}/orders/:id/confirm-payment`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const data = await sellerApi.confirmPayment(params.id as string);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post(`${BASE}/orders/:id/dispatch-bot/:itemId`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const data = await sellerApi.dispatchBotItem(
      params.id as string,
      params.itemId as string
    );
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post(`${BASE}/orders/:id/cancel`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as { reason: string };
    const data = await sellerApi.cancelOrder(params.id as string, body.reason);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  // ===== TEAMS =====

  http.get(`${BASE}/teams`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getTeams();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/team`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getTeam();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/teams/:id/members`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getTeamMembers(params.id as string);
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/teams`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.createTeam(body as any);
    return HttpResponse.json(data, { status: 201 });
  }),

  http.patch(`${BASE}/teams/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.updateTeam(params.id as string, body as any);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.delete(`${BASE}/teams/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await sellerApi.deleteTeam(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  http.delete(`${BASE}/teams/:teamId/members/:workerId`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await sellerApi.removeTeamMember(
      params.teamId as string,
      params.workerId as string
    );
    return HttpResponse.json({ success: true });
  }),

  http.patch(
    `${BASE}/teams/:teamId/members/:workerId/role`,
    async ({ request, params }) => {
      if (!getAuth(request)) return unauthorized();
      const body = (await request.json()) as { role: string };
      const data = await sellerApi.updateTeamMemberRole(
        params.teamId as string,
        params.workerId as string,
        body.role
      );
      return data
        ? HttpResponse.json(data)
        : HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
  ),

  // ===== JOBS & CLAIMS =====

  http.get(`${BASE}/jobs`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getJobs();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/job-claims`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getJobClaims();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/pending-reviews`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getPendingReviews();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/team-jobs`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getTeamJobs();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/team-jobs/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getTeamJobById(params.id as string);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.get(`${BASE}/team-jobs/:id/claims`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getJobClaimsByTeamJobId(params.id as string);
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/pending-job-claims`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getPendingJobClaims();
    return HttpResponse.json(data);
  }),

  http.patch(`${BASE}/team-jobs/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.updateTeamJob(params.id as string, body as any);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.delete(`${BASE}/team-jobs/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await sellerApi.deleteTeamJob(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BASE}/team-jobs/:id/cancel`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as { reason: string };
    const data = await sellerApi.cancelTeamJob(params.id as string, body.reason);
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/job-claims/:id/approve`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const data = await sellerApi.approveJobClaim(params.id as string);
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/job-claims/:id/reject`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as { reason?: string };
    const data = await sellerApi.rejectJobClaim(params.id as string, body.reason);
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/orders/:orderId/items/:itemId/assign`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as {
      teamId: string;
      quantity: number;
      payRate: number;
      requirements?: string;
    };
    const data = await sellerApi.assignHumanItemToTeam(
      params.orderId as string,
      params.itemId as string,
      body.teamId,
      body.quantity,
      body.payRate,
      body.requirements
    );
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post(`${BASE}/orders/:orderId/items/:itemId/split`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as {
      splits: { teamId: string; quantity: number; payRate: number }[];
    };
    const data = await sellerApi.splitJobToTeams(
      params.orderId as string,
      params.itemId as string,
      body.splits
    );
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/jobs/:id/reassign`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.reassignJob(params.id as string, body as any);
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/teams/:teamId/standalone-jobs`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.createStandaloneJob(
      params.teamId as string,
      body as any
    );
    return HttpResponse.json(data, { status: 201 });
  }),

  // ===== FINANCE =====

  http.get(`${BASE}/payouts`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getTeamPayouts();
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/payouts/:id/process`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const data = await sellerApi.processTeamPayout(params.id as string);
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/payouts/process-all`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const count = await sellerApi.processAllPendingPayouts();
    return HttpResponse.json({ processedCount: count });
  }),

  http.get(`${BASE}/transactions`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getTransactions();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/balance`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const balance = await sellerApi.getBalance();
    return HttpResponse.json({ balance });
  }),

  http.post(`${BASE}/topup`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await sellerApi.createTopupTransaction(body as any);
    return HttpResponse.json(data, { status: 201 });
  }),

  http.get(`${BASE}/worker-balances`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await sellerApi.getWorkerBalances();
    return HttpResponse.json(data);
  }),
];
