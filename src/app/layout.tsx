import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/shared";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "MeeLike Seller - แพลตฟอร์มครบวงจรสำหรับธุรกิจ Social Media",
  description: "ขาย Bot, คนจริง, บัญชี Social Media - บริหารทีม ติดตามรายได้ ครบจบในที่เดียว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        <Providers>
          <ErrorBoundary showDetails={process.env.NODE_ENV === "development"}>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
