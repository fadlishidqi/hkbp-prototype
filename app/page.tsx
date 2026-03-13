// app/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Agar data selalu terupdate saat di-refresh (tidak di-cache secara statis)
export const revalidate = 0;

export default async function Home() {
  // Mengambil data dari Supabase
  const { data: berita } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: tiket } = await supabase
    .from('tiket')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* NAVBAR (Fixed di atas) */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="font-bold text-xl text-blue-600">Company Logo</div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="hover:text-blue-600 transition">Home</a>
              <a href="#about" className="hover:text-blue-600 transition">About</a>
              <a href="#berita" className="hover:text-blue-600 transition">Berita</a>
              <a href="#tiket" className="hover:text-blue-600 transition">Tiket</a>
            </div>
          </div>
        </div>
      </nav>

      {/* SECTION: HOME */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-blue-600 text-white pt-16">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Selamat Datang</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Ini adalah website company profile onepage kami. Silakan scroll ke bawah untuk melihat lebih lanjut.
          </p>
          <a href="#about" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            Pelajari Lebih Lanjut
          </a>
        </div>
      </section>

      {/* SECTION: ABOUT */}
      <section id="about" className="min-h-screen py-24 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Tentang Kami</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Kami adalah perusahaan yang bergerak di bidang pelayanan dan hiburan. 
            Misi kami adalah memberikan pengalaman terbaik untuk para pelanggan melalui berita terupdate dan 
            sistem pemesanan tiket yang mudah.
          </p>
        </div>
      </section>

      {/* SECTION: BERITA */}
      <section id="berita" className="min-h-screen py-24 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Berita Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {berita?.map((item) => {
              // Mencari blok teks pertama untuk dijadikan cuplikan deskripsi di halaman depan
              const firstTextBlok = Array.isArray(item.konten) 
                ? item.konten.find((b: any) => b.type === 'text') 
                : null;
              const cuplikan = firstTextBlok ? firstTextBlok.content : 'Lihat detail berita...';

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                  {/* Gunakan gambar cover jika ada, jika tidak pakai placeholder */}
                  {item.gambar_cover && (
                    <img src={item.gambar_cover} alt={item.judul} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-sm text-gray-500 mb-2">{item.tanggal}</div>
                    <h3 className="text-xl font-bold mb-4">{item.judul}</h3>
                    
                    {/* Tampilkan cuplikan blok teks pertama */}
                    <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                      {cuplikan}
                    </p>
                    
                    {/* Link sekarang menggunakan SLUG */}
                    <Link href={`/berita/${item.slug}`} className="text-blue-600 font-semibold hover:underline mt-auto">
                      Baca Selengkapnya &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
            {(!berita || berita.length === 0) && (
              <p className="text-center col-span-3 text-gray-500">Belum ada berita.</p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION: TIKET */}
      <section id="tiket" className="min-h-screen py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Pesan Tiket</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tiket?.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg shadow p-6 flex flex-col md:flex-row gap-6 items-center">
                <img src={item.gambar} alt={item.judul} className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg shadow" />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">{item.judul}</h3>
                  <p className="text-gray-600 mb-6">{item.deskripsi}</p>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
                  >
                    Beli Tiket
                  </a>
                </div>
              </div>
            ))}
            {(!tiket || tiket.length === 0) && (
              <p className="text-center col-span-2 text-gray-500">Belum ada tiket yang tersedia.</p>
            )}
          </div>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-8">
        <p>&copy; {new Date().getFullYear()} Company Profile. All rights reserved.</p>
      </footer>
    </div>
  );
}