import FadeInSection from '@/components/FadeInSection';

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
      className="py-32 px-6 scroll-mt-20 bg-muted dark:bg-[oklch(0.13_0_0)]"
    >
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: 'var(--brand)' }}
            >
              Konser HUT ke-165
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pesan Tiket Konser
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Jadilah bagian dari momen bersejarah ini. Pilih kategori tiket yang sesuai.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiket?.map((item, i) => (
            <FadeInSection key={item.id} delay={i * 100}>
              <div
                className="flex gap-6 items-center rounded-2xl p-6 border transition-all duration-300
                           group hover:-translate-y-1 hover:shadow-xl hover:border-ring
                           bg-card border-border dark:bg-[oklch(0.18_0_0)] dark:border-[oklch(0.985_0_0_/_8%)]
                           dark:hover:border-[oklch(0.985_0_0_/_20%)]"
              >
                {item.gambar ? (
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="w-28 h-28 rounded-xl object-cover flex-shrink-0
                               group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="w-28 h-28 rounded-xl flex-shrink-0 flex items-center
                                justify-center text-3xl bg-muted dark:bg-[oklch(0.22_0_0)]"
                  >
                    🎟
                  </div>
                )}
                <div className="flex flex-col flex-1 gap-3">
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {item.deskripsi}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start text-sm font-bold px-5 py-2 rounded-full transition-all
                               duration-200 hover:scale-105"
                    style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}
                  >
                    Beli Tiket →
                  </a>
                </div>
              </div>
            </FadeInSection>
          ))}

          {(!tiket || tiket.length === 0) && (
            <div
              className="col-span-2 text-center py-16 rounded-2xl border border-dashed
                          border-border text-muted-foreground"
            >
              Tiket akan segera tersedia. Pantau terus!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}