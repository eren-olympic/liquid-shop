import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "液態商店 | Liquid Shop - 革命性購物體驗",
  description: "探索數位海洋中的液態電商生態系統。商品如海洋生物般自由游動，創造前所未有的購物探索體驗。",
  keywords: "液態商店, 創新購物, 流體界面, 電子商務, 數位體驗",
  openGraph: {
    title: "液態商店 - 革命性購物體驗",
    description: "探索數位海洋中的液態電商生態系統",
    type: "website",
    images: ["/og-liquid-shop.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
