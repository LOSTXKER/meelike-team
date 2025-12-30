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
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<StoreService | null>(null);
  const [filter, setFilter] = useState<"all" | "bot" | "human">("all");

  const filteredServices = services.filter((service) => {
    if (filter === "all") return true;
    return service.serviceType === filter;
  });

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="จัดการบริการ"
        description="จัดการบริการ Bot และคนจริงที่เปิดขายในร้าน"
        icon={Package}
        action={
          <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            เพิ่มบริการใหม่
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="bordered">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-text-dark">
              {services.length}
            </p>
            <p className="text-sm text-brand-text-light">บริการทั้งหมด</p>
          </div>
        </Card>
        <Card variant="bordered">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-info">
              {botServices.length}
            </p>
            <p className="text-sm text-brand-text-light">Bot</p>
          </div>
        </Card>
        <Card variant="bordered">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-success">
              {humanServices.length}
            </p>
            <p className="text-sm text-brand-text-light">คนจริง</p>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { value: "all", label: "ทั้งหมด" },
          { value: "bot", label: "Bot" },
          { value: "human", label: "คนจริง" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value as typeof filter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === item.value
                ? "bg-brand-primary text-white"
                : "bg-brand-surface border border-brand-border text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            variant="bordered"
            className={!service.isActive ? "opacity-60" : ""}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div>
                  <h3 className="font-semibold text-brand-text-dark">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <ServiceTypeBadge type={service.serviceType} />
                    <Badge
                      variant={service.isActive ? "success" : "outline"}
                      size="sm"
                    >
                      {service.isActive ? "เปิด" : "ปิด"}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleService(service.id)}
                className="text-brand-text-light hover:text-brand-primary transition-colors"
              >
                {service.isActive ? (
                  <ToggleRight className="w-6 h-6 text-brand-success" />
                ) : (
                  <ToggleLeft className="w-6 h-6" />
                )}
              </button>
            </div>

            {service.description && (
              <p className="text-sm text-brand-text-light mb-3">
                {service.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 py-3 border-t border-brand-border">
              <div>
                <p className="text-xs text-brand-text-light">ต้นทุน</p>
                <p className="font-medium text-brand-text-dark">
                  {formatCurrency(service.costPrice)}/{service.type === "view" ? "view" : "หน่วย"}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-text-light">ราคาขาย</p>
                <p className="font-medium text-brand-primary">
                  {formatCurrency(service.sellPrice)}/{service.type === "view" ? "view" : "หน่วย"}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-text-light">กำไร</p>
                <p className="font-medium text-brand-success">
                  {Math.round(
                    ((service.sellPrice - service.costPrice) / service.costPrice) *
                      100
                  )}
                  %
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-text-light">ขั้นต่ำ - สูงสุด</p>
                <p className="font-medium text-brand-text-dark">
                  {service.minQuantity} - {service.maxQuantity.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-brand-border">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingService(service);
                  setIsModalOpen(true);
                }}
                leftIcon={<Edit2 className="w-4 h-4" />}
              >
                แก้ไข
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-brand-error hover:bg-brand-error/10"
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                ลบ
              </Button>
            </div>
          </Card>
        ))}
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
        <form className="space-y-4">
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
                { value: "facebook", label: "Facebook", icon: <Facebook className="w-4 h-4" /> },
                { value: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
                { value: "tiktok", label: "TikTok", icon: <Music2 className="w-4 h-4" /> },
                { value: "youtube", label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
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

