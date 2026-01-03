import { Book } from "lucide-react";
import Link from "next/link";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-primary/5">
      {/* Header */}
      <div className="bg-white border-b border-brand-border/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/help" className="flex items-center gap-3 group">
              <div className="p-2 bg-brand-primary/10 rounded-lg group-hover:bg-brand-primary/20 transition-colors">
                <Book className="w-5 h-5 text-brand-primary" />
              </div>
              <span className="font-bold text-brand-text-dark">
                ศูนย์ช่วยเหลือ
              </span>
            </Link>

            <Link
              href="/"
              className="text-sm text-brand-text-light hover:text-brand-primary transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-brand-border/20 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-brand-text-dark mb-3">
                คู่มือการใช้งาน
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/help/seller"
                    className="text-brand-text-light hover:text-brand-primary transition-colors"
                  >
                    คู่มือ Seller
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help/worker"
                    className="text-brand-text-light hover:text-brand-primary transition-colors"
                  >
                    คู่มือ Worker
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help/hub"
                    className="text-brand-text-light hover:text-brand-primary transition-colors"
                  >
                    คู่มือ Hub
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-brand-text-dark mb-3">
                ความช่วยเหลือ
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/help/faq"
                    className="text-brand-text-light hover:text-brand-primary transition-colors"
                  >
                    คำถามที่พบบ่อย
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-brand-text-dark mb-3">
                เกี่ยวกับ
              </h4>
              <p className="text-sm text-brand-text-light">
                MeeLike Seller - แพลตฟอร์มขายบริการโซเชียลมีเดีย
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-brand-border/10 text-center text-sm text-brand-text-light">
            © 2026 MeeLike Seller. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
