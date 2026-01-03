"use client";

import Link from "next/link";
import { Card, Button, Badge, Progress, Skeleton, SkeletonCard } from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { StatsGrid, EmptyState, DailyStreak, LevelBenefitsTable, StatCard } from "@/components/shared";
import { useAuthStore } from "@/lib/store";
import { formatCurrency, getLevelInfo } from "@/lib/utils";
import { useWorkerStats, useWorkerActiveJobs } from "@/lib/api/hooks";
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  PlayCircle,
  ChevronRight,
  Trophy,
  Star,
  Target,
  ArrowUpRight,
  Sparkles,
  Camera,
  Flame,
  Award,
  Shield,
  CreditCard,
  History,
} from "lucide-react";

export default function WorkerDashboard() {
  const { user } = useAuthStore();
  const worker = user?.worker;
  const levelInfo = getLevelInfo(worker?.level || "gold");

  // Use API hooks instead of direct mock data imports
  const { data: workerStats, isLoading: statsLoading } = useWorkerStats();
  const { data: activeJobs, isLoading: jobsLoading } = useWorkerActiveJobs();

  // Calculate level progress
  const levelThresholds = {
    bronze: { min: 0, max: 50, next: "Silver" },
    silver: { min: 51, max: 200, next: "Gold" },
    gold: { min: 201, max: 500, next: "Platinum" },
    platinum: { min: 501, max: 1000, next: "VIP" },
    vip: { min: 1001, max: Infinity, next: "VIP" },
  };
  const currentThreshold = levelThresholds[worker?.level || "gold"];
  const progressToNextLevel = 75; // Demo value

  // Stats for the new Grid
  const dashboardStats = [
    {
      label: "งานวันนี้",
      value: "5",
      icon: CheckCircle2,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
    {
      label: "รายได้วันนี้",
      value: formatCurrency(workerStats?.todayEarned || 0),
      icon: TrendingUp,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
    {
      label: "คะแนนเฉลี่ย",
      value: "4.9",
      icon: Star,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "อัตราสำเร็จ",
      value: "98%",
      icon: Shield,
      iconColor: "text-brand-info",
      iconBgColor: "bg-brand-info/10",
    },
  ];

  const achievements = [
    { icon: <Trophy className="w-6 h-6" />, title: "Top Worker", desc: "อันดับ 1 ประจำสัปดาห์", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { icon: <Flame className="w-6 h-6" />, title: "7 Day Streak", desc: "ทำงานติดต่อกัน 7 วัน", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: <Star className="w-6 h-6" />, title: "5 Star Rating", desc: "คะแนนเฉลี่ย 4.9+", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: <CheckCircle2 className="w-6 h-6" />, title: "100% Success", desc: "งานสำเร็จ 100 งาน", color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in pb-20 lg:pb-0">
        {/* Header Section */}
        <HStack justify="between" align="center" className="flex-col md:flex-row gap-4">
          <VStack gap={1}>
            <h1 className="text-2xl font-bold text-brand-text-dark">
              สวัสดี, {worker?.displayName || "นุ่น"} 👋
            </h1>
            <p className="text-brand-text-light">
              วันนี้คุณพร้อมสร้างรายได้หรือยัง?
            </p>
          </VStack>
          <Link href="/hub">
            <Button className="shadow-lg shadow-brand-primary/20 rounded-full px-6">
              <Sparkles className="w-4 h-4 mr-2" />
              หางานใหม่
            </Button>
          </Link>
        </HStack>

        <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Profile & Achievements (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <Card variant="elevated" padding="none" className="overflow-hidden border-none shadow-xl shadow-brand-primary/10 relative group">
            {/* Header Gradient */}
            <div className="h-24 bg-gradient-to-br from-brand-primary via-brand-primary/80 to-brand-accent relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            </div>
            
            <div className="relative px-6 pb-6">
              <div className="relative inline-block -mt-12">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-white text-brand-primary font-bold">
                  {(worker?.displayName || "น").charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 bg-brand-text-dark text-white rounded-full border-2 border-white shadow-sm">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              
              <div className="mt-3">
                <h2 className="text-xl font-bold text-brand-text-dark">
                  {worker?.displayName || "นุ่น"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="warning" className="shadow-sm font-bold px-2 py-0.5 text-xs">
                    <Trophy className="w-3 h-3 mr-1" />
                    {levelInfo.name}
                  </Badge>
                  <Badge variant="default" className="shadow-sm px-2 py-0.5 text-xs">
                    <Star className="w-3 h-3 mr-1 fill-brand-warning text-brand-warning" />
                    4.9
                  </Badge>
                  <Badge variant="success" className="shadow-sm px-2 py-0.5 text-xs">
                    #1 ประจำสัปดาห์
                  </Badge>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-6 p-4 bg-brand-bg/50 rounded-xl border border-brand-border/50">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-brand-text-light font-medium flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    ความคืบหน้าสู่ {currentThreshold.next}
                  </span>
                  <span className="font-bold text-brand-primary">
                    {progressToNextLevel}%
                  </span>
                </div>
                <Progress value={progressToNextLevel} className="h-2 mb-3" />
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-md font-medium">
                    ค่าธรรมเนียม {levelInfo.fee}%
                  </span>
                  <span className="bg-brand-success/10 text-brand-success px-2 py-1 rounded-md font-medium">
                    โบนัส +{levelInfo.bonus}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Daily Streak */}
          <DailyStreak currentStreak={7} />

          {/* Achievements */}
          <Card variant="elevated" className="border-none shadow-lg">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2 text-base">
              <Award className="w-5 h-5 text-brand-accent" />
              ความสำเร็จ
              <Sparkles className="w-4 h-4 text-brand-warning" />
            </h3>
            <div className="space-y-3">
              {achievements.map((ach, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-brand-bg/50 rounded-xl hover:bg-brand-bg transition-colors group cursor-default"
                >
                  <div className={`p-2 rounded-xl shadow-sm ${ach.bg} ${ach.color} group-hover:scale-110 transition-transform`}>
                    {ach.icon}
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark text-sm">
                      {ach.title}
                    </p>
                    <p className="text-xs text-brand-text-light">
                      {ach.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Wallet, Stats, Jobs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Wallet Card */}
          <div className="grid md:grid-cols-2 gap-6">
            {statsLoading ? (
              <SkeletonCard className="h-[180px] md:col-span-2" />
            ) : (
              <Card className="bg-gradient-to-br from-[#8C6A54] to-[#6D5E54] text-white border-none shadow-xl shadow-[#8C6A54]/20 relative overflow-hidden md:col-span-2">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="p-6 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <p className="text-white/80 text-sm font-medium mb-1 flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> ยอดเงินคงเหลือ
                      </p>
                      <h2 className="text-5xl font-bold tracking-tight mb-2">
                        {formatCurrency(workerStats?.availableBalance || 0)}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> รอตรวจสอบ {formatCurrency(workerStats?.pendingBalance || 0)}
                        </span>
                        <span className="w-1 h-1 bg-white/30 rounded-full" />
                        <span>
                          ถอนแล้ว {formatCurrency(workerStats?.totalEarned || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                      <Link href="/work/earnings/withdraw" className="flex-1 md:flex-none">
                        <Button variant="secondary" className="w-full md:w-auto bg-white text-[#8C6A54] hover:bg-white/90 border-transparent shadow-lg font-bold px-6 h-12">
                          <CreditCard className="w-4 h-4 mr-2" />
                          ถอนเงิน
                        </Button>
                      </Link>
                      <Link href="/work/earnings" className="flex-1 md:flex-none">
                        <Button variant="secondary" className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm px-6 h-12">
                          <History className="w-4 h-4 mr-2" />
                          ประวัติ
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Stats Grid */}
          <StatsGrid stats={dashboardStats} columns={4} />

          {/* Active Jobs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-brand-primary" />
                งานที่กำลังทำอยู่ ({activeJobs?.length || 0})
              </h2>
              <Link href="/work/jobs" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                ดูทั้งหมด <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {jobsLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                <SkeletonCard className="h-[160px]" />
                <SkeletonCard className="h-[160px]" />
              </div>
            ) : activeJobs && activeJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {activeJobs.filter((job): job is NonNullable<typeof job> => job !== null).map((job) => {
                  const title = 'serviceName' in job ? job.serviceName : job.title;
                  const teamName = 'teamName' in job ? job.teamName : job.team;
                  const amount = ('earnings' in job ? (job.earnings || 0) : ('payout' in job ? job.payout : 0)) as number;
                  const progress = ('completedQuantity' in job ? job.completedQuantity : job.progress) as number;
                  const total = ('quantity' in job ? job.quantity : job.total) as number;
                  
                  return (
                  <Link href={`/work/jobs/${job.id}`} key={job.id}>
                    <Card variant="elevated" className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-brand-primary group cursor-pointer hover:-translate-y-1">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors line-clamp-1 text-lg">
                              {title}
                            </h3>
                            <p className="text-xs text-brand-text-light mt-1 flex items-center gap-1">
                              จาก {teamName}
                            </p>
                          </div>
                          <Badge variant="info" className="bg-brand-primary/10 text-brand-primary border-none text-sm px-2.5 py-1">
                            ฿{amount}
                          </Badge>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex justify-between text-xs text-brand-text-light font-medium">
                            <span className="flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-brand-primary" /> 
                              {progress}/{total}
                            </span>
                            <span className="text-brand-warning flex items-center gap-1.5 bg-brand-warning/10 px-2 py-0.5 rounded-md">
                              <Clock className="w-3.5 h-3.5" /> เหลือ {job.deadline || '-'}
                            </span>
                          </div>
                          <Progress value={(progress / total) * 100} className="h-2" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={PlayCircle}
                title="ไม่มีงานที่กำลังทำ"
                description="ไปที่ตลาดกลางเพื่อค้นหางานใหม่ๆ"
                action={
                  <Link href="/hub">
                    <Button variant="outline">ไปที่ตลาดกลาง</Button>
                  </Link>
                }
              />
            )}
          </div>

          {/* Recommended Jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-warning" />
                งานแนะนำสำหรับคุณ
              </h2>
              <Link href="/hub" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                ดูงานทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: 1, title: "กดไลค์เพจท่องเที่ยว", platform: "Facebook", type: "Human", payout: "0.5", desc: "ต้องการ 500 คน • จ่ายทันที", icon: "facebook" },
                { id: 2, title: "ดูวิดีโอ TikTok", platform: "TikTok", type: "Bot", payout: "0.2", desc: "ต้องการ 1,000 คน • ง่ายมาก", icon: "tiktok" },
              ].map((job) => (
                <Card key={job.id} variant="elevated" className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-none shadow-md">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${job.icon === 'facebook' ? 'bg-[#1877F2]/10 text-[#1877F2]' : 'bg-gray-800/10 text-gray-800'}`}>
                        {job.icon === 'facebook' ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.962.925-1.962 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.49-3.35-3.98-5.6-1.11-5.5 2.62-10.58 8.04-11.81 2.78-.59 5.53.17 7.78 1.83v-3.93c-2.16-1.49-4.81-2.06-7.41-1.4C6.06 2.7 3.33 5.42 2.11 8.2c-1.9 4.55-.4 10.3 3.64 13.44 2.44 1.91 5.76 2.39 8.66 1.22 1.97-1.02 3.33-2.92 3.73-5.06.33-1.9.25-3.8.3-5.69V.02z"/></svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-brand-text-dark text-lg group-hover:text-brand-primary transition-colors">
                            {job.title}
                          </h3>
                          <Badge variant="success" className="bg-brand-success/10 text-brand-success border-none">
                            ฿{job.payout}
                          </Badge>
                        </div>
                        <p className="text-sm text-brand-text-light mt-1">
                          {job.desc}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs font-medium text-brand-text-light bg-brand-bg px-2 py-1 rounded-md">
                            {job.platform}
                          </span>
                          <span className="text-xs font-medium text-brand-text-light bg-brand-bg px-2 py-1 rounded-md">
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Level Benefits Table */}
          <LevelBenefitsTable currentLevel={worker?.level || "gold"} />
        </div>
        </div>
      </Section>
    </Container>
  );
}
