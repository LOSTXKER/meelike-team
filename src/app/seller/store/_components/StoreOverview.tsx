import Link from "next/link";
import { Card, Badge, Avatar } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  Star,
  TrendingUp,
  Users,
  Globe,
  Check,
  Copy,
  CheckCircle,
  Package,
  Zap,
  MessageSquare,
  Clock,
  BarChart3,
} from "lucide-react";

export interface StoreStats {
  totalSales: number;
  monthlyOrders: number;
  rating: number;
  ratingCount: number;
  visitors: number;
  conversionRate: number;
  responseRate: number;
  avgDeliveryTime: string;
}

interface StoreOverviewProps {
  currentTheme: { gradient: string };
  storeData: { storeName: string; storeSlug: string; bio: string };
  storeUrl: string;
  storeStats: StoreStats;
  handleCopy: (text: string, key: string) => void;
  copied: string | null;
}

export function StoreOverview({
  currentTheme,
  storeData,
  storeUrl,
  storeStats,
  handleCopy,
  copied,
}: StoreOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Store Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className={`h-24 bg-gradient-to-r ${currentTheme.gradient} relative`} />
          <div className="p-5 -mt-12">
            <div className="flex items-end gap-4 mb-4">
              <Avatar 
                fallback={storeData.storeName} 
                size="lg" 
                className="w-20 h-20 border-4 border-white shadow-lg"
              />
              <div className="pb-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-brand-text-dark">{storeData.storeName}</h3>
                  <Badge variant="success" size="sm">
                    <CheckCircle className="w-3 h-3 mr-0.5" />
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm font-medium">{storeStats.rating}</span>
                  <span className="text-brand-text-light text-xs">({storeStats.ratingCount} รีวิว)</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-brand-text-light mb-4 line-clamp-2">{storeData.bio}</p>
            <div className="flex items-center gap-2 p-2 bg-brand-bg/50 rounded-lg">
              <Globe className="w-4 h-4 text-brand-text-light" />
              <span className="text-sm font-mono text-brand-text-dark flex-1 truncate">{storeUrl}</span>
              <button 
                onClick={() => handleCopy(`https://${storeUrl}`, "url")}
                className="p-1.5 hover:bg-white rounded-lg transition-colors"
              >
                {copied === "url" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-brand-text-light" />}
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 border-none shadow-md bg-gradient-to-br from-brand-primary/5 to-white">
            <div className="flex flex-col">
              <div className="p-2 bg-brand-primary/10 rounded-lg w-fit mb-2">
                <TrendingUp className="w-5 h-5 text-brand-primary" />
              </div>
              <p className="text-xl font-bold text-brand-text-dark">{formatCurrency(storeStats.totalSales)}</p>
              <p className="text-xs text-brand-text-light">ยอดขายรวม</p>
            </div>
          </Card>
          
          <Card className="p-4 border-none shadow-md bg-gradient-to-br from-blue-50 to-white">
            <div className="flex flex-col">
              <div className="p-2 bg-blue-100 rounded-lg w-fit mb-2">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-brand-text-dark">{storeStats.monthlyOrders}</p>
              <p className="text-xs text-brand-text-light">ออเดอร์/เดือน</p>
            </div>
          </Card>
          
          <Card className="p-4 border-none shadow-md bg-gradient-to-br from-amber-50 to-white">
            <div className="flex flex-col">
              <div className="p-2 bg-amber-100 rounded-lg w-fit mb-2">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xl font-bold text-brand-text-dark">{storeStats.rating}</p>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-xs text-brand-text-light">คะแนนร้าน</p>
            </div>
          </Card>
          
          <Card className="p-4 border-none shadow-md bg-gradient-to-br from-green-50 to-white">
            <div className="flex flex-col">
              <div className="p-2 bg-green-100 rounded-lg w-fit mb-2">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl font-bold text-brand-text-dark">{storeStats.visitors.toLocaleString()}</p>
              <p className="text-xs text-brand-text-light">ผู้เข้าชม/เดือน</p>
            </div>
          </Card>

          <Card className="p-4 border-none shadow-md bg-gradient-to-br from-purple-50 to-white">
            <div className="flex flex-col">
              <div className="p-2 bg-purple-100 rounded-lg w-fit mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-brand-text-dark">{storeStats.conversionRate}%</p>
              <p className="text-xs text-brand-text-light">Conversion</p>
            </div>
          </Card>

          <Card className="p-4 border-none shadow-md bg-gradient-to-br from-cyan-50 to-white">
            <div className="flex flex-col">
              <div className="p-2 bg-cyan-100 rounded-lg w-fit mb-2">
                <MessageSquare className="w-5 h-5 text-cyan-600" />
              </div>
              <p className="text-xl font-bold text-brand-text-dark">{storeStats.responseRate}%</p>
              <p className="text-xs text-brand-text-light">ตอบกลับ</p>
            </div>
          </Card>

          <Card className="p-4 border-none shadow-md bg-gradient-to-br from-rose-50 to-white">
            <div className="flex flex-col">
              <div className="p-2 bg-rose-100 rounded-lg w-fit mb-2">
                <Clock className="w-5 h-5 text-rose-600" />
              </div>
              <p className="text-xl font-bold text-brand-text-dark">{storeStats.avgDeliveryTime}</p>
              <p className="text-xs text-brand-text-light">ส่งงานเฉลี่ย</p>
            </div>
          </Card>

          <Link href="/seller/analytics" className="contents">
            <Card className="p-4 border-none shadow-md bg-gradient-to-br from-indigo-50 to-white hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex flex-col h-full justify-between">
                <div className="p-2 bg-indigo-100 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-600">ดู Analytics</p>
                  <p className="text-xs text-brand-text-light">สถิติเชิงลึก →</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
