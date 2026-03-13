'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadButton } from '@/lib/uploadthing';

// Tipe data untuk blok konten dinamis (file tidak diperlukan lagi, kita langsung simpan url/content)
type Block = { id: string; type: 'text' | 'image'; content: string };

export default function KelolaBerita() {
  const [berita, setBerita] = useState<any[]>([]);
  const [judul, setJudul] = useState('');
  const [slug, setSlug] = useState('');
  
  // Karena langsung diupload, kita simpan URL-nya, bukan filenya
  const [coverUrl, setCoverUrl] = useState('');
  
  const [blocks, setBlocks] = useState<Block[]>([{ id: '1', type: 'text', content: '' }]);
  const [loading, setLoading] = useState(false);

  const fetchBerita = async () => {
    const { data } = await supabase.from('berita').select('*').order('created_at', { ascending: false });
    if (data) setBerita(data);
  };

  useEffect(() => { fetchBerita(); }, []);

  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJudul(val);
    const newSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSlug(newSlug);
  };

  const addBlock = (type: 'text' | 'image') => {
    setBlocks([...blocks, { id: Math.random().toString(), type, content: '' }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Proses submit jadi sangat cepat karena gambar sudah terupload via Uploadthing sebelumnya
    const finalBlocks = blocks.map(b => ({ type: b.type, content: b.content }));

    const { error: insertError } = await supabase.from('berita').insert([
      { judul, slug, gambar_cover: coverUrl, konten: finalBlocks }
    ]);

    if (!insertError) {
      alert('Berita berhasil ditambahkan!');
      setJudul(''); setSlug(''); setCoverUrl('');
      setBlocks([{ id: '1', type: 'text', content: '' }]);
      fetchBerita();
    } else {
      alert('Gagal menyimpan data ke database: ' + insertError.message);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus berita ini?')) {
      await supabase.from('berita').delete().eq('id', id);
      fetchBerita();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kelola Berita Dinamis (via Uploadthing)</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul Berita</label>
              <input type="text" required value={judul} onChange={handleJudulChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (Otomatis)</label>
              <input type="text" required value={slug} readOnly className="w-full border p-2 rounded bg-gray-100 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gambar Cover Utama</label>
            {coverUrl ? (
              <div className="relative w-max">
                <img src={coverUrl} alt="Cover" className="h-32 object-cover rounded shadow" />
                <button type="button" onClick={() => setCoverUrl('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">X</button>
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 p-4 rounded text-center">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setCoverUrl(res[0].url);
                    alert("Cover berhasil diupload!");
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Gagal upload: ${error.message}`);
                  }}
                />
              </div>
            )}
          </div>

          <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 mt-6">
            <label className="block text-sm font-bold mb-4 text-gray-700">Susun Isi Berita</label>
            
            {blocks.map((block) => (
              <div key={block.id} className="flex gap-4 mb-4 items-start bg-white p-4 rounded border shadow-sm">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold mt-1">
                  {block.type === 'text' ? 'TEKS' : 'GAMBAR'}
                </div>
                <div className="flex-1">
                  {block.type === 'text' ? (
                    <textarea 
                      placeholder="Tulis paragraf di sini..." value={block.content} 
                      onChange={(e) => updateBlockContent(block.id, e.target.value)}
                      className="w-full border p-2 rounded min-h-[100px]" required
                    />
                  ) : (
                    // Cek apakah gambar sudah diupload
                    block.content ? (
                      <div className="relative w-max mt-2">
                        <img src={block.content} alt="Block Image" className="h-32 rounded shadow" />
                        <button type="button" onClick={() => updateBlockContent(block.id, '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">X</button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 p-4 rounded text-center mt-2">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            updateBlockContent(block.id, res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            alert(`Gagal upload: ${error.message}`);
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
                {blocks.length > 1 && (
                  <button type="button" onClick={() => removeBlock(block.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold">X</button>
                )}
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <button type="button" onClick={() => addBlock('text')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 font-medium">
                + Tambah Teks
              </button>
              <button type="button" onClick={() => addBlock('image')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 font-medium">
                + Tambah Gambar
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-4 py-3 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300 mt-4">
            {loading ? 'Menyimpan Berita...' : 'Simpan Berita Terbit'}
          </button>
        </form>
      </div>
      
      {/* DAFTAR BERITA TETAP SAMA */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Berita</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Gambar</th>
                <th className="border p-2 text-left">Judul</th>
                <th className="border p-2 text-left">Slug</th>
                <th className="border p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {berita.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">
                    {item.gambar_cover ? (
                      <img src={item.gambar_cover} alt="Cover" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 text-sm">Tidak ada</span>
                    )}
                  </td>
                  <td className="border p-2">{item.judul}</td>
                  <td className="border p-2 text-blue-500">{item.slug}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}