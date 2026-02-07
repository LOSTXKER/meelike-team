"use client";

import * as React from "react";
import { Button, Badge } from "@/components/ui";
import { Dialog } from "@/components/ui/Dialog";
import type { TeamReviewTag } from "@/types";
import { Star, Send, Eye, EyeOff, Check } from "lucide-react";

interface ReviewTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  jobName?: string;
  onSubmit: (data: {
    rating: number;
    review: string;
    tags: TeamReviewTag[];
    isAnonymous: boolean;
  }) => void;
  isLoading?: boolean;
}

const REVIEW_TAGS: { value: TeamReviewTag; label: string; positive: boolean }[] = [
  { value: "pays_fast", label: "💸 จ่ายไว", positive: true },
  { value: "pays_fair", label: "💰 ราคาดี", positive: true },
  { value: "good_communication", label: "💬 ติดต่อง่าย", positive: true },
  { value: "clear_instructions", label: "📋 อธิบายชัดเจน", positive: true },
  { value: "consistent_work", label: "📦 มีงานสม่ำเสมอ", positive: true },
  { value: "friendly", label: "😊 เป็นมิตร", positive: true },
  { value: "slow_payment", label: "⏳ จ่ายช้า", positive: false },
  { value: "unclear_instructions", label: "❓ อธิบายไม่ชัด", positive: false },
  { value: "rude", label: "😤 ไม่สุภาพ", positive: false },
];

export function ReviewTeamModal({
  isOpen,
  onClose,
  teamName,
  jobName,
  onSubmit,
  isLoading = false,
}: ReviewTeamModalProps) {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [review, setReview] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<TeamReviewTag[]>([]);
  const [isAnonymous, setIsAnonymous] = React.useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setReview("");
      setSelectedTags([]);
      setIsAnonymous(false);
    }
  }, [isOpen]);

  const handleTagToggle = (tag: TeamReviewTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({
      rating,
      review,
      tags: selectedTags,
      isAnonymous,
    });
  };

  const displayRating = hoverRating || rating;

  const getRatingText = (r: number) => {
    switch (r) {
      case 1:
        return "แย่มาก";
      case 2:
        return "ไม่ค่อยดี";
      case 3:
        return "พอใช้";
      case 4:
        return "ดี";
      case 5:
        return "ยอดเยี่ยม!";
      default:
        return "เลือกคะแนน";
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title>รีวิวทีม</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
      <div className="space-y-6">
        {/* Team Info */}
        <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/50 text-center">
          <p className="text-sm text-brand-text-light mb-1">รีวิวทีม</p>
          <p className="text-xl font-bold text-brand-text-dark">{teamName}</p>
          {jobName && (
            <p className="text-sm text-brand-text-light mt-1">จากงาน: {jobName}</p>
          )}
        </div>

        {/* Star Rating */}
        <div className="text-center">
          <p className="text-sm font-medium text-brand-text-dark mb-3">
            ให้คะแนนทีมนี้
          </p>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= displayRating
                      ? "fill-brand-warning text-brand-warning"
                      : "text-brand-border"
                  }`}
                />
              </button>
            ))}
          </div>
          <p
            className={`text-sm font-medium ${
              displayRating >= 4
                ? "text-brand-success"
                : displayRating >= 2
                ? "text-brand-warning"
                : displayRating >= 1
                ? "text-brand-error"
                : "text-brand-text-light"
            }`}
          >
            {getRatingText(displayRating)}
          </p>
        </div>

        {/* Tags */}
        <div>
          <p className="text-sm font-medium text-brand-text-dark mb-3">
            เลือก Tag ที่ตรงกับทีมนี้ (เลือกได้หลายอัน)
          </p>

          {/* Positive Tags */}
          <div className="mb-3">
            <p className="text-xs text-brand-text-light mb-2">ข้อดี</p>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.filter((t) => t.positive).map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => handleTagToggle(tag.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedTags.includes(tag.value)
                      ? "bg-brand-success/10 border-brand-success/30 text-brand-success"
                      : "bg-brand-bg border-brand-border/50 text-brand-text-dark hover:border-brand-success/30"
                  }`}
                >
                  {selectedTags.includes(tag.value) && (
                    <Check className="w-3 h-3 inline mr-1" />
                  )}
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Negative Tags */}
          <div>
            <p className="text-xs text-brand-text-light mb-2">ข้อเสีย</p>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.filter((t) => !t.positive).map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => handleTagToggle(tag.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedTags.includes(tag.value)
                      ? "bg-brand-error/10 border-brand-error/30 text-brand-error"
                      : "bg-brand-bg border-brand-border/50 text-brand-text-dark hover:border-brand-error/30"
                  }`}
                >
                  {selectedTags.includes(tag.value) && (
                    <Check className="w-3 h-3 inline mr-1" />
                  )}
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-brand-text-dark mb-2">
            เขียนรีวิว (ไม่บังคับ)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="แบ่งปันประสบการณ์ทำงานกับทีมนี้..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-brand-border/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none text-brand-text-dark placeholder:text-brand-text-light/50"
          />
          <p className="text-xs text-brand-text-light mt-1 text-right">
            {review.length}/500
          </p>
        </div>

        {/* Anonymous Toggle */}
        <div className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-xl border border-brand-border/30">
          <div className="flex items-center gap-2">
            {isAnonymous ? (
              <EyeOff className="w-4 h-4 text-brand-text-light" />
            ) : (
              <Eye className="w-4 h-4 text-brand-text-light" />
            )}
            <span className="text-sm text-brand-text-dark">
              {isAnonymous ? "รีวิวแบบไม่ระบุตัวตน" : "รีวิวแบบเปิดเผยชื่อ"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isAnonymous ? "bg-brand-primary" : "bg-brand-border"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                isAnonymous ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

      </div>
      </Dialog.Body>
      <Dialog.Footer>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 shadow-md shadow-brand-primary/20"
            isLoading={isLoading}
            disabled={rating === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            ส่งรีวิว
          </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
