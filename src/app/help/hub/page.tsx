"use client";

import { Card } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { Building2, Search, Megaphone, UserPlus, FileCheck } from "lucide-react";

export default function HubGuidePage() {
  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="p-4 bg-brand-info/10 rounded-2xl w-fit mx-auto mb-4">
            <Building2 className="w-12 h-12 text-brand-info" />
          </div>
          <h1 className="text-4xl font-bold text-brand-text-dark mb-4">
            คู่มือ Hub
          </h1>
          <p className="text-lg text-brand-text-light">
            ศูนย์กลางหาทีมและรับสมัครคน
          </p>
        </div>

        {/* What is Hub */}
        <Card className="p-8 mb-12 border-none bg-gradient-to-r from-brand-info/5 to-brand-info/10 shadow-lg">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-4">
            Hub คืออะไร?
          </h2>
          <p className="text-brand-text-light leading-relaxed mb-4">
            Hub คือศูนย์กลางที่เชื่อมโยง Seller กับ Worker เข้าด้วยกัน
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-bold text-brand-text-dark mb-2">สำหรับ Seller:</h4>
              <p className="text-sm text-brand-text-light">
                โพสต์หาคนเข้าทีม ประกาศรับสมัคร และหา Worker ที่เหมาะสม
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-bold text-brand-text-dark mb-2">สำหรับ Worker:</h4>
              <p className="text-sm text-brand-text-light">
                ค้นหาทีมที่น่าสนใจ สมัครเข้าร่วม และเริ่มรับงาน
              </p>
            </div>
          </div>
        </Card>

        {/* For Workers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <Search className="w-7 h-7 text-brand-success" />
            สำหรับ Worker: การหาทีม
          </h2>
          <Card className="p-6 border-none shadow-lg">
            <div className="space-y-6">
              <p className="text-brand-text-light leading-relaxed">
                วิธีหาทีมที่เหมาะกับคุณและเข้าร่วม
              </p>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">ขั้นตอน:</h4>
                <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                  <li>ไปที่เมนู "Hub"</li>
                  <li>เลือก "หาทีม"</li>
                  <li>ดูประกาศของทีมต่างๆ</li>
                  <li>เลือกทีมที่สนใจ</li>
                  <li>คลิก "สมัครเข้าทีม"</li>
                  <li>รอการอนุมัติจาก Seller</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">สิ่งที่ควรดู:</h4>
                <ul className="list-disc list-inside space-y-2 text-brand-text-light">
                  <li>ประเภทงานที่ทีมรับ</li>
                  <li>อัตราค่าจ้าง</li>
                  <li>คะแนนและรีวิวทีม</li>
                  <li>จำนวนสมาชิก</li>
                </ul>
              </div>

              <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-lg">
                <p className="text-sm text-brand-text-dark">
                  <strong>💡 Tips:</strong> สมัครหลายทีมได้ เพิ่มโอกาสรับงาน
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* For Sellers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <Megaphone className="w-7 h-7 text-brand-primary" />
            สำหรับ Seller: การโพสต์หาคน
          </h2>
          <Card className="p-6 border-none shadow-lg">
            <div className="space-y-6">
              <p className="text-brand-text-light leading-relaxed">
                วิธีโพสต์ประกาศรับสมัครคนเข้าทีม
              </p>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">ขั้นตอนโพสต์:</h4>
                <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                  <li>ไปที่เมนู "Hub"</li>
                  <li>เลือก "รับสมัครคน"</li>
                  <li>กรอกข้อมูล:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>ประเภทงาน</li>
                      <li>จำนวนคนที่ต้องการ</li>
                      <li>คุณสมบัติ</li>
                      <li>อัตราค่าจ้าง</li>
                    </ul>
                  </li>
                  <li>คลิก "โพสต์"</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-brand-text-dark mb-2">การดูใบสมัคร:</h4>
                <ol className="list-decimal list-inside space-y-2 text-brand-text-light">
                  <li>ไปที่ "Hub" → "ใบสมัครของฉัน"</li>
                  <li>ดูรายชื่อผู้สมัคร</li>
                  <li>ดูโปรไฟล์และคะแนน</li>
                  <li>อนุมัติหรือปฏิเสธ</li>
                </ol>
              </div>

              <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
                <p className="text-sm text-brand-text-dark">
                  <strong>💡 Tips:</strong> ระบุอัตราค่าจ้างที่ชัดเจน จะได้คนสมัครมากขึ้น
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6">
            ประโยชน์ของ Hub
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-3 bg-brand-success/10 rounded-lg w-fit mb-4">
                <UserPlus className="w-6 h-6 text-brand-success" />
              </div>
              <h4 className="font-bold text-brand-text-dark mb-2">
                หาคนได้ง่าย
              </h4>
              <p className="text-sm text-brand-text-light">
                Worker หลายคนมาดูประกาศในที่เดียว ไม่ต้องหาเอง
              </p>
            </Card>

            <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-3 bg-brand-info/10 rounded-lg w-fit mb-4">
                <FileCheck className="w-6 h-6 text-brand-info" />
              </div>
              <h4 className="font-bold text-brand-text-dark mb-2">
                เลือกได้เอง
              </h4>
              <p className="text-sm text-brand-text-light">
                ดูโปรไฟล์และคะแนนก่อนตัดสินใจรับเข้าทีม
              </p>
            </Card>

            <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-3 bg-brand-primary/10 rounded-lg w-fit mb-4">
                <Building2 className="w-6 h-6 text-brand-primary" />
              </div>
              <h4 className="font-bold text-brand-text-dark mb-2">
                สร้างทีมแข็งแรง
              </h4>
              <p className="text-sm text-brand-text-light">
                รวมคนที่มีคุณภาพเข้าทีม เพิ่มประสิทธิภาพการทำงาน
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </Container>
  );
}
