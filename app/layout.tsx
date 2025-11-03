import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FMT.JETLAG",
  description: "Empowering talents to bring value through content"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ВАЖНО: без динамических стилей/скриптов на <html>, чтобы не было hydration ошибок
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
