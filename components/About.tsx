"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Church, Clock, Trophy, Quote, MapPin, Star, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Types ── */
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

/* ── Data ── */
const milestones: Milestone[] = [
  { year: "1861", text: "HKBP didirikan pada 7 Oktober di Sipirok oleh empat misionaris RMG.", icon: MapPin },
  { year: "1881", text: "Ludwig Nommensen diangkat sebagai Ephorus pertama HKBP.", icon: Star },
  { year: "1930", text: "Sinode Godang — HKBP diakui sebagai gereja mandiri, lepas dari RMG.", icon: Church },
  { year: "1952", text: "HKBP bergabung dengan Federasi Lutheran Sedunia (LWF) di Jenewa.", icon: Globe },
  { year: "2026", text: "165 tahun — lebih dari 6,5 juta jemaat di seluruh dunia.", icon: Flame, highlight: true },
];

const stats: Stat[] = [
  { value: "6.5 Jt+", label: "Jemaat di Dunia",                 icon: Globe },
  { value: "3.800+",  label: "Gereja di Indonesia",             icon: Church },
  { value: "165",     label: "Tahun Pelayanan",                 icon: Clock },
  { value: "#1",      label: "Gereja Protestan Terbesar Indonesia", icon: Trophy },
];

/* ── Helper Component: Number Counter ── */
function CountUp({ target }: { target: string }) {
  const [n, setN] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const num = parseFloat(target.replace(/[^0-9.]/g, ""));
  const ok  = !isNaN(num) && num > 1;

  useEffect(() => {
    if (!hasRun || !ok) return;
    let cur = 0;
    const inc = num / (1600 / 16); 
    const t = setInterval(() => {
      cur += inc;
      if (cur >= num) { setN(num); clearInterval(t); }
      else setN(Math.floor(cur * 10) / 10);
    }, 16);
    return () => clearInterval(t);
  }, [hasRun, num, ok]);

  if (!ok) return <span>{target}</span>;
  
  const suf  = target.replace(/[0-9.]/g, "");
  const disp = n % 1 === 0 ? n.toLocaleString("id") : n.toFixed(1).replace(".", ",");
  
  return (
    <motion.span 
      onViewportEnter={() => setHasRun(true)} 
      viewport={{ once: true }}
    >
      {disp}{suf}
    </motion.span>
  );
}

/* ── Main Component ── */
export default function About() {
  // IMPROVEMENT: Deteksi Scroll untuk efek Parallax
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Kolom Kiri bergeser sedikit ke atas, Kolom Kanan bergeser sedikit ke bawah (Efek Kedalaman)
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const yRight = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={containerRef} id="about" className="py-20 sm:py-32 px-4 sm:px-6 scroll-mt-20 overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[680px] mb-12"
        >
          <div className="inline-flex items-center gap-2 px-[14px] py-[5px] rounded-full bg-brand/10 border border-brand/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
            <span className="text-[10px] font-bold tracking-[0.18em] text-brand uppercase">
              Tentang HKBP
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight mb-4 sm:mb-6 text-foreground">
            165 Tahun Iman dan Pelayanan
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Huria Kristen Batak Protestan adalah gereja Protestan terbesar di Indonesia,
            didirikan tahun 1861 di tanah Batak. Di usia ke-165, kami merayakan
            perjalanan iman ini dengan menyelenggarakan serangkaian kegiatan dan tur konser di 65 kota.
          </p>
        </motion.div>

        {/* GRID CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-start">

          {/* TIMELINE (Kiri) - Dibungkus dengan motion.div untuk Parallax */}
          <motion.div style={{ y: yLeft }} className="relative pl-8">
            <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-border rounded-full" />
            
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-[9px] top-2 w-[2px] bg-brand rounded-full shadow-[0_0_8px_var(--brand)] origin-top"
            />

            <div className="flex flex-col gap-8">
              {milestones.map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div 
                    key={m.year} 
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45, delay: i * 0.2 }}
                    className="relative flex items-start gap-4 group"
                  >
                    <div className={`relative z-10 flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-all duration-400
                      ${m.highlight 
                        ? "w-[22px] h-[22px] -ml-[2px] bg-brand border-brand shadow-[0_0_14px_var(--brand)]" 
                        : "w-[18px] h-[18px] ml-0 bg-background border-border group-hover:border-brand"}`}
                    >
                      <Icon 
                        size={m.highlight ? 11 : 9} 
                        className={m.highlight ? "text-background" : "text-brand opacity-0 group-hover:opacity-100 transition-opacity"} 
                        strokeWidth={2.5} 
                      />
                    </div>

                    <div className="pt-[1px]">
                      <span className={`text-[10px] font-bold tracking-[0.18em] uppercase ${m.highlight ? "text-brand opacity-100" : "text-brand opacity-75"}`}>
                        {m.year}
                      </span>
                      <p className={`mt-[3px] text-[13px] leading-[1.65] ${m.highlight ? "text-foreground font-medium" : "text-muted-foreground font-normal"}`}>
                        {m.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* STATS + QUOTE (Kanan) - Dibungkus dengan motion.div untuk Parallax */}
          <motion.div style={{ y: yRight }} className="flex flex-col gap-4">
            
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-[16px] bg-card border border-border p-[16px_14px] hover:border-brand hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-250 cursor-default"
                >
                  <div className="absolute -top-[20px] -right-[20px] w-[80px] h-[80px] bg-brand opacity-5 group-hover:opacity-10 rounded-full blur-[18px] transition-opacity duration-250" />
                  <s.icon size={18} className="text-brand mb-2 opacity-85" />
                  <h3 className="text-[22px] font-extrabold text-brand mb-0 leading-none font-heading">
                    <CountUp target={s.value} />
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium mt-[5px] leading-[1.4]">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}