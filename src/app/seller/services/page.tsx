"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Modal, Select, Badge, Card } from "@/components/ui";
import { 
  PageHeader, 
  ServiceTypeBadge,
  AsyncBoundary,
  GenericDataTable,
  EmptyState,
  type Column
} from "@/components/shared";
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
import { api } from "@/lib/api";
import { useBulkSelection, useFilters, useSort } from "@/lib/hooks";
import type { StoreService } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Search,
  Bot,
  Users,
  LayoutGrid,
  Download,
} from "lucide-react";

// ============================================
// HELPERS
// ============================================

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
  const { data: servicesData, isLoading, error, refetch } = useSellerServices();
  const [services, setServices] = useState<StoreService[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<StoreService | null>(null);

  // Initialize services
  useEffect(() => {
    if (servicesData) {
      setServices(servicesData);
    }
  }, [servicesData]);

  // Use new hooks for filtering
  const filterConfig = {
    serviceMode: (service: StoreService, value: any) => 
      value === "all" || service.serviceType === value,
    platform: (service: StoreService, value: any) => 
      value === "all" || service.category === value,
    search: (service: StoreService, value: any) => 
      !value || 
      service.name.toLowerCase().includes(value.toLowerCase()) || 
      service.category.toLowerCase().includes(value.toLowerCase())
  };

  const { filteredItems, setFilter, filters } = useFilters(services, filterConfig, {
    serviceMode: "all",
    platform: "all",
    search: ""
  });

  // Use sort hook with custom comparator for profit
  const { sortedItems, sortBy, sortConfig } = useSort(filteredItems, 
    { key: "name" as keyof StoreService, direction: "asc" },
    {
      profit: (a, b) => (a.sellPrice - a.costPrice) - (b.sellPrice - b.costPrice)
    }
  );

  // Use bulk selection hook
  const { 
    selectedIds, 
    selectedCount, 
    isAllSelected, 
    toggleSelection, 
    toggleSelectAll, 
    clearSelection 
  } = useBulkSelection(sortedItems);

  // Stats
  const botCount = services.filter(s => s.serviceType === "bot").length;
  const humanCount = services.filter(s => s.serviceType === "human").length;
  const activeCount = services.filter(s => s.isActive).length;

  // Handlers
  const toggleService = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    
    await api.seller.updateService(id, { isActive: !service.isActive });
    await refetch();
  };

  const updateShowInStore = async (id: string, showInStore: boolean) => {
    await api.seller.updateService(id, { showInStore });
    await refetch();
  };

  const handleBulkAction = async (action: BulkAction) => {
    const ids = Array.from(selectedIds);
    
    try {
      switch (action) {
        case "show":
          await api.seller.bulkUpdateServices(ids, { showInStore: true });
          break;
        case "hide":
          await api.seller.bulkUpdateServices(ids, { showInStore: false });
          break;
        case "toggle":
          const servicesToToggle = services.filter(s => selectedIds.has(s.id));
          for (const service of servicesToToggle) {
            await api.seller.updateService(service.id, { isActive: !service.isActive });
          }
          break;
        case "delete":
          if (confirm(`ต้องการลบ ${selectedCount} บริการที่เลือกหรือไม่?`)) {
            for (const id of ids) {
              await api.seller.deleteService(id);
            }
          }
          break;
      }
      await refetch();
      clearSelection();
    } catch (error) {
      console.error("Error performing bulk action:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  // Define columns for GenericDataTable
  const columns: Column<StoreService>[] = [
    {
      key: "name",
      label: "บริการ",
      sortable: true,
      render: (_, service) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-brand-text-dark">{service.name}</span>
          <span className="text-xs text-brand-text-light mt-0.5 flex items-center gap-1.5">
            <ServiceTypeBadge type={service.serviceType} size="sm" showIcon={false} />
            {service.minQuantity} - {service.maxQuantity.toLocaleString()}
          </span>
        </div>
      )
    },
    {
      key: "category",
      label: "แพลตฟอร์ม",
      sortable: true,
      render: (_, service) => <PlatformIcon platform={service.category} showLabel />
    },
    {
      key: "type",
      label: "ประเภท",
      sortable: true,
      render: (_, service) => <ServiceTypeIcon type={service.type} useEmoji showLabel />
    },
    {
      key: "costPrice",
      label: "ต้นทุน",
      align: "right",
      sortable: true,
      render: (_, service) => (
        <span className="text-sm text-brand-text-light">{formatCurrency(service.costPrice)}</span>
      )
    },
    {
      key: "sellPrice",
      label: "ราคาขาย",
      align: "right",
      sortable: true,
      render: (_, service) => (
        <span className="text-sm font-bold text-brand-text-dark">{formatCurrency(service.sellPrice)}</span>
      )
    },
    {
      key: "profit",
      label: "กำไร",
      align: "right",
      sortable: true,
      render: (_, service) => (
        <div>
          <div className="text-sm font-medium text-brand-success">
            +{formatCurrency(service.sellPrice - service.costPrice)}
          </div>
          <div className="text-[10px] text-brand-success/80">
            {Math.round(((service.sellPrice - service.costPrice) / service.costPrice) * 100)}%
          </div>
        </div>
      )
    },
    {
      key: "showInStore",
      label: "แสดงในร้าน",
      align: "center",
      render: (_, service) => (
        <Select 
          value={service.showInStore ? "true" : "false"} 
          onChange={(e) => updateShowInStore(service.id, e.target.value === "true")}
          options={VISIBILITY_OPTIONS} 
          className="min-w-[140px] text-sm" 
        />
      )
    },
    {
      key: "isActive",
      label: "สถานะ",
      align: "center",
      sortable: true,
      render: (_, service) => (
        <button 
          onClick={() => toggleService(service.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            service.isActive ? 'bg-brand-success' : 'bg-gray-200'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            service.isActive ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      )
    },
    {
      key: "id",
      label: "",
      align: "center",
      render: (_, service) => (
        <div className="flex items-center justify-center gap-1">
          <button 
            onClick={() => { setEditingService(service); setIsEditModalOpen(true); }}
            className="p-2 rounded-lg text-brand-text-light hover:text-brand-primary hover:bg-brand-primary/10" 
            title="แก้ไข"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={async () => {
              if (confirm(`ต้องการลบบริการ "${service.name}" หรือไม่?`)) {
                await api.seller.deleteService(service.id);
                await refetch();
              }
            }}
            className="p-2 rounded-lg text-brand-text-light hover:text-brand-error hover:bg-brand-error/10" 
            title="ลบ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Header - Always visible */}
      <PageHeader
        title="จัดการบริการ"
        description="ตั้งค่าบริการที่คุณต้องการเปิดขายในร้าน"
        icon={Package}
        action={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => exportServicesToCSV(sortedItems)} 
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
            <Link href="/seller/services/new">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                เพิ่มบริการ
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filter Bar - Always visible */}
      <Card className="p-4 border-none shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Left: Service Mode Tabs + Stats */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Service Mode Toggle */}
            <div className="flex gap-1 p-1 bg-brand-bg rounded-xl">
              {[
                { value: "all" as const, label: "ทั้งหมด", icon: LayoutGrid, count: services.length },
                { value: "bot" as const, label: "งานเว็บ", icon: Bot, count: botCount },
                { value: "human" as const, label: "งานกดมือ", icon: Users, count: humanCount },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter("serviceMode", item.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.serviceMode === item.value
                      ? "bg-white text-brand-text-dark shadow-sm"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${filters.serviceMode === item.value ? "text-brand-primary" : ""}`} />
                  {item.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    filters.serviceMode === item.value ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-bg text-brand-text-light"
                  }`}>
                    {item.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Platform Filter */}
            <Select
              options={[
                { value: "all", label: "ทุกแพลตฟอร์ม" },
                ...Object.entries(PLATFORM_CONFIGS).map(([value, config]) => ({ value, label: config.label })),
              ]}
              value={filters.platform as string}
              onChange={(e) => setFilter("platform", e.target.value)}
              className="min-w-[160px]"
            />

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-brand-border/50">
              <Badge variant="success" size="sm">
                {activeCount} เปิดใช้งาน
              </Badge>
              <Badge variant="default" size="sm">
                {services.length - activeCount} ปิดใช้งาน
              </Badge>
            </div>
          </div>

          {/* Right: Search */}
          <div className="w-full lg:w-auto lg:min-w-[280px]">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="ค้นหาบริการ..." 
                value={filters.search as string || ""}
                onChange={(e) => setFilter("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Services Content - Loading/Empty/Data states */}
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        isEmpty={services.length === 0}
        emptyFallback={
          <Card className="border-none shadow-md p-12">
            <EmptyState
              icon={Package}
              title="ยังไม่มีบริการ"
              description="เพิ่มบริการแรกของคุณได้เลย"
              action={
                <Link href="/seller/services/new">
                  <Button leftIcon={<Plus className="w-4 h-4" />}>
                    เพิ่มบริการแรก
                  </Button>
                </Link>
              }
            />
          </Card>
        }
      >
        {/* Services Table */}
        <Card className="border-none shadow-md overflow-hidden">
          <GenericDataTable
            data={sortedItems}
            columns={columns}
            selectable
            selectedIds={selectedIds}
            onSelectToggle={toggleSelection}
            onSelectAll={toggleSelectAll}
            isAllSelected={isAllSelected}
            sortConfig={sortConfig}
            onSort={sortBy}
            emptyMessage="ไม่พบบริการที่ค้นหา"
            rowClassName={(service) => 
              !service.isActive ? "opacity-60 bg-gray-50/50" : ""
            }
          />
        </Card>
      </AsyncBoundary>

      {/* Bulk Actions */}
      <BulkActionsBar selectedCount={selectedCount} onAction={handleBulkAction} onClear={clearSelection} />

      {/* Edit Service Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setEditingService(null); }}
        title="แก้ไขบริการ" 
        size="lg"
      >
        <div className="space-y-4" key={editingService?.id || "edit"}>
          <ServiceForm 
            service={editingService}
            onSubmit={async (data) => {
              if (!editingService) return;
              
              try {
                await api.seller.updateService(editingService.id, data);
                await refetch();
                setIsEditModalOpen(false);
                setEditingService(null);
                alert("บันทึกการเปลี่ยนแปลงเรียบร้อย");
              } catch (error) {
                console.error("Error updating service:", error);
                alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
              }
            }}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsEditModalOpen(false); setEditingService(null); }}>
              ยกเลิก
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
