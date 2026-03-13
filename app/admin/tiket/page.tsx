// app/admin/tiket/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadButton } from '@/lib/uploadthing';

export default function KelolaTiket() {
  const [tiket, setTiket] = useState<any[]>([]);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [link, setLink] = useState('');
  
  // State untuk menyimpan URL gambar dari Uploadthing
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Mengambil data tiket
  const fetchTiket = async () => {
    const { data } = await supabase
      .from('tiket')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTiket(data);
  };

  useEffect(() => {
    fetchTiket();
  }, []);

  // Menambah tiket baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Harap upload gambar tiket terlebih dahulu!');
      return;
    }
    
    setLoading(true);

    // Simpan data ke tabel tiket
    const { error } = await supabase.from('tiket').insert([
      { judul, deskripsi, link, gambar: imageUrl }
    ]);

    if (!error) {
      alert('Tiket berhasil ditambahkan!');
      setJudul('');
      setDeskripsi('');
      setLink('');
      setImageUrl(''); // Reset gambar
      fetchTiket();
    } else {
      alert('Gagal menambah tiket: ' + error.message);
    }
    setLoading(false);
  };

  // Menghapus tiket
  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus tiket ini?')) {
      await supabase.from('tiket').delete().eq('id', id);
      fetchTiket();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kelola Tiket (via Uploadthing)</h1>

      {/* Form Tambah Tiket */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Tiket Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul Tiket</label>
            <input 
              type="text" required value={judul} onChange={(e) => setJudul(e.target.value)}
              className="w-full border p-2 rounded" placeholder="Contoh: Tiket Masuk Reguler"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Gambar Tiket</label>
            {imageUrl ? (
              <div className="relative w-max">
                <img src={imageUrl} alt="Tiket" className="h-32 object-cover rounded shadow" />
                <button 
                  type="button" 
                  onClick={() => setImageUrl('')} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 p-4 rounded text-center">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url);
                    alert("Gambar tiket berhasil diupload!");
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Gagal upload: ${error.message}`);
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link Tiket (URL Tujuan)</label>
            <input 
              type="url" required value={link} onChange={(e) => setLink(e.target.value)}
              className="w-full border p-2 rounded" placeholder="https://..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
            <textarea 
              required value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full border p-2 rounded h-24" placeholder="Fasilitas yang didapat..."
            />
          </div>
          
          <button 
            type="submit" disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300 w-full md:w-auto font-semibold"
          >
            {loading ? 'Menyimpan...' : 'Simpan Tiket'}
          </button>
        </form>
      </div>

      {/* Daftar Tiket */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Tiket</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left w-24">Gambar</th>
                <th className="border p-2 text-left">Judul</th>
                <th className="border p-2 text-left">Link URL</th>
                <th className="border p-2 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tiket.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">
                    {item.gambar ? (
                      <img src={item.gambar} alt={item.judul} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 text-sm">Tidak ada</span>
                    )}
                  </td>
                  <td className="border p-2">{item.judul}</td>
                  <td className="border p-2">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                      Buka Link
                    </a>
                  </td>
                  <td className="border p-2 text-center">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {tiket.length === 0 && (
                <tr>
                  <td colSpan={4} className="border p-4 text-center text-gray-500">Belum ada tiket.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}