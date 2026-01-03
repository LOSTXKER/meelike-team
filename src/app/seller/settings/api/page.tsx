"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Input, Modal } from "@/components/ui";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Code,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
  status: "active" | "revoked";
}

const mockApiKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production API",
    key: "mk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "2024-12-01",
    lastUsed: "2024-12-30T14:30:00",
    permissions: ["orders:read", "orders:write", "services:read"],
    status: "active",
  },
  {
    id: "key-2",
    name: "Development API",
    key: "mk_test_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
    createdAt: "2024-11-15",
    lastUsed: "2024-12-28T10:00:00",
    permissions: ["orders:read", "services:read"],
    status: "active",
  },
];

export default function ApiKeyPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `mk_live_${Math.random().toString(36).substring(2, 34)}`,
      createdAt: new Date().toISOString(),
      permissions: ["orders:read", "orders:write", "services:read"],
      status: "active",
    };
    setApiKeys([newKey, ...apiKeys]);
    setShowCreateModal(false);
    setNewKeyName("");
  };

  const handleRevokeKey = (id: string) => {
    if (confirm("คุณต้องการยกเลิก API Key นี้หรือไม่?")) {
      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...key, status: "revoked" as const } : key
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-text-dark">API Keys</h2>
          <p className="text-sm text-brand-text-light">จัดการ API Keys สำหรับเชื่อมต่อระบบ</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
          สร้าง API Key
        </Button>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <div className="p-2 bg-amber-100 rounded-lg h-fit">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="font-bold text-amber-800 text-sm">รักษาความปลอดภัยของ API Key</h4>
          <p className="text-xs text-amber-700 mt-1">
            API Key เปรียบเสมือนรหัสผ่าน อย่าแชร์ให้ผู้อื่น หากสงสัยว่ามีคนรู้ Key ให้ Revoke และสร้างใหม่ทันที
          </p>
        </div>
      </div>

      {/* Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card 
            key={apiKey.id} 
            className={`border-none shadow-md p-5 ${apiKey.status === 'revoked' ? 'opacity-60 bg-gray-50' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${apiKey.status === 'active' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-gray-200 text-gray-500'}`}>
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-dark">{apiKey.name}</h3>
                  <p className="text-xs text-brand-text-light">
                    สร้างเมื่อ {new Date(apiKey.createdAt).toLocaleDateString("th-TH")} 
                    {apiKey.lastUsed && ` • ใช้งานล่าสุด ${new Date(apiKey.lastUsed).toLocaleDateString("th-TH")}`}
                  </p>
                </div>
              </div>
              <Badge variant={apiKey.status === "active" ? "success" : "default"} size="sm">
                {apiKey.status}
              </Badge>
            </div>

            {/* Key Display */}
            <div className="bg-brand-bg/50 rounded-xl p-3 flex items-center justify-between border border-brand-border/30 mb-4">
              <code className="font-mono text-sm text-brand-text-dark truncate mr-4">
                {showKey === apiKey.id
                  ? apiKey.key
                  : apiKey.key.substring(0, 12) + "••••••••••••••••••••"}
              </code>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-brand-text-light hover:text-brand-primary"
                >
                  {showKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleCopy(apiKey.key)}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-brand-text-light hover:text-brand-primary"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-brand-border/30">
              <div className="flex flex-wrap gap-2">
                {apiKey.permissions.map((perm) => (
                  <span key={perm} className="text-[10px] bg-white border border-brand-border/50 px-2 py-1 rounded-md text-brand-text-light">
                    {perm}
                  </span>
                ))}
              </div>
              {apiKey.status === "active" && (
                <button
                  onClick={() => handleRevokeKey(apiKey.id)}
                  className="text-red-600 text-xs font-medium hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> ยกเลิก Key
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card className="border-none shadow-md p-5">
        <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-brand-primary" />
          Quick Start
        </h3>
        
        <div className="bg-gray-900 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto mb-4">
          <div className="flex gap-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full ui-terminal-red"></div>
            <div className="w-2.5 h-2.5 rounded-full ui-terminal-yellow"></div>
            <div className="w-2.5 h-2.5 rounded-full ui-terminal-green"></div>
          </div>
          <pre className="whitespace-pre-wrap break-all">
<span className="syntax-purple">curl</span> -X POST \{"\n"}
  https://api.meelike.com/v1/orders \{"\n"}
  -H <span className="syntax-green">"Authorization: Bearer YOUR_KEY"</span> \{"\n"}
  -d <span className="syntax-orange">{'\'{"service_id": "123"}\''}</span>
          </pre>
        </div>

        <div className="space-y-2">
          <Link href="#" className="block group">
            <div className="flex items-center gap-3 p-3 bg-brand-bg/50 rounded-xl hover:bg-brand-bg transition-all">
              <Code className="w-4 h-4 text-brand-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm text-brand-text-dark">API Documentation</p>
                <p className="text-xs text-brand-text-light">คู่มือการใช้งานฉบับเต็ม</p>
              </div>
              <ExternalLink className="w-4 h-4 text-brand-text-light" />
            </div>
          </Link>
          
          <Link href="#" className="block group">
            <div className="flex items-center gap-3 p-3 bg-brand-bg/50 rounded-xl hover:bg-brand-bg transition-all">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-sm text-brand-text-dark">Webhooks</p>
                <p className="text-xs text-brand-text-light">ตั้งค่าการแจ้งเตือน</p>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-text-light" />
            </div>
          </Link>
        </div>
      </Card>

      {/* System Status */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-medium text-emerald-800 text-sm">System Status</span>
          </div>
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Operational
          </span>
        </div>
      </div>

      {/* Create API Key Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewKeyName("");
        }}
        title="สร้าง API Key ใหม่"
      >
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-brand-text-dark block mb-2">ชื่อ API Key</label>
            <Input
              placeholder="เช่น Production, Testing App"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-brand-text-dark block mb-3">
              กำหนดสิทธิ์การใช้งาน
            </label>
            <div className="space-y-2">
              {[
                { key: "orders:read", label: "ดูข้อมูลออเดอร์", checked: true },
                { key: "orders:write", label: "สร้าง/แก้ไขออเดอร์", checked: true },
                { key: "services:read", label: "ดูรายการบริการ", checked: true },
              ].map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-center gap-3 p-3 bg-brand-bg/30 rounded-xl hover:bg-brand-bg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked={perm.checked}
                    className="w-4 h-4 rounded border-brand-border text-brand-primary"
                  />
                  <div>
                    <p className="font-medium text-brand-text-dark text-sm">{perm.label}</p>
                    <code className="text-[10px] text-brand-text-light">{perm.key}</code>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-brand-border/30">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewKeyName("");
              }}
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleCreateKey} 
              disabled={!newKeyName.trim()}
              leftIcon={<Key className="w-4 h-4" />}
            >
              สร้าง Key
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
