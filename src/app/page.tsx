"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import {
  Store,
  Users,
  ShoppingBag,
  TrendingUp,
  Star,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-surface/80 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-text-dark">
                MeeLike Seller
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/hub" className="hidden sm:block">
                <Button variant="ghost">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Hub
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">เข้าสู่ระบบ</Button>
              </Link>
              <Link href="/register">
                <Button>สมัครฟรี</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary-light/30 via-transparent to-brand-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text-dark leading-tight">
              แพลตฟอร์มครบวงจร
              <br />
              <span className="text-brand-primary">สำหรับธุรกิจ Social Media</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-brand-text-light">
              ขาย Bot, คนจริง, บัญชี Social Media
              <br />
              บริหารทีม ติดตามรายได้ ครบจบในที่เดียว
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  เริ่มต้นใช้งานฟรี
                </Button>
              </Link>
              <Link href="/hub">
                <Button size="lg" variant="outline">
                  <Sparkles className="w-5 h-5 mr-2" />
                  เข้า Hub ตลาดกลาง
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-text-dark">
              ทำไมต้อง MeeLike Seller?
            </h2>
            <p className="mt-4 text-brand-text-light">
              เครื่องมือครบครันสำหรับธุรกิจ Social Engagement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Store className="w-8 h-8" />,
                title: "เปิดร้านได้ทันที",
                description:
                  "สร้างหน้าร้านสวยงาม มีธีมให้เลือกหลากหลาย พร้อมรับออเดอร์ใน 5 นาที",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "บริหารทีมง่าย",
                description:
                  "ระบบจัดการทีม Worker สร้างงาน ตรวจงาน จ่ายเงิน ครบในที่เดียว",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Bot + คนจริง",
                description:
                  "เลือกขายได้ทั้ง Bot (เร็ว ราคาถูก) และคนจริง (คุณภาพสูง)",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "ติดตามรายได้",
                description:
                  "Dashboard แสดงสถิติ รายได้ กำไร ออเดอร์ แบบ Real-time",
              },
              {
                icon: <ShoppingBag className="w-8 h-8" />,
                title: "ระบบออเดอร์อัตโนมัติ",
                description:
                  "ลูกค้าสั่ง ระบบแจ้งเตือน Bot ส่งอัตโนมัติ ติดตามสถานะได้",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "ปลอดภัย มั่นใจ",
                description:
                  "ระบบ Escrow จัดการเงิน Worker ได้เงินเมื่องานผ่าน Seller มั่นใจ",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-brand-bg border border-brand-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-brand-text-dark">
                  {feature.title}
                </h3>
                <p className="mt-2 text-brand-text-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Seller / For Worker */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Seller */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-secondary-light/30 to-brand-secondary-light/10 border border-brand-border">
              <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mb-6">
                <Store className="w-8 h-8 text-brand-text-dark" />
              </div>
              <h3 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
                <Store className="w-7 h-7 text-brand-primary" />
                สำหรับ Seller (แม่ทีม)
              </h3>
              <ul className="mt-6 space-y-3">
                {[
                  "เปิดร้านขายบริการปั้มยอด",
                  "ขายได้ทั้ง Bot และคนจริง",
                  "สร้างและบริหารทีม Worker",
                  "ติดตามรายได้ กำไร แบบ Real-time",
                  "ระบบจ่ายเงินลูกทีมอัตโนมัติ",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-success/20 text-brand-success flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-brand-text-dark">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?role=seller" className="inline-block mt-8">
                <Button size="lg">สมัครเป็น Seller</Button>
              </Link>
            </div>

            {/* Worker */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 border border-brand-accent/30">
              <div className="w-16 h-16 rounded-full bg-brand-accent flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
                <Users className="w-7 h-7 text-brand-info" />
                สำหรับ Worker (ลูกทีม)
              </h3>
              <ul className="mt-6 space-y-3">
                {[
                  "หารายได้จากการกดไลค์ เม้น ฟอล",
                  "เข้าร่วมได้หลายทีมพร้อมกัน",
                  "เลือกรับงานที่อยากทำ",
                  "ถอนเงินได้ทุกวัน",
                  "สะสม Level รับ Bonus เพิ่ม",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-success/20 text-brand-success flex items-center justify-center text-sm">
                      ✓
                    </span>
                    <span className="text-brand-text-dark">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?role=worker" className="inline-block mt-8">
                <Button size="lg" className="bg-brand-accent hover:bg-brand-accent/90">
                  สมัครเป็น Worker
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-text-dark">
              แพ็คเกจ Seller
            </h2>
            <p className="mt-4 text-brand-text-light">
              เริ่มต้นฟรี อัปเกรดเมื่อพร้อม
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Free",
                price: "฿0",
                period: "/เดือน",
                features: ["30 Bot Orders/เดือน", "ไม่มีทีม", "Analytics พื้นฐาน"],
                popular: false,
              },
              {
                name: "Starter",
                price: "฿149",
                period: "/เดือน",
                features: [
                  "200 Bot Orders/เดือน",
                  "ทีม 20 คน",
                  "30 งาน/เดือน",
                  "Analytics พื้นฐาน",
                ],
                popular: false,
              },
              {
                name: "Pro",
                price: "฿399",
                period: "/เดือน",
                features: [
                  "Bot Orders ไม่จำกัด",
                  "ทีม 100 คน",
                  "งานไม่จำกัด",
                  "Analytics Pro",
                ],
                popular: true,
              },
              {
                name: "Business",
                price: "฿799",
                period: "/เดือน",
                features: [
                  "ทุกอย่างใน Pro",
                  "ทีมไม่จำกัด",
                  "API Access",
                  "Priority Support",
                ],
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-xl border ${
                  plan.popular
                    ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary"
                    : "border-brand-border bg-brand-bg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-primary text-white text-sm font-medium rounded-full">
                    แนะนำ
                  </div>
                )}
                <h3 className="text-lg font-semibold text-brand-text-dark">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-brand-text-dark">
                    {plan.price}
                  </span>
                  <span className="text-brand-text-light">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-brand-primary" />
                      <span className="text-brand-text-dark">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6"
                  variant={plan.popular ? "primary" : "outline"}
                >
                  เลือกแพ็คนี้
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-brand-text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-primary" />
              </div>
              <span className="text-xl font-bold text-white">MeeLike Seller</span>
            </div>
            <p className="text-brand-text-light text-sm">
              © 2024 MeeLike. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
