// app/berita/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function DetailBerita({ params }: { params: { slug: string } }) {
  // Ambil parameter slug dari URL
  const { slug } = await params;

  // Cari berita berdasarkan slug
  const { data: berita } = await supabase
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!berita) notFound();

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <nav className="bg-white shadow-md py-4 px-6 border-b">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          &larr; Kembali ke Beranda
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">{berita.judul}</h1>
        <p className="text-gray-500 mb-8">Dipublikasikan pada: {berita.tanggal}</p>
        
        {/* Render Gambar Cover jika admin memasukkannya */}
        {berita.gambar_cover && (
          <img src={berita.gambar_cover} alt="Cover" className="w-full rounded-lg mb-10 shadow-md" />
        )}

        {/* Render Blok Konten Dinamis (Teks -> Gambar -> Teks, dsb) */}
        <div className="mt-8 space-y-6">
          {berita.konten.map((blok: any, idx: number) => {
            if (blok.type === 'text') {
              return (
                <p key={idx} className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
                  {blok.content}
                </p>
              );
            } else if (blok.type === 'image') {
              return (
                <img 
                  key={idx} 
                  src={blok.content} 
                  className="w-full rounded-lg shadow my-8" 
                  alt={`Konten ilustrasi ${idx}`} 
                />
              );
            }
            return null;
          })}
        </div>
      </main>
    </div>
  );
}