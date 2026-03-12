"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Star, Search, Store } from "lucide-react";
import Link from "next/link";

interface StoreService {
  id: string;
  name: string;
  platform: string;
  serviceType: string;
  sellPrice: number;
  minQty: number;
  maxQty: number;
  isActive: boolean;
}

interface StoreReview {
  id: string;
  customerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface PublicStore {
  id: string;
  slug: string;
  name: string;
  bio?: string;
  theme: string;
  logoUrl?: string;
  bannerUrl?: string;
  showPricing: boolean;
  showReviews: boolean;
  allowDirectOrder: boolean;
  services: StoreService[];
  reviews: StoreReview[];
}

function usePublicStore(slug: string) {
  const [store, setStore] = useState<PublicStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/store/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStore(data.store);
      })
      .catch(() => setError("เกิดข้อผิดพลาด"))
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { store, isLoading, error };
}

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { store, isLoading, error } = usePublicStore(slug);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = useMemo(() => {
    if (!store?.services) return [];
    return store.services.filter((s) => {
      if (!s.isActive) return false;
      if (filter !== "all" && s.platform !== filter) return false;
      if (searchQuery) return s.name.toLowerCase().includes(searchQuery.toLowerCase());
      return true;
    });
  }, [store?.services, filter, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Store className="w-10 h-10 mx-auto mb-3 animate-pulse" />
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">🏪</p>
          <p className="text-gray-600 font-medium">ไม่พบร้านค้านี้</p>
          <Link href="/" className="text-sm text-violet-600 mt-2 inline-block">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  const platforms = ["all", "facebook", "instagram", "tiktok", "youtube", "twitter"];
  const avgRating =
    store.reviews.length > 0
      ? store.reviews.reduce((sum, r) => sum + r.rating, 0) / store.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      {store.bannerUrl && (
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${store.bannerUrl})` }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Store Header */}
        <div className="flex items-start gap-4">
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.name}
              className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center border-4 border-white shadow-md">
              <Store className="w-8 h-8 text-violet-600" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            {store.bio && <p className="text-gray-500 mt-1">{store.bio}</p>}
            {store.showReviews && store.reviews.length > 0 && (
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{avgRating.toFixed(1)}</span>
                <span className="text-gray-400">({store.reviews.length} รีวิว)</span>
              </div>
            )}
          </div>
          {store.allowDirectOrder && (
            <Link
              href={`/s/${slug}/order`}
              className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              สั่งซื้อ
            </Link>
          )}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาบริการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === p
                    ? "bg-violet-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p === "all" ? "ทั้งหมด" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>ไม่พบบริการ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                    {service.platform}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full capitalize">
                    {service.serviceType}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {service.name}
                </h3>
                {store.showPricing && (
                  <p className="text-lg font-bold text-violet-700 mt-2">
                    ฿{formatCurrency(service.sellPrice)}
                    <span className="text-xs text-gray-400 font-normal">/ชิ้น</span>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {service.minQty.toLocaleString()} – {service.maxQty.toLocaleString()} ชิ้น
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {store.showReviews && store.reviews.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">รีวิว</h2>
            <div className="space-y-3">
              {store.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      {review.customerName}
                    </span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
