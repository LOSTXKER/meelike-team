"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, Button, Input, Badge } from "@/components/ui";
import {
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Send,
  Users,
  Briefcase,
  Clock,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Settings,
  Link2,
  Key,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";

// LINE Icon component
const LineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

// Connection status types
type ConnectionStatus = "disconnected" | "connected" | "error";

interface MessagingConfig {
  channelId: string;
  channelSecret: string;
  channelAccessToken: string;
}

export default function LineIntegrationPage() {
  const params = useParams();
  const teamId = params.id as string;

  const toast = useToast();
  const confirm = useConfirm();

  // LINE Messaging API state
  const [messagingStatus, setMessagingStatus] = useState<ConnectionStatus>("disconnected");
  const [messagingConfig, setMessagingConfig] = useState<MessagingConfig>({
    channelId: "",
    channelSecret: "",
    channelAccessToken: "",
  });
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleConnect = () => {
    if (messagingConfig.channelId && messagingConfig.channelSecret && messagingConfig.channelAccessToken) {
      setMessagingStatus("connected");
      toast.success("เชื่อมต่อ LINE Messaging API สำเร็จ!");
    } else {
      toast.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  const handleTestMessage = async () => {
    setIsTesting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(false);
    toast.success("ส่งข้อความทดสอบสำเร็จ!");
  };

  const handleDisconnect = async () => {
    if (await confirm({ title: "ยืนยัน", message: "ยืนยันการยกเลิกการเชื่อมต่อ?", variant: "danger", confirmLabel: "ยกเลิกการเชื่อมต่อ" })) {
      setMessagingStatus("disconnected");
      setMessagingConfig({
        channelId: "",
        channelSecret: "",
        channelAccessToken: "",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* LINE Messaging API Section */}
      <Card variant="elevated" className="border-none shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#00B900]/10 to-[#00B900]/5 border-b border-[#00B900]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00B900] flex items-center justify-center shadow-lg shadow-[#00B900]/20">
                <LineIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-text-dark">LINE Messaging API</h2>
                <p className="text-sm text-brand-text-light">ส่ง Rich Message, Flex Message ผ่าน LINE OA</p>
              </div>
            </div>
            <Badge 
              variant={messagingStatus === "connected" ? "success" : "default"}
              className="px-3"
            >
              {messagingStatus === "connected" ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  เชื่อมต่อแล้ว
                </>
              ) : (
                "ยังไม่เชื่อมต่อ"
              )}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/30">
              <div className="w-10 h-10 rounded-lg bg-[#00B900]/10 flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5 text-[#00B900]" />
              </div>
              <h4 className="font-bold text-brand-text-dark mb-1">Rich Messages</h4>
              <p className="text-xs text-brand-text-light">
                ส่งข้อความพร้อมรูปภาพ ปุ่ม และ Carousel
              </p>
            </div>
            <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/30">
              <div className="w-10 h-10 rounded-lg bg-brand-success/10 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-brand-success" />
              </div>
              <h4 className="font-bold text-brand-text-dark mb-1">Flex Messages</h4>
              <p className="text-xs text-brand-text-light">
                ข้อความ Layout สวยงาม แสดงข้อมูลงานได้ครบ
              </p>
            </div>
            <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/30">
              <div className="w-10 h-10 rounded-lg bg-brand-info/10 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-brand-info" />
              </div>
              <h4 className="font-bold text-brand-text-dark mb-1">Interactive</h4>
              <p className="text-xs text-brand-text-light">
                Worker กดปุ่มจองงานได้โดยตรงจาก LINE
              </p>
            </div>
          </div>

          {/* Connection Form or Status */}
          {messagingStatus === "connected" ? (
            <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-success" />
                  <div>
                    <p className="font-bold text-brand-text-dark">เชื่อมต่อสำเร็จ</p>
                    <p className="text-sm text-brand-text-light">
                      Channel ID: {messagingConfig.channelId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestMessage}
                  disabled={isTesting}
                  isLoading={isTesting}
                  className="bg-white"
                >
                  <Send className="w-4 h-4 mr-1" />
                  ส่งข้อความทดสอบ
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  ยกเลิกการเชื่อมต่อ
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* How to setup */}
              <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-xl">
                <h4 className="font-bold text-brand-text-dark mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-brand-info" />
                  วิธีตั้งค่า LINE Messaging API
                </h4>
                <ol className="space-y-2 text-sm text-brand-text-dark">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-info/20 text-brand-info text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>ไปที่ <a href="https://developers.line.biz/console/" target="_blank" rel="noopener noreferrer" className="text-brand-info font-medium hover:underline">LINE Developers Console</a></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-info/20 text-brand-info text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>สร้าง Provider และ Messaging API Channel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-info/20 text-brand-info text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>คัดลอก Channel ID, Channel Secret และ Channel Access Token</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-info/20 text-brand-info text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <span>นำมาใส่ในฟอร์มด้านล่าง</span>
                  </li>
                </ol>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://developers.line.biz/console/", "_blank")}
                  className="mt-4 bg-white"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  ไปที่ LINE Developers
                </Button>
              </div>

              {/* Config Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-brand-text-dark mb-2 block flex items-center gap-2">
                    <Key className="w-4 h-4 text-brand-primary" />
                    Channel ID
                  </label>
                  <Input
                    placeholder="เช่น 1234567890"
                    value={messagingConfig.channelId}
                    onChange={(e) => setMessagingConfig({ ...messagingConfig, channelId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-brand-text-dark mb-2 block flex items-center gap-2">
                    <Key className="w-4 h-4 text-brand-primary" />
                    Channel Secret
                  </label>
                  <div className="relative">
                    <Input
                      type={showSecret ? "text" : "password"}
                      placeholder="Channel Secret จาก LINE Developers"
                      value={messagingConfig.channelSecret}
                      onChange={(e) => setMessagingConfig({ ...messagingConfig, channelSecret: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-light hover:text-brand-text-dark"
                    >
                      {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-brand-text-dark mb-2 block flex items-center gap-2">
                    <Key className="w-4 h-4 text-brand-primary" />
                    Channel Access Token
                  </label>
                  <div className="relative">
                    <Input
                      type={showToken ? "text" : "password"}
                      placeholder="Channel Access Token (Long-lived)"
                      value={messagingConfig.channelAccessToken}
                      onChange={(e) => setMessagingConfig({ ...messagingConfig, channelAccessToken: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-light hover:text-brand-text-dark"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleConnect}
                  disabled={!messagingConfig.channelId || !messagingConfig.channelSecret || !messagingConfig.channelAccessToken}
                  className="w-full bg-[#00B900] hover:bg-[#00B900]/90"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  เชื่อมต่อ LINE Messaging API
                </Button>
              </div>
            </>
          )}

          {/* Message Preview */}
          <div className="p-4 bg-brand-bg/30 rounded-xl border border-brand-border/30">
            <h4 className="font-bold text-brand-text-dark mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-primary" />
              ตัวอย่าง Flex Message
            </h4>
            <div className="max-w-xs mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-brand-border/30">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#00B900] to-[#00D100] p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-medium opacity-90">งานใหม่!</span>
                  </div>
                  <h5 className="font-bold text-lg">TikTok Like x 1,000</h5>
                </div>
                {/* Body */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-brand-text-light">ค่าจ้าง</span>
                    <span className="font-bold text-brand-success">฿0.20/หน่วย</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-brand-text-light">จำนวน</span>
                    <span className="font-bold text-brand-text-dark">1,000 หน่วย</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-brand-text-light">กำหนดส่ง</span>
                    <span className="font-bold text-brand-warning">22:00 น.</span>
                  </div>
                </div>
                {/* Footer */}
                <div className="p-3 border-t border-brand-border/30">
                  <div className="bg-[#00B900] text-white text-center py-2.5 rounded-lg font-bold text-sm">
                    👉 จองงานเลย
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Notice */}
      <Card className="p-4 border-none shadow-md bg-brand-bg/50">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <Shield className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <p className="font-bold text-brand-text-dark text-sm mb-1">
              ความปลอดภัยของข้อมูล
            </p>
            <p className="text-xs text-brand-text-light">
              API Keys ของคุณจะถูกเข้ารหัสและจัดเก็บอย่างปลอดภัย 
              เราไม่มีการแชร์ข้อมูลนี้กับบุคคลที่สาม
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
