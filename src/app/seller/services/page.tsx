"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button, Modal, Input, Select, Textarea } from "@/components/ui";
import { PageHeader, ServiceTypeBadge } from "@/components/shared";
import { 
  PlatformIcon, 
  ServiceTypeIcon, 
  ServiceForm,
  BulkActionsBar,
  type BulkAction 
} from "@/components/seller";
import { 
  PLATFORM_CONFIGS, 
  SERVICE_TYPE_CONFIGS,
  VISIBILITY_OPTIONS,
} from "@/lib/constants/services";
import { formatCurrency } from "@/lib/utils";
import { useSellerServices } from "@/lib/api/hooks";
import type { StoreService, Platform, ServiceType } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  Bot,
  Users,
  LayoutGrid,
  X,
  Download,
  Zap,
} from "lucide-react";

// ============================================
// HOOKS & HELPERS
// ============================================

function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isAllSelected: selectedIds.size === items.length && items.length > 0,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
  };
}

function exportServicesToCSV(services: StoreService[]) {
  const data = services.map((service, index) => ({
    'ลำดับ': index + 1,
    'ชื่อบริการ': service.name,
    'รายละเอียด': service.description || '',
    'แพลตฟอร์ม': PLATFORM_CONFIGS[service.category]?.label || service.category,
    'ประเภท': SERVICE_TYPE_CONFIGS[service.type]?.labelTh || service.type,
    'รูปแบบบริการ': service.serviceType === 'bot' ? 'งานเว็บ' : 'งานกดมือ',
    'ต้นทุน (บาท/หน่วย)': service.costPrice,
    'ราคาขาย (บาท/หน่วย)': service.sellPrice,
    'จำนวนขั้นต่ำ': service.minQuantity,
    'จำนวนสูงสุด': service.maxQuantity,
    'เวลาส่งมอบ': service.estimatedTime || '',
    'แสดงในร้าน': service.showInStore ? 'แสดง' : 'ซ่อน',
    'สถานะ': service.isActive ? 'เปิด' : 'ปิด',
    'MeeLike Service ID': service.meelikeServiceId || ''
  }));

  const headers = Object.keys(data[0]);
  const csv = [
    '\ufeff' + headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header as keyof typeof row];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', `บริการ_${new Date().toLocaleDateString('th-TH')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ServicesPage() {
  const { data: servicesData } = useSellerServices();
  const [services, setServices] = useState<StoreService[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<StoreService | null>(null);

  // Filters
  const [serviceModeFilter, setServiceModeFilter] = useState<"all" | "bot" | "human">("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });

  // Initialize services
  useEffect(() => {
    if (servicesData) {
      setServices(servicesData);
    }
  }, [servicesData]);

  // Filtered & Sorted Services
  const filteredServices = services
    .filter((service) => {
      if (serviceModeFilter !== "all" && service.serviceType !== serviceModeFilter) return false;
      if (platformFilter !== "all" && service.category !== platformFilter) return false;
      if (serviceTypeFilter !== "all" && service.type !== serviceTypeFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return service.name.toLowerCase().includes(query) || service.category.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any = sortConfig.key === "profit" 
        ? a.sellPrice - a.costPrice 
        : a[sortConfig.key as keyof StoreService];
      let bValue: any = sortConfig.key === "profit" 
        ? b.sellPrice - b.costPrice 
        : b[sortConfig.key as keyof StoreService];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // Bulk Selection
  const { 
    selectedIds, 
    selectedCount, 
    isAllSelected, 
    toggleSelection, 
    toggleSelectAll, 
    clearSelection 
  } = useBulkSelection(filteredServices);

  // Stats
  const botCount = services.filter(s => s.serviceType === "bot").length;
  const humanCount = services.filter(s => s.serviceType === "human").length;

  // Handlers
  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const updateShowInStore = (id: string, showInStore: boolean) => {
    setServices(services.map(s => s.id === id ? { ...s, showInStore } : s));
  };

  const handleBulkAction = (action: BulkAction) => {
    switch (action) {
      case "show":
        setServices(services.map(s => selectedIds.has(s.id) ? { ...s, showInStore: true } : s));
        break;
      case "hide":
        setServices(services.map(s => selectedIds.has(s.id) ? { ...s, showInStore: false } : s));
        break;
      case "toggle":
        setServices(services.map(s => selectedIds.has(s.id) ? { ...s, isActive: !s.isActive } : s));
        break;
      case "delete":
        if (confirm(`ต้องการลบ ${selectedCount} บริการที่เลือกหรือไม่?`)) {
          setServices(services.filter(s => !selectedIds.has(s.id)));
        }
        break;
    }
    clearSelection();
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 text-brand-text-light/30 opacity-0 group-hover:opacity-50" />;
    return sortConfig.direction === "asc" 
      ? <ArrowUp className="w-3 h-3 text-brand-primary" />
      : <ArrowDown className="w-3 h-3 text-brand-primary" />;
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-24">
      {/* Header */}
      <PageHeader
        title="จัดการบริการ"
        description="ตั้งค่าบริการงานเว็บและงานกดมือที่คุณต้องการเปิดขายในร้าน"
        icon={Package}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => exportServicesToCSV(filteredServices)} leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Link href="/seller/services/new">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                เพิ่มบริการใหม่
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {/* Service Mode Tabs */}
          <div className="flex gap-1 p-1.5 bg-brand-bg/50 rounded-xl border border-brand-border/30 min-w-max">
            {[
              { value: "all" as const, label: "ทั้งหมด", icon: LayoutGrid, count: services.length },
              { value: "bot" as const, label: "งานเว็บ", icon: Bot, count: botCount },
              { value: "human" as const, label: "งานกดมือ", icon: Users, count: humanCount },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setServiceModeFilter(item.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  serviceModeFilter === item.value
                    ? "bg-white text-brand-text-dark shadow-sm"
                    : "text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                <item.icon className={`w-4 h-4 ${serviceModeFilter === item.value ? "text-brand-primary" : ""}`} />
                {item.label}
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                  serviceModeFilter === item.value ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-bg text-brand-text-light"
                }`}>{item.count}</span>
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-8 bg-brand-border/50" />

          {/* Platform Filter */}
          <div className="min-w-[170px] relative">
            <Select
              options={[
                { value: "all", label: "ทุกแพลตฟอร์ม" },
                ...Object.entries(PLATFORM_CONFIGS).map(([value, config]) => ({ value, label: config.label })),
              ]}
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full pl-9"
            />
            <Filter className="w-4 h-4 text-brand-text-light absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Service Type Filter */}
          <Select
            options={[
              { value: "all", label: "ทุกประเภท" },
              ...Object.entries(SERVICE_TYPE_CONFIGS).map(([value, config]) => ({ value, label: config.labelTh })),
            ]}
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="min-w-[140px]"
          />
        </div>

        {/* Search */}
        <div className="w-full lg:w-auto lg:min-w-[280px]">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-text-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="ค้นหาบริการ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-border/50 bg-brand-bg/50 focus:bg-white focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border/50 text-xs text-brand-text-light uppercase tracking-wider">
                <th className="p-4 font-medium w-12">
                  <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-brand-primary cursor-pointer" />
                </th>
                {[
                  { key: "name", label: "บริการ" },
                  { key: "category", label: "แพลตฟอร์ม" },
                  { key: "type", label: "ประเภท" },
                  { key: "costPrice", label: "ต้นทุน", align: "right" },
                  { key: "sellPrice", label: "ราคาขาย", align: "right" },
                  { key: "profit", label: "กำไร", align: "right" },
                ].map((col) => (
                  <th key={col.key} className="p-4 font-medium cursor-pointer group hover:bg-brand-border/30" onClick={() => handleSort(col.key)}>
                    <div className={`flex items-center gap-2 ${col.align === "right" ? "justify-end" : ""}`}>
                      {col.label}
                      <SortIcon column={col.key} />
                    </div>
                  </th>
                ))}
                <th className="p-4 font-medium text-center">เวลาส่งมอบ</th>
                <th className="p-4 font-medium text-center">แสดงในร้าน</th>
                <th className="p-4 font-medium text-center cursor-pointer group" onClick={() => handleSort("isActive")}>
                  <div className="flex items-center justify-center gap-2">สถานะ <SortIcon column="isActive" /></div>
                </th>
                <th className="p-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {filteredServices.map((service) => (
                <tr key={service.id} className={`hover:bg-brand-primary/5 transition-colors ${!service.isActive ? "opacity-60 bg-gray-50/50" : ""} ${selectedIds.has(service.id) ? "bg-brand-primary/10" : ""}`}>
                  <td className="p-4">
                    <input type="checkbox" checked={selectedIds.has(service.id)} onChange={() => toggleSelection(service.id)}
                      className="w-4 h-4 rounded border-gray-300 text-brand-primary cursor-pointer" />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-brand-text-dark">{service.name}</span>
                      <span className="text-xs text-brand-text-light mt-0.5 flex items-center gap-1.5">
                        <ServiceTypeBadge type={service.serviceType} size="sm" showIcon={false} />
                        {service.minQuantity} - {service.maxQuantity.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4"><PlatformIcon platform={service.category} showLabel /></td>
                  <td className="p-4"><ServiceTypeIcon type={service.type} useEmoji showLabel /></td>
                  <td className="p-4 text-right text-sm text-brand-text-light">{formatCurrency(service.costPrice)}</td>
                  <td className="p-4 text-right text-sm font-bold text-brand-text-dark">{formatCurrency(service.sellPrice)}</td>
                  <td className="p-4 text-right">
                    <div className="text-sm font-medium text-brand-success">+{formatCurrency(service.sellPrice - service.costPrice)}</div>
                    <div className="text-[10px] text-brand-success/80">{Math.round(((service.sellPrice - service.costPrice) / service.costPrice) * 100)}%</div>
                  </td>
                  <td className="p-4 text-center text-sm">{service.estimatedTime || <span className="text-brand-text-light italic">ไม่ระบุ</span>}</td>
                  <td className="p-4">
                    <Select value={service.showInStore ? "true" : "false"} onChange={(e) => updateShowInStore(service.id, e.target.value === "true")}
                      options={VISIBILITY_OPTIONS} className="min-w-[160px] text-sm" />
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleService(service.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${service.isActive ? 'bg-brand-success' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${service.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setEditingService(service); setIsEditModalOpen(true); }}
                        className="p-2 rounded-lg text-brand-text-light hover:text-brand-primary hover:bg-brand-primary/10" title="แก้ไข">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-brand-text-light hover:text-brand-error hover:bg-brand-error/10" title="ลบ">
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

      {/* Bulk Actions */}
      <BulkActionsBar selectedCount={selectedCount} onAction={handleBulkAction} onClear={clearSelection} />

      {/* Edit Service Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setEditingService(null); }}
        title="แก้ไขบริการ" 
        size="lg"
      >
        <form className="space-y-4" key={editingService?.id || "edit"}>
          <ServiceForm service={editingService} />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsEditModalOpen(false); setEditingService(null); }}>
              ยกเลิก
            </Button>
            <Button type="submit" className="flex-1">
              บันทึกการเปลี่ยนแปลง
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
