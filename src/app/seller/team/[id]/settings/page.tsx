"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Button, Input, Textarea, Select, Modal, Skeleton } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { useSellerTeams } from "@/lib/api/hooks";
import {
  ArrowLeft,
  Settings,
  Save,
  Globe,
  Lock,
  Users,
  Shield,
  Bell,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  Check,
  X,
  Info,
} from "lucide-react";

export default function TeamSettingsPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const { data: teams, isLoading } = useSellerTeams();
  
  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  const [teamName, setTeamName] = useState(currentTeam?.name || "");
  const [teamDescription, setTeamDescription] = useState(currentTeam?.description || "");
  const [isPublic, setIsPublic] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [showOnHub, setShowOnHub] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // Assistant Permissions
  const [assistantPermissions, setAssistantPermissions] = useState({
    canApprovePayout: false,
    canDeleteJob: false,
    canRemoveMember: false,
  });

  const handleSave = () => {
    alert("บันทึกการตั้งค่าเรียบร้อย!");
  };

  const handleDeleteTeam = () => {
    if (deleteConfirm === currentTeam?.name) {
      alert("ลบทีมเรียบร้อย!");
      setShowDeleteModal(false);
      // Redirect to team list
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/seller/team/${teamId}`}>
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <PageHeader
            title="ตั้งค่าทีม"
            description={`จัดการการตั้งค่าของทีม ${currentTeam?.name || ""}`}
            icon={Settings}
          />
        </div>
        
        <Button
          onClick={handleSave}
          leftIcon={<Save className="w-4 h-4" />}
          className="shadow-lg shadow-brand-primary/20"
        >
          บันทึกการตั้งค่า
        </Button>
      </div>

      {/* Basic Info */}
      <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5">
        <div className="p-6 border-b border-brand-border/30 bg-brand-bg/30">
          <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
            <Info className="w-5 h-5 text-brand-primary" />
            ข้อมูลทีม
          </h3>
          <p className="text-sm text-brand-text-light mt-1">ตั้งค่าข้อมูลพื้นฐานของทีม</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark">ชื่อทีม *</label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="ใส่ชื่อทีม"
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark">คำอธิบายทีม</label>
            <Textarea
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="อธิบายทีมของคุณ..."
              rows={4}
              className="bg-white"
            />
          </div>

          {/* Avatar Upload Placeholder */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark">รูปโปรไฟล์ทีม</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {(teamName || currentTeam?.name || "T").charAt(0)}
              </div>
              <div>
                <Button variant="outline" size="sm">
                  เปลี่ยนรูป
                </Button>
                <p className="text-xs text-brand-text-light mt-2">แนะนำ: รูปสี่เหลี่ยมจตุรัส ขนาดไม่เกิน 2MB</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy & Visibility */}
      <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5">
        <div className="p-6 border-b border-brand-border/30 bg-brand-bg/30">
          <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
            {isPublic ? <Globe className="w-5 h-5 text-brand-success" /> : <Lock className="w-5 h-5 text-brand-warning" />}
            ความเป็นส่วนตัวและการแสดงผล
          </h3>
          <p className="text-sm text-brand-text-light mt-1">กำหนดว่าใครจะเห็นและเข้าร่วมทีมได้</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Public/Private Toggle */}
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isPublic ? "bg-brand-success/10 text-brand-success" : "bg-brand-warning/10 text-brand-warning"}`}>
                {isPublic ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">ทีมสาธารณะ</span>
                <p className="text-sm text-brand-text-light">ทุกคนสามารถค้นหาและดูโปรไฟล์ทีมได้</p>
              </div>
            </div>
            <div 
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isPublic ? "bg-brand-success" : "bg-brand-border"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isPublic ? "translate-x-7" : "translate-x-1"}`}></div>
            </div>
          </label>

          {/* Require Approval */}
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${requireApproval ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-border/50 text-brand-text-light"}`}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">ต้องอนุมัติก่อนเข้าร่วม</span>
                <p className="text-sm text-brand-text-light">หัวหน้าทีมต้องอนุมัติคำขอเข้าร่วม</p>
              </div>
            </div>
            <div 
              onClick={() => setRequireApproval(!requireApproval)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${requireApproval ? "bg-brand-primary" : "bg-brand-border"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${requireApproval ? "translate-x-7" : "translate-x-1"}`}></div>
            </div>
          </label>

          {/* Show on Hub */}
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${showOnHub ? "bg-brand-info/10 text-brand-info" : "bg-brand-border/50 text-brand-text-light"}`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">แสดงในหน้ารับสมัคร (Hub)</span>
                <p className="text-sm text-brand-text-light">Worker สามารถค้นหาและสมัครเข้าทีมได้จาก Hub</p>
              </div>
            </div>
            <div 
              onClick={() => setShowOnHub(!showOnHub)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${showOnHub ? "bg-brand-info" : "bg-brand-border"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${showOnHub ? "translate-x-7" : "translate-x-1"}`}></div>
            </div>
          </label>
        </div>
      </Card>

      {/* Assistant Permissions */}
      <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5">
        <div className="p-6 border-b border-brand-border/30 bg-brand-bg/30">
          <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-info" />
            สิทธิ์ผู้ช่วย (Assistant)
          </h3>
          <p className="text-sm text-brand-text-light mt-1">กำหนดว่าผู้ช่วยทำอะไรได้บ้างในทีม</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Can Approve Payout */}
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assistantPermissions.canApprovePayout ? "bg-brand-success/10 text-brand-success" : "bg-brand-bg text-brand-text-light"}`}>
                {assistantPermissions.canApprovePayout ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">อนุมัติการจ่ายเงิน</span>
                <p className="text-sm text-brand-text-light">สามารถอนุมัติงานและจ่ายเงินให้ Worker ได้</p>
              </div>
            </div>
            <div 
              onClick={() => setAssistantPermissions(prev => ({ ...prev, canApprovePayout: !prev.canApprovePayout }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${assistantPermissions.canApprovePayout ? "bg-brand-success" : "bg-brand-border"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${assistantPermissions.canApprovePayout ? "translate-x-7" : "translate-x-1"}`}></div>
            </div>
          </label>

          {/* Can Delete Job */}
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assistantPermissions.canDeleteJob ? "bg-brand-success/10 text-brand-success" : "bg-brand-bg text-brand-text-light"}`}>
                {assistantPermissions.canDeleteJob ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">ลบงาน</span>
                <p className="text-sm text-brand-text-light">สามารถลบหรือยกเลิกงานที่สร้างไว้ได้</p>
              </div>
            </div>
            <div 
              onClick={() => setAssistantPermissions(prev => ({ ...prev, canDeleteJob: !prev.canDeleteJob }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${assistantPermissions.canDeleteJob ? "bg-brand-success" : "bg-brand-border"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${assistantPermissions.canDeleteJob ? "translate-x-7" : "translate-x-1"}`}></div>
            </div>
          </label>

          {/* Can Remove Member */}
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assistantPermissions.canRemoveMember ? "bg-brand-success/10 text-brand-success" : "bg-brand-bg text-brand-text-light"}`}>
                {assistantPermissions.canRemoveMember ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-medium text-brand-text-dark">นำสมาชิกออก</span>
                <p className="text-sm text-brand-text-light">สามารถนำ Worker ออกจากทีมได้</p>
              </div>
            </div>
            <div 
              onClick={() => setAssistantPermissions(prev => ({ ...prev, canRemoveMember: !prev.canRemoveMember }))}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${assistantPermissions.canRemoveMember ? "bg-brand-success" : "bg-brand-border"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${assistantPermissions.canRemoveMember ? "translate-x-7" : "translate-x-1"}`}></div>
            </div>
          </label>
        </div>
      </Card>

      {/* Notifications */}
      <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5">
        <div className="p-6 border-b border-brand-border/30 bg-brand-bg/30">
          <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-warning" />
            การแจ้งเตือน
          </h3>
          <p className="text-sm text-brand-text-light mt-1">ตั้งค่าการแจ้งเตือนสำหรับทีม</p>
        </div>
        <div className="p-6 space-y-5">
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div>
              <span className="font-medium text-brand-text-dark">แจ้งเตือนเมื่อมีคำขอเข้าร่วมใหม่</span>
              <p className="text-sm text-brand-text-light">ได้รับการแจ้งเตือนเมื่อ Worker สมัครเข้าทีม</p>
            </div>
            <div className="w-12 h-6 bg-brand-primary rounded-full transition-colors relative cursor-pointer">
              <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow translate-x-7 transition-transform"></div>
            </div>
          </label>
          
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div>
              <span className="font-medium text-brand-text-dark">แจ้งเตือนเมื่อมีงานรอตรวจสอบ</span>
              <p className="text-sm text-brand-text-light">ได้รับการแจ้งเตือนเมื่อ Worker ส่งงาน</p>
            </div>
            <div className="w-12 h-6 bg-brand-primary rounded-full transition-colors relative cursor-pointer">
              <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow translate-x-7 transition-transform"></div>
            </div>
          </label>
          
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div>
              <span className="font-medium text-brand-text-dark">สรุปรายวัน</span>
              <p className="text-sm text-brand-text-light">รับสรุปผลงานของทีมทุกวัน</p>
            </div>
            <div className="w-12 h-6 bg-brand-border rounded-full transition-colors relative cursor-pointer">
              <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow translate-x-1 transition-transform"></div>
            </div>
          </label>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card variant="elevated" className="border-brand-error/20 shadow-lg shadow-brand-error/5">
        <div className="p-6 border-b border-brand-error/20 bg-brand-error/5">
          <h3 className="font-bold text-lg text-brand-error flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            โซนอันตราย
          </h3>
          <p className="text-sm text-brand-error/80 mt-1">การดำเนินการในส่วนนี้ไม่สามารถย้อนกลับได้</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-brand-error/20 bg-brand-error/5">
            <div>
              <h4 className="font-medium text-brand-text-dark">ลบทีม</h4>
              <p className="text-sm text-brand-text-light">ทีมและข้อมูลทั้งหมดจะถูกลบอย่างถาวร</p>
            </div>
            <Button
              variant="outline"
              className="border-brand-error text-brand-error hover:bg-brand-error hover:text-white transition-colors"
              onClick={() => setShowDeleteModal(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              ลบทีม
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirm("");
        }}
        title="ยืนยันการลบทีม"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-brand-error/5 border border-brand-error/20 rounded-xl">
            <div className="p-3 bg-brand-error/10 rounded-full text-brand-error">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-brand-error">คำเตือน!</h4>
              <p className="text-sm text-brand-text-light">การลบทีมจะลบข้อมูลทั้งหมดอย่างถาวร รวมถึง:</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-brand-text-light pl-4">
            <li className="flex items-center gap-2">
              <X className="w-4 h-4 text-brand-error" />
              ข้อมูลสมาชิกทั้งหมด
            </li>
            <li className="flex items-center gap-2">
              <X className="w-4 h-4 text-brand-error" />
              ประวัติงานและการจ่ายเงิน
            </li>
            <li className="flex items-center gap-2">
              <X className="w-4 h-4 text-brand-error" />
              รีวิวและคะแนน
            </li>
          </ul>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark">
              พิมพ์ชื่อทีม <span className="font-bold text-brand-error">{currentTeam?.name}</span> เพื่อยืนยัน
            </label>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="พิมพ์ชื่อทีมที่นี่..."
              className="bg-white"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirm("");
              }}
            >
              ยกเลิก
            </Button>
            <Button
              className="bg-brand-error hover:bg-brand-error/90 border-transparent text-white"
              onClick={handleDeleteTeam}
              disabled={deleteConfirm !== currentTeam?.name}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              ลบทีมถาวร
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
