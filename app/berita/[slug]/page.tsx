// app/berita/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function DetailBerita({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: berita } = await supabase
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!berita) notFound();

  const konten = typeof berita.konten === 'string'
    ? JSON.parse(berita.konten)
    : berita.konten;

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">

      {/* Top bar with back button */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl shadow-sm">
        {/* Bagian Navigasi & Judul Header (Lebih Lebar dan Lega) */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/#berita"
            className="inline-flex items-center gap-2.5 text-sm font-semibold
                       px-5 py-2.5 rounded-full border border-border/60
                       bg-muted/30 hover:bg-background hover:scale-105 transition-all duration-300
                       text-muted-foreground hover:text-foreground hover:border-[var(--brand)] hover:shadow-md"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali ke Beranda
          </Link>

          {/* Brand - Ukuran Diperbesar sesuai gaya Navbar Utama */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative overflow-hidden rounded-full drop-shadow-sm">
              <Image 
                src="/Logo-HKBP.png" 
                alt="Logo HKBP" 
                width={64} 
                height={64} 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
                HKBP
              </span>
              <span
                className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mt-1"
                style={{ color: 'var(--brand)' }}
              >
                165 Tahun
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero Section Berita - Estetika Megah */}
      <main className="min-h-screen">
        <article className="max-w-4xl mx-auto px-5 sm:px-8 pt-16 pb-24">
          
          {/* Metadata & Tag */}
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase bg-brand/10 text-brand border border-brand/20">
              Berita Terkini
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <time className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground/80">
              {new Date(berita.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>

          {/* Judul Artikel (Wajar & Proporsional Sesuai Request) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tight text-foreground mb-12 drop-shadow-sm">
            {berita.judul}
          </h1>

          {/* Gambar Cover Full Width dengan Efek Melayang */}
          {berita.gambar_cover && (
            <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] rounded-[2rem] overflow-hidden mb-16 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-border/40 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
              <img
                src={berita.gambar_cover}
                alt={berita.judul}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
            </div>
          )}

          {/* Layout Konten & Teks */}
          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
            {Array.isArray(konten) &&
              konten.map((blok: any, idx: number) => {
                if (blok.type === 'text') {
                  return (
                    <div key={idx} className="relative">
                      <p className="whitespace-pre-wrap text-base sm:text-lg md:text-xl leading-relaxed sm:leading-[1.9] text-muted-foreground/90 font-medium">
                        {blok.content}
                      </p>
                    </div>
                  );
                }
                if (blok.type === 'image') {
                  return (
                    <figure key={idx} className="my-14 relative w-full sm:w-[110%] sm:-ml-[5%]">
                      <div className="relative overflow-hidden rounded-[1.5rem] shadow-2xl border border-border/30">
                        <img
                          src={blok.content}
                          className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700"
                          alt={`Ilustrasi Detail ${idx + 1}`}
                        />
                      </div>
                    </figure>
                  );
                }
                return null;
              })}
          </div>

          {/* Penutup / Garis Bawah Artikel */}
          <div className="mt-24 pt-12 border-t border-border/50 text-center flex flex-col items-center">
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground/60 mb-8">
              Akhir dari Berita
            </p>
            <Link
              href="/#berita"
              className="group relative inline-flex items-center gap-3 text-sm sm:text-base font-bold
                         px-8 py-4 rounded-full overflow-hidden transition-all duration-500
                         shadow-[0_10px_30px_-10px_var(--brand)] hover:shadow-[0_15px_40px_-5px_var(--brand)] hover:-translate-y-1"
              style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Kembali & Lihat Berita Lainnya
              </span>
              <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}