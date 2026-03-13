"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import { Globe, Church, Clock, Trophy, Quote, MapPin, Star, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── types ── */
interface Milestone {
  year: string;
  text: string;
  icon: LucideIcon;
  highlight?: boolean;
}
interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}
interface StatCardProps {
  s: Stat;
  run: boolean;
  delay: number;
}
interface CountUpProps {
  target: string;
  run: boolean;
}

/* ── data ── */
const milestones: Milestone[] = [
  { year: "1861", text: "HKBP didirikan pada 7 Oktober di Sipirok oleh empat misionaris RMG.", icon: MapPin },
  { year: "1881", text: "Ludwig Nommensen diangkat sebagai Ephorus pertama HKBP.", icon: Star },
  { year: "1930", text: "Sinode Godang — HKBP diakui sebagai gereja mandiri, lepas dari RMG.", icon: Church },
  { year: "1952", text: "HKBP bergabung dengan Federasi Lutheran Sedunia (LWF) di Jenewa.", icon: Globe },
  { year: "2026", text: "165 tahun — lebih dari 6,5 juta jemaat di seluruh dunia.", icon: Flame, highlight: true },
];
const stats: Stat[] = [
  { value: "6.5 Jt+", label: "Jemaat di Dunia",                   icon: Globe  },
  { value: "3.800+",  label: "Gereja di Indonesia",                icon: Church },
  { value: "165",     label: "Tahun Pelayanan",                    icon: Clock  },
  { value: "#1",      label: "Gereja Protestan Terbesar Indonesia", icon: Trophy },
];

/* ── helpers ── */
function useInView(threshold = 0.15): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, vis];
}

function CountUp({ target, run }: CountUpProps) {
  const [n, setN] = useState(0);
  const num = parseFloat(target.replace(/[^0-9.]/g, ""));
  const ok  = !isNaN(num) && num > 1;
  useEffect(() => {
    if (!run || !ok) return;
    let cur = 0;
    const inc = num / (1600 / 16);
    const t = setInterval(() => {
      cur += inc;
      if (cur >= num) { setN(num); clearInterval(t); }
      else setN(Math.floor(cur * 10) / 10);
    }, 16);
    return () => clearInterval(t);
  }, [run]);
  if (!ok) return <span>{target}</span>;
  const suf  = target.replace(/[0-9.]/g, "");
  const disp = n % 1 === 0 ? n.toLocaleString("id") : n.toFixed(1).replace(".", ",");
  return <span>{disp}{suf}</span>;
}

