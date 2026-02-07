"use client";

import { useState } from "react";
import { Card, Button, Switch } from "@/components/ui";
import {
  Globe,
  Lock,
  Users,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  Save,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function TeamPrivacyPage() {
  const toast = useToast();

  const [isPublic, setIsPublic] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [showOnHub, setShowOnHub] = useState(false);

  // Assistant Permissions
  const [assistantPermissions, setAssistantPermissions] = useState({
    canApprovePayout: false,
    canDeleteJob: false,
    canRemoveMember: false,
  });

  const handleSave = () => {
    toast.success("บันทึกการตั้งค่าเรียบร้อย!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Privacy & Visibility */}
      <Card variant="elevated" className="border-none shadow-md">
        <div className="p-6 border-b border-brand-border/30 bg-brand-bg/30">
          <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
            {isPublic ? <Globe className="w-5 h-5 text-brand-success" /> : <Lock className="w-5 h-5 text-brand-warning" />}
            ความเป็นส่วนตัวและการแสดงผล
          </h3>
          <p className="text-sm text-brand-text-light mt-1">กำหนดว่าใครจะเห็นและเข้าร่วมทีมได้</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isPublic ? "bg-brand-success/10 text-brand-success" : "bg-brand-warning/10 text-brand-warning"}`}>
                {isPublic ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">ทีมสาธารณะ</span>
                <p className="text-sm text-brand-text-light">ทุกคนสามารถค้นหาและดูโปรไฟล์ทีมได้</p>
              </div>
            </div>
            <Switch checked={isPublic} onChange={setIsPublic} />
          </div>

          {/* Require Approval */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${requireApproval ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-border/50 text-brand-text-light"}`}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">ต้องอนุมัติก่อนเข้าร่วม</span>
                <p className="text-sm text-brand-text-light">หัวหน้าทีมต้องอนุมัติคำขอเข้าร่วม</p>
              </div>
            </div>
            <Switch checked={requireApproval} onChange={setRequireApproval} />
          </div>

          {/* Show on Hub */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${showOnHub ? "bg-brand-info/10 text-brand-info" : "bg-brand-border/50 text-brand-text-light"}`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">แสดงในตลาดกลาง</span>
                <p className="text-sm text-brand-text-light">Worker สามารถค้นหาและสมัครเข้าทีมได้จากตลาดกลาง</p>
              </div>
            </div>
            <Switch checked={showOnHub} onChange={setShowOnHub} />
          </div>
        </div>
      </Card>

      {/* Assistant Permissions */}
      <Card variant="elevated" className="border-none shadow-md">
        <div className="p-6 border-b border-brand-border/30 bg-brand-bg/30">
          <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-info" />
            สิทธิ์ผู้ช่วย (Assistant)
          </h3>
          <p className="text-sm text-brand-text-light mt-1">กำหนดว่าผู้ช่วยทำอะไรได้บ้างในทีม</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Can Approve Payout */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assistantPermissions.canApprovePayout ? "bg-brand-success/10 text-brand-success" : "bg-brand-bg text-brand-text-light"}`}>
                {assistantPermissions.canApprovePayout ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">อนุมัติการจ่ายเงิน</span>
                <p className="text-sm text-brand-text-light">สามารถอนุมัติงานและจ่ายเงินให้ Worker ได้</p>
              </div>
            </div>
            <Switch 
              checked={assistantPermissions.canApprovePayout} 
              onChange={(checked) => setAssistantPermissions(prev => ({ ...prev, canApprovePayout: checked }))} 
            />
          </div>

          {/* Can Delete Job */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assistantPermissions.canDeleteJob ? "bg-brand-success/10 text-brand-success" : "bg-brand-bg text-brand-text-light"}`}>
                {assistantPermissions.canDeleteJob ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">ลบงาน</span>
                <p className="text-sm text-brand-text-light">สามารถลบหรือยกเลิกงานที่สร้างไว้ได้</p>
              </div>
            </div>
            <Switch 
              checked={assistantPermissions.canDeleteJob} 
              onChange={(checked) => setAssistantPermissions(prev => ({ ...prev, canDeleteJob: checked }))} 
            />
          </div>

          {/* Can Remove Member */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assistantPermissions.canRemoveMember ? "bg-brand-success/10 text-brand-success" : "bg-brand-bg text-brand-text-light"}`}>
                {assistantPermissions.canRemoveMember ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">นำสมาชิกออก</span>
                <p className="text-sm text-brand-text-light">สามารถนำ Worker ออกจากทีมได้</p>
              </div>
            </div>
            <Switch 
              checked={assistantPermissions.canRemoveMember} 
              onChange={(checked) => setAssistantPermissions(prev => ({ ...prev, canRemoveMember: checked }))} 
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}
