'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ColorBends from '@/components/ui/ColorBends';

// Countdown to Oct 7, 2026
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

function CountdownUnit({ value, label, mounted }: { value: number; label: string; mounted: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 w-16 sm:w-24">
      <span className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums leading-none text-foreground font-heading">
        {mounted ? String(value).padStart(2, '0') : '00'}
      </span>
      <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-8 sm:h-12 bg-border/50 flex-shrink-0" />;
}

export default function Hero() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const colors = isDark
    ? { colorOne: '#0f172a', colorTwo: '#1e1b4b', colorThree: '#0c1a2e' }
    : { colorOne: '#dbeafe', colorTwo: '#ede9fe', colorThree: '#fce7f3' };

  const countdown = useCountdown(new Date('2026-10-07T19:00:00'));

  // ─── FUNGSI SMOOTH SCROLL ───
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault(); // Mencegah lompatan kasar bawaan HTML
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' }); // Meluncur perlahan ke section tujuan
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full opacity-80 transition-opacity duration-1000">
        {mounted && <ColorBends {...colors} className="w-full h-full" />}
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)'
            : 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.9) 100%)',
        }}
      />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-28 sm:pt-32 pb-12 sm:pb-16 w-full flex flex-col items-center">
        <div className="flex justify-center mb-6 sm:mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-border/50 bg-background/40 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse shadow-[0_0_8px_var(--brand)]" style={{ background: 'var(--brand)' }} />
            <span className="leading-none text-foreground/90">Berita, Jadwal Konser 65 Kota & Tiket</span>
          </span>
        </div>

        <h1 className="animate-fade-up mb-4 flex flex-col items-center drop-shadow-sm" style={{ animationDelay: '200ms' }}>
          <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-normal tracking-tight leading-tight text-foreground">
            HUT ke-165
          </span>
          <span
            className="block text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-heading font-black tracking-tighter leading-none mt-2 lg:mt-4 dark:text-white"
            style={{ 
              color: isDark ? 'white' : 'var(--brand)', 
              textShadow: isDark ? '0 0 40px rgba(255,255,255,0.3)' : 'none' 
            }}
          >
            HKBP
          </span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground/90 max-w-3xl mx-auto font-heading font-bold mb-10 sm:mb-12 animate-fade-up tracking-tight" style={{ animationDelay: '320ms' }}>
          Huria Kristen Batak Protestan
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-14 sm:mb-16 animate-fade-up w-full sm:w-auto" style={{ animationDelay: '460ms' }}>
          {/* ─── TOMBOL TIKET (DENGAN SMOOTH SCROLL) ─── */}
          <a
            href="#tiket"
            onClick={(e) => handleScroll(e, 'tiket')}
            className="group relative w-full sm:w-auto px-10 py-4 rounded-full text-sm sm:text-base font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-center overflow-hidden"
            style={{ background: 'var(--brand)', color: 'var(--brand-foreground)', boxShadow: '0 10px 30px -10px var(--brand)' }}
          >
            <span className="relative z-10">Jadwal & Tiket Konser 65 Kota</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </a>
          
          {/* ─── TOMBOL BERITA (DENGAN SMOOTH SCROLL) ─── */}
          <a
            href="#berita"
            onClick={(e) => handleScroll(e, 'berita')}
            className="w-full sm:w-auto px-10 py-4 rounded-full text-sm sm:text-base font-semibold border border-border/60 bg-background/50 text-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-background/80 backdrop-blur-md text-center"
          >
            Berita Terkini
          </a>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '560ms' }}>
          <p className="text-sm sm:text-base md:text-lg font-black tracking-[0.25em] uppercase text-foreground mb-6 drop-shadow-sm">
            Road to 165
          </p>
          <div className="inline-flex items-center justify-center gap-2 sm:gap-6 md:gap-8 px-6 sm:px-12 py-5 sm:py-8 rounded-3xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl max-w-full">
            <CountdownUnit mounted={mounted} value={countdown.days}    label="Hari" />
            <Divider />
            <CountdownUnit mounted={mounted} value={countdown.hours}   label="Jam" />
            <Divider />
            <CountdownUnit mounted={mounted} value={countdown.minutes} label="Menit" />
            <Divider />
            <CountdownUnit mounted={mounted} value={countdown.seconds} label="Detik" />
          </div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none hidden sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="w-[1px] h-12 bg-border/50 relative overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-brand"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}