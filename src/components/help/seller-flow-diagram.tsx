export function SellerFlowDiagram() {
  return (
    <div className="p-6 bg-gradient-to-br from-brand-bg to-brand-primary/5 rounded-xl border border-brand-border/20">
      <h4 className="font-bold text-brand-text-dark mb-4 text-center">
        ขั้นตอนการทำงานของ Seller
      </h4>
      
      <div className="space-y-3">
        {/* Step 1 */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-brand-text-dark text-sm">สร้างทีม</div>
            <div className="text-xs text-brand-text-light mt-0.5">สร้างทีมสำหรับทำงาน Human Service</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-brand-primary/30" />
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
            2
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-brand-text-dark text-sm">รับออเดอร์</div>
            <div className="text-xs text-brand-text-light mt-0.5">ลูกค้าสั่งผ่านหน้า Store</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-brand-primary/30" />
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-info text-white rounded-full flex items-center justify-center text-sm font-bold">
            3
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-brand-text-dark text-sm">มอบหมายงานให้ทีม</div>
            <div className="text-xs text-brand-text-light mt-0.5">สร้าง TeamJob จากออเดอร์</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-brand-primary/30" />
        </div>

        {/* Step 4 */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-info text-white rounded-full flex items-center justify-center text-sm font-bold">
            4
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-brand-text-dark text-sm">Worker จองและทำงาน</div>
            <div className="text-xs text-brand-text-light mt-0.5">Worker ในทีมจองงานและเริ่มทำ</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-brand-primary/30" />
        </div>

        {/* Step 5 */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-warning text-white rounded-full flex items-center justify-center text-sm font-bold">
            5
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-brand-text-dark text-sm">ตรวจสอบงาน</div>
            <div className="text-xs text-brand-text-light mt-0.5">อนุมัติหรือปฏิเสธงานที่ส่งมา</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-brand-primary/30" />
        </div>

        {/* Step 6 */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-success text-white rounded-full flex items-center justify-center text-sm font-bold">
            6
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-brand-text-dark text-sm">จ่ายเงิน Worker</div>
            <div className="text-xs text-brand-text-light mt-0.5">ระบบสร้าง Payout อัตโนมัติ</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-0.5 h-6 bg-brand-primary/30" />
        </div>

        {/* Step 7 */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-brand-success text-white rounded-full flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <div className="flex-1 p-3 bg-brand-success/10 border border-brand-success/20 rounded-lg">
            <div className="font-bold text-brand-success text-sm">งานเสร็จสมบูรณ์!</div>
            <div className="text-xs text-brand-success/80 mt-0.5">ส่งมอบงานให้ลูกค้า</div>
          </div>
        </div>
      </div>
    </div>
  );
}
