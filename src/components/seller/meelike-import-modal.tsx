"use client";

import { useState, useMemo } from "react";
import { Modal, Button, Input, Select, Badge } from "@/components/ui";
import { 
  mockMeeLikeServices, 
  meeLikeCategories,
  getMeeLikeRatePerUnit 
} from "@/lib/mock-data/meelike";
import { formatCurrency } from "@/lib/utils";
import type { MeeLikeService, StoreService, Platform, ServiceType } from "@/types";
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
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";

interface MeeLikeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (services: Partial<StoreService>[]) => void;
  existingServiceIds: string[]; // meelikeServiceId ที่มีอยู่แล้ว
}

// Map MeeLike category to our Platform type
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

// Map MeeLike type to our ServiceType
function mapTypeToServiceType(type: string): ServiceType {
  const typeLower = type.toLowerCase();
  if (typeLower.includes("like")) return "like";
  if (typeLower.includes("comment")) return "comment";
  if (typeLower.includes("follower") || typeLower.includes("subscriber")) return "follow";
  if (typeLower.includes("view")) return "view";
  if (typeLower.includes("share") || typeLower.includes("retweet")) return "share";
  return "like";
}

export function MeeLikeImportModal({ 
  isOpen, 
  onClose, 
  onImport,
  existingServiceIds 
}: MeeLikeImportModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [markupPercent, setMarkupPercent] = useState(30);
  const [isImporting, setIsImporting] = useState(false);

  // Filter services
  const filteredServices = useMemo(() => {
    return mockMeeLikeServices.filter(service => {
      // Category filter
      if (categoryFilter !== "all" && service.category !== categoryFilter) return false;
      
      // Search filter
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

  // Check if service is already imported
  const isAlreadyImported = (serviceId: string) => existingServiceIds.includes(serviceId);

  // Toggle selection
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

  // Select all visible
  const selectAll = () => {
    const available = filteredServices.filter(s => !isAlreadyImported(s.service));
    if (selectedServices.size === available.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(available.map(s => s.service)));
    }
  };

  // Calculate sell price with markup
  const calculateSellPrice = (costPerUnit: number) => {
    return costPerUnit * (1 + markupPercent / 100);
  };

  // Handle import
  const handleImport = async () => {
    setIsImporting(true);
    
    const servicesToImport: Partial<StoreService>[] = [];
    
    selectedServices.forEach(serviceId => {
      const meelikeService = mockMeeLikeServices.find(s => s.service === serviceId);
      if (!meelikeService) return;
      
      const costPerUnit = getMeeLikeRatePerUnit(meelikeService.rate);
      const sellPrice = calculateSellPrice(costPerUnit);
      
      servicesToImport.push({
        name: meelikeService.name.replace(/^[🔵📸🎵▶️🐦]\s*/, ''), // Remove emoji prefix
        description: meelikeService.description,
        category: mapCategoryToPlatform(meelikeService.category),
        type: mapTypeToServiceType(meelikeService.type),
        serviceType: "bot", // MeeLike services are always bot
        costPrice: costPerUnit,
        sellPrice: sellPrice,
        minQuantity: parseInt(meelikeService.min),
        maxQuantity: parseInt(meelikeService.max),
        meelikeServiceId: meelikeService.service,
        estimatedTime: meelikeService.averageTime,
        isActive: true,
        showInStore: true,
      });
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onImport(servicesToImport);
    setIsImporting(false);
    setSelectedServices(new Set());
    onClose();
  };

  const availableCount = filteredServices.filter(s => !isAlreadyImported(s.service)).length;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="นำเข้าบริการจาก MeeLike" 
      size="xl"
    >
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">นำเข้าบริการงานเว็บอัตโนมัติ</p>
              <p className="text-xs text-blue-700 mt-0.5">
                เลือกบริการจาก MeeLike API แล้วตั้งราคาขาย (Markup) ระบบจะสร้างบริการให้อัตโนมัติ
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-text-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>
          </div>
          <Select
            options={meeLikeCategories}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
              onChange={(e) => setMarkupPercent(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 px-2 py-1 text-center text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
            <span className="text-sm text-brand-text-light">%</span>
          </div>
        </div>

        {/* Services List */}
        <div className="border border-brand-border/50 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-brand-bg/80 backdrop-blur-sm border-b border-brand-border/50 p-3 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedServices.size === availableCount && availableCount > 0}
                onChange={selectAll}
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

          {/* Services */}
          <div className="divide-y divide-brand-border/30">
            {filteredServices.map((service) => {
              const isImported = isAlreadyImported(service.service);
              const isSelected = selectedServices.has(service.service);
              const costPerUnit = getMeeLikeRatePerUnit(service.rate);
              const sellPrice = calculateSellPrice(costPerUnit);
              
              return (
                <div
                  key={service.service}
                  onClick={() => toggleService(service.service)}
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
                    
                    {/* Features */}
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
                    
                    {/* Cost info */}
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-border/50">
          <div className="text-sm text-brand-text-light">
            {selectedServices.size > 0 && (
              <span>
                กำไรรวมโดยประมาณ: <span className="font-medium text-brand-success">+{markupPercent}%</span> จากต้นทุน
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button 
              onClick={handleImport}
              disabled={selectedServices.size === 0}
              isLoading={isImporting}
              leftIcon={<Download className="w-4 h-4" />}
            >
              นำเข้า {selectedServices.size} บริการ
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
