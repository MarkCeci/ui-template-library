import type { Metadata } from "next";
import { AppFrame } from "@/components/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "企业级 AI UI 模板库",
  description: "内部 UI 风格包、页面模板和 AI Prompt 的统一入口。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
