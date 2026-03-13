// app/berita/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
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
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link
            href="/#berita"
            className="inline-flex items-center gap-2 text-sm font-semibold
                       px-4 py-2 rounded-full border border-border
                       bg-background hover:scale-105 transition-all duration-200
                       text-foreground hover:border-[var(--brand)]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali
          </Link>

          {/* Brand */}
          <div className="ml-auto flex flex-col items-end leading-none">
            <span className="text-sm font-extrabold tracking-tight text-foreground">HKBP</span>
            <span
              className="text-[9px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: 'var(--brand)' }}
            >
              165 Tahun
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* Eyebrow — tanggal */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: 'var(--brand)' }}
          />
          <time className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {new Date(berita.tanggal).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>

        {/* Judul */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-8">
          {berita.judul}
        </h1>

        {/* Gambar Cover */}
        {berita.gambar_cover && (
          <img
            src={berita.gambar_cover}
            alt={berita.judul}
            className="w-full rounded-2xl mb-10 shadow-md object-cover max-h-[480px]"
          />
        )}

        {/* Konten Dinamis */}
        <div className="space-y-6">
          {Array.isArray(konten) &&
            konten.map((blok: any, idx: number) => {
              if (blok.type === 'text') {
                return (
                  <p
                    key={idx}
                    className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed text-muted-foreground"
                  >
                    {blok.content}
                  </p>
                );
              }
              if (blok.type === 'image') {
                return (
                  <img
                    key={idx}
                    src={blok.content}
                    className="w-full rounded-xl shadow-md my-8"
                    alt={`Ilustrasi ${idx + 1}`}
                  />
                );
              }
              return null;
            })}
        </div>

        {/* Back button bawah */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/#berita"
            className="inline-flex items-center gap-2 text-sm font-semibold
                       px-6 py-3 rounded-full transition-all duration-200
                       hover:scale-105 hover:opacity-90 shadow-sm"
            style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Lihat Berita Lainnya
          </Link>
        </div>
      </main>
    </div>
  );
}