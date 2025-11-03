// app/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';

/* ---------- дизайн токены ---------- */
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
const SURFACE = 'bg-[#0b0b0d]';
const CARD_BG = 'bg-[#111113]';
const BORDER = 'border border-[#242428]';
const RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30';
const TS_TITLE = 'text-[16px] font-semibold';
const TS_BODY = 'text-[13px]';
const TS_CAPTION = 'text-[11px]';
const MUTED = 'text-white/80';
const MUTED2 = 'text-white/60';

/* ---------- простые SVG-иконки ---------- */
const Svg = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}
       strokeLinecap="round" strokeLinejoin="round"
       className={className ?? 'h-5 w-5'} aria-hidden>
    {children}
  </svg>
);
const I = {
  Grid: () => <Svg><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></Svg>,
  User: () => <Svg><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"/><path d="M4 20a8 8 0 0 1 16 0"/></Svg>,
  Bell: () => <Svg><path d="M6 16h12"/><path d="M8 16V9a4 4 0 1 1 8 0v7"/><path d="M10 16v1a2 2 0 0 0 4 0v-1"/></Svg>,
  List: () => <Svg><path d="M8 7h12M4 7h1M8 12h12M4 12h1M8 17h12M4 17h1"/></Svg>,
  Ticket: () => <Svg><path d="M4 8h16v3a2 2 0 0 1 0 4v3H4v-3a2 2 0 0 1 0-4V8z"/></Svg>,
  Store: () => <Svg><path d="M4 10h16l-1-4H5l-1 4z"/><path d="M6 10v9h12v-9"/><path d="M9 14h6"/></Svg>,
  Medal: () => <Svg><circle cx="12" cy="8" r="3"/><path d="M10 11l-2 8 4-3 4 3-2-8"/></Svg>,
  Plus: () => <Svg><path d="M12 5v14M5 12h14"/></Svg>,
  Rocket: () => <Svg><path d="M14 3c-3 1-5 3-6 6l7 1 1-7z"/><path d="M15 10l-4 4"/><circle cx="9" cy="15" r="2"/></Svg>,
  QR: () => <Svg><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM16 14h2v2h-2zM20 18h-4v2h6v-6h-2z"/></Svg>,
  Check: () => <Svg><path d="M4 12l5 5 11-11"/></Svg>,
  Brand: () => (
    <Svg>
      {/* два вертикальных квадрата — твой логотип-разделитель времени */}
      <rect x="10.5" y="7" width="3" height="3" fill="currentColor" stroke="none"/>
      <rect x="10.5" y="14" width="3" height="3" fill="currentColor" stroke="none"/>
    </Svg>
  ),
  Temple: () => <Svg><path d="M12 6l7 3v3H5V9l7-3z"/><path d="M6 12v6M10 12v6M14 12v6M18 12v6"/></Svg>,
  Settings: () => <Svg><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.82-.33 1.6 1.6 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.6 1.6 0 0 0-1-1.51 1.6 1.6 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .33-1.82 1.6 1.6 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.6 1.6 0 0 0 1.51-1 1.6 1.6 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.82.33h.06a1.6 1.6 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.6 1.6 0 0 0 1 1.51h.06a1.6 1.6 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.33 1.82v.06a1.6 1.6 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.6 1.6 0 0 0-1.51 1z"/></Svg>,
  ChevronRight: () => <Svg><path d="M9 18l6-6-6-6"/></Svg>,
};

/* ---------- утилиты ---------- */
type StatusLevel = 'WHITE' | 'RED' | 'BLACK';
const rankValue = (x: StatusLevel) => (x === 'WHITE' ? 1 : x === 'RED' ? 2 : 3);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) =>
  <div className={cx(CARD_BG, BORDER, 'rounded-2xl', className)}>{children}</div>;
const Section = ({ children, className }: { children: React.ReactNode; className?: string }) =>
  <div className={cx('p-4', className)}>{children}</div>;
const H2 = ({ children }: { children: React.ReactNode }) =>
  <h2 className={cx(TS_TITLE, 'tracking-tight')}>{children}</h2>;
