'use client';
import { useEffect, useRef, useState } from 'react';

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className} style={{
      opacity: 0, transform: 'translateY(24px)',
      transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)',
    }}>{children}</div>
  );
}

const concerts = [
  { no: 1,  city: 'Surabaya',     date: '2026-02-13', display: "Jum'at, 13 Feb 2026",  venue: 'MPH Ciputra World',      region: 'Jawa Timur'         },
  { no: 2,  city: 'Semarang',     date: '2026-02-15', display: 'Minggu, 15 Feb 2026',  venue: 'MAC Semarang',           region: 'Jawa Tengah'        },
  { no: 3,  city: 'Bandung',      date: '2026-02-17', display: 'Selasa, 17 Feb 2026',  venue: 'Harris Convention Hall', region: 'Jawa Barat'         },
  { no: 4,  city: 'Jakarta',      date: '2026-02-19', display: 'Kamis, 19 Feb 2026',   venue: 'Smesco Convention',      region: 'DKI Jakarta'        },
  { no: 5,  city: 'Palangkaraya', date: '2026-04-10', display: "Jum'at, 10 Apr 2026",  venue: 'Segera diumumkan',       region: 'Kalimantan Tengah'  },
  { no: 6,  city: 'Banjarbaru',   date: '2026-04-12', display: 'Minggu, 12 Apr 2026',  venue: 'Auditorium ULM',         region: 'Kalimantan Selatan' },
  { no: 7,  city: 'IKN',          date: '2026-04-16', display: 'Kamis, 16 Apr 2026',   venue: 'Segera diumumkan',       region: 'Kalimantan Timur'   },
  { no: 8,  city: 'Balikpapan',   date: '2026-04-17', display: 'Sabtu, 17 Apr 2026',   venue: 'Segera diumumkan',       region: 'Kalimantan Timur'   },
  { no: 9,  city: 'Pontianak',    date: '2026-04-19', display: 'Minggu, 19 Apr 2026',  venue: 'Segera diumumkan',       region: 'Kalimantan Barat'   },
  { no: 10, city: 'Bogor',        date: '2026-05-01', display: "Jum'at, 1 Mei 2026",   venue: 'Segera diumumkan',       region: 'Jawa Barat'         },
  { no: 11, city: 'Bekasi',       date: '2026-05-02', display: 'Sabtu, 2 Mei 2026',    venue: 'Segera diumumkan',       region: 'Jawa Barat'         },
  { no: 12, city: 'Tangerang',    date: '2026-05-03', display: 'Minggu, 3 Mei 2026',   venue: 'Segera diumumkan',       region: 'Banten'             },
];

function getStatus(dateStr: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr); d.setHours(0,0,0,0);
  if (d < today) return 'done';
  if (d.getTime() === today.getTime()) return 'today';
  return 'upcoming';
}

const regionColors: Record<string, string> = {
  'Jawa Timur':           '#3b82f6',
  'Jawa Tengah':          '#8b5cf6',
  'Jawa Barat':           '#10b981',
  'DKI Jakarta':          '#f59e0b',
  'Banten':               '#06b6d4',
  'Kalimantan Tengah':    '#ef4444',
  'Kalimantan Selatan':   '#f97316',
  'Kalimantan Timur':     '#84cc16',
  'Kalimantan Barat':     '#ec4899',
};

