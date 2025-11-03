// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata = {
  title: 'FMT.JETLAG Mini App',
  description: 'Local prototype',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        {/* Рамка телефона: центрируем, фиксируем ширину 390 и добавляем нижний отступ под таббар */}
        <div className="min-h-screen grid place-items-center bg-[#0b0b0d]">
          <div className="relative w-[390px] min-h-[740px] bg-black border border-white/10 rounded-[44px] overflow-hidden">
            {/* динамический контент страниц */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
import Script from "next/script";

declare global {
  interface Window {
    Telegram?: any;
  }
}
