"use client";

import { Card } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import {
  Users,
  Search,
  Eye,
  MousePointer,
  ClipboardCheck,
  Upload,
  DollarSign,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { WorkerFlowDiagram } from "@/components/help";

export default function WorkerGuidePage() {
  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="p-4 bg-brand-success/10 rounded-2xl w-fit mx-auto mb-4">
            <Users className="w-12 h-12 text-brand-success" />
          </div>
          <h1 className="text-4xl font-bold text-brand-text-dark mb-4">
            คู่มือสำหรับ Worker
          </h1>
          <p className="text-lg text-brand-text-light">
            เรียนรู้วิธีหาทีม จองงาน ทำงาน และรับเงิน
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="p-6 mb-12 border-none bg-gradient-to-r from-brand-success/5 to-brand-success/10">
          <h2 className="text-xl font-bold text-brand-text-dark mb-4">
            📑 สารบัญ
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            <a href="#find-team" className="text-brand-success hover:underline">
              → การหาทีมและเข้าร่วม
            </a>
            <a href="#claim-job" className="text-brand-success hover:underline">
              → การจองงาน (มี Preview!)
            </a>
            <a href="#do-work" className="text-brand-success hover:underline">
              → การทำงานและส่งงาน
            </a>
            <a href="#cancelled" className="text-brand-success hover:underline">
              → งานถูกยกเลิก
            </a>
            <a href="#earnings" className="text-brand-success hover:underline">
              → รายได้และการถอนเงิน
            </a>
          </div>
        </Card>

        {/* Flow Diagram */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6">
            🔄 ขั้นตอนการทำงานทั้งหมด
          </h2>
          <WorkerFlowDiagram />
        </div>

        {/* Find Team */}
        <div id="find-team" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <Search className="w-7 h-7 text-brand-info" />
            การหาทีมและเข้าร่วม
          </h2>
          <Card className="p-6 border-none shadow-lg">
            <div className="prose prose-sm max-w-none">
              <p className="text-brand-text-light leading-relaxed mb-4">
                Hub คือศูนย์กลางที่ Seller ประกาศหาคนและ Worker หาทีมเข้า
              </p>

              <h4 className="font-bold text-brand-text-dark mt-4 mb-2">วิธีหาทีม:</h4>
              <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                <li>ไปที่เมนู "Hub"</li>
                <li>เลือก "หาทีม"</li>
                <li>ดูประกาศของทีมต่างๆ</li>
                <li>เลือกทีมที่สนใจ</li>
                <li>คลิก "สมัครเข้าทีม"</li>
                <li>รอการอนุมัติจาก Seller</li>
              </ol>

              <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-lg mt-4">
                <p className="text-sm text-brand-text-dark">
                  <strong>💡 Tips:</strong> สมัครหลายทีมได้ เพิ่มโอกาสรับงาน
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Claim Job - ไฮไลต์! */}
        <div id="claim-job" className="mb-12 scroll-mt-20">
          <div className="p-6 bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 rounded-xl border-2 border-brand-primary/20 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-primary/20 rounded-xl">
                <Eye className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-text-dark mb-2">
                  ⭐ การจองงาน (Claim Job)
                </h2>
                <p className="text-brand-text-light">
                  ฟีเจอร์ใหม่! ตอนนี้คุณสามารถ Preview รายละเอียดงานก่อนจองได้แล้ว
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Preview Step */}
            <Card className="p-6 border-none shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <Eye className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                    ขั้นตอน 1: Preview งานก่อนจอง
                  </h3>
                  <p className="text-brand-text-light">
                    ดูรายละเอียดครบถ้วนก่อนตัดสินใจจองงาน
                  </p>
                </div>
              </div>

              <div className="pl-14 space-y-4">
                <div>
                  <h4 className="font-bold text-brand-text-dark mb-2">ข้อมูลที่จะเห็น:</h4>
                  <ul className="list-disc list-inside space-y-1 text-brand-text-light">
                    <li>ราคาต่อหน่วย - รู้ว่าจะได้เท่าไหร่</li>
                    <li>จำนวนที่ต้องทำ - รู้ขนาดงาน</li>
                    <li>กำหนดส่ง (Deadline) - เช็คว่ามีเวลาทำหรือไม่</li>
                    <li>คำแนะนำวิธีทำ - อ่านให้เข้าใจก่อน</li>
                    <li>Target URL - ดูว่าต้องทำที่ไหน</li>
                  </ul>
                </div>

                <div className="p-4 bg-brand-warning/5 border border-brand-warning/20 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ <strong>คำเตือน:</strong> อ่านรายละเอียดให้ดีก่อนจอง! 
                    เมื่อจองแล้วต้องทำให้เสร็จ
                  </p>
                </div>
              </div>
            </Card>

            {/* Claim Step */}
            <Card className="p-6 border-none shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-brand-success/10 rounded-lg">
                  <MousePointer className="w-5 h-5 text-brand-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                    ขั้นตอน 2: จองงาน
                  </h3>
                  <p className="text-brand-text-light">
                    เมื่อพร้อมแล้วให้คลิก "จองงาน"
                  </p>
                </div>
              </div>

              <div className="pl-14 space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                  <li>คลิก "จองงาน"</li>
                  <li>ยืนยันการจอง</li>
                  <li>เริ่มทำงานทันที</li>
                </ol>

                <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-lg">
                  <p className="text-sm text-brand-text-dark">
                    <strong>✅ ข้อควรระวัง:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-light mt-2">
                    <li>หากไม่ทำหรือทำไม่ครบ อาจส่งผลต่อคะแนน</li>
                    <li>ควรอ่านคำแนะนำให้ดีก่อนจอง</li>
                    <li>ตรวจสอบว่ามีเวลาทำให้ทันหรือไม่</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Do Work */}
        <div id="do-work" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <ClipboardCheck className="w-7 h-7 text-brand-info" />
            การทำงานและส่งงาน
          </h2>
          <Card className="p-6 border-none shadow-lg">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">การทำงาน:</h4>
                <ul className="list-disc list-inside space-y-2 text-brand-text-light">
                  <li>ทำตามคำแนะนำที่ Seller ระบุไว้</li>
                  <li>อัปเดตความคืบหน้า (ถ้ามี)</li>
                  <li>เก็บหลักฐานการทำงาน (screenshots, URLs)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">การส่งงาน:</h4>
                <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                  <li>คลิก "ส่งงาน"</li>
                  <li>แนบหลักฐานการทำงาน (Proof URLs)</li>
                  <li>เพิ่มหมายเหตุ (ถ้ามี)</li>
                  <li>คลิก "ยืนยันการส่ง"</li>
                </ol>
              </div>

              <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-lg">
                <p className="text-sm text-brand-text-dark">
                  <strong>💡 Tips:</strong> แนบหลักฐานให้ครบถ้วน จะได้รับการอนุมัติเร็วขึ้น
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Cancelled Jobs */}
        <div id="cancelled" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <XCircle className="w-7 h-7 text-red-600" />
            เมื่องานถูกยกเลิก
          </h2>
          <Card className="p-6 border-none shadow-lg">
            <div className="space-y-6">
              <p className="text-brand-text-light leading-relaxed">
                Seller สามารถยกเลิกงานได้ในบางกรณี แต่คุณจะได้รับค่าตอบแทนที่ยุติธรรม
              </p>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">คุณจะได้รับเงิน:</h4>
                <ul className="list-disc list-inside space-y-2 text-brand-text-light">
                  <li><strong>งานที่ทำไปแล้ว:</strong> คุณจะได้รับเงินตามจำนวนที่ทำไป</li>
                  <li><strong>งานที่ส่งแล้ว:</strong> คุณจะได้รับเงินเต็มจำนวน</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">สิ่งที่จะเห็น:</h4>
                <ul className="list-disc list-inside space-y-2 text-brand-text-light">
                  <li>แบนเนอร์สีแดงแจ้งว่างานถูกยกเลิก</li>
                  <li>เหตุผลการยกเลิก (ถ้า Seller ระบุ)</li>
                  <li>จำนวนเงินที่คุณได้รับ</li>
                  <li>วันที่ยกเลิก</li>
                </ul>
              </div>

              <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-lg">
                <p className="text-sm text-brand-text-dark">
                  <strong>✅ ไม่ต้องกังวล:</strong> การที่งานถูกยกเลิก 
                  <strong className="text-brand-success"> ไม่ส่งผล</strong>
                  ต่อคะแนนหรือสถิติของคุณ
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Earnings */}
        <div id="earnings" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-brand-success" />
            รายได้และการถอนเงิน
          </h2>
          <Card className="p-6 border-none shadow-lg">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">การดูรายได้:</h4>
                <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                  <li>ไปที่เมนู "รายได้"</li>
                  <li>ดูยอดรวมทั้งหมด</li>
                  <li>ดูรายได้แต่ละงาน</li>
                  <li>ดูประวัติการถอน</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">การถอนเงิน:</h4>
                <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                  <li>คลิก "ถอนเงิน"</li>
                  <li>ระบุจำนวนที่ต้องการถอน</li>
                  <li>เลือกบัญชีรับเงิน (PromptPay หรือโอนธนาคาร)</li>
                  <li>ยืนยันการถอน</li>
                </ol>
              </div>

              <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-lg">
                <h4 className="font-bold text-brand-text-dark mb-2">เงื่อนไข:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-light">
                  <li>ถอนขั้นต่ำ 100฿</li>
                  <li>ใช้เวลา 1-3 วันทำการ</li>
                  <li>ตรวจสอบบัญชีให้ถูกต้อง</li>
                </ul>
              </div>

              <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-lg">
                <p className="text-sm text-brand-text-dark">
                  <strong>💡 Tips:</strong> เก็บสะสมให้ครบจำนวนมากๆ ก่อนถอน 
                  เพื่อประหยัดค่าธรรมเนียม
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </Container>
  );
}
