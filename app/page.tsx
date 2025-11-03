"use client";

import React, { useMemo, useState } from "react";

/** --------- SVG icon set (inline, no deps) --------- */
const Icon = {
  Grid: (p: any) => (
    <svg viewBox="0 0 24 24" className="tab__icon" {...p}>
      <path fill="currentColor" d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  ),
  List: (p: any) => (
    <svg viewBox="0 0 24 24" className="tab__icon" {...p}>
      <path fill="currentColor" d="M4 7h16v2H4zM4 15h16v2H4zM4 11h16v2H4z" />
    </svg>
  ),
  Ticket: (p: any) => (
    <svg viewBox="0 0 24 24" className="tab__icon" {...p}>
      <path fill="currentColor" d="M3 7h18v4a2 2 0 0 1 0 2v4H3v-4a2 2 0 0 1 0-2V7z" />
    </svg>
  ),
  Store: (p: any) => (
    <svg viewBox="0 0 24 24" className="tab__icon" {...p}>
      <path fill="currentColor" d="M4 10h16l-1-4H5l-1 4zm2 2h12v8H6v-8z" />
    </svg>
  ),
  Brand: (p: any) => (
    <svg viewBox="0 0 24 24" className="tab__icon" {...p}>
      <rect x="10.5" y="6.5" width="3" height="3" fill="currentColor" />
      <rect x="10.5" y="14.5" width="3" height="3" fill="currentColor" />
    </svg>
  ),
  User: (p: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 8a8 8 0 0 1 16 0H4z" />
    </svg>
  ),
  Temple: (p: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path fill="currentColor" d="M12 5l8 3v3H4V8l8-3zM6 12v7h2v-7H6zm5 0v7h2v-7h-2zm5 0v7h2v-7h-2z" />
    </svg>
  ),
  Gear: (p: any) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path
        fill="currentColor"
        d="M12 8a4 4 0 104 4 4 4 0 00-4-4zm8.94 3a7.8 7.8 0 00-.5-1.9l2.06-1.6-2-3.46-2.43 1a8.5 8.5 0 00-1.64-.95l-.37-2.6H8l-.37 2.6a8.5 8.5 0 00-1.64.95l-2.43-1-2 3.46 2.06 1.6a7.8 7.8 0 00-.5 1.9l-2.56.4v4.01l2.56.4a7.8 7.8 0 00.5 1.9l-2.06 1.6 2 3.46 2.43-1c.52.38 1.07.7 1.64.95l.37 2.6h8l.37-2.6c.57-.25 1.12-.57 1.64-.95l2.43 1 2-3.46-2.06-1.6c.22-.6.38-1.24.5-1.9l2.56-.4V11z"
      />
    </svg>
  ),
};

/** --------- Data (static demo) --------- */
type StatusLevel = "WHITE" | "RED" | "BLACK";
const rankValue = (x: StatusLevel) => (x === "WHITE" ? 1 : x === "RED" ? 2 : 3);

const MISSIONS = [
  {
    id: "m1",
    brand: "FMT.JETLAG",
    title: "Рефреш айдентики для FMT.JETLAG Padel",
    deadline: "14.11.2025",
    tags: ["design", "branding"],
    rewards: { jp: 250, cash: "50 000 ₽" },
    minStatus: "WHITE" as StatusLevel,
  },
  {
    id: "m2",
    brand: "Bluora",
    title: "UGC-кампания: Travel-skin ритуалы",
    deadline: "21.11.2025",
    tags: ["video", "ugc"],
    rewards: { jp: 150, cash: "по результату" },
    minStatus: "WHITE" as StatusLevel,
  },
];

const EVENTS = [
  { id: "e1", title: "Creator Meetup: Music x AI", date: "16.11.2025", place: "Москва, Jet-Space", price: 0, min: "WHITE" as StatusLevel },
  { id: "e2", title: "Padel Night Tournament", date: "22.11.2025", place: "FMT.JETLAG Padel", price: 1500, min: "RED" as StatusLevel },
];

const MARKET = [
  { id: "i1", type: "SERVICE", title: "Сведение и мастеринг трека", price: 8000, owner: "@audio.kir" },
  { id: "i2", type: "PRODUCT", title: "Bluora Travel Kit v2", price: 2490, owner: "@bluora" },
];

/** --------- Small UI primitives --------- */
const Chip: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <span className={`btn btn--chip ${className || ""}`}>{children}</span>
);

const Button: React.FC<
  React.PropsWithChildren<{ variant?: "primary" | "secondary" | "ghost"; onClick?: () => void; className?: string }>
> = ({ children, variant = "primary", onClick, className }) => {
  const cls = variant === "secondary" ? "btn btn--secondary" : variant === "ghost" ? "btn btn--ghost" : "btn";
  return (
    <button type="button" className={`${cls} ${className || ""}`} onClick={onClick}>
      {children}
    </button>
  );
};

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`card ${className || ""}`}>{children}</div>
);

/** --------- Screens --------- */

function TopBar({ title, onManor, onSettings }: { title: string; onManor: () => void; onSettings: () => void }) {
  return (
    <div className="topbar">
      <div className="topbar__row container" style={{ padding: 0 }}>
        <div className="topbar__brand">
          <Icon.Grid /> <span>FMT.JETLAG</span>
        </div>
        <div className="topbar__title">{title}</div>
        <div className="topbar__actions">
          <Button variant="secondary" className="btn--chip" onClick={onManor}>
            <Icon.Temple /> Усадьба
          </Button>
          <Button variant="secondary" className="btn--chip" onClick={onSettings}>
            <Icon.Gear /> Настройки
          </Button>
        </div>
      </div>
    </div>
  );
}

function BottomNav({
  tab,
  onChange,
}: {
  tab: string;
  onChange: (key: "home" | "missions" | "events" | "market" | "jetlag") => void;
}) {
  const items = useMemo(
    () => [
      { key: "home", label: "Главная", icon: Icon.Grid },
      { key: "missions", label: "Миссии", icon: Icon.List },
      { key: "events", label: "Афиша", icon: Icon.Ticket },
      { key: "market", label: "Маркет", icon: Icon.Store },
      { key: "jetlag", label: "FMT.JETLAG", icon: Icon.Brand },
    ],
    []
  );
  return (
    <nav className="bottom">
      <div className="bottom__wrap">
        <div className="tabs">
          {items.map(({ key, label, icon: Ico }) => {
            const active = key === tab;
            return (
              <button
                key={key}
                className={`tab ${active ? "tab--active" : ""}`}
                onClick={() => onChange(key as any)}
                aria-label={label}
              >
                <Ico />
                <span style={{ fontSize: 11, lineHeight: "12px" }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/** Blocks used on multiple screens */
function ProductGrid() {
  const products = [
    { id: "p1", title: "Спорт", sub: "Падел клуб и экипировка" },
    { id: "p2", title: "Waterr", sub: "Газированная вода • 0.5 L" },
    { id: "p3", title: "Bluora", sub: "Косметика и travel наборы" },
    { id: "p4", title: "Одежда", sub: "Худи, футболки, аксессуары" },
  ];
  return (
    <div className="grid grid-2">
      {products.map((p) => (
        <Card key={p.id}>
          <div className="pcard">
            <div className="pcard__title">{p.title}</div>
            <div className="pcard__sub">{p.sub}</div>
            <div style={{ marginTop: 10 }}>
              <Button variant="secondary">Подробнее</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function VideoBlock() {
  // Нативный iframe; автозапуск (mute+playsinline). В TWA это работает после первого взаимодействия.
  const src =
    "https://www.youtube-nocookie.com/embed/-yPMtwa8f14?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&controls=0";
  return (
    <Card>
      <div className="section">
        <div className="h2" style={{ marginBottom: 8 }}>
          Видео и атмосфера
        </div>
        <div className="media">
          <iframe
            src={src}
            title="FMT.JETLAG video"
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <span className="caption">Автовоспроизведение включено (mute)</span>
          <Button variant="secondary" onClick={() => window.open(`https://youtu.be/-yPMtwa8f14`, "_blank")}>
            Смотреть
          </Button>
        </div>
      </div>
    </Card>
  );
}

/** Screens */
function Home({ go }: { go: (t: any) => void }) {
  return (
    <div className="grid">
      <Card>
        <div className="section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="caption">FMT.JETLAG Pulse</div>
            <div className="h2" style={{ marginTop: 4 }}>
              Идеи становятся делом
            </div>
            <div className="body" style={{ marginTop: 4 }}>
              Забирай миссии, собирай JetPoints, расти в статусе.
            </div>
          </div>
          <Icon.Brand />
        </div>
      </Card>

      <div className="grid grid-2">
        <Card>
          <div className="section">
            <div className="h2">Миссии</div>
            <div className="body" style={{ marginTop: 6 }}>
              Задачи от брендов и комьюнити
            </div>
            <div style={{ marginTop: 10 }}>
              <Button variant="secondary" onClick={() => go("missions")}>
                Открыть
              </Button>
            </div>
          </div>
        </Card>
        <Card>
          <div className="section">
            <div className="h2">Афиша</div>
            <div className="body" style={{ marginTop: 6 }}>
              Митапы, турниры и сессии
            </div>
            <div style={{ marginTop: 10 }}>
              <Button variant="secondary" onClick={() => go("events")}>
                Открыть
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Missions() {
  return (
    <div className="grid">
      <div className="row" style={{ alignItems: "baseline" }}>
        <div className="h2">Миссии</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Chip>Статус: WHITE</Chip>
          <Chip>План: нет</Chip>
        </div>
      </div>
      {MISSIONS.map((m) => (
        <Card key={m.id}>
          <div className="section">
            <div className="row">
              <div className="h2" style={{ fontSize: 15 }}>{m.title}</div>
              <Chip>{m.brand}</Chip>
            </div>
            <div className="body" style={{ marginTop: 6 }}>
              Дедлайн: {m.deadline}
            </div>
            <div className="body">Теги: {m.tags.join(", ")}</div>
            <div className="body">Награды: {m.rewards.jp} JP{m.rewards.cash ? ` + ${m.rewards.cash}` : ""}</div>
            <div className="row" style={{ marginTop: 10, justifyContent: "flex-end", gap: 8 }}>
              <Button variant="secondary">Подробнее</Button>
              <Button>Участвовать</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Events() {
  const status: StatusLevel = "WHITE";
  return (
    <div className="grid">
      <div className="h2">Афиша</div>
      {EVENTS.filter((e) => rankValue(status) >= rankValue(e.min)).map((e) => (
        <Card key={e.id}>
          <div className="section">
            <div className="h2" style={{ fontSize: 15 }}>{e.title}</div>
            <div className="body" style={{ marginTop: 4 }}>
              {e.date} — {e.place}
            </div>
            <div className="body">{e.price ? `${e.price} ₽` : "бесплатно"}</div>
            <div className="row" style={{ marginTop: 10, justifyContent: "flex-end", gap: 8 }}>
              <Button variant="secondary">Получить QR</Button>
              <Button>RSVP</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Market() {
  return (
    <div className="grid">
      <div className="row">
        <div className="h2">Маркет</div>
        <div style={{ marginLeft: "auto" }}>
          <Button variant="secondary">Опубликовать</Button>
        </div>
      </div>
      {MARKET.map((it) => (
        <Card key={it.id}>
          <div className="section">
            <div className="h2" style={{ fontSize: 15 }}>{it.title}</div>
            <div className="body">{it.type}</div>
            <div className="body">Цена: {it.price} ₽</div>
            <div className="body">Владелец: {it.owner}</div>
            <div className="row" style={{ marginTop: 10, justifyContent: "flex-end", gap: 8 }}>
              <Button variant="secondary">Подробнее</Button>
              <Button variant="secondary">Связаться</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function FmtJetlag({ goManor }: { goManor: () => void }) {
  return (
    <div className="grid">
      <Card>
        <div className="section">
          <div className="caption">О нас</div>
          <div className="h2" style={{ marginTop: 6 }}>
            Empowering talents to<br />bring value through content
          </div>
        </div>
      </Card>

      <Card>
        <div className="section">
          <div className="row">
            <div className="h2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.Temple /> Усадьба JETLAG
            </div>
            <Button variant="secondary" onClick={goManor}>
              Открыть 3D-тур
            </Button>
          </div>
          <div className="body" style={{ marginTop: 6 }}>
            Кампус для резиденций, съёмок и встреч сообщества.
          </div>
        </div>
      </Card>

      <div>
        <div className="h2" style={{ marginBottom: 8 }}>JETLAG продукты</div>
        <ProductGrid />
      </div>

      <VideoBlock />
    </div>
  );
}

/** --------- Root Page --------- */
export default function Page() {
  const [tab, setTab] = useState<"home" | "missions" | "events" | "market" | "jetlag">("jetlag");
  const title =
    tab === "home" ? "Главная" : tab === "missions" ? "Миссии" : tab === "events" ? "Афиша" : tab === "market" ? "Маркет" : "FMT.JETLAG";

  return (
    <>
      <TopBar
        title={title}
        onManor={() => alert("Открываю 3D-тур (демо)")}
        onSettings={() => alert("Откроем настройки позже")}
      />
      <main className="container" style={{ paddingTop: 16 }}>
        {tab === "home" && <Home go={(t) => setTab(t)} />}
        {tab === "missions" && <Missions />}
        {tab === "events" && <Events />}
        {tab === "market" && <Market />}
        {tab === "jetlag" && <FmtJetlag goManor={() => alert("Открываю 3D-тур (демо)")} />}
      </main>
      <BottomNav tab={tab} onChange={setTab} />
    </>
  );
}
