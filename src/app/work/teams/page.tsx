"use client";

import Link from "next/link";
import { Card, Button, Badge, Avatar, Skeleton } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { useWorkerTeams } from "@/lib/api/hooks";
import { Users, Star, ClipboardList, ArrowRight, Lightbulb, Search, CheckCircle2, Sparkles } from "lucide-react";

export default function WorkerTeamsPage() {
  // Use API hook
  const { data: teams, isLoading } = useWorkerTeams();

  // Mock: Worker is in multiple teams
  const myTeams = teams ? [...teams, { ...teams[0], id: "team-2", name: "ABC Boost" }] : [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="ทีมของฉัน"
        description={`ทีมที่คุณเข้าร่วมอยู่ (${myTeams.length} ทีม)`}
        icon={Users}
        action={
          <Link href="/hub">
            <Button leftIcon={<Search className="w-4 h-4" />}>ค้นหาทีมใหม่</Button>
          </Link>
        }
      />

      {/* Teams */}
      <div className="space-y-6">
        {myTeams.map((team) => (
          <Card key={team.id} variant="elevated" className="border-none shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <Link href={`/work/teams/${team.id}`} className="flex items-start gap-4 group">
                <Avatar fallback={team.name} size="xl" className="w-20 h-20 text-2xl border-4 border-white shadow-sm group-hover:border-brand-primary/30 transition-colors" />
                <div>
                  <h3 className="font-bold text-brand-text-dark text-xl flex items-center gap-2 group-hover:text-brand-primary transition-colors">
                    {team.name}
                    <Badge variant="default" className="bg-brand-bg text-brand-text-light font-normal text-xs border-brand-border/50">
                      ID: {team.id}
                    </Badge>
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 bg-brand-warning/10 text-brand-warning px-2.5 py-1 rounded-lg border border-brand-warning/20 text-sm font-medium">
                      <Star className="w-4 h-4 fill-brand-warning" />
                      แม่ทีม 4.9
                    </div>
                    <Badge variant="success" size="sm" className="px-2.5 py-1 font-bold">
                      จ่ายไว
                    </Badge>
                  </div>
                  <p className="text-sm text-brand-text-light mt-3 leading-relaxed max-w-lg">
                    ทีมงานคุณภาพ จ่ายจริง จ่ายไว มีงานให้ทำตลอด 24 ชม. รับประกันรายได้
                  </p>
                </div>
              </Link>
              <div className="flex md:flex-col gap-2 shrink-0">
                <Link href={`/work/teams/${team.id}/jobs`} className="flex-1 md:flex-none">
                  <Button size="lg" className="w-full md:w-auto shadow-md shadow-brand-primary/20">
                    ดูงานในทีม <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href={`/work/teams/${team.id}`} className="flex-1 md:flex-none">
                  <Button variant="outline" className="w-full md:w-auto border-brand-border/50">
                    ดูโปรไฟล์ทีม
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-t border-brand-border/50 bg-brand-bg/30 rounded-xl px-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-brand-surface rounded-full shadow-sm mb-2">
                  <Users className="w-5 h-5 text-brand-primary" />
                </div>
                <p className="text-2xl font-bold text-brand-text-dark leading-none mb-1">
                  {team.memberCount}
                </p>
                <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide">สมาชิก</p>
              </div>
              <div className="flex flex-col items-center text-center border-l border-brand-border/50">
                <div className="p-2 bg-brand-surface rounded-full shadow-sm mb-2">
                  <ClipboardList className="w-5 h-5 text-brand-accent" />
                </div>
                <p className="text-2xl font-bold text-brand-text-dark leading-none mb-1">
                  {team.activeJobCount}
                </p>
                <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide">งานเปิดรับ</p>
              </div>
              <div className="flex flex-col items-center text-center border-l border-brand-border/50">
                <div className="p-2 bg-brand-surface rounded-full shadow-sm mb-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-success" />
                </div>
                <p className="text-2xl font-bold text-brand-text-dark leading-none mb-1">
                  {team.totalJobsCompleted.toLocaleString()}
                </p>
                <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide">งานสำเร็จ</p>
              </div>
            </div>

            <div className="pt-4 mt-2 flex items-center justify-between text-sm">
              <span className="text-brand-text-light font-medium">ประเภทงานหลัก:</span>
              <div className="flex gap-2">
                {["ไลค์ FB", "เม้น FB", "Follow"].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-brand-surface border border-brand-border/50 rounded-lg text-xs text-brand-text-dark">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card variant="elevated" className="bg-gradient-to-br from-brand-secondary/30 to-brand-secondary/10 border-none shadow-lg shadow-brand-primary/5">
        <div className="flex items-start gap-6 p-2">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Lightbulb className="w-7 h-7 text-brand-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-brand-text-dark mb-1">
              อยากได้งานเพิ่ม?
            </h3>
            <p className="text-brand-text-light mb-4 text-sm leading-relaxed">
              ไปที่ Hub ตลาดกลาง เพื่อค้นหาทีมใหม่ที่เปิดรับสมาชิก หรือดูประกาศหางานจาก Seller โดยตรง
            </p>
            <Link href="/hub" className="inline-block">
              <Button size="sm" className="shadow-md shadow-brand-primary/20" leftIcon={<Sparkles className="w-4 h-4" />}>
                ไปที่ Hub
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
