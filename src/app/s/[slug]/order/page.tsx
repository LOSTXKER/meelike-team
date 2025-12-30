"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, Button, Input, Textarea, Select, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { mockSeller, mockServices } from "@/lib/mock-data";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Upload,
  Copy,
  CheckCircle,
} from "lucide-react";

interface CartItem {
  serviceId: string;
  targetUrl: string;
  quantity: number;
  comments?: string[];
}

export default function OrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const serviceId = searchParams.get("service");

  const store = mockSeller;
  const selectedService = mockServices.find((s) => s.id === serviceId);

  const [cart, setCart] = useState<CartItem[]>(
    selectedService
      ? [
          {
            serviceId: selectedService.id,
            targetUrl: "",
            quantity: selectedService.minQuantity,
          },
        ]
      : []
  );

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    contactType: "line",
    contactValue: "",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getService = (id: string) => mockServices.find((s) => s.id === id);

  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    setCart(cart.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const removeCartItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const addToCart = (serviceId: string) => {
    const service = getService(serviceId);
    if (service) {
      setCart([
        ...cart,
        { serviceId, targetUrl: "", quantity: service.minQuantity },
      ]);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const service = getService(item.serviceId);
      return total + (service?.sellPrice || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <Card variant="bordered" className="max-w-md w-full text-center">
          <div className="py-8">
            <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-brand-success" />
            </div>
            <h1 className="text-2xl font-bold text-brand-text-dark">
              สั่งซื้อสำเร็จ!
            </h1>
            <p className="text-brand-text-light mt-2">
              ออเดอร์ #ORD-2024-001
            </p>

            <div className="mt-6 p-4 bg-brand-bg rounded-lg text-left">
              <p className="text-sm text-brand-text-light mb-2">
                ร้านค้าจะตรวจสอบการชำระเงินและเริ่มดำเนินการ
                <br />
                โดยปกติใช้เวลา 5-30 นาที
              </p>
            </div>

            <div className="mt-6 p-4 bg-brand-surface border border-brand-border rounded-lg">
              <p className="text-sm text-brand-text-light mb-2">
                🔗 Link ติดตามสถานะ:
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={`seller.meelike.com/s/${slug}/track/ORD-2024-001`}
                  readOnly
                  className="text-sm"
                />
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Link href={`/s/${slug}/track/ORD-2024-001`} className="flex-1">
                <Button className="w-full">ติดตามสถานะ</Button>
              </Link>
              <Link href={`/s/${slug}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  กลับหน้าร้าน
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="bg-brand-surface border-b border-brand-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href={`/s/${slug}`}>
            <Button size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="font-semibold text-brand-text-dark">สั่งซื้อ</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cart Items */}
          <div>
            <h2 className="text-lg font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-primary" />
              ตะกร้าสินค้า
            </h2>

            <div className="space-y-4">
              {cart.map((item, index) => {
                const service = getService(item.serviceId);
                if (!service) return null;

                return (
                  <Card key={index} variant="bordered">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-brand-text-dark">
                            {service.name}
                          </h3>
                          <Badge
                            variant={
                              service.serviceType === "bot" ? "info" : "success"
                            }
                            size="sm"
                          >
                            {service.serviceType === "bot"
                              ? "Bot"
                              : "คนจริง"}
                          </Badge>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCartItem(index)}
                        className="p-2 text-brand-error hover:bg-brand-error/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="ลิงก์โพสต์/เพจ *"
                        placeholder="https://facebook.com/..."
                        value={item.targetUrl}
                        onChange={(e) =>
                          updateCartItem(index, { targetUrl: e.target.value })
                        }
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                          จำนวน
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItem(index, {
                                quantity: Math.max(
                                  service.minQuantity,
                                  item.quantity - 100
                                ),
                              })
                            }
                            className="p-2 rounded-lg border border-brand-border hover:bg-brand-bg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartItem(index, {
                                quantity: Math.max(
                                  service.minQuantity,
                                  Math.min(
                                    service.maxQuantity,
                                    parseInt(e.target.value) || 0
                                  )
                                ),
                              })
                            }
                            className="w-32 text-center"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItem(index, {
                                quantity: Math.min(
                                  service.maxQuantity,
                                  item.quantity + 100
                                ),
                              })
                            }
                            className="p-2 rounded-lg border border-brand-border hover:bg-brand-bg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-brand-text-light mt-1">
                          ขั้นต่ำ {service.minQuantity} | สูงสุด{" "}
                          {service.maxQuantity.toLocaleString()}
                        </p>
                      </div>

                      {service.type === "comment" && (
                        <Textarea
                          label="ข้อความเม้น (คั่นด้วย Enter)"
                          placeholder="สินค้าดีมากครับ&#10;แนะนำเลยค่ะ&#10;ชอบมากๆ"
                          rows={3}
                        />
                      )}

                      <div className="pt-3 border-t border-brand-border text-right">
                        <p className="text-lg font-bold text-brand-primary">
                          {formatCurrency(service.sellPrice)} x {item.quantity} ={" "}
                          {formatCurrency(service.sellPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                // Would open service picker
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              เพิ่มบริการ
            </Button>
          </div>

          {/* Customer Info */}
          <Card variant="bordered">
            <h2 className="text-lg font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary" />
              ข้อมูลติดต่อ
            </h2>

            <div className="space-y-4">
              <Input
                label="ชื่อ *"
                placeholder="ชื่อของคุณ"
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, name: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="ช่องทางติดต่อ"
                  options={[
                    { value: "line", label: "LINE" },
                    { value: "facebook", label: "Facebook" },
                    { value: "phone", label: "โทรศัพท์" },
                    { value: "email", label: "Email" },
                  ]}
                  value={customerInfo.contactType}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      contactType: e.target.value,
                    })
                  }
                />
                <div className="col-span-2">
                  <Input
                    label="&nbsp;"
                    placeholder={
                      customerInfo.contactType === "line"
                        ? "@your_line_id"
                        : customerInfo.contactType === "phone"
                        ? "080-xxx-xxxx"
                        : ""
                    }
                    value={customerInfo.contactValue}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        contactValue: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <Textarea
                label="หมายเหตุ (ถ้ามี)"
                placeholder="ข้อความถึงร้านค้า..."
                rows={2}
                value={customerInfo.note}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, note: e.target.value })
                }
              />
            </div>
          </Card>

          {/* Payment */}
          <Card variant="bordered">
            <h2 className="text-lg font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-success" />
              ช่องทางชำระเงิน
            </h2>

            <div className="p-4 bg-brand-bg rounded-lg mb-4">
              <p className="font-medium text-brand-text-dark">
                🏦 ธนาคารกสิกรไทย
              </p>
              <p className="text-brand-text-light mt-1">
                เลขบัญชี: 123-4-56789-0
                <br />
                ชื่อบัญชี: นาย จอห์น บูสต์
              </p>
              <p className="text-brand-text-light mt-2">
                PromptPay: 080-xxx-xxxx
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-3"
                leftIcon={<Copy className="w-4 h-4" />}
              >
                คัดลอกเลขบัญชี
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                หลักฐานการโอน *
              </label>
              <div className="border-2 border-dashed border-brand-border rounded-lg p-8 text-center hover:border-brand-primary transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-brand-text-light mx-auto mb-2" />
                <p className="text-brand-text-light">
                  คลิกหรือลากไฟล์มาวาง
                </p>
                <p className="text-xs text-brand-text-light mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card variant="bordered" className="bg-brand-secondary/10">
            <h2 className="text-lg font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-brand-success" />
              สรุปยอด
            </h2>

            <div className="space-y-2">
              {cart.map((item, index) => {
                const service = getService(item.serviceId);
                if (!service) return null;
                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-brand-text-dark">
                      {service.name} x {item.quantity}
                    </span>
                    <span className="text-brand-text-dark">
                      {formatCurrency(service.sellPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
              <div className="pt-3 border-t border-brand-border flex justify-between">
                <span className="font-semibold text-brand-text-dark">
                  รวมทั้งหมด
                </span>
                <span className="text-xl font-bold text-brand-primary">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
            disabled={cart.length === 0}
          >
            ยืนยันสั่งซื้อ {formatCurrency(calculateTotal())}
          </Button>
        </form>
      </div>
    </div>
  );
}

