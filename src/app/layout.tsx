import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