export default function ConcertSchedule() {
  const [filter, setFilter]   = useState<'all' | 'upcoming' | 'done'>('all');
  const [hovered, setHovered] = useState<number | null>(null);

  const upcomingCount = concerts.filter(c => getStatus(c.date) !== 'done').length;
  const doneCount     = concerts.length - upcomingCount;

  const filtered = concerts.filter(c => {
    if (filter === 'all') return true;
    const s = getStatus(c.date);
    if (filter === 'upcoming') return s === 'upcoming' || s === 'today';
    return s === 'done';
  });

  return (
    <section id="jadwal" className="py-32 px-6 scroll-mt-20 bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-5"
              style={{ color: 'var(--brand)' }}>
              Anak ni Raja Production × HKBP
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5">
              Konser Road to 165
            </h2>
            <p className="max-w-xl mx-auto leading-relaxed text-sm md:text-base text-muted-foreground">
              Charity concert di{' '}
              <span className="text-foreground font-semibold">165 kota</span>{' '}
              Indonesia &amp; luar negeri. Seluruh hasil disumbangkan untuk Puncak HUT ke-165 HKBP, Oktober 2026.
            </p>
          </div>
        </Reveal>

        {/* Filter pills */}
        <Reveal delay={120}>
          <div className="flex justify-center gap-2 mb-12">
            {([
              { key: 'all',      label: `Semua · ${concerts.length}` },
              { key: 'upcoming', label: `Akan Datang · ${upcomingCount}` },
              { key: 'done',     label: `Selesai · ${doneCount}` },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-5 py-2 rounded-full text-xs font-semibold border transition-all duration-300"
                style={filter === f.key
                  ? { background: 'var(--brand)', color: 'var(--brand-foreground)', borderColor: 'var(--brand)' }
                  : { background: 'transparent', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => {
            const status  = getStatus(c.date);
            const isDone  = status === 'done';
            const isToday = status === 'today';
            const isHover = hovered === c.no && !isDone;
            const col     = regionColors[c.region] ?? '#94a3b8';

            return (
              <Reveal key={c.no} delay={i * 60}>
                <div
                  onMouseEnter={() => !isDone && setHovered(c.no)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative rounded-2xl flex flex-col gap-5 p-7 h-full overflow-hidden"
                  style={{
                    background: 'var(--card)',
                    border: `1px solid ${isHover ? `${col}50` : 'var(--border)'}`,
                    transform: isHover ? 'translateY(-4px)' : 'none',
                    opacity: isDone ? 0.45 : 1,
                    boxShadow: isHover ? `0 0 0 1px ${col}25, 0 12px 40px ${col}20` : 'none',
                    cursor: isDone ? 'default' : 'pointer',
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), border-color 0.8s ease, box-shadow 0.8s ease, opacity 0.3s ease',
                  }}
                >
                  {/* Lamp glow — radial from top, brighter */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${col}35 0%, transparent 65%)`,
                      opacity: isHover ? 1 : 0,
                      transition: 'opacity 1s ease',
                    }}
                  />

                  {/* Number + status */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-bold tabular-nums select-none text-muted-foreground/30">
                      {String(c.no).padStart(2, '0')}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1
                                       rounded-full animate-pulse"
                        style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}>
                        Hari Ini
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-medium text-muted-foreground/40">
                        Selesai ✓
                      </span>
                    )}
                  </div>

                  {/* City + date */}
                  <div className="flex flex-col gap-1.5 relative z-10">
                    <h3
                      className="text-xl font-bold leading-tight"
                      style={{
                        color: isHover ? 'var(--foreground)' : 'var(--foreground)',
                        opacity: isHover ? 1 : 0.85,
                        transition: 'opacity 0.6s ease',
                      }}
                    >
                      {c.city}
                    </h3>
                    <p className="text-sm text-muted-foreground">{c.display}</p>
                  </div>

                  {/* Region pill — slides in on hover */}
                  <div className="relative z-10" style={{
                    maxHeight: isHover ? '32px' : '0px',
                    opacity: isHover ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.5s ease, opacity 0.5s ease',
                  }}>
                    <span
                      className="inline-block text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full"
                      style={{ background: `${col}20`, color: col }}
                    >
                      {c.region}
                    </span>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center gap-2 mt-auto pt-5 border-t border-border relative z-10">
                    <svg className="w-3 h-3 text-muted-foreground/40 flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span className="text-xs text-muted-foreground">{c.venue}</span>
                  </div>

                  {/* Bottom accent line */}
                  {!isDone && (
                    <div
                      className="absolute bottom-0 left-0 h-[1.5px] rounded-b-2xl"
                      style={{
                        width: isHover ? '100%' : '0%',
                        background: `linear-gradient(to right, transparent, ${col}, transparent)`,
                        transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Footer note */}
        <Reveal delay={200}>
          <p className="text-center text-sm italic mt-14 text-muted-foreground">
            Kota-kota berikutnya akan terus diumumkan. Mari dukung &amp; doakan. Tuhan memberkati
          </p>
        </Reveal>

      </div>
    </section>
  );
}