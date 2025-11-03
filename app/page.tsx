"use client";
import React, { useMemo, useState } from "react";
import "./globals.css";

/* ===== Compact SVG set — фиксированный размер по классу .icon ===== */
const Svg: React.FC<{children:React.ReactNode}> = ({children}) => (
  <svg className="icon" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const I = {
  Home:     () => (<Svg><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></Svg>),
  List:     () => (<Svg><path d="M4 7h16M4 12h16M4 17h16"/></Svg>),
  Ticket:   () => (<Svg><path d="M3 9a2 2 0 0 0 0 6h18a2 2 0 0 0 0-6"/></Svg>),
  Store:    () => (<Svg><path d="M4 10h16l-1-4H5l-1 4z"/><path d="M6 10v9h12v-9"/></Svg>),
  Brand:    () => (<Svg><rect x="10.5" y="6.5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="10.5" y="14.5" width="3" height="3" fill="currentColor" stroke="none"/></Svg>),
  User:     () => (<Svg><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></Svg>),
  Temple:   () => (<Svg><path d="M12 6l8 4H4l8-4z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/></Svg>),
  Settings: () => (<Svg><circle cx="12" cy="12" r="3"/><path d="M19.4 15a2 2 0 1 1 2.83 2.83"/></Svg>),
  QR:       () => (<Svg><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM16 13h2v2h-2zM20 17h-4v4h6v-6h-2z"/></Svg>),
};

/* ===== Small helpers ===== */
const Card: React.FC<{children:React.ReactNode; className?:string}> = ({children, className}) => (
  <div className={`card ${className||""}`}>{children}</div>
);
const Section: React.FC<{children:React.ReactNode; className?:string; style?:React.CSSProperties}>
  = ({children, className, style}) => (<div className={`section ${className||""}`} style={style}>{children}</div>);

type TabKey = "home"|"missions"|"events"|"market"|"jetlag";

export default function App(){
  const [tab, setTab] = useState<TabKey>("jetlag");

  const title = useMemo(()=>{
    switch(tab){
      case "home": return "Главная";
      case "missions": return "Миссии";
      case "events": return "Афиша";
      case "market": return "Маркет";
      default: return "FMT.JETLAG";
    }
  },[tab]);

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="section" style={{paddingTop:12}}>
          <div className="h2" style={{textAlign:"center"}}>{title}</div>
          <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", marginTop:8}}>
            <div className="caption" style={{display:"flex", alignItems:"center", gap:8}}>
              {/* Убрали «гигантскую» иконку слева */}
              <span>FMT.JETLAG</span>
            </div>
            <div />
            <div style={{justifySelf:"end", display:"flex", gap:8}}>
              <button className="btn btn-sm btn-secondary" aria-label="Усадьба"><I.Temple/></button>
              <button className="btn btn-sm btn-secondary" aria-label="Настройки"><I.Settings/></button>
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", marginTop:10}} className="caption">
            <button className="btn btn-sm btn-secondary" style={{gap:6}}><I.User/> Даниил</button>
            <div style={{display:"flex", gap:8}}>
              <span className="btn btn-sm btn-secondary" style={{pointerEvents:"none"}}>WHITE</span>
              <span className="btn btn-sm btn-secondary" style={{pointerEvents:"none"}}>нет плана</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="screen">
        {tab==="home"     && <Home/>}
        {tab==="missions" && <Missions/>}
        {tab==="events"   && <Events/>}
        {tab==="market"   && <Market/>}
        {tab==="jetlag"   && <JetlagHub/>}
      </div>

      {/* Bottom nav */}
      <nav className="tabbar">
        <div className="tabgrid">
          {([
            {k:"home",    l:"Главная",  Icon:I.Home},
            {k:"missions",l:"Миссии",   Icon:I.List},
            {k:"events",  l:"Афиша",    Icon:I.Ticket},
            {k:"market",  l:"Маркет",   Icon:I.Store},
            {k:"jetlag",  l:"FMT.JETLAG", Icon:I.Brand},
          ] as {k:TabKey; l:string; Icon:React.FC}[]).map(({k,l,Icon})=>{
            const active = tab===k;
            return (
              <button key={k} onClick={()=>setTab(k)} className={`tabbtn ${active?"tabbtn-active":""}`} aria-label={l}>
                <span className={`tabicon ${active?"tabicon-active":""}`}><Icon/></span>
                <span className="tablabel">{l}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/* ===== Screens ===== */

function Home(){
  return (
    <div className="grid" style={{gap:12}}>
      <Card>
        <Section>
          <div className="caption" style={{textTransform:"uppercase"}}>Pulse</div>
          <div className="h2" style={{marginTop:4}}>Идеи становятся делом</div>
          <div className="body" style={{marginTop:6}}>Забирай миссии, собирай JetPoints, расти в статусе.</div>
        </Section>
      </Card>
      <div className="grid" style={{gap:8, gridTemplateColumns:"repeat(3,1fr)"}}>
        {[
          {title:"Миссии", sub:"Выбирай задачи", Icon:I.List},
          {title:"Афиша",  sub:"Митапы/турниры", Icon:I.Ticket},
          {title:"Маркет", sub:"Услуги/товары",  Icon:I.Store},
        ].map((x,i)=>(
          <button key={i} className="card">
            <Section>
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <span className="tabicon" style={{padding:10, background:"rgba(255,255,255,.08)", borderRadius:12}}><x.Icon/></span>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:600}}>{x.title}</div>
                  <div className="caption">{x.sub}</div>
                </div>
              </div>
            </Section>
          </button>
        ))}
      </div>
    </div>
  );
}

function Missions(){
  const items = [
    {id:"m1", brand:"FMT.JETLAG", title:"Рефреш айдентики для FMT.JETLAG Padel", deadline:"14.11.2025", tags:"design, branding", reward:"250 JP + 50 000 ₽"},
    {id:"m2", brand:"Bluora", title:"UGC-кампания: Travel-skin ритуалы", deadline:"21.11.2025", tags:"video, ugc", reward:"150 JP + по результату"},
  ];
  return (
    <div className="grid" style={{gap:12}}>
      <div className="h2">Миссии</div>
      {items.map(m=>(
        <Card key={m.id}>
          <Section>
            <div style={{display:"flex", justifyContent:"space-between", gap:8}}>
              <div style={{fontSize:15, fontWeight:600}}>{m.title}</div>
              <span className="btn btn-sm btn-secondary">{m.brand}</span>
            </div>
            <div className="body" style={{marginTop:8}}>Дедлайн: {m.deadline}</div>
            <div className="caption">Теги: {m.tags}</div>
            <div className="caption">Награды: {m.reward}</div>
          </Section>
          <div className="sep" />
          <Section style={{display:"flex", justifyContent:"flex-end"}}>
            <button className="btn btn-sm btn-secondary">Участвовать</button>
          </Section>
        </Card>
      ))}
    </div>
  );
}

function Events(){
  const items = [
    {id:"e1", title:"Creator Meetup: Music x AI", date:"16.11.2025", place:"Jet-Space", price:"бесплатно"},
    {id:"e2", title:"Padel Night Tournament", date:"22.11.2025", place:"FMT.JETLAG Padel", price:"1500 ₽"},
  ];
  return (
    <div className="grid" style={{gap:12}}>
      <div className="h2">Афиша</div>
      {items.map(e=>(
        <Card key={e.id}>
          <Section>
            <div style={{fontSize:16, fontWeight:600}}>{e.title}</div>
            <div className="body" style={{marginTop:4}}>{e.date} — {e.place}</div>
            <div className="caption">Цена: {e.price}</div>
          </Section>
          <div className="sep" />
          <Section style={{display:"flex", justifyContent:"space-between", gap:8}}>
            <button className="btn btn-sm btn-secondary"><I.QR/> Получить QR</button>
            <div style={{display:"flex", gap:8}}>
              <button className="btn btn-sm btn-ghost">Подробнее</button>
              <button className="btn btn-sm btn-primary">RSVP</button>
            </div>
          </Section>
        </Card>
      ))}
    </div>
  );
}

function Market(){
  const items = [
    {id:"s1", type:"SERVICE", title:"Сведение и мастеринг трека", price:"8000 ₽", owner:"@audio.kir"},
    {id:"s2", type:"SERVICE", title:"Motion-дизайн (30 сек)", price:"15000 ₽", owner:"@gfx.storm"},
    {id:"p1", type:"PRODUCT", title:"Bluora Travel Kit v2", price:"2490 ₽", owner:"@bluora"},
  ];
  return (
    <div className="grid" style={{gap:12}}>
      <div className="h2">Маркет</div>
      {items.map(it=>(
        <Card key={it.id}>
          <Section>
            <div style={{fontSize:16, fontWeight:600}}>{it.title}</div>
            <div className="caption" style={{marginTop:2}}>{it.type}</div>
            <div className="caption">Цена: {it.price}</div>
            <div className="caption">Владелец: {it.owner}</div>
          </Section>
          <div className="sep" />
          <Section style={{display:"flex", justifyContent:"space-between"}}>
            <button className="btn btn-sm btn-secondary">Подробнее</button>
            <button className="btn btn-sm btn-secondary">Связаться</button>
          </Section>
        </Card>
      ))}
    </div>
  );
}

function JetlagHub(){
  return (
    <div className="grid" style={{gap:12}}>
      {/* О нас */}
      <Card>
        <Section>
          <div className="caption">О нас</div>
          <div className="h2" style={{marginTop:6}}>Empowering talents to</div>
          <div className="h2" style={{marginTop:-2}}>bring value through content</div>
        </Section>
      </Card>

      {/* Усадьба */}
      <Card>
        <Section>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div className="h2" style={{display:"flex", alignItems:"center", gap:8}}>
              <I.Temple/> Усадьба JETLAG
            </div>
            <button className="btn btn-sm btn-secondary">Открыть 3D-тур</button>
          </div>
          <div className="body" style={{marginTop:6}}>
            Кампус для резиденций, съёмок и встреч сообщества.
          </div>
        </Section>
      </Card>

      {/* Продукты */}
      <Card>
        <Section>
          <div className="h2">JETLAG продукты</div>
          <div className="grid" style={{gap:8, gridTemplateColumns:"repeat(2,1fr)", marginTop:8}}>
            {[
              {t:"Спорт",  d:"Падел клуб и экипировка"},
              {t:"Waterr", d:"Газированная вода • 0.5 L"},
              {t:"Bluora", d:"Косметика и travel наборы"},
              {t:"Одежда", d:"Худи, футболки, аксессуары"},
            ].map((x,i)=>(
              <div key={i} className="card">
                <Section>
                  <div style={{fontSize:14, fontWeight:600}}>{x.t}</div>
                  <div className="caption">{x.d}</div>
                  <div style={{marginTop:10}}>
                    <button className="btn btn-sm btn-secondary">Подробнее</button>
                  </div>
                </Section>
              </div>
            ))}
          </div>
        </Section>
      </Card>
    </div>
  );
}
