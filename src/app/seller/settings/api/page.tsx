"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Input, Modal } from "@/components/ui";
import { PageHeader } from "@/components/shared";
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
  Server,
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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
          <PageHeader
            title="API Keys"
            description="จัดการ API Keys สำหรับเชื่อมต่อระบบจากภายนอก"
            icon={Key}
          />
        <Button 
          onClick={() => setShowCreateModal(true)} 
          className="shadow-lg shadow-brand-primary/20 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          สร้าง API Key
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: API List */}
        <div className="lg:col-span-2 space-y-6">
           {/* Warning Banner */}
           <div className="bg-[#FEF7E0] border border-[#FEEFC3] rounded-xl p-4 flex gap-3 shadow-sm">
              <div className="p-2 bg-[#FFFBF0] rounded-lg h-fit">
                 <AlertTriangle className="w-5 h-5 text-[#B06000]" />
              </div>
              <div>
                 <h4 className="font-bold text-[#B06000] text-sm">รักษาความปลอดภัยของ API Key</h4>
                 <p className="text-xs text-[#B06000]/80 mt-1 leading-relaxed">
                    API Key เปรียบเสมือนรหัสผ่านของคุณ อย่าแชร์ให้ผู้อื่น หรือฝังไว้ในโค้ดฝั่ง Client (Frontend) 
                    หากสงสัยว่ามีคนรู้ Key ของคุณ ให้ทำการ Revoke และสร้างใหม่ทันที
                 </p>
              </div>
           </div>

           {/* Keys List */}
           <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <Card 
                  key={apiKey.id} 
                  variant="elevated" 
                  className={`border-none shadow-md transition-all ${apiKey.status === 'revoked' ? 'opacity-60 bg-gray-50' : 'hover:-translate-y-1 hover:shadow-lg'}`}
                >
                  <div className="p-6">
                     <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${apiKey.status === 'active' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-gray-200 text-gray-500'}`}>
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
                        <Badge
                          variant={apiKey.status === "active" ? "success" : "default"}
                          className={`px-2.5 py-0.5 capitalize ${apiKey.status === 'revoked' ? 'bg-gray-200 text-gray-500' : ''}`}
                        >
                          {apiKey.status}
                        </Badge>
                     </div>

                     {/* Key Display */}
                     <div className="bg-brand-bg/50 rounded-xl p-3 flex items-center justify-between border border-brand-border/30 mb-4 group/key">
                        <code className="font-mono text-sm text-brand-text-dark truncate mr-4">
                           {showKey === apiKey.id
                             ? apiKey.key
                             : apiKey.key.substring(0, 12) + "••••••••••••••••••••"}
                        </code>
                        <div className="flex items-center gap-1 opacity-50 group-hover/key:opacity-100 transition-opacity">
                           <button
                             onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                             className="p-1.5 hover:bg-white rounded-lg transition-colors text-brand-text-light hover:text-brand-primary shadow-sm border border-transparent hover:border-brand-border/30"
                             title={showKey === apiKey.id ? "ซ่อน" : "แสดง"}
                           >
                             {showKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                           </button>
                           <button
                             onClick={() => handleCopy(apiKey.key)}
                             className="p-1.5 hover:bg-white rounded-lg transition-colors text-brand-text-light hover:text-brand-primary shadow-sm border border-transparent hover:border-brand-border/30"
                             title="คัดลอก"
                           >
                             {copied ? <CheckCircle2 className="w-4 h-4 text-brand-success" /> : <Copy className="w-4 h-4" />}
                           </button>
                        </div>
                     </div>

                     {/* Footer */}
                     <div className="flex items-center justify-between pt-4 border-t border-brand-border/30">
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
                            className="text-brand-error text-xs font-medium hover:underline flex items-center gap-1 hover:bg-brand-error/5 px-2 py-1 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> ยกเลิก Key
                          </button>
                        )}
                     </div>
                  </div>
                </Card>
              ))}
           </div>
        </div>

        {/* Right Column: Documentation */}
        <div className="lg:col-span-1 space-y-6">
           <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 bg-brand-bg/30">
              <h3 className="font-bold text-lg text-brand-text-dark mb-4 flex items-center gap-2">
                 <Code className="w-5 h-5 text-brand-primary" />
                 Quick Start
              </h3>
              
              <div className="bg-[#1E1E1E] rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700 shadow-inner mb-4">
                 <div className="flex gap-1.5 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                 </div>
                 <pre className="whitespace-pre-wrap break-all">
<span className="text-purple-400">curl</span> -X POST \<br/>
  https://api.meelike.com/v1/orders \<br/>
  -H <span className="text-green-400">"Authorization: Bearer KEY"</span> \<br/>
  -d <span className="text-orange-300">'{`{"service_id": "123", ...}'`}</span>
                 </pre>
              </div>

              <div className="space-y-2">
                 <Link href="#" className="block group">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-md transition-all">
                       <div className="p-2 bg-brand-primary/5 rounded-lg text-brand-primary group-hover:scale-110 transition-transform">
                          <Code className="w-4 h-4" />
                       </div>
                       <div className="flex-1">
                          <p className="font-bold text-sm text-brand-text-dark">API Documentation</p>
                          <p className="text-xs text-brand-text-light">คู่มือการใช้งานฉบับเต็ม</p>
                       </div>
                       <ExternalLink className="w-4 h-4 text-brand-text-light group-hover:text-brand-primary" />
                    </div>
                 </Link>
                 
                 <Link href="#" className="block group">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-md transition-all">
                       <div className="p-2 bg-brand-info/5 rounded-lg text-brand-info group-hover:scale-110 transition-transform">
                          <RefreshCw className="w-4 h-4" />
                       </div>
                       <div className="flex-1">
                          <p className="font-bold text-sm text-brand-text-dark">Webhooks</p>
                          <p className="text-xs text-brand-text-light">ตั้งค่าการแจ้งเตือน</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-brand-text-light group-hover:text-brand-primary" />
                    </div>
                 </Link>
              </div>
           </Card>

           <div className="bg-brand-success/5 border border-brand-success/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="w-5 h-5 text-brand-success" />
                 <h4 className="font-bold text-brand-success text-sm">System Status</h4>
              </div>
              <div className="flex items-center justify-between text-xs">
                 <span className="text-brand-text-light">API Service</span>
                 <span className="flex items-center gap-1.5 text-brand-success font-medium">
                    <span className="w-2 h-2 bg-brand-success rounded-full animate-pulse"></span>
                    Operational
                 </span>
              </div>
           </div>
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
          <div className="space-y-2">
             <label className="text-sm font-bold text-brand-text-dark">ชื่อ API Key</label>
             <Input
               placeholder="เช่น Production, Testing App"
               value={newKeyName}
               onChange={(e) => setNewKeyName(e.target.value)}
               className="bg-brand-bg/30"
             />
          </div>

          <div>
            <label className="text-sm font-bold text-brand-text-dark block mb-3">
              กำหนดสิทธิ์การใช้งาน (Permissions)
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
              {[
                { key: "orders:read", label: "ดูข้อมูลออเดอร์ (Read Orders)", checked: true },
                { key: "orders:write", label: "สร้าง/แก้ไขออเดอร์ (Write Orders)", checked: true },
                { key: "services:read", label: "ดูรายการบริการ (Read Services)", checked: true },
                { key: "services:write", label: "จัดการบริการ (Manage Services)", checked: false },
                { key: "team:read", label: "ดูข้อมูลทีมงาน (Read Team)", checked: false },
              ].map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-start gap-3 p-3 bg-brand-bg/30 rounded-xl border border-transparent hover:border-brand-primary/30 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    defaultChecked={perm.checked}
                    className="w-4 h-4 mt-0.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <p className="font-bold text-brand-text-dark text-sm">
                      {perm.label}
                    </p>
                    <code className="text-[10px] text-brand-text-light bg-white px-1.5 py-0.5 rounded border border-brand-border/30 mt-1 inline-block">{perm.key}</code>
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
              className="px-6"
            >
              ยกเลิก
            </Button>
            <Button 
               onClick={handleCreateKey} 
               disabled={!newKeyName.trim()}
               className="px-6 shadow-lg shadow-brand-primary/20"
            >
              <Key className="w-4 h-4 mr-2" />
              สร้าง Key
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

