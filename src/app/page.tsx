"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import {
  Zap,
  Shield,
  ArrowRight,
  Users,
  CheckCircle2,
  Smartphone,
  Wallet,
  Clock,
  Target,
  UserCheck,
  CreditCard,
  TrendingUp,
  Heart,
  MessageCircle,
  UserPlus,
  Play,
  Share2,
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
              <a href="#how-it-works" className="text-sm text-brand-text-light hover:text-brand-primary transition-colors">
                วิธีการทำงาน
              </a>
              <a href="#for-who" className="text-sm text-brand-text-light hover:text-brand-primary transition-colors">
                เหมาะกับใคร
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
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-success/10 border border-brand-success/20 text-sm mb-6">
              <UserCheck className="w-4 h-4 text-brand-success" />
              <span className="text-brand-text-dark font-medium">คนจริง ไม่ใช่บอท</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              แพลตฟอร์ม Crowdsourcing
              <br />
              <span className="text-brand-primary">สำหรับงาน Social Media</span>
            </h1>
            
            <p className="mt-6 text-lg text-brand-text-light max-w-3xl mx-auto leading-relaxed">
              เชื่อมโยง <strong className="text-brand-text-dark">ผู้จ้างงาน (Sellers)</strong> กับ <strong className="text-brand-text-dark">คนทำงานอิสระ (Workers)</strong> 
              <br className="hidden sm:block" />
              เพื่อทำกิจกรรมบนโซเชียลมีเดียด้วย<strong className="text-brand-primary">คนจริง</strong>ผ่านอุปกรณ์ส่วนตัว
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?role=seller">
                <Button 
                  size="lg" 
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  สมัครเป็นผู้จ้างงาน
                </Button>
              </Link>
              <Link href="/register?role=worker">
                <Button size="lg" variant="outline">
                  สมัครเป็นคนรับงาน
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - Clear Definition */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold">MeeLike ทำอะไร?</h2>
            </div>

            <div className="bg-brand-bg rounded-2xl border border-brand-border p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left - Services */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-primary" />
                    บริการที่รับทำ
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: <Heart className="w-4 h-4" />, label: "กดไลค์โพสต์", platforms: "Facebook, Instagram, TikTok" },
                      { icon: <MessageCircle className="w-4 h-4" />, label: "คอมเมนต์", platforms: "ทุกแพลตฟอร์ม" },
                      { icon: <UserPlus className="w-4 h-4" />, label: "ติดตาม/Follow", platforms: "IG, TikTok, YouTube" },
                      { icon: <Play className="w-4 h-4" />, label: "เพิ่มยอดวิว", platforms: "YouTube, TikTok" },
                      { icon: <Share2 className="w-4 h-4" />, label: "แชร์โพสต์", platforms: "Facebook" },
                    ].map((service, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-brand-surface rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                          {service.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{service.label}</div>
                          <div className="text-xs text-brand-text-light">{service.platforms}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right - Key Points */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-success" />
                    จุดเด่นของเรา
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "คนจริง 100%",
                        desc: "ทุกงานทำโดยคนจริงที่ยืนยันตัวตนแล้ว ใช้โทรศัพท์ส่วนตัวกดเอง ไม่ใช่บอท",
                        color: "text-brand-success",
                        bg: "bg-brand-success/10",
                      },
                      {
                        title: "ระบบตรวจสอบอัตโนมัติ",
                        desc: "มีระบบยืนยันว่างานสำเร็จจริงก่อนจ่ายเงิน",
                        color: "text-brand-info",
                        bg: "bg-brand-info/10",
                      },
                      {
                        title: "จ่ายตามผลงาน",
                        desc: "Seller จ่ายเฉพาะงานที่เสร็จ Worker ได้เงินทันทีเมื่องานผ่าน",
                        color: "text-brand-accent",
                        bg: "bg-brand-accent/10",
                      },
                    ].map((point, i) => (
                      <div key={i} className="flex gap-3">
                        <div className={`w-10 h-10 rounded-xl ${point.bg} ${point.color} flex items-center justify-center flex-shrink-0`}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{point.title}</div>
                          <div className="text-xs text-brand-text-light">{point.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Example Flow */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold">วิธีการทำงาน</h2>
            <p className="mt-3 text-brand-text-light">
              ตัวอย่าง: Seller ต้องการ 100 ไลค์สำหรับโพสต์ Facebook
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Flow Diagram */}
            <div className="grid lg:grid-cols-4 gap-4 mb-12">
              {[
                {
                  step: "1",
                  role: "Seller",
                  title: "สร้างงาน",
                  desc: "Seller สร้างงานในระบบ ระบุว่าต้องการ 100 ไลค์ และใส่ลิงก์โพสต์",
                  icon: <Target className="w-6 h-6" />,
                  color: "bg-brand-primary",
                },
                {
                  step: "2",
                  role: "Worker",
                  title: "รับงาน",
                  desc: "Worker ที่ยืนยันตัวตนแล้ว กดรับงานผ่านแอป",
                  icon: <Smartphone className="w-6 h-6" />,
                  color: "bg-brand-accent",
                },
                {
                  step: "3",
                  role: "Worker",
                  title: "ทำงานจริง",
                  desc: "ใช้โทรศัพท์ตัวเองเข้า Facebook แล้วกดไลค์โพสต์นั้นจริงๆ",
                  icon: <Heart className="w-6 h-6" />,
                  color: "bg-brand-error",
                },
                {
                  step: "4",
                  role: "ระบบ",
                  title: "ตรวจสอบ & จ่ายเงิน",
                  desc: "ระบบตรวจว่างานสำเร็จ → ตัดเครดิต Seller → จ่าย Worker",
                  icon: <Wallet className="w-6 h-6" />,
                  color: "bg-brand-success",
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-brand-border" />
                  )}
                  <div className="relative bg-brand-surface rounded-2xl p-5 border border-brand-border h-full">
                    <div className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center mb-3`}>
                      {item.icon}
                    </div>
                    <div className="text-xs font-medium text-brand-text-light mb-1">{item.role}</div>
                    <h3 className="font-bold mb-2">{item.step}. {item.title}</h3>
                    <p className="text-sm text-brand-text-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Result Box */}
            <div className="bg-brand-success/10 border border-brand-success/30 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-brand-success" />
                <span className="font-bold text-lg">ผลลัพธ์</span>
              </div>
              <p className="text-brand-text-dark">
                <strong>Seller</strong> ได้ไลค์จากคนจริง 100 คน • <strong>Worker</strong> ได้ค่าตอบแทนทันที
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Who */}
      <section id="for-who" className="py-20 bg-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold">เหมาะกับใคร?</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Sellers */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                  <Target className="w-7 h-7 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">สำหรับ Seller (ผู้จ้างงาน)</h3>
                  <p className="text-sm text-brand-text-light">หัวหน้าทีม / เจ้าของธุรกิจ</p>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {[
                  "เจ้าของร้านค้าออนไลน์ที่ต้องการเพิ่ม Engagement",
                  "Agency รับทำการตลาด Social Media",
                  "Influencer ที่ต้องการเพิ่มยอด",
                  "ธุรกิจที่ต้องการโปรโมทสินค้า/บริการ",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-brand-bg rounded-xl p-4">
                <div className="text-sm font-medium mb-2">สิ่งที่ได้รับ:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-primary" />
                    <span>Engagement จากคนจริง</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-primary" />
                    <span>ส่งมอบรวดเร็ว</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-primary" />
                    <span>ไม่โดนแบน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-primary" />
                    <span>รายงานผลงานชัดเจน</span>
                  </div>
                </div>
              </div>

              <Link href="/register?role=seller" className="block mt-6">
                <Button className="w-full">สมัครเป็น Seller</Button>
              </Link>
            </div>

            {/* For Workers */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-brand-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">สำหรับ Worker (คนรับงาน)</h3>
                  <p className="text-sm text-brand-text-light">ลูกทีม / Freelancer</p>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {[
                  "นักศึกษาที่ต้องการหารายได้เสริม",
                  "แม่บ้าน/ผู้ที่มีเวลาว่าง",
                  "คนที่ต้องการทำงานจากที่ไหนก็ได้",
                  "ผู้ที่ต้องการรายได้เพิ่มจากมือถือ",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-brand-bg rounded-xl p-4">
                <div className="text-sm font-medium mb-2">สิ่งที่ได้รับ:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-brand-accent" />
                    <span>รายได้ทุกวัน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-accent" />
                    <span>ทำเวลาไหนก็ได้</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-brand-accent" />
                    <span>ใช้แค่มือถือ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand-accent" />
                    <span>ถอนเงินได้ทุกวัน</span>
                  </div>
                </div>
              </div>

              <Link href="/register?role=worker" className="block mt-6">
                <Button variant="outline" className="w-full border-brand-accent text-brand-accent hover:bg-brand-accent/10">
                  สมัครเป็น Worker
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold">ราคาค่าบริการ</h2>
            <p className="mt-3 text-brand-text-light">
              ราคาเริ่มต้นสำหรับงานคนจริง
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { service: "Facebook Like", price: "0.40-0.60", unit: "บาท/ไลค์" },
              { service: "Instagram Follow", price: "0.50-0.80", unit: "บาท/คน" },
              { service: "TikTok Like", price: "0.30-0.50", unit: "บาท/ไลค์" },
              { service: "YouTube View", price: "0.20-0.40", unit: "บาท/วิว" },
              { service: "Comment", price: "1.00-3.00", unit: "บาท/คอมเมนต์" },
            ].map((item, i) => (
              <div key={i} className="bg-brand-surface rounded-xl border border-brand-border p-5 text-center">
                <div className="text-sm text-brand-text-light mb-2">{item.service}</div>
                <div className="text-2xl font-bold text-brand-primary">{item.price}</div>
                <div className="text-xs text-brand-text-light">{item.unit}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-brand-text-light">
              * ราคาขึ้นอยู่กับจำนวนและความเร็วในการส่งมอบ
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Workers ที่ลงทะเบียน" },
              { value: "500+", label: "Sellers ใช้งาน" },
              { value: "1M+", label: "งานที่สำเร็จ" },
              { value: "100%", label: "คนจริงทำงาน" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl lg:text-4xl font-bold text-brand-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-brand-text-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-brand-text-light mb-8">
            สมัครฟรี ไม่มีค่าแรกเข้า เริ่มใช้งานได้ทันที
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=seller">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                สมัครเป็น Seller
              </Button>
            </Link>
            <Link href="/register?role=worker">
              <Button size="lg" variant="outline">
                สมัครเป็น Worker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-brand-text-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-xl font-bold">MeeLike</span>
              </div>
              <p className="text-gray-400 text-sm">
                แพลตฟอร์ม Crowdsourcing สำหรับงาน Social Media 
                ที่เชื่อมโยงผู้จ้างงานกับคนทำงานอิสระทั่วประเทศ
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">สำหรับ Seller</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/seller" className="hover:text-white">Seller Center</Link></li>
                <li><Link href="/seller/team" className="hover:text-white">จัดการทีม</Link></li>
                <li><Link href="/seller/services" className="hover:text-white">จัดการบริการ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">สำหรับ Worker</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/work" className="hover:text-white">รับงาน</Link></li>
                <li><Link href="/work/earnings" className="hover:text-white">รายได้</Link></li>
                <li><Link href="/work/teams" className="hover:text-white">ทีมของฉัน</Link></li>
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
