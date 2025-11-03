"use client";
import React, { useMemo, useState } from "react";

/** ============ Inline monochrome icons ============ */
const Icon = {
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  List: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="18" r="1.5" />
    </svg>
  ),
  Ticket: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16v3a2 2 0 0 1 0 4v3H4v-3a2 2 0 0 1 0-4V8z" />
      <path d="M12 8v8" />
    </svg>
  ),
  Bag: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l1 3v9H5V10l1-3z" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
    </svg>
  ),
  Brand: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="7" y="4" width="4" height="4" rx="1" /><rect x="13" y="4" width="4" height="4" rx="1" />
      <rect x="7" y="10" width="4" height="4" rx="1" /><rect x="13" y="10" width="4" height="4" rx="1" />
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7.5" r="3.5" /><path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.82-.33A1.6 1.6 0 0 0 14 21a2 2 0 0 1-4 0 1.6 1.6 0 0 0-1-1.51 1.6 1.6 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.29 17.9l.06-.06A1.6 1.6 0 0 0 4 16.02 1.6 1.6 0 0 0 2.49 15H3a2 2 0 0 1 0-4h.09c.67 0 1.27-.39 1.51-1a1.6 1.6 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.29l.06.06c.5.5 1.2.66 1.82.33A1.6 1.6 0 0 0 10 3a2 2 0 0 1 4 0 1.6 1.6 0 0 0 1.08 1.6c.62.33 1.32.17 1.82-.33l.06-.06A2 2 0 1 1 21 7.04l-.06.06c-.5.5-.66 1.2-.33 1.82.24.61.84 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.6 1.6 0 0 0-1.51 1z" />
    </svg>
  ),
  Temple: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l9-5 9 5" /><path d="M4 10v8M8 10v8M12 10v8M16 10v8M20 10v8M2 18h20" />
    </svg>
  ),
};

/** ===== types & data (…те же, что в предыдущем сообщении) ===== */
type StatusLevel = "WHITE" | "RED" | "BLACK";
const rank = (s: StatusLevel) => (s === "WHITE" ? 1 : s === "RED" ? 2 : 3);
type PlanKey = "PLUS" | "PRO" | "STUDIO" | null;

type Mission = { id: string; brand: string; title: string; deadline: string; tags: string[]; rewards: { jetpoints: number; cash?: string }; minStatus: StatusLevel; requiredPlan: Exclude<PlanKey, null> | null; };
type EventItem = { id: string; title: string; date: string; place: string; access: { minStatus: StatusLevel; plan: PlanKey }; price: number; };
type MarketItem = { id: string; type: "SERVICE" | "PRODUCT"; title: string; price: number; owner: string };

const MISSIONS: Mission[] = [
  { id: "m1", brand: "FMT.JETLAG", title: "Рефреш айдентики для FMT.JETLAG Padel", deadline: "14.11.2025", tags: ["design","branding"], rewards: { jetpoints: 250, cash: "50 000 ₽" }, minStatus:"WHITE", requiredPlan: null },
  { id: "m2", brand: "Bluora", title: "UGC-кампания: Travel-skin ритуалы", deadline: "21.11.2025", tags: ["video","ugc"], rewards: { jetpoints: 150, cash: "по результату" }, minStatus:"WHITE", requiredPlan:"PLUS" },
  { id: "m3", brand: "Viperr Waterr", title: "Съёмка рекламного спота (Twitch)", deadline: "05.12.2025", tags: ["video","production"], rewards: { jetpoints: 500, cash: "120 000 ₽" }, minStatus:"RED", requiredPlan:"PRO" },
  { id: "m4", brand: "FMT.JETLAG Film", title: "Motion-пак для стрима-фильма", deadline: "30.11.2025", tags: ["motion","gfx"], rewards: { jetpoints: 400, cash: "дог." }, minStatus:"RED", requiredPlan: null },
];

const EVENTS: EventItem[] = [
  { id: "e1", title: "Creator Meetup: Music x AI", date: "16.11.2025", place: "Москва, Jet-Space", access: { minStatus: "WHITE", plan: null }, price: 0 },
  { id: "e2", title: "FMT.JETLAG Padel Night Tournament", date: "22.11.2025", place: "FMT.JETLAG Padel", access: { minStatus: "RED", plan: "PLUS" }, price: 1500 },
  { id: "e3", title: "Studio Session (Video Backstage)", date: "29.11.2025", place: "Jet Studio", access: { minStatus: "RED", plan: "STUDIO" }, price: 0 },
];

const MARKET: MarketItem[] = [
  { id: "i1", type: "SERVICE", title: "Сведение и мастеринг трека", price: 8000, owner: "@audio.kir" },
  { id: "i2", type: "SERVICE", title: "Motion-дизайн (30-сек ролик)", price: 15000, owner: "@gfx.storm" },
  { id: "i3", type: "PRODUCT", title: "Bluora Travel Kit v2", price: 2490, owner: "@bluora" },
];

const PEOPLE = [
  { id:"u1", name:"Arseniy", role:"Designer" },
  { id:"u2", name:"Badri", role:"Producer" },
  { id:"u3", name:"Daniil", role:"Founder" },
  { id:"u4", name:"Yana", role:"Artist" },
  { id:"u5", name:"Kir", role:"Sound" },
];

