"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** простые inline-иконки */
const Icon = {
  Home: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10.5l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>),
  List: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7h12M4 7h1M8 12h12M4 12h1M8 17h12M4 17h1"/></svg>),
  Ticket: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 8h16v3a2 2 0 0 1 0 4v3H4v-3a2 2 0 0 1 0-4V8z"/></svg>),
  Store: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 10h16l-1-4H5l-1 4z"/><path d="M6 10v9h12v-9"/><path d="M9 14h6"/></svg>),
  Brand: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="10.5" y="6.5" width="3" height="3"/><rect x="10.5" y="14.5" width="3" height="3"/></svg>),
  Temple: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 6l7 3v3H5V9l7-3z"/><path d="M6 12v6M10 12v6M14 12v6M18 12v6"/></svg>),
  User: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>),
  Play: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>)
};

/** навигация */
type Tab = "home" | "missions" | "events" | "market" | "jetlag";

export default function App() {
  const [tab, setTab] = useState<Tab>("jetlag");

  const title = useMemo(() => ({
    home: "Главная",
    missions: "Миссии",
    events: "Афиша",
    market: "Маркет",
    jetlag: "FMT.JETLAG"
  }[tab]), [tab]);

  return (
    <>
      <TopBar
        title={title}
        onGoProfile={() => alert("Профиль (демо)")}
        onGoManor={() => setTab("jetlag")}
        onGoSettings={() => alert("Настройки (демо)")}
      />

      <div className="px-4 space-y-3">
        {tab === "home" && <Home onGo={setTab} />}
        {tab === "missions" && <Missions />}
        {tab === "events" && <Events />}
        {tab === "market" && <Market />}
        {tab === "jetlag" && <JetlagHub onGo={setTab} />}
      </div>

      <BottomNav tab={tab} onChange={setTab} />
    </>
  );
}

