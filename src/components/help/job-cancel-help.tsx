import { PaymentCancellationTable } from "./payment-table";
import { AlertTriangle, DollarSign, Clock } from "lucide-react";

export function JobCancelHelpContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-brand-text-dark mb-3">
          การยกเลิกงานและการจ่ายเงิน
        </h3>
        <p className="text-sm text-brand-text-light leading-relaxed">
          เมื่อคุณยกเลิกงาน ระบบจะคำนวณค่าตอบแทนที่ Worker ควรได้รับโดยอัตโนมัติ
          ตามหลักความยุติธรรม
        </p>
      </div>

      {/* Payment Table */}
      <div>
        <h4 className="font-bold text-brand-text-dark mb-3">
          ตารางการจ่ายเงินตามสถานะ
        </h4>
        <PaymentCancellationTable />
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h4 className="font-bold text-brand-text-dark">ตัวอย่างสถานการณ์</h4>

        {/* Example 1: Pending */}
        <div className="p-4 bg-brand-warning/5 border border-brand-warning/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-brand-warning mt-0.5" />
            <div>
              <div className="font-medium text-brand-text-dark mb-1">
                สถานะ "รอจอง"
              </div>
              <p className="text-sm text-brand-text-light">
                งาน 100 Like ราคา 0.50฿/Like รวม 50฿
                <br />
                ยังไม่มี Worker จอง
                <br />
                <span className="font-bold text-brand-warning">
                  → ยกเลิกได้ฟรี ไม่ต้องจ่ายเงิน
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Example 2: In Progress */}
        <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-lg">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-brand-info mt-0.5" />
            <div>
              <div className="font-medium text-brand-text-dark mb-1">
                สถานะ "กำลังทำ"
              </div>
              <p className="text-sm text-brand-text-light">
                งาน 100 Like ราคา 0.50฿/Like รวม 50฿
                <br />
                Worker ทำไปแล้ว 60 Like
                <br />
                <span className="font-bold text-brand-info">
                  → ต้องจ่าย 30฿ (60 × 0.50฿)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Example 3: Pending Review */}
        <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-lg">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-brand-success mt-0.5" />
            <div>
              <div className="font-medium text-brand-text-dark mb-1">
                สถานะ "รอตรวจสอบ"
              </div>
              <p className="text-sm text-brand-text-light">
                งาน 100 Like ราคา 0.50฿/Like รวม 50฿
                <br />
                Worker ส่งงานครบ 100 Like แล้ว
                <br />
                <span className="font-bold text-brand-success">
                  → ต้องจ่ายเต็ม 50฿
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <div className="font-bold text-red-900 mb-1">ข้อควรระวัง</div>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>การยกเลิกไม่สามารถกู้คืนได้</li>
              <li>Worker จะได้รับเงินทันที (ผ่าน Payout)</li>
              <li>ควรระบุเหตุผลให้ชัดเจน</li>
              <li>การยกเลิกบ่อยอาจส่งผลต่อความน่าเชื่อถือของทีม</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