/** ===== primitives ===== */
const Chip: React.FC<{children:React.ReactNode}> = ({children}) => <span className="chip">{children}</span>;
const H2: React.FC<{children:React.ReactNode}> = ({children}) => <div className="h2">{children}</div>;
const Button: React.FC<{children:React.ReactNode; kind?: "primary"|"secondary"|"ghost"; size?: "s"|"m"; onClick?:()=>void}> = ({children, kind="primary", size="m", onClick}) => {
  const cls = ["btn", size==="s" ? "btn-s" : "", kind==="secondary" ? "btn-sec" : kind==="ghost" ? "btn-ghost" : ""].join(" ");
  return <button className={cls} onClick={onClick}>{children}</button>;
};

const TopBar: React.FC<{ title: string; onProfile: ()=>void; onSettings: ()=>void; status: StatusLevel; plan: PlanKey; }> = ({title,onProfile,onSettings,status,plan}) => (
  <div className="pad-x" style={{position:"sticky", top:0, zIndex:30, backdropFilter:"saturate(180%) blur(14px)", background:"rgba(0,0,0,.55)", borderBottom:"1px solid var(--line)"}}>
    <div className="sp-3" />
    <div className="row-b">
      <button className="user-chip" onClick={onProfile} aria-label="Профиль">
        <span className="ava" style={{width:24,height:24, borderRadius:8}}><Icon.User /></span>
        Даниил
      </button>
      <div style={{fontSize:17, fontWeight:600}}>{title}</div>
      <button className="user-chip" onClick={onSettings} aria-label="Настройки" style={{gap:6}}>
        <Icon.Settings />
      </button>
    </div>
    <div className="sp-3" />
    <div className="row-b">
      <div className="chips">
        <div className="chip">{status}</div>
        <div className="chip">{plan ?? "нет плана"}</div>
      </div>
      <div />
    </div>
    <div className="sp-2" />
  </div>
);

