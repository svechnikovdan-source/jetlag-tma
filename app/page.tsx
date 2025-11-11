"use client";
import React, { useEffect, useMemo, useState } from "react";

const WHITE_CHAT_URL = process.env.NEXT_PUBLIC_WHITE_CHAT || "https://t.me/jetlagchat";

/** ── Types ───────────────────────────────────────── */
type Tab = "landing" | "home" | "missions" | "events" | "market" | "jetlag" | "profile" | "plans";
type StatusLevel = "WHITE" | "RED" | "BLACK";
type PlanKey = "PLUS" | "PRO" | "STUDIO" | null;
const rank = (s: StatusLevel) => (s === "WHITE" ? 1 : s === "RED" ? 2 : 3);

/** ── Inline icons (монохром) ─────────────────────── */
const Icon = {
  Home: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>),
  List: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/></svg>),
  Ticket: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h16v3a2 2 0 0 1 0 4v3H4v-3a2 2 0 0 1 0-4V8z"/><path d="M12 8v8"/></svg>),
  Bag: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l1 3v9H5V10l1-3z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/></svg>),
  Brand: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="10.5" y="7" width="3" height="3" rx="0.5"/><rect x="10.5" y="14" width="3" height="3" rx="0.5"/></svg>),
  User: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>),
  Settings: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.82-.33A1.6 1.6 0 0 0 14 21a2 2 0 0 1-4 0 1.6 1.6 0 0 0-1-1.51 1.6 1.6 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.29 17.9l.06-.06A1.6 1.6 0 0 0 4 16.02 1.6 1.6 0 0 0 2.49 15H3a2 2 0 0 1 0-4h.09c.67 0 1.27-.39 1.51-1a1.6 1.6 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.29l.06.06c.5.5 1.2.66 1.82.33A1.6 1.6 0 0 0 10 3a2 2 0 0 1 4 0 1.6 1.6 0 0 0 1.08 1.6c.62.33 1.32.17 1.82-.33l.06-.06A2 2 0 1 1 21 7.04l-.06.06c-.5.5-.66 1.2-.33 1.82.24.61.84 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.6 1.6 0 0 0-1.51 1z"/></svg>),
  Temple: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-5 9 5"/><path d="M4 10v8M8 10v8M12 10v8M16 10v8M20 10v8M2 18h20"/></svg>),
  Lock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V8a5 5 0 0 1 10 0v3" />
    </svg>
  ),
};

/** ── Data ─────────────────────────────────────────── */
type Mission = { id:string; brand:string; title:string; deadline:string; tags:string[]; rewards:{jetpoints:number; cash?:string}; minStatus:StatusLevel; requiredPlan:Exclude<PlanKey,null>|null; };
type EventItem = { id:string; title:string; date:string; place:string; access:{minStatus:StatusLevel; plan:PlanKey}; price:number };
type MarketItem = { id:string; type:"SERVICE"|"PRODUCT"; title:string; price:number; owner:string };
type DailyItem = { id:string; title:string; tag:string; action?: string };

const MISSIONS: Mission[] = [
  { id:"m1", brand:"FMT.JETLAG", title:"Рефреш айдентики для FMT.JETLAG Padel", deadline:"14.11.2025", tags:["design","branding"], rewards:{jetpoints:250, cash:"50 000 ₽"}, minStatus:"WHITE", requiredPlan:null },
  { id:"m2", brand:"Косметика", title:"UGC-кампания: Travel-skin ритуалы", deadline:"21.11.2025", tags:["video","ugc"], rewards:{jetpoints:150, cash:"по результату"}, minStatus:"WHITE", requiredPlan:"PLUS" },
  { id:"m3", brand:"Waterr", title:"Съёмка рекламного спота (Twitch)", deadline:"05.12.2025", tags:["video","production"], rewards:{jetpoints:500, cash:"120 000 ₽"}, minStatus:"RED", requiredPlan:"PRO" },
  { id:"m4", brand:"FMT.JETLAG Film", title:"Motion-пак для стрима-фильма", deadline:"30.11.2025", tags:["motion","gfx"], rewards:{jetpoints:400, cash:"дог."}, minStatus:"RED", requiredPlan:null },
];

const EVENTS: EventItem[] = [
  { id:"e1", title:"Creator Meetup: Music x AI", date:"16.11.2025", place:"Москва, Jet-Space", access:{minStatus:"WHITE", plan:null}, price:0 },
  { id:"e2", title:"FMT.JETLAG Padel Night Tournament", date:"22.11.2025", place:"FMT.JETLAG Padel", access:{minStatus:"RED", plan:"PLUS"}, price:1500 },
  { id:"e3", title:"Studio Session (Video Backstage)", date:"29.11.2025", place:"Jet Studio", access:{minStatus:"RED", plan:"STUDIO"}, price:0 },
];

const MARKET: MarketItem[] = [
  { id:"i1", type:"SERVICE", title:"Сведение и мастеринг трека", price:8000, owner:"@audio.kir" },
  { id:"i2", type:"SERVICE", title:"Motion-дизайн (30-сек ролик)", price:15000, owner:"@gfx.storm" },
  { id:"i3", type:"PRODUCT", title:"Bluora Travel Kit v2", price:2490, owner:"@bluora" },
];

const PEOPLE = [
  { id:"u1", name:"Арсений", role:"Основатель" },
  { id:"u2", name:"Мурад", role:"Блоггер" },
  { id:"u3", name:"Даниил", role:"Нефтянник" },
  { id:"u4", name:"9Mice", role:"Музыкант" },
  { id:"u5", name:"Kai Angel", role:"Музыкант" },
];

const DAILY: DailyItem[] = [
  { id:"d1", title:"Протестируй 1 миссию и оставь фидбек", tag:"community" },
  { id:"d2", title:"Сними короткий backstage 15–30 сек", tag:"ugc" },
  { id:"d3", title:"Добавь 1 товар/услугу в маркет", tag:"market", action:"Опубликовать" },
];

/** ── Primitives ───────────────────────────────────── */
const Button: React.FC<{children:React.ReactNode; kind?:"primary"|"secondary"|"ghost"; size?:"s"|"m"; onClick?:()=>void; className?:string}> =
({children, kind="primary", size="m", onClick, className}) =>
  <button className={`btn ${size==="s"?"btn-s":""} ${kind==="secondary"?"btn-sec":kind==="ghost"?"btn-ghost":""} ${className||""}`} onClick={onClick}>{children}</button>;

const Chip: React.FC<{children:React.ReactNode}> = ({children}) => <span className="chip">{children}</span>;

