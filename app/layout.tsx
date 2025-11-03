import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FMT.JETLAG mini app",
  description: "Social network where finance meets lifestyle",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
  themeColor: "#0b0b0d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="app-wrap">
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