const BottomNav: React.FC<{tab:string; onChange:(t:string)=>void}> = ({tab,onChange}) => {
  const Item: React.FC<{k:string; label:string; icon:React.FC}> = ({k,label,icon:IconX}) => {
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

/** ===== Screens (как прежде) ===== */
const Hero: React.FC = () => (
  <div className="card">
    <div className="card-sec">
      <div className="t-caption">О нас</div>
      <div className="sp-2" />
      <div className="h2" style={{fontSize:18}}>Empowering talents to<br/>bring value through content</div>
    </div>
  </div>
);

const HomeScreen: React.FC<{go:(t:string)=>void}> = ({go}) => (
  <div className="page pad">
    <Hero />
    <div className="sp-4" />
    <div className="grid-2">
      {[
        {k:"missions",t:"Миссии",d:"Выбирай задачи"},
        {k:"events",t:"Афиша",d:"Митапы и турниры"},
        {k:"market",t:"Маркет",d:"Услуги и товары"},
        {k:"jetlag",t:"FMT.JETLAG",d:"О нас, видео и продукты"},
      ].map(b=>(
        <div className="card" key={b.k}>
          <div className="card-sec">
            <div className="row-b">
              <div className="h2">{b.t}</div>
              <Button kind="ghost" size="s" onClick={()=>go(b.k)} >Открыть</Button>
            </div>
            <div className="t-caption" style={{marginTop:6}}>{b.d}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MissionsScreen: React.FC<{status:StatusLevel; plan:PlanKey;}> = ({status, plan}) => {
  const filtered = useMemo(()=>MISSIONS.filter(m=> rank(status) >= rank(m.minStatus) && (!m.requiredPlan || plan===m.requiredPlan)),[status,plan]);
  return (
    <div className="page pad">
      <div className="h2">Миссии</div>
      <div className="sp-3" />
      <div className="list">
        {filtered.map(m=>(
          <div className="card" key={m.id}>
            <div className="card-sec">
              <div className="row-b">
                <div className="h2" style={{fontSize:15}}>{m.title}</div>
                <div className="chip">{m.brand}</div>
              </div>
              <div className="sp-2" />
              <div className="t-body">Дедлайн: {m.deadline}</div>
              <div className="t-body">Теги: {m.tags.join(", ")}</div>
              <div className="t-body">Награды: {m.rewards.jetpoints} JP{m.rewards.cash?` + ${m.rewards.cash}`:""}</div>
              <div className="t-caption" style={{marginTop:6}}>Доступ: статус {m.minStatus}{m.requiredPlan?` + план ${m.requiredPlan}`:""}</div>
            </div>
            <div className="separator" />
            <div className="card-sec" style={{display:"flex", justifyContent:"flex-end"}}>
              <Button className="btn-s" size="s">Участвовать</Button>
            </div>
          </div>
        ))}
        {filtered.length===0 && (
          <div className="card">
            <div className="card-sec">
              <div className="h2">Пока нет доступных миссий</div>
              <div className="t-body" style={{marginTop:6}}>Подключи план или повышай статус, чтобы открыть больше возможностей.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EventsScreen: React.FC<{status:StatusLevel; plan:PlanKey;}> = ({status, plan}) => {
  const items = EVENTS.filter(e=> rank(status)>=rank(e.access.minStatus) && (!e.access.plan || plan===e.access.plan));
  return (
    <div className="page pad">
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
  <div className="page pad">
    <div className="row-b">
      <div className="h2">Маркет</div>
      <Button kind="secondary" size="s">Опубликовать</Button>
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

const JetlagHub: React.FC<{go:(t:string)=>void}> = ({go}) => (
  <div className="page pad">
    <div className="card">
      <div className="card-sec">
        <div className="t-caption">О нас</div>
        <div className="sp-2" />
        <div className="h2" style={{fontSize:18}}>Empowering talents to<br/>bring value through content</div>
      </div>
    </div>

    <div className="sp-4" />

    <div className="card">
      <div className="card-sec">
        <div className="row-b">
          <div className="row">
            <span className="ava" style={{width:28,height:28, borderRadius:8}}><Icon.Temple /></span>
            <div className="h2">Усадьба JETLAG</div>
          </div>
          <Button kind="secondary" size="s">Открыть 3D-тур</Button>
        </div>
        <div className="t-body" style={{marginTop:6}}>Кампус для резиденций, съёмок и встреч сообщества.</div>
      </div>
    </div>

    <div className="sp-4" />

    <div className="h2" style={{marginBottom:8}}>JETLAG продукты</div>
    <div className="grid-2">
      {[
        {t:"Спорт", d:"Падел клуб и экипировка"},
        {t:"Waterr", d:"Газированная вода • 0.5 L"},
        {t:"Bluora", d:"Косметика и travel наборы"},
        {t:"Одежда", d:"Худи, футболки, аксессуары"},
      ].map((p, i)=>(
        <div className="card" key={i}>
          <div className="card-sec">
            <div className="h2">{p.t}</div>
            <div className="t-body" style={{marginTop:4}}>{p.d}</div>
            <div className="sp-3" />
            <Button kind="secondary" size="s">Подробнее</Button>
          </div>
        </div>
      ))}
    </div>

    <div className="sp-4" />

    <div className="h2">Видео и атмосфера</div>
    <div className="sp-2" />
    <div className="video">
      <iframe
        src="https://www.youtube-nocookie.com/embed/-yPMtwa8f14?autoplay=1&mute=1&playsinline=1&controls=1&rel=0&modestbranding=1"
        allow="autoplay; encrypted-media; picture-in-picture"
        title="FMT.JETLAG"
      />
    </div>

    <div className="sp-4" />

    <div className="h2">Амбассадоры</div>
    <div className="sp-2" />
    <div className="scroller">
      <div className="rowx">
        {PEOPLE.map(p=>{
          const init = p.name.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase();
          return (
            <div className="amb" key={p.id}>
              <div className="row" style={{gap:10}}>
                <div className="ava">{init}</div>
                <div>
                  <div className="h2" style={{fontSize:13}}>{p.name}</div>
                  <div className="t-caption" style={{marginTop:2}}>{p.role}</div>
                </div>
              </div>
              <div className="t-caption" style={{marginTop:10}}>создаём культуру вместе</div>
            </div>
          )
        })}
      </div>
    </div>

    <div className="sp-4" />

    <div className="card">
      <div className="card-sec">
        <div className="h2" style={{marginBottom:8}}>Новости и релизы</div>
        <div className="list">
          <div className="card" style={{background:"rgba(255,255,255,.05)"}}><div className="card-sec">Viperr Waterr — новая банка • 12/2025</div></div>
          <div className="card" style={{background:"rgba(255,255,255,.05)"}}><div className="card-sec">Bluora Travel Kit v2 — обновили формулы и упаковку</div></div>
          <div className="card" style={{background:"rgba(255,255,255,.05)"}}><div className="card-sec">Night Tournament — регистрация открыта</div></div>
        </div>
      </div>
    </div>
  </div>
);

/** ===== Root ===== */
export default function App() {
  const [tab, setTab] = useState<"home"|"missions"|"events"|"market"|"jetlag">("jetlag");
  const [status] = useState<StatusLevel>("WHITE");
  const [plan] = useState<PlanKey>(null);

  const title = tab==="home" ? "Главная" :
                tab==="missions" ? "Миссии" :
                tab==="events" ? "Афиша" :
                tab==="market" ? "Маркет" : "FMT.JETLAG";

  return (
    <>
      <TopBar
        title={title}
        status={status}
        plan={plan}
        onProfile={()=>setTab("home")}
        onSettings={()=>alert("Настройки (демо)")}
      />

      {tab==="home" && <HomeScreen go={setTab} />}
      {tab==="missions" && <MissionsScreen status={status} plan={plan} />}
      {tab==="events" && <EventsScreen status={status} plan={plan} />}
      {tab==="market" && <MarketScreen/>}
      {tab==="jetlag" && <JetlagHub go={setTab} />}

      <BottomNav tab={tab} onChange={setTab}/>
    </>
  );
}
