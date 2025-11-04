export const metadata = {
  title: "FMT.JETLAG — Mini App",
  description: "Экосистема миссий, событий и маркетплейса",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#0b0b0d",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
