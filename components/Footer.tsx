'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-background border-t border-border/50 pt-20 pb-8 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* TOP SECTION: Info, Links, Socials */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 items-start">
          
          {/* Kolom 1: Logo & Deskripsi (Span 5) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="#home" className="flex items-center gap-4 group w-fit">
              <div className="relative overflow-hidden rounded-full bg-muted/30 p-2">
                <Image 
                  src="/Logo-HKBP.png" 
                  alt="Logo HKBP" 
                  width={96} 
                  height={96} 
                  className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  HKBP
                </span>
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-1 text-brand">
                  165 Tahun
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
              Merayakan 165 tahun perjalanan iman Huria Kristen Batak Protestan melalui serangkaian kegiatan, berita, dan tur konser di 65 kota.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat (Span 3) */}
          <div className="md:col-start-8 md:col-span-2 flex flex-col gap-5">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">
              Eksplorasi
            </h4>
            <nav className="flex flex-col gap-3">
              {['Beranda', 'Tentang', 'Jadwal', 'Berita', 'Tiket'].map((item) => (
                <Link 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-brand transition-colors w-fit font-medium flex items-center gap-2 group"
                >
                  <span className="w-0 h-[1.5px] bg-brand group-hover:w-3 transition-all duration-300" />
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kolom 3: Sosial Media (Span 2) */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">
              Ikuti Kami
            </h4>
            <nav className="flex flex-col gap-3">
              {['Instagram', 'YouTube', 'Facebook'].map((item) => (
                <a 
                  key={item} 
                  href="#"
                  className="text-sm text-muted-foreground hover:text-brand transition-colors w-fit font-medium flex items-center gap-2 group"
                >
                  {item}
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground/60 pt-8 border-t border-border/40">
          <p>&copy; {new Date().getFullYear()} Huria Kristen Batak Protestan. Hak Cipta Dilindungi.</p>
        </div>

      </div>
    </footer>
  );
}