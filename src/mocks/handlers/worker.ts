/**
 * MSW Worker Handlers
 */

import { http, HttpResponse, delay } from "msw";
import { workerApi } from "@/lib/api/worker";
import { verifyMockJWT } from "@/lib/auth/jwt";

const BASE = "/api/worker";

function getAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyMockJWT(authHeader.slice(7));
}

function unauthorized() {
  return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export const workerHandlers = [
  http.get(`${BASE}/profile`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await workerApi.getWorker();
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.get(`${BASE}/stats`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await workerApi.getStats();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/active-jobs`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await workerApi.getActiveJobs();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/jobs`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await workerApi.getJobs();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/accounts`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await workerApi.getAccounts();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/teams`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await workerApi.getTeams();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/team-jobs/:id/preview`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await workerApi.getTeamJobPreview(params.id as string);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post(`${BASE}/team-jobs/:id/claim`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = (await request.json()) as { quantity: number };
    const data = await workerApi.claimTeamJob(params.id as string, body.quantity);
    return HttpResponse.json(data, { status: 201 });
  }),

  http.post(`${BASE}/jobs/:id/submit`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    const body = await request.json();
    const data = await workerApi.submitJobClaim(params.id as string, body as any);
    return HttpResponse.json(data);
  }),
];