/* ---------- Top Bar ---------- */
function TopBar({ title, onGoProfile, onGoManor, onGoSettings }: {
  title: string; onGoProfile: () => void; onGoManor: () => void; onGoSettings: () => void
}) {
  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-black/75 border-b border-[#242428]">
      <div className="px-4">
        <div className="h-3" />
        <div className="h-12 grid grid-cols-3 items-center">
          <div className="text-[var(--text-70)] text-[13px] flex items-center gap-2">
            <Icon.Brand /> <span>FMT.JETLAG</span>
          </div>
          <div className="text-center font-semibold" style={{ fontSize: "16px" }}>{title}</div>
          <div className="justify-self-end flex items-center gap-6">
            <button className="btn btn-secondary h-9 px-3" onClick={onGoManor} aria-label="Усадьба"><Icon.Temple /></button>
            <button className="btn btn-secondary h-9 px-3" onClick={onGoSettings} aria-label="Настройки">⚙️</button>
          </div>
        </div>
        <div className="pb-2" />
        <div className="flex items-center justify-between text-[11px] text-[var(--text-60)] pb-3">
          <button className="btn btn-secondary h-7 px-2.5" onClick={onGoProfile}><Icon.User /> <span className="ml-2">Даниил</span></button>
          <div className="flex gap-2">
            <span className="btn btn-secondary h-7 px-2.5">WHITE</span>
            <span className="btn btn-secondary h-7 px-2.5">нет плана</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Bottom Nav ---------- */
function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { key: Tab; label: string; icon: any }[] = [
    { key: "home", label: "Главная", icon: Icon.Home },
    { key: "missions", label: "Миссии", icon: Icon.List },
    { key: "events", label: "Афиша", icon: Icon.Ticket },
    { key: "market", label: "Маркет", icon: Icon.Store },
    { key: "jetlag", label: "FMT.JETLAG", icon: Icon.Brand },
  ];
  return (
    <nav className="navbar">
      <div className="navbar-grid px-2">
        {items.map((it) => {
          const Active = it.key === tab;
          const Ico = it.icon;
          return (
            <button key={it.key} className={`nav-btn ${Active ? "active" : ""}`} onClick={() => onChange(it.key)}>
              <span className="nav-ico"><Ico /></span>
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------- Screens ---------- */
function Home({ onGo }: { onGo: (t: Tab) => void }) {
  return (
    <div className="space-y-3">
      <div className="card">
        <div className="card-pad flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[var(--text-60)]">FMT.JETLAG Pulse</div>
            <div className="mt-1 font-semibold" style={{ fontSize: "18px" }}>Идеи становятся делом</div>
            <div className="p mt-1">Миссии, JetPoints, статусы.</div>
          </div>
          <span>🚀</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <QuickCard title="Миссии" sub="Выбирай задачи" onClick={() => onGo("missions")} icon={<Icon.List />} />
        <QuickCard title="Афиша" sub="Митапы и турниры" onClick={() => onGo("events")} icon={<Icon.Ticket />} />
        <QuickCard title="Маркет" sub="Услуги и товары" onClick={() => onGo("market")} icon={<Icon.Store />} />
      </div>
    </div>
  );
}

function Missions() {
  const items = [
    { id: "m1", brand: "FMT.JETLAG", title: "Рефреш айдентики для FMT.JETLAG Padel", deadline: "14.11.2025", tags: "design, branding", reward: "250 JP + 50 000 ₽" },
    { id: "m2", brand: "Bluora", title: "UGC-кампания: Travel-skin ритуалы", deadline: "21.11.2025", tags: "video, ugc", reward: "150 JP + по результату" },
  ];
  return (
    <div className="space-y-2">
      <div className="h2">Миссии</div>
      {items.map(m => (
        <div key={m.id} className="card overflow-hidden">
          <div className="card-pad">
            <div className="flex items-center justify-between">
              <div className="font-medium" style={{ fontSize: "15px" }}>{m.title}</div>
              <span className="btn btn-secondary h-7 px-2.5">{m.brand}</span>
            </div>
            <div className="p mt-1">Дедлайн: {m.deadline}</div>
            <div className="p">Теги: {m.tags}</div>
            <div className="p">Награды: {m.reward}</div>
          </div>
          <div className="hr" />
          <div className="card-pad flex justify-end">
            <button className="btn btn-secondary" onClick={() => alert("Участвовать (демо)")}>Участвовать</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Events() {
  const items = [
    { id: "e1", title: "Creator Meetup: Music x AI", date: "16.11.2025", place: "Москва, Jet-Space", price: "бесплатно" },
    { id: "e2", title: "Padel Night Tournament", date: "22.11.2025", place: "FMT.JETLAG Padel", price: "1500 ₽" },
  ];
  return (
    <div className="space-y-2">
      <div className="h2">Афиша</div>
      {items.map(e => (
        <div key={e.id} className="card overflow-hidden">
          <div className="card-pad">
            <div className="font-medium" style={{ fontSize: "16px" }}>{e.title}</div>
            <div className="p mt-1">{e.date} — {e.place}</div>
            <div className="p">Цена: {e.price}</div>
          </div>
          <div className="hr" />
          <div className="card-pad flex gap-8 justify-end">
            <button className="btn btn-secondary" onClick={() => alert("QR (демо)")}>Получить QR</button>
            <button className="btn btn-primary" onClick={() => alert("RSVP (демо)")}>RSVP</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Market() {
  const items = [
    { id: "s1", type: "SERVICE", title: "Сведение и мастеринг трека", price: "8 000 ₽", owner: "@audio.kir" },
    { id: "s2", type: "SERVICE", title: "Motion-дизайн (30-сек ролик)", price: "15 000 ₽", owner: "@gfx.storm" },
    { id: "p1", type: "PRODUCT", title: "Bluora Travel Kit v2", price: "2 490 ₽", owner: "@bluora" },
  ];
  return (
    <div className="space-y-2">
      <div className="h2">Маркет</div>
      {items.map(it => (
        <div key={it.id} className="card overflow-hidden">
          <div className="card-pad">
            <div className="font-medium" style={{ fontSize: "16px" }}>{it.title}</div>
            <div className="p">{it.type}</div>
            <div className="p">Цена: {it.price}</div>
            <div className="p">Владелец: {it.owner}</div>
          </div>
          <div className="hr" />
          <div className="card-pad flex gap-3 justify-between">
            <button className="btn btn-secondary" onClick={() => alert("Подробнее (демо)")}>Подробнее</button>
            <button className="btn btn-secondary" onClick={() => alert("Связаться (демо)")}>Связаться</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- FMT.JETLAG Hub (с видео) ---------- */
function JetlagHub({ onGo }: { onGo: (t: Tab) => void }) {
  return (
    <div className="space-y-3">
      {/* О нас / слоган */}
      <div className="card">
        <div className="card-pad">
          <div className="text-[11px] uppercase tracking-widest text-[var(--text-60)]">О нас</div>
          <div className="mt-2 font-semibold" style={{ fontSize: "18px" }}>Empowering talents to</div>
          <div className="font-semibold -mt-1" style={{ fontSize: "18px" }}>bring value through content</div>
        </div>
      </div>

      {/* Усадьба */}
      <div className="card">
        <div className="card-pad">
          <div className="flex items-center justify-between">
            <div className="h2 flex items-center gap-2"><Icon.Temple /> Усадьба JETLAG</div>
            <button className="btn btn-secondary" onClick={() => alert("3D-тур (демо)")}>Открыть 3D-тур</button>
          </div>
          <div className="p mt-1">Кампус для резиденций, съёмок и встреч сообщества.</div>
        </div>
      </div>

      {/* Продукты */}
      <div className="card">
        <div className="card-pad">
          <div className="h2">JETLAG продукты</div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { t: "Спорт", d: "Падел клуб и экипировка" },
              { t: "Waterr", d: "Газированная вода • 0.5 L" },
              { t: "Bluora", d: "Косметика и travel наборы" },
              { t: "Одежда", d: "Худи, футболки, аксессуары" },
            ].map((p, i) => (
              <div key={i} className="card">
                <div className="card-pad">
                  <div className="font-medium" style={{ fontSize: "14px" }}>{p.t}</div>
                  <div className="p mt-1">{p.d}</div>
                  <div className="mt-2"><button className="btn btn-secondary" onClick={() => alert(`Подробнее: ${p.t}`)}>Подробнее</button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Видео и атмосфера (с автозапуском) */}
      <div className="card">
        <div className="card-pad">
          <div className="h2 mb-2">Видео и атмосфера</div>
          <VideoAuto videoId="-yPMtwa8f14" />
          <div className="mt-3 flex justify-end"><button className="btn btn-secondary" onClick={() => alert("Полноэкранный просмотр (демо)")}>Смотреть</button></div>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div className="card">
        <div className="card-pad grid grid-cols-2 gap-2">
          <button className="btn btn-secondary" onClick={() => onGo("missions")}>Перейти к миссиям</button>
          <button className="btn btn-secondary" onClick={() => onGo("events")}>К афише</button>
        </div>
      </div>
    </div>
  );
}

/* Быстрый мини-карточный элемент */
function QuickCard({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void; }) {
  return (
    <button onClick={onClick} className="card hover:bg-white/5 transition text-left">
      <div className="card-pad flex items-center gap-3">
        <div className="h-9 w-9 grid place-items-center rounded-lg bg-white/10 text-white/80">{icon}</div>
        <div className="leading-tight">
          <div className="font-medium" style={{ fontSize: "13px" }}>{title}</div>
          <div className="text-[11px] text-[var(--text-60)]">{sub}</div>
        </div>
      </div>
    </button>
  );
}

/* Видео с автозапуском при появлении в вьюпорте (mute + playsinline) */
function VideoAuto({ videoId }: { videoId: string }) {
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const urlBase = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const baseParams = "mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&autoplay=1";

    const io = new IntersectionObserver(([entry]) => {
      if (!el) return;
      const on = entry.isIntersecting;
      el.src = `${urlBase}?${baseParams}${on ? "" : "&autoplay=0"}`;
    }, { threshold: 0.35 });

    io.observe(el);
    return () => io.disconnect();
  }, [videoId]);

  return (
    <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,.12)]">
      <div className="aspect-video bg-black grid place-items-center">
        <iframe
          ref={ref}
          title="fmtjetlag-video"
          allow="autoplay; encrypted-media; picture-in-picture"
          className="w-full h-full"
        />
      </div>
      <div className="px-3 py-2 text-[11px] text-[var(--text-60)] flex items-center gap-2">
        <Icon.Play /> проигрывается автоматически при скролле
      </div>
    </div>
  );
}
