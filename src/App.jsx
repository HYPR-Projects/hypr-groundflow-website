import { useState, useEffect, useRef, useMemo } from 'react'

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════
const iconBase = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

const IconPin = (p) => (
  <svg {...iconBase} {...p}>
    <path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);

const IconReceipt = (p) => (
  <svg {...iconBase} {...p}>
    <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3z"/>
    <path d="M8 8h8M8 12h8M8 16h5"/>
  </svg>
);

const IconChart = (p) => (
  <svg {...iconBase} {...p}>
    <path d="M3 20h18"/>
    <path d="M6 16v-5"/>
    <path d="M11 16V8"/>
    <path d="M16 16v-3"/>
    <path d="M21 16V6"/>
    <path d="M6 11l5-3 5 5 5-7"/>
  </svg>
);

const IconTarget = (p) => (
  <svg {...iconBase} {...p}>
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="5.5"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
  </svg>
);

const IconHeart = (p) => (
  <svg {...iconBase} {...p}>
    <path d="M12 20s-7-4.35-7-10a4.5 4.5 0 018-2.8A4.5 4.5 0 0119 10c0 5.65-7 10-7 10z"/>
  </svg>
);

const IconGrid = (p) => (
  <svg {...iconBase} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <path d="M10 6.5H14M6.5 10V14M17.5 10V14M10 17.5H14" opacity=".5"/>
  </svg>
);

const IconBroadcast = (p) => (
  <svg {...iconBase} {...p}>
    <circle cx="12" cy="12" r="2"/>
    <path d="M8.5 8.5a5 5 0 000 7"/>
    <path d="M15.5 8.5a5 5 0 010 7"/>
    <path d="M5.5 5.5a9 9 0 000 13"/>
    <path d="M18.5 5.5a9 9 0 010 13"/>
  </svg>
);