const Separator = ({ className }: { className?: string }) =>
  <div className={cx('h-px w-full bg-white/10', className)} />;

/* ---------- мок-данные ---------- */
const PLANS = [
  { key: 'PLUS', title: 'FMT.JETLAG+', price: 499 },
  { key: 'PRO', title: 'FMT.JETLAG Pro', price: 1990 },
  { key: 'STUDIO', title: 'Studio Pass', price: 4900 },
] as const;
type PlanKey = typeof PLANS[number]['key'];

type Mission = {
  id: string; brand: string; title: string; deadline: string; tags: string[];
  rewards: { jetpoints: number; cash?: string };
  minStatus: StatusLevel; requiredPlan: PlanKey | null;
};
type EventItem = { id: string; title: string; date: string; place: string; access: { minStatus: StatusLevel; plan: PlanKey | null }; price: number };
type MarketItem = { id: string; type: 'SERVICE' | 'PRODUCT'; title: string; price: number; owner: string };

const MISSIONS: Mission[] = [
  { id: 'm1', brand: 'FMT.JETLAG', title: 'Рефреш айдентики для FMT.JETLAG Padel', deadline: '14.11.2025', tags: ['design','branding'], rewards: { jetpoints: 250, cash: '50 000 ₽' }, minStatus: 'WHITE', requiredPlan: null },
  { id: 'm2', brand: 'Bluora', title: 'UGC-кампания: Travel-skin ритуалы', deadline: '21.11.2025', tags: ['video','ugc'], rewards: { jetpoints: 150, cash: 'по результату' }, minStatus: 'WHITE', requiredPlan: 'PLUS' },
  { id: 'm3', brand: 'Viperr Waterr', title: 'Съёмка рекламного спота (Twitch)', deadline: '05.12.2025', tags: ['video','production'], rewards: { jetpoints: 500, cash: '120 000 ₽' }, minStatus: 'RED', requiredPlan: 'PRO' },
  { id: 'm4', brand: 'FMT.JETLAG Film', title: 'Motion-пак для стрима-фильма', deadline: '30.11.2025', tags: ['motion','gfx'], rewards: { jetpoints: 400, cash: 'дог.' }, minStatus: 'RED', requiredPlan: null },
];
const EVENTS: EventItem[] = [
  { id: 'e1', title: 'Creator Meetup: Music x AI', date: '16.11.2025', place: 'Москва, Jet-Space', access: { minStatus: 'WHITE', plan: null }, price: 0 },
  { id: 'e2', title: 'FMT.JETLAG Padel Night Tournament', date: '22.11.2025', place: 'FMT.JETLAG Padel', access: { minStatus: 'RED', plan: 'PLUS' }, price: 1500 },
  { id: 'e3', title: 'Studio Session (Backstage)', date: '29.11.2025', place: 'Jet Studio', access: { minStatus: 'RED', plan: 'STUDIO' }, price: 0 },
];
const MARKET: MarketItem[] = [
  { id: 'i1', type: 'SERVICE', title: 'Сведение и мастеринг трека', price: 8000, owner: '@audio.kir' },
  { id: 'i2', type: 'SERVICE', title: 'Motion-дизайн (30 сек)', price: 15000, owner: '@gfx.storm' },
  { id: 'i3', type: 'PRODUCT', title: 'Bluora Travel Kit v2', price: 2490, owner: '@bluora' },
];

/* ---------- общие контролы ---------- */
function Button({ children, onClick, variant='primary', size='md', className, disabled }:{
  children: React.ReactNode; onClick?:()=>void; variant?:'primary'|'secondary'|'ghost'|'outline'; size?:'sm'|'md'; className?:string; disabled?:boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={cx(
        'rounded-xl font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed',
        RING,
        size==='md' ? 'px-4 h-11' : 'px-3 h-9 text-[13px]',
        variant==='primary' && 'bg-white text-black hover:bg-white/90',
        variant==='secondary' && 'bg-white/10 text-white hover:bg-white/15',
        variant==='ghost' && 'bg-transparent text-white hover:bg-white/10',
        variant==='outline' && 'bg-transparent text-white border border-white/20 hover:bg-white/5',
        className
      )}
    >
      {children}
    </button>
  );
}

