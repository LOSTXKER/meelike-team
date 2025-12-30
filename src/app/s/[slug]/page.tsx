"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Button, Badge, Avatar, Input } from "@/components/ui";
import { ServiceTypeBadge, PlatformIcon } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import { mockSeller, mockServices } from "@/lib/mock-data";
import type { Platform } from "@/types";
import {
  Star,
  ShoppingBag,
  MessageCircle,
  Clock,
  Zap,
  Users,
  Search,
  Store,
  Flame,
} from "lucide-react";

type ServiceFilter = "all" | "facebook" | "instagram" | "tiktok" | "youtube";

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;

  // Mock: Use mockSeller data
  const store = mockSeller;
  const services = mockServices;

  const [filter, setFilter] = useState<ServiceFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    if (!service.isActive) return false;
    if (filter !== "all" && service.category !== filter) return false;
    if (searchQuery) {
      return service.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const categories: { value: ServiceFilter; label: string }[] = [
    { value: "all", label: "ทั้งหมด" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
  ];

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="bg-brand-surface border-b border-brand-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Store className="w-6 h-6 text-brand-primary" />
            <span className="font-bold text-brand-text-dark">MeeLike</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" leftIcon={<MessageCircle className="w-4 h-4" />}>
              ติดต่อ
            </Button>
            <Link href={`/s/${slug}/cart`}>
              <Button size="sm" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                ตะกร้า
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Store Header */}
        <Card className="bg-gradient-to-br from-brand-secondary/20 to-brand-accent/10 border border-brand-border">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar fallback={store.storeName} size="xl" />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
                <Store className="w-7 h-7 text-brand-primary" />
                {store.storeName}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm">
                <span className="flex items-center gap-1 text-brand-warning">
                  <Star className="w-4 h-4" />
                  {store.rating} ({store.ratingCount} รีวิว)
                </span>
                <span className="text-brand-text-light">|</span>
                <span className="flex items-center gap-1 text-brand-text-light">
                  <ShoppingBag className="w-4 h-4" />
                  {store.totalOrders.toLocaleString()} ออเดอร์
                </span>
                {store.isVerified && (
                  <>
                    <span className="text-brand-text-light">|</span>
                    <Badge variant="success" size="sm">
                      ✓ ยืนยันแล้ว
                    </Badge>
                  </>
                )}
              </div>
              <p className="mt-3 text-brand-text-light">{store.bio}</p>
              <p className="mt-2 text-sm text-brand-primary">
                LINE: {store.lineId}
              </p>
            </div>
          </div>
        </Card>

        {/* Flash Sale (Mock) */}
        <Card variant="bordered" className="bg-brand-error/5 border-brand-error/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-error" />
              <span className="font-bold text-brand-error">Flash Sale</span>
            </div>
            <div className="flex items-center gap-2 text-brand-error">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">หมดใน 2:30:00</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="text-center p-3 rounded-lg bg-brand-surface"
              >
                <p className="font-bold text-brand-primary mt-2">
                  {formatCurrency(service.sellPrice * 0.8)}
                </p>
                <p className="text-xs text-brand-text-light line-through">
                  {formatCurrency(service.sellPrice)}
                </p>
                <Badge variant="error" size="sm" className="mt-1">
                  -20%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex border-b border-brand-border">
          <Link
            href={`/s/${slug}`}
            className="px-6 py-3 font-medium text-brand-primary border-b-2 border-brand-primary"
          >
            บริการ
          </Link>
          <Link
            href={`/s/${slug}/reviews`}
            className="px-6 py-3 font-medium text-brand-text-light hover:text-brand-text-dark"
          >
            <Star className="w-4 h-4" />
            รีวิว
          </Link>
        </div>

        {/* Filter & Search */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat.value
                    ? "bg-brand-primary text-white"
                    : "bg-brand-surface border border-brand-border text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <Input
            placeholder="ค้นหาบริการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Services */}
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Card key={service.id} variant="bordered">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div>
                    <h3 className="font-semibold text-brand-text-dark">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <ServiceTypeBadge type={service.serviceType} />
                    </div>
                    {service.description && (
                      <p className="text-sm text-brand-text-light mt-2">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-brand-text-light">
                      <span>
                        ขั้นต่ำ {service.minQuantity} | สูงสุด{" "}
                        {service.maxQuantity.toLocaleString()}
                      </span>
                      {service.estimatedTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-brand-primary">
                    {formatCurrency(service.sellPrice)}
                  </p>
                  <p className="text-xs text-brand-text-light">
                    /{service.type === "view" ? "view" : "หน่วย"}
                  </p>
                  <Link href={`/s/${slug}/order?service=${service.id}`}>
                    <Button size="sm" className="mt-3">
                      สั่งซื้อ
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card variant="bordered" className="text-center py-12">
            <p className="text-brand-text-light">ไม่พบบริการที่ค้นหา</p>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-brand-surface border-t border-brand-border mt-12 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-brand-text-light">
            © 2024 {store.storeName} • Powered by MeeLike Seller
          </p>
        </div>
      </footer>
    </div>
  );
}

