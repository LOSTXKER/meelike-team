"use client";

import React, { useState } from "react";
import { Card, Button, Input, Badge, Modal } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/shared";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  Smartphone,
  ClipboardList,
  Lightbulb,
  Shield,
  Sparkles,
} from "lucide-react";

type Platform = "facebook" | "instagram" | "tiktok" | "youtube";

interface SocialAccount {
  id: string;
  platform: Platform;
  username: string;
  profileUrl: string;
  status: "verified" | "pending" | "rejected";
  addedAt: string;
  lastUsed?: string;
  jobsCompleted: number;
}

const platformConfig: Record<
  Platform,
  { name: string; icon: React.ReactNode; color: string; bgColor: string; placeholder: string; gradient: string }
> = {
  facebook: {
    name: "Facebook",
    icon: <Facebook className="w-6 h-6" />,
    color: "text-[#1877F2]",
    bgColor: "bg-[#1877F2]/10",
    gradient: "from-[#1877F2]/20 to-[#1877F2]/5",
    placeholder: "https://facebook.com/yourprofile",
  },
  instagram: {
    name: "Instagram",
    icon: <Instagram className="w-6 h-6" />,
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/10",
    gradient: "from-[#E4405F]/20 to-[#FCAF45]/10",
    placeholder: "https://instagram.com/yourusername",
  },
  tiktok: {
    name: "TikTok",
    icon: <Music2 className="w-6 h-6" />,
    color: "text-gray-800",
    bgColor: "bg-gray-800/10",
    gradient: "from-gray-800/20 to-[#00f2ea]/10",
    placeholder: "https://tiktok.com/@yourusername",
  },
  youtube: {
    name: "YouTube",
    icon: <Youtube className="w-6 h-6" />,
    color: "text-[#FF0000]",
    bgColor: "bg-[#FF0000]/10",
    gradient: "from-[#FF0000]/20 to-[#FF0000]/5",
    placeholder: "https://youtube.com/c/yourchannel",
  },
};

