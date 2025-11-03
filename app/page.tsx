"use client";

import React from "react";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-full p-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">FMT.JETLAG</h1>
        <p className="text-white/60">
          Empowering talents to bring value through content
        </p>
      </div>

      <div className="mt-8 w-full max-w-xs space-y-3 text-center">
        <button className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition">
          Войти в сообщество
        </button>
        <button className="w-full py-3 border border-white/20 rounded-xl hover:bg-white/10 transition">
          Подробнее
        </button>
      </div>

      <footer className="absolute bottom-4 text-xs text-white/40">
        v1.0 • Jetlag Miniapp
      </footer>
    </main>
  );
}
