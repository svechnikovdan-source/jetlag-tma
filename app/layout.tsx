import "./globals.css";

export const metadata = {
  title: "FMT.JETLAG — mini app",
  description: "Контент, миссии, афиша и маркет для сообщества.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#0b0b0d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head />
      <body>
        <div className="wrap">{children}</div>
      </body>
    </html>
  );
}
