"use client";

import { X, Book, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";

interface HelpSidebarProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  relatedArticles?: Array<{ id: string; title: string; href: string }>;
}

export function HelpSidebar({
  pageId,
  isOpen,
  onClose,
  title = "คู่มือการใช้งาน",
  content,
  relatedArticles = [],
}: HelpSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 animate-slide-in-right overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border/20 bg-gradient-to-r from-brand-primary/5 to-brand-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <Book className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="font-bold text-brand-text-dark">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-bg rounded-lg transition-colors"
            aria-label="ปิด"
          >
            <X className="w-5 h-5 text-brand-text-light" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {content ? (
            <div className="prose prose-sm max-w-none">
              {content}
            </div>
          ) : (
            <div className="text-center py-12">
              <Book className="w-12 h-12 text-brand-text-light/30 mx-auto mb-3" />
              <p className="text-brand-text-light">
                ไม่มีคู่มือสำหรับหน้านี้
              </p>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-brand-border/20">
              <h4 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                บทความที่เกี่ยวข้อง
              </h4>
              <div className="space-y-2">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={article.href}
                    className="block p-3 hover:bg-brand-bg rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-text-dark group-hover:text-brand-primary transition-colors">
                        {article.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-border/20 bg-brand-bg/30">
          <Link href="/help">
            <Button variant="outline" className="w-full">
              <Book className="w-4 h-4 mr-2" />
              ดูคู่มือทั้งหมด
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
