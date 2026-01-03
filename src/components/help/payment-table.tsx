import { Check, X, DollarSign } from "lucide-react";

export function PaymentCancellationTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-brand-border/20">
      <table className="w-full">
        <thead className="bg-brand-bg">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-bold text-brand-text-dark">
              สถานะงาน
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-brand-text-dark">
              จ่ายเงิน
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-brand-text-dark">
              คำอธิบาย
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border/10">
          {/* Pending */}
          <tr className="hover:bg-brand-bg/50 transition-colors">
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-warning/10 text-brand-warning rounded-md text-sm font-medium">
                รอจอง (Pending)
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2 text-brand-text-light">
                <X className="w-4 h-4" />
                <span className="font-bold">0฿</span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-brand-text-light">
              ยังไม่มี Worker จองหรือเริ่มทำงาน
            </td>
          </tr>

          {/* In Progress */}
          <tr className="hover:bg-brand-bg/50 transition-colors">
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-info/10 text-brand-info rounded-md text-sm font-medium">
                กำลังทำ (In Progress)
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2 text-brand-warning">
                <DollarSign className="w-4 h-4" />
                <span className="font-bold">บางส่วน</span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-brand-text-light">
              จ่ายตามจำนวนที่ทำไปแล้ว
              <br />
              <span className="text-xs opacity-75">
                (จำนวนที่ทำแล้ว × ราคาต่อหน่วย)
              </span>
            </td>
          </tr>

          {/* Pending Review */}
          <tr className="hover:bg-brand-bg/50 transition-colors">
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-warning/10 text-brand-warning rounded-md text-sm font-medium">
                รอตรวจสอบ (Pending Review)
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2 text-brand-success">
                <Check className="w-4 h-4" />
                <span className="font-bold">เต็มจำนวน</span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-brand-text-light">
              จ่ายเต็มจำนวนสำหรับงานที่ส่งแล้ว
              <br />
              <span className="text-xs opacity-75">
                (Worker ส่งงานครบแล้ว)
              </span>
            </td>
          </tr>

          {/* Completed */}
          <tr className="hover:bg-brand-bg/50 transition-colors">
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-success/10 text-brand-success rounded-md text-sm font-medium">
                เสร็จสิ้น (Completed)
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2 text-brand-text-light">
                <X className="w-4 h-4" />
                <span className="font-bold">ไม่สามารถยกเลิก</span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-brand-text-light">
              งานเสร็จและจ่ายเงินแล้ว
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function PaymentCancellationExplainer() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-text-light leading-relaxed">
        ระบบจะคำนวณค่าตอบแทนอัตโนมัติตามสถานะงานและจำนวนที่ Worker ทำไปแล้ว
        เพื่อความยุติธรรมสำหรับทั้งสองฝ่าย
      </p>

      <PaymentCancellationTable />

      <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-lg">
        <p className="text-sm text-brand-text-dark font-medium mb-2">
          💡 ทำไมต้องจ่ายเงิน?
        </p>
        <p className="text-sm text-brand-text-light leading-relaxed">
          Worker ได้ลงแรงทำงานแล้ว ดังนั้นต้องได้รับค่าตอบแทนที่สมควร
          แม้ว่างานจะถูกยกเลิกก็ตาม นี่คือหลักการทำงานที่ยุติธรรม
        </p>
      </div>
    </div>
  );
}
