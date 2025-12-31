"use client";

import { useState } from "react";
import { Card, Button, Badge, Modal, Input, Select, Textarea } from "@/components/ui";
import { PageHeader, ServiceTypeBadge } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import { mockServices } from "@/lib/mock-data";
import type { StoreService } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  Bot,
  Users,
  LayoutGrid,
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<StoreService | null>(null);
  const [filter, setFilter] = useState<"all" | "bot" | "human">("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof StoreService | "profit"; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });

  const filteredServices = services
    .filter((service) => {
      // Type Filter
      if (filter !== "all" && service.serviceType !== filter) return false;
      
      // Platform Filter
      if (platformFilter !== "all" && service.category !== platformFilter) return false;

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          service.name.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof StoreService];
      let bValue: any = b[sortConfig.key as keyof StoreService];

      // Custom Profit Sorting
      if (sortConfig.key === "profit") {
        aValue = a.sellPrice - a.costPrice;
        bValue = b.sellPrice - b.costPrice;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (key: keyof StoreService | "profit") => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ column }: { column: keyof StoreService | "profit" }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 text-brand-text-light/30 opacity-0 group-hover:opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 text-brand-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-primary" />
    );
  };

  const botServices = services.filter((s) => s.serviceType === "bot");
  const humanServices = services.filter((s) => s.serviceType === "human");

  const toggleService = (id: string) => {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="จัดการบริการ"
        description="ตั้งค่าบริการ Bot และคนจริงที่คุณต้องการเปิดขายในร้าน"
        icon={Package}
        action={
          <Button 
            onClick={() => setIsModalOpen(true)} 
            leftIcon={<Plus className="w-4 h-4" />}
            className="rounded-full shadow-lg shadow-brand-primary/20"
          >
            เพิ่มบริการใหม่
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 lg:gap-6">
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="text-center p-2">
            <p className="text-3xl font-bold text-brand-text-dark tracking-tight">
              {services.length}
            </p>
            <p className="text-sm font-medium text-brand-text-light mt-1">บริการทั้งหมด</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-info/10 bg-[#F0F7FF] hover:-translate-y-1 transition-transform">
          <div className="text-center p-2">
            <p className="text-3xl font-bold text-[#1967D2] tracking-tight">
              {botServices.length}
            </p>
            <p className="text-sm font-medium text-[#1967D2]/80 mt-1">Bot Services</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-success/10 bg-[#E6F4EA] hover:-translate-y-1 transition-transform">
          <div className="text-center p-2">
            <p className="text-3xl font-bold text-[#1E8E3E] tracking-tight">
              {humanServices.length}
            </p>
            <p className="text-sm font-medium text-[#1E8E3E]/80 mt-1">Human Services</p>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {/* Type Segmented Control */}
          <div className="flex gap-1 p-1.5 bg-brand-bg/50 rounded-xl border border-brand-border/30 min-w-max">
            {[
              { value: "all", label: "ทั้งหมด", icon: LayoutGrid },
              { value: "bot", label: "Bot", icon: Bot },
              { value: "human", label: "คนจริง", icon: Users },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value as typeof filter)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === item.value
                    ? "bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5"
                    : "text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                <item.icon className={`w-4 h-4 ${filter === item.value ? "text-brand-primary" : "opacity-70"}`} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-8 bg-brand-border/50 shrink-0" />

          {/* Platform Filter */}
          <div className="shrink-0 min-w-[180px] relative">
            <Select
              options={[
                { value: "all", label: "ทุกแพลตฟอร์ม" },
                { value: "facebook", label: "Facebook" },
                { value: "instagram", label: "Instagram" },
                { value: "tiktok", label: "TikTok" },
                { value: "youtube", label: "YouTube" },
              ]}
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2.5 !rounded-xl text-sm pl-10"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Filter className="w-4 h-4 text-brand-text-light" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full lg:w-auto lg:min-w-[280px]">
          <Input 
            placeholder="ค้นหาบริการ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2.5 !rounded-xl"
            leftIcon={<Search className="w-4 h-4 text-brand-text-light" />}
          />
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border/50 text-xs text-brand-text-light uppercase tracking-wider">
                <th 
                  className="p-4 font-medium pl-6 cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    บริการ
                    <SortIcon column="name" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center gap-2">
                    แพลตฟอร์ม
                    <SortIcon column="category" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium text-right cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("costPrice")}
                >
                  <div className="flex items-center justify-end gap-2">
                    ต้นทุน
                    <SortIcon column="costPrice" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium text-right cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("sellPrice")}
                >
                  <div className="flex items-center justify-end gap-2">
                    ราคาขาย
                    <SortIcon column="sellPrice" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium text-right cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("profit")}
                >
                  <div className="flex items-center justify-end gap-2">
                    กำไร
                    <SortIcon column="profit" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium text-center cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("isActive")}
                >
                  <div className="flex items-center justify-center gap-2">
                    สถานะ
                    <SortIcon column="isActive" />
                  </div>
                </th>
                <th className="p-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {filteredServices.map((service) => (
                <tr 
                  key={service.id} 
                  className={`group hover:bg-brand-primary/5 transition-colors ${!service.isActive ? "opacity-60 bg-gray-50/50" : ""}`}
                >
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className={`font-bold text-sm ${service.isActive ? "text-brand-text-dark" : "text-gray-500"}`}>
                        {service.name}
                      </span>
                      <span className="text-xs text-brand-text-light mt-0.5 flex items-center gap-1.5">
                        <ServiceTypeBadge type={service.serviceType} size="sm" showIcon={false} />
                        {service.minQuantity} - {service.maxQuantity.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {service.category === 'facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                      {service.category === 'instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                      {service.category === 'tiktok' && <Music2 className="w-4 h-4 text-black" />}
                      {service.category === 'youtube' && <Youtube className="w-4 h-4 text-red-600" />}
                      <span className="text-sm text-brand-text-dark capitalize">{service.category}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm text-brand-text-light">
                      {formatCurrency(service.costPrice)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm font-bold text-brand-text-dark">
                      {formatCurrency(service.sellPrice)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm font-medium text-brand-success">
                      +{formatCurrency(service.sellPrice - service.costPrice)}
                    </div>
                    <div className="text-[10px] text-brand-success/80">
                      {Math.round(((service.sellPrice - service.costPrice) / service.costPrice) * 100)}%
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleService(service.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                        service.isActive ? 'bg-brand-success' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          service.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => {
                          setEditingService(service);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-brand-text-light hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg text-brand-text-light hover:text-brand-error hover:bg-brand-error/10 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="p-12 text-center text-brand-text-light">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>ไม่พบบริการที่ค้นหา</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        title={editingService ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}
        size="lg"
      >
        <form 
          className="space-y-4"
          key={editingService ? editingService.id : "new-service-form"}
        >
          <Input
            label="ชื่อบริการ"
            placeholder="เช่น ไลค์ Facebook (Bot)"
            defaultValue={editingService?.name}
          />

          <Textarea
            label="รายละเอียด"
            placeholder="อธิบายบริการของคุณ..."
            rows={3}
            defaultValue={editingService?.description}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="แพลตฟอร์ม"
              options={[
                { value: "facebook", label: "📘 Facebook" },
                { value: "instagram", label: "📸 Instagram" },
                { value: "tiktok", label: "🎵 TikTok" },
                { value: "youtube", label: "📺 YouTube" },
                { value: "twitter", label: "🐦 Twitter" },
              ]}
              defaultValue={editingService?.category}
            />
            <Select
              label="ประเภท"
              options={[
                { value: "like", label: "Like" },
                { value: "comment", label: "Comment" },
                { value: "follow", label: "Follow" },
                { value: "share", label: "Share" },
                { value: "view", label: "View" },
              ]}
              defaultValue={editingService?.type}
            />
          </div>

          <Select
            label="รูปแบบบริการ"
            options={[
              { value: "bot", label: "Bot (เร็ว ราคาถูก)" },
              { value: "human", label: "คนจริง (คุณภาพสูง)" },
            ]}
            defaultValue={editingService?.serviceType}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ต้นทุน (บาท/หน่วย)"
              type="number"
              step="0.01"
              placeholder="0.08"
              defaultValue={editingService?.costPrice}
            />
            <Input
              label="ราคาขาย (บาท/หน่วย)"
              type="number"
              step="0.01"
              placeholder="0.15"
              defaultValue={editingService?.sellPrice}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="จำนวนขั้นต่ำ"
              type="number"
              placeholder="100"
              defaultValue={editingService?.minQuantity}
            />
            <Input
              label="จำนวนสูงสุด"
              type="number"
              placeholder="10000"
              defaultValue={editingService?.maxQuantity}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsModalOpen(false);
                setEditingService(null);
              }}
            >
              ยกเลิก
            </Button>
            <Button type="submit" className="flex-1">
              {editingService ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มบริการ"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

