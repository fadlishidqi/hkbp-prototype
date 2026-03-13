// app/berita/[slug]/loading.tsx
import Link from 'next/link';

export default function LoadingDetailBerita() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden animate-pulse">
      
      {/* Header Skeleton (Sama persis dengan aslinya agar transisi mulus) */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <div className="w-40 h-10 bg-muted/50 rounded-full" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted/50 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="w-20 h-5 bg-muted/50 rounded-md" />
              <div className="w-16 h-3 bg-muted/50 rounded-md" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="min-h-screen">
        <article className="max-w-4xl mx-auto px-5 sm:px-8 pt-16 pb-24">
          
          {/* Metadata Skeleton */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-24 h-6 bg-brand/20 rounded-full" />
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="w-32 h-4 bg-muted/50 rounded-md" />
          </div>

          {/* Judul Artikel Skeleton */}
          <div className="space-y-4 mb-12">
            <div className="w-full h-10 sm:h-14 bg-muted/60 rounded-xl" />
            <div className="w-3/4 h-10 sm:h-14 bg-muted/60 rounded-xl" />
          </div>

          {/* Gambar Cover Skeleton */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] bg-muted/40 rounded-[2rem] mb-16 border border-border/40 flex items-center justify-center">
             <div className="w-10 h-10 border-4 border-muted-foreground/20 border-t-brand rounded-full animate-spin" />
          </div>

          {/* Layout Konten Teks Skeleton */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="w-full h-4 bg-muted/50 rounded-md" />
            <div className="w-full h-4 bg-muted/50 rounded-md" />
            <div className="w-[90%] h-4 bg-muted/50 rounded-md" />
            <div className="w-[95%] h-4 bg-muted/50 rounded-md" />
            <div className="w-[80%] h-4 bg-muted/50 rounded-md" />
            
            <div className="pt-6">
              <div className="w-full h-4 bg-muted/50 rounded-md" />
              <div className="w-[85%] h-4 bg-muted/50 rounded-md" />
              <div className="w-[90%] h-4 bg-muted/50 rounded-md" />
            </div>
          </div>

        </article>
      </main>
    </div>
  );
}