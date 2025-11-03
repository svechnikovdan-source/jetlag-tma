"use client";

import { useEffect, useMemo, useState } from "react";

type TgWebApp = {
  initData?: string;
  initDataUnsafe?: any;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (c: string) => void;
};

function getTelegram(): TgWebApp | null {
  if (typeof window === "undefined") return null;
  // @ts-ignore
  return window?.Telegram?.WebApp ?? null;
}

export default function Home() {
  const [tg, setTg] = useState<TgWebApp | null>(null);
  const [user, setUser] = useState<{ id?: number; first_name?: string; username?: string } | null>(null);

  useEffect(() => {
    const wa = getTelegram();
    setTg(wa);
    if (!wa) return;

    // Инициализация WebApp
    wa.ready();
    wa.expand();
    wa.setHeaderColor?.("#0b0b0d");

    // Берём пользователя из initDataUnsafe
    const u = wa.initDataUnsafe?.user ?? null;
    setUser(u);
  }, []);

  const name = useMemo(() => user?.first_name || user?.username || "Гость", [user]);

  return (
    <main className="min-h-screen p-4 bg-black text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-semibold">FMT.JETLAG — Telegram Mini App</h1>
        <p className="text-white/70 mt-2">Привет, {name}!</p>

        <div className="mt-6 rounded-2xl border border-white/10 p-4 bg-white/5">
          <div className="text-sm text-white/70">
            <div>colorScheme: {tg?.colorScheme ?? "n/a"}</div>
            <div className="break-all">initData: {tg?.initData ? "есть" : "нет"}</div>
          </div>
          <div className="mt-4 text-xs text-white/50">
            Снаружи Telegram имя будет «Гость». Открой через кнопку WebApp в боте — и появится твоё имя из Telegram.
          </div>
        </div>
      </div>
    </main>
  );
}
