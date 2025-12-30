"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Badge, Button, Input, Select, Textarea } from "@/components/ui";
import { PageHeader, PlatformIcon, ServiceTypeBadge } from "@/components/shared";
import { mockServices } from "@/lib/mock-data";
import type { Platform, ServiceMode } from "@/types";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingCart,
  User,
  MessageSquare,
  Link as LinkIcon,
  Package,
  Calculator,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  serviceId: string;
  serviceName: string;
  platform: string;
  targetUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  commentTemplates?: string;
}

const contactTypes = [
  { value: "line", label: "LINE" },
  { value: "facebook", label: "Facebook" },
  { value: "phone", label: "โทรศัพท์" },
  { value: "email", label: "Email" },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [contactType, setContactType] = useState("line");
  const [contactValue, setContactValue] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  
  // Order items
  const [items, setItems] = useState<OrderItem[]>([]);
  
  // Add item form
  const [selectedService, setSelectedService] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [quantity, setQuantity] = useState("");
  const [commentTemplates, setCommentTemplates] = useState("");

  const handleAddItem = () => {
    if (!selectedService || !targetUrl || !quantity) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const service = mockServices.find((s) => s.id === selectedService);
    if (!service) return;

    const qty = parseInt(quantity);
    if (qty < service.minQuantity || qty > service.maxQuantity) {
      alert(`จำนวนต้องอยู่ระหว่าง ${service.minQuantity} - ${service.maxQuantity}`);
      return;
    }

    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      serviceId: service.id,
      serviceName: service.name,
      platform: service.category,
      targetUrl,
      quantity: qty,
      unitPrice: service.sellPrice,
      subtotal: qty * service.sellPrice,
      commentTemplates: service.type === "comment" ? commentTemplates : undefined,
    };

    setItems([...items, newItem]);
    
    // Reset form
    setSelectedService("");
    setTargetUrl("");
    setQuantity("");
    setCommentTemplates("");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async () => {
    if (!customerName || !contactValue) {
      alert("กรุณากรอกข้อมูลลูกค้า");
      return;
    }

    if (items.length === 0) {
      alert("กรุณาเพิ่มบริการอย่างน้อย 1 รายการ");
      return;
    }

    setIsSubmitting(true);

    // Mock create order
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    setTimeout(() => {
      alert(`สร้างออเดอร์ ${orderNumber} เรียบร้อย!\nยอดรวม: ฿${calculateTotal().toLocaleString()}`);
      router.push("/seller/orders");
    }, 1000);
  };

  const selectedServiceData = mockServices.find((s) => s.id === selectedService);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/orders">
          <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
          </button>
        </Link>
        <PageHeader
          title="สร้างออเดอร์ใหม่"
          description="สร้างออเดอร์แบบ Manual สำหรับลูกค้า"
          icon={ShoppingCart}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card variant="bordered" padding="lg">
            <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary" />
              ข้อมูลลูกค้า
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="ชื่อลูกค้า *"
                placeholder="เช่น คุณสมชาย"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Select
                label="ช่องทางติดต่อ"
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                options={contactTypes}
              />
              <Input
                label="ข้อมูลติดต่อ *"
                placeholder={
                  contactType === "line"
                    ? "@line_id"
                    : contactType === "phone"
                    ? "08x-xxx-xxxx"
                    : "ข้อมูลติดต่อ"
                }
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="หมายเหตุ (ถ้ามี)"
                  placeholder="หมายเหตุจากลูกค้า..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Add Service */}
          <Card variant="bordered" padding="lg">
            <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-primary" />
              เพิ่มบริการ
            </h2>

            <div className="space-y-4">
              <Select
                label="เลือกบริการ *"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                options={[
                  { value: "", label: "-- เลือกบริการ --" },
                  ...mockServices.map((s) => ({
                    value: s.id,
                    label: `${s.name} (฿${s.sellPrice}/หน่วย)`,
                  })),
                ]}
              />

              {selectedServiceData && (
                <div className="p-3 bg-brand-info/10 rounded-lg text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ServiceTypeBadge type={selectedServiceData.serviceType} />
                    <span className="text-brand-text-dark font-medium">
                      {selectedServiceData.name}
                    </span>
                  </div>
                  <p className="text-brand-text-light">
                    ราคา: <span className="text-brand-primary font-medium">฿{selectedServiceData.sellPrice}</span> / หน่วย
                    {" • "}
                    ขั้นต่ำ {selectedServiceData.minQuantity.toLocaleString()} - สูงสุด {selectedServiceData.maxQuantity.toLocaleString()}
                  </p>
                </div>
              )}

              <Input
                label="URL เป้าหมาย *"
                placeholder="https://facebook.com/post/xxx หรือ https://instagram.com/p/xxx"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                leftIcon={<LinkIcon className="w-4 h-4" />}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="จำนวน *"
                  type="number"
                  placeholder={
                    selectedServiceData
                      ? `${selectedServiceData.minQuantity} - ${selectedServiceData.maxQuantity}`
                      : "จำนวน"
                  }
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={selectedServiceData?.minQuantity}
                  max={selectedServiceData?.maxQuantity}
                />
                <div className="flex items-end">
                  <div className="p-3 bg-brand-bg rounded-lg flex-1">
                    <p className="text-xs text-brand-text-light">ราคารวม</p>
                    <p className="text-xl font-bold text-brand-primary">
                      ฿{(parseInt(quantity || "0") * (selectedServiceData?.sellPrice || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedServiceData?.type === "comment" && (
                <Textarea
                  label="ข้อความเม้น (บรรทัดละ 1 เม้น)"
                  placeholder="สินค้าดีมากครับ&#10;แนะนำเลยค่ะ&#10;ชอบมากๆ"
                  value={commentTemplates}
                  onChange={(e) => setCommentTemplates(e.target.value)}
                  rows={4}
                />
              )}

              <Button onClick={handleAddItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มรายการ
              </Button>
            </div>
          </Card>

          {/* Order Items */}
          {items.length > 0 && (
            <Card variant="bordered" padding="lg">
              <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-primary" />
                รายการสั่งซื้อ ({items.length})
              </h2>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-brand-bg rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={item.platform as Platform} size="lg" />
                      <div>
                        <p className="font-medium text-brand-text-dark">
                          {index + 1}. {item.serviceName}
                        </p>
                        <p className="text-sm text-brand-text-light truncate max-w-xs">
                          {item.targetUrl}
                        </p>
                        <p className="text-sm text-brand-text-light">
                          {item.quantity.toLocaleString()} x ฿{item.unitPrice}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-brand-primary text-lg">
                        ฿{item.subtotal.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-brand-error hover:bg-brand-error/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card variant="bordered" padding="lg">
              <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-brand-primary" />
                สรุปออเดอร์
              </h2>

              <div className="space-y-3">
                {/* Customer Summary */}
                {customerName && (
                  <div className="p-3 bg-brand-bg rounded-lg">
                    <p className="text-sm text-brand-text-light">ลูกค้า</p>
                    <p className="font-medium text-brand-text-dark">
                      {customerName}
                    </p>
                    {contactValue && (
                      <p className="text-sm text-brand-text-light">
                        {contactType.toUpperCase()}: {contactValue}
                      </p>
                    )}
                  </div>
                )}

                {/* Items Summary */}
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <div className="text-center py-6 text-brand-text-light">
                      <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">ยังไม่มีรายการ</p>
                    </div>
                  ) : (
                    items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-brand-text-light truncate max-w-[150px]">
                          {index + 1}. {item.serviceName}
                        </span>
                        <span className="text-brand-text-dark font-medium">
                          ฿{item.subtotal.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-brand-border">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-text-light">รวมทั้งสิ้น</span>
                    <span className="text-2xl font-bold text-brand-primary">
                      ฿{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || items.length === 0}
                  className="w-full mt-4"
                  size="lg"
                >
                  {isSubmitting ? (
                    "กำลังสร้าง..."
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      สร้างออเดอร์
                    </>
                  )}
                </Button>

                {items.length === 0 && (
                  <p className="text-xs text-center text-brand-text-light">
                    กรุณาเพิ่มบริการอย่างน้อย 1 รายการ
                  </p>
                )}
              </div>
            </Card>

            {/* Tips */}
            <Card variant="bordered" padding="md" className="bg-brand-info/5">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-brand-info shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-brand-text-dark mb-1">
                    เคล็ดลับ
                  </p>
                  <ul className="text-brand-text-light space-y-1">
                    <li>• สามารถเพิ่มหลายบริการในออเดอร์เดียวได้</li>
                    <li>• ตรวจสอบ URL ให้ถูกต้องก่อนสร้างออเดอร์</li>
                    <li>• ลูกค้าจะได้รับลิงก์ติดตามสถานะอัตโนมัติ</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

