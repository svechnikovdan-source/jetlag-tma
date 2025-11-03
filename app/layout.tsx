import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import React from "react";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata = {
  title: "Jetlag Miniapp",
  description: "FMT.JETLAG — social & lifestyle app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Важно: подавляем предупреждения гидрации из-за стилей, которые
    // Telegram SDK навешивает на <html> (--tg-viewport-*)
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Стартовое значение переменной высоты (одинаково на сервере и клиенте) */}
        <style>{`:root{--app-h:100vh}`}</style>
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        {/* Telegram SDK */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        {/* После инициализации: обновим CSS-переменную, но не атрибуты html */}
        <Script id="tg-init" strategy="afterInteractive">{`
          try {
            const tg = window.Telegram?.WebApp;
            if (tg) {
              tg.expand();
              tg.setHeaderColor('#000000');
              tg.setBackgroundColor('#0b0b0d');
              tg.enableClosingConfirmation();
              // Используем стабильную высоту, если доступна
              const stable = getComputedStyle(document.documentElement)
                .getPropertyValue('--tg-viewport-stable-height') || '';
              const v = (stable && stable.trim()) || '100vh';
              document.documentElement.style.setProperty('--app-h', v);
            }
          } catch {}
        `}</Script>

        {/* Рамка устройства */}
        <div className="min-h-screen grid place-items-center bg-[#0b0b0d]">
          <div
            className="relative w-[390px] min-h-[740px] bg-black border border-white/10 rounded-[44px] overflow-hidden"
            // Берём одинаковую для сервера/клиента переменную
            style={{ minHeight: "var(--app-h)" }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
