"use client";

import { Card, Button } from "@/components/ui";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { clearAllStorage } from "@/lib/storage";
import { Trash2, AlertTriangle } from "lucide-react";

export default function DangerZonePage() {
  const confirm = useConfirm();

  return (
    <div className="space-y-6">
      <Card className="border-2 border-red-200 shadow-md p-6 bg-red-50/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-bold text-red-600">โซนอันตราย</h2>
            <p className="text-xs text-brand-text-light">
              การดำเนินการที่ไม่สามารถย้อนกลับได้
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200">
          <div>
            <p className="font-medium text-brand-text-dark text-sm">
              รีเซ็ตข้อมูลทั้งหมด
            </p>
            <p className="text-xs text-brand-text-light mt-0.5">
              ลบข้อมูลออเดอร์ ทีม และบริการทั้งหมด (Dev/Test)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
            onClick={async () => {
              if (
                await confirm({
                  title: "ยืนยัน",
                  message: "ยืนยันการรีเซ็ตข้อมูลทั้งหมด?",
                  variant: "danger",
                  confirmLabel: "รีเซ็ต",
                })
              ) {
                clearAllStorage();
                window.location.reload();
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            รีเซ็ต
          </Button>
        </div>
      </Card>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">คำเตือน</p>
            <p className="text-xs text-amber-700">
              การรีเซ็ตข้อมูลจะลบข้อมูลทั้งหมดของคุณอย่างถาวร
              รวมถึงออเดอร์ ทีม บริการ และการตั้งค่าต่างๆ
              ไม่สามารถกู้คืนได้หลังจากดำเนินการ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
