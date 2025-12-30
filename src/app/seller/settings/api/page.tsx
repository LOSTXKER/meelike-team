"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Input, Modal } from "@/components/ui";
import {
  ArrowLeft,
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
  {
    id: "key-3",
    name: "Old Key (Revoked)",
    key: "mk_live_zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
    createdAt: "2024-10-01",
    permissions: ["orders:read"],
    status: "revoked",
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
    if (confirm("คุณต้องการยกเลิก API Key นี้หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้")) {
      setApiKeys(
        apiKeys.map((key) =>
          key.id === id ? { ...key, status: "revoked" as const } : key
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller/settings">
            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
              <Key className="w-7 h-7 text-brand-primary" />
              API Keys
            </h1>
            <p className="text-brand-text-light">
              จัดการ API Keys สำหรับเชื่อมต่อระบบ
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          สร้าง API Key
        </Button>
      </div>

      {/* Warning */}
      <Card className="bg-brand-warning/10 border-brand-warning/30" padding="md">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-brand-warning shrink-0" />
          <div>
            <p className="font-medium text-brand-text-dark">
              ⚠️ เก็บ API Key ไว้อย่างปลอดภัย
            </p>
            <p className="text-sm text-brand-text-light mt-1">
              อย่าเปิดเผย API Key ในที่สาธารณะ หากคิดว่ามีการรั่วไหล
              ให้ยกเลิกและสร้างใหม่ทันที
            </p>
          </div>
        </div>
      </Card>

      {/* API Keys List */}
      <Card variant="bordered">
        <div className="p-4 border-b border-brand-border">
          <h2 className="font-semibold text-brand-text-dark flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-primary" />
            API Keys ทั้งหมด ({apiKeys.length})
          </h2>
        </div>

        <div className="divide-y divide-brand-border">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="p-4 hover:bg-brand-bg/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-brand-text-dark">
                      {apiKey.name}
                    </p>
                    <Badge
                      variant={apiKey.status === "active" ? "success" : "error"}
                      size="sm"
                    >
                      {apiKey.status === "active" ? "Active" : "Revoked"}
                    </Badge>
                  </div>

                  {/* Key Display */}
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1.5 bg-brand-bg rounded font-mono text-sm text-brand-text-dark">
                      {showKey === apiKey.id
                        ? apiKey.key
                        : apiKey.key.substring(0, 12) + "••••••••••••••••••••"}
                    </code>
                    <button
                      onClick={() =>
                        setShowKey(showKey === apiKey.id ? null : apiKey.id)
                      }
                      className="p-1.5 hover:bg-brand-bg rounded transition-colors"
                    >
                      {showKey === apiKey.id ? (
                        <EyeOff className="w-4 h-4 text-brand-text-light" />
                      ) : (
                        <Eye className="w-4 h-4 text-brand-text-light" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopy(apiKey.key)}
                      className="p-1.5 hover:bg-brand-bg rounded transition-colors"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-brand-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-brand-text-light" />
                      )}
                    </button>
                  </div>

                  {/* Permissions */}
                  <div className="flex flex-wrap gap-1">
                    {apiKey.permissions.map((perm) => (
                      <Badge key={perm} variant="default" size="sm" className="bg-brand-bg">
                        {perm}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-brand-text-light">
                    <span>
                      สร้างเมื่อ{" "}
                      {new Date(apiKey.createdAt).toLocaleDateString("th-TH")}
                    </span>
                    {apiKey.lastUsed && (
                      <span>
                        ใช้ล่าสุด{" "}
                        {new Date(apiKey.lastUsed).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {apiKey.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-brand-error hover:bg-brand-error/10"
                    onClick={() => handleRevokeKey(apiKey.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    ยกเลิก
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Documentation */}
      <Card variant="bordered" padding="lg">
        <h3 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-brand-primary" />
          เริ่มต้นใช้งาน API
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
            <pre>{`curl -X POST https://api.meelike.com/v1/orders \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service_id": "svc_xxx",
    "quantity": 1000,
    "target_url": "https://facebook.com/..."
  }'`}</pre>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-center gap-3 p-4 bg-brand-bg rounded-lg hover:bg-brand-bg/80 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">API Documentation</p>
                <p className="text-sm text-brand-text-light">
                  ดูคู่มือการใช้งาน API แบบละเอียด
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-brand-text-light ml-auto" />
            </a>

            <a
              href="#"
              className="flex items-center gap-3 p-4 bg-brand-bg rounded-lg hover:bg-brand-bg/80 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-info/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-brand-info" />
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">Webhooks</p>
                <p className="text-sm text-brand-text-light">
                  ตั้งค่ารับแจ้งเตือนอัตโนมัติ
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-brand-text-light ml-auto" />
            </a>
          </div>
        </div>
      </Card>

      {/* Create API Key Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewKeyName("");
        }}
        title="สร้าง API Key ใหม่"
      >
        <div className="space-y-4">
          <Input
            label="ชื่อ API Key"
            placeholder="เช่น Production API, Development"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              สิทธิ์การเข้าถึง
            </label>
            <div className="space-y-2">
              {[
                { key: "orders:read", label: "อ่านข้อมูลออเดอร์", checked: true },
                { key: "orders:write", label: "สร้าง/แก้ไขออเดอร์", checked: true },
                { key: "services:read", label: "อ่านข้อมูลบริการ", checked: true },
                { key: "services:write", label: "แก้ไขบริการ", checked: false },
                { key: "team:read", label: "อ่านข้อมูลทีม", checked: false },
              ].map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-center gap-3 p-3 bg-brand-bg rounded-lg cursor-pointer hover:bg-brand-bg/80"
                >
                  <input
                    type="checkbox"
                    defaultChecked={perm.checked}
                    className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <p className="font-medium text-brand-text-dark text-sm">
                      {perm.label}
                    </p>
                    <p className="text-xs text-brand-text-light">{perm.key}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewKeyName("");
              }}
            >
              ยกเลิก
            </Button>
            <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
              <Key className="w-4 h-4 mr-2" />
              สร้าง API Key
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

