"use client";

import { Card } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  category: "general" | "seller" | "worker";
}

const faqs: FAQItem[] = [
  {
    id: "data-diff",
    question: "ทำไมข้อมูล Local กับ Vercel ไม่เหมือนกัน?",
    category: "general",
    answer: (
      <div className="space-y-3">
        <p>
          ข้อมูลในระบบนี้เก็บใน <strong>localStorage</strong> ของเบราว์เซอร์ 
          ไม่ใช่ฐานข้อมูลกลาง
        </p>
        <div>
          <strong>ความหมาย:</strong>
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>ข้อมูลเก็บในเครื่องคุณ</li>
            <li>แต่ละเบราว์เซอร์มีข้อมูลคนละชุด</li>
            <li>Vercel กับ Local เป็นคนละ origin</li>
          </ul>
        </div>
        <div className="p-3 bg-brand-warning/5 border border-brand-warning/20 rounded-lg">
          <p className="text-sm">
            <strong>⚠️ ข้อจำกัด:</strong> ถ้าล้าง cache หรือเปลี่ยนเบราว์เซอร์ ข้อมูลจะหาย
          </p>
        </div>
        <div className="p-3 bg-brand-info/5 border border-brand-info/20 rounded-lg">
          <p className="text-sm">
            <strong>💡 แก้ไข:</strong> นี่คือ prototype ในอนาคตจะมีฐานข้อมูลกลางจริงๆ
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "cancel-payment",
    question: "ยกเลิกงานแล้วเงินจะจ่ายยังไง?",
    category: "seller",
    answer: (
      <div className="space-y-3">
        <p>
          ระบบจะคำนวณค่าตอบแทนอัตโนมัติตามสถานะงาน:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Pending:</strong> 0฿ (ยังไม่มีใครทำงาน)</li>
          <li><strong>In Progress:</strong> จ่ายบางส่วน (ตามจำนวนที่ทำไปแล้ว)</li>
          <li><strong>Pending Review:</strong> จ่ายเต็มจำนวน (ทำเสร็จแล้ว)</li>
          <li><strong>Completed:</strong> ไม่สามารถยกเลิก (จ่ายแล้ว)</li>
        </ul>
        <div className="p-3 bg-brand-success/5 border border-brand-success/20 rounded-lg">
          <p className="text-sm">
            <strong>💡 เหตุผล:</strong> Worker ได้ลงแรงทำงานแล้ว 
            ต้องได้รับค่าตอบแทนที่สมควร แม้งานจะถูกยกเลิกก็ตาม
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "worker-no-see-job",
    question: "Worker ไม่เห็นงานที่จอง?",
    category: "worker",
    answer: (
      <div className="space-y-3">
        <p>ตรวจสอบดังนี้:</p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>เช็คสถานะ claim ว่ายืนยันการจองแล้วหรือยัง</li>
          <li>ไปที่เมนู "งานของฉัน" ในหน้า Worker</li>
          <li>ดูในแท็บ "กำลังทำ" (In Progress)</li>
          <li>ถ้ายังไม่เห็น ลองรีเฟรชหน้าเว็บ</li>
        </ol>
        <div className="p-3 bg-brand-info/5 border border-brand-info/20 rounded-lg">
          <p className="text-sm">
            <strong>💡 Tips:</strong> งานที่จองจะอยู่ในหน้า "งานของฉัน" 
            ไม่ใช่ในหน้ารายการงานทีมอีกต่อไป
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "seller-cannot-edit",
    question: "Seller แก้ไขงานไม่ได้?",
    category: "seller",
    answer: (
      <div className="space-y-3">
        <p>
          คุณสามารถแก้ไขงานได้เฉพาะงานที่มีสถานะ <strong>"รอจอง" (Pending)</strong> เท่านั้น
        </p>
        <div>
          <strong>เงื่อนไขที่ต้องผ่าน:</strong>
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>งานต้องเป็นสถานะ "pending"</li>
            <li>ยังไม่มี Worker จองงาน</li>
          </ul>
        </div>
        <div className="p-3 bg-brand-warning/5 border border-brand-warning/20 rounded-lg">
          <p className="text-sm">
            <strong>⚠️ หากไม่สามารถแก้ไขได้:</strong> แสดงว่างานมีสถานะอื่น 
            หรือมี Worker จองแล้ว ให้ใช้ "ยกเลิกงาน" แทน
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "worker-cancel-impact",
    question: "งานถูกยกเลิกส่งผลต่อคะแนนของฉันไหม?",
    category: "worker",
    answer: (
      <div className="space-y-3">
        <div className="p-4 bg-brand-success/10 border border-brand-success/20 rounded-lg">
          <p className="font-bold text-brand-success mb-2">
            ✅ ไม่ส่งผล!
          </p>
          <p className="text-sm">
            การที่งานถูกยกเลิกโดย Seller <strong>ไม่ส่งผลกระทบ</strong>
            ต่อคะแนนหรือสถิติของคุณแต่อย่างใด
          </p>
        </div>
        <p>
          คุณจะยังคงได้รับค่าตอบแทนตามจำนวนงานที่ทำไป 
          และสามารถดูรายละเอียดการยกเลิกได้ในหน้างาน
        </p>
      </div>
    ),
  },
  {
    id: "preview-before-claim",
    question: "Preview งานก่อนจองดียังไง?",
    category: "worker",
    answer: (
      <div className="space-y-3">
        <p>
          ฟีเจอร์ Preview ช่วยให้คุณดูรายละเอียดครบถ้วนก่อนตัดสินใจจอง:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>ราคา:</strong> รู้ว่าจะได้เงินเท่าไหร่</li>
          <li><strong>จำนวนงาน:</strong> รู้ว่าต้องทำเท่าไหร่</li>
          <li><strong>Deadline:</strong> เช็คว่ามีเวลาพอหรือไม่</li>
          <li><strong>คำแนะนำ:</strong> อ่านวิธีทำก่อนจอง</li>
        </ul>
        <div className="p-3 bg-brand-info/5 border border-brand-info/20 rounded-lg">
          <p className="text-sm">
            <strong>💡 ประโยชน์:</strong> ไม่ต้องจองแล้วค่อยดู 
            ลดโอกาสจองงานที่ไม่เหมาะกับตัวเอง
          </p>
        </div>
      </div>
    ),
  },
];

function FAQAccordion({ faq }: { faq: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-brand-border/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-brand-bg transition-colors text-left"
      >
        <span className="font-medium text-brand-text-dark pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-brand-text-light transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-sm text-brand-text-light leading-relaxed animate-fade-in">
          {typeof faq.answer === "string" ? <p>{faq.answer}</p> : faq.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFAQs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="p-4 bg-brand-warning/10 rounded-2xl w-fit mx-auto mb-4">
            <HelpCircle className="w-12 h-12 text-brand-warning" />
          </div>
          <h1 className="text-4xl font-bold text-brand-text-dark mb-4">
            คำถามที่พบบ่อย (FAQ)
          </h1>
          <p className="text-lg text-brand-text-light">
            รวมคำตอบคำถามที่ถูกถามบ่อยที่สุด
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-brand-primary text-white"
                : "bg-brand-bg text-brand-text-light hover:bg-brand-bg-dark"
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setSelectedCategory("seller")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "seller"
                ? "bg-brand-primary text-white"
                : "bg-brand-bg text-brand-text-light hover:bg-brand-bg-dark"
            }`}
          >
            Seller
          </button>
          <button
            onClick={() => setSelectedCategory("worker")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "worker"
                ? "bg-brand-success text-white"
                : "bg-brand-bg text-brand-text-light hover:bg-brand-bg-dark"
            }`}
          >
            Worker
          </button>
          <button
            onClick={() => setSelectedCategory("general")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "general"
                ? "bg-brand-info text-white"
                : "bg-brand-bg text-brand-text-light hover:bg-brand-bg-dark"
            }`}
          >
            ทั่วไป
          </button>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((faq) => (
            <FAQAccordion key={faq.id} faq={faq} />
          ))}
        </div>

        {/* Still Have Questions */}
        <Card className="p-8 mt-12 border-none bg-gradient-to-r from-brand-primary/5 to-brand-primary/10 text-center">
          <h3 className="text-xl font-bold text-brand-text-dark mb-2">
            ยังมีคำถาม?
          </h3>
          <p className="text-brand-text-light mb-4">
            ลองค้นหาในคู่มือการใช้งาน หรือติดต่อทีมสนับสนุน
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/help" className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors">
              ดูคู่มือทั้งหมด
            </a>
          </div>
        </Card>
      </Section>
    </Container>
  );
}
