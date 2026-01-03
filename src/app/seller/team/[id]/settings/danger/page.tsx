"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, Button, Input, Modal } from "@/components/ui";
import { useSellerTeams } from "@/lib/api/hooks";
import { Trash2, AlertTriangle, X } from "lucide-react";

export default function TeamDangerPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const { data: teams } = useSellerTeams();
  
  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleDeleteTeam = () => {
    if (deleteConfirm === currentTeam?.name) {
      alert("ลบทีมเรียบร้อย!");
      setShowDeleteModal(false);
      // Redirect to team list
      window.location.href = "/seller/team";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
