'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BeritaItem {
  id: string;
  judul: string;
  slug: string;
  tanggal: string;
  gambar_cover: string | null;
  konten: any;
}

interface Props {
  berita: BeritaItem[] | null;
}

// Hydration-Safe Date Formatter (Mencegah Error Perbedaan Waktu Server vs Client)
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function Berita({ berita }: Props) {
  return (
    <section id="berita" className="py-32 px-6 scroll-mt-20 bg-muted/5 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
        >
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 text-brand">
              Blog &amp; Berita
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
              Berita Terbaru
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed font-medium">
            Informasi terkini seputar persiapan peringatan HUT ke-165, kegiatan panitia, serta kabar seputar tur dari berbagai kota.
          </p>
        </motion.div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {berita?.map((item, i) => {
            const firstTextBlok = Array.isArray(item.konten)
              ? item.konten.find((b: any) => b.type === 'text')
              : null;
            const cuplikan = firstTextBlok?.content ?? 'Lihat detail berita ini selengkapnya...';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link
                  href={`/berita/${item.slug}`}
                  className="group block bg-card text-card-foreground rounded-2xl border border-border/60
                             overflow-hidden transition-all duration-500
                             hover:border-brand/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_var(--brand-muted)] h-full flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden w-full h-52 bg-muted/30">
                    {/* Overlay Halus agar gambar terlihat lebih premium (vignette atas-bawah) */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {item.gambar_cover ? (
                      <img
                        src={item.gambar_cover}
                        alt={item.judul}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-20 transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">📰</span>
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-7 flex flex-col flex-1 relative bg-card z-20">
                    <time className="text-[11px] font-bold text-brand uppercase tracking-[0.15em] mb-3 inline-block">
                      {formatDate(item.tanggal)}
                    </time>
                    
                    <h3 className="text-xl font-heading font-bold mb-3 line-clamp-2 leading-snug group-hover:text-brand transition-colors duration-300">
                      {item.judul}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 font-medium">
                      {cuplikan}
                    </p>
                    
                    {/* Interaksi "Baca Selengkapnya" */}
                    <div 
                      className="mt-auto pt-4 border-t border-border/50 flex items-center gap-2 text-sm font-bold opacity-90 group-hover:opacity-100 transition-all duration-300"
                      style={{ color: 'var(--brand)' }} // <-- Kunci perbaikannya di sini
                    >
                      Baca Selengkapnya
                      <svg 
                        className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1.5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* EMPTY STATE */}
          {(!berita || berita.length === 0) && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-3 text-center py-20 px-6 text-muted-foreground bg-muted/40 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center gap-4"
            >
              <span className="text-4xl opacity-50">📝</span>
              <p className="font-medium text-lg">Belum ada berita yang dipublikasikan.</p>
              <p className="text-sm opacity-70">Nantikan pembaruan terbaru seputar persiapan HUT ke-165 HKBP.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}