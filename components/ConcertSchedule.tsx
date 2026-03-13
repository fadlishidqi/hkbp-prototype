'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'done'>('upcoming');

  const upcomingCount = concerts.filter(c => getStatus(c.date) !== 'done').length;
  const doneCount     = concerts.length - upcomingCount;

  const filtered = concerts.filter(c => {
    if (filter === 'all') return true;
    const s = getStatus(c.date);
    if (filter === 'upcoming') return s === 'upcoming' || s === 'today';
    return s === 'done';
  });

  return (
    <section id="jadwal" className="py-32 px-6 scroll-mt-20 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-5 text-brand">
            Anak ni Raja Production × HKBP
          </span>
          {/* Implementasi font-heading untuk kesan megah */}
          <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-5">
            Konser Road to 165
          </h2>
          <p className="max-w-xl mx-auto leading-relaxed text-sm md:text-base text-muted-foreground">
            Charity concert di{' '}
            <span className="text-foreground font-semibold">165 kota</span>{' '}
            Indonesia &amp; luar negeri. Seluruh hasil disumbangkan untuk Puncak HUT ke-165 HKBP, Oktober 2026.
          </p>
        </motion.div>

        {/* FILTER PILLS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {([
            { key: 'all',      label: `Semua · ${concerts.length}` },
            { key: 'upcoming', label: `Akan Datang · ${upcomingCount}` },
            { key: 'done',     label: `Selesai · ${doneCount}` },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all duration-500
                ${filter === f.key 
                  ? 'bg-brand text-brand-foreground border-brand shadow-[0_4px_14px_0_var(--brand-muted)]' 
                  : 'bg-transparent text-muted-foreground border-border hover:border-brand/50 hover:text-foreground'}`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* CARDS GRID (Fluid Animation with AnimatePresence) */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => {
              const status  = getStatus(c.date);
              const isDone  = status === 'done';
              const isToday = status === 'today';
              const col     = regionColors[c.region] ?? '#94a3b8';

              return (
                <motion.div
                  layout // Ini yang membuat kartu bergeser mulus saat di-filter
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: i * 0.05 }} // Stagger cascade efek
                  key={c.no}
                  className={`group relative rounded-2xl flex flex-col gap-5 p-7 h-full overflow-hidden border transition-all duration-700
                    ${isDone ? 'bg-card/50 border-border/50 opacity-60 grayscale-[30%]' : 'bg-card border-border hover:-translate-y-1 hover:shadow-2xl cursor-pointer'}`}
                  style={{
                    // Inject custom property untuk efek hover glow CSS (lebih rapi dibanding inline JS event)
                    ['--card-color' as string]: col,
                  }}
                >
                  {/* Efek Pendaran Cahaya (Glow) saat di hover murni pakai Tailwind CSS */}
                  {!isDone && (
                    <div 
                      className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${col}25 0%, transparent 65%)` }}
                    />
                  )}

                  {/* Header Kartu (Nomor & Status) */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-bold tabular-nums select-none text-muted-foreground/30 transition-colors duration-500 group-hover:text-foreground/20">
                      {String(c.no).padStart(2, '0')}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full animate-pulse bg-brand text-brand-foreground shadow-sm">
                        Hari Ini
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-medium text-muted-foreground/50 bg-muted/50 px-3 py-1 rounded-full">
                        Selesai ✓
                      </span>
                    )}
                  </div>

                  {/* Konten Utama (Kota & Tanggal) */}
                  <div className="flex flex-col gap-1.5 relative z-10">
                    <h3 className="text-xl font-heading font-bold leading-tight text-foreground/90 group-hover:text-foreground transition-colors duration-500">
                      {c.city}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500">
                      {c.display}
                    </p>
                  </div>

                  {/* Badge Region (Slide Down dari nol saat di Hover) */}
                  {!isDone && (
                    <div className="relative z-10 grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 opacity-0 group-hover:opacity-100 mt-[-5px] group-hover:mt-0">
                      <div className="overflow-hidden">
                        <span 
                          className="inline-block text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full"
                          style={{ background: `${col}20`, color: col }}
                        >
                          {c.region}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Venue / Lokasi */}
                  <div className="flex items-center gap-2 mt-auto pt-5 border-t border-border/50 group-hover:border-border transition-colors duration-500 relative z-10">
                    <svg className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0 group-hover:text-[var(--card-color)] transition-colors duration-500"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground/80 transition-colors duration-500">
                      {c.venue}
                    </span>
                  </div>

                  {/* Garis Aksen Bawah (Meluas saat di-hover) */}
                  {!isDone && (
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-b-2xl w-0 group-hover:w-full transition-all duration-700 ease-in-out"
                      style={{ background: `linear-gradient(to right, transparent, ${col}, transparent)` }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* FOOTER NOTE */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <p className="text-center text-sm italic mt-14 text-muted-foreground font-medium">
            Kota-kota berikutnya akan terus diumumkan. Mari dukung &amp; doakan. Tuhan memberkati
          </p>
        </motion.div>

      </div>
    </section>
  );
}