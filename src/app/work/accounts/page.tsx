"use client";

import { useState } from "react";
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
  { name: string; icon: JSX.Element; color: string; placeholder: string }
> = {
  facebook: {
    name: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
    color: "bg-blue-500",
    placeholder: "https://facebook.com/yourprofile",
  },
  instagram: {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    color: "bg-pink-500",
    placeholder: "https://instagram.com/yourusername",
  },
  tiktok: {
    name: "TikTok",
    icon: <Music2 className="w-5 h-5" />,
    color: "bg-gray-800",
    placeholder: "https://tiktok.com/@yourusername",
  },
  youtube: {
    name: "YouTube",
    icon: <Youtube className="w-5 h-5" />,
    color: "bg-red-500",
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
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            ยืนยันแล้ว
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" size="sm">
            <RefreshCw className="w-3 h-3 mr-1" />
            รอตรวจสอบ
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="error" size="sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            ไม่ผ่าน
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="บัญชี Social Media"
        description="จัดการบัญชีที่ใช้รับงาน"
        icon={Smartphone}
        action={
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            เพิ่มบัญชี
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(platformConfig) as Platform[]).map((platform) => {
          const count = accounts.filter((a) => a.platform === platform).length;
          const verifiedCount = accounts.filter(
            (a) => a.platform === platform && a.status === "verified"
          ).length;
          return (
            <Card key={platform} variant="bordered" padding="md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{platformConfig[platform].emoji}</span>
                <div>
                  <p className="font-medium text-brand-text-dark">
                    {platformConfig[platform].name}
                  </p>
                  <p className="text-sm text-brand-text-light">
                    {verifiedCount}/{count} บัญชี
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Accounts List */}
      <Card variant="bordered">
        <div className="p-4 border-b border-brand-border">
          <h2 className="font-semibold text-brand-text-dark flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-primary" />
            บัญชีทั้งหมด ({accounts.length})
          </h2>
        </div>
        <div className="divide-y divide-brand-border">
          {accounts.length === 0 ? (
            <div className="p-8 text-center">
              <Settings className="w-12 h-12 text-brand-text-light mx-auto mb-3" />
              <p className="text-brand-text-light">ยังไม่มีบัญชี Social Media</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => setShowAddModal(true)}
              >
                เพิ่มบัญชีแรก
              </Button>
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="p-4 flex items-center justify-between hover:bg-brand-bg/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      platformConfig[account.platform].color
                    } bg-opacity-10`}
                  >
                    {platformConfig[account.platform].emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-brand-text-dark">
                        {account.username}
                      </p>
                      {getStatusBadge(account.status)}
                    </div>
                    <p className="text-sm text-brand-text-light">
                      {platformConfig[account.platform].name}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-brand-text-light">
                      <span>{account.jobsCompleted} งานสำเร็จ</span>
                      {account.lastUsed && (
                        <span>
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
                <div className="flex items-center gap-2">
                  <a
                    href={account.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-text-light hover:text-brand-primary"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="p-2 hover:bg-brand-error/10 rounded-lg transition-colors text-brand-text-light hover:text-brand-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Tips */}
      <Card variant="bordered" padding="lg" className="bg-brand-info/5">
        <h3 className="font-semibold text-brand-text-dark mb-2">
          เคล็ดลับ
        </h3>
        <ul className="text-sm text-brand-text-light space-y-1">
          <li>• เพิ่มบัญชีที่มีความเคลื่อนไหวและเป็นของคุณเองเท่านั้น</li>
          <li>• บัญชีที่ผ่านการยืนยันจะได้รับงานมากกว่า</li>
          <li>• ระบบจะตรวจสอบบัญชีภายใน 24 ชั่วโมง</li>
          <li>• บัญชีที่ไม่ได้ใช้งานนานเกิน 30 วันอาจถูกลบอัตโนมัติ</li>
        </ul>
      </Card>

      {/* Add Account Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="เพิ่มบัญชี Social Media"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              แพลตฟอร์ม
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(platformConfig) as Platform[]).map((platform) => (
                <button
                  key={platform}
                  onClick={() =>
                    setNewAccount({ ...newAccount, platform })
                  }
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    newAccount.platform === platform
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-brand-border hover:border-brand-primary/50"
                  }`}
                >
                  <span className="text-xl">
                    {platformConfig[platform].emoji}
                  </span>
                  <span className="font-medium text-brand-text-dark">
                    {platformConfig[platform].name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="ลิงก์โปรไฟล์"
            placeholder={platformConfig[newAccount.platform].placeholder}
            value={newAccount.profileUrl}
            onChange={(e) =>
              setNewAccount({ ...newAccount, profileUrl: e.target.value })
            }
          />

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleAddAccount}
              disabled={!newAccount.profileUrl}
            >
              เพิ่มบัญชี
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