export default function WorkerAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "acc-1",
      platform: "facebook",
      username: "Noon Srisuk",
      profileUrl: "https://facebook.com/noon.srisuk",
      status: "verified",
      addedAt: "2024-11-15",
      lastUsed: "2024-12-30",
      jobsCompleted: 156,
    },
    {
      id: "acc-2",
      platform: "instagram",
      username: "@noon_work",
      profileUrl: "https://instagram.com/noon_work",
      status: "verified",
      addedAt: "2024-11-20",
      lastUsed: "2024-12-29",
      jobsCompleted: 89,
    },
    {
      id: "acc-3",
      platform: "tiktok",
      username: "@noon_tiktok",
      profileUrl: "https://tiktok.com/@noon_tiktok",
      status: "pending",
      addedAt: "2024-12-28",
      jobsCompleted: 0,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    platform: "facebook" as Platform,
    profileUrl: "",
  });

  const handleAddAccount = () => {
    const account: SocialAccount = {
      id: `acc-${Date.now()}`,
      platform: newAccount.platform,
      username: newAccount.profileUrl.split("/").pop() || "Unknown",
      profileUrl: newAccount.profileUrl,
      status: "pending",
      addedAt: new Date().toISOString(),
      jobsCompleted: 0,
    };
    setAccounts([...accounts, account]);
    setShowAddModal(false);
    setNewAccount({ platform: "facebook", profileUrl: "" });
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm("คุณต้องการลบบัญชีนี้หรือไม่?")) {
      setAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  const getStatusBadge = (status: SocialAccount["status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="success" size="sm" className="shadow-sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            ยืนยันแล้ว
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" size="sm" className="shadow-sm">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            รอตรวจสอบ
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="error" size="sm" className="shadow-sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            ไม่ผ่าน
          </Badge>
        );
    }
  };

  const verifiedCount = accounts.filter((a) => a.status === "verified").length;
  const totalJobs = accounts.reduce((sum, a) => sum + a.jobsCompleted, 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-dark tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-brand-primary/10 rounded-xl">
              <Smartphone className="w-7 h-7 text-brand-primary" />
            </span>
            บัญชี Social Media
          </h1>
          <p className="text-brand-text-light mt-2 text-lg">
            จัดการบัญชีที่ใช้รับงาน • {accounts.length} บัญชี ({verifiedCount} ยืนยันแล้ว)
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)} 
          size="lg"
          className="shadow-lg shadow-brand-primary/20"
          leftIcon={<Plus className="w-5 h-5" />}
        >
          เพิ่มบัญชี
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(platformConfig) as Platform[]).map((platform) => {
          const count = accounts.filter((a) => a.platform === platform).length;
          const verifiedPlatformCount = accounts.filter(
            (a) => a.platform === platform && a.status === "verified"
          ).length;
          const platformJobs = accounts
            .filter((a) => a.platform === platform)
            .reduce((sum, a) => sum + a.jobsCompleted, 0);
            
          return (
            <Card 
              key={platform} 
              variant="elevated" 
              padding="md" 
              className={`border-none shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden bg-gradient-to-br ${platformConfig[platform].gradient}`}
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
              <div className="relative flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-md ${platformConfig[platform].color}`}>
                  {platformConfig[platform].icon}
                </div>
                <div>
                  <p className="font-bold text-brand-text-dark text-lg">
                    {platformConfig[platform].name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-brand-text-dark">{verifiedPlatformCount}/{count}</span>
                    <span className="text-xs text-brand-text-light">บัญชี</span>
                    {platformJobs > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-brand-border" />
                        <span className="text-xs text-brand-text-light">{platformJobs} งาน</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Accounts List */}
      <Card variant="elevated" padding="none" className="border-none shadow-xl overflow-hidden">
        <div className="p-6 border-b border-brand-border/50 flex items-center justify-between bg-gradient-to-r from-brand-surface to-brand-bg/30">
          <h2 className="text-xl font-bold text-brand-text-dark flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-xl">
              <ClipboardList className="w-5 h-5 text-brand-primary" />
            </div>
            บัญชีทั้งหมด
            <Badge variant="default" className="ml-1">{accounts.length}</Badge>
          </h2>
          <div className="flex items-center gap-2 text-sm text-brand-text-light">
            <Shield className="w-4 h-4 text-brand-success" />
            <span>{verifiedCount} ยืนยันแล้ว</span>
          </div>
        </div>
        <div className="divide-y divide-brand-border/50">
          {accounts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-bg to-brand-surface rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-border shadow-sm">
                <Smartphone className="w-10 h-10 text-brand-text-light" />
              </div>
              <p className="text-xl font-bold text-brand-text-dark mb-2">ยังไม่มีบัญชี Social Media</p>
              <p className="text-brand-text-light mb-6 max-w-sm mx-auto">เพิ่มบัญชีเพื่อเริ่มรับงานและสร้างรายได้</p>
              <Button
                size="lg"
                className="shadow-lg shadow-brand-primary/20"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มบัญชีแรก
              </Button>
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-bg/30 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md bg-white ${
                      platformConfig[account.platform].color
                    } group-hover:scale-105 transition-transform`}
                  >
                    {platformConfig[account.platform].icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-bold text-brand-text-dark text-xl group-hover:text-brand-primary transition-colors">
                        {account.username}
                      </p>
                      {getStatusBadge(account.status)}
                    </div>
                    <p className="text-sm font-medium text-brand-text-light">
                      {platformConfig[account.platform].name}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs font-medium text-brand-text-light">
                      <span className="flex items-center gap-1.5 bg-brand-success/10 text-brand-success px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 
                        {account.jobsCompleted} งานสำเร็จ
                      </span>
                      {account.lastUsed && (
                        <span className="flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5" />
                          ใช้ล่าสุด{" "}
                          {new Date(account.lastUsed).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={account.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 hover:bg-brand-primary/10 border border-brand-border/50 rounded-xl transition-all shadow-sm text-brand-text-light hover:text-brand-primary bg-white"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="p-3 hover:bg-brand-error/10 border border-brand-border/50 hover:border-brand-error/20 rounded-xl transition-all shadow-sm text-brand-text-light hover:text-brand-error bg-white"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Tips */}
      <Card variant="elevated" className="bg-gradient-to-br from-brand-info/10 via-brand-info/5 to-transparent border-none shadow-lg relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-info/10 rounded-full blur-3xl" />
        <div className="relative flex items-start gap-5">
          <div className="p-3 bg-white rounded-2xl shadow-md shrink-0">
            <Lightbulb className="w-7 h-7 text-brand-warning" />
          </div>
          <div>
            <h3 className="font-bold text-brand-text-dark text-lg mb-3 flex items-center gap-2">
              เคล็ดลับการใช้งาน
              <Sparkles className="w-4 h-4 text-brand-warning" />
            </h3>
            <ul className="text-sm text-brand-text-dark/80 space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-info" /> 
                เพิ่มบัญชีที่มีความเคลื่อนไหวและเป็นของคุณเองเท่านั้น
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-info" /> 
                บัญชีที่ผ่านการยืนยันจะได้รับงานมากกว่า
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-info" /> 
                ระบบจะตรวจสอบบัญชีภายใน 24 ชั่วโมง
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-info" /> 
                บัญชีที่ไม่ได้ใช้งานนานเกิน 30 วันอาจถูกลบอัตโนมัติ
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Add Account Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="เพิ่มบัญชี Social Media"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-3">
              เลือกแพลตฟอร์ม
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(platformConfig) as Platform[]).map((platform) => (
                <button
                  key={platform}
                  onClick={() =>
                    setNewAccount({ ...newAccount, platform })
                  }
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    newAccount.platform === platform
                      ? "border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10"
                      : "border-brand-border hover:border-brand-primary/50 bg-white"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${platformConfig[platform].bgColor} ${platformConfig[platform].color}`}>
                    {platformConfig[platform].icon}
                  </div>
                  <span className="font-bold text-brand-text-dark">
                    {platformConfig[platform].name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="ลิงก์โปรไฟล์ของคุณ"
            placeholder={platformConfig[newAccount.platform].placeholder}
            value={newAccount.profileUrl}
            onChange={(e) =>
              setNewAccount({ ...newAccount, profileUrl: e.target.value })
            }
          />

          <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-xl">
            <p className="text-sm text-brand-text-dark font-medium flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-brand-info shrink-0 mt-0.5" />
              <span>หลังจากเพิ่มบัญชี ระบบจะตรวจสอบภายใน 24 ชั่วโมง เมื่อผ่านการยืนยันแล้วจึงจะรับงานได้</span>
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="bg-white shadow-sm">
              ยกเลิก
            </Button>
            <Button
              onClick={handleAddAccount}
              disabled={!newAccount.profileUrl}
              className="shadow-lg shadow-brand-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มบัญชี
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

