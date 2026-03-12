"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, Button, Input, Textarea, Select, Badge } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  ClipboardList,
  User,
  CreditCard,
  DollarSign,
  Copy,
} from "lucide-react";

interface StoreService {
  id: string;
  name: string;
  platform: string;
  serviceType: string;
  sellPrice: number;
  minQty: number;
  maxQty: number;
  isActive: boolean;
}

interface PublicStore {
  id: string;
  slug: string;
  name: string;
  allowDirectOrder: boolean;
  services: StoreService[];
}

interface CartItem {
  serviceId: string;
  targetUrl: string;
  quantity: number;
}

function OrderForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const serviceId = searchParams.get("service");

  const [store, setStore] = useState<PublicStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    contactType: "line",
    contactValue: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string;
  } | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/store/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.store) {
          setStore(data.store);
          if (serviceId) {
            const selected = (data.store.services as StoreService[]).find(
              (s) => s.id === serviceId
            );
            if (selected) {
              setCart([{ serviceId: selected.id, targetUrl: "", quantity: selected.minQty }]);
            }
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [slug, serviceId]);

  const getService = (id: string) => store?.services.find((s) => s.id === id);

  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    setCart(cart.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const removeCartItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => {
      const service = getService(item.serviceId);
      return total + (service?.sellPrice ?? 0) * item.quantity;
    }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/store/${slug}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerInfo.name,
          contactType: customerInfo.contactType,
          contactValue: customerInfo.contactValue,
          note: customerInfo.note,
          items: cart.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            targetUrl: item.targetUrl,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrderResult({ orderNumber: data.order.orderNumber });
      } else {
        alert(data.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="text-brand-text-light">กำลังโหลด...</p>
      </div>
    );
  }

  if (!store || !store.allowDirectOrder) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl mb-2">🚫</p>
          <p className="text-brand-text-light">ร้านค้านี้ไม่เปิดรับออเดอร์โดยตรง</p>
          <Link href={`/s/${slug}`} className="text-violet-600 text-sm mt-2 inline-block">
            ← กลับหน้าร้าน
          </Link>
        </div>
      </div>
    );
  }

  if (orderResult) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <Card variant="bordered" className="max-w-md w-full text-center">
          <div className="py-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-brand-text-dark">สั่งซื้อสำเร็จ!</h1>
            <p className="text-brand-text-light mt-2">ออเดอร์ #{orderResult.orderNumber}</p>
            <div className="mt-6 p-4 bg-brand-bg rounded-lg text-left">
              <p className="text-sm text-brand-text-light">
                ร้านค้าจะตรวจสอบการชำระเงินและเริ่มดำเนินการ
                <br />
                โดยปกติใช้เวลา 5–30 นาที
              </p>
            </div>
            <div className="flex gap-3 mt-6">
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
      <header className="bg-brand-surface border-b border-brand-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href={`/s/${slug}`}>
            <Button size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="font-semibold text-brand-text-dark">สั่งซื้อ — {store.name}</h1>
        </div>
      </header>

      <Container size="lg">
        <Section spacing="md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cart Items */}
            <div>
              <h2 className="text-lg font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand-primary" />
                ตะกร้าสินค้า
              </h2>

              {cart.length === 0 && (
                <div className="text-center py-10 text-brand-text-light border-2 border-dashed border-brand-border rounded-xl">
                  <p>ยังไม่มีสินค้าในตะกร้า</p>
                </div>
              )}

              <div className="space-y-4">
                {cart.map((item, index) => {
                  const service = getService(item.serviceId);
                  if (!service) return null;
                  return (
                    <Card key={index} variant="bordered">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-brand-text-dark">{service.name}</h3>
                          <Badge variant="info" size="sm">
                            {service.serviceType}
                          </Badge>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCartItem(index)}
                          className="p-2 text-brand-error hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <Input
                          label="ลิงก์โพสต์/เพจ *"
                          placeholder="https://facebook.com/..."
                          value={item.targetUrl}
                          onChange={(e) => updateCartItem(index, { targetUrl: e.target.value })}
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
                                  quantity: Math.max(service.minQty, item.quantity - 100),
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
                                    service.minQty,
                                    Math.min(service.maxQty, parseInt(e.target.value) || 0)
                                  ),
                                })
                              }
                              className="w-32 text-center"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateCartItem(index, {
                                  quantity: Math.min(service.maxQty, item.quantity + 100),
                                })
                              }
                              className="p-2 rounded-lg border border-brand-border hover:bg-brand-bg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-brand-text-light mt-1">
                            ขั้นต่ำ {service.minQty.toLocaleString()} | สูงสุด{" "}
                            {service.maxQty.toLocaleString()}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-brand-border text-right">
                          <p className="text-lg font-bold text-brand-primary">
                            ฿{formatCurrency(service.sellPrice)} ×{" "}{item.quantity} ={" "}
                            ฿{formatCurrency(service.sellPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Add service picker */}
              {store.services.filter((s) => s.isActive).length > 0 && (
                <div className="mt-4">
                  <select
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm bg-white text-brand-text-dark"
                    defaultValue=""
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const svc = store.services.find((s) => s.id === e.target.value);
                      if (svc) {
                        setCart((prev) => [
                          ...prev,
                          { serviceId: svc.id, targetUrl: "", quantity: svc.minQty },
                        ]);
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">+ เพิ่มบริการ</option>
                    {store.services
                      .filter((s) => s.isActive)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — ฿{formatCurrency(s.sellPrice)}/ชิ้น
                        </option>
                      ))}
                  </select>
                </div>
              )}
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
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
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
                      setCustomerInfo({ ...customerInfo, contactType: e.target.value })
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
                        setCustomerInfo({ ...customerInfo, contactValue: e.target.value })
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
                  onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                />
              </div>
            </Card>

            {/* Payment info placeholder */}
            <Card variant="bordered">
              <h2 className="text-lg font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                ช่องทางชำระเงิน
              </h2>
              <div className="p-4 bg-brand-bg rounded-lg">
                <p className="text-sm text-brand-text-light">
                  ร้านค้าจะแจ้งช่องทางชำระเงินผ่านช่องทางติดต่อที่คุณให้มา
                </p>
              </div>
            </Card>

            {/* Summary */}
            <Card variant="bordered" className="bg-violet-50/50">
              <h2 className="text-lg font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                สรุปยอด
              </h2>
              <div className="space-y-2">
                {cart.map((item, index) => {
                  const service = getService(item.serviceId);
                  if (!service) return null;
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-brand-text-dark">
                        {service.name} × {item.quantity}
                      </span>
                      <span className="text-brand-text-dark">
                        ฿{formatCurrency(service.sellPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-brand-border flex justify-between">
                  <span className="font-semibold text-brand-text-dark">รวมทั้งหมด</span>
                  <span className="text-xl font-bold text-violet-700">
                    ฿{formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
              disabled={cart.length === 0}
            >
              ยืนยันสั่งซื้อ — ฿{formatCurrency(calculateTotal())}
            </Button>
          </form>
        </Section>
      </Container>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          กำลังโหลด...
        </div>
      }
    >
      <OrderForm />
    </Suspense>
  );
}
