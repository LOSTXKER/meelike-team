"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import { Copy, QrCode, RefreshCw, Check } from "lucide-react";
import { useCopyToClipboard } from "@/lib/hooks";
import { FormCheckbox } from "./form-section";
import type { Team } from "@/types";

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

export function InviteTeamModal({ isOpen, onClose, team }: InviteTeamModalProps) {
  const inviteLink = `https://seller.meelike.com/work/teams/join?code=${team.inviteCode}`;
  
  const { copy: copyLink, copied: copiedLink } = useCopyToClipboard();
  const { copy: copyCode, copied: copiedCode } = useCopyToClipboard();

  const [requireApproval, setRequireApproval] = useState(team.requireApproval);
  const [isRecruiting, setIsRecruiting] = useState(team.isRecruiting);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`➕ เชิญสมาชิกเข้าทีม ${team.name}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Invite Link */}
        <div>
          <label className="text-label mb-2 block">🔗 Link เชิญ</label>
          <div className="flex gap-2">
            <Input
              value={inviteLink}
              readOnly
              className="flex-1 bg-brand-bg/50 text-sm"
            />
            <Button 
              variant={copiedLink ? "secondary" : "outline"} 
              onClick={() => copyLink(inviteLink)}
              className={copiedLink ? "bg-brand-success/10 text-brand-success border-brand-success/30" : ""}
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Invite Code */}
        <div>
          <label className="text-label mb-2 block">🔑 รหัสเชิญ</label>
          <div className="flex gap-2">
            <Input
              value={team.inviteCode}
              readOnly
              className="flex-1 bg-brand-bg/50 font-mono text-center tracking-widest text-lg"
            />
            <Button 
              variant={copiedCode ? "secondary" : "outline"} 
              onClick={() => copyCode(team.inviteCode)}
              className={copiedCode ? "bg-brand-success/10 text-brand-success border-brand-success/30" : ""}
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button variant="outline" title="สร้างรหัสใหม่">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center">
          <label className="text-label mb-2 block">QR Code</label>
          <div className="inline-block p-6 bg-white rounded-2xl border border-brand-border shadow-sm">
            <div className="w-32 h-32 bg-brand-text-dark flex items-center justify-center rounded-lg">
              <QrCode className="w-20 h-20 text-white" />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3 p-4 rounded-2xl bg-brand-bg/30 border border-brand-border/50">
          <FormCheckbox
            label="ต้องอนุมัติก่อนเข้าทีม"
            description="สมาชิกใหม่ต้องรอการอนุมัติจากหัวหน้าทีม"
            checked={requireApproval}
            onChange={setRequireApproval}
          />
          <FormCheckbox
            label="แสดงในหน้าค้นหาทีม"
            description="ให้ทีมของคุณปรากฏในหน้า Hub รับสมัคร"
            checked={isRecruiting}
            onChange={setIsRecruiting}
          />
        </div>
      </div>
    </Modal>
  );
}
