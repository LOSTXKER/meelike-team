"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useSellerTeams } from "@/lib/api/hooks";
import { getTeamNav, isNavGroup } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { Button, Badge, Skeleton } from "@/components/ui";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  Menu,
  X,
  Users,
  Star,
} from "lucide-react";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const teamId = params.id as string;

  const [showTeamSwitcher, setShowTeamSwitcher] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: teams, isLoading } = useSellerTeams();

  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  const teamNav = useMemo(() => getTeamNav(teamId), [teamId]);

  const handleTeamSwitch = (newTeamId: string) => {
    // Get current path segment after team/[id]
    const pathParts = pathname.split("/");
    const teamIdIndex = pathParts.indexOf(teamId);
    const remainingPath = pathParts.slice(teamIdIndex + 1).join("/");

    // Navigate to same page in new team
    const newPath = remainingPath
      ? `/seller/team/${newTeamId}/${remainingPath}`
      : `/seller/team/${newTeamId}`;

    router.push(newPath);
    setShowTeamSwitcher(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <div className="bg-white border-b border-brand-border/50">
          <div className="max-w-7xl mx-auto h-16 px-6 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <div className="bg-white border-b border-brand-border/50">
          <div className="max-w-7xl mx-auto h-14 px-6 flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-lg" />
            ))}
          </div>
        </div>
        <main className="max-w-7xl mx-auto p-6">
          <Skeleton className="h-64 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Team Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto h-16 px-4 lg:px-6 flex items-center justify-between">
          {/* Left: Back + Team Info */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 hover:bg-brand-bg rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-brand-text-light" />
            </button>

            {/* Back to Store */}
            <Link href="/seller">
              <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-text-light hover:text-brand-primary group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </Link>

            <div className="h-8 w-px bg-brand-border/50 hidden sm:block" />

            {/* Team Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {currentTeam?.name?.charAt(0) || "T"}
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-brand-text-dark text-lg leading-tight">
                  {currentTeam?.name || "Team"}
                </h1>
                <div className="flex items-center gap-2 text-xs text-brand-text-light">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {currentTeam?.memberCount || 0} สมาชิก
                  </span>
                  {currentTeam?.rating && (
                    <>
                      <span className="w-1 h-1 bg-brand-border rounded-full" />
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-brand-warning fill-brand-warning" />
                        {currentTeam.rating}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Team Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowTeamSwitcher(!showTeamSwitcher)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-border/50 hover:border-brand-primary/30 hover:bg-brand-bg/50 transition-all text-sm"
            >
              <span className="text-brand-text-light hidden sm:inline">เปลี่ยนทีม</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-brand-text-light transition-transform",
                  showTeamSwitcher && "rotate-180"
                )}
              />
            </button>

            {/* Team Switcher Dropdown */}
            {showTeamSwitcher && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTeamSwitcher(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-brand-border/50 z-50 overflow-hidden animate-fade-in">
                  <div className="p-3 border-b border-brand-border/30 bg-brand-bg/30">
                    <p className="text-sm font-medium text-brand-text-dark">เลือกทีม</p>
                    <p className="text-xs text-brand-text-light">คุณมี {teams?.length || 0} ทีม</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {teams?.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => handleTeamSwitch(team.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 hover:bg-brand-bg/50 transition-colors text-left",
                          team.id === teamId && "bg-brand-primary/5"
                        )}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary/80 to-brand-primary-dark rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {team.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-text-dark truncate">
                            {team.name}
                          </p>
                          <p className="text-xs text-brand-text-light">
                            {team.memberCount} สมาชิก • {team.activeJobCount} งาน
                          </p>
                        </div>
                        {team.id === teamId && (
                          <Check className="w-5 h-5 text-brand-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-brand-border/30 bg-brand-bg/30">
                    <Link href="/seller">
                      <Button variant="ghost" size="sm" className="w-full justify-center">
                        ดูทีมทั้งหมด
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Horizontal Tabs Navigation */}
        <div className="border-t border-brand-border/30 bg-white">
          {/* Desktop Tabs */}
          <nav className="max-w-7xl mx-auto hidden lg:flex items-center gap-1 px-6 overflow-x-auto no-scrollbar">
            {teamNav.map((item) => {
              if (isNavGroup(item)) return null;

              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3.5 font-medium text-sm transition-all relative whitespace-nowrap",
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-text-light hover:text-brand-text-dark hover:bg-brand-bg/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="error" size="sm" className="ml-1">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Horizontal Scroll Tabs */}
          <nav className="max-w-7xl mx-auto lg:hidden flex items-center gap-1 px-4 overflow-x-auto no-scrollbar">
            {teamNav.map((item) => {
              if (isNavGroup(item)) return null;

              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative whitespace-nowrap shrink-0",
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="error" size="sm" className="ml-1">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-xl animate-slide-in-left">
            <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-xl flex items-center justify-center text-white font-bold">
                  {currentTeam?.name?.charAt(0) || "T"}
                </div>
                <div>
                  <p className="font-bold text-brand-text-dark">{currentTeam?.name}</p>
                  <p className="text-xs text-brand-text-light">{currentTeam?.memberCount} สมาชิก</p>
                </div>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 hover:bg-brand-bg rounded-lg"
              >
                <X className="w-5 h-5 text-brand-text-light" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {teamNav.map((item) => {
                if (isNavGroup(item)) return null;

                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                      isActive
                        ? "bg-brand-primary text-white shadow-md"
                        : "text-brand-text-light hover:bg-brand-bg"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={isActive ? "default" : "error"}
                        size="sm"
                        className={cn("ml-auto", isActive && "bg-white/20 text-white")}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-border/50">
              <Link href="/seller/team" onClick={() => setMobileSidebarOpen(false)}>
                <Button variant="outline" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  กลับไป Store
                </Button>
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* Main Content - Centered */}
      <main className="max-w-7xl mx-auto p-4 lg:p-6 min-h-[calc(100vh-8rem)]">
        {children}
      </main>
    </div>
  );
}
