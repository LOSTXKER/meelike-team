"use client";

import Link from "next/link";
import { Card, Button, Badge, Avatar } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import { mockTeam, mockTeamMembers } from "@/lib/mock-data";
import { Users, Star, ClipboardList, ArrowRight, Plus, Lightbulb } from "lucide-react";

export default function WorkerTeamsPage() {
  // Mock: Worker is in 2 teams
  const myTeams = [mockTeam, { ...mockTeam, id: "team-2", name: "ABC Boost" }];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="ทีมของฉัน"
        description={`ทีมที่คุณเข้าร่วมอยู่ (${myTeams.length} ทีม)`}
        icon={Users}
        action={
          <Link href="/work/teams/search">
            <Button leftIcon={<Plus className="w-4 h-4" />}>เข้าร่วมทีมใหม่</Button>
          </Link>
        }
      />

      {/* Teams */}
      <div className="space-y-4">
        {myTeams.map((team) => (
          <Card key={team.id} variant="bordered">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar fallback={team.name} size="lg" />
                <div>
                  <h3 className="font-semibold text-brand-text-dark text-lg">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-brand-text-light">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-brand-warning" />
                      แม่ทีม 4.9
                    </span>
                    <Badge variant="success" size="sm">
                      จ่ายไว
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-brand-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-text-dark">
                  {team.memberCount}
                </p>
                <p className="text-xs text-brand-text-light">สมาชิก</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-primary">
                  {team.activeJobCount}
                </p>
                <p className="text-xs text-brand-text-light">งานเปิด</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-success">
                  {team.totalJobsCompleted.toLocaleString()}
                </p>
                <p className="text-xs text-brand-text-light">งานสำเร็จ</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-brand-text-light mb-2">
                ประเภทงาน: ไลค์ FB, เม้น FB, Follow
              </p>
              <div className="flex gap-2">
                <Link href={`/work/teams/${team.id}/jobs`} className="flex-1">
                  <Button variant="primary" className="w-full">
                    ดูงาน →
                  </Button>
                </Link>
                <Button variant="outline">ออกจากทีม</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card variant="bordered" className="bg-brand-secondary/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-brand-info/10 rounded-lg flex items-center justify-center"><Lightbulb className="w-5 h-5 text-brand-info" /></div>
          <div>
            <h3 className="font-semibold text-brand-text-dark">
              ยังไม่มีทีม?
            </h3>
            <p className="text-sm text-brand-text-light mt-1">
              ขอ Link เชิญจากแม่ทีมที่รู้จัก หรือ ค้นหาทีมที่เปิดรับ
            </p>
            <Link href="/work/teams/search" className="inline-block mt-3">
              <Button size="sm" variant="outline" leftIcon={<Search className="w-4 h-4" />}>
                ค้นหาทีม
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

