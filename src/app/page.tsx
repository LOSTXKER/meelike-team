"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import {
  Zap,
  Shield,
  ArrowRight,
  BarChart3,
  Users,
  Globe,
  CheckCircle2,
  Clock,
  CreditCard,
  Headphones,
  Store,
  TrendingUp,
  Lock,
  FileCheck,
  ChevronRight,
  Layers,
  RefreshCw,
  Wallet,
  UserCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-surface/95 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-text-dark">
                MeeLike
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm text-brand-text-light hover:text-brand-primary transition-colors">
                บริการ
              </a>
              <a href="#how-it-works" className="text-sm text-brand-text-light hover:text-brand-primary transition-colors">
                วิธีการทำงาน
              </a>
              <a href="#pricing" className="text-sm text-brand-text-light hover:text-brand-primary transition-colors">
                ราคา
              </a>
            </nav>
            <div className="flex items-center gap-3">
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
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-light/40 via-transparent to-brand-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-sm mb-6">
              <span className="w-2 h-2 bg-brand-success rounded-full" />
              <span className="text-brand-text-light">ให้บริการ Agency กว่า 500 ราย</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              แพลตฟอร์มขายบริการ
              <br />
              <span className="text-brand-primary">โปรโมท Social Media</span>
            </h1>
            
            <p className="mt-6 text-lg text-brand-text-light max-w-2xl mx-auto leading-relaxed">
              สร้างร้านค้าออนไลน์สำหรับขายบริการเพิ่มยอด Engagement บน Social Media 
              บริหารทีมงาน รับออเดอร์ ติดตามรายได้ ครบจบในที่เดียว
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button 
                  size="lg" 
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  เปิดร้านฟรี
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  ดูรายละเอียด
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold">MeeLike คืออะไร?</h2>
            <p className="mt-3 text-brand-text-light max-w-2xl mx-auto">
              แพลตฟอร์มสำหรับเปิดร้านขายบริการโปรโมท Social Media แบบครบวงจร
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">เปิดร้านขายบริการ</h3>
              <p className="text-brand-text-light text-sm">
                สร้างหน้าร้านสำหรับขายบริการเพิ่ม Followers, Likes, Views, Comments 
                บน Facebook, Instagram, TikTok, YouTube และอื่นๆ
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-accent/20 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-brand-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">บริหารทีมงาน</h3>
              <p className="text-brand-text-light text-sm">
                สร้างทีม Freelancer มอบหมายงาน ตรวจสอบคุณภาพ 
                ระบบจ่ายค่าตอบแทนอัตโนมัติ
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-success/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-brand-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ติดตามรายได้</h3>
              <p className="text-brand-text-light text-sm">
                Dashboard แสดงยอดขาย กำไร สถิติออเดอร์ 
                รายงานการเงินแบบ Real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold">ฟีเจอร์หลัก</h2>
            <p className="mt-3 text-brand-text-light">
              เครื่องมือครบครันสำหรับดำเนินธุรกิจ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Store className="w-6 h-6" />,
                title: "Storefront",
                description: "หน้าร้านออนไลน์พร้อมใช้งาน ลูกค้าสั่งซื้อและชำระเงินได้ทันที มีธีมให้เลือกหลากหลาย",
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Service Management",
                description: "สร้างแพ็คเกจบริการ กำหนดราคา จำนวน และระยะเวลาส่งมอบ รองรับหลาย Platform",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Management",
                description: "สร้างทีมงาน มอบหมายงาน ติดตามความคืบหน้า ระบบ QC ตรวจสอบคุณภาพ",
              },
              {
                icon: <RefreshCw className="w-6 h-6" />,
                title: "Order Automation",
                description: "ระบบจัดการออเดอร์อัตโนมัติ แจ้งเตือนทันที ติดตามสถานะ ส่งมอบงานตรงเวลา",
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: "Payment & Payout",
                description: "รับชำระผ่าน PromptPay, บัตรเครดิต จ่ายค่าตอบแทนทีมงานอัตโนมัติ",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Analytics",
                description: "Dashboard รายงานยอดขาย กำไร ลูกค้า ประสิทธิภาพทีมงาน แบบ Real-time",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-brand-surface border border-brand-border hover:shadow-md hover:border-brand-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-brand-text-light leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold">วิธีการทำงาน</h2>
            <p className="mt-3 text-brand-text-light">
              เริ่มต้นขายบริการได้ใน 4 ขั้นตอน
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "สมัครและสร้างร้าน",
                description: "ลงทะเบียนฟรี ตั้งชื่อร้าน เลือกธีม พร้อมเปิดขายได้ทันที",
              },
              {
                step: "2",
                title: "เพิ่มบริการ",
                description: "สร้างแพ็คเกจบริการ เช่น เพิ่ม Followers, Likes กำหนดราคาและจำนวน",
              },
              {
                step: "3",
                title: "รับออเดอร์",
                description: "ลูกค้าสั่งซื้อผ่านหน้าร้าน ระบบแจ้งเตือนและสร้างงานอัตโนมัติ",
              },
              {
                step: "4",
                title: "ส่งมอบและรับเงิน",
                description: "ทีมงานทำงาน ส่งมอบลูกค้า รับเงินเข้ากระเป๋า ถอนได้ทุกวัน",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-brand-border" />
                )}
                <div className="relative bg-brand-surface rounded-2xl p-6 border border-brand-border">
                  <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-text-light">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">
                เหมาะกับใคร?
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    icon: <Store className="w-5 h-5" />,
                    title: "เจ้าของธุรกิจบริการ SMM",
                    description: "มีลูกค้าประจำ ต้องการระบบจัดการออเดอร์และทีมงานที่เป็นระเบียบ",
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    title: "Agency / แม่ทีม",
                    description: "บริหารทีม Freelancer หลายคน ต้องการระบบกระจายงานและจ่ายเงินอัตโนมัติ",
                  },
                  {
                    icon: <UserCheck className="w-5 h-5" />,
                    title: "Reseller",
                    description: "ซื้อบริการต้นทุนถูก ขายต่อให้ลูกค้า ต้องการหน้าร้านเป็นของตัวเอง",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-brand-surface border border-brand-border">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-brand-text-light mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6">
              <div className="text-sm text-brand-text-light mb-2">Dashboard Preview</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-brand-bg rounded-xl">
                  <div>
                    <div className="text-sm text-brand-text-light">รายได้วันนี้</div>
                    <div className="text-2xl font-bold">฿8,450</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-brand-success/10 text-brand-success text-sm font-medium">
                    +18%
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-brand-bg rounded-xl text-center">
                    <div className="text-xs text-brand-text-light">ออเดอร์</div>
                    <div className="text-lg font-bold">42</div>
                  </div>
                  <div className="p-3 bg-brand-bg rounded-xl text-center">
                    <div className="text-xs text-brand-text-light">ทีมงาน</div>
                    <div className="text-lg font-bold">12</div>
                  </div>
                  <div className="p-3 bg-brand-bg rounded-xl text-center">
                    <div className="text-xs text-brand-text-light">สำเร็จ</div>
                    <div className="text-lg font-bold">98%</div>
                  </div>
                </div>

                <div className="h-24 flex items-end gap-1">
                  {[35, 50, 45, 70, 55, 85, 65, 90, 75, 60, 80, 70].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-brand-primary/20 rounded-t"
                      style={{ height: `${h}%` }}
                    >
                      <div 
                        className="w-full bg-brand-primary rounded-t"
                        style={{ height: `${Math.random() * 40 + 30}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold">แพ็คเกจราคา</h2>
            <p className="mt-3 text-brand-text-light">
              เริ่มต้นฟรี ไม่มีค่าแรกเข้า
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "฿0",
                period: "/เดือน",
                description: "เริ่มต้นทดลองใช้",
                features: [
                  "หน้าร้านออนไลน์ 1 ร้าน",
                  "30 ออเดอร์/เดือน",
                  "ไม่มีทีมงาน",
                  "รายงานพื้นฐาน",
                ],
                popular: false,
              },
              {
                name: "Pro",
                price: "฿399",
                period: "/เดือน",
                description: "สำหรับธุรกิจที่กำลังโต",
                features: [
                  "ออเดอร์ไม่จำกัด",
                  "ทีมงานสูงสุด 100 คน",
                  "Analytics ขั้นสูง",
                  "API Access",
                  "Priority Support",
                ],
                popular: true,
              },
              {
                name: "Business",
                price: "฿799",
                period: "/เดือน",
                description: "สำหรับ Agency ขนาดใหญ่",
                features: [
                  "ทุกอย่างใน Pro",
                  "ทีมงานไม่จำกัด",
                  "หลายร้านค้า",
                  "White-label",
                  "Dedicated Support",
                ],
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-2xl border transition-all ${
                  plan.popular
                    ? "bg-brand-surface border-brand-primary shadow-lg scale-105"
                    : "bg-brand-surface border-brand-border hover:border-brand-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-primary text-white text-sm font-medium rounded-full">
                    แนะนำ
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-brand-text-light mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-brand-text-light">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "primary" : "outline"}
                  >
                    เริ่มต้นใช้งาน
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "ปลอดภัย",
                description: "SSL Encryption",
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: "PDPA",
                description: "ตาม พ.ร.บ. คุ้มครองข้อมูล",
              },
              {
                icon: <CreditCard className="w-6 h-6" />,
                title: "ชำระเงินมั่นใจ",
                description: "ผ่านธนาคารชั้นนำ",
              },
              {
                icon: <Headphones className="w-6 h-6" />,
                title: "Support",
                description: "ทีมงานพร้อมช่วยเหลือ",
              },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-brand-text-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            พร้อมเริ่มต้นธุรกิจแล้วหรือยัง?
          </h2>
          <p className="text-brand-text-light mb-8">
            สมัครฟรี ไม่ต้องใช้บัตรเครดิต เริ่มขายได้ทันที
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                เปิดร้านฟรี
              </Button>
            </Link>
            <a href="mailto:contact@meelike.co">
              <Button size="lg" variant="outline">
                ติดต่อสอบถาม
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-brand-text-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-xl font-bold">MeeLike</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                แพลตฟอร์มขายบริการโปรโมท Social Media 
                สำหรับ Agency และผู้ประกอบการที่ต้องการระบบจัดการธุรกิจครบวงจร
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">บริการ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/seller" className="hover:text-white transition-colors">Seller Center</Link></li>
                <li><Link href="/seller/team" className="hover:text-white transition-colors">Team Management</Link></li>
                <li><Link href="/hub" className="hover:text-white transition-colors">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ติดต่อ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>contact@meelike.co</li>
                <li>Line: @meelike</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2024 MeeLike. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">นโยบายความเป็นส่วนตัว</a>
              <a href="#" className="hover:text-white">ข้อกำหนดการใช้งาน</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
