import { NextResponse } from "next/server";
import { requireWorker } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { worker, error } = await requireWorker();
  if (error) return error;

  const teamIds = await prisma.teamMember
    .findMany({
      where: { workerId: worker!.id, status: "active" },
      select: { teamId: true },
    })
    .then((members: Array<{ teamId: string }>) => members.map((m) => m.teamId));

  const availableJobs = teamIds.length
    ? await prisma.job.findMany({
        where: {
          teamId: { in: teamIds },
          status: { in: ["pending", "in_progress"] },
          visibility: "team",
        },
        include: { team: { select: { name: true, rating: true } } },
        orderBy: [{ isUrgent: "desc" }, { createdAt: "desc" }],
      })
    : [];

  const myClaims = await prisma.jobClaim.findMany({
    where: { workerId: worker!.id },
    include: {
      job: { include: { team: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ availableJobs, myClaims });
}