const IconArrowRight = (p) => (
  <svg {...iconBase} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

const IconArrowUpRight = (p) => (
  <svg {...iconBase} {...p}>
    <path d="M7 17L17 7M9 7h8v8"/>
  </svg>
);

const IconCheck = (p) => (
  <svg {...iconBase} {...p}>
    <path d="M4 12l5 5 11-11"/>
  </svg>
);

const IconSpark = (p) => (
  <svg {...iconBase} {...p}>
    <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"/>
  </svg>
);

// Logo usando SVG transparente (branco ou escuro, conforme contexto)
const IconLogo = ({ className = '', variant = 'white', style = {} }) => {
  const src = variant === 'dark' ? '/logo-dark.png' : '/logo-groundflow-white.svg';
  return (
    <img src={src} alt="GroundFlow" className={"logo-img " + className} style={style} />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTIONS
// ═══════════════════════════════════════════════════════════════════════════

// ---------- helpers ----------
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    el.querySelectorAll('.reveal').forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

function useCountUp(target, { duration = 1400, decimals = 0, start = false } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString('pt-BR');
}

function NumDisplay({ value, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const display = useCountUp(value, { decimals, start: started });
  return (
    <span ref={ref} className={"num " + className}>
      {prefix}{display}{suffix}
    </span>
  );
}

// ---------- NAV ----------
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={"fixed top-0 inset-x-0 z-40 transition-all duration-300 " +
      (scrolled ? "backdrop-blur-xl bg-ink/80 border-b border-white/5" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="text-white flex items-center" style={{ height: '28px' }}>
          <IconLogo style={{ height: '22px' }} />
        </a>
        <div className="hidden md:flex items-center gap-7 text-[13px] text-white/70">
          <a href="#problema" className="hover:text-white transition-colors">Problema</a>
          <a href="#solucao" className="hover:text-white transition-colors">Solução</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#casos" className="hover:text-white transition-colors">Casos</a>
          <a href="#estrategias" className="hover:text-white transition-colors">Estratégias</a>
        </div>
        <a href="#cta" className="btn-primary text-[13px] font-medium px-4 py-2 rounded-full bg-brand-500 text-ink hover:bg-[#3ec8f0]">
          Fale conosco
        </a>
      </div>
    </nav>
  );
}

// ---------- HERO ----------
function Hero() {
  const ref = useReveal();
  return (
    <section id="top" ref={ref} className="relative grid-bg overflow-hidden pt-28 pb-24 md:pt-40 md:pb-36">
      <div className="absolute -top-40 -left-40 w-[620px] h-[620px] glow-blue opacity-60 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[620px] h-[620px] glow-cyan opacity-50 pointer-events-none" />

      <div className="absolute top-24 right-8 md:right-16 text-[11px] text-mute/70 tracking-[0.25em] font-mono hidden md:block">
        SKU · 7891024131602 / BRL 12,90
      </div>
      <div className="absolute bottom-10 left-8 md:left-16 text-[11px] text-mute/70 tracking-[0.25em] font-mono hidden md:block">
        BR / SP / BELA VISTA
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="reveal flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-brand-500 mb-8">
          <span className="w-6 h-px bg-brand-500" />
          The measurement layer for real sales
        </div>

        {/* Logo grande em vez de texto */}
        <div className="reveal delay-1">
          <img
            src="/logo-groundflow-white.svg"
            alt="GroundFlow"
            className="w-full max-w-[1100px] h-auto"
            style={{ filter: 'drop-shadow(0 2px 20px rgba(36,189,239,0.15))' }}
          />
        </div>

        <div className="reveal delay-2 mt-10 md:mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="text-white/80 text-[22px] md:text-[28px] font-light leading-tight max-w-xl">
              From transaction
              <span className="inline-flex mx-3 align-middle text-brand-500">
                <IconArrowRight width="30" height="30" />
              </span>
              <span className="font-semibold text-white">into investments.</span>
            </p>
            <p className="mt-4 text-mute max-w-lg text-[15px] leading-relaxed">
              Cada nota fiscal vai além do registro de venda — é o retrato
              de quem compra, o quê, onde e quando. Transformamos dados
              transacionais de milhares de PDVs em inteligência de mídia
              mensurável em vendas reais.
            </p>
          </div>
          <div className="flex gap-3">
            <a href="#cta" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-500 text-ink font-medium text-[14px]">
              Fale conosco
              <IconArrowRight width="16" height="16" strokeWidth="2" />
            </a>
            <a href="#solucao" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white/90 hover:bg-white/5 transition-colors text-[14px]">
              Ver solução
            </a>
          </div>
        </div>

        <div className="reveal delay-3 mt-20 md:mt-28 relative">
          <div className="dot-rule mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <HeroStat label="Transações mapeadas" value="+225M" />
            <HeroStat label="Usuários ativos" value="1.5M" />
            <HeroStat label="NF-e analisadas" value="+287M" />
            <HeroStat label="Market do CPG no Brasil" value="R$280bn" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-mute mb-2">{label}</div>
      <div className="num text-[32px] md:text-[40px] font-semibold text-white">{value}</div>
    </div>
  );
}

// ---------- CONTEXT BAR ----------
function ContextBar() {
  const items = ['McDonald\u2019s', 'Coca-Cola', 'Swift', 'Droga Raia', 'Heineken', 'Pão de Açúcar', 'Heinz', 'Mambo', 'Oxxo', 'Listerine', 'Novalgina', 'Hellmann\u2019s'];
  const all = [...items, ...items];
  return (
    <section className="bg-ink border-y border-white/5 py-8 overflow-hidden">
      <div className="text-[10px] uppercase tracking-[0.3em] text-mute text-center mb-6">
        Medindo vendas reais em categorias como
      </div>
      <div className="relative">
        <div className="ticker-track flex gap-14 w-max text-white/60">
          {all.map((n, i) => (
            <span key={i} className="text-[20px] font-light tracking-tight whitespace-nowrap">{n}</span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
      </div>
    </section>
  );
}

// ---------- PROBLEMA ----------
function Problema() {
  const ref = useReveal();
  return (
    <section id="problema" ref={ref} className="relative grid-bg-light py-28 md:py-36 text-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionLabel dark label="01 / O PROBLEMA" />
        <h2 className="reveal delay-1 mt-6 text-[36px] md:text-[56px] font-light leading-[1.02] tracking-[-0.02em] max-w-4xl">
          Medir o impacto da mídia no varejo físico sempre foi
          <span className="font-semibold"> um ponto cego.</span>
        </h2>

        <div className="mt-16 md:mt-24 grid md:grid-cols-12 gap-10 items-end">
          <div className="reveal delay-2 md:col-span-7 border-t border-ink/15 pt-6">
            <div className="flex items-start justify-between gap-6">
              <div className="text-[11px] uppercase tracking-[0.2em] text-ink/60">Das vendas CPG no Brasil</div>
              <div className="text-[11px] text-ink/40 font-mono">FGV IBRE · ABComm</div>
            </div>
            <div className="num text-[120px] md:text-[160px] lg:text-[220px] xl:text-[260px] font-semibold leading-[0.82] tracking-[-0.05em] mt-6 text-ink">
              86,4<span className="text-brand-600">%</span>
            </div>
            <div className="mt-4 text-[18px] md:text-[22px] font-light max-w-md text-ink/80">
              ainda ocorrem em lojas físicas, não no e-commerce.
            </div>

            <div className="mt-10 max-w-xl">
              <div className="flex h-8 w-full rounded-sm overflow-hidden bg-ink/10">
                <div className="h-full bg-ink relative" style={{ width: '86.4%' }}>
                  <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,.35) 6px 7px)'}}/>
                </div>
                <div className="h-full" style={{ width: '13.6%', background: '#24bdef' }} />
              </div>
              <div className="flex justify-between text-[11px] mt-2 text-ink/60 font-mono">
                <span>FÍSICO · 86,4%</span>
                <span>E-COMMERCE · 13,6%</span>
              </div>
            </div>
          </div>

          <div className="reveal delay-3 md:col-span-5 md:border-l border-ink/15 md:pl-10 pt-10 border-t md:border-t-0 md:pt-0">
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-6">Mercado CPG Brasil</div>
            <div className="num text-[88px] md:text-[104px] lg:text-[128px] font-semibold leading-[0.85] tracking-[-0.04em] text-brand-600">
              R$280<span className="text-[56px] md:text-[64px] lg:text-[72px] align-top pl-1 font-light">bn</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="num text-[40px] font-semibold text-ink">&lt;1%</span>
              <span className="text-[14px] text-ink/70">é vendas digitais mensuráveis</span>
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-ink/70 max-w-sm">
              Para anunciantes de CPG, entender o impacto real da mídia nos canais de venda físicos sempre foi uma incógnita. Até agora.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ label, dark = false }) {
  return (
    <div className={"reveal flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] " + (dark ? "text-ink/70" : "text-brand-500")}>
      <span className={"w-6 h-px " + (dark ? "bg-ink/40" : "bg-brand-500")} />
      {label}
    </div>
  );
}

// ---------- SOLUÇÃO ----------
function Solucao() {
  const ref = useReveal();
  return (
    <section id="solucao" ref={ref} className="relative grid-bg py-28 md:py-36 overflow-hidden">
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] glow-cyan pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionLabel label="02 / A SOLUÇÃO" />
        <h2 className="reveal delay-1 mt-6 text-[36px] md:text-[64px] font-light leading-[1.02] tracking-[-0.025em] max-w-5xl">
          Performance de mídia agora tem
          <span className="relative inline-block ml-3">
            <span className="font-semibold text-brand-500">prova de venda.</span>
          </span>
        </h2>
        <p className="reveal delay-2 mt-6 text-mute text-[16px] md:text-[18px] max-w-2xl leading-relaxed">
          Cruzamos dados de mídia veiculada com dados transacionais no nível de SKU, storechain e PDV. Metodologia aberta, com grupos exposto e controle, agnóstica ao varejista.
        </p>

        <div className="reveal delay-3 mt-16 grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 items-stretch">
          <DataCard
            kicker="MEDIA DATA"
            title="Mídia veiculada"
            fields={[
              ['CAMPAIGN', 'ATIVAÇÃO · Q2'],
              ['IMPRESSIONS', '2.8M'],
              ['STORECHAIN', '+180 PDVs'],
              ['REGION', 'SP · RS'],
            ]}
            accent="blue"
          />
          <Connector />
          <DataCard
            kicker="TRANSACTION DATA"
            title="Venda real no PDV"
            fields={[
              ['SKU', '7891024131602'],
              ['CATEGORY', 'BEBIDAS'],
              ['PRICE', 'R$ 12,90'],
              ['REVENUE', 'R$ 129,50'],
            ]}
            accent="cyan"
          />
          <Connector equals />
          <ResultCard />
        </div>

        <div className="mt-16 md:mt-20 border border-white/10 rounded-2xl bg-white/[0.02] p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <MetricCell kicker="Transações mapeadas" value="+225M" sub="Cross-retailer, no PDV" />
          <MetricCell kicker="Usuários ativos" value="1.5M" sub="Shoppers com consentimento" />
          <MetricCell kicker="NF-e processadas" value="+287M" sub="Granularidade SKU · Ticket · PDV" />
        </div>
      </div>
    </section>
  );
}

function DataCard({ kicker, title, fields, accent = 'cyan' }) {
  const ring = accent === 'blue' ? 'ring-brand-600/30' : 'ring-brand-500/30';
  const dot = accent === 'blue' ? 'bg-brand-600' : 'bg-brand-500';
  return (
    <div className={"relative rounded-2xl bg-ink-2 border border-white/10 p-6 ring-1 " + ring}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className={"w-1.5 h-1.5 rounded-full " + dot} />
          <span className="text-[10px] font-mono tracking-[0.25em] text-mute">{kicker}</span>
        </div>
        <span className="text-[10px] text-mute/60 font-mono">LIVE</span>
      </div>
      <div className="text-[18px] font-medium mb-5">{title}</div>
      <dl className="space-y-2.5 font-mono text-[11.5px]">
        {fields.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-white/5 pb-2">
            <dt className="text-mute tracking-[0.15em]">{k}</dt>
            <dd className="text-white/90 text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Connector({ equals = false }) {
  return (
    <div className="hidden md:flex items-center justify-center text-brand-500 self-center">
      {equals ? (
        <div className="flex flex-col gap-1">
          <span className="block w-6 h-0.5 bg-brand-500" />
          <span className="block w-6 h-0.5 bg-brand-500" />
        </div>
      ) : (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M4 14h20M4 14l4-4M4 14l4 4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M24 14l-4-4M24 14l-4 4" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )}
    </div>
  );
}

function ResultCard() {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-ink p-6 overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-white/10" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-ink" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-ink/80">SELLOUT REPORT</span>
        </div>
        <div className="text-[13px] text-ink/80 mb-2">Market Share Lift</div>
        <div className="num text-[72px] font-semibold leading-none tracking-[-0.04em]">+6%</div>
        <div className="mt-4 text-[12px] text-ink/80">em até <span className="font-semibold">14 dias</span></div>

        <svg viewBox="0 0 120 40" className="mt-5 w-full h-10">
          <path d="M2 32 L20 28 L38 26 L56 22 L74 16 L92 10 L118 4" stroke="#181c28" strokeWidth="2" fill="none"/>
          <path d="M2 32 L20 28 L38 26 L56 22 L74 16 L92 10 L118 4 L118 40 L2 40Z" fill="#181c28" opacity=".1"/>
        </svg>
      </div>
    </div>
  );
}

function MetricCell({ kicker, value, sub }) {
  return (
    <div className="px-0 md:px-8 py-4 md:py-2">
      <div className="text-[10px] uppercase tracking-[0.25em] text-mute mb-2">{kicker}</div>
      <div className="num text-[48px] md:text-[56px] font-semibold text-white leading-none tracking-[-0.03em]">{value}</div>
      <div className="mt-2 text-[13px] text-mute">{sub}</div>
    </div>
  );
}

// ---------- COMO FUNCIONA ----------
function ComoFunciona() {
  const ref = useReveal();
  const steps = [
    {
      n: '01',
      icon: IconReceipt,
      title: 'Aquisição de dados',
      desc: 'Integramos dados transacionais de milhares de PDVs no nível de SKU, ticket, storechain e categoria. Base agnóstica ao varejista, cobertura continental.',
      tags: ['SKU', 'STORECHAIN', 'TICKET', 'CATEGORIA'],
    },
    {
      n: '02',
      icon: IconTarget,
      title: 'Modelagem + ativação',
      desc: 'Identificamos PDVs com maior potencial de lift de vendas. Definimos grupos exposto e controle. Ativamos mídia direcionada aos dispositivos certos.',
      tags: ['EXPOSTO', 'CONTROLE', 'O2O', 'AUDIÊNCIA'],
    },
    {
      n: '03',
      icon: IconChart,
      title: 'Lift de vendas',
      desc: 'Comparamos desempenho entre exposto e controle. Medimos lift no SKU e na categoria. Resultado em vendas reais, mensurado em até 14 dias.',
      tags: ['LIFT SKU', 'LIFT CATEGORIA', 'GMV', '14 DIAS'],
    },
  ];
  return (
    <section id="como-funciona" ref={ref} className="relative bg-white text-ink py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <SectionLabel dark label="03 / COMO FUNCIONA" />
            <h2 className="reveal delay-1 mt-6 text-[36px] md:text-[56px] font-light leading-[1.02] tracking-[-0.02em] max-w-3xl">
              Três camadas. <span className="font-semibold">Uma arquitetura</span> agnóstica ao varejista.
            </h2>
          </div>
          <div className="reveal delay-2 text-[13px] text-ink/60 max-w-xs">
            Dados de primeira parte, consentidos e rastreáveis, do primeiro touch de mídia até o ticket final.
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className={"reveal delay-" + (i+1) +
              " relative bg-ink text-white rounded-3xl p-8 overflow-hidden group"}>
              <div className="absolute inset-0 grid-bg opacity-100" />
              <div className="absolute top-0 right-0 w-40 h-40 glow-cyan opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-[11px] font-mono text-brand-500 tracking-[0.2em]">{s.n}</span>
                  <s.icon className="text-brand-500" width="28" height="28" />
                </div>
                <div className="text-[22px] md:text-[26px] font-medium leading-tight tracking-[-0.01em] mb-4">{s.title}</div>
                <p className="text-[14px] text-mute leading-relaxed mb-8 min-h-[64px]">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono tracking-[0.15em] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-mute">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CASOS DE USO ----------
function Casos() {
  const ref = useReveal();
  const cases = [
    {
      brand: 'McDonald\u2019s',
      hero: 'Coca-Cola',
      vs: 'Big Mac',
      stat: 173,
      label: 'mais receita',
      tag: 'Fast food',
      color: '#DE2A25',
      insight: 'A bebida complementar gera mais valor do que o item-âncora do menu.',
      ranking: [
        { name: 'Coca-Cola', score: 100, role: 'hero', note: 'Complementar' },
        { name: 'Batata frita grande', score: 54, role: 'mid' },
        { name: 'Big Mac', score: 37, role: 'anchor', note: 'Item-âncora' },
      ],
    },
    {
      brand: 'Swift',
      hero: 'Picanha',
      vs: 'Filet mignon',
      stat: 266,
      label: 'mais GMV',
      tag: 'Açougue premium',
      color: '#9b2020',
      insight: 'O corte favorito do brasileiro supera alternativas mais caras em GMV total.',
      ranking: [
        { name: 'Picanha', score: 100, role: 'hero', note: 'Preferência local' },
        { name: 'Alcatra', score: 48, role: 'mid' },
        { name: 'Filet mignon', score: 27, role: 'anchor', note: 'Corte premium' },
      ],
    },
    {
      brand: 'Droga Raia',
      hero: 'Ozempic',
      vs: 'Novalgina',
      stat: 343,
      label: 'mais GMV',
      tag: 'Farmácia',
      color: '#0066B3',
      insight: 'Medicamentos de prescrição crescente redesenham a receita da categoria.',
      ranking: [
        { name: 'Ozempic', score: 100, role: 'hero', note: 'Prescrição crescente' },
        { name: 'Losartana', score: 42, role: 'mid' },
        { name: 'Novalgina', score: 23, role: 'anchor', note: 'Alta rotação' },
      ],
    },
  ];
  const [active, setActive] = useState(0);
  const current = cases[active];

  return (
    <section id="casos" ref={ref} className="relative grid-bg py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <SectionLabel label="04 / CASOS DE USO" />
            <h2 className="reveal delay-1 mt-6 text-[36px] md:text-[56px] font-light leading-[1.02] tracking-[-0.02em] max-w-4xl">
              O que os dados revelam quando você tem <span className="font-semibold">+550K notas fiscais</span>.
            </h2>
          </div>
          <div className="reveal delay-2 text-[11px] font-mono text-mute tracking-[0.15em] md:text-right">
            AMOSTRA · SWIFT · DROGA RAIA · MAMBO<br/>
            MÉTODO · GROUNDFLOW SELLOUT DATA
          </div>
        </div>

        <div className="reveal delay-3 mt-12 flex flex-wrap gap-2">
          {cases.map((c, i) => (
            <button
              key={c.brand}
              onClick={() => setActive(i)}
              className={"case-chip text-[13px] px-5 py-2.5 rounded-full border " +
                (i === active
                  ? "bg-white text-ink border-white"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10")}>
              {c.brand}
            </button>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-5">
          <div className="md:col-span-7 rounded-3xl bg-ink-2 border border-white/10 p-8 md:p-12 min-h-[420px] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
              background: `radial-gradient(500px 300px at 20% 80%, ${current.color}66, transparent 60%)`
            }}/>
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-mute">{current.tag}</span>
                </div>
                <span className="text-[11px] font-mono text-mute/70">CASE {String(active+1).padStart(2,'0')} / 03</span>
              </div>
              <div className="text-[15px] text-white/70 mb-3">No {current.brand},</div>
              <div className="text-[32px] md:text-[44px] font-light leading-[1.02] tracking-[-0.02em] mb-6">
                <span className="font-semibold">{current.hero}</span> gera
                <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="num text-brand-500 font-semibold text-[72px] md:text-[96px] lg:text-[120px] leading-none">
                    +{current.stat}%
                  </span>
                  <span className="text-[22px] md:text-[28px] lg:text-[36px]">{current.label}</span>
                </div>
                <span className="text-[20px] md:text-[24px] text-white/70 mt-3 block">
                  que {current.vs}.
                </span>
              </div>
              <p className="text-[15px] text-mute max-w-md leading-relaxed">{current.insight}</p>
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-ink-2 border border-white/10 p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="text-[11px] font-mono text-mute tracking-[0.15em]">TOP SKUs POR RECEITA</div>
                <div className="text-[10px] font-mono text-mute/60">ÍNDICE · 100 = LÍDER</div>
              </div>
              <div className="space-y-5">
                {current.ranking.map((item, idx) => (
                  <RankingRow
                    key={item.name}
                    position={idx + 1}
                    name={item.name}
                    score={item.score}
                    role={item.role}
                    note={item.note}
                    color={current.color}
                  />
                ))}
              </div>
            </div>
            <div className="pt-8 mt-8 border-t border-white/10">
              <div className="text-[11px] uppercase tracking-[0.2em] text-mute mb-2">Amostra analisada</div>
              <div className="num text-[36px] font-semibold text-white">+550K</div>
              <div className="text-[12px] text-mute mt-1">notas fiscais cross-retailer</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RankingRow({ position, name, score, role, note, color }) {
  const width = Math.max(6, Math.min(100, score));
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };
  const barColor = role === 'hero'
    ? color
    : role === 'mid'
      ? hexToRgba(color, 0.55)
      : hexToRgba(color, 0.3);
  const labelColor = role === 'hero' ? 'text-white' : 'text-white/85';
  const posColor = role === 'hero' ? 'text-white' : 'text-white/50';
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className={"num text-[11px] font-mono tracking-wider " + posColor}>
            {String(position).padStart(2, '0')}
          </span>
          <span className={"text-[14px] truncate " + labelColor}>{name}</span>
          {note && (
            <span className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase whitespace-nowrap hidden lg:inline">
              · {note}
            </span>
          )}
        </div>
        <span className="num text-[13px] text-white/70 tabular-nums">{score}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: width + '%', background: barColor }} />
      </div>
    </div>
  );
}

// ---------- ESTRATÉGIAS ----------
function Estrategias() {
  const ref = useReveal();
  const strats = [
    { n: '01', icon: IconTarget, title: 'Conquistar market share',
      desc: 'Audiência focada em locais onde sua marca perde market share. Foco: receita via novos compradores.',
      color: 'cyan' },
    { n: '02', icon: IconHeart, title: 'Fidelizar recorrentes',
      desc: 'Audiência próxima a PDVs onde sua marca já lidera. Foco: aumentar consumo de clientes recorrentes.',
      color: 'blue' },
    { n: '03', icon: IconGrid, title: 'Cross-sell em SKUs',
      desc: 'Audiência a partir de places com maior correlação entre produtos. Foco: vendas cruzadas.',
      color: 'cyan' },
    { n: '04', icon: IconBroadcast, title: 'Trade em PDVs',
      desc: 'Audiência baseada em ativações de trade. Foco: canais com parcerias estratégicas.',
      color: 'blue' },
  ];
  return (
    <section id="estrategias" ref={ref} className="relative bg-white text-ink py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <SectionLabel dark label="05 / ESTRATÉGIAS" />
            <h2 className="reveal delay-1 mt-6 text-[36px] md:text-[56px] font-light leading-[1.02] tracking-[-0.02em] max-w-3xl">
              Uma arquitetura que impacta em <span className="font-semibold">receita incremental.</span>
            </h2>
          </div>
          <div className="reveal delay-2 text-[13px] text-ink/60 max-w-xs">
            Quatro abordagens para construir audiências que movem a agulha no PDV.
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {strats.map((s, i) => (
            <div key={s.n} className={"reveal delay-" + Math.min(4, i+1) +
              " relative bg-ink/[0.03] border border-ink/10 rounded-2xl p-7 hover:border-brand-600/40 hover:bg-ink/[0.06] transition-all group"}>
              <div className="flex items-center justify-between mb-10">
                <span className="text-[11px] font-mono text-ink/50 tracking-[0.2em]">ESTRATÉGIA {s.n}</span>
                <s.icon className={s.color === 'cyan' ? "text-brand-500" : "text-brand-600"} width="24" height="24" />
              </div>
              <div className="text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink mb-3">{s.title}</div>
              <p className="text-[13.5px] text-ink/70 leading-relaxed">{s.desc}</p>
              <div className="mt-8 pt-6 border-t border-ink/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-ink/50 tracking-[0.15em]">FOCO</span>
                <IconArrowUpRight className="text-ink/40 group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" width="18" height="18" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CTA ----------
function CTA() {
  const ref = useReveal();
  return (
    <section id="cta" ref={ref} className="relative grid-bg py-32 md:py-48 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] glow-blue pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-cyan pointer-events-none opacity-70" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 text-center">
        <div className="reveal text-[11px] uppercase tracking-[0.35em] text-brand-500 mb-8">
          Pronto para começar?
        </div>
        <h2 className="reveal delay-1 text-[44px] md:text-[80px] lg:text-[104px] font-light leading-[0.98] tracking-[-0.035em]">
          O próximo grande passo
          <span className="block font-semibold">da sua marca.</span>
        </h2>
        <p className="reveal delay-2 mt-8 text-[16px] md:text-[18px] text-mute max-w-xl mx-auto leading-relaxed">
          Meça o impacto real da mídia no ponto de venda. Transforme cada transação em inteligência acionável.
        </p>
        <div className="reveal delay-3 mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="mailto:contato@groundflow.com.br" className="btn-primary inline-flex items-center gap-2 px-7 py-4 rounded-full bg-brand-500 text-ink font-medium text-[15px]">
            Agende uma demo
            <IconArrowRight width="18" height="18" strokeWidth="2" />
          </a>
          <a href="mailto:contato@groundflow.com.br" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/15 text-white hover:bg-white/5 transition-colors text-[15px]">
            Fale com um especialista
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- FOOTER ----------
function Footer() {
  return (
    <footer className="bg-ink border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="mb-3">
              <IconLogo style={{ height: '28px' }} />
            </div>
            <p className="text-mute text-[14px] max-w-sm leading-relaxed">
              From transaction <IconArrowRight width="14" height="14" className="inline align-middle text-brand-500" /> into investments.
            </p>
            <p className="text-mute/60 text-[13px] max-w-sm mt-4 leading-relaxed">
              A camada de medição de vendas reais para a indústria de bens de consumo.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-mute/60 mb-4">Produto</div>
            <ul className="space-y-2 text-[13.5px] text-white/80">
              <li><a href="#solucao" className="hover:text-brand-500">Solução</a></li>
              <li><a href="#como-funciona" className="hover:text-brand-500">Como funciona</a></li>
              <li><a href="#casos" className="hover:text-brand-500">Casos de uso</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-mute/60 mb-4">Empresa</div>
            <ul className="space-y-2 text-[13.5px] text-white/80">
              <li><a href="#" className="hover:text-brand-500">Sobre</a></li>
              <li><a href="#" className="hover:text-brand-500">Blog</a></li>
              <li><a href="#" className="hover:text-brand-500">Carreiras</a></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-mute/60 mb-4">Contato</div>
            <ul className="space-y-2 text-[13.5px] text-white/80">
              <li>contato@groundflow.com.br</li>
              <li>São Paulo · Brasil</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row gap-3 justify-between text-[12px] text-mute/60">
          <div>© 2026 GroundFlow · Todos os direitos reservados</div>
          <div className="font-mono tracking-[0.2em]">#181C28 · #24BDEF · #126CF9</div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════
function App() {
  return (
    <div>
      <Nav />
      <Hero />
      <ContextBar />
      <Problema />
      <Solucao />
      <ComoFunciona />
      <Casos />
      <Estrategias />
      <CTA />
      <Footer />
    </div>
  );
}


export default App
