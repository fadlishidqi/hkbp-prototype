import Link from 'next/link';
import FadeInSection from '@/components/ui/FadeInSection';

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

export default function Berita({ berita }: Props) {
  return (
    <section id="berita" className="py-32 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: 'var(--brand)' }}
              >
                Blog &amp; Berita
              </span>
              <h2 className="text-4xl md:text-5xl font-bold">Berita Terbaru</h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Informasi terkini seputar persiapan dan rangkaian acara HUT ke-165 HKBP.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {berita?.map((item, i) => {
            const firstTextBlok = Array.isArray(item.konten)
              ? item.konten.find((b: any) => b.type === 'text')
              : null;
            const cuplikan = firstTextBlok?.content ?? 'Lihat detail berita ini selengkapnya...';

            return (
              <FadeInSection key={item.id} delay={i * 100}>
                <Link
                  href={`/berita/${item.slug}`}
                  className="group block bg-card text-card-foreground rounded-2xl border border-border
                             overflow-hidden hover:border-ring transition-all duration-300
                             hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden">
                    {item.gambar_cover ? (
                      <img
                        src={item.gambar_cover}
                        alt={item.judul}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-52 bg-muted flex items-center justify-center text-4xl opacity-20">
                        📰
                      </div>
                    )}
                  </div>
                  <div className="p-7">
                    <time className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </time>
                    <h3 className="text-lg font-bold mt-2 mb-3 line-clamp-2 leading-snug">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {cuplikan}
                    </p>
                    <div
                      className="mt-5 flex items-center gap-1 text-sm font-semibold
                                 group-hover:gap-2 transition-all duration-200"
                      style={{ color: 'var(--brand)' }}
                    >
                      Baca Selengkapnya
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            );
          })}

          {(!berita || berita.length === 0) && (
            <div className="col-span-3 text-center py-16 text-muted-foreground bg-muted
                            rounded-2xl border border-dashed border-border">
              Belum ada berita yang dipublikasikan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}