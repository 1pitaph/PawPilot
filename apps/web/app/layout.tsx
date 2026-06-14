import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "爪边 / 宠物友好地图 Agent",
  description: "懂你家宠物的附近地图。普通地图给路线，爪边给适合这只宠物的附近判断。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
