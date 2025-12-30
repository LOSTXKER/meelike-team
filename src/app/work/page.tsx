"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Card, Button, Badge, Progress, Avatar } from "@/components/ui";
import { formatCurrency, getLevelInfo } from "@/lib/utils";
import { mockJobs, mockTeam, mockWorkerStats, mockJobClaims } from "@/lib/mock-data";
import {
  Wallet,
  ArrowRight,
  Clock,
  CheckCircle,
  Flame,
  Trophy,
  Star,
  ShoppingBag,
  ClipboardList,
  DollarSign,
  Users,
} from "lucide-react";

export default function WorkerDashboard() {
  const { user } = useAuthStore();
  const worker = user?.worker;
  const levelInfo = getLevelInfo(worker?.level || "bronze");

  const availableJobs = mockJobs.filter(
    (job) => job.status === "open" || job.status === "in_progress"
  );

  const myPendingClaims = mockJobClaims.filter(
    (claim) => claim.workerId === worker?.id && claim.status === "claimed"
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark">
            👋 สวัสดี {worker?.displayName}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`font-medium ${levelInfo.color}`}>
              {levelInfo.name}
            </span>
            <span className="text-brand-text-light">•</span>
            <span className="flex items-center gap-1 text-brand-text-light">
              <Star className="w-4 h-4 text-brand-warning" />
              {worker?.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-brand-primary to-brand-primary/80 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ยอดเงินสะสม
            </p>
            <p className="text-3xl font-bold mt-1">
              {formatCurrency(mockWorkerStats.availableBalance)}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
              <span>รอตรวจสอบ: {formatCurrency(mockWorkerStats.pendingBalance)}</span>
              <span>ถอนขั้นต่ำ: ฿100</span>
            </div>
          </div>
          <Link href="/work/earnings/withdraw">
            <Button
              variant="secondary"
              className="bg-white text-brand-primary hover:bg-white/90"
            >
              💸 ถอนเงิน
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-warning/20">
              <Flame className="w-5 h-5 text-brand-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">
                {mockWorkerStats.streak}
              </p>
              <p className="text-xs text-brand-text-light">วันติดต่อกัน</p>
            </div>
          </div>
        </Card>
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-success/10">
              <CheckCircle className="w-5 h-5 text-brand-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">
                {worker?.totalJobsCompleted}
              </p>
              <p className="text-xs text-brand-text-light">งานสำเร็จ</p>
            </div>
          </div>
        </Card>
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-info/20">
              <Clock className="w-5 h-5 text-brand-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">
                {myPendingClaims.length}
              </p>
              <p className="text-xs text-brand-text-light">รอส่งงาน</p>
            </div>
          </div>
        </Card>
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-accent/10">
              <Trophy className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">
                #{mockWorkerStats.weeklyRank}
              </p>
              <p className="text-xs text-brand-text-light">อันดับสัปดาห์</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-brand-text-dark flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-error" />
            งานจากทีมของฉัน ({availableJobs.length})
          </h2>
          <Link
            href="/work/teams"
            className="text-sm text-brand-primary hover:underline flex items-center gap-1"
          >
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {availableJobs.map((job) => (
            <Card key={job.id} variant="bordered">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-brand-text-light mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    ทีม: {mockTeam.name}
                  </p>
                  <h3 className="font-semibold text-brand-text-dark">
                    <span>{job.title || `${job.targetQuantity} ${job.type}`}</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="info" size="sm" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      แม่ทีม 4.9
                    </Badge>
                    <Badge variant="success" size="sm">
                      จ่ายไว
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-success">
                    {formatCurrency(job.pricePerUnit)}/{job.type === "view" ? "view" : "หน่วย"}
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">
                    เหลือ {job.targetQuantity - job.claimedQuantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                <div className="flex items-center gap-2 text-sm text-brand-text-light">
                  <Clock className="w-4 h-4" />
                  {job.endsAt
                    ? `ปิดใน ${Math.round(
                        (new Date(job.endsAt).getTime() - Date.now()) / (1000 * 60 * 60)
                      )} ชม.`
                    : "ไม่จำกัดเวลา"}
                </div>
                <Link href={`/work/jobs/${job.id}`}>
                  <Button size="sm">รับงาน →</Button>
                </Link>
              </div>
            </Card>
          ))}

          {availableJobs.length === 0 && (
            <Card variant="bordered" className="text-center py-8">
              <p className="text-brand-text-light">ยังไม่มีงานจากทีมของคุณ</p>
              <Link href="/work/teams/search" className="inline-block mt-3">
                <Button variant="outline">ค้นหาทีมใหม่</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* My Pending Jobs */}
      {myPendingClaims.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-text-dark flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-primary" />
              งานของฉัน ({myPendingClaims.length} รอส่ง)
            </h2>
            <Link
              href="/work/my-jobs"
              className="text-sm text-brand-primary hover:underline flex items-center gap-1"
            >
              ดูทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {myPendingClaims.slice(0, 2).map((claim) => {
              const job = mockJobs.find((j) => j.id === claim.jobId);
              return (
                <Card key={claim.id} variant="bordered">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-brand-text-dark">
                        {job?.title || "งาน"}
                      </h3>
                      <p className="text-sm text-brand-text-light mt-1 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        {mockTeam.name} • รับ {claim.quantity} รายการ •{" "}
                        {formatCurrency(claim.earnAmount)}
                      </p>
                    </div>
                    <Link href={`/work/my-jobs/${claim.id}/submit`}>
                      <Button size="sm" variant="secondary">
                        ส่งงาน →
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Streak Bonus */}
      <Card variant="bordered" className="bg-gradient-to-r from-brand-warning/10 to-transparent">
        <div className="flex items-center gap-4">
          <Flame className="w-10 h-10 text-brand-error" />
          <div className="flex-1">
            <h3 className="font-semibold text-brand-text-dark">
              Streak: {mockWorkerStats.streak} วัน
            </h3>
            <p className="text-sm text-brand-text-light">
              ทำงานติดต่อกัน 7 วัน รับโบนัส ฿15!
            </p>
            <Progress
              value={(mockWorkerStats.streak / 7) * 100}
              className="mt-2"
              size="sm"
              variant="warning"
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-brand-text-light">โบนัสถัดไป</p>
            <p className="font-bold text-brand-warning">+฿15</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

