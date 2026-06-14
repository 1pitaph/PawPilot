import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

import "./globals.css";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "爪边 / 宠物友好地图 Agent",
  description:
    "爪边宣传站，基于完整参考网页模板迁移。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={cn(
          `bg-background relative font-sans antialiased`,
        )}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
