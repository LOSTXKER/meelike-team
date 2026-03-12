import { apiClient } from "../client";
import type { Job, JobClaim } from "@/types";

export async function getJobs(teamId?: string) {
  if (teamId) {
    const res = await apiClient.get<{ jobs: Job[] }>(`/seller/teams/${teamId}/jobs`);
    return (res.data?.jobs ?? []) as Job[];
  }
  const teams = await apiClient.get<{ teams: Array<{ id: string }> }>("/seller/teams");
  const allJobs = await Promise.all(
    (teams.data?.teams ?? []).map((t) =>
      apiClient
        .get<{ jobs: Job[] }>(`/seller/teams/${t.id}/jobs`)
        .then((r) => (r.data?.jobs ?? []) as Job[])
    )
  );
  return allJobs.flat();
}

export async function getTeamJobs(teamId?: string) {
  return getJobs(teamId);
}

export async function getTeamJobById(jobId: string) {
  const jobs = await getJobs();
  return jobs.find((j) => j.id === jobId) ?? null;
}

export async function getJobClaims(jobId: string) {
  const jobs = await getJobs();
  const job = jobs.find((j) => j.id === jobId) as (Job & { claims?: JobClaim[] }) | undefined;
  return (job?.claims ?? []) as JobClaim[];
}

export async function getJobClaimsByTeamJobId(jobId: string) {
  return getJobClaims(jobId);
}

export async function getPendingJobClaims() {
  const jobs = await getJobs() as Array<Job & { claims?: JobClaim[] }>;
  return jobs
    .flatMap((j) => j.claims ?? [])
    .filter((c) => c.status === "submitted");
}

export async function getPendingReviews() {
  return getPendingJobClaims();
}

export async function createStandaloneJob(teamId: string, data: unknown) {
  const res = await apiClient.post<{ job: Job }>(`/seller/teams/${teamId}/jobs`, data);
  return (res.data?.job ?? null) as Job | null;
}

export async function updateTeamJob(id: string, data: unknown) {
  const teams = await apiClient.get<{ teams: Array<{ id: string }> }>("/seller/teams");
  for (const team of teams.data?.teams ?? []) {
    const jobs = await apiClient.get<{ jobs: Array<{ id: string }> }>(
      `/seller/teams/${team.id}/jobs`
    );
    if ((jobs.data?.jobs ?? []).find((j) => j.id === id)) {
      const res = await apiClient.patch<{ job: Job }>(
        `/seller/teams/${team.id}/jobs/${id}`,
        data
      );
      return (res.data?.job ?? null) as Job | null;
    }
  }
  return null;
}

export async function deleteTeamJob(id: string) {
  await updateTeamJob(id, { status: "cancelled" });
}

export async function cancelTeamJob(id: string, reason: string) {
  await updateTeamJob(id, { status: "cancelled", cancelReason: reason });
}

export async function approveJobClaim(claimId: string) {
  const teams = await apiClient.get<{ teams: Array<{ id: string }> }>("/seller/teams");
  for (const team of teams.data?.teams ?? []) {
    const jobs = await apiClient.get<{
      jobs: Array<{ id: string; claims: Array<{ id: string }> }>;
    }>(`/seller/teams/${team.id}/jobs`);
    for (const job of jobs.data?.jobs ?? []) {
      if ((job.claims ?? []).find((c) => c.id === claimId)) {
        const res = await apiClient.post(
          `/seller/teams/${team.id}/jobs/${job.id}/review`,
          { claimId, action: "approve" }
        );
        return res.data;
      }
    }
  }
  return null;
}

export async function rejectJobClaim(claimId: string, reason?: string) {
  const teams = await apiClient.get<{ teams: Array<{ id: string }> }>("/seller/teams");
  for (const team of teams.data?.teams ?? []) {
    const jobs = await apiClient.get<{
      jobs: Array<{ id: string; claims: Array<{ id: string }> }>;
    }>(`/seller/teams/${team.id}/jobs`);
    for (const job of jobs.data?.jobs ?? []) {
      if ((job.claims ?? []).find((c) => c.id === claimId)) {
        const res = await apiClient.post(
          `/seller/teams/${team.id}/jobs/${job.id}/review`,
          { claimId, action: "reject", rejectionReason: reason }
        );
        return res.data;
      }
    }
  }
  return null;
}

export async function assignHumanItemToTeam(
  _orderId: string,
  _itemId: string,
  teamId: string,
  quantity: number,
  payRate: number,
  requirements?: string
) {
  const res = await apiClient.post<{ job: Job }>(`/seller/teams/${teamId}/jobs`, {
    serviceName: "Manual Assignment",
    quantity,
    pricePerUnit: payRate,
    instructions: requirements,
  });
  return res.data?.job ?? null;
}

export async function splitJobToTeams(
  _orderId: string,
  _itemId: string,
  _splits: Array<{ teamId: string; quantity: number; payRate?: number }>
) {
  return null;
}

export async function reassignJob(_jobId: string, _options: unknown) {
  return null;
}

export async function syncOrderItemProgress(_orderId: string, _itemId: string) {
  return null;
}