/* ---------- нижняя навигация ---------- */
function BottomNav({ tab, onChange }:{ tab:string; onChange:(t:string)=>void }) {
  const items = [
    { key: 'home', label: 'Главная', icon: I.Bell },
    { key: 'missions', label: 'Миссии', icon: I.List },
    { key: 'events', label: 'Афиша', icon: I.Ticket },
    { key: 'market', label: 'Маркет', icon: I.Store },
    { key: 'jetlag', label: 'FMT.JETLAG', icon: I.Brand },
  ] as const;

  return (
    <nav className="fixed left-0 right-0 bottom-0 z-40 bg-black/80 backdrop-blur border-t border-[#242428]">
      <div className="mx-auto grid grid-cols-5 h-16 px-2">
        {items.map(it => {
          const Icon = it.icon; const active = it.key===tab;
          return (
            <button key={it.key} type="button" onClick={()=>onChange(it.key)}
              className={cx('flex flex-col items-center justify-center gap-0.5',
                active ? 'text-[#FF2D55]' : 'text-white/70')}>
              <span className={cx('grid place-items-center rounded-xl p-2', active ? 'bg-[#FF2D55]/15':'bg-transparent')}>
                <Icon />
              </span>
              <span className="text-[11px] leading-none">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------- экраны ---------- */
function Home({ go}:{go:(t:string)=>void}) {
  return (
    <div className="space-y-4">
      <Card>
        <Section className="py-5 px-4 flex items-center justify-between">
          <div>
            <div className={cx('uppercase tracking-widest', TS_CAPTION, 'text-white/70')}>FMT.JETLAG Pulse</div>
            <div className="text-[18px] font-semibold mt-0.5">Идеи становятся делом</div>
            <div className={cx('mt-1', TS_BODY, 'text-white/70')}>Забирай миссии, собирай JetPoints, расти в статусе.</div>
          </div>
          <I.Rocket />
        </Section>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <QuickCard icon={<I.List />} title="Миссии" subtitle="Выбирай задачи" onClick={()=>go('missions')} />
        <QuickCard icon={<I.Ticket />} title="Афиша" subtitle="Митапы и турниры" onClick={()=>go('events')} />
        <QuickCard icon={<I.Store />} title="Маркет" subtitle="Услуги и товары" onClick={()=>go('market')} />
      </div>
    </div>
  );
}

function QuickCard({ icon, title, subtitle, onClick }:{
  icon:React.ReactNode; title:string; subtitle:string; onClick:()=>void;
}) {
  return (
    <button onClick={onClick} className={cx('text-left', CARD_BG, BORDER, 'rounded-2xl hover:bg-white/10', RING, 'transition')}>
      <div className="p-2.5 flex items-center gap-2.5">
        <div className="h-8 w-8 grid place-items-center rounded-lg bg-white/10 text-white/80">{icon}</div>
        <div className="leading-tight">
          <div className="text-[13px] font-medium">{title}</div>
          <div className="text-[11px] text-white/60">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}

function Missions({ status, plan }:{status:StatusLevel; plan:PlanKey|null}) {
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ const t=setTimeout(()=>setLoading(false), 350); return ()=>clearTimeout(t); },[]);
  const filtered = useMemo(()=>MISSIONS.filter(m => rankValue(status)>=rankValue(m.minStatus) && (!m.requiredPlan || m.requiredPlan===plan)),[status,plan]);
  if (loading) return <Skeleton title="Миссии" lines={3} />;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><H2>Миссии</H2>
        <div className="text-[12px] text-white/70">Статус: {status} · План: {plan ?? 'нет'}</div>
      </div>
      <div className="grid gap-2">
        {filtered.map(m=>(
          <Card key={m.id}>
            <Section>
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-semibold leading-tight">{m.title}</div>
                <span className="px-3 h-7 rounded-full inline-flex items-center bg-white/10 text-[12px]">{m.brand}</span>
              </div>
              <div className={cx('mt-2 space-y-1', TS_BODY, MUTED2)}>
                <div>Дедлайн: {m.deadline}</div>
                <div>Теги: {m.tags.join(', ')}</div>
                <div>Награды: {m.rewards.jetpoints} JetPoints{m.rewards.cash ? ` + ${m.rewards.cash}` : ''}</div>
              </div>
            </Section>
            <Separator />
            <Section className="flex justify-end">
              <Button size="sm">Участвовать</Button>
            </Section>
          </Card>
        ))}
        {filtered.length===0 && (
          <Card><Section className="py-10 text-center">
            <I.Medal />
            <div className="mt-2 text-[15px] font-medium">Пока нет доступных миссий</div>
            <div className={cx(TS_BODY, MUTED2)}>Подключи план или повышай статус.</div>
          </Section></Card>
        )}
      </div>
    </div>
  );
}

function Events({ status, plan }:{status:StatusLevel; plan:PlanKey|null}) {
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ const t=setTimeout(()=>setLoading(false), 320); return ()=>clearTimeout(t); },[]);
  if (loading) return <Skeleton title="Афиша" lines={2} />;

  return (
    <div className="space-y-3">
      <H2>Афиша</H2>
      <div className="grid gap-2">
        {EVENTS.filter(e=> rankValue(status)>=rankValue(e.access.minStatus) && (!e.access.plan || e.access.plan===plan)).map(e=>(
          <Card key={e.id}>
            <Section>
              <div className="text-[16px] font-semibold">{e.title}</div>
              <div className={cx('mt-1', TS_BODY, MUTED)}>{e.date} — {e.place}</div>
              <div className={cx(TS_BODY, MUTED2)}>Цена: {e.price ? `${e.price} ₽` : 'бесплатно'}</div>
            </Section>
            <Separator />
            <Section className="flex justify-between">
              <Button size="sm" variant="secondary">Получить QR</Button>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">Подробнее</Button>
                <Button size="sm">RSVP</Button>
              </div>
            </Section>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Market({ onPublish }:{ onPublish:()=>void }) {
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ const t=setTimeout(()=>setLoading(false), 300); return ()=>clearTimeout(t); },[]);
  if (loading) return <Skeleton title="Маркет" lines={3} />;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <H2>Маркет</H2>
        <Button size="sm" variant="secondary" onClick={onPublish}>
          <span className="inline-flex items-center gap-2"><I.Plus /> Опубликовать</span>
        </Button>
      </div>
      <div className="grid gap-2">
        {MARKET.map(it=>(
          <Card key={it.id}>
            <Section>
              <div className="text-[16px] font-semibold">{it.title}</div>
              <div className={cx(TS_BODY, MUTED2)}>{it.type}</div>
              <div className={cx(TS_BODY, MUTED2)}>Цена: {it.price} ₽</div>
              <div className={cx(TS_BODY, MUTED2)}>Владелец: {it.owner}</div>
            </Section>
            <Separator />
            <Section className="flex justify-between">
              <Button size="sm" variant="secondary">Подробнее</Button>
              <Button size="sm" variant="secondary">Связаться</Button>
            </Section>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Profile({ openSettings }:{ openSettings:()=>void }) {
  const ACH = [
    { id:'a1', title:'Первый отклик', desc:'1 заявка на миссию', icon:<I.Check/> },
    { id:'a2', title:'100 JetPoints', desc:'Накопил 100 JP', icon:<I.Medal/> },
    { id:'a3', title:'Создатель', desc:'Опубликовал товар/услугу', icon:<I.Store/> },
  ];
  const ACTIVE = MISSIONS.slice(0,2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="rounded-full px-3 h-8 inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white/80 text-[12px]">
          <span className="font-semibold tracking-wide">PRIVATE</span><span className="opacity-60">profile</span>
        </div>
        <div className="flex items-center gap-2">
          <button className={cx('h-9 w-9 grid place-items-center rounded-full bg-white/10', RING)} aria-label="QR"><I.QR/></button>
          <button className={cx('h-9 w-9 grid place-items-center rounded-full bg-white/10', RING)} aria-label="Настройки" onClick={openSettings}><I.Settings/></button>
        </div>
      </div>

      <Card>
        <Section className="py-4 flex items-center justify-between">
          <div>
            <div className="text-[16px] font-semibold">Pulse profile</div>
            <div className="text-[12px] text-white/60">Social network where finance meets lifestyle</div>
          </div>
          <span className="h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white/80"><I.Bell/></span>
        </Section>
      </Card>

      <Card>
        <Section>
          <div className="text-[13px] text-white/80">JetPoints: <b className="text-white">260</b> / 500</div>
          <div className="mt-2 w-full h-2 rounded bg-white/10 overflow-hidden"><div className="h-full bg-white" style={{width:'52%'}}/></div>
          <div className="mt-2 text-[12px] text-white/60">Как заработать: миссии, чек-ин на ивентах, контент, помощь участникам.</div>
        </Section>
      </Card>

      <Card>
        <Section><div className="text-[16px] font-semibold">Достижения</div></Section>
        <Separator />
        <Section>
          <div className="grid sm:grid-cols-3 gap-2">
            {ACH.map(a=>(
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
                <div className="h-9 w-9 grid place-items-center rounded-lg bg-white/10">{a.icon}</div>
                <div className="leading-tight">
                  <div className="text-[13px] font-medium">{a.title}</div>
                  <div className="text-[11px] text-white/60">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Card>

      <Card>
        <Section><div className="text-[16px] font-semibold">Задачи</div></Section>
        <Separator />
        <Section className="grid gap-2">
          {ACTIVE.map(m=>(
            <Card key={m.id} className="bg-[#111113] overflow-hidden">
              <Section>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[15px] font-semibold leading-tight">{m.title}</div>
                  <span className="px-3 h-7 rounded-full inline-flex items-center bg-white/10 text-[12px]">{m.brand}</span>
                </div>
                <div className="mt-1 text-[12px] text-white/60">Дедлайн: {m.deadline} · Теги: {m.tags.join(', ')}</div>
              </Section>
              <Separator />
              <Section className="flex justify-between">
                <Button size="sm" variant="secondary">Подробнее</Button>
                <Button size="sm" variant="secondary">Участвовать</Button>
              </Section>
            </Card>
          ))}
        </Section>
      </Card>
    </div>
  );
}

function SettingsScreen({ plan, onChangePlan }:{ plan:PlanKey|null; onChangePlan:(p:PlanKey)=>void }) {
  const [view, setView] = useState<'root'|'profile'|'subscription'|'notifications'|'language'|'appearance'>('root');
  const [language, setLanguage] = useState<'Русский'|'English'>('Русский');
  const [theme, setTheme] = useState<'Системная'|'Светлая'|'Тёмная'>('Системная');

  const SectionWrap = ({ title, children }:{ title:string; children:React.ReactNode }) => (
    <div className="mt-3">
      <div className="px-4 text-[12px] tracking-wide text-white/50 mb-1">{title}</div>
      <div className="mx-3 rounded-2xl overflow-hidden border border-white/10 bg-[#111113]">{children}</div>
    </div>
  );
  const Cell = ({ icon, title, value, onClick }:{icon?:React.ReactNode; title:string; value?:string; onClick?:()=>void}) => (
    <button onClick={onClick} className="w-full px-4 h-14 flex items-center gap-3 text-left hover:bg-white/5">
      <span className="h-9 w-9 grid place-items-center rounded-lg bg-white/10 text-white/80">{icon ?? <span/>}</span>
      <span className="flex-1 text-[15px]">{title}</span>
      {value && <span className="text-[13px] text-white/50 mr-1">{value}</span>}
      <I.ChevronRight />
    </button>
  );
  const Header = ({title, onBack}:{title:string; onBack?:()=>void}) => (
    <div className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="h-10" />
      <div className="h-12 grid grid-cols-3 items-center px-4">
        <div className="justify-self-start">{onBack && <button onClick={onBack} className="text-white/70">Назад</button>}</div>
        <div className="justify-self-center text-[17px] font-semibold">{title}</div><div/>
      </div>
    </div>
  );

  if (view==='profile') return (
    <div className="space-y-3">
      <Header title="Профиль" onBack={()=>setView('root')} />
      <SectionWrap title="ACCOUNT">
        <div className="p-4 grid gap-2">
          <input className={cx('w-full h-11 rounded-xl px-4 bg-black/40', BORDER, RING)} placeholder="Имя" defaultValue="Даниил"/>
          <input className={cx('w-full h-11 rounded-xl px-4 bg-black/40', BORDER, RING)} placeholder="Фамилия"/>
          <input className={cx('w-full h-11 rounded-xl px-4 bg-black/40', BORDER, RING)} placeholder="Email"/>
          <div className="flex justify-end gap-2 pt-1">
            <Button size="sm" variant="outline">Отменить</Button>
            <Button size="sm">Сохранить</Button>
          </div>
        </div>
      </SectionWrap>
    </div>
  );

  if (view==='subscription') return (
    <div className="space-y-3">
      <Header title="Подписка и планы" onBack={()=>setView('root')} />
      <SectionWrap title="PLANS">
        <div className="grid sm:grid-cols-3 gap-2 p-3">
          {PLANS.map(p=>(
            <Card key={p.key} className={cx('bg-[#111113]', plan===p.key && 'ring-1 ring-white/30')}>
              <Section>
                <div className="font-medium text-[14px]">{p.title}</div>
                <div className="text-[12px] text-white/60">₽{p.price}/мес</div>
                <div className="mt-2">
                  <Button size="sm" variant={plan===p.key ? 'secondary':'primary'} onClick={()=>onChangePlan(p.key as PlanKey)}>
                    {plan===p.key ? 'Активно':'Подключить'}
                  </Button>
                </div>
              </Section>
            </Card>
          ))}
        </div>
      </SectionWrap>
    </div>
  );

  if (view==='notifications') return (
    <div className="space-y-3">
      <Header title="Уведомления" onBack={()=>setView('root')} />
      <SectionWrap title="PREFERENCES">
        <div className="p-2">
          <label className="flex items-center justify-between px-3 h-12"><span>Пуш-уведомления</span><input type="checkbox" defaultChecked/></label>
          <Separator />
          <label className="flex items-center justify-between px-3 h-12"><span>Email-уведомления</span><input type="checkbox"/></label>
        </div>
      </SectionWrap>
    </div>
  );

  if (view==='language') return (
    <div className="space-y-3">
      <Header title="Язык интерфейса" onBack={()=>setView('root')} />
      <SectionWrap title="LANGUAGE">
        <button className="w-full px-4 h-14 flex items-center justify-between hover:bg-white/5" onClick={()=>setLanguage('Русский')}>
          <span>Русский</span>{language==='Русский' && <I.Check/>}
        </button>
        <Separator />
        <button className="w-full px-4 h-14 flex items-center justify-between hover:bg-white/5" onClick={()=>setLanguage('English')}>
          <span>English</span>{language==='English' && <I.Check/>}
        </button>
      </SectionWrap>
    </div>
  );

  if (view==='appearance') return (
    <div className="space-y-3">
      <Header title="Тема оформления" onBack={()=>setView('root')} />
      <SectionWrap title="APPEARANCE">
        {(['Системная','Светлая','Тёмная'] as const).map(v=>(
          <React.Fragment key={v}>
            <button className="w-full px-4 h-14 flex items-center justify-between hover:bg-white/5" onClick={()=>setTheme(v)}>
              <span>{v}</span>{v===theme && <I.Check/>}
            </button>
            <Separator />
          </React.Fragment>
        ))}
      </SectionWrap>
    </div>
  );

  return (
    <div className="space-y-3">
      <Header title="Настройки" />
      <SectionWrap title="ACCOUNT">
        <Cell icon={<I.User/>} title="Профиль" onClick={()=>setView('profile')} />
        <Separator />
        <Cell icon={<I.Medal/>} title="Подписка и планы" value={plan ?? 'нет'} onClick={()=>setView('subscription')} />
        <Separator />
        <Cell icon={<I.Bell/>} title="Уведомления" onClick={()=>setView('notifications')} />
      </SectionWrap>
      <SectionWrap title="APP">
        <Cell icon={<I.Grid/>} title="Язык интерфейса" value={language} onClick={()=>setView('language')} />
        <Separator />
        <Cell icon={<I.Settings/>} title="Тема оформления" value={theme} onClick={()=>setView('appearance')} />
      </SectionWrap>
    </div>
  );
}

function FmtHub({ goManor }:{ goManor:()=>void }) {
  const PRODUCTS = [
    { id:'p1', title:'Спорт',  desc:'Падел клуб и экипировка' },
    { id:'p2', title:'Waterr', desc:'Газированная вода • 0.5 L' },
    { id:'p3', title:'Bluora', desc:'Косметика и travel наборы' },
    { id:'p4', title:'Одежда', desc:'Худи, футболки, аксессуары' },
  ];
  const PEOPLE = [
    { id:'u1', name:'Arseniy', role:'Designer' },
    { id:'u2', name:'Badri', role:'Producer' },
    { id:'u3', name:'Daniil', role:'Founder' },
    { id:'u4', name:'Yana', role:'Artist' },
  ];
  const Avatar = ({name}:{name:string}) => {
    const initials = name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
    return <div className="h-16 w-16 rounded-xl bg-white/10 grid place-items-center text-[14px] font-semibold">{initials}</div>;
  };

  return (
    <div className="space-y-4">
      {/* О нас */}
      <Card>
        <Section className="py-5 px-4 flex items-center justify-between">
          <div>
            <div className={cx('uppercase tracking-widest', TS_CAPTION, 'text-white/70')}>О нас</div>
            <div className="text-[18px] font-semibold mt-0.5">Empowering talents to</div>
            <div className="text-[18px] font-semibold -mt-1">bring value through content</div>
          </div>
          <I.Brand />
        </Section>
      </Card>

      {/* Усадьба */}
      <Card>
        <Section>
          <div className="flex items-center justify-between">
            <div className="text-[16px] font-semibold flex items-center gap-2"><I.Temple/> Усадьба JETLAG</div>
            <Button size="sm" variant="secondary" onClick={goManor}>Открыть 3D-тур</Button>
          </div>
          <div className={cx('mt-1', TS_BODY, 'text-white/70')}>Дом-кампус для резиденций, съёмок и встреч сообщества.</div>
        </Section>
      </Card>

      {/* Продукты */}
      <Card>
        <Section>
          <div className="text-[16px] font-semibold mb-2">JETLAG продукты</div>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCTS.map(p=>(
              <Card key={p.id} className="bg-[#111113]">
                <Section>
                  <div className="text-[14px] font-semibold leading-tight">{p.title}</div>
                  <div className={cx(TS_BODY, MUTED2)}>{p.desc}</div>
                  <div className="mt-2"><Button size="sm" variant="secondary">Подробнее</Button></div>
                </Section>
              </Card>
            ))}
          </div>
        </Section>
      </Card>

      {/* Видео (локальный файл если положишь public/video.mp4) */}
      <Card>
        <Section>
          <div className="text-[16px] font-semibold mb-2">Видео и атмосфера</div>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30 aspect-video grid place-items-center">
            <video className="w-full h-full" muted playsInline loop autoPlay controls
                   src="/video.mp4"
                   onError={(e)=>{(e.currentTarget as HTMLVideoElement).outerHTML =
                     '<div class=\"p-4 text-white/80 text-[13px]\">Положи короткий файл в <code>public/video.mp4</code>, и он будет авто-играть на вкладке.</div>'}}
            />
          </div>
        </Section>
      </Card>

      {/* Амбассадоры */}
      <Card>
        <Section>
          <div className="text-[16px] font-semibold mb-2">Амбассадоры</div>
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {PEOPLE.map(p=>(
                <div key={p.id} className="w-44 shrink-0 rounded-2xl bg-white/5 p-3 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name}/>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium truncate">{p.name}</div>
                      <div className="text-[11px] text-white/60 truncate">{p.role}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-white/70">создаём культуру вместе</div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </Card>
    </div>
  );
}

function Manor() {
  return (
    <div className="space-y-4">
      <Card>
        <Section>
          <div className="text-[16px] font-semibold">Усадьба JETLAG — 3D тур</div>
        </Section>
        <Separator />
        <Section>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30 aspect-video grid place-items-center text-white/70 text-[13px]">
            Здесь будет iframe со сценой 3D-тура.
          </div>
        </Section>
      </Card>
    </div>
  );
}

function Skeleton({ title, lines }:{ title:string; lines:number }) {
  return (
    <div className="space-y-3">
      <H2>{title}</H2>
      {[...Array(lines)].map((_,i)=>(
        <div key={i} className={cx(CARD_BG, BORDER, 'rounded-2xl p-4 grid gap-2 animate-pulse')}>
          <div className="h-4 bg-white/10 rounded" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

/* ---------- корневой App ---------- */
export default function App() {
  const [tab, setTab] = useState<'home'|'missions'|'events'|'market'|'jetlag'|'profile'|'settings'|'manor'>('jetlag');
  const [status] = useState<StatusLevel>('WHITE');
  const [plan, setPlan] = useState<PlanKey|null>(null);

  const title =
    tab==='home'     ? 'Главная' :
    tab==='missions' ? 'Миссии' :
    tab==='events'   ? 'Афиша' :
    tab==='market'   ? 'Маркет' :
    tab==='profile'  ? 'Даниил' :
    tab==='settings' ? 'Настройки' :
    tab==='manor'    ? 'Усадьба' :
    'FMT.JETLAG';

  return (
    <div className={cx('min-h-[100vh]', SURFACE, 'flex flex-col')}>
      {/* верхняя панель */}
      <div className="sticky top-0 z-30 backdrop-blur bg-black/80 border-b border-[#242428]">
        <div className="mx-auto w-full px-4">
          <div className="h-6" />
          <div className="h-12 grid grid-cols-3 items-center">
            <div className="justify-self-start flex items-center gap-2 text-[13px] text-white/60 min-w-0">
              <I.Grid /><span className="truncate">FMT.JETLAG</span>
            </div>
            <div className="justify-self-center text-white text-[17px] font-semibold truncate">{title}</div>
            <div className="justify-self-end flex items-center gap-2">
              <button className={cx('grid place-items-center rounded-xl p-2 bg-white/10 hover:bg-white/15', RING)} aria-label="Усадьба" onClick={()=>setTab('manor')}><I.Temple/></button>
              <button className={cx('grid place-items-center rounded-xl p-2 bg-white/10 hover:bg-white/15', RING)} aria-label="Настройки" onClick={()=>setTab('settings')}><I.Settings/></button>
            </div>
          </div>
          <div className="pb-3 flex items-center justify-between text-[11px] text-white/70">
            <button onClick={()=>setTab('profile')} className={cx('inline-flex items-center gap-2 bg-white/5 px-2.5 h-7 rounded-xl hover:bg-white/10', RING)}><I.User/> Даниил</button>
            <div className="flex items-center gap-2">
              <span className="bg-white/5 px-2.5 h-7 rounded-xl inline-flex items-center">WHITE</span>
              <span className="bg-white/5 px-2.5 h-7 rounded-xl inline-flex items-center">{plan ?? 'нет плана'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* контент */}
      <div className="px-4 pb-24">
        <div key={tab} className="animate-[fadeIn_.18s_ease-out_both]">
          {tab==='home'     && <Home go={setTab} />}
          {tab==='missions' && <Missions status={status} plan={plan} />}
          {tab==='events'   && <Events status={status} plan={plan} />}
          {tab==='market'   && <Market onPublish={()=>alert('Публикация (демо)')} />}
          {tab==='jetlag'   && <FmtHub goManor={()=>setTab('manor')} />}
          {tab==='profile'  && <Profile openSettings={()=>setTab('settings')} />}
          {tab==='settings' && <SettingsScreen plan={plan} onChangePlan={p=>setPlan(p)} />}
          {tab==='manor'    && <Manor />}
        </div>
      </div>

      {/* нижняя панель */}
      <BottomNav tab={tab} onChange={setTab}/>
    </div>
  );
}

