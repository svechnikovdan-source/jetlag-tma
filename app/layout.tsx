// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "FMT.JETLAG — Mini App",
  description: "Jetlag community mini app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning — просим React не ругаться на стили Telegram
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Подключаем Telegram SDK до загрузки приложения */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
