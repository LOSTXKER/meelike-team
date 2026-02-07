"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { Dialog } from "@/components/ui/Dialog";
import { AlertCircle, AlertTriangle, Globe } from "lucide-react";

interface OutsourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    quantity: string;
    suggestedPrice: string;
    deadline: string;
    description: string;
    isUrgent: boolean;
  }) => void;
  isLoading: boolean;
  serviceName: string;
  maxQuantity: number;
  initialQuantity: string;
}

export function OutsourceModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  serviceName,
  maxQuantity,
  initialQuantity,
}: OutsourceModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const handleClose = () => {
    setQuantity("");
    setSuggestedPrice("");
    setDeadline("");
    setDescription("");
    setIsUrgent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Dialog.Header>
        <Dialog.Title>โพสต์ลง Hub</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-xl border border-brand-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-brand-text-dark">{serviceName}</p>
                <p className="text-xs text-brand-text-light">
                  โพสต์ไปตลาด Hub ให้ทีมอื่นมา bid
                </p>
              </div>
            </div>
            <div className="p-2 bg-white rounded-lg text-sm">
              <p className="text-brand-text-light text-xs">
                จำนวนที่สามารถโพสต์ได้
              </p>
              <p className="font-bold text-brand-text-dark">
                {maxQuantity.toLocaleString()} หน่วย
              </p>
            </div>
          </div>

          <div className="p-3 bg-brand-info/10 border border-brand-info/20 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-brand-info mt-0.5 shrink-0" />
              <div className="text-sm text-brand-text-dark">
                <p className="font-medium text-brand-info mb-1">วิธีการทำงาน</p>
                <ul className="text-xs text-brand-text-light space-y-1">
                  <li>• งานจะถูกโพสต์ในตลาด Hub</li>
                  <li>• ทีมอื่นๆ จะเห็นและส่ง bid เข้ามา</li>
                  <li>• คุณเลือก bid ที่ต้องการแล้วมอบหมายงาน</li>
                  <li>• ราคาที่ทีม bid = ต้นทุนใหม่ของคุณ</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="จำนวนที่โพสต์ *"
              type="number"
              placeholder="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              max={maxQuantity}
            />
            <Input
              label="ราคาแนะนำ/หน่วย (฿) *"
              type="number"
              step="0.01"
              placeholder="0.15"
              value={suggestedPrice}
              onChange={(e) => setSuggestedPrice(e.target.value)}
            />
          </div>

          <Input
            label="กำหนดส่ง *"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <Textarea
            label="รายละเอียดเพิ่มเติม (ถ้ามี)"
            placeholder="เช่น ต้องการแอคคนจริง, ต้องแคปหลักฐาน..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 text-brand-warning rounded focus:ring-brand-warning"
            />
            <span className="text-sm text-brand-text-dark">
              งานด่วน (แสดงเป็น Urgent ใน Hub)
            </span>
          </label>

          {quantity && suggestedPrice && (
            <div className="p-3 bg-brand-warning/10 border border-brand-warning/30 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">
                  งบประมาณสูงสุด (ถ้า bid ตามราคาแนะนำ)
                </span>
                <span className="font-bold text-brand-warning">
                  ฿
                  {(
                    parseFloat(quantity || "0") *
                    parseFloat(suggestedPrice || "0")
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">
                  คำเตือน: กรุณาตรวจสอบเนื้อหาก่อนโพสต์
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  ห้ามโพสต์งานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย,
                  โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่
                </p>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="outline" onClick={handleClose} disabled={isLoading}>
          ยกเลิก
        </Button>
        <Button
          onClick={() =>
            onSubmit({ quantity, suggestedPrice, deadline, description, isUrgent })
          }
          disabled={
            !quantity || !suggestedPrice || !deadline || isLoading
          }
          isLoading={isLoading}
          className="shadow-md shadow-brand-accent/20 bg-gradient-to-r from-brand-accent to-brand-primary"
        >
          <Globe className="w-4 h-4 mr-2" />
          โพสต์ลง Hub
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
