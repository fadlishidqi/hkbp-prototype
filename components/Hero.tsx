'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import ColorBends from '@/components/ColorBends';

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
  }, []);
  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tabular-nums leading-none text-foreground">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.12em] sm:tracking-[0.15em] uppercase text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-6 sm:h-8 bg-border flex-shrink-0" />;
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

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ColorBends bg */}
      <div className="absolute inset-0 w-full h-full">
        {mounted && <ColorBends {...colors} className="w-full h-full" />}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 100%)'
            : 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(255,255,255,0.55) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-24 sm:pt-28 pb-16 sm:pb-20 w-full">

        {/* Eyebrow */}
        <div className="flex justify-center mb-4 sm:mb-6 animate-fade-up" style={{ animationDelay: '0ms' }}>
          <span
            className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold
                       tracking-[0.15em] sm:tracking-[0.2em] uppercase
                       px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border
                       bg-background/60 backdrop-blur-sm text-muted-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: 'var(--brand)' }} />
            <span className="leading-none">7 Oktober 2026 · Konser Perayaan</span>
          </span>
        </div>

        {/* Year badge */}
        <div className="flex justify-center mb-4 sm:mb-5 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <span
            className="text-[11px] sm:text-[13px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase px-4 sm:px-5 py-1.5 rounded-full"
            style={{
              background: 'var(--brand)',
              color: 'var(--brand-foreground)',
            }}
          >
            1861 — 2026
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="animate-fade-up mb-3"
          style={{ animationDelay: '200ms' }}
        >
          <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none text-foreground">
            HUT ke-165
          </span>
          <span
            className="block text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none mt-1"
            style={{ color: 'var(--brand)' }}
          >
            HKBP
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-xs sm:max-w-xl mx-auto font-light mb-6 sm:mb-4 animate-fade-up"
          style={{ animationDelay: '320ms' }}
        >
          Huria Kristen Batak Protestan
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 animate-fade-up"
          style={{ animationDelay: '460ms' }}
        >
          <a
            href="#tiket"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full text-sm font-bold
                       transition-all duration-200 hover:scale-105 hover:opacity-90 shadow-lg text-center"
            style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}
          >
            Dapatkan Tiket Sekarang
          </a>
          <a
            href="#about"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full text-sm font-semibold
                       border border-border bg-background/70 text-foreground
                       transition-all duration-200 hover:scale-105 backdrop-blur-sm text-center"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>

        {/* Countdown */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: '560ms' }}
        >
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-muted-foreground mb-4 sm:mb-5">
            Hitung Mundur Menuju 7 Oktober
          </p>
          {/* Responsive countdown: tighter on mobile */}
          <div
            className="inline-flex items-center gap-3 sm:gap-6 md:gap-10
                       px-4 sm:px-8 py-3.5 sm:py-5 rounded-2xl border border-border
                       bg-background/60 backdrop-blur-md max-w-full"
          >
            <CountdownUnit value={countdown.days}    label="Hari" />
            <Divider />
            <CountdownUnit value={countdown.hours}   label="Jam" />
            <Divider />
            <CountdownUnit value={countdown.minutes} label="Menit" />
            <Divider />
            <CountdownUnit value={countdown.seconds} label="Detik" />
          </div>
        </div>
      </div>
    </section>
  );
}