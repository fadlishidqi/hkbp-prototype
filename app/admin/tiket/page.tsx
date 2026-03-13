'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadButton } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, ExternalLink, ImageOff, Ticket } from 'lucide-react';

export default function KelolaTiket() {
  const [tiket, setTiket] = useState<any[]>([]);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Harap upload gambar tiket terlebih dahulu!');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('tiket').insert([
      { judul, deskripsi, link, gambar: imageUrl },
    ]);
    if (!error) {
      setJudul('');
      setDeskripsi('');
      setLink('');
      setImageUrl('');
      fetchTiket();
    } else {
      alert('Gagal menambah tiket: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus tiket ini?')) {
      await supabase.from('tiket').delete().eq('id', id);
      fetchTiket();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Ticket className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Tiket</h1>
          <p className="text-muted-foreground text-sm">Tambah dan hapus tiket yang tersedia</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {tiket.length} Tiket
        </Badge>
      </div>

      {/* Form Tambah */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tambah Tiket Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Judul */}
            <div className="space-y-1.5">
              <Label>Judul Tiket</Label>
              <Input
                required
                placeholder="Contoh: Tiket Masuk Reguler"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
              />
            </div>

            {/* Upload Gambar */}
            <div className="space-y-1.5">
              <Label>Gambar Tiket</Label>
              {imageUrl ? (
                <div className="relative w-max">
                  <img
                    src={imageUrl}
                    alt="Tiket"
                    className="h-32 object-cover rounded-lg shadow"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => setImageUrl('')}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => setImageUrl(res[0].url)}
                  onUploadError={(error: Error) =>
                    alert(`Gagal upload: ${error.message}`)
                  }
                  appearance={{
                    button:
                      'ut-ready:bg-primary ut-uploading:bg-primary/80 after:bg-primary/50 w-full rounded-md text-sm font-medium h-10 px-4',
                    container:
                      'w-full border border-dashed border-input rounded-lg p-6 flex-col gap-2 bg-muted/30',
                    allowedContent: 'text-muted-foreground text-xs',
                  }}
                />
              )}
            </div>

            {/* Link */}
            <div className="space-y-1.5">
              <Label>Link Tiket (URL Tujuan)</Label>
              <Input
                type="url"
                required
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label>Deskripsi Singkat</Label>
              <Textarea
                required
                placeholder="Fasilitas yang didapat..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Menyimpan...' : 'Simpan Tiket'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Tabel Daftar Tiket */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Tiket</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Gambar</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-center w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiket.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    Belum ada tiket.
                  </TableCell>
                </TableRow>
              ) : (
                tiket.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.gambar ? (
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-14 h-14 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.judul}</TableCell>
                    <TableCell>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        Buka Link <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}