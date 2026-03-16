"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select, Badge, Tabs, RadioGroup } from "@/components/ui";
import { HStack } from "@/components/layout";
import { PlatformIcon, ServiceTypeIcon } from "@/components/seller";
import { useToast } from "@/components/ui/toast";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { api } from "@/lib/api";
import { 
  mockMeeLikeServices, 
  meeLikeCategories,
  getMeeLikeRatePerUnit 
} from "@/lib/constants/meelike";
import { PLATFORM_CONFIGS, SERVICE_TYPE_CONFIGS } from "@/lib/constants/services";
import { formatCurrency } from "@/lib/utils";
import type { MeeLikeService, StoreService, Platform, ServiceType } from "@/types";
import {
  Bot,
  Users,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  Zap,
  RefreshCw,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Server,
  Percent,
  DollarSign,
  Edit3,
  Save,
  Package,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

type ServiceMode = "web" | "manual" | null;
type MarkupType = "percent" | "fixed";
type APIProvider = "meelike" | "other";

interface SelectedWebService {
  meelikeService: MeeLikeService;
  customSellPrice?: number; // If user wants to override
  useCustomPrice: boolean;
}

interface ManualServiceRow {
  id: string;
  name: string;
  description: string;
  platform: Platform;
  serviceType: ServiceType;
  sellPrice: number;
  minQty: number;
  maxQty: number;
  estimatedTime: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function mapCategoryToPlatform(category: string): Platform {
  const map: Record<string, Platform> = {
    "Facebook": "facebook",
    "Instagram": "instagram",
    "TikTok": "tiktok",
    "YouTube": "youtube",
    "Twitter": "twitter",
  };
  return map[category] || "facebook";
}

function mapTypeToServiceType(type: string): ServiceType {
  const typeLower = type.toLowerCase();
  if (typeLower.includes("like")) return "like";
  if (typeLower.includes("comment")) return "comment";
  if (typeLower.includes("follower") || typeLower.includes("subscriber")) return "follow";
  if (typeLower.includes("view")) return "view";
  if (typeLower.includes("share") || typeLower.includes("retweet")) return "share";
  return "like";
}

function createEmptyManualRow(): ManualServiceRow {
  return {
    id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: "",
    description: "",
    platform: "facebook",
    serviceType: "like",
    sellPrice: 0, // ราคาขายลูกค้า
    minQty: 100,
    maxQty: 10000,
    estimatedTime: "24-48 ชม.",
  };
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function NewServicePage() {
  const router = useRouter();
  const toast = useToast();
  const { setDirty, setClean } = useUnsavedChanges();
  
  // Mode Selection
  const [selectedMode, setSelectedMode] = useState<ServiceMode>(null);
  
  // Web Services State
  const [selectedProvider, setSelectedProvider] = useState<APIProvider>("meelike");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedServices, setSelectedServices] = useState<Map<string, SelectedWebService>>(new Map());
  const [markupType, setMarkupType] = useState<MarkupType>("percent");
  const [markupValue, setMarkupValue] = useState(30);
  const [customPrices, setCustomPrices] = useState<Map<string, number>>(new Map()); // เก็บราคาที่แก้แยก
  
  // Manual Services State
  const [manualRows, setManualRows] = useState<ManualServiceRow[]>([createEmptyManualRow()]);
  
  // Loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Get from context
  const existingMeeLikeIds: string[] = [];

  // ============================================
  // WEB SERVICES LOGIC
  // ============================================

  const filteredServices = useMemo(() => {
    return mockMeeLikeServices.filter(service => {
      if (categoryFilter !== "all" && service.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          service.name.toLowerCase().includes(q) ||
          service.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  const isAlreadyImported = (serviceId: string) => existingMeeLikeIds.includes(serviceId);

  const calculateSellPrice = (costPerUnit: number, customPrice?: number, useCustom?: boolean) => {
    if (useCustom && customPrice !== undefined) return customPrice;
    if (markupType === "percent") {
      return costPerUnit * (1 + markupValue / 100);
    } else {
      return costPerUnit + markupValue;
    }
  };

  const toggleWebService = (service: MeeLikeService) => {
    if (isAlreadyImported(service.service)) return;
    
    const newSelection = new Map(selectedServices);
    if (newSelection.has(service.service)) {
      newSelection.delete(service.service);
    } else {
      // ถ้ามีราคาที่แก้ไว้ ใช้มัน
      const hasCustomPrice = customPrices.has(service.service);
      newSelection.set(service.service, {
        meelikeService: service,
        customSellPrice: hasCustomPrice ? customPrices.get(service.service) : undefined,
        useCustomPrice: hasCustomPrice,
      });
    }
    setSelectedServices(newSelection);
    setDirty();
  };

  const updateServicePrice = (serviceId: string, customPrice: number) => {
    // อัพเดท customPrices map
    const newCustomPrices = new Map(customPrices);
    newCustomPrices.set(serviceId, customPrice);
    setCustomPrices(newCustomPrices);

    // ถ้าบริการถูกเลือกอยู่ อัพเดท selectedServices ด้วย
    const newSelection = new Map(selectedServices);
    const existing = newSelection.get(serviceId);
    if (existing) {
      newSelection.set(serviceId, {
        ...existing,
        customSellPrice: customPrice,
        useCustomPrice: true,
      });
      setSelectedServices(newSelection);
    }
    setDirty();
  };

  const resetServicePrice = (serviceId: string) => {
    // ลบออกจาก customPrices
    const newCustomPrices = new Map(customPrices);
    newCustomPrices.delete(serviceId);
    setCustomPrices(newCustomPrices);

    // อัพเดท selectedServices ถ้าถูกเลือกอยู่
    const newSelection = new Map(selectedServices);
    const existing = newSelection.get(serviceId);
    if (existing) {
      newSelection.set(serviceId, {
        ...existing,
        customSellPrice: undefined,
        useCustomPrice: false,
      });
      setSelectedServices(newSelection);
    }
  };

  const selectAllWeb = () => {
    const available = filteredServices.filter(s => !isAlreadyImported(s.service));
    if (selectedServices.size === available.length) {
      setSelectedServices(new Map());
    } else {
      const newSelection = new Map<string, SelectedWebService>();
      available.forEach(s => {
        newSelection.set(s.service, {
          meelikeService: s,
          useCustomPrice: false,
        });
      });
      setSelectedServices(newSelection);
    }
    setDirty();
  };

  // ============================================
  // MANUAL SERVICES LOGIC
  // ============================================

  const addManualRow = () => {
    setManualRows([...manualRows, createEmptyManualRow()]);
    setDirty();
  };

  const removeManualRow = (id: string) => {
    if (manualRows.length <= 1) return;
    setManualRows(manualRows.filter(r => r.id !== id));
    setDirty();
  };

  const duplicateManualRow = (row: ManualServiceRow) => {
    const newRow = { ...row, id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    const index = manualRows.findIndex(r => r.id === row.id);
    const newRows = [...manualRows];
    newRows.splice(index + 1, 0, newRow);
    setManualRows(newRows);
    setDirty();
  };

  const updateManualRow = (id: string, field: keyof ManualServiceRow, value: string | number) => {
    setManualRows(manualRows.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
    setDirty();
  };

  const validManualRows = manualRows.filter(r => r.name.trim() !== "");

  // ============================================
  // SUBMIT HANDLER
  // ============================================

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const servicesToAdd: Partial<StoreService>[] = [];
      
      if (selectedMode === "web") {
        selectedServices.forEach((selected, serviceId) => {
          const { meelikeService, customSellPrice, useCustomPrice } = selected;
          const costPerUnit = getMeeLikeRatePerUnit(meelikeService.rate);
          const sellPrice = calculateSellPrice(costPerUnit, customSellPrice, useCustomPrice);
          
          servicesToAdd.push({
            name: meelikeService.name.replace(/^[🔵📸🎵▶️🐦]\s*/, ''),
            description: meelikeService.description,
            platform: mapCategoryToPlatform(meelikeService.category),
            serviceType: mapTypeToServiceType(meelikeService.type),
            mode: "bot",
            costPrice: costPerUnit,
            sellPrice: sellPrice,
            minQty: parseInt(meelikeService.min),
            maxQty: parseInt(meelikeService.max),
            meelikeServiceId: meelikeService.service,
            estimatedTime: meelikeService.averageTime,
            isActive: true,
            showInStore: true,
          });
        });
      } else {
        validManualRows.forEach(row => {
          servicesToAdd.push({
            name: row.name,
            description: row.description,
            platform: row.platform,
            serviceType: row.serviceType,
            mode: "human",
            // ไม่ต้องกรอก workerRate ตอนสร้างบริการ - จะกรอกตอนสร้าง Job
            sellPrice: row.sellPrice,
            minQty: row.minQty,
            maxQty: row.maxQty,
            estimatedTime: row.estimatedTime,
            isActive: true,
            showInStore: true,
          });
        });
      }
      
      // Save to localStorage via API
      await api.seller.createServices(servicesToAdd);
      
      setClean();
      toast.success(`เพิ่ม ${servicesToAdd.length} บริการเรียบร้อย!`);
      router.push("/seller/services");
    } catch (error) {
      console.error("Error creating services:", error);
      toast.error("เกิดข้อผิดพลาดในการเพิ่มบริการ กรุณาลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  };

  const availableCount = filteredServices.filter(s => !isAlreadyImported(s.service)).length;
  const canSubmit = selectedMode === "web" ? selectedServices.size > 0 : validManualRows.length > 0;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-brand-primary" />
            </div>
            เพิ่มบริการใหม่
          </h1>
          <p className="text-brand-text-light text-sm mt-1 ml-[52px]">
            เลือกประเภทบริการที่คุณต้องการเพิ่ม
          </p>
        </div>
        {selectedMode && (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedMode(null);
              // Reset states when changing mode
              setManualRows([createEmptyManualRow()]);
              setSelectedServices(new Map());
              setCustomPrices(new Map());
            }}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            เปลี่ยนประเภท
          </Button>
        )}
      </div>

      {/* Step 1: Choose Mode */}
      {!selectedMode && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Web Services Card */}
          <button
            onClick={() => setSelectedMode("web")}
            className="group relative overflow-hidden rounded-2xl border-2 border-transparent hover:border-blue-300 transition-all duration-300 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mt-6">
                งานเว็บ (API)
              </h3>
              <p className="text-blue-100 mt-2 text-sm leading-relaxed">
                นำเข้าบริการจาก MeeLike หรือ Provider อื่น ระบบจะส่งงานอัตโนมัติ เหมาะสำหรับงานที่ต้องการความเร็ว
              </p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                  ⚡ เร็ว
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                  🤖 อัตโนมัติ
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                  💰 ราคาถูก
                </span>
              </div>
            </div>
          </button>

          {/* Manual Services Card */}
          <button
            onClick={() => setSelectedMode("manual")}
            className="group relative overflow-hidden rounded-2xl border-2 border-transparent hover:border-purple-300 transition-all duration-300 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mt-6">
                งานกดมือ
              </h3>
              <p className="text-purple-100 mt-2 text-sm leading-relaxed">
                สร้างบริการที่ทำโดยคนจริง งานจะกระจายให้ทีมคนทำงาน เหมาะสำหรับงานที่ต้องการคุณภาพ
              </p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                  👥 คนจริง
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                  ⭐ คุณภาพสูง
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                  🎯 ปรับแต่งได้
                </span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Step 2: Web Services */}
      {selectedMode === "web" && (
        <WebServicesForm
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          markupType={markupType}
          onMarkupTypeChange={setMarkupType}
          markupValue={markupValue}
          onMarkupValueChange={setMarkupValue}
          filteredServices={filteredServices}
          selectedServices={selectedServices}
          customPrices={customPrices}
          onToggleService={toggleWebService}
          onSelectAll={selectAllWeb}
          onUpdatePrice={updateServicePrice}
          onResetPrice={resetServicePrice}
          isAlreadyImported={isAlreadyImported}
          availableCount={availableCount}
          calculateSellPrice={calculateSellPrice}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
        />
      )}

      {/* Step 2: Manual Services */}
      {selectedMode === "manual" && (
        <ManualServicesForm
          rows={manualRows}
          onAddRow={addManualRow}
          onRemoveRow={removeManualRow}
          onDuplicateRow={duplicateManualRow}
          onUpdateRow={updateManualRow}
          validCount={validManualRows.length}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
        />
      )}
    </div>
  );
}

// ============================================
// WEB SERVICES FORM COMPONENT
// ============================================

interface WebServicesFormProps {
  selectedProvider: APIProvider;
  onProviderChange: (provider: APIProvider) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  markupType: MarkupType;
  onMarkupTypeChange: (type: MarkupType) => void;
  markupValue: number;
  onMarkupValueChange: (value: number) => void;
  filteredServices: MeeLikeService[];
  selectedServices: Map<string, SelectedWebService>;
  customPrices: Map<string, number>;
  onToggleService: (service: MeeLikeService) => void;
  onSelectAll: () => void;
  onUpdatePrice: (serviceId: string, price: number) => void;
  onResetPrice: (serviceId: string) => void;
  isAlreadyImported: (id: string) => boolean;
  availableCount: number;
  calculateSellPrice: (cost: number, customPrice?: number, useCustom?: boolean) => number;
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}

function WebServicesForm({
  selectedProvider,
  onProviderChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  markupType,
  onMarkupTypeChange,
  markupValue,
  onMarkupValueChange,
  filteredServices,
  selectedServices,
  customPrices,
  onToggleService,
  onSelectAll,
  onUpdatePrice,
  onResetPrice,
  isAlreadyImported,
  availableCount,
  calculateSellPrice,
  onSubmit,
  isSubmitting,
  canSubmit,
}: WebServicesFormProps) {
  // Step management: 1 = Selection, 2 = Configuration
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  
  // Local state for service types (since not all providers have this data)
  const [serviceTypes, setServiceTypes] = useState<Map<string, string>>(new Map());

  const updateServiceType = (serviceId: string, type: string) => {
    const newTypes = new Map(serviceTypes);
    newTypes.set(serviceId, type);
    setServiceTypes(newTypes);
  };

  const goToConfiguration = () => {
    if (selectedServices.size > 0) {
      setCurrentStep(2);
    }
  };

  const goBackToSelection = () => {
    setCurrentStep(1);
  };

  // Calculate total stats
  const totalProfit = Array.from(selectedServices.values()).reduce((sum, selected) => {
    if (!selected.useCustomPrice || selected.customSellPrice === undefined) return sum;
    const costPerUnit = getMeeLikeRatePerUnit(selected.meelikeService.rate);
    return sum + (selected.customSellPrice - costPerUnit);
  }, 0);

  const applyBulkMarkup = () => {
    const newSelection = new Map(selectedServices);
    newSelection.forEach((selected, serviceId) => {
      const costPerUnit = getMeeLikeRatePerUnit(selected.meelikeService.rate);
      const newPrice = markupType === "percent" 
        ? costPerUnit * (1 + markupValue / 100)
        : costPerUnit + markupValue;
      
      newSelection.set(serviceId, {
        ...selected,
        customSellPrice: newPrice,
        useCustomPrice: true,
      });
    });
    
    // Update all selected services with new prices
    selectedServices.clear();
    newSelection.forEach((value, key) => {
      selectedServices.set(key, value);
    });
    
    // Force re-render
    onMarkupValueChange(markupValue);
  };

  // Step 1: Selection view - services to choose from
  const renderSelectionStep = () => (
    <div className="space-y-4">
      {/* Summary Bar at Top */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-brand-text-light">จำนวนบริการที่เลือก</p>
              <p className="text-2xl font-bold text-brand-text-dark">{selectedServices.size} รายการ</p>
            </div>
          </div>
          <Button
            onClick={goToConfiguration}
            disabled={selectedServices.size === 0}
            size="lg"
          >
            ถัดไป: ตั้งค่าราคาและประเภท
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter - เด่นกว่า */}
          <div className="w-64">
            <label className="block text-sm font-semibold text-brand-text-dark mb-2">
              หมวดหมู่บริการ
            </label>
            <Select
              options={meeLikeCategories}
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="text-base font-medium"
            />
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-brand-text-light mb-2">
              ค้นหา
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-brand-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border/30">
                <th className="text-left p-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedServices.size === availableCount && availableCount > 0}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-brand-primary cursor-pointer"
                  />
                </th>
                <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider min-w-[300px]">บริการ</th>
                <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[120px]">ประเภท</th>
                <th className="text-right p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[100px]">ขั้นต่ำ</th>
                <th className="text-right p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[100px]">สูงสุด</th>
                <th className="text-right p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[120px]">ต้นทุน/1000</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {filteredServices.map((service) => {
                const isImported = isAlreadyImported(service.service);
                const selected = selectedServices.get(service.service);
                const isSelected = !!selected;
                const costPerUnit = getMeeLikeRatePerUnit(service.rate);
                // ใช้ customPrice ถ้ามี ไม่ว่าจะเลือกหรือไม่
                const hasCustomPrice = customPrices.has(service.service);
                const customPrice = customPrices.get(service.service);
                const sellPrice = calculateSellPrice(
                  costPerUnit, 
                  hasCustomPrice ? customPrice : selected?.customSellPrice, 
                  hasCustomPrice || selected?.useCustomPrice
                );
                const profit = sellPrice - costPerUnit;
                const profitPercent = (profit / costPerUnit) * 100;
                
                return (
                  <tr 
                    key={service.service}
                    className={`transition-colors ${
                      isImported 
                        ? "bg-gray-50 opacity-60" 
                        : isSelected 
                          ? "bg-blue-50/50" 
                          : "hover:bg-brand-bg/30"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3">
                      {isImported ? (
                        <div className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center">
                          <Check className="w-3 h-3 text-gray-500" />
                        </div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleService(service)}
                          className="w-4 h-4 rounded border-gray-300 text-brand-primary cursor-pointer"
                        />
                      )}
                    </td>
                    
                    {/* Service Name */}
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-brand-text-dark text-sm line-clamp-1">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {service.refill && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />Refill
                            </span>
                          )}
                          {service.cancel && (
                            <span className="text-xs text-orange-600 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />Cancel
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Type - Display only */}
                    <td className="p-3">
                      <span className="text-sm text-brand-text-light">{service.type}</span>
                    </td>
                    
                    {/* Min */}
                    <td className="p-3 text-right">
                      <span className="text-sm text-brand-text-dark">{parseInt(service.min).toLocaleString()}</span>
                    </td>
                    
                    {/* Max */}
                    <td className="p-3 text-right">
                      <span className="text-sm text-brand-text-dark">{parseInt(service.max).toLocaleString()}</span>
                    </td>
                    
                    {/* Cost */}
                    <td className="p-3 text-right">
                      <span className="text-sm font-medium text-brand-text-dark">
                        ฿{costPerUnit.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="p-12 text-center text-brand-text-light">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>ไม่พบบริการที่ค้นหา</p>
          </div>
        )}
      </Card>

    </div>
  );

  // Step 2: Configuration view - selected services with price/type settings
  const renderConfigurationStep = () => {
    const selectedList = Array.from(selectedServices.values());
    
    return (
      <div className="space-y-4">
        {/* Summary Bar at Top */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-brand-text-light">จำนวนบริการที่เลือก</p>
                <p className="text-2xl font-bold text-brand-text-dark">{selectedServices.size} รายการ</p>
              </div>
              {totalProfit > 0 && (
                <div className="pl-6 border-l border-brand-border/30">
                  <p className="text-sm text-brand-text-light">กำไรรวม/หน่วย</p>
                  <p className="text-2xl font-bold text-green-600">฿{totalProfit.toFixed(2)}</p>
                </div>
              )}
            </div>
            <Button
              onClick={onSubmit}
              disabled={!canSubmit}
              isLoading={isSubmitting}
              size="lg"
              leftIcon={<Plus className="w-5 h-5" />}
            >
              นำเข้า {selectedServices.size} บริการ
            </Button>
          </div>
        </Card>

        {/* Header with back button and Markup controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={goBackToSelection}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                กลับไปเลือกบริการ
              </Button>
            </div>

            {/* Bulk Markup Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-brand-text-light">Markup ทั้งหมด:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => onMarkupTypeChange("percent")}
                  className={`py-1.5 px-3 rounded text-sm font-medium transition-all ${
                    markupType === "percent"
                      ? "bg-brand-primary text-white"
                      : "bg-brand-bg text-brand-text-light"
                  }`}
                >
                  %
                </button>
                <button
                  onClick={() => onMarkupTypeChange("fixed")}
                  className={`py-1.5 px-3 rounded text-sm font-medium transition-all ${
                    markupType === "fixed"
                      ? "bg-brand-primary text-white"
                      : "bg-brand-bg text-brand-text-light"
                  }`}
                >
                  ฿
                </button>
              </div>
              <input
                type="number"
                value={markupValue}
                onChange={(e) => onMarkupValueChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-24 px-3 py-1.5 text-sm font-medium border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
              <button
                onClick={applyBulkMarkup}
                className="px-4 py-1.5 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
              >
                ปรับราคา
              </button>
            </div>
          </div>
        </Card>

        {/* Configuration Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-bg/50 border-b border-brand-border/30">
                  <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider">#</th>
                  <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider min-w-[250px]">บริการ</th>
                  <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[120px]">ประเภท</th>
                  <th className="text-right p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[100px]">ต้นทุน</th>
                  <th className="text-right p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[120px]">ราคาขาย</th>
                  <th className="text-center p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[100px]">กำไร</th>
                  <th className="text-center p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[80px]">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {selectedList.map((selected, index) => {
                  const service = selected.meelikeService;
                  const costPerUnit = getMeeLikeRatePerUnit(service.rate);
                  const hasCustomPrice = customPrices.has(service.service);
                  const customPrice = customPrices.get(service.service);
                  const sellPrice = calculateSellPrice(
                    costPerUnit, 
                    hasCustomPrice ? customPrice : selected?.customSellPrice, 
                    hasCustomPrice || selected?.useCustomPrice
                  );
                  const profit = sellPrice - costPerUnit;
                  const profitPercent = (profit / costPerUnit) * 100;

                  return (
                    <tr key={service.service} className="hover:bg-brand-bg/30 transition-colors">
                      {/* Row Number */}
                      <td className="p-3">
                        <span className="text-sm font-medium text-brand-text-light">{index + 1}</span>
                      </td>

                      {/* Service Name */}
                      <td className="p-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={service.name.includes("Facebook") ? "text-blue-600" : "text-pink-600"}>
                              {service.name.includes("Facebook") ? "●" : "●"}
                            </span>
                            <span className="font-medium text-brand-text-dark text-sm">
                              {service.name}
                            </span>
                          </div>
                          {(service.refill || service.cancel) && (
                            <div className="flex gap-2 mt-1 ml-4">
                              {service.refill && (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" />Refill
                                </span>
                              )}
                              {service.cancel && (
                                <span className="text-xs text-orange-600 flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />Cancel
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Type Dropdown */}
                      <td className="p-3">
                        <select
                          value={serviceTypes.get(service.service) || service.type}
                          onChange={(e) => updateServiceType(service.service, e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white text-brand-text-dark"
                        >
                          <option value="Likes">ไลค์</option>
                          <option value="Comments">คอมเมนต์</option>
                          <option value="Shares">แชร์</option>
                          <option value="Followers">ติดตาม</option>
                          <option value="Views">วิว</option>
                          <option value="Post Likes">ไลค์โพสต์</option>
                          <option value="Page Likes">ไลค์เพจ</option>
                        </select>
                      </td>

                      {/* Cost */}
                      <td className="p-3 text-right">
                        <span className="text-sm font-medium text-brand-text-dark">
                          ฿{costPerUnit.toFixed(2)}
                        </span>
                      </td>

                      {/* Sell Price Input */}
                      <td className="p-3">
                        <div>
                          <input
                            type="number"
                            value={hasCustomPrice ? customPrice : ""}
                            onChange={(e) => {
                              const price = parseFloat(e.target.value);
                              if (!isNaN(price) && price >= 0) {
                                onUpdatePrice(service.service, price);
                              }
                            }}
                            placeholder="0.00"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                              hasCustomPrice 
                                ? "border-blue-400 font-bold text-brand-primary bg-blue-50/30" 
                                : "border-brand-border font-medium text-brand-text-light"
                            }`}
                            step="0.01"
                            min="0"
                          />
                          {hasCustomPrice && (
                            <div className="text-right mt-1">
                              <button
                                onClick={() => onResetPrice(service.service)}
                                className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                รีเซ็ต
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Profit */}
                      <td className="p-3 text-center">
                        {hasCustomPrice && customPrice !== undefined ? (
                          <div className={`inline-flex flex-col items-center px-2 py-1 rounded-lg ${profit >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                            <span className={`text-sm font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                              ฿{profit.toFixed(2)}
                            </span>
                            <span className={`text-xs ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {profit >= 0 ? "+" : ""}{profitPercent.toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-brand-text-light text-sm">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onToggleService(service)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="ลบออก"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    );
  };

  // Main return: switch between steps
  return currentStep === 1 ? renderSelectionStep() : renderConfigurationStep();
}

// ============================================
// MANUAL SERVICES FORM COMPONENT
// ============================================

interface ManualServicesFormProps {
  rows: ManualServiceRow[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onDuplicateRow: (row: ManualServiceRow) => void;
  onUpdateRow: (id: string, field: keyof ManualServiceRow, value: string | number) => void;
  validCount: number;
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}

function ManualServicesForm({
  rows,
  onAddRow,
  onRemoveRow,
  onDuplicateRow,
  onUpdateRow,
  validCount,
  onSubmit,
  isSubmitting,
  canSubmit,
}: ManualServicesFormProps) {
  const platformOptions = Object.entries(PLATFORM_CONFIGS).map(([key, value]) => ({
    value: key,
    label: value.label,
  }));

  const serviceTypeOptions = Object.entries(SERVICE_TYPE_CONFIGS).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${value.label}`,
  }));

  // For manual services, we don't calculate profit here
  // (worker rate is set when creating jobs)
  const totalSellPrice = rows.reduce((sum, row) => {
    return sum + (row.sellPrice > 0 ? row.sellPrice : 0);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Summary Bar at Top */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-brand-text-light">จำนวนบริการที่กรอกแล้ว</p>
              <p className="text-2xl font-bold text-brand-text-dark">{validCount} รายการ</p>
            </div>
          </div>
          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            isLoading={isSubmitting}
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            เพิ่ม {validCount} บริการ
          </Button>
        </div>
      </Card>

      {/* Info Banner */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg shrink-0">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-purple-900">สร้างบริการงานกดมือ</p>
            <p className="text-sm text-purple-700 mb-2">เพิ่มหลายบริการพร้อมกัน กำหนดราคาขายลูกค้า</p>
            <div className="p-3 bg-white/60 rounded-lg border border-purple-200/50">
              <p className="text-xs font-medium text-purple-800 mb-1">💡 ค่าจ้าง Worker จะกรอกตอนสร้าง Job</p>
              <p className="text-xs text-purple-700">
                เพราะค่าจ้างแต่ละงานอาจไม่เท่ากัน (งานด่วนจ่ายมากกว่า ฯลฯ) • 
                กำไรจะคำนวณตอนสร้าง Job ให้ทีม
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border/30">
                <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-8">#</th>
                <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider min-w-[250px]">ชื่อบริการ</th>
                <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[130px]">แพลตฟอร์ม</th>
                <th className="text-left p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[130px]">ประเภท</th>
                <th className="text-right p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[120px]">ราคาขาย</th>
                <th className="text-right p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[100px]">ขั้นต่ำ</th>
                <th className="text-right p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[100px]">สูงสุด</th>
                <th className="text-center p-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider w-[80px]">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {rows.map((row, index) => {
                return (
                  <tr key={row.id} className="hover:bg-brand-bg/30 transition-colors">
                    {/* Row Number */}
                    <td className="p-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </td>
                    
                    {/* Service Name */}
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="เช่น ไลค์ Facebook คนไทยจริง"
                        value={row.name}
                        onChange={(e) => onUpdateRow(row.id, "name", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-brand-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </td>
                    
                    {/* Platform */}
                    <td className="p-2">
                      <select
                        value={row.platform}
                        onChange={(e) => onUpdateRow(row.id, "platform", e.target.value as Platform)}
                        className="w-full px-2 py-2 text-sm border border-brand-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white"
                      >
                        {platformOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    
                    {/* Service Type */}
                    <td className="p-2">
                      <select
                        value={row.serviceType}
                        onChange={(e) => onUpdateRow(row.id, "serviceType", e.target.value as ServiceType)}
                        className="w-full px-2 py-2 text-sm border border-brand-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white"
                      >
                        {serviceTypeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    
                    {/* Sell Price */}
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.40"
                        value={row.sellPrice > 0 ? row.sellPrice : ""}
                        onChange={(e) => onUpdateRow(row.id, "sellPrice", parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-2 text-sm text-right border border-brand-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                    </td>
                    
                    {/* Min Quantity */}
                    <td className="p-2">
                      <input
                        type="number"
                        placeholder="100"
                        value={row.minQty || ""}
                        onChange={(e) => onUpdateRow(row.id, "minQty", parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-2 text-sm text-right border border-brand-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                    </td>
                    
                    {/* Max Quantity */}
                    <td className="p-2">
                      <input
                        type="number"
                        placeholder="10000"
                        value={row.maxQty || ""}
                        onChange={(e) => onUpdateRow(row.id, "maxQty", parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-2 text-sm text-right border border-brand-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                    </td>
                    
                    {/* Actions */}
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onDuplicateRow(row)}
                          className="p-1.5 text-brand-text-light hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors"
                          title="คัดลอก"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {rows.length > 1 && (
                          <button
                            onClick={() => onRemoveRow(row.id)}
                            className="p-1.5 text-brand-text-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="p-3 border-t border-brand-border/30 bg-brand-bg/30">
          <button
            onClick={onAddRow}
            className="w-full py-2.5 border-2 border-dashed border-brand-border/50 rounded-xl text-sm font-medium text-brand-text-light hover:text-brand-primary hover:border-brand-primary/50 hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            เพิ่มแถวใหม่
          </button>
        </div>
      </Card>
    </div>
  );
}
