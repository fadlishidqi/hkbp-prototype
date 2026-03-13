import FadeInSection from '@/components/ui/FadeInSection';

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiket?.map((item, i) => (
            <FadeInSection key={item.id} delay={i * 100}>
              <div className="relative group">

                {/* Glow layer */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50
                             transition-opacity duration-500 blur-xl -z-10 scale-95"
                  style={{ background: 'var(--brand)' }}
                />

                {/* Card */}
                <div
                  className="relative flex flex-col rounded-2xl border overflow-hidden
                             transition-all duration-300
                             group-hover:-translate-y-1 group-hover:border-ring
                             bg-card border-border
                             dark:bg-[oklch(0.18_0_0)] dark:border-[oklch(0.985_0_0_/_8%)]
                             dark:group-hover:border-[oklch(0.985_0_0_/_20%)]"
                >
                  {/* Gambar Full — tampil sesuai ukuran asli, tidak dipotong */}
                  {item.gambar ? (
                    <div className="w-full overflow-hidden bg-muted dark:bg-[oklch(0.22_0_0)]">
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full py-12 flex items-center justify-center text-5xl bg-muted dark:bg-[oklch(0.22_0_0)]">
                      🎟
                    </div>
                  )}

                  {/* Konten */}
                  <div className="flex flex-col flex-1 gap-3 p-6">
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {item.deskripsi}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-center text-sm font-bold px-5 py-2.5 rounded-full
                                 transition-all duration-200 hover:scale-105 hover:opacity-90"
                      style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}
                    >
                      Beli Tiket →
                    </a>
                  </div>
                </div>

              </div>
            </FadeInSection>
          ))}

          {(!tiket || tiket.length === 0) && (
            <div
              className="col-span-full text-center py-16 rounded-2xl border border-dashed
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