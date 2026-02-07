/**
 * MSW Hub Handlers
 */

import { http, HttpResponse, delay } from "msw";
import { hubApi } from "@/lib/api/hub";
import { verifyMockJWT } from "@/lib/auth/jwt";

const BASE = "/api/hub";

function getAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyMockJWT(authHeader.slice(7));
}

function unauthorized() {
  return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export const hubHandlers = [
  // ===== POSTS =====

  http.get(`${BASE}/posts`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const url = new URL(request.url);
    const type = url.searchParams.get("type") as
      | "all"
      | "recruit"
      | "find-team"
      | "outsource"
      | undefined;
    await delay();
    const data = await hubApi.getPosts(type || undefined);
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/stats`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await hubApi.getStats();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/posts/find-team`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await hubApi.getFindTeamPosts();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/posts/recruit`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await hubApi.getRecruitPosts();
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/posts`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await hubApi.createPost(body as any);
    return HttpResponse.json(data, { status: 201 });
  }),

  http.post(`${BASE}/teams/:teamId/apply`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as {
      sellerId?: string;
      message?: string;
    };
    const data = await hubApi.applyToTeam(
      params.teamId as string,
      body.sellerId,
      body.message
    );
    return HttpResponse.json(data, { status: 201 });
  }),

  http.post(`${BASE}/applications/:id/approve`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const data = await hubApi.approveApplication(params.id as string);
    return HttpResponse.json(data);
  }),

  // ===== OUTSOURCE =====

  http.get(`${BASE}/outsource-jobs`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await hubApi.getOutsourceJobs();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/outsource-jobs/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await hubApi.getOutsourceJobById(params.id as string);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post(`${BASE}/outsource-jobs/from-order`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await hubApi.postOutsourceFromOrder(body as any);
    return HttpResponse.json(data, { status: 201 });
  }),

  http.post(`${BASE}/outsource-jobs/direct`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await hubApi.postOutsourceDirect(body as any);
    return HttpResponse.json(data, { status: 201 });
  }),

  http.post(`${BASE}/outsource-jobs/:id/bid`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as any;
    const data = await hubApi.createBid({
      ...body,
      outsourceJobId: params.id as string,
    });
    return HttpResponse.json(data, { status: 201 });
  }),

  http.post(`${BASE}/bids/:id/accept`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const data = await hubApi.acceptBid(params.id as string);
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/bids/:id/reject`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const data = await hubApi.rejectBid(params.id as string);
    return HttpResponse.json(data);
  }),

  http.post(`${BASE}/outsource-jobs/:id/cancel`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const data = await hubApi.cancelOutsourceJob(params.id as string);
    return HttpResponse.json(data);
  }),
];
