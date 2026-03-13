'use client';

import { motion } from 'framer-motion';

interface TiketItem {
  id: string;
  judul: string;
  deskripsi: string;
  gambar: string | null;
  link: string;
}

interface Props {
  tiket: TiketItem[] | null;
}

export default function Tiket({ tiket }: Props) {
  return (
    <section
      id="tiket"
      className="py-32 px-6 scroll-mt-20 bg-muted/20 dark:bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Ornamen Background Halus */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 text-brand bg-brand/10 px-4 py-1.5 rounded-full border border-brand/20">
            Road to 165
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-5 tracking-tight">
            Pesan Tiket Konser
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto font-medium">
            Pilih kategori tiket konser dari berbagai kota yang sesuai sebelum kehabisan.
          </p>
        </motion.div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiket?.map((item, i) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group h-full"
            >
              {/* Glow Layer */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40
                           transition-opacity duration-700 blur-2xl -z-10 scale-[0.98]"
                style={{ background: 'var(--brand)' }}
              />

              {/* Card Main Container */}
              <div
                className="relative flex flex-col h-full rounded-2xl border overflow-hidden
                           transition-all duration-500
                           group-hover:-translate-y-1.5 group-hover:border-brand/40
                           bg-card border-border/50
                           dark:bg-[oklch(0.18_0_0)] dark:border-[oklch(0.985_0_0_/_8%)]
                           dark:group-hover:border-brand/40 shadow-sm hover:shadow-2xl hover:shadow-brand/10"
              >
                {/* Image Container (Dikembalikan ke layout Fit edge-to-edge asli) */}
                {item.gambar ? (
                  <div className="w-full overflow-hidden bg-muted dark:bg-[oklch(0.22_0_0)] relative">
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="w-full py-12 flex items-center justify-center text-5xl bg-muted dark:bg-[oklch(0.22_0_0)]">
                    <span className="opacity-20 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">🎟</span>
                  </div>
                )}

                {/* Konten & Teks */}
                <div className="flex flex-col flex-1 gap-3 p-6 bg-card z-20">
                  <h3 className="text-xl font-heading font-bold text-foreground leading-tight group-hover:text-brand transition-colors duration-300">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 font-medium">
                    {item.deskripsi}
                  </p>

                  {/* Glossy CTA Button */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative mt-4 flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95"
                    style={{ 
                      background: 'var(--brand)', 
                      color: 'var(--brand-foreground)',
                      boxShadow: '0 8px 20px -8px var(--brand)'
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Beli Tiket
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                    {/* Efek kilauan putih saat di-hover */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                  </a>
                </div>
              </div>

            </motion.div>
          ))}

          {/* EMPTY STATE */}
          {(!tiket || tiket.length === 0) && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="col-span-full flex flex-col items-center justify-center gap-4 text-center py-24 rounded-3xl border border-dashed border-border/60 bg-muted/30"
            >
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-2">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground">Tiket Belum Tersedia</h3>
              <p className="text-muted-foreground text-sm font-medium max-w-sm">
                Penjualan tiket akan segera dibuka. Pantau terus halaman ini atau ikuti media sosial kami untuk informasi terbaru!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}