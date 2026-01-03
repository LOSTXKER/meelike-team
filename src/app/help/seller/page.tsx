"use client";

import { Card } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import {
  Briefcase,
  Users,
  ClipboardList,
  DollarSign,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { getArticlesByCategory } from "@/lib/constants/help-content";
import { PaymentCancellationTable, SellerFlowDiagram } from "@/components/help";

export default function SellerGuidePage() {
  const articles = getArticlesByCategory("seller");

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="p-4 bg-brand-primary/10 rounded-2xl w-fit mx-auto mb-4">
            <Briefcase className="w-12 h-12 text-brand-primary" />
          </div>
          <h1 className="text-4xl font-bold text-brand-text-dark mb-4">
            คู่มือสำหรับ Seller
          </h1>
          <p className="text-lg text-brand-text-light">
            เรียนรู้วิธีสร้างทีม รับออเดอร์ และจัดการงานอย่างมืออาชีพ
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="p-6 mb-12 border-none bg-gradient-to-r from-brand-primary/5 to-brand-primary/10">
          <h2 className="text-xl font-bold text-brand-text-dark mb-4">
            📑 สารบัญ
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            <a href="#team-create" className="text-brand-primary hover:underline">
              → การสร้างทีม
            </a>
            <a href="#team-assign" className="text-brand-primary hover:underline">
              → การมอบหมายงาน
            </a>
            <a href="#job-management" className="text-brand-primary hover:underline">
              → การจัดการงาน (ใหม่!)
            </a>
            <a href="#payment-payout" className="text-brand-primary hover:underline">
              → ระบบการจ่ายเงิน
            </a>
          </div>
        </Card>

        {/* Flow Diagram */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6">
            🔄 ขั้นตอนการทำงานทั้งหมด
          </h2>
          <SellerFlowDiagram />
        </div>

        {/* Job Management Section - ไฮไลต์! */}
        <div id="job-management" className="mb-12 scroll-mt-20">
          <div className="p-6 bg-gradient-to-r from-brand-warning/10 to-brand-warning/5 rounded-xl border-2 border-brand-warning/20 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-warning/20 rounded-xl">
                <ClipboardList className="w-6 h-6 text-brand-warning" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-text-dark mb-2">
                  ⭐ การจัดการงาน (Job Management)
                </h2>
                <p className="text-brand-text-light">
                  ฟีเจอร์ใหม่! คุณสามารถแก้ไข ลบ หรือยกเลิกงานได้ตามสถานะ
                </p>
              </div>
            </div>
          </div>

          {/* Edit Job */}
          <Card className="p-6 mb-6 border-none shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-brand-info/10 rounded-lg">
                <Edit className="w-5 h-5 text-brand-info" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                  การแก้ไขงาน
                </h3>
                <p className="text-brand-text-light mb-4">
                  สามารถแก้ไขงานได้เฉพาะงานที่มีสถานะ <span className="font-bold text-brand-warning">"รอจอง" (Pending)</span> เท่านั้น
                </p>
              </div>
            </div>

            <div className="space-y-4 pl-14">
              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">สิ่งที่แก้ไขได้:</h4>
                <ul className="list-disc list-inside space-y-1 text-brand-text-light">
                  <li>จำนวน (Quantity)</li>
                  <li>ราคาต่อหน่วย (Price per unit)</li>
                  <li>คำแนะนำสำหรับ Worker</li>
                  <li>กำหนดส่ง (Deadline)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">เงื่อนไข:</h4>
                <ul className="list-disc list-inside space-y-1 text-brand-text-light">
                  <li>งานต้องเป็นสถานะ "pending"</li>
                  <li>ยังไม่มี Worker จองงาน</li>
                  <li>เมื่อแก้ไขแล้วจะคำนวณราคารวมใหม่อัตโนมัติ</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Delete Job */}
          <Card className="p-6 mb-6 border-none shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                  การลบงาน
                </h3>
                <p className="text-red-600 font-medium mb-4">
                  ⚠️ การลบงานจะลบถาวรและไม่สามารถกู้คืนได้!
                </p>
              </div>
            </div>

            <div className="space-y-4 pl-14">
              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">เงื่อนไข:</h4>
                <ul className="list-disc list-inside space-y-1 text-brand-text-light">
                  <li>งานต้องเป็นสถานะ "pending"</li>
                  <li>ไม่มี Worker จองงานแล้ว</li>
                  <li>ยืนยันการลบก่อนดำเนินการ</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>ทางเลือกอื่น:</strong> หากงานมี Worker จองแล้ว ให้ใช้ "ยกเลิกงาน" แทน
                </p>
              </div>
            </div>
          </Card>

          {/* Cancel Job */}
          <Card className="p-6 mb-6 border-none shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-brand-warning/10 rounded-lg">
                <Ban className="w-5 h-5 text-brand-warning" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                  การยกเลิกงาน
                </h3>
                <p className="text-brand-text-light mb-4">
                  เมื่อยกเลิกงาน Worker จะได้รับค่าตอบแทนที่ยุติธรรมตามจำนวนงานที่ทำไป
                </p>
              </div>
            </div>

            <div className="pl-14 space-y-6">
              <div>
                <h4 className="font-bold text-brand-text-dark mb-3">
                  ตารางการจ่ายเงินตามสถานะ:
                </h4>
                <PaymentCancellationTable />
              </div>

              <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-lg">
                <p className="text-sm text-brand-text-dark">
                  <strong>💡 ทำไมต้องจ่ายเงิน?</strong><br />
                  Worker ได้ลงแรงทำงานแล้ว ดังนั้นต้องได้รับค่าตอบแทนที่สมควร
                  แม้ว่างานจะถูกยกเลิกก็ตาม นี่คือหลักการทำงานที่ยุติธรรม
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Other Sections */}
        <div id="team-create" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <Users className="w-7 h-7 text-brand-primary" />
            การสร้างและจัดการทีม
          </h2>
          <Card className="p-6 border-none shadow-lg">
            <div className="prose prose-sm max-w-none">
              <p className="text-brand-text-light leading-relaxed mb-4">
                ทีมคือกลุ่ม Worker ที่คุณจะมอบหมายงาน Human Service ให้ทำ
              </p>
              
              <h4 className="font-bold text-brand-text-dark mt-4 mb-2">ขั้นตอนการสร้าง:</h4>
              <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                <li>ไปที่เมนู "ทีม" ในหน้า Seller</li>
                <li>คลิก "สร้างทีม"</li>
                <li>กรอกข้อมูล: ชื่อทีม, รายละเอียด, ตั้งค่าการจ่ายเงิน</li>
                <li>คลิก "สร้าง"</li>
              </ol>

              <h4 className="font-bold text-brand-text-dark mt-4 mb-2">บทบาทในทีม:</h4>
              <ul className="list-disc list-inside space-y-2 text-brand-text-light">
                <li><strong>หัวหน้าทีม (Lead):</strong> คุณเอง - ควบคุมทุกอย่าง</li>
                <li><strong>ผู้ช่วย (Assistant):</strong> ช่วยดูแลทีม อนุมัติงาน</li>
                <li><strong>Worker:</strong> รับงานและทำงาน</li>
              </ul>
            </div>
          </Card>
        </div>

        <div id="payment-payout" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-brand-success" />
            ระบบการจ่ายเงิน Payout
          </h2>
          <Card className="p-6 border-none shadow-lg">
            <div className="prose prose-sm max-w-none">
              <p className="text-brand-text-light leading-relaxed mb-4">
                Payout คือการจ่ายเงินให้ Worker หลังจากงานเสร็จและได้รับการอนุมัติ
              </p>

              <h4 className="font-bold text-brand-text-dark mt-4 mb-2">ระบบทำงานอัตโนมัติ:</h4>
              <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                <li>Worker ส่งงาน</li>
                <li>คุณอนุมัติงาน</li>
                <li>ระบบสร้าง Payout ให้ Worker อัตโนมัติ</li>
                <li>Worker สามารถถอนเงินได้</li>
              </ol>

              <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-lg mt-4">
                <p className="text-sm text-brand-text-dark">
                  <strong>💡 Tips:</strong> ควรจ่ายเงินภายใน 2-3 วัน เพื่อรักษาความน่าเชื่อถือของทีม
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </Container>
  );
}