/** ── Top bar (2 строки) ───────────────────────────── */
const TopBar: React.FC<{
  onProfile:()=>void; onSettings:()=>void; onOpenPlans:()=>void;
  status: StatusLevel; plan: PlanKey;
}> = ({onProfile,onSettings,onOpenPlans,status,plan}) => (
  <div className="pad-x" style={{position:"sticky", top:0, zIndex:30, backdropFilter:"saturate(180%) blur(14px)", background:"rgba(0,0,0,.55)", borderBottom:"1px solid var(--line)"}}>
    <div className="sp-3" />
    <div className="row-b">
      <div style={{fontSize:17, fontWeight:600}}>FMT.JETLAG</div>
      <button className="btn btn-ghost btn-s" onClick={onSettings} aria-label="Настройки" style={{height:34, padding:"0 10px"}}>
        <Icon.Settings/>
      </button>
    </div>
    <div className="sp-2" />
    <div className="row-b">
      <button className="row" onClick={onProfile} aria-label="Профиль" style={{gap:8, background:"transparent", border:"none", borderRadius:10, height:28, padding:"0 12px", alignItems:"center"}}>
        <span className="ava" style={{width:22,height:22, borderRadius:8, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center"}}><Icon.User/></span>
        <span style={{fontSize:12,fontWeight:600,color:"white"}}>Даниил</span>
      </button>
      <div className="row" style={{gap:8}}>
        <Chip>{status}</Chip>
        <button className="chip" onClick={onOpenPlans} title="Управление подпиской">
          {plan ?? "нет плана"}
        </button>
      </div>
    </div>
    <div className="sp-2" />
  </div>
);



/** ── Bottom nav ───────────────────────────────────── */
const BottomNav: React.FC<{tab:Tab; onChange:React.Dispatch<React.SetStateAction<Tab>>}> = ({tab,onChange}) => {
  const Item: React.FC<{k:Extract<Tab,"home"|"missions"|"events"|"market"|"jetlag">; label:string; icon:React.FC}> = ({k,label,icon:IconX})=>{
    const active = tab===k;
    return (
      <button className={active?"active":""} onClick={()=>onChange(k)} role="tab" aria-selected={active}>
        <span className="ic"><IconX/></span>
        <span>{label}</span>
      </button>
    );
  };
  return (
    <nav className="bottom">
      <div className="bn">
        <Item k="home" label="Главная" icon={Icon.Home}/>
        <Item k="missions" label="Миссии" icon={Icon.List}/>
        <Item k="events" label="Афиша" icon={Icon.Ticket}/>
        <Item k="market" label="Маркет" icon={Icon.Bag}/>
        <Item k="jetlag" label="FMT.JETLAG" icon={Icon.Brand}/>
      </div>
    </nav>
  );
};

/** ── Screens ──────────────────────────────────────── */
const Hero: React.FC = () => (
  <div className="card">
    <div className="card-sec">
      <div className="h2" style={{fontSize:18}}>Empowering talents to<br/>bring value through content</div>
    </div>
  </div>
);

/** HOME: 2 блока — Миссии + Jetlag Daily */
const HomeScreen: React.FC<{
  go:React.Dispatch<React.SetStateAction<Tab>>;
  status: StatusLevel; plan: PlanKey;
}> = ({go, status, plan}) => {
  const canSee = (m: Mission) =>
    rank(status) >= rank(m.minStatus) && (!m.requiredPlan || plan === m.requiredPlan);

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
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Hero />

        {/* Блок: Миссии */}
        <div className="sp-4" />
        <div className="row-b">
          <div className="h2">Миссии</div>
          <Button kind="ghost" size="s" onClick={()=>go("missions")}>Открыть все</Button>
        </div>
        <div className="sp-2" />
        <div className="list">
          {MISSIONS.map(m=>{
            const locked = !canSee(m);
            return (
              <div className="card" key={m.id} style={{position:"relative", overflow:"hidden"}}>
                {locked && (
                  <div aria-hidden style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1 }}>
                    <div className="row" style={{ gap: 8, padding: "6px 10px", borderRadius: 10, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      <Icon.Lock />
                      <span className="t-caption" style={{ color: "rgba(255,255,255,.9)" }}>Недоступно</span>
                    </div>
                  </div>
                )}
                <div className="card-sec" style={{opacity:locked?0.78:1}}>
                  <div className="row-b">
                    <div className="h2" style={{fontSize:15}}>{m.title}</div>
                    <Chip>{m.brand}</Chip>
                  </div>
                  <div className="t-caption" style={{marginTop:6}}>
                    Дедлайн: {m.deadline} · {m.rewards.jetpoints} JP{m.rewards.cash?` + ${m.rewards.cash}`:""}
                  </div>
                </div>
                <div className="separator" />
                <div className="card-sec" style={{display:"flex", justifyContent:"flex-end"}}>
                  <Button size="s" className={locked?"btn-disabled":""} onClick={!locked?()=>go("missions"):undefined}>
                    Участвовать
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Блок: Jetlag Daily */}
        <div className="sp-4" />
        <div className="row-b">
          <div className="h2">Jetlag Daily</div>
          <Button kind="ghost" size="s" onClick={()=>alert("Скоро — полноценная лента Daily")}>Подробнее</Button>
        </div>
        <div className="sp-2" />
        <div className="list">
          {DAILY.map(d=>(
            <div className="card" key={d.id} style={{background:"rgba(255,255,255,.05)"}}>
              <div className="card-sec row-b">
                <div>
                  <div className="h2" style={{fontSize:14}}>{d.title}</div>
                  <div className="t-caption" style={{marginTop:4}}>#{d.tag}</div>
                </div>
                {d.action && <Button kind="secondary" size="s" onClick={()=>alert(`${d.action} (демо)`)}>
                  {d.action}
                </Button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MissionsScreen: React.FC<{status:StatusLevel; plan:PlanKey;}> = ({status, plan}) => {
  const canSee = (m: Mission) =>
    rank(status) >= rank(m.minStatus) && (!m.requiredPlan || plan === m.requiredPlan);

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
                <div aria-hidden style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1 }}>
                  <div className="row" style={{ gap: 8, padding: "6px 10px", borderRadius: 10, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <Icon.Lock />
                    <span className="t-caption" style={{ color: "rgba(255,255,255,.9)" }}>Требуется {needStatus} {needPlan}</span>
                  </div>
                </div>
              )}
              <div className="card-sec" style={{ opacity: locked ? 0.75 : 1 }}>
                <div className="row-b">
                  <div className="h2" style={{ fontSize: 15 }}>{m.title}</div>
                  <Chip>{m.brand}</Chip>
                </div>
                <div className="sp-2" />
                <div className="t-body">Дедлайн: {m.deadline}</div>
                <div className="t-body">Теги: {m.tags.join(", ")}</div>
                <div className="t-body">Награды: {m.rewards.jetpoints} JP{m.rewards.cash ? ` + ${m.rewards.cash}` : ""}</div>
                <div className="t-caption" style={{ marginTop: 6 }}>Доступ: {needStatus}{m.requiredPlan ? ` + план ${m.requiredPlan}` : ""}</div>
              </div>
              <div className="separator" />
              <div className="card-sec" style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button size="s" className={locked ? "btn-disabled" : ""} onClick={!locked ? () => alert("Отклик отправлен (демо)") : undefined}>Участвовать</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EventsScreen: React.FC<{status:StatusLevel; plan:PlanKey;}> = ({status, plan}) => {
  const items = EVENTS.filter(e=> rank(status)>=rank(e.access.minStatus) && (!e.access.plan || plan===e.access.plan));
  return (
    <div className="page pad fade-in">
      <div className="h2">Афиша</div>
      <div className="sp-3" />
      <div className="list">
        {items.map(e=>(
          <div className="card" key={e.id}>
            <div className="card-sec">
              <div className="h2" style={{fontSize:15}}>{e.title}</div>
              <div className="t-body" style={{marginTop:4}}>{e.date} — {e.place}</div>
              <div className="t-caption" style={{marginTop:4}}>Цена: {e.price ? `${e.price} ₽` : "бесплатно"}</div>
            </div>
            <div className="separator" />
            <div className="card-sec row-b">
              <Button kind="secondary" size="s">Получить QR</Button>
              <div className="row" style={{gap:8}}>
                <Button kind="ghost" size="s">Подробнее</Button>
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
      <Button kind="secondary" size="s" onClick={()=>alert("Публикация (демо)")}>Опубликовать</Button>
    </div>
    <div className="sp-3" />
    <div className="list">
      {MARKET.map(it=>(
        <div className="card" key={it.id}>
          <div className="card-sec">
            <div className="h2" style={{fontSize:15}}>{it.title}</div>
            <div className="t-caption" style={{marginTop:4}}>{it.type}</div>
            <div className="t-body" style={{marginTop:2}}>Цена: {it.price} ₽</div>
            <div className="t-body">Владелец: {it.owner}</div>
          </div>
          <div className="separator" />
          <div className="card-sec row-b">
            <Button kind="secondary" size="s">Подробнее</Button>
            <Button kind="secondary" size="s">Связаться</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const JetlagHub: React.FC<{go:React.Dispatch<React.SetStateAction<Tab>>}> = ({go}) => (
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
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 0 }} />
    <div style={{ position: "relative", zIndex: 1 }}>
      <div className="card">
        <div className="card-sec">
          <div className="t-caption">О нас</div>
          <div className="sp-2" />
          <div className="h2" style={{ fontSize: 18 }}>
            Empowering talents to<br />bring value through content
          </div>
        </div>
      </div>

      <div className="sp-4" />

      <div className="h2" style={{ marginBottom: 8 }}>Экосистема FMT.JETLAG</div>

      <div className="grid-2">
        {[
          { t: "Контент",     d: "Создаем контент для главных брендов мира", cta: true  },
          { t: "Музыка",      d: "Лейбл с крупнейшими артистами России и СНГ",         cta: true  },
          { t: "Образование", d: "Магистратура и бакалавр",                             cta: true  },
          { t: "Усадьба",     d: "Резиденция FMT.JETLAG",                                cta: true  },
          { t: "Спорт",       d: "Скоро открытие",                                       cta: false },
          { t: "Продукты",    d: "Скоро запуск",                                         cta: false },
        ].map((p, i) => (
          <div className="card" key={i}>
            <div className="card-sec">
              <div className="h2">{p.t}</div>
              <div className="t-body" style={{ marginTop: 4 }}>{p.d}</div>
              <div className="sp-3" />
              {p.cta && <Button kind="secondary" size="s">Подробнее</Button>}
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
            const init = p.name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={p.id} className="card" style={{ minWidth: 220 }}>
                <div className="card-sec">
                  <div className="row" style={{ gap: 10 }}>
                    <div className="ava">{init}</div>
                    <div>
                      <div className="h2" style={{ fontSize: 13 }}>{p.name}</div>
                      <div className="t-caption" style={{ marginTop: 2 }}>{p.role}</div>
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
          <div className="h2" style={{ marginBottom: 8 }}>Новости и релизы</div>
          <div className="list">
            <div className="card" style={{ background: "rgba(255,255,255,.05)" }}><div className="card-sec">Waterr — новая банка • 12/2025</div></div>
            <div className="card" style={{ background: "rgba(255,255,255,.05)" }}><div className="card-sec">Cosmetics Travel Kit v2 — обновили формулы и упаковку</div></div>
            <div className="card" style={{ background: "rgba(255,255,255,.05)" }}><div className="card-sec">Night Tournament — регистрация открыта</div></div>
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
}> = ({ status, plan, jetpoints, onSettings }) => {
  const profile = { username: "Привет, Даниил!", city: "Москва", role: "Продюсер" };
  const RED_GOAL = 10_000;
  const isBlack = status === "BLACK";
  const pct = isBlack ? 1 : Math.min(1, Math.max(0, jetpoints / RED_GOAL));
  const pctPercent = Math.round(pct * 100);
  const statusColor = status === "RED" ? "var(--red)" : status === "BLACK" ? "var(--muted)" : "var(--text)";

  return (
    <div className="page pad fade-in">
      <div className="card">
        <div className="card-sec">
          <div className="row-b">
            <div>
              <div className="h2" style={{fontSize:16, lineHeight:1.15}}>{profile.username}</div>
              <div className="t-caption" style={{marginTop:6}}>{profile.city} • {profile.role}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="status-badge" style={{color:statusColor,borderColor:"rgba(255,255,255,.22)"}}>{status}</div>
              <div className="t-caption" style={{marginTop:6}}>Баланс: <b>{jetpoints.toLocaleString("ru-RU")}</b></div>
            </div>
          </div>

          <div className="sp-3" />
          <div className="status-track">
            <div className="status-track__bar" style={{width: `${pctPercent}%`}} />
            <span className="status-tick" style={{left:"0%"}} />
            <span className="status-tick" style={{left:"100%"}} />
          </div>
          <div className="status-legend">
            <div className="status-legend__item">WHITE</div>
            <div className="status-legend__item">RED • 10 000</div>
            <div className="status-legend__item">BLACK • ∞</div>
          </div>
        </div>
      </div>

      <div className="sp-3" />
      <div className="card">
        <div className="card-sec">
          <div className="h2">Достижения</div>
          <div className="sp-2" />
          <div className="ach-scroll">
            {["a1","a2","a3","a4","a5"].map(id=>(
              <div className="ach" key={id}><div className="ach__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>
                </svg>
              </div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="sp-3" />
      <div className="card">
        <div className="card-sec"><div className="h2">Задачи</div></div>
        <div className="separator" />
        <div className="card-sec">
          <div className="list">
            {MISSIONS.slice(0, 2).map(m=>(
              <div className="card" key={m.id}>
                <div className="card-sec">
                  <div className="row-b">
                    <div className="h2" style={{ fontSize: 15 }}>{m.title}</div>
                    <Chip>{m.brand}</Chip>
                  </div>
                  <div className="t-caption" style={{ marginTop: 6 }}>
                    Дедлайн: {m.deadline} · Теги: {m.tags.join(", ")}
                  </div>
                </div>
                <div className="separator" />
                <div className="card-sec" style={{ display:"flex", justifyContent:"flex-end" }}>
                  <Button size="s">Открыть</Button>
                </div>
              </div>
            ))}
            {MISSIONS.length===0 && <div className="t-caption">Активных задач пока нет.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

/** ── Landing ──────────────────────────────────────── */
const LandingScreen: React.FC<{onEnterHub:()=>void; onOpenWhite:()=>void}> = ({onEnterHub, onOpenWhite}) => (
  <div className="page fade-in" style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{maxWidth:520, width:"100%", textAlign:"center"}}>
      <div style={{height:12}} />
      <div style={{fontSize:22, fontWeight:700}}>Добро пожаловать в экосистему FMT.JETLAG</div>
      <div style={{height:28}} />
      <div style={{display:"grid", gap:10}}>
        <button className="btn" onClick={onEnterHub} style={{height:48, fontSize:15, fontWeight:600}}>JETLAG HUB</button>
        <button className="btn btn-sec" onClick={onOpenWhite} style={{height:48, fontSize:15, fontWeight:600}}>JETLAG WHITE (Telegram)</button>
      </div>
      <div style={{marginTop:18, fontSize:12, opacity:.6}}>Нажмите «JETLAG HUB», чтобы войти в мини-приложение</div>
    </div>
  </div>
);type PlanCard = {
  key: PlanKey | "FREE";
  title: string;
  price: string; // текстом
  subtitle: string;
  features: string[];
  best?: boolean;
};

/** ── Plans ──────────────────────────────────────── */
const PLAN_CARDS: PlanCard[] = [
  {
    key: "FREE",
    title: "Free",
    price: "$0 / месяц",
    subtitle: "Базовый доступ",
    features: [
      "Доступ к Jetlag Hub и Daily",
      "Участие в миссиях уровня WHITE",
      "Профиль и JetPoints",
    ],
  },
  {
    key: "PLUS",
    title: "Plus",
    price: "$20 / месяц",
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
    price: "$200 / месяц",
    subtitle: "Для активных креаторов и продакшнов",
    features: [
      "Все из Plus",
      "PRO-миссии с кэш-гонорарами",
      "Больше слотов на отклики",
      "Приоритетная модерация и саппорт",
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

const PlansScreen: React.FC<{
  current: PlanKey;
  onChoose: (p: PlanKey) => void;
}> = ({ current, onChoose }) => {
  const handleChoose = (p: PlanKey) => {
    // здесь потом можно заменить на платеж/бот
    if (p === null) return;
    const ok = confirm(`Подтвердить подключение плана ${p}?`);
    if (ok) onChoose(p);
  };

  return (
    <div className="page pad fade-in">
      <div className="row-b">
        <div className="h2">Подписки</div>
        <div className="t-caption">Текущий план: <b>{current ?? "Free"}</b></div>
      </div>
      <div className="sp-3" />

      {/* карточки как в примере — одна колонка, с «лучшее предложение» */}
      <div className="list">
        {PLAN_CARDS.map(card => (
          <div key={card.key} className="card" style={{border: card.best ? "1px solid rgba(255,255,255,.35)" : "1px solid var(--line)", boxShadow: card.best ? "0 0 0 1px rgba(255,255,255,.12) inset" : undefined}}>
            <div className="card-sec">
              <div className="row-b">
                <div className="h2">{card.title}</div>
                {card.best && <span className="chip">Топ выбор</span>}
              </div>
              <div className="sp-1" />
              <div className="row" style={{alignItems:"baseline", gap:8}}>
                <div className="h2" style={{fontSize:22}}>{card.price}</div>
                <div className="t-caption">{card.subtitle}</div>
              </div>
              <div className="sp-2" />
              <ul className="t-body" style={{display:"grid", gap:6, paddingLeft:18}}>
                {card.features.map((f,i)=> <li key={i}>{f}</li>)}
              </ul>
              <div className="sp-3" />
              {card.key === "FREE" ? (
                <Button kind="ghost" size="m" className={current===null?"btn-disabled":""} onClick={()=>onChoose(null)}>
                  Оставить Free
                </Button>
              ) : (
                <Button
                  size="m"
                  className={current===card.key?"btn-disabled":""}
                  onClick={()=>handleChoose(card.key as PlanKey)}
                >
                  {current===card.key ? "Текущий план" : "Подключить"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* сравнение в виде мини-таблицы */}
      <div className="sp-4" />
      <div className="card">
        <div className="card-sec">
          <div className="h2">Сравнение возможностей</div>
          <div className="sp-2" />
          <div className="t-caption" style={{opacity:.9}}>
            • Миссии: Free — WHITE, Plus — WHITE/RED*, Pro — все + PRO-миссии, Studio — командный доступ. <br/>
            • Ивенты: Free — общие, Plus/Pro — ранний доступ, Studio — корпоративные квоты.
          </div>
        </div>
      </div>
    </div>
  );
};


/** ── Onboarding Survey (показывается 1 раз) ─────────
 * Если хочешь — замени разметку внутри на твой большой опросник.
 * Ключ: после успешной отправки вызывай onDone() и ставь localStorage.setItem("jl_survey_done","1")
 */
const OnboardingSurvey: React.FC<{onDone:()=>void}> = ({onDone}) => {
  const [lang, setLang] = useState<"ru"|"en">("ru");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const valid = name.trim().length>1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = () => {
    if (!valid) return alert(lang==="ru"?"Заполните имя и email":"Fill name and email");
    try {
      // тут можешь добавить tg.sendData(...) и/или fetch() на свой endpoint
      localStorage.setItem("jl_survey_done","1");
      onDone();
    } catch(e) {
      alert(lang==="ru"?"Не удалось отправить. Попробуйте ещё раз.":"Failed to submit. Try again.");
    }
  };

  return (
    <div className="page fade-in" style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%", maxWidth:520}}>
        <div style={{fontSize:22, fontWeight:700, color:"#fff"}}>{lang==="ru"?"Стань частью FMT.JETLAG":"Join FMT.JETLAG"}</div>
        <div style={{height:12}}/>
        <div style={{fontSize:13, color:"rgba(255,255,255,.65)"}}>
          {lang==="ru"?"Короткая анкета • 1 минута":"Short form • 1 minute"}
        </div>

        <div style={{height:24}}/>
        <label style={{display:"block", fontSize:12, marginBottom:6, color:"#fff"}}>{lang==="ru"?"Имя":"Name"}</label>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder={lang==="ru"?"Введите имя":"Enter your name"}
          style={{width:"100%", height:44, borderRadius:12, padding:"0 14px", background:"#0f0f0f", border:"1px solid #2a2a2a", color:"#fff"}}
        />

        <div style={{height:14}}/>
        <label style={{display:"block", fontSize:12, marginBottom:6, color:"#fff"}}>Email</label>
        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{width:"100%", height:44, borderRadius:12, padding:"0 14px", background:"#0f0f0f", border:"1px solid #2a2a2a", color:"#fff"}}
        />

        <div style={{height:14}}/>
        <label style={{display:"block", fontSize:12, marginBottom:6, color:"#fff"}}>{lang==="ru"?"Язык":"Language"}</label>
        <select value={lang} onChange={e=>setLang(e.target.value as "ru"|"en")} style={{width:"100%", height:44, borderRadius:12, padding:"0 10px", background:"#0f0f0f", border:"1px solid #2a2a2a", color:"#fff"}}>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>

        <div style={{height:20}}/>
        <button className="btn" onClick={submit} style={{width:"100%", height:48, fontWeight:700, opacity: valid?1:.6}}>
          {lang==="ru"?"Отправить и продолжить":"Submit and continue"}
        </button>

        {/* === ЗАМЕНИ ЭТОТ ЭКРАН НА ТВОЙ ПОЛНЫЙ ОПРОСНИК, ЕСЛИ НУЖНО === */}
      </div>
    </div>
  );
};

/** ── Root ─────────────────────────────────────────── */
export default function App(){
  // boot: checking -> survey (нет флага) -> landing (есть флаг) -> app (после клика)
  const [boot, setBoot] = useState<"checking"|"survey"|"landing"|"app">("checking");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem("jl_survey_done") === "1";
    setBoot(done ? "landing" : "survey");
  }, []);

  const [tab, setTab] = useState<Tab>("landing"); // используется только когда boot === "app"
  const [status] = useState<StatusLevel>("WHITE");
  const [plan]   = useState<PlanKey>(null);
  const jetpoints = 2540;

  const openWhite = () => {
    try { window.open(WHITE_CHAT_URL, "_blank", "noopener,noreferrer"); }
    catch { /* no-op */ }
  };

  // 1) Первый запуск — анкета
  if (boot === "survey") {
    return <OnboardingSurvey onDone={()=>setBoot("landing")} />;
  }

  // 2) Старт после анкеты — Landing
  if (boot === "landing") {
    return (
      <LandingScreen
        onEnterHub={()=>{ setBoot("app"); setTab("profile"); }}
        onOpenWhite={openWhite}
      />
    );
  }

  // 3) Полноценное приложение
  return (
    <>
      {tab !== "landing" && (
        <TopBar
          status={status}
          plan={plan}
          onProfile={()=>setTab("profile")}
          onSettings={()=>alert("Настройки (демо)")}
          onOpenPlans={()=>setTab("plans")}
        />
      )}

      {tab==="landing" && (
        <LandingScreen
          onEnterHub={()=>setTab("profile")}
          onOpenWhite={openWhite}
        />
      )}
      {tab === 'home' && <HomeScreen go={setTab} status={status} plan={plan} />}
      {tab==="missions" && <MissionsScreen status={status} plan={plan}/>}
      {tab==="events" && <EventsScreen status={status} plan={plan}/>}
      {tab==="market" && <MarketScreen/>}
      {tab==="jetlag" && <JetlagHub go={setTab}/>}
      {tab==="profile" && (
        <ProfileScreen
          status={status}
          plan={plan}
          jetpoints={jetpoints}
          next={500}
          onSettings={()=>alert("Настройки (демо)")}
        />
      )}

      {tab !== "landing" && <BottomNav tab={tab} onChange={setTab}/>}
    </>
  );
}