function StatCard({ s, run, delay }: StatCardProps) {
  const Icon = s.icon;
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        opacity:   run ? 1 : 0,
        transform: run ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms,
                     border-color .25s, box-shadow .25s`,
        background: "var(--card)",
        border:     `1px solid ${hov ? "var(--brand)" : "var(--border)"}`,
        borderRadius: 20,
        padding: "22px 18px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        boxShadow: hov ? "0 12px 40px rgba(0,0,0,.15)" : "none",
      }}
    >
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80,
        background: "var(--brand)",
        opacity: hov ? 0.08 : 0.04,
        borderRadius: "50%",
        filter: "blur(18px)",
        transition: "opacity .25s",
      }} />
      <Icon size={20} color="var(--brand)" style={{ marginBottom: 10, opacity: .85 }} />
      <p style={{ fontSize: 28, fontWeight: 800, color: "var(--brand)", margin: 0, lineHeight: 1 }}>
        <CountUp target={s.value} run={run} />
      </p>
      <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6, lineHeight: 1.4, fontWeight: 500 }}>
        {s.label}
      </p>
    </div>
  );
}

/* ── main ── */
export default function About() {
  const [headerRef, headerVis] = useInView();
  const [tlRef,     tlVis]     = useInView(0.1);
  const [statsRef,  statsVis]  = useInView();

  const [revealed, setRevealed] = useState(-1);
  const [linePct,  setLinePct]  = useState(0);

  const STEP_DELAY    = 600;
  const LINE_DURATION = 500;

  useEffect(() => {
    if (!tlVis) return;
    let step = 0;

    function showNext() {
      if (step >= milestones.length) return;
      const targetPct = (step / (milestones.length - 1)) * 100;
      const startPct  = step === 0 ? 0 : ((step - 1) / (milestones.length - 1)) * 100;
      const startTime = performance.now();

      function animLine(now: number) {
        const t    = Math.min((now - startTime) / LINE_DURATION, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setLinePct(startPct + (targetPct - startPct) * ease);
        if (t < 1) {
          requestAnimationFrame(animLine);
        } else {
          setRevealed(step);
          step++;
          if (step < milestones.length) setTimeout(showNext, STEP_DELAY);
        }
      }
      requestAnimationFrame(animLine);
    }

    setTimeout(showNext, 300);
  }, [tlVis]);

  return (
    <section id="about" className="py-32 px-6 scroll-mt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div ref={headerRef}>
          <div style={{
            opacity:   headerVis ? 1 : 0,
            transform: headerVis ? "translateY(0)" : "translateY(40px)",
            transition: "opacity .8s ease, transform .8s ease",
            maxWidth: 680, marginBottom: 72,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "color-mix(in srgb, var(--brand) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--brand) 30%, transparent)",
              borderRadius: 999, padding: "6px 16px", marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "var(--brand)", textTransform: "uppercase" }}>
                Tentang HKBP
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              165 Tahun Iman,{" "}
              <span style={{ color: "var(--brand)" }}>Satu Warisan Abadi</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Huria Kristen Batak Protestan adalah gereja Protestan terbesar di Indonesia,
              didirikan tahun 1861 di tanah Batak. Kini, di usia ke-165, kami merayakan
              perjalanan iman yang telah menyentuh jutaan jiwa.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* TIMELINE */}
          <div ref={tlRef}>
            <div style={{ position: "relative", paddingLeft: 36 }}>

              {/* track */}
              <div style={{
                position: "absolute", left: 11, top: 8, bottom: 8,
                width: 2, background: "var(--border)", borderRadius: 2,
              }} />
              {/* fill */}
              <div style={{
                position: "absolute", left: 11, top: 8,
                width: 2, borderRadius: 2,
                height: `calc(${linePct}% * ((100% - 16px) / 100%))`,
                background: "var(--brand)",
                boxShadow: "0 0 8px color-mix(in srgb, var(--brand) 50%, transparent)",
              }} />

              {milestones.map((m, i) => {
                const Icon = m.icon;
                const show = revealed >= i;
                return (
                  <div key={m.year} style={{
                    display: "flex", gap: 20, alignItems: "flex-start",
                    marginBottom: i < milestones.length - 1 ? 38 : 0,
                    opacity:   show ? 1 : 0,
                    transform: show ? "translateX(0)" : "translateX(-16px)",
                    transition: "opacity .45s ease, transform .45s ease",
                  }}>
                    {/* dot */}
                    <div style={{
                      position: "relative", zIndex: 2, flexShrink: 0,
                      width:  m.highlight ? 24 : 20,
                      height: m.highlight ? 24 : 20,
                      borderRadius: "50%",
                      background:   show ? (m.highlight ? "var(--brand)" : "var(--background)") : "var(--background)",
                      border: `2px solid ${show ? "var(--brand)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background .4s, border-color .4s, box-shadow .4s",
                      boxShadow: m.highlight && show
                        ? "0 0 14px color-mix(in srgb, var(--brand) 60%, transparent)"
                        : "none",
                      marginLeft: m.highlight ? -2 : 0,
                    }}>
                      <Icon
                        size={m.highlight ? 12 : 10}
                        color={show ? (m.highlight ? "var(--background)" : "var(--brand)") : "transparent"}
                        strokeWidth={2.5}
                      />
                    </div>

                    <div style={{ paddingTop: 2 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
                        color: "var(--brand)", textTransform: "uppercase",
                        opacity: m.highlight ? 1 : 0.75,
                      }}>
                        {m.year}
                      </span>
                      <p style={{
                        fontSize: 14,
                        color: m.highlight ? "var(--foreground)" : "var(--muted-foreground)",
                        margin: "4px 0 0", lineHeight: 1.65,
                        fontWeight: m.highlight ? 500 : 400,
                      }}>
                        {m.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STATS + QUOTE */}
          <div ref={statsRef} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {stats.map((s, i) => (
                <StatCard key={s.label} s={s} run={statsVis} delay={i * 100} />
              ))}
            </div>

            {/* quote */}
            <div style={{
              opacity:   statsVis ? 1 : 0,
              transform: statsVis ? "translateY(0)" : "translateY(20px)",
              transition: "opacity .7s ease 480ms, transform .7s ease 480ms",
              borderLeft: "3px solid var(--brand)",
              paddingLeft: 20, paddingTop: 16, paddingBottom: 16, paddingRight: 16,
              background: "color-mix(in srgb, var(--brand) 5%, transparent)",
              borderRadius: "0 14px 14px 0",
            }}>
              <Quote size={18} color="var(--brand)" style={{ marginBottom: 8, opacity: .6 }} />
              <p className="text-sm text-foreground italic leading-relaxed mb-3">
                HKBP terbuka bagi seluruh kelompok etnis dan bangsa, membawa terang
                Injil dari tanah Batak ke seluruh dunia.
              </p>
              <footer style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
                color: "var(--brand)", textTransform: "uppercase",
              }}>
                — Pengakuan Iman HKBP
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}