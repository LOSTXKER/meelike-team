"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Badge, Avatar, Input, Skeleton } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { PlatformIcon } from "@/components/shared";
import { useTeamByInviteCode, useJoinTeamByInviteCode } from "@/lib/api/hooks";
import type { Team, Platform } from "@/types";
import {
  Users,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  KeyRound,
  Shield,
  AlertCircle,
  Loader2,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";

type PageState = "input" | "preview" | "result";
type ResultType = "joined" | "pending" | "already_member" | "already_applied";

export default function JoinTeamPage() {
  return (
    <Suspense fallback={
      <Container size="sm">
        <Section spacing="lg">
          <div className="flex justify-center py-8">
            <div className="space-y-6 w-full max-w-md">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </Section>
      </Container>
    }>
      <JoinTeamContent />
    </Suspense>
  );
}

function JoinTeamContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeFromUrl = searchParams.get("code") || "";

  const [manualCode, setManualCode] = useState("");
  const [pageState, setPageState] = useState<PageState>(codeFromUrl ? "preview" : "input");
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [joinedTeam, setJoinedTeam] = useState<Team | null>(null);

  const activeCode = pageState === "input" ? manualCode.trim() : codeFromUrl || manualCode.trim();

  const {
    data: team,
    isLoading: teamLoading,
    error: teamError,
  } = useTeamByInviteCode(pageState === "preview" ? activeCode : "");

  const joinMutation = useJoinTeamByInviteCode();

  const handleLookup = () => {
    if (manualCode.trim()) {
      setPageState("preview");
    }
  };

  const handleJoin = () => {
    joinMutation.mutate(activeCode, {
      onSuccess: (result) => {
        setResultType(result.type);
        setJoinedTeam(result.team);
        setPageState("result");
      },
    });
  };

  const handleRetry = () => {
    setManualCode("");
    setPageState("input");
    setResultType(null);
    setJoinedTeam(null);
  };

  // Loading state
  if (pageState === "preview" && teamLoading) {
    return (
      <Container size="sm">
        <Section spacing="lg" className="animate-fade-in">
          <div className="flex justify-center py-8">
            <div className="space-y-6 w-full max-w-md">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  // Error state - invalid code
  if (pageState === "preview" && (teamError || (!teamLoading && !team))) {
    return (
      <Container size="sm">
        <Section spacing="lg" className="animate-fade-in">
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-brand-text-dark mb-2">
              ไม่พบทีม
            </h1>
            <p className="text-brand-text-light mb-8 max-w-sm">
              รหัสเชิญไม่ถูกต้องหรือหมดอายุแล้ว กรุณาตรวจสอบรหัสอีกครั้ง
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRetry}>
                <KeyRound className="w-4 h-4 mr-2" />
                กรอกรหัสใหม่
              </Button>
              <Link href="/work/teams">
                <Button variant="ghost">กลับหน้าทีม</Button>
              </Link>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  // Result state
  if (pageState === "result" && resultType && joinedTeam) {
    return (
      <Container size="sm">
        <Section spacing="lg" className="animate-fade-in">
          <ResultView
            type={resultType}
            team={joinedTeam}
          />
        </Section>
      </Container>
    );
  }

  // Input state - manual code entry
  if (pageState === "input") {
    return (
      <Container size="sm">
        <Section spacing="lg" className="animate-fade-in">
          <div className="flex flex-col items-center py-8">
            {/* Header */}
            <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
              <KeyRound className="w-10 h-10 text-brand-primary" />
            </div>
            <h1 className="text-2xl font-bold text-brand-text-dark mb-2 text-center">
              เข้าร่วมทีม
            </h1>
            <p className="text-brand-text-light text-center mb-8 max-w-sm">
              กรอกรหัสเชิญที่ได้รับจากหัวหน้าทีม เพื่อเข้าร่วมทีม
            </p>

            {/* Code Input */}
            <Card variant="elevated" padding="lg" className="w-full max-w-md border-none shadow-xl">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-brand-text-dark block">
                  รหัสเชิญ
                </label>
                <Input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="เช่น TEAM1PRO"
                  className="text-center font-mono text-lg tracking-widest"
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
                <Button
                  className="w-full shadow-md shadow-brand-primary/20"
                  size="lg"
                  onClick={handleLookup}
                  disabled={!manualCode.trim()}
                >
                  ค้นหาทีม
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Back link */}
            <Link href="/work/teams" className="mt-6">
              <Button variant="ghost" size="sm" className="text-brand-text-light">
                <ArrowLeft className="w-4 h-4 mr-1" />
                กลับหน้าทีมของฉัน
              </Button>
            </Link>
          </div>
        </Section>
      </Container>
    );
  }

  // Preview state - show team info
  if (pageState === "preview" && team) {
    return (
      <Container size="sm">
        <Section spacing="lg" className="animate-fade-in">
          <div className="flex flex-col items-center py-4">
            {/* Header */}
            <h1 className="text-xl font-bold text-brand-text-dark mb-6 text-center">
              คุณได้รับเชิญเข้าร่วมทีม
            </h1>

            {/* Team Card */}
            <Card variant="elevated" padding="lg" className="w-full max-w-md border-none shadow-xl shadow-brand-primary/10">
              {/* Team Header */}
              <div className="flex items-start gap-4 mb-6">
                <Avatar
                  fallback={team.name}
                  size="xl"
                  className="w-20 h-20 text-2xl border-4 border-white shadow-lg"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-brand-text-dark truncate">
                    {team.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {team.rating > 0 && (
                      <Badge variant="warning" size="sm" className="px-2 py-0.5">
                        <Star className="w-3 h-3 mr-1 fill-brand-warning" />
                        {team.rating.toFixed(1)}
                      </Badge>
                    )}
                    <Badge variant="default" size="sm" className="px-2 py-0.5">
                      <Users className="w-3 h-3 mr-1" />
                      {team.memberCount} สมาชิก
                    </Badge>
                    {team.status === "active" && (
                      <Badge variant="success" size="sm" className="px-2 py-0.5">
                        เปิดรับสมาชิก
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {team.description && (
                <p className="text-sm text-brand-text-light leading-relaxed mb-6">
                  {team.description}
                </p>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-brand-bg/50 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-brand-text-dark">{team.memberCount}</p>
                  <p className="text-xs text-brand-text-light">สมาชิก</p>
                </div>
                <div className="text-center border-x border-brand-border/50">
                  <p className="text-lg font-bold text-brand-text-dark">{team.activeJobCount}</p>
                  <p className="text-xs text-brand-text-light">งานเปิดรับ</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-brand-text-dark">{team.totalJobsCompleted.toLocaleString()}</p>
                  <p className="text-xs text-brand-text-light">งานสำเร็จ</p>
                </div>
              </div>

              {/* Platforms */}
              {team.platforms && team.platforms.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-brand-text-light uppercase tracking-wide mb-2">
                    แพลตฟอร์ม
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {team.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2.5 py-1 bg-brand-bg border border-brand-border/50 rounded-lg text-xs font-medium text-brand-text-dark flex items-center gap-1.5"
                      >
                        <PlatformIcon platform={platform as Platform} className="w-3.5 h-3.5" />
                        <span className="capitalize">{platform}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Notice */}
              {team.requireApproval && (
                <div className="flex items-start gap-3 p-3 bg-brand-warning/10 border border-brand-warning/20 rounded-xl mb-6">
                  <Shield className="w-5 h-5 text-brand-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-dark">ต้องรอการอนุมัติ</p>
                    <p className="text-xs text-brand-text-light">
                      ทีมนี้ต้องได้รับการอนุมัติจากหัวหน้าทีมก่อนเข้าร่วม
                    </p>
                  </div>
                </div>
              )}

              {/* Join Button */}
              <Button
                className="w-full shadow-lg shadow-brand-primary/20"
                size="lg"
                onClick={handleJoin}
                disabled={joinMutation.isPending}
              >
                {joinMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    กำลังดำเนินการ...
                  </>
                ) : team.requireApproval ? (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    ส่งคำขอเข้าร่วมทีม
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    เข้าร่วมทีม
                  </>
                )}
              </Button>

              {/* Error */}
              {joinMutation.isError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 text-center">
                    {joinMutation.error?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่"}
                  </p>
                </div>
              )}
            </Card>

            {/* Back link */}
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" size="sm" className="text-brand-text-light" onClick={handleRetry}>
                <KeyRound className="w-4 h-4 mr-1" />
                กรอกรหัสอื่น
              </Button>
              <Link href="/work/teams">
                <Button variant="ghost" size="sm" className="text-brand-text-light">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  กลับหน้าทีม
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  return null;
}

// ===== Result View Component =====

function ResultView({ type, team }: { type: ResultType; team: Team }) {
  if (type === "joined") {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-success/10 flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="w-14 h-14 text-brand-success" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text-dark mb-2">
          เข้าร่วมทีมสำเร็จ!
        </h1>
        <p className="text-brand-text-light mb-2 max-w-sm">
          คุณเป็นสมาชิกของ <span className="font-semibold text-brand-text-dark">{team.name}</span> แล้ว
        </p>
        <p className="text-sm text-brand-text-light mb-8">
          เริ่มดูงานและจองงานได้ทันที
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link href={`/work/teams/${team.id}`} className="flex-1">
            <Button className="w-full shadow-md shadow-brand-primary/20" size="lg">
              ไปหน้าทีม
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href={`/work/teams/${team.id}/jobs`} className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              <ClipboardList className="w-4 h-4 mr-2" />
              ดูงาน
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (type === "pending") {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-warning/10 flex items-center justify-center mb-6 animate-scale-in">
          <Clock className="w-14 h-14 text-brand-warning" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text-dark mb-2">
          ส่งคำขอแล้ว!
        </h1>
        <p className="text-brand-text-light mb-2 max-w-sm">
          คำขอเข้าร่วมทีม <span className="font-semibold text-brand-text-dark">{team.name}</span> ถูกส่งเรียบร้อย
        </p>
        <p className="text-sm text-brand-text-light mb-8">
          กรุณารอหัวหน้าทีมอนุมัติ คุณจะได้รับแจ้งเตือนเมื่อได้รับการอนุมัติ
        </p>
        <Link href="/work/teams">
          <Button className="shadow-md shadow-brand-primary/20" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าทีมของฉัน
          </Button>
        </Link>
      </div>
    );
  }

  if (type === "already_member") {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-info/10 flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="w-14 h-14 text-brand-info" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text-dark mb-2">
          คุณเป็นสมาชิกอยู่แล้ว
        </h1>
        <p className="text-brand-text-light mb-8 max-w-sm">
          คุณเป็นสมาชิกของ <span className="font-semibold text-brand-text-dark">{team.name}</span> อยู่แล้ว
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link href={`/work/teams/${team.id}`} className="flex-1">
            <Button className="w-full shadow-md shadow-brand-primary/20" size="lg">
              ไปหน้าทีม
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href={`/work/teams/${team.id}/jobs`} className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              <ClipboardList className="w-4 h-4 mr-2" />
              ดูงาน
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (type === "already_applied") {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-warning/10 flex items-center justify-center mb-6 animate-scale-in">
          <Clock className="w-14 h-14 text-brand-warning" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text-dark mb-2">
          คุณส่งคำขอไปแล้ว
        </h1>
        <p className="text-brand-text-light mb-8 max-w-sm">
          คำขอเข้าร่วมทีม <span className="font-semibold text-brand-text-dark">{team.name}</span> อยู่ระหว่างรอการอนุมัติ
        </p>
        <Link href="/work/teams">
          <Button className="shadow-md shadow-brand-primary/20" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าทีมของฉัน
          </Button>
        </Link>
      </div>
    );
  }

  return null;
}
