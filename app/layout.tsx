export const metadata = {
  title: "FMT.JETLAG — mini app",
  description: "Social network where finance meets lifestyle",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  themeColor: "#0b0b0d",
};

import "./globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="wrapper">{children}</div>
      </body>
    </html>
  );
}
