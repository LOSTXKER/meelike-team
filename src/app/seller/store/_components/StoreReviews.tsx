import { Card, Badge, Avatar, Select, Textarea, Button } from "@/components/ui";
import {
  Star,
  MessageSquare,
  Clock,
  ThumbsUp,
  MoreHorizontal,
} from "lucide-react";

export interface Review {
  id: string;
  customerName: string;
  avatar: string | null;
  rating: number;
  comment: string;
  serviceName: string;
  orderId: string;
  createdAt: string;
  reply: string | null;
  repliedAt: string | null;
}

export interface ReviewStats {
  total: number;
  avgRating: number;
  pending: number;
}

interface StoreReviewsProps {
  reviews: Review[];
  reviewStats: ReviewStats;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
}

export function StoreReviews({
  reviews,
  reviewStats,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
}: StoreReviewsProps) {
  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-none shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xl font-bold text-brand-text-dark">{reviewStats.avgRating.toFixed(1)}</p>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-xs text-brand-text-light">คะแนนเฉลี่ย</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-brand-text-dark">{reviewStats.total}</p>
              <p className="text-xs text-brand-text-light">รีวิวทั้งหมด</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 rounded-xl">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-brand-text-dark">{reviewStats.pending}</p>
              <p className="text-xs text-brand-text-light">รอตอบกลับ</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-brand-text-dark">{reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 0}%</p>
              <p className="text-xs text-brand-text-light">รีวิวบวก</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reviews List */}
      <Card className="border-none shadow-lg">
        <div className="flex items-center justify-between p-5 border-b border-brand-border/30">
          <h2 className="font-bold text-brand-text-dark">รีวิวจากลูกค้า</h2>
          <Select
            options={[
              { value: "all", label: "ทั้งหมด" },
              { value: "pending", label: "รอตอบกลับ" },
              { value: "replied", label: "ตอบแล้ว" },
            ]}
            defaultValue="all"
            className="w-40"
          />
        </div>
        <div className="divide-y divide-brand-border/30">
          {reviews.map((review) => (
            <div key={review.id} className="p-5">
              <div className="flex items-start gap-4">
                <Avatar fallback={review.customerName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-text-dark">{review.customerName}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-text-light">
                        {new Date(review.createdAt).toLocaleDateString('th-TH')}
                      </span>
                      <button className="p-1 hover:bg-brand-bg rounded">
                        <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-brand-text-dark mb-2">{review.comment}</p>
                  <div className="flex items-center gap-2 text-xs text-brand-text-light">
                    <Badge variant="default" size="sm">{review.serviceName}</Badge>
                    <span>•</span>
                    <span>{review.orderId}</span>
                  </div>

                  {/* Reply Section */}
                  {review.reply ? (
                    <div className="mt-3 p-3 bg-brand-bg/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="info" size="sm">ตอบกลับ</Badge>
                        <span className="text-xs text-brand-text-light">
                          {new Date(review.repliedAt!).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      <p className="text-sm text-brand-text-dark">{review.reply}</p>
                    </div>
                  ) : replyingTo === review.id ? (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="พิมพ์ข้อความตอบกลับ..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => { setReplyingTo(null); setReplyText(""); }}
                        >
                          ยกเลิก
                        </Button>
                        <Button size="sm">ส่งตอบกลับ</Button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setReplyingTo(review.id)}
                      className="mt-2 text-sm text-brand-primary hover:underline"
                    >
                      ตอบกลับ
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
