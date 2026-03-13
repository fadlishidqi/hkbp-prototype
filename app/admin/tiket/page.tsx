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
import { cn } from '@/lib/utils';
import { Trash2, ExternalLink, ImageOff, Ticket, Pencil, X } from 'lucide-react';

const uploadAppearance = {
  button:
    'ut-ready:bg-primary ut-uploading:bg-primary/80 after:bg-primary/50 w-full rounded-md text-sm font-medium h-10 px-4 transition-all',
  container:
    'w-full border border-dashed border-input rounded-lg p-6 flex-col gap-2 bg-muted/30 hover:border-primary/50 transition-colors',
  allowedContent: 'text-muted-foreground text-xs',
};

export default function KelolaTiket() {
  const [tiket, setTiket] = useState<any[]>([]);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

    if (editingId) {
      const { error } = await supabase
        .from('tiket')
        .update({ judul, deskripsi, link, gambar: imageUrl })
        .eq('id', editingId);

      if (!error) {
        cancelEdit();
        fetchTiket();
      } else {
        alert('Gagal mengupdate tiket: ' + error.message);
      }
    } else {
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
    }
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setJudul(item.judul);
    setDeskripsi(item.deskripsi);
    setLink(item.link);
    setImageUrl(item.gambar);
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setJudul('');
    setDeskripsi('');
    setLink('');
    setImageUrl('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus tiket ini?')) {
      await supabase.from('tiket').delete().eq('id', id);
      fetchTiket();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Sesuai Aslinya */}
      <div className="flex items-center gap-3">
        <Ticket className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Tiket</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Tambah dan hapus tiket yang tersedia</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {tiket.length} Tiket
        </Badge>
      </div>

      {/* Form Tambah/Edit */}
      <Card className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm transition-colors", editingId && "border-primary/50 shadow-md ring-1 ring-primary/20")}>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4 mb-4">
          <CardTitle className="text-base text-foreground">
            {editingId ? 'Edit Tiket' : 'Tambah Tiket Baru'}
          </CardTitle>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-8 hover:text-destructive hover:bg-destructive/10">
              <X className="h-4 w-4 mr-2" /> Batal Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Judul */}
            <div className="space-y-1.5">
              <Label className="text-foreground">Judul Tiket</Label>
              <Input
                required
                placeholder="Contoh: Tiket Masuk Reguler"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="bg-background border-border/50 focus:border-primary"
              />
            </div>

            {/* Upload Gambar */}
            <div className="space-y-1.5">
              <Label className="text-foreground">Gambar Tiket</Label>
              {imageUrl ? (
                <div className="relative w-max group">
                  <img
                    src={imageUrl}
                    alt="Tiket"
                    className="h-32 object-cover rounded-lg shadow border border-border/50"
                  />
                  {/* Overlay Hitam Halus Saat Hover (Seperti di Berita) */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-[2px]">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="rounded-full shadow-lg font-semibold"
                      onClick={() => setImageUrl('')}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Hapus
                    </Button>
                  </div>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => setImageUrl(res[0].url)}
                  onUploadError={(error: Error) =>
                    alert(`Gagal upload: ${error.message}`)
                  }
                  appearance={uploadAppearance}
                />
              )}
            </div>

            {/* Link */}
            <div className="space-y-1.5">
              <Label className="text-foreground">Link Tiket (URL Tujuan)</Label>
              <Input
                type="url"
                required
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-background border-border/50 focus:border-primary"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label className="text-foreground">Deskripsi Singkat</Label>
              <Textarea
                required
                placeholder="Fasilitas yang didapat..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="min-h-[100px] bg-background border-border/50 focus:border-primary"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto mt-6 pt-2">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto transition-all active:scale-[0.98]">
                {loading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Simpan Tiket')}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit} className="w-full sm:w-auto bg-background hover:bg-muted">
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator className="bg-border/50" />

      {/* Tabel Daftar Tiket */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <CardTitle className="text-base text-foreground">Daftar Tiket</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-24 pl-6 text-foreground">Gambar</TableHead>
                <TableHead className="text-foreground">Judul</TableHead>
                <TableHead className="text-foreground">Link</TableHead>
                <TableHead className="text-center w-24 pr-6 text-foreground">Aksi</TableHead>
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
                  <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-border/50">
                    <TableCell className="pl-6 py-4">
                      {item.gambar ? (
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-14 h-14 object-cover rounded-md border border-border/50"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center border border-border/50">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground py-4">{item.judul}</TableCell>
                    <TableCell className="py-4">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors"
                      >
                        Buka Link <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-center pr-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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