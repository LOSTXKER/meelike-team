"use client";

import { useState, useMemo } from "react";
import { Button, Input, Select, Textarea, Badge } from "@/components/ui";
import { Dialog } from "@/components/ui/Dialog";
import { PlatformIcon } from "./platform-icon";
import { ServiceTypeIcon } from "./service-type-icon";
import { 
  mockMeeLikeServices, 
  meeLikeCategories,
  getMeeLikeRatePerUnit 
} from "@/lib/constants/meelike";
import { PLATFORM_CONFIGS, SERVICE_TYPE_CONFIGS, VISIBILITY_OPTIONS } from "@/lib/constants/services";
import { formatCurrency } from "@/lib/utils";
import type { MeeLikeService, StoreService, Platform, ServiceType, ServiceMode } from "@/types";
import {
  Search,
  Download,
  Check,
  Zap,
  RefreshCw,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Bot,
  Users,
  Plus,
  Trash2,
  Copy,
  Globe,
  Server,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface ServiceAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddServices: (services: Partial<StoreService>[]) => void;
  existingMeeLikeIds: string[];
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

type ServiceTab = "web" | "manual";
type APIProvider = "meelike" | "other";

// ============================================
// API PROVIDERS CONFIG
// ============================================

const API_PROVIDERS = [
  {
    id: "meelike" as APIProvider,
    name: "MeeLike",
    description: "บริการหลักที่รองรับ",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    isAvailable: true,
  },
  {
    id: "other" as APIProvider,
    name: "เพิ่ม Provider ใหม่",
    description: "เร็วๆ นี้",
    icon: Server,
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    isAvailable: false,
  },
];

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
    estimatedTime: "",
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ServiceAddModal({ 
  isOpen, 
  onClose, 
  onAddServices,
  existingMeeLikeIds 
}: ServiceAddModalProps) {
  // Tab State
  const [activeTab, setActiveTab] = useState<ServiceTab>("web");
  
  // Web Services State
  const [selectedProvider, setSelectedProvider] = useState<APIProvider>("meelike");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [markupPercent, setMarkupPercent] = useState(30);
  
  // Manual Services State
  const [manualRows, setManualRows] = useState<ManualServiceRow[]>([createEmptyManualRow()]);
  
  // Loading
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const toggleService = (serviceId: string) => {
    if (isAlreadyImported(serviceId)) return;
    const newSelection = new Set(selectedServices);
    if (newSelection.has(serviceId)) {
      newSelection.delete(serviceId);
    } else {
      newSelection.add(serviceId);
    }
    setSelectedServices(newSelection);
  };

  const selectAllWeb = () => {
    const available = filteredServices.filter(s => !isAlreadyImported(s.service));
    if (selectedServices.size === available.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(available.map(s => s.service)));
    }
  };

  const calculateSellPrice = (costPerUnit: number) => {
    return costPerUnit * (1 + markupPercent / 100);
  };

  // ============================================
  // MANUAL SERVICES LOGIC
  // ============================================

  const addManualRow = () => {
    setManualRows([...manualRows, createEmptyManualRow()]);
  };

  const removeManualRow = (id: string) => {
    if (manualRows.length <= 1) return;
    setManualRows(manualRows.filter(r => r.id !== id));
  };

  const duplicateManualRow = (row: ManualServiceRow) => {
    const newRow = { ...row, id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    const index = manualRows.findIndex(r => r.id === row.id);
    const newRows = [...manualRows];
    newRows.splice(index + 1, 0, newRow);
    setManualRows(newRows);
  };

  const updateManualRow = (id: string, field: keyof ManualServiceRow, value: string | number) => {
    setManualRows(manualRows.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const validManualRows = manualRows.filter(r => r.name.trim() !== "");

  // ============================================
  // SUBMIT HANDLERS
  // ============================================

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const servicesToAdd: Partial<StoreService>[] = [];
    
    if (activeTab === "web") {
      // Import from API
      selectedServices.forEach(serviceId => {
        const meelikeService = mockMeeLikeServices.find(s => s.service === serviceId);
        if (!meelikeService) return;
        
        const costPerUnit = getMeeLikeRatePerUnit(meelikeService.rate);
        const sellPrice = calculateSellPrice(costPerUnit);
        
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
      // Manual services - ไม่ต้องกรอก workerRate ตอนสร้างบริการ
      validManualRows.forEach(row => {
        servicesToAdd.push({
          name: row.name,
          description: row.description,
          platform: row.platform,
          serviceType: row.serviceType,
          mode: "human",
          sellPrice: row.sellPrice,
          minQty: row.minQty,
          maxQty: row.maxQty,
          estimatedTime: row.estimatedTime,
          isActive: true,
          showInStore: true,
        });
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAddServices(servicesToAdd);
    setIsSubmitting(false);
    
    // Reset state
    setSelectedServices(new Set());
    setManualRows([createEmptyManualRow()]);
    onClose();
  };

  const availableCount = filteredServices.filter(s => !isAlreadyImported(s.service)).length;
  const canSubmit = activeTab === "web" ? selectedServices.size > 0 : validManualRows.length > 0;

  // ============================================
  // RENDER
  // ============================================

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title>เพิ่มบริการใหม่</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex bg-brand-bg/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("web")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === "web"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            <Bot className="w-4 h-4" />
            งานเว็บ (API)
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === "manual"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            <Users className="w-4 h-4" />
            งานกดมือ
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "web" ? (
          <WebServicesTab
            providers={API_PROVIDERS}
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            markupPercent={markupPercent}
            onMarkupChange={setMarkupPercent}
            filteredServices={filteredServices}
            selectedServices={selectedServices}
            onToggleService={toggleService}
            onSelectAll={selectAllWeb}
            isAlreadyImported={isAlreadyImported}
            availableCount={availableCount}
            calculateSellPrice={calculateSellPrice}
          />
        ) : (
          <ManualServicesTab
            rows={manualRows}
            onAddRow={addManualRow}
            onRemoveRow={removeManualRow}
            onDuplicateRow={duplicateManualRow}
            onUpdateRow={updateManualRow}
          />
        )}

      </div>
      </Dialog.Body>
      <Dialog.Footer>
          <div className="text-sm text-brand-text-light">
            {activeTab === "web" && selectedServices.size > 0 && (
              <span>เลือก {selectedServices.size} บริการ • กำไร +{markupPercent}%</span>
            )}
            {activeTab === "manual" && validManualRows.length > 0 && (
              <span>เพิ่ม {validManualRows.length} บริการ</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!canSubmit}
              isLoading={isSubmitting}
              leftIcon={activeTab === "web" ? <Download className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {activeTab === "web" 
                ? `นำเข้า ${selectedServices.size} บริการ` 
                : `เพิ่ม ${validManualRows.length} บริการ`
              }
            </Button>
          </div>
      </Dialog.Footer>
    </Dialog>
  );
}

// ============================================
// WEB SERVICES TAB COMPONENT
// ============================================

interface WebServicesTabProps {
  providers: typeof API_PROVIDERS;
  selectedProvider: APIProvider;
  onProviderChange: (provider: APIProvider) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  markupPercent: number;
  onMarkupChange: (value: number) => void;
  filteredServices: MeeLikeService[];
  selectedServices: Set<string>;
  onToggleService: (id: string) => void;
  onSelectAll: () => void;
  isAlreadyImported: (id: string) => boolean;
  availableCount: number;
  calculateSellPrice: (cost: number) => number;
}

function WebServicesTab({
  providers,
  selectedProvider,
  onProviderChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  markupPercent,
  onMarkupChange,
  filteredServices,
  selectedServices,
  onToggleService,
  onSelectAll,
  isAlreadyImported,
  availableCount,
  calculateSellPrice,
}: WebServicesTabProps) {
  return (
    <div className="space-y-4">
      {/* Provider Selection */}
      <div>
        <label className="text-xs font-medium text-brand-text-light mb-2 block">
          เลือก API Provider
        </label>
        <div className="grid grid-cols-2 gap-3">
          {providers.map(provider => (
            <button
              key={provider.id}
              onClick={() => provider.isAvailable && onProviderChange(provider.id)}
              disabled={!provider.isAvailable}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                selectedProvider === provider.id
                  ? `${provider.borderColor} ${provider.bgColor}`
                  : provider.isAvailable
                    ? "border-brand-border/50 hover:border-brand-border"
                    : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${provider.bgColor}`}>
                  <provider.icon className={`w-4 h-4 ${provider.color}`} />
                </div>
                <div>
                  <p className="font-medium text-sm text-brand-text-dark">{provider.name}</p>
                  <p className="text-xs text-brand-text-light">{provider.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedProvider === "meelike" && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 text-brand-text-light absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาบริการ..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
            </div>
            <Select
              options={meeLikeCategories}
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>

          {/* Markup Setting */}
          <div className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-text-dark">Markup ราคาขาย</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={markupPercent}
                onChange={(e) => onMarkupChange(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 px-2 py-1 text-center text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
              <span className="text-sm text-brand-text-light">%</span>
            </div>
          </div>

          {/* Services List */}
          <div className="border border-brand-border/50 rounded-xl overflow-hidden max-h-[350px] overflow-y-auto">
            <div className="sticky top-0 bg-brand-bg/80 backdrop-blur-sm border-b border-brand-border/50 p-3 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedServices.size === availableCount && availableCount > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-brand-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-brand-text-dark">
                  เลือกทั้งหมด ({availableCount} รายการ)
                </span>
              </label>
              <span className="text-xs text-brand-text-light">
                เลือก {selectedServices.size} รายการ
              </span>
            </div>

            <div className="divide-y divide-brand-border/30">
              {filteredServices.map((service) => {
                const isImported = isAlreadyImported(service.service);
                const isSelected = selectedServices.has(service.service);
                const costPerUnit = getMeeLikeRatePerUnit(service.rate);
                const sellPrice = calculateSellPrice(costPerUnit);
                
                return (
                  <div
                    key={service.service}
                    onClick={() => onToggleService(service.service)}
                    className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                      isImported 
                        ? "bg-gray-50 opacity-60 cursor-not-allowed" 
                        : isSelected 
                          ? "bg-brand-primary/5" 
                          : "hover:bg-brand-bg/30"
                    }`}
                  >
                    <div className="pt-0.5">
                      {isImported ? (
                        <div className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center">
                          <Check className="w-3 h-3 text-gray-500" />
                        </div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-gray-300 text-brand-primary cursor-pointer"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-brand-text-dark line-clamp-1">
                            {service.name}
                          </p>
                          <p className="text-xs text-brand-text-light mt-0.5">
                            {service.type} • {parseInt(service.min).toLocaleString()} - {parseInt(service.max).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-brand-text-light">ราคาขาย</p>
                          <p className="text-sm font-bold text-brand-primary">
                            {formatCurrency(sellPrice)}<span className="text-xs font-normal">/หน่วย</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {service.refill && (
                          <Badge variant="success" size="sm" className="text-[10px]">
                            <RefreshCw className="w-2.5 h-2.5 mr-0.5" />
                            Refill
                          </Badge>
                        )}
                        {service.cancel && (
                          <Badge variant="warning" size="sm" className="text-[10px]">
                            <XCircle className="w-2.5 h-2.5 mr-0.5" />
                            Cancel
                          </Badge>
                        )}
                        {service.averageTime && (
                          <Badge variant="default" size="sm" className="text-[10px]">
                            <Clock className="w-2.5 h-2.5 mr-0.5" />
                            {service.averageTime}
                          </Badge>
                        )}
                        {isImported && (
                          <Badge variant="info" size="sm" className="text-[10px]">
                            นำเข้าแล้ว
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs text-brand-text-light">
                        <span>
                          ต้นทุน: <span className="font-medium">{formatCurrency(costPerUnit)}</span>
                        </span>
                        <span>•</span>
                        <span className="text-brand-success">
                          กำไร: <span className="font-medium">+{markupPercent}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredServices.length === 0 && (
              <div className="p-8 text-center text-brand-text-light">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>ไม่พบบริการที่ค้นหา</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// MANUAL SERVICES TAB COMPONENT
// ============================================

interface ManualServicesTabProps {
  rows: ManualServiceRow[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onDuplicateRow: (row: ManualServiceRow) => void;
  onUpdateRow: (id: string, field: keyof ManualServiceRow, value: string | number) => void;
}

function ManualServicesTab({
  rows,
  onAddRow,
  onRemoveRow,
  onDuplicateRow,
  onUpdateRow,
}: ManualServicesTabProps) {
  const platformOptions = Object.entries(PLATFORM_CONFIGS).map(([key, value]) => ({
    value: key,
    label: value.label,
  }));

  const serviceTypeOptions = Object.entries(SERVICE_TYPE_CONFIGS).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${value.label}`,
  }));

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg shrink-0">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-900">สร้างบริการงานกดมือ</p>
            <p className="text-xs text-purple-700 mt-0.5">
              เพิ่มหลายบริการพร้อมกัน กำหนดราคาขายลูกค้า งานจะกระจายให้ทีมคนทำงาน
            </p>
            <p className="text-xs text-purple-600 mt-1 font-medium">
              💡 ค่าจ้าง Worker จะกรอกตอนสร้าง Job (แต่ละงานอาจไม่เท่ากัน)
            </p>
          </div>
        </div>
      </div>

       {/* Services List */}
       <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
         {rows.map((row, index) => (
           <div 
             key={row.id} 
             className="p-5 bg-white rounded-xl border border-brand-border/50 shadow-sm space-y-4"
           >
             {/* Row Header */}
             <div className="flex items-center justify-between pb-3 border-b border-brand-border/30">
               <span className="text-sm font-semibold text-brand-text-dark">
                 บริการที่ {index + 1}
               </span>
               <div className="flex items-center gap-2">
                 <button
                   onClick={() => onDuplicateRow(row)}
                   className="px-3 py-1.5 text-xs font-medium text-brand-text-dark hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors flex items-center gap-1"
                   title="คัดลอก"
                 >
                   <Copy className="w-3.5 h-3.5" />
                   คัดลอก
                 </button>
                 {rows.length > 1 && (
                   <button
                     onClick={() => onRemoveRow(row.id)}
                     className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                     title="ลบ"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                     ลบ
                   </button>
                 )}
               </div>
             </div>

             {/* Row 1: Name */}
             <div>
               <Input
                 label="ชื่อบริการ"
                 placeholder="เช่น ไลค์ Facebook คนไทยจริง"
                 value={row.name}
                 onChange={(e) => onUpdateRow(row.id, "name", e.target.value)}
               />
             </div>

             {/* Row 2: Platform + Type */}
             <div className="grid grid-cols-2 gap-3">
               <Select
                 label="แพลตฟอร์ม"
                 options={platformOptions}
                 value={row.platform}
                 onChange={(e) => onUpdateRow(row.id, "platform", e.target.value as Platform)}
               />
               <Select
                 label="ประเภท"
                 options={serviceTypeOptions}
                 value={row.serviceType}
                 onChange={(e) => onUpdateRow(row.id, "serviceType", e.target.value as ServiceType)}
               />
             </div>

             {/* Row 3: Sell Price */}
             <div>
               <Input
                 label="ราคาขายลูกค้า (บาท/หน่วย)"
                 type="number"
                 step="0.01"
                 placeholder="0.40"
                 value={row.sellPrice || ""}
                 onChange={(e) => onUpdateRow(row.id, "sellPrice", parseFloat(e.target.value) || 0)}
               />
               <p className="text-xs text-brand-text-light mt-1">
                 ค่าจ้าง Worker จะกรอกตอนสร้าง Job
               </p>
             </div>

             {/* Row 4: Quantities */}
             <div className="grid grid-cols-2 gap-3">
               <Input
                 label="จำนวนขั้นต่ำ"
                 type="number"
                 placeholder="100"
                 value={row.minQty || ""}
                 onChange={(e) => onUpdateRow(row.id, "minQty", parseInt(e.target.value) || 0)}
               />
               <Input
                 label="จำนวนสูงสุด"
                 type="number"
                 placeholder="10000"
                 value={row.maxQty || ""}
                 onChange={(e) => onUpdateRow(row.id, "maxQty", parseInt(e.target.value) || 0)}
               />
             </div>

             {/* Row 5: Estimated Time */}
             <div>
               <Input
                 label="เวลาส่งมอบโดยประมาณ"
                 placeholder="เช่น 24-48 ชม."
                 value={row.estimatedTime}
                 onChange={(e) => onUpdateRow(row.id, "estimatedTime", e.target.value)}
               />
             </div>

          </div>
        ))}
      </div>

      {/* Add Row Button */}
      <button
        onClick={onAddRow}
        className="w-full py-3 border-2 border-dashed border-brand-border/50 rounded-xl text-sm font-medium text-brand-text-light hover:text-brand-primary hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        เพิ่มบริการอีก
      </button>
    </div>
  );
}
