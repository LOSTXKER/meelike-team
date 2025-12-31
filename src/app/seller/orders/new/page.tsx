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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/orders">
          <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <PageHeader
          title="สร้างออเดอร์ใหม่"
          description="สร้างออเดอร์แบบ Manual สำหรับลูกค้าที่สั่งซื้อผ่านแชท"
          icon={ShoppingCart}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <User className="w-5 h-5" />
              </div>
              ข้อมูลลูกค้า
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="ชื่อลูกค้า *"
                placeholder="เช่น คุณสมชาย"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="rounded-xl border-brand-border/50 focus:ring-brand-primary/10"
              />
              <Select
                label="ช่องทางติดต่อ"
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                options={contactTypes}
                className="rounded-xl border-brand-border/50 focus:ring-brand-primary/10"
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
                className="rounded-xl border-brand-border/50 focus:ring-brand-primary/10"
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="หมายเหตุ (ถ้ามี)"
                  placeholder="หมายเหตุจากลูกค้า..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  rows={2}
                  className="rounded-xl border-brand-border/50 focus:ring-brand-primary/10"
                />
              </div>
            </div>
          </Card>

          {/* Add Service */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-secondary flex items-center justify-center text-brand-primary">
                <Package className="w-5 h-5" />
              </div>
              เพิ่มบริการ
            </h2>

            <div className="space-y-5">
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
                className="rounded-xl border-brand-border/50 focus:ring-brand-primary/10"
              />

              {selectedServiceData && (
                <div className="p-4 bg-brand-bg/50 border border-brand-border/30 rounded-xl text-sm animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <ServiceTypeBadge type={selectedServiceData.serviceType} />
                    <span className="text-brand-text-dark font-bold text-base">
                      {selectedServiceData.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-brand-text-light mt-2">
                     <span className="flex items-center gap-1">
                        <span className="font-medium text-brand-primary">฿{selectedServiceData.sellPrice}</span>
                        / หน่วย
                     </span>
                     <span className="w-px h-4 bg-brand-border/50 self-center"></span>
                     <span>
                        ขั้นต่ำ <b>{selectedServiceData.minQuantity.toLocaleString()}</b>
                     </span>
                     <span className="w-px h-4 bg-brand-border/50 self-center"></span>
                     <span>
                        สูงสุด <b>{selectedServiceData.maxQuantity.toLocaleString()}</b>
                     </span>
                  </div>
                </div>
              )}

              <Input
                label="URL เป้าหมาย *"
                placeholder="https://facebook.com/post/xxx หรือ https://instagram.com/p/xxx"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                leftIcon={<LinkIcon className="w-4 h-4 text-brand-text-light" />}
                className="rounded-xl border-brand-border/50 focus:ring-brand-primary/10"
              />

              <div className="grid sm:grid-cols-2 gap-5">
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
                  className="rounded-xl border-brand-border/50 focus:ring-brand-primary/10"
                />
                <div className="flex items-end">
                  <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex-1">
                    <p className="text-xs text-brand-text-light font-medium uppercase tracking-wide">ราคารวม</p>
                    <p className="text-2xl font-bold text-brand-primary mt-1">
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
                  className="rounded-xl border-brand-border/50 focus:ring-brand-primary/10 font-mono text-sm"
                />
              )}

              <Button onClick={handleAddItem} className="w-full h-12 rounded-xl shadow-md shadow-brand-primary/20 hover:shadow-lg transition-all" variant="primary">
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มลงรายการ
              </Button>
            </div>
          </Card>

          {/* Order Items */}
          {items.length > 0 && (
            <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
              <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-[#1E8E3E]">
                   <ShoppingCart className="w-5 h-5" />
                </div>
                รายการสั่งซื้อ <Badge variant="default" className="ml-2">{items.length}</Badge>
              </h2>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-brand-bg/30 border border-brand-border/50 rounded-2xl flex items-center justify-between group hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                         <PlatformIcon platform={item.platform as Platform} size="lg" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-text-dark">
                          {index + 1}. {item.serviceName}
                        </p>
                        <p className="text-sm text-brand-text-light truncate max-w-xs font-mono bg-white/50 px-1.5 rounded mt-1 inline-block">
                          {item.targetUrl}
                        </p>
                        <p className="text-sm text-brand-text-light mt-1">
                          {item.quantity.toLocaleString()} x ฿{item.unitPrice}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-bold text-brand-primary text-xl">
                        ฿{item.subtotal.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-brand-error/70 hover:text-brand-error hover:bg-brand-error/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
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
          <div className="sticky top-24 space-y-6">
            <Card variant="elevated" padding="lg" className="border-none shadow-xl shadow-brand-primary/10">
              <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
                <Calculator className="w-5 h-5 text-brand-primary" />
                สรุปออเดอร์
              </h2>

              <div className="space-y-4">
                {/* Customer Summary */}
                {customerName && (
                  <div className="p-4 bg-brand-secondary/30 rounded-xl border border-brand-secondary">
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-wide mb-1">ลูกค้า</p>
                    <p className="font-bold text-brand-text-dark text-lg">
                      {customerName}
                    </p>
                    {contactValue && (
                      <p className="text-sm text-brand-text-dark/80 mt-1 flex items-center gap-1.5">
                        <span className="opacity-70">{contactType.toUpperCase()}:</span> {contactValue}
                      </p>
                    )}
                  </div>
                )}

                {/* Items Summary */}
                <div className="space-y-3 py-4 border-t border-b border-brand-border/50">
                  {items.length === 0 ? (
                    <div className="text-center py-8 text-brand-text-light/60">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">ยังไม่มีรายการ</p>
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
                <div className="">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-brand-text-light font-medium">รวมทั้งสิ้น</span>
                    <span className="text-3xl font-bold text-brand-primary">
                      ฿{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-right text-brand-text-light">ราคาสุทธิ</p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || items.length === 0}
                  className="w-full mt-2 h-12 text-base rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
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
                  <p className="text-xs text-center text-brand-error/80 bg-brand-error/5 py-2 rounded-lg">
                    * กรุณาเพิ่มบริการอย่างน้อย 1 รายการ
                  </p>
                )}
              </div>
            </Card>

            {/* Tips */}
            <Card variant="bordered" padding="md" className="bg-[#E8F0FE] border border-[#D2E3FC]">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#1967D2] shrink-0 mt-0.5" />
                <div className="text-sm text-[#1967D2]">
                  <p className="font-bold mb-1">
                    เคล็ดลับ
                  </p>
                  <ul className="space-y-1.5 opacity-90">
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

