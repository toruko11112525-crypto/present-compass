import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Present Compass | 友達へのプレゼント診断",
  description: "友達・親友との思い出を入力すると、AIがぴったりのプレゼントを提案します。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gradient-to-b from-orange-50 via-white to-pink-50">
        {children}
      </body>
    </html>
  );
}
