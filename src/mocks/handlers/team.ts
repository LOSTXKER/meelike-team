/**
 * MSW Team Handlers
 */

import { http, HttpResponse, delay } from "msw";
import { teamApi } from "@/lib/api/team";
import { verifyMockJWT } from "@/lib/auth/jwt";

const BASE = "/api/teams";

function getAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyMockJWT(authHeader.slice(7));
}

function unauthorized() {
  return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export const teamHandlers = [
  http.get(`${BASE}`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await teamApi.getAllTeams();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/public`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await teamApi.getPublicTeams();
    return HttpResponse.json(data);
  }),

  http.get(`${BASE}/:id`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await teamApi.getTeamById(params.id as string);
    return data
      ? HttpResponse.json(data)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.get(`${BASE}/:id/members`, async ({ request, params }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await teamApi.getMembers(params.id as string);
    return HttpResponse.json(data);
  }),

  http.get(`/api/workers`, async ({ request }) => {
    if (!getAuth(request)) return unauthorized();
    await delay();
    const data = await teamApi.getWorkers();
    return HttpResponse.json(data);
  }),
];
