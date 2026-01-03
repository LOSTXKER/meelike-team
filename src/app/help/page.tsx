"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import {
  Search,
  Users,
  Briefcase,
  Building2,
  HelpCircle,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react";
import { searchArticles, getArticlesByCategory, type HelpArticle } from "@/lib/constants/help-content";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setSearchResults(searchArticles(query));
    } else {
      setSearchResults([]);
    }
  };

  const popularArticles = [
    { id: "job-cancel", icon: Star },
    { id: "worker-claim", icon: Users },
    { id: "payment-payout", icon: TrendingUp },
    { id: "team-create", icon: Building2 },
  ];

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-brand-text-dark mb-4">
            ยินดีต้อนรับสู่ศูนย์ช่วยเหลือ
          </h1>
          <p className="text-lg text-brand-text-light">
            ค้นหาคำตอบและเรียนรู้วิธีใช้งาน MeeLike Seller
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
            <input
              type="text"
              placeholder="ค้นหาคู่มือ... เช่น การยกเลิกงาน, การจองงาน"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-brand-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-text-dark"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 bg-white rounded-xl shadow-lg border border-brand-border/20 divide-y divide-brand-border/10">
              {searchResults.map((article) => (
                <Link
                  key={article.id}
                  href={`/help/${article.category}#${article.id}`}
                  className="block p-4 hover:bg-brand-bg transition-colors"
                >
                  <div className="font-medium text-brand-text-dark mb-1">
                    {article.title}
                  </div>
                  <div className="text-sm text-brand-text-light">
                    {article.category === "seller" && "Seller Guide"}
                    {article.category === "worker" && "Worker Guide"}
                    {article.category === "hub" && "Hub Guide"}
                    {article.category === "general" && "General"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Main Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Seller */}
          <Link href="/help/seller">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer group border-none bg-gradient-to-br from-white to-brand-primary/5">
              <div className="p-4 bg-brand-primary/10 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                คู่มือ Seller
              </h3>
              <p className="text-brand-text-light mb-4">
                เรียนรู้การสร้างทีม รับออเดอร์ และจัดการงาน
              </p>
              <div className="flex items-center text-brand-primary font-medium">
                <span>ดูคู่มือ</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Worker */}
          <Link href="/help/worker">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer group border-none bg-gradient-to-br from-white to-brand-success/5">
              <div className="p-4 bg-brand-success/10 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-brand-success" />
              </div>
              <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                คู่มือ Worker
              </h3>
              <p className="text-brand-text-light mb-4">
                วิธีการหาทีม จองงาน และรับเงิน
              </p>
              <div className="flex items-center text-brand-success font-medium">
                <span>ดูคู่มือ</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Hub */}
          <Link href="/help/hub">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer group border-none bg-gradient-to-br from-white to-brand-info/5">
              <div className="p-4 bg-brand-info/10 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-brand-info" />
              </div>
              <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                คู่มือ Hub
              </h3>
              <p className="text-brand-text-light mb-4">
                ศูนย์กลางหาทีมและรับสมัครคน
              </p>
              <div className="flex items-center text-brand-info font-medium">
                <span>ดูคู่มือ</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-text-dark mb-6 flex items-center gap-3">
            <Star className="w-6 h-6 text-brand-warning" />
            บทความยอดนิยม
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularArticles.map(({ id, icon: Icon }) => {
              const article = getArticlesByCategory("seller").find((a) => a.id === id) ||
                getArticlesByCategory("worker").find((a) => a.id === id);
              if (!article) return null;

              return (
                <Link
                  key={id}
                  href={`/help/${article.category}#${id}`}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-brand-border/20 hover:shadow-lg transition-all group"
                >
                  <div className="p-2 bg-brand-bg rounded-lg group-hover:bg-brand-primary/10 transition-colors">
                    <Icon className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-brand-text-dark mb-1 group-hover:text-brand-primary transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-sm text-brand-text-light">
                      {article.category === "seller" && "Seller Guide"}
                      {article.category === "worker" && "Worker Guide"}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-text-light group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* FAQ Link */}
        <Link href="/help/faq">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group border-none bg-gradient-to-r from-brand-warning/10 to-brand-warning/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-warning/20 rounded-xl">
                  <HelpCircle className="w-6 h-6 text-brand-warning" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-dark mb-1">
                    คำถามที่พบบ่อย (FAQ)
                  </h3>
                  <p className="text-sm text-brand-text-light">
                    รวมคำตอบคำถามที่ถูกถามบ่อยที่สุด
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-warning group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </Section>
    </Container>
  );
}
