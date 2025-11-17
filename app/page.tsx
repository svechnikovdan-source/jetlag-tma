"use client";
import React, { useEffect, useMemo, useState, useId } from "react";

const WHITE_CHAT_URL = process.env.NEXT_PUBLIC_WHITE_CHAT || "https://t.me/jetlagchat";

/** ── Types ───────────────────────────────────────── */
type Tab =
  | "landing"
  | "home"
  | "missions"
  | "events"
  | "market"
  | "jetlag"
  | "profile"
  | "plans"
  | "statuses";
type StatusLevel = "WHITE" | "RED" | "BLACK";
type PlanKey = "PLUS" | "PRO" | "STUDIO" | null;

const rank = (s: StatusLevel) => (s === "WHITE" ? 1 : s === "RED" ? 2 : 3);
const planRank = (p: Exclude<PlanKey, null>) => (p === "PLUS" ? 1 : p === "PRO" ? 2 : 3);
const hasPlan = (user: PlanKey, need: Exclude<PlanKey, null> | null) =>
  !need || (!!user && planRank(user as Exclude<PlanKey, null>) >= planRank(need));

/** Пороговые значения для прогресса статусов */
const LEVELS: Record<StatusLevel, { next: StatusLevel | null; need: number | null }> = {
  WHITE: { next: "RED", need: 10_000 },
  RED: { next: "BLACK", need: 100_000 },
  BLACK: { next: null, need: null },
};

/** ── Fund data (demo) ───────────────────────────── */
const FUND = {
  total: 12_500_000,
  spent: 5_000_000,
  goal: 50_000_000,
  updatedAt: "12.11.2025",
};

/** ── Inline icons ────────────────────────────────── */
const Icon = {
  Home: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  List: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
    </svg>
  ),
  Ticket: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8h16v3a2 2 0 0 1 0 4v3H4v-3a2 2 0 0 1 0-4V8z" />
      <path d="M12 8v8" />
    </svg>
  ),
  Bag: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 7h12l1 3v9H5V10l1-3z" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
    </svg>
  ),
  Brand: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="10.5" y="7" width="3" height="3" rx="0.5" />
      <rect x="10.5" y="14" width="3" height="3" rx="0.5" />
    </svg>
  ),
  User: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.82-.33A1.6 1.6 0 0 0 14 21a2 2 0 0 1-4 0 1.6 1.6 0 0 0-1-1.51 1.6 1.6 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.29 17.9l.06-.06A1.6 1.6 0 0 0 4 16.02 1.6 1.6 0 0 0 2.49 15H3a2 2 0 0 1 0-4h.09c.67 0 1.27-.39 1.51-1a1.6 1.6 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.29l.06.06c.5.5 1.2.66 1.82.33A1.6 1.6 0 0 0 10 3a2 2 0 0 1 4 0 1.6 1.6 0 0 0 1.08 1.6c.62.33 1.32.17 1.82-.33l.06-.06A2 2 0 1 1 21 7.04l-.06.06c-.5.5-.66 1.2-.33 1.82.24.61.84 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.6 1.6 0 0 0-1.51 1z" />
    </svg>
  ),
  Lock: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
    </svg>
  ),
};

/** ── Data ─────────────────────────────────────────── */
type Mission = {
  id: string;
  brand: string;
  title: string;
  deadline: string;
  tags: string[];
  rewards: { jetpoints: number; cash?: string };
  minStatus: StatusLevel;
  requiredPlan: Exclude<PlanKey, null> | null;
};
type EventItem = {
  id: string;
  title: string;
  date: string;
  place: string;
  access: { minStatus: StatusLevel; plan: PlanKey };
  price: number;
};
type MarketItem = {
  id: string;
  type: "SERVICE" | "PRODUCT";
  title: string;
  price: number;
  owner: string;
};
type DailyItem = { id: string; title: string; tag: string; action?: string };

const MISSIONS: Mission[] = [
  {
    id: "m1",
    brand: "FMT.JETLAG",
    title: "Рефреш айдентики для FMT.JETLAG Padel",
    deadline: "14.11.2025",
    tags: ["design", "branding"],
    rewards: { jetpoints: 250, cash: "50 000 ₽" },
    minStatus: "WHITE",
    requiredPlan: null,
  },
  {
    id: "m2",
    brand: "Косметика",
    title: "UGC-кампания: Travel-skin ритуалы",
    deadline: "21.11.2025",
    tags: ["video", "ugc"],
    rewards: { jetpoints: 150, cash: "по результату" },
    minStatus: "WHITE",
    requiredPlan: "PLUS",
  },
  {
    id: "m3",
    brand: "Waterr",
    title: "Съёмка рекламного спота (Twitch)",
    deadline: "05.12.2025",
    tags: ["video", "production"],
    rewards: { jetpoints: 500, cash: "120 000 ₽" },
    minStatus: "RED",
    requiredPlan: "PRO",
  },
  {
    id: "m4",
    brand: "FMT.JETLAG Film",
    title: "Motion-пак для стрима-фильма",
    deadline: "30.11.2025",
    tags: ["motion", "gfx"],
    rewards: { jetpoints: 400, cash: "дог." },
    minStatus: "RED",
    requiredPlan: null,
  },
];

const EVENTS: EventItem[] = [
  {
    id: "e1",
    title: "Creator Meetup: Music x AI",
    date: "16.11.2025",
    place: "Москва, Jet-Space",
    access: { minStatus: "WHITE", plan: null },
    price: 0,
  },
  {
    id: "e2",
    title: "FMT.JETLAG Padel Night Tournament",
    date: "22.11.2025",
    place: "FMT.JETLAG Padel",
    access: { minStatus: "RED", plan: "PLUS" },
    price: 1500,
  },
  {
    id: "e3",
    title: "Studio Session (Video Backstage)",
    date: "29.11.2025",
    place: "Jet Studio",
    access: { minStatus: "RED", plan: "STUDIO" },
    price: 0,
  },
];

const MARKET: MarketItem[] = [
  { id: "i1", type: "SERVICE", title: "Сведение и мастеринг трека", price: 8000, owner: "@audio.kir" },
  { id: "i2", type: "SERVICE", title: "Motion-дизайн (30-сек ролик)", price: 15000, owner: "@gfx.storm" },
  { id: "i3", type: "PRODUCT", title: "Bluora Travel Kit v2", price: 2490, owner: "@bluora" },
];

const PEOPLE = [
  { id: "u1", name: "Арсений", role: "Основатель" },
  { id: "u2", name: "Мурад", role: "Блоггер" },
  { id: "u3", name: "Даниил", role: "Нефтянник" },
  { id: "u4", name: "9Mice", role: "Музыкант" },
  { id: "u5", name: "Kai Angel", role: "Музыкант" },
];

const DAILY: DailyItem[] = [
  { id: "d1", title: "Протестируй 1 миссию и оставь фидбек", tag: "community" },
  { id: "d2", title: "Сними короткий backstage 15–30 сек", tag: "ugc" },
  { id: "d3", title: "Добавь 1 товар/услугу в маркет", tag: "market", action: "Опубликовать" },
];

/** ── UI primitives ───────────────────────────────── */
const Button: React.FC<{
  children: React.ReactNode;
  kind?: "primary" | "secondary" | "ghost";
  size?: "s" | "m";
  onClick?: () => void;
  className?: string;
}> = ({ children, kind = "primary", size = "m", onClick, className }) => (
  <button
    className={`btn ${size === "s" ? "btn-s" : ""} ${
      kind === "secondary" ? "btn-sec" : kind === "ghost" ? "btn-ghost" : ""
    } ${className || ""}`}
    onClick={onClick}
  >
    {children}
  </button>
);
const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => <span className="chip">{children}</span>;

/** ── SafeVault v2 ────────────────────────────────── */
const SafeVault: React.FC<{
  total: number;
  spent: number;
  goal: number;
  updatedAt?: string;
  variant?: "cash" | "coins" | "liquid";
}> = ({ total, spent, goal, updatedAt, variant = "cash" }) => {
  const id = useId();
  const [currentTotal, setCurrentTotal] = useState(total);
  const [viewTotal, setViewTotal] = useState(0);
  const [viewSpent, setViewSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTotal((prev) => (prev >= goal ? prev : Math.min(goal, prev + 5000)));
    }, 2000);
    return () => clearInterval(timer);
  }, [goal]);

  useEffect(() => {
    const dur = 800,
      t0 = performance.now();
    const sT = viewTotal,
      sS = viewSpent;
    const dT = currentTotal - sT,
      dS = spent - sS;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setViewTotal(Math.round(sT + dT * e));
      setViewSpent(Math.round(sS + dS * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [currentTotal, spent, viewSpent, viewTotal]);

  const BOX = { w: 200, h: 200, r: 16 };
  const pad = 18;
  const innerW = BOX.w - pad * 2;
  const innerH = BOX.h - pad * 2;
  const bottomY = pad + innerH;

  const pct = Math.max(0, Math.min(1, currentTotal / goal));
  const fillH = Math.round(innerH * pct);
  const fillY = bottomY - fillH;

  const fmt = (n: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(n);

  const renderFill = () => {
    if (variant === "cash") {
      const layers = Math.max(0, Math.min(8, Math.ceil(pct * 8)));
      const notes = Array.from({ length: layers }, (_, i) => {
        const h = Math.max(12, Math.min(36, 12 + i * 3));
        const y = bottomY - (i + 1) * (h + 2);
        const tilt = (i % 2 === 0 ? -1 : 1) * Math.min(4, i);
        const shade = 0.9 - i * 0.06;
        return (
          <g key={i} transform={`translate(${pad + 4}, ${y}) rotate(${tilt}, ${innerW / 2 - 8}, ${h / 2})`}>
            <rect x="0" y="0" width={innerW - 8} height={h} rx="6" fill={`rgba(255,92,92,${shade})`} />
            <rect
              x="10"
              y={h / 2 - 3}
              width={innerW - 28}
              height="6"
              rx="3"
              fill="rgba(255,255,255,0.15)"
            >
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.8s" repeatCount="indefinite" />
            </rect>
            <text x={innerW - 34} y={h / 2 + 4} fontSize="12" fill="rgba(255,255,255,0.9)">
              ₽
            </text>
          </g>
        );
      });

      return (
        <g clipPath={`url(#vault-clip-${id})`}>
          <rect
            x={pad}
            y={pad}
            width={innerW}
            height={innerH}
            rx="10"
            fill="rgba(255,255,255,0.06)"
          />
          <rect x={pad} y={fillY} width={innerW} height={fillH} fill="rgba(160,20,20,0.25)">
            <animate attributeName="y" dur="0.9s" from={bottomY} to={fillY} fill="freeze" />
            <animate attributeName="height" dur="0.9s" from={0} to={fillH} fill="freeze" />
          </rect>
          {notes}
        </g>
      );
    }

    if (variant === "coins") {
      const maxCoins = 40;
      const count = Math.floor(pct * maxCoins);
      const coins = Array.from({ length: count }, (_, i) => {
        const cols = 8;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const r = 5 + (i % 3);
        const gapX = (innerW - cols * (r * 2)) / (cols + 1);
        const x = pad + gapX * (col + 1) + (r * 2) * col + r;
        const baseY = bottomY - (row + 1) * (r * 2 + 2);
        const y = Math.max(pad + r + 2, baseY);
        const alpha = 0.82 - row * 0.03;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={`rgba(255,92,92,${alpha})`}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.6"
            />
            <ellipse cx={x - r / 3} cy={y - r / 3} rx={r / 1.6} ry={r / 2.2} fill="rgba(255,255,255,0.25)">
              <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2.2s" repeatCount="indefinite" />
            </ellipse>
          </g>
        );
      });

      return (
        <g clipPath={`url(#vault-clip-${id})`}>
          <rect
            x={pad}
            y={pad}
            width={innerW}
            height={innerH}
            rx="10"
            fill="rgba(255,255,255,0.06)"
          />
          <rect x={pad} y={fillY} width={innerW} height={fillH} fill="rgba(160,20,20,0.18)">
            <animate attributeName="y" dur="0.9s" from={bottomY} to={fillY} fill="freeze" />
            <animate attributeName="height" dur="0.9s" from={0} to={fillH} fill="freeze" />
          </rect>
          {coins}
        </g>
      );
    }

    return (
      <g clipPath={`url(#vault-clip-${id})`}>
        <rect
          x={pad}
          y={pad}
          width={innerW}
          height={innerH}
          rx="10"
          fill="rgba(255,255,255,0.06)"
        />
        <linearGradient id={`vault-red-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,92,92,0.98)" />
          <stop offset="100%" stopColor="rgba(160,20,20,0.95)" />
        </linearGradient>
        <rect x={pad} y={fillY} width={innerW} height={fillH} fill={`url(#vault-red-${id})`}>
          <animate attributeName="y" dur="0.9s" from={bottomY} to={fillY} fill="freeze" />
          <animate attributeName="height" dur="0.9s" from={0} to={fillH} fill="freeze" />
        </rect>
      </g>
    );
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="card-sec">
        <div className="row-b">
          <div className="h2">Фонд FMT.JETLAG</div>
          <div className="t-caption" style={{ opacity: 0.8 }}>
            {updatedAt ? `обновлено: ${updatedAt}` : null}
          </div>
        </div>

        <div className="sp-2" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(200px,220px) 1fr",
            gap: 18,
            alignItems: "center",
          }}
        >
          <svg
            width={BOX.w}
            height={BOX.h}
            viewBox={`0 0 ${BOX.w} ${BOX.h}`}
            aria-label="Сейф фонда"
            style={{ justifySelf: "center" }}
          >
            <defs>
              <clipPath id={`vault-clip-${id}`}>
                <rect x={pad} y={pad} width={innerW} height={innerH} rx={10} ry={10} />
              </clipPath>
            </defs>

            <rect
              x="1"
              y="1"
              width={BOX.w - 2}
              height={BOX.h - 2}
              rx={BOX.r}
              ry={BOX.r}
              fill="rgba(0,0,0,0.45)"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2"
            />
            <rect
              x="28"
              y={BOX.h - 10}
              width="20"
              height="6"
              rx="3"
              fill="rgba(255,255,255,0.25)"
              opacity="0.35"
            />
            <rect
              x={BOX.w - 48}
              y={BOX.h - 10}
              width="20"
              height="6"
              rx="3"
              fill="rgba(255,255,255,0.25)"
              opacity="0.35"
            />

            {renderFill()}

            <circle
              cx={BOX.w - pad - 44}
              cy={pad + 44}
              r={30}
              fill="rgba(0,0,0,0.5)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
            />
            <g transform={`translate(${BOX.w - pad - 44}, ${pad + 44})`}>
              <circle r="4" fill="rgba(255,255,255,0.9)" />
              <line
                x1="-16"
                y1="0"
                x2="16"
                y2="0"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="-16"
                x2="0"
                y2="16"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="2"
              />
              <line
                x1="-11.3"
                y1="-11.3"
                x2="11.3"
                y2="11.3"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="2"
              />
            </g>
          </svg>

          <div style={{ minWidth: 220, justifySelf: "left", textAlign: "left" }}>
            <div className="t-caption" style={{ opacity: 0.85, fontSize: 18 }}>
              Баланс
            </div>
            <div className="h2" style={{ fontSize: 22, lineHeight: 1.15 }}>
              {fmt(viewTotal)}
            </div>

            <div className="sp-1" />
            <div className="t-caption" style={{ opacity: 0.85 }}>
              Выделено креаторам
            </div>
            <div className="t-body" style={{ fontWeight: 600 }}>
              {fmt(viewSpent)}
            </div>
          </div>
        </div>
      </div>

      <div className="separator" />
      <div className="card-sec row-b">
        <div className="t-caption">Фонд формируется из подписок и пожертвований</div>
        <Button kind="secondary" size="s" onClick={() => alert("Страница прозрачности (демо)")}>
          Подробнее
        </Button>
      </div>
    </div>
  );
};

/** ── Top bar ─────────────────────────────────────── */
const TopBar: React.FC<{
  onProfile: () => void;
  onSettings: () => void;
  onOpenPlans: () => void;
  onOpenStatuses: () => void;
  status: StatusLevel;
  plan: PlanKey;
}> = ({ onProfile, onSettings, onOpenPlans, onOpenStatuses, status, plan }) => (
  <div
    className="pad-x"
    style={{
      position: "sticky",
      top: 0,
      zIndex: 30,
      backdropFilter: "saturate(180%) blur(14px)",
      background: "rgba(0,0,0,.55)",
      borderBottom: "1px solid var(--line)",
    }}
  >
    <div className="sp-3" />
    <div className="row-b">
      <div style={{ fontSize: 17, fontWeight: 600 }}>FMT.JETLAG</div>
      <button
        className="btn btn-ghost btn-s"
        onClick={onSettings}
        aria-label="Настройки"
        style={{ height: 34, padding: "0 10px" }}
      >
        <Icon.Settings />
      </button>
    </div>
    <div className="sp-2" />
    <div className="row-b">
      <button
        className="row"
        onClick={onProfile}
        aria-label="Профиль"
        style={{
          gap: 8,
          background: "transparent",
          border: "none",
          borderRadius: 10,
          height: 28,
          padding: "0 12px",
          alignItems: "center",
        }}
      >
        <span
          className="ava"
          style={{
            width: 22,
            height: 22,
            borderRadius: 8,
            background: "rgba(255,255,255,.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon.User />
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>Даниил</span>
      </button>
      <div className="row" style={{ gap: 8 }}>
        <button className="chip" onClick={onOpenStatuses} title="Подробнее о статусах">
          {status}
        </button>
        <button className="chip" onClick={onOpenPlans} title="Управление подпиской">
          {plan ?? "Free"}
        </button>
      </div>
    </div>
    <div className="sp-2" />
  </div>
);

/** ── Bottom nav ──────────────────────────────────── */
const BottomNav: React.FC<{ tab: Tab; onChange: React.Dispatch<React.SetStateAction<Tab>> }> = ({
  tab,
  onChange,
}) => {
  const Item: React.FC<{
    k: Extract<Tab, "home" | "missions" | "events" | "market" | "jetlag">;
    label: string;
    icon: React.FC;
  }> = ({ k, label, icon: IconX }) => {
    const active = tab === k;
    return (
      <button
        className={active ? "active" : ""}
        onClick={() => onChange(k)}
        role="tab"
        aria-selected={active}
      >
        <span className="ic">
          <IconX />
        </span>
        <span>{label}</span>
      </button>
    );
  };
  return (
    <nav className="bottom">
      <div className="bn">
        <Item k="home" label="Главная" icon={Icon.Home} />
        <Item k="missions" label="Миссии" icon={Icon.List} />
        <Item k="events" label="Афиша" icon={Icon.Ticket} />
        <Item k="market" label="Маркет" icon={Icon.Bag} />
        <Item k="jetlag" label="FMT.JETLAG" icon={Icon.Brand} />
      </div>
    </nav>
  );
};

/** ── Screens ─────────────────────────────────────── */
const Hero: React.FC = () => (
  <div className="card">
    <div className="card-sec">
      <div className="h2" style={{ fontSize: 18 }}>
        Empowering talents to
        <br />
        bring value through content
      </div>
    </div>
  </div>
);

const HomeScreen: React.FC<{ go: React.Dispatch<React.SetStateAction<Tab>>; status: StatusLevel; plan: PlanKey }> =
  ({ go, status, plan }) => {
    const canSee = (m: Mission) => rank(status) >= rank(m.minStatus) && hasPlan(plan, m.requiredPlan);
    return (
      <div
        className="page pad fade-in"
        style={{
          position: "relative",
          backgroundImage: 'url("/home-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Hero />

          <div className="sp-3" />
          <SafeVault total={FUND.total} spent={FUND.spent} goal={FUND.goal} updatedAt={FUND.updatedAt} />

          <div className="sp-4" />
          <div className="row-b">
            <div className="h2">Миссии</div>
            <Button kind="ghost" size="s" onClick={() => go("missions")}>
              Открыть все
            </Button>
          </div>
          <div className="sp-2" />
          <div className="list">
            {MISSIONS.map((m) => {
              const locked = !canSee(m);
              return (
                <div className="card" key={m.id} style={{ position: "relative", overflow: "hidden" }}>
                  {locked && (
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                      }}
                    >
                      <div
                        className="row"
                        style={{
                          gap: 8,
                          padding: "6px 10px",
                          borderRadius: 10,
                          background: "rgba(0,0,0,0.55)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <Icon.Lock />
                        <span className="t-caption" style={{ color: "rgba(255,255,255,.9)" }}>
                          Недоступно
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="card-sec" style={{ opacity: locked ? 0.78 : 1 }}>
                    <div className="row-b">
                      <div className="h2" style={{ fontSize: 15 }}>
                        {m.title}
                      </div>
                      <Chip>{m.brand}</Chip>
                    </div>
                    <div className="t-caption" style={{ marginTop: 6 }}>
                      Дедлайн: {m.deadline} · {m.rewards.jetpoints} JP
                      {m.rewards.cash ? ` + ${m.rewards.cash}` : ""}
                    </div>
                  </div>
                  <div className="separator" />
                  <div className="card-sec" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      size="s"
                      className={locked ? "btn-disabled" : ""}
                      onClick={!locked ? () => go("missions") : undefined}
                    >
                      Участвовать
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sp-4" />
          <div className="row-b">
            <div className="h2">Jetlag Daily</div>
            <Button
              kind="ghost"
              size="s"
              onClick={() => alert("Скоро — полноценная лента Daily")}
            >
              Подробнее
            </Button>
          </div>
          <div className="sp-2" />
          <div className="list">
            {DAILY.map((d) => (
              <div
                className="card"
                key={d.id}
                style={{ background: "rgba(255,255,255,.05)" }}
              >
                <div className="card-sec row-b">
                  <div>
                    <div className="h2" style={{ fontSize: 14 }}>
                      {d.title}
                    </div>
                    <div className="t-caption" style={{ marginTop: 4 }}>
                      #{d.tag}
                    </div>
                  </div>
                  {d.action && (
                    <Button
                      kind="secondary"
                      size="s"
                      onClick={() => alert(`${d.action} (демо)`)}
                    >
                      {d.action}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

const MissionsScreen: React.FC<{ status: StatusLevel; plan: PlanKey }> = ({ status, plan }) => {
  const canSee = (m: Mission) => rank(status) >= rank(m.minStatus) && hasPlan(plan, m.requiredPlan);
  return (
    <div className="page pad fade-in">
      <div className="h2">Миссии</div>
      <div className="sp-3" />
      <div className="list">
        {MISSIONS.map((m) => {
          const locked = !canSee(m);
          const needPlan = m.requiredPlan ? `· план ${m.requiredPlan}` : "";
          const needStatus = `статус ${m.minStatus}`;
          return (
            <div className="card" key={m.id} style={{ position: "relative", overflow: "hidden" }}>
              {locked && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <div
                    className="row"
                    style={{
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 10,
                      background: "rgba(0,0,0,0.55)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Icon.Lock />
                    <span className="t-caption" style={{ color: "rgba(255,255,255,.9)" }}>
                      Требуется {needStatus} {needPlan}
                    </span>
                  </div>
                </div>
              )}
              <div className="card-sec" style={{ opacity: locked ? 0.75 : 1 }}>
                <div className="row-b">
                  <div className="h2" style={{ fontSize: 15 }}>
                    {m.title}
                  </div>
                  <Chip>{m.brand}</Chip>
                </div>
                <div className="sp-2" />
                <div className="t-body">Дедлайн: {m.deadline}</div>
                <div className="t-body">Теги: {m.tags.join(", ")}</div>
                <div className="t-body">
                  Награды: {m.rewards.jetpoints} JP
                  {m.rewards.cash ? ` + ${m.rewards.cash}` : ""}
                </div>
                <div className="t-caption" style={{ marginTop: 6 }}>
                  Доступ: {needStatus}
                  {m.requiredPlan ? ` + план ${m.requiredPlan}` : ""}
                </div>
              </div>
              <div className="separator" />
              <div className="card-sec" style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  size="s"
                  className={locked ? "btn-disabled" : ""}
                  onClick={!locked ? () => alert("Отклик отправлен (демо)") : undefined}
                >
                  Участвовать
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EventsScreen: React.FC<{ status: StatusLevel; plan: PlanKey }> = ({ status, plan }) => {
  const items = EVENTS.filter(
    (e) =>
      rank(status) >= rank(e.access.minStatus) &&
      hasPlan(plan, e.access.plan as Exclude<PlanKey, null> | null),
  );
  return (
    <div className="page pad fade-in">
      <div className="h2">Афиша</div>
      <div className="sp-3" />
      <div className="list">
        {items.map((e) => (
          <div className="card" key={e.id}>
            <div className="card-sec">
              <div className="h2" style={{ fontSize: 15 }}>
                {e.title}
              </div>
              <div className="t-body" style={{ marginTop: 4 }}>
                {e.date} — {e.place}
              </div>
              <div className="t-caption" style={{ marginTop: 4 }}>
                Цена: {e.price ? `${e.price} ₽` : "бесплатно"}
              </div>
            </div>
            <div className="separator" />
            <div className="card-sec row-b">
              <Button kind="secondary" size="s">
                Получить QR
              </Button>
              <div className="row" style={{ gap: 8 }}>
                <Button kind="ghost" size="s">
                  Подробнее
                </Button>
                <Button size="s">RSVP</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketScreen: React.FC = () => (
  <div className="page pad fade-in">
    <div className="row-b">
      <div className="h2">Маркет</div>
      <Button kind="secondary" size="s" onClick={() => alert("Публикация (демо)")}>
        Опубликовать
      </Button>
    </div>
    <div className="sp-3" />
    <div className="list">
      {MARKET.map((it) => (
        <div className="card" key={it.id}>
          <div className="card-sec">
            <div className="h2" style={{ fontSize: 15 }}>
              {it.title}
            </div>
            <div className="t-caption" style={{ marginTop: 4 }}>
              {it.type}
            </div>
            <div className="t-body" style={{ marginTop: 2 }}>
              Цена: {it.price} ₽
            </div>
            <div className="t-body">Владелец: {it.owner}</div>
          </div>
          <div className="separator" />
          <div className="card-sec row-b">
            <Button kind="secondary" size="s">
              Подробнее
            </Button>
            <Button kind="secondary" size="s">
              Связаться
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const JetlagHub: React.FC<{ go: React.Dispatch<React.SetStateAction<Tab>> }> = ({ go }) => (
  <div
    className="page pad fade-in"
    style={{
      position: "relative",
      backgroundImage: 'url("/jetlag-bg.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 0,
      }}
    />
    <div style={{ position: "relative", zIndex: 1 }}>
      <div className="card">
        <div className="card-sec" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => go("profile")}
            aria-label="Открыть профиль"
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              lineHeight: 0,
              borderRadius: 16,
              outline: "none",
            }}
            title="Перейти в профиль"
          >
            <img
              src="/daniil.jpg"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const fallback = document.createElement("div");
                fallback.className = "ava";
                fallback.style.width = "64px";
                fallback.style.height = "64px";
                fallback.style.borderRadius = "16px";
                fallback.style.display = "flex";
                fallback.style.alignItems = "center";
                fallback.style.justifyContent = "center";
                fallback.style.background = "rgba(255,255,255,.12)";
                fallback.style.border = "1px solid rgba(255,255,255,.15)";
                fallback.style.fontWeight = "700";
                fallback.style.fontSize = "18px";
                fallback.textContent = "ДС";
                el.parentElement?.appendChild(fallback);
              }}
              alt="Фото профиля"
              width={64}
              height={64}
              style={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,.18)",
                boxShadow: "0 2px 12px rgba(0,0,0,.3)",
              }}
            />
          </button>

          <div>
            <div className="h2" style={{ fontSize: 16, lineHeight: 1.2 }}>
              Даниил, ты часть
              <br />
              креативного сообщества FMT.JETLAG
            </div>
          </div>
        </div>
      </div>

      <div className="sp-4" />
      <div className="h2" style={{ marginBottom: 8 }}>
        Экосистема FMT.JETLAG
      </div>

      <div className="grid-2">
        {[
          { t: "Контент", d: "Создаем контент для главных брендов мира", cta: true },
          { t: "Музыка", d: "Лейбл с крупнейшими артистами России и СНГ", cta: true },
          { t: "Образование", d: "Магистратура и бакалавр", cta: true },
          { t: "Усадьба", d: "Резиденция FMT.JETLAG", cta: true },
          { t: "Спорт", d: "Скоро открытие", cta: false },
          { t: "Продукты", d: "Скоро запуск", cta: false },
        ].map((p, i) => (
          <div className="card" key={i}>
            <div className="card-sec">
              <div className="h2">{p.t}</div>
              <div className="t-body" style={{ marginTop: 4 }}>
                {p.d}
              </div>
              <div className="sp-3" />
              {p.cta && (
                <Button kind="secondary" size="s">
                  Подробнее
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sp-4" />
      <div className="video">
        <iframe
          src="https://www.youtube-nocookie.com/embed/-yPMtwa8f14?mute=1&playsinline=1&controls=1&rel=0&modestbranding=1"
          allow="autoplay; encrypted-media; picture-in-picture"
          title="FMT.JETLAG"
        />
      </div>

      <div className="sp-4" />
      <div className="h2">Амбассадоры</div>
      <div className="sp-2" />
      <div className="scroller">
        <div className="rowx">
          {PEOPLE.map((p) => {
            const init = p.name
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div key={p.id} className="card" style={{ minWidth: 220 }}>
                <div className="card-sec">
                  <div className="row" style={{ gap: 10 }}>
                    <div className="ava">{init}</div>
                    <div>
                      <div className="h2" style={{ fontSize: 13 }}>
                        {p.name}
                      </div>
                      <div className="t-caption" style={{ marginTop: 2 }}>
                        {p.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sp-4" />
      <div className="card">
        <div className="card-sec">
          <div className="h2" style={{ marginBottom: 8 }}>
            Новости и релизы
          </div>
          <div className="list">
            <div className="card" style={{ background: "rgba(255,255,255,.05)" }}>
              <div className="card-sec">Waterr — новая банка • 12/2025</div>
            </div>
            <div className="card" style={{ background: "rgba(255,255,255,.05)" }}>
              <div className="card-sec">
                Cosmetics Travel Kit v2 — обновили формулы и упаковку
              </div>
            </div>
            <div className="card" style={{ background: "rgba(255,255,255,.05)" }}>
              <div className="card-sec">Night Tournament — регистрация открыта</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/** ── Профиль ─────────────────────────────────────── */
const ProfileScreen: React.FC<{
  status: StatusLevel;
  plan: PlanKey;
  jetpoints: number;
  next: number;
  onSettings: () => void;
}> = ({ status, plan, jetpoints }) => {
  const profile = { username: "Привет, Даниил!", city: "Москва", role: "Продюсер" };
  const target = LEVELS[status].need;
  const pct = status === "BLACK" ? 1 : Math.min(1, (jetpoints || 0) / (target || 1));
  const pctPercent = Math.round(pct * 100);
  const statusColor =
    status === "RED" ? "var(--red)" : status === "BLACK" ? "var(--muted)" : "var(--text)";

  return (
    <div className="page pad fade-in">
      <div className="card">
        <div className="card-sec">
          <div className="row-b">
            <div>
              <div className="h2" style={{ fontSize: 16, lineHeight: 1.15 }}>
                {profile.username}
              </div>
              <div className="t-caption" style={{ marginTop: 6 }}>
                {profile.city} • {profile.role}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                className="status-badge"
                style={{ color: statusColor, borderColor: "rgba(255,255,255,.22)" }}
              >
                {status}
              </div>
              <div className="t-caption" style={{ marginTop: 6 }}>
                Баланс: <b>{jetpoints.toLocaleString("ru-RU")}</b>
              </div>
            </div>
          </div>

          <div className="sp-3" />
          <div className="status-track" style={{ position: "relative" }}>
            <div
              className="status-track__bar"
              style={{ width: `${pctPercent}%`, transition: "width .6s ease" }}
            />
            <span className="status-tick" style={{ left: "0%" }} />
            <span className="status-tick" style={{ left: "100%" }} />
            <div className="t-caption" style={{ position: "absolute", top: -18, right: 0, opacity: 0.9 }}>
              {jetpoints.toLocaleString("ru-RU")}
            </div>
          </div>

          <div className="status-legend">
            {status === "WHITE" && (
              <>
                <div className="status-legend__item">WHITE</div>
                <div className="status-legend__item">
                  RED • {LEVELS.WHITE.need?.toLocaleString("ru-RU")}
                </div>
                <div className="status-legend__item">BLACK • ∞</div>
              </>
            )}
            {status === "RED" && (
              <>
                <div className="status-legend__item">RED</div>
                <div className="status-legend__item">
                  BLACK • {LEVELS.RED.need?.toLocaleString("ru-RU")}
                </div>
                <div className="status-legend__item">∞</div>
              </>
            )}
            {status === "BLACK" && (
              <>
                <div className="status-legend__item">BLACK</div>
                <div className="status-legend__item">MAX</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="sp-3" />
      <div className="card">
        <div className="card-sec">
          <div className="h2">Достижения</div>
          <div className="sp-2" />
          <div className="ach-scroll">
            {["a1", "a2", "a3", "a4", "a5"].map((id) => (
              <div className="ach" key={id}>
                <div className="ach__icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sp-3" />
      <div className="card">
        <div className="card-sec">
          <div className="h2">Задачи</div>
        </div>
        <div className="separator" />
        <div className="card-sec">
          <div className="list">
            {MISSIONS.slice(0, 2).map((m) => (
              <div className="card" key={m.id}>
                <div className="card-sec">
                  <div className="row-b">
                    <div className="h2" style={{ fontSize: 15 }}>
                      {m.title}
                    </div>
                    <Chip>{m.brand}</Chip>
                  </div>
                  <div className="t-caption" style={{ marginTop: 6 }}>
                    Дедлайн: {m.deadline} · Теги: {m.tags.join(", ")}
                  </div>
                </div>
                <div className="separator" />
                <div className="card-sec" style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button size="s">Открыть</Button>
                </div>
              </div>
            ))}
            {MISSIONS.length === 0 && <div className="t-caption">Активных задач пока нет.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

/** ── Statuses Screen ─────────────────────────────── */
const statusColors = {
  WHITE: {
    border: "1px solid var(--line)",
    bg: "rgba(255,255,255,.02)",
    accent: "var(--text)",
  },
  RED: {
    border: "1px solid rgba(255,80,80,.45)",
    bg: "rgba(255,40,40,.08)",
    accent: "rgb(255,90,90)",
  },
  BLACK: {
    border: "1px solid rgba(255,255,255,.25)",
    bg: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.35))",
    accent: "rgba(220,220,220,.9)",
  },
};

const StatusCard: React.FC<{
  level: StatusLevel;
  title: string;
  subtitle: string;
  bullets: string[];
  action: { label: string; onClick: () => void } | null;
}> = ({ level, title, subtitle, bullets, action }) => {
  const sty = statusColors[level];
  return (
    <div className="card" style={{ border: sty.border, background: sty.bg }}>
      <div className="card-sec">
        <div className="row-b">
          <div className="h2" style={{ color: sty.accent }}>
            {title}
          </div>
          <span className="chip" style={{ borderColor: "transparent", background: "rgba(0,0,0,.35)" }}>
            {level}
          </span>
        </div>
        <div className="sp-1" />
        <div className="t-caption" style={{ opacity: 0.9 }}>
          {subtitle}
        </div>
        <div className="sp-2" />
        <ul className="t-body" style={{ display: "grid", gap: 6, paddingLeft: 18 }}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        {action && (
          <>
            <div className="sp-3" />
            <Button size="m" kind="secondary" onClick={action.onClick}>
              {action.label}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const StatusesScreen: React.FC<{ go: React.Dispatch<React.SetStateAction<Tab>> }> = ({ go }) => {
  return (
    <div className="page pad fade-in">
      <div className="row-b">
        <div className="h2">Статусы</div>
        <div className="t-caption">Как растёт твой уровень участия</div>
      </div>
      <div className="sp-3" />
      <div className="list">
        <StatusCard
          level="WHITE"
          title="WHITE — вход в экосистему"
          subtitle="Базовый статус для новых участников"
          bullets={[
            "Доступ к Jetlag Hub и Jetlag Daily",
            "Участие в миссиях уровня WHITE",
            "Стартовый набор активностей и XP",
            "Переход в RED при 10 000 JP",
          ]}
          action={null}
        />
        <StatusCard
          level="RED"
          title="RED — активные креаторы"
          subtitle="Больше миссий и приоритеты"
          bullets={[
            "Доступ к WHITE и RED миссиям",
            "Приоритет в откликах и модерации",
            "Ранний доступ к ивентам",
            "Движение к BLACK при 100 000 JP",
          ]}
          action={null}
        />
        <StatusCard
          level="BLACK"
          title="BLACK — легенды и лидеры"
          subtitle="Для заметных деятелей индустрии"
          bullets={[
            "Для BLACK не нужны подписки",
            "Доступ ко всему и сразу",
            "Отбор: не только баллы, но и вклад в индустрию",
            "Амбассадорские возможности и особые ивенты",
          ]}
          action={null}
        />
      </div>

      <div className="sp-4" />
      <div className="card">
        <div className="card-sec">
          <div className="h2">Как растёт статус</div>
          <div className="sp-2" />
          <div className="t-caption" style={{ opacity: 0.9 }}>
            Набирай JetPoints за миссии, активности и вклад в коммьюнити.
            <br />
            WHITE → 10 000 JP = RED. RED → 100 000 JP = заявка на BLACK (с рассмотрением).
          </div>
        </div>
      </div>
    </div>
  );
};

/** ── Landing ─────────────────────────────────────── */
const LandingScreen: React.FC<{ onEnterHub: () => void; onOpenWhite: () => void }> = ({
  onEnterHub,
  onOpenWhite,
}) => (
  <div
    className="page fade-in"
    style={{
      minHeight: "100vh",
      background: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}
  >
    <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
      <div style={{ height: 12 }} />
      <div style={{ fontSize: 22, fontWeight: 700 }}>Добро пожаловать в экосистему FMT.JETLAG</div>
      <div style={{ height: 28 }} />
      <div style={{ display: "grid", gap: 10 }}>
        <button
          className="btn"
          onClick={onEnterHub}
          style={{ height: 48, fontSize: 15, fontWeight: 600 }}
        >
          JETLAG HUB
        </button>
        <button
          className="btn btn-sec"
          onClick={onOpenWhite}
          style={{ height: 48, fontSize: 15, fontWeight: 600 }}
        >
          JETLAG WHITE (Telegram)
        </button>
      </div>
      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.6 }}>
        Нажмите «JETLAG HUB», чтобы войти в мини-приложение
      </div>
    </div>
  </div>
);

/** ── Plans ───────────────────────────────────────── */
type PlanCardT = {
  key: PlanKey | "FREE";
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  best?: boolean;
};

const PLAN_CARDS: PlanCardT[] = [
  {
    key: "FREE",
    title: "Free",
    price: "₽0 / месяц",
    subtitle: "Базовый доступ",
    features: ["Доступ к Jetlag Hub и Daily", "Участие в миссиях уровня WHITE", "Профиль и JetPoints"],
  },
  {
    key: "PLUS",
    title: "Plus",
    price: "₽1 000 / месяц",
    subtitle: "Больше доступа к экосистеме",
    features: [
      "Расширенные миссии",
      "Приоритет в откликах",
      "Ежемесячные бонус-миссии + XP буст",
      "Ранний доступ к ивентам",
    ],
    best: true,
  },
  {
    key: "PRO",
    title: "Pro",
    price: "₽5 000 / месяц",
    subtitle: "Для активных креаторов",
    features: [
      "Все из Plus",
      "Доступ в усадьбу джетлаг",
      "Скидки на продукты экосистемы",
      "PRO-миссии с кэш-гонорарами",
      "Больше слотов на отклики",
      "Приоритетная модерация и поддержка",
    ],
  },
  {
    key: "STUDIO",
    title: "Studio",
    price: "дог.",
    subtitle: "Команды/студии",
    features: [
      "Командные роли и доступы",
      "Биллинг и отчёты",
      "Корпоративные миссии",
      "Консьерж и кастомные интеграции",
    ],
  },
];

const PlansScreen: React.FC<{ current: PlanKey; onChoose: (p: PlanKey) => void }> = ({
  current,
  onChoose,
}) => {
  const handleChoose = (p: PlanKey) => {
    if (p === null) return onChoose(null);
    if (confirm(`Подтвердить подключение плана ${p}?`)) onChoose(p);
  };
  return (
    <div className="page pad fade-in">
      <div className="row-b">
        <div className="h2">Подписки</div>
        <div className="t-caption">
          Текущий план: <b>{current ?? "Free"}</b>
        </div>
      </div>
      <div className="sp-3" />
      <div className="list">
        {PLAN_CARDS.map((card) => (
          <div
            key={card.key}
            className="card"
            style={{
              border: card.best ? "1px solid rgba(255,255,255,.35)" : "1px solid var(--line)",
              boxShadow: card.best ? "0 0 0 1px rgba(255,255,255,.12) inset" : undefined,
            }}
          >
            <div className="card-sec">
              <div className="row-b">
                <div className="h2">{card.title}</div>
                {card.best && <span className="chip">Топ выбор</span>}
              </div>
              <div className="sp-1" />
              <div className="row" style={{ alignItems: "baseline", gap: 8 }}>
                <div className="h2" style={{ fontSize: 22 }}>
                  {card.price}
                </div>
                <div className="t-caption">{card.subtitle}</div>
              </div>
              <div className="sp-2" />
              <ul className="t-body" style={{ display: "grid", gap: 6, paddingLeft: 18 }}>
                {card.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div className="sp-3" />
              {card.key === "FREE" ? (
                <Button
                  kind="ghost"
                  size="m"
                  className={current === null ? "btn-disabled" : ""}
                  onClick={() => onChoose(null)}
                >
                  Оставить Free
                </Button>
              ) : (
                <Button
                  size="m"
                  className={current === card.key ? "btn-disabled" : ""}
                  onClick={() => handleChoose(card.key as PlanKey)}
                >
                  {current === card.key ? "Текущий план" : "Подключить"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sp-4" />
      <div className="card">
        <div className="card-sec">
          <div className="h2">Сравнение возможностей</div>
          <div className="sp-2" />
          <div className="t-caption" style={{ opacity: 0.9 }}>
            • Миссии: Free — WHITE, Plus — WHITE/RED*, Pro — все + PRO-миссии, Studio — командный доступ.
            <br />
            • Ивенты: Free — общие, Plus/Pro — ранний доступ, Studio — корпоративные квоты.
          </div>
        </div>
      </div>
    </div>
  );
};

/** ── Опросник / Telegram WebApp ──────────────────── */
const tg = typeof window !== "undefined" ? (window as any).Telegram?.WebApp : undefined;

const STR = {
  ru: {
    title: "FMT.JETLAG",
    subtitle: "Профиль участника креативной индустрии · 1 минута",
    firstName: "Имя",
    enterFirstName: "Введите имя",
    lastName: "Фамилия",
    enterLastName: "Введите фамилию",
    email: "Электронная почта",
    country: "Страна",
    city: "Город",
    selectCountry: "Выберите страну",
    selectCity: "Сначала выберите страну",
    education: "Образование",
    selectEducation: "Выберите образование",
    universityLabel: "Вуз",
    selectUniversity: "Выберите вуз или начните ввод",
    other: "Другое",
    experience: "Опыт в индустрии",
    selectExperience: "Укажите год начала работы в индустрии",
    field: "Текущая сфера",
    specialization: "Специальность / роль",
    selectSpecialization: "Выберите специализацию",
    specializationOtherPh: "Введите вашу роль",
    portfolio: "Портфолио (ссылки)",
    portfolioPh: "https://… (Google Drive или Yandex Disk)",
    social: "Социальные сети",
    socialPh: "https://… (Telegram, Instagram, LinkedIn и т.д.)",
    addSocial: "Добавить соцссылку",
    addLink: "Добавить ссылку",
    remove: "Удалить",
    submit: "Отправить профиль",
    sent: "Отправлено",
    signinTip: "Совет: откройте мини-приложение внутри Telegram для автозаполнения профиля.",
    signedAs: "Войдёт как:",
    errFirstName: "Введите имя",
    errLastName: "Введите фамилию",
    errEmail: "Введите корректный email",
    errEducation: "Выберите образование",
    errUniversity: "Укажите вуз",
    errExperience: "Укажите год начала работы в индустрии",
    errFields: "Выберите хотя бы одно направление",
    errSpecialization: "Выберите специализацию",
    errSpecializationOther: "Укажите вашу роль",
    errCountry: "Укажите страну",
    errCity: "Укажите город",
    errPortfolio: "Добавьте хотя бы одну корректную ссылку на Google Drive или Yandex Disk",
    welcomeTitle: "Стань частью сообщества FMT.JETLAG",
    welcomeDesc:
      "Привет! Мы перезапускаем FMT.JETLAG. Заполни короткую анкету чтобы получить доступ к закрытому сообществу специалистов и единомышленников",
    chooseLanguage: "Выберите язык заполнения",
    start: "Начать",
  },
  en: {
    title: "FMT.JETLAG",
    subtitle: "Creative industry profile · 1 minute",
    firstName: "First name",
    enterFirstName: "Enter first name",
    lastName: "Last name",
    enterLastName: "Enter last name",
    email: "Email",
    country: "Country",
    city: "City",
    selectCountry: "Select a country",
    selectCity: "Select a country first",
    education: "Education",
    selectEducation: "Select education",
    universityLabel: "University",
    selectUniversity: "Select a university or start typing",
    other: "Other",
    experience: "Industry experience",
    selectExperience: "Enter the year you started working in the industry",
    field: "Current field",
    specialization: "Specialization / role",
    selectSpecialization: "Select specialization",
    specializationOtherPh: "Enter your role",
    portfolio: "Portfolio (links)",
    portfolioPh: "https://… (Google Drive or Yandex Disk)",
    social: "Social networks",
    socialPh: "https://… (Telegram, Instagram, LinkedIn, etc.)",
    addSocial: "Add social link",
    addLink: "Add link",
    remove: "Remove",
    submit: "Submit profile",
    sent: "Sent",
    signinTip: "Tip: open the mini app inside Telegram to auto-fill your profile.",
    signedAs: "Signed in as:",
    errFirstName: "Enter your first name",
    errLastName: "Enter your last name",
    errEmail: "Enter a valid email",
    errEducation: "Select your education",
    errUniversity: "Specify your university",
    errExperience: "Enter the year you started working in the industry",
    errFields: "Select at least one field",
    errSpecialization: "Select a specialization",
    errSpecializationOther: "Specify your role",
    errCountry: "Select a country",
    errCity: "Select a city",
    errPortfolio: "Add at least one valid Google Drive or Yandex Disk link",
    welcomeTitle: "Become part of the FMT.JETLAG community",
    welcomeDesc:
      "Hi! We're relaunching FMT.JETLAG. Fill out a short form to gain access to a private community of professionals and like-minded creators.",
    chooseLanguage: "Choose your language",
    start: "Start",
  },
} as const;

const EDUCATION = {
  ru: ["Среднее общее", "Среднее профессиональное", "Высшее", "Дополнительное профессиональное"],
  en: [
    "High school",
    "Vocational / technical education",
    "University / Bachelor's or higher",
    "Continuing professional education",
  ],
} as const;

const SPECIALIZATIONS = {
  ru: [
    "Продюсер",
    "Дизайнер",
    "Sound-дизайнер",
    "Режиссёр",
    "Маркетолог",
    "Фотограф",
    "Арт-директор",
    "Менеджер проектов",
    "Иллюстратор",
    "3D-артист",
    "Аналитик",
    "Разработчик",
    "Другое",
  ],
  en: [
    "Producer",
    "Designer",
    "Sound designer",
    "Director",
    "Marketer",
    "Photographer",
    "Art director",
    "Project manager",
    "Illustrator",
    "3D artist",
    "Analyst",
    "Developer",
    "Other",
  ],
} as const;

const FIELDS = {
  ru: [
    "Музыка",
    "Мода / дизайн",
    "Видео / продакшн",
    "Digital / IT / AI",
    "Маркетинг / реклама",
    "Арт / иллюстрация",
    "Образование / культура",
    "Другое",
  ],
  en: [
    "Music",
    "Fashion / design",
    "Video / production",
    "Digital / IT / AI",
    "Marketing / advertising",
    "Art / illustration",
    "Education / culture",
    "Other",
  ],
} as const;

const COUNTRIES_I18N: Record<"ru" | "en", Record<string, string[]>> = {
  ru: {
    Россия: ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург"],
    Грузия: ["Тбилиси", "Батуми", "Кутаиси"],
    ОАЭ: ["Дубай", "Абу-Даби", "Шарджа"],
    Казахстан: ["Алматы", "Астана", "Шымкент"],
    Армения: ["Ереван"],
    Другие: ["Другое"],
  },
  en: {
    Russia: ["Moscow", "Saint Petersburg", "Kazan", "Yekaterinburg"],
    Georgia: ["Tbilisi", "Batumi", "Kutaisi"],
    UAE: ["Dubai", "Abu Dhabi", "Sharjah"],
    Kazakhstan: ["Almaty", "Astana", "Shymkent"],
    Armenia: ["Yerevan"],
    Other: ["Other"],
  },
};

const UNIVERSITIES: string[] = [
  "МГУ им. М.В. Ломоносова",
  "СПбГУ",
  "ВШЭ",
  "МГТУ им. Н.Э. Баумана",
  "МГИК",
  "РАНХиГС",
  "Тбилисский государственный университет",
  "Свободный университет Тбилиси",
  "NYU Abu Dhabi",
  "Khalifa University",
  "American University in Dubai",
  "Назарбаев Университет",
  "КБТУ",
  "КазНУ им. аль-Фараби",
  "Ереванский государственный университет",
  "University of the Arts London (UAL)",
  "Berklee College of Music",
  "Parsons School of Design",
  "Politecnico di Milano",
];

const T = (lang: "ru" | "en") => (k: keyof (typeof STR)["ru"]) =>
  (STR as any)[lang][k] || (STR as any).ru[k];

function FieldChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 12px",
        borderRadius: 999,
        fontSize: 13,
        border: selected
          ? "1px solid #FFFFFF"
          : "1px solid rgba(255,255,255,0.28)",
        background: selected ? "#FFFFFF" : "transparent",
        color: selected ? "#000000" : "#FFFFFF",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

const buildBiMap = (ruArr: readonly string[], enArr: readonly string[]) => {
  console.assert(ruArr.length === enArr.length, "RU/EN arrays must be equal length");
  const ru2en = new Map<string, string>();
  const en2ru = new Map<string, string>();
  ruArr.forEach((ru, i) => {
    ru2en.set(ru, enArr[i]);
  });
  enArr.forEach((en, i) => {
    en2ru.set(en, ruArr[i]);
  });
  return { ru2en, en2ru };
};

const MAP_EDU = buildBiMap(EDUCATION.ru, EDUCATION.en);
const MAP_SPEC = buildBiMap(SPECIALIZATIONS.ru, SPECIALIZATIONS.en);
const MAP_FIELDS = buildBiMap(FIELDS.ru, FIELDS.en);

function translateVal(
  val: string,
  from: "ru" | "en",
  to: "ru" | "en",
  map: { ru2en: Map<string, string>; en2ru: Map<string, string> },
) {
  if (!val) return val;
  if (from === to) return val;
  const m = from === "ru" ? map.ru2en : map.en2ru;
  return m.get(val) || val;
}

function translateArray(
  vals: string[],
  from: "ru" | "en",
  to: "ru" | "en",
  map: { ru2en: Map<string, string>; en2ru: Map<string, string> },
) {
  return vals.map((v) => translateVal(v, from, to, map));
}

function isAllowedPortfolioLink(link: string): boolean {
  try {
    const u = new URL(link);
    const host = u.hostname.toLowerCase();
    if (host === "drive.google.com" || host === "docs.google.com") return true;
    if (host === "disk.yandex.ru" || host === "disk.yandex.com" || host === "yadi.sk") return true;
    return false;
  } catch {
    return false;
  }
}

(function devSelfTest() {
  try {
    console.assert(
      EDUCATION.ru.length === EDUCATION.en.length,
      "[i18n] EDUCATION RU/EN length mismatch",
    );
    console.assert(
      SPECIALIZATIONS.ru.length === SPECIALIZATIONS.en.length,
      "[i18n] SPECIALIZATIONS RU/EN length mismatch",
    );
    console.assert(FIELDS.ru.length === FIELDS.en.length, "[i18n] FIELDS RU/EN length mismatch");
  } catch (e) {
    console.error("[self-test] failed:", e);
  }
})();

const OnboardingSurvey: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [lang, setLang] = useState<"ru" | "en">("ru");
  const t = T(lang);
  const [started, setStarted] = useState(false);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => String(current - i));
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [education, setEducation] = useState("");
  const [university, setUniversity] = useState("");
  const [experience, setExperience] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [specialization, setSpecialization] = useState("");
  const [specializationOther, setSpecializationOther] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([""]);
  const [socialLinks, setSocialLinks] = useState<string[]>([""]);
  const [submitted, setSubmitted] = useState(false);

  // ====== стили, близкие к макету ======
  const pageStyle = {
    minHeight: "100vh",
    background: "#000000",
    color: "#FFFFFF",
    padding: "24px 20px 80px",
  } as const;

  const wrapperStyle = {
    maxWidth: 520,
    margin: "0 auto",
  } as const;

  const sectionStyle = {
    marginBottom: 20,
  } as const;

  const labelStyle = {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
  } as const;

  const subtitleStyle = {
    fontSize: 13,
    color: "rgba(156,163,175,1)",
    marginTop: 4,
  } as const;

  const inputStyle = {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    padding: "11px 14px",
    fontSize: 14,
    color: "#FFFFFF",
    outline: "none",
  } as const;

  const disabledInputStyle = {
    ...inputStyle,
    opacity: 0.5,
  };

  const errorStyle = {
    fontSize: 11,
    color: "#f87171",
    marginTop: 6,
  } as const;

  const smallButtonStyle = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.28)",
    background: "transparent",
    color: "#FFFFFF",
    padding: "7px 10px",
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
  } as const;

  const addButtonStyle = {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.22)",
    padding: "8px 12px",
    fontSize: 13,
    background: "transparent",
    color: "#FFFFFF",
    cursor: "pointer",
  } as const;

  const primaryButtonStyle = {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.9)",
    padding: "11px 16px",
    fontSize: 14,
    fontWeight: 500,
    background: "#FFFFFF",
    color: "#000000",
    cursor: "pointer",
  } as const;

  const yearsSelectStyle = inputStyle;

  // ====== Telegram user ======
  const user = tg?.initDataUnsafe?.user;
  useEffect(() => {
    if (user) {
      if (!firstName && user.first_name) setFirstName(user.first_name);
      if (!lastName && user.last_name) setLastName(user.last_name);
      if (user.language_code && (user.language_code as string).startsWith("en")) setLang("en");
    }
  }, [user, firstName, lastName]);

  const handleLangChange = (newLang: "ru" | "en") => {
    if (newLang === lang) return;
    const from = lang;
    const to = newLang;
    setEducation((prev) => translateVal(prev, from, to, MAP_EDU));
    setSpecialization((prev) => {
      const isOther = from === "ru" ? prev === "Другое" : prev === "Other";
      return isOther ? (to === "ru" ? "Другое" : "Other") : translateVal(prev, from, to, MAP_SPEC);
    });
    setFields((prev) => translateArray(prev, from, to, MAP_FIELDS));
    setLang(newLang);
  };

  const EDU = EDUCATION[lang];
  const SPEC = SPECIALIZATIONS[lang];
  const FIELD_LIST = FIELDS[lang];
  const COUNTRIES = COUNTRIES_I18N[lang];
  const isHigherEducation = (val: string) => val === EDUCATION.ru[2] || val === EDUCATION.en[2];

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = STR[lang].errFirstName;
    if (!lastName.trim()) e.lastName = STR[lang].errLastName;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = STR[lang].errEmail;
    if (!country.trim()) e.country = STR[lang].errCountry;
    if (!city.trim()) e.city = STR[lang].errCity;
    if (!education) e.education = STR[lang].errEducation;
    if (isHigherEducation(education) && !university.trim()) e.university = STR[lang].errUniversity;
    if (!experience) e.experience = STR[lang].errExperience;
    if (!fields.length) e.fields = STR[lang].errFields;
    if (!specialization) e.specialization = STR[lang].errSpecialization;
    if (
      specialization === (lang === "ru" ? "Другое" : "Other") &&
      !specializationOther.trim()
    )
      e.specializationOther = STR[lang].errSpecializationOther;

    const cleaned = portfolioLinks.map((x) => x.trim()).filter(Boolean);
    const hasAtLeastOne = cleaned.length > 0;
    const allAllowed = cleaned.every((link) => isAllowedPortfolioLink(link));
    if (!hasAtLeastOne || !allAllowed) e.portfolio = STR[lang].errPortfolio;

    const cleanedSocialLinks = socialLinks.map((x) => x.trim()).filter(Boolean);
    const socialsInvalid = cleanedSocialLinks.some((link) => {
      try {
        new URL(link);
        return false;
      } catch {
        return true;
      }
    });
    if (cleanedSocialLinks.length && socialsInvalid)
      e.social =
        lang === "ru"
          ? "Проверьте корректность ссылок на соцсети"
          : "Check that social links are valid URLs";
    return e;
  }, [
    firstName,
    lastName,
    email,
    country,
    city,
    education,
    university,
    experience,
    fields,
    specialization,
    specializationOther,
    portfolioLinks,
    socialLinks,
    lang,
  ]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  useEffect(() => {
    tg?.ready?.();
    tg?.expand?.();
    const update = () => {
      tg?.MainButton?.setText?.(STR[lang].submit);
      tg?.MainButton?.setParams?.({ color: "#FFFFFF", text_color: "#000000" });
      if (started && isValid && !submitted) tg?.MainButton?.show?.();
      else tg?.MainButton?.hide?.();
    };
    update();
    const onClick = () => handleSubmit();
    tg?.MainButton?.onClick?.(onClick);
    return () => {
      try {
        tg?.MainButton?.offClick?.(onClick);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, isValid, submitted, lang]);

  const toggleField = (label: string) => {
    setFields((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
  };

  const countryOptions = Object.keys(COUNTRIES);
  const cityOptions = country && COUNTRIES[country] ? COUNTRIES[country] : [];

  const addPortfolioField = () => setPortfolioLinks((prev) => [...prev, ""]);
  const removePortfolioField = (idx: number) =>
    setPortfolioLinks((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const addSocialField = () => setSocialLinks((prev) => [...prev, ""]);
  const removeSocialField = (idx: number) =>
    setSocialLinks((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const handleSubmit = () => {
    if (!isValid) {
      tg?.HapticFeedback?.notificationOccurred?.("error");
      alert(lang === "ru" ? "Заполните все обязательные поля" : "Please fill all required fields");
      return;
    }
    const payload = {
      lang,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      country: country.trim(),
      city: city.trim(),
      education,
      university: isHigherEducation(education) ? university.trim() : null,
      experience,
      field: fields,
      specialization:
        specialization === (lang === "ru" ? "Другое" : "Other")
          ? specializationOther.trim()
          : specialization,
      portfolio: portfolioLinks.map((x) => x.trim()).filter(Boolean),
      socials: socialLinks.map((x) => x.trim()).filter(Boolean),
      tg_user: user || null,
      ts: new Date().toISOString(),
      app: "jetlag-profile-v24",
    } as const;

    try {
      tg?.HapticFeedback?.impactOccurred?.("medium");
      tg?.sendData?.(JSON.stringify(payload));
      setSubmitted(true);
      try {
        localStorage.setItem("jl_survey_done", "1");
      } catch {}
      setTimeout(() => {
        tg?.close?.();
        onDone();
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить данные. Попробуйте ещё раз.");
    }
  };

  // ===== welcome экран =====
  if (!started) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000000",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={wrapperStyle}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>FMT.JETLAG</h1>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
            {STR[lang].welcomeTitle}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(156,163,175,1)",
              marginBottom: 20,
              lineHeight: 1.4,
            }}
          >
            {STR[lang].welcomeDesc}
          </p>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>{STR[lang].chooseLanguage}</label>
            <select
              value={lang}
              onChange={(e) => handleLangChange(e.target.value as "ru" | "en")}
              style={inputStyle}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          <button
            onClick={() => setStarted(true)}
            style={primaryButtonStyle}
          >
            {STR[lang].start}
          </button>
        </div>
      </div>
    );
  }

  // ===== основной экран формы =====
  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        {/* header */}
        <header style={{ marginBottom: 22, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>FMT.JETLAG</div>
            <div style={subtitleStyle}>{STR[lang].subtitle}</div>
          </div>
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value as "ru" | "en")}
            style={{
              ...inputStyle,
              width: "auto",
              padding: "6px 10px",
              fontSize: 12,
            }}
          >
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
        </header>

        {/* Имя */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].firstName}</div>
          <input
            type="text"
            placeholder={STR[lang].enterFirstName}
            style={inputStyle}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {/* @ts-ignore */}
          {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
        </section>

        {/* Фамилия */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].lastName}</div>
          <input
            type="text"
            placeholder={STR[lang].enterLastName}
            style={inputStyle}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {/* @ts-ignore */}
          {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
        </section>

        {/* Email */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].email}</div>
          <input
            type="email"
            placeholder="example@email.com"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* @ts-ignore */}
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </section>

        {/* Страна */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].country}</div>
          <input
            list="country-list"
            placeholder={STR[lang].selectCountry}
            style={inputStyle}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCity("");
            }}
          />
          {/* @ts-ignore */}
          {errors.country && <p style={errorStyle}>{errors.country}</p>}
        </section>

        {/* Город */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].city}</div>
          <input
            list="city-list"
            placeholder={STR[lang].selectCity}
            style={country ? inputStyle : disabledInputStyle}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!country}
          />
          {/* @ts-ignore */}
          {errors.city && <p style={errorStyle}>{errors.city}</p>}
        </section>

        {/* Образование + Вуз */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].education}</div>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            style={inputStyle}
          >
            <option value="">{STR[lang].selectEducation}</option>
            {EDU.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {/* @ts-ignore */}
          {errors.education && <p style={errorStyle}>{errors.education}</p>}

          {isHigherEducation(education) && (
            <div style={{ marginTop: 10 }}>
              <div style={labelStyle}>{STR[lang].universityLabel}</div>
              <input
                list="university-list"
                placeholder={STR[lang].selectUniversity}
                style={inputStyle}
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
              {/* @ts-ignore */}
              {errors.university && <p style={errorStyle}>{errors.university}</p>}
            </div>
          )}
        </section>

        {/* Опыт */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].experience}</div>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={yearsSelectStyle}
          >
            <option value="">{STR[lang].selectExperience}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {/* @ts-ignore */}
          {errors.experience && <p style={errorStyle}>{errors.experience}</p>}
        </section>

        {/* Текущая сфера */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].field}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FIELD_LIST.map((f) => (
              <FieldChip key={f} label={f} selected={fields.includes(f)} onClick={() => toggleField(f)} />
            ))}
          </div>
          {/* @ts-ignore */}
          {errors.fields && <p style={errorStyle}>{errors.fields}</p>}
        </section>

        {/* Специализация */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].specialization}</div>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            style={inputStyle}
          >
            <option value="">{STR[lang].selectSpecialization}</option>
            {SPEC.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value={lang === "ru" ? "Другое" : "Other"}>
              {lang === "ru" ? "Другое" : "Other"}
            </option>
          </select>
          {specialization === (lang === "ru" ? "Другое" : "Other") && (
            <div style={{ marginTop: 10 }}>
              <input
                type="text"
                placeholder={STR[lang].specializationOtherPh}
                style={inputStyle}
                value={specializationOther}
                onChange={(e) => setSpecializationOther(e.target.value)}
              />
              {/* @ts-ignore */}
              {errors.specializationOther && <p style={errorStyle}>{errors.specializationOther}</p>}
            </div>
          )}
          {/* @ts-ignore */}
          {errors.specialization && <p style={errorStyle}>{errors.specialization}</p>}
        </section>

        {/* Портфолио */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].portfolio}</div>
          {portfolioLinks.map((value, index) => (
            <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="url"
                placeholder={`${STR[lang].portfolioPh} #${index + 1}`}
                style={inputStyle}
                value={value}
                onChange={(e) => {
                  const v = e.target.value;
                  setPortfolioLinks((prev) => {
                    const arr = [...prev];
                    arr[index] = v;
                    return arr;
                  });
                }}
              />
              <button
                type="button"
                onClick={() => removePortfolioField(index)}
                disabled={portfolioLinks.length === 1}
                style={{
                  ...smallButtonStyle,
                  opacity: portfolioLinks.length === 1 ? 0.5 : 1,
                }}
              >
                {STR[lang].remove}
              </button>
            </div>
          ))}
          <button type="button" onClick={addPortfolioField} style={addButtonStyle}>
            + {STR[lang].addLink}
          </button>
          {/* @ts-ignore */}
          {errors.portfolio && <p style={errorStyle}>{errors.portfolio}</p>}
        </section>

        {/* Соцсети */}
        <section style={sectionStyle}>
          <div style={labelStyle}>{STR[lang].social}</div>
          {socialLinks.map((value, index) => (
            <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="url"
                placeholder={`${STR[lang].socialPh} #${index + 1}`}
                style={inputStyle}
                value={value}
                onChange={(e) => {
                  const v = e.target.value;
                  setSocialLinks((prev) => {
                    const arr = [...prev];
                    arr[index] = v;
                    return arr;
                  });
                }}
              />
              <button
                type="button"
                onClick={() => removeSocialField(index)}
                disabled={socialLinks.length === 1}
                style={{
                  ...smallButtonStyle,
                  opacity: socialLinks.length === 1 ? 0.5 : 1,
                }}
              >
                {STR[lang].remove}
              </button>
            </div>
          ))}
          <button type="button" onClick={addSocialField} style={addButtonStyle}>
            + {STR[lang].addSocial}
          </button>
          {/* @ts-ignore */}
          {errors.social && <p style={errorStyle}>{errors.social}</p>}
        </section>

        {/* кнопка отправки */}
        <section style={{ marginTop: 26 }}>
          <button
            onClick={handleSubmit}
            disabled={!isValid || submitted}
            style={{
              ...primaryButtonStyle,
              opacity: !isValid || submitted ? 0.5 : 1,
            }}
          >
            {submitted ? STR[lang].sent : STR[lang].submit}
          </button>
        </section>

        {/* футер */}
        <footer style={{ marginTop: 20, fontSize: 11, color: "rgba(156,163,175,1)" }}>
          {user ? (
            <p>
              {STR[lang].signedAs} {user?.first_name} {user?.last_name || ""}
            </p>
          ) : (
            <p>{STR[lang].signinTip}</p>
          )}
        </footer>

        {/* datalist'ы */}
        <datalist id="country-list">
          {countryOptions.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <datalist id="city-list">
          {cityOptions.map((ct) => (
            <option key={ct} value={ct} />
          ))}
        </datalist>
        <datalist id="university-list">
          {UNIVERSITIES.map((u) => (
            <option key={u} value={u} />
          ))}
        </datalist>
      </div>
    </div>
  );
};


/** ── Root App ────────────────────────────────────── */
export default function App() {
  // всегда сначала показываем опросник
  const [boot, setBoot] = useState<"survey" | "app">("survey");

  const [tab, setTab] = useState<Tab>("profile");
  const [status] = useState<StatusLevel>("WHITE");
  const [plan, setPlan] = useState<PlanKey>(null);
  const jetpoints = 2540;

  const openWhite = () => {
    try {
      window.open(WHITE_CHAT_URL, "_blank", "noopener,noreferrer");
    } catch {}
  };

  if (boot === "survey") {
    return (
      <OnboardingSurvey
        onDone={() => {
          // после отправки анкеты сразу идём в приложение (лендинг)
          setBoot("app");
          setTab("landing");
        }}
      />
    );
  }

  // boot === "app"
  return (
    <>
      {tab !== "landing" && (
        <TopBar
          status={status}
          plan={plan}
          onProfile={() => setTab("profile")}
          onSettings={() => alert("Настройки (демо)")}
          onOpenPlans={() => setTab("plans")}
          onOpenStatuses={() => setTab("statuses")}
        />
      )}

      {tab === "landing" && (
        <LandingScreen
          onEnterHub={() => setTab("profile")}
          onOpenWhite={openWhite}
        />
      )}
      {tab === "home" && <HomeScreen go={setTab} status={status} plan={plan} />}
      {tab === "missions" && <MissionsScreen status={status} plan={plan} />}
      {tab === "events" && <EventsScreen status={status} plan={plan} />}
      {tab === "market" && <MarketScreen />}
      {tab === "jetlag" && <JetlagHub go={setTab} />}
      {tab === "profile" && (
        <ProfileScreen
          status={status}
          plan={plan}
          jetpoints={jetpoints}
          next={500}
          onSettings={() => alert("Настройки (демо)")}
        />
      )}
      {tab === "plans" && (
        <PlansScreen
          current={plan}
          onChoose={(p) => {
            setPlan(p);
            setTab("profile");
          }}
        />
      )}
      {tab === "statuses" && <StatusesScreen go={setTab} />}

      {tab !== "landing" && <BottomNav tab={tab} onChange={setTab} />}
    </>
  );
}
