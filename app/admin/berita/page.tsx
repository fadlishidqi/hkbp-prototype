'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadButton } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
// Tambahkan import Edit dan X
import { Trash2, ImageOff, Newspaper, PlusCircle, Type, Image as ImageIcon, GripVertical, Edit, X } from 'lucide-react';

// dnd-kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Types ───────────────────────────────────────────────
type Block = { id: string; type: 'text' | 'image'; content: string };

const uploadAppearance = {
  button:
    'ut-ready:bg-primary ut-uploading:bg-primary/80 after:bg-primary/50 w-full rounded-md text-sm font-medium h-10 px-4',
  container:
    'w-full border border-dashed border-input rounded-lg p-6 flex-col gap-2 bg-muted/30',
  allowedContent: 'text-muted-foreground text-xs',
};

// ─── Sortable Block Item ──────────────────────────────────
function SortableBlock({
  block,
  canRemove,
  onRemove,
  onUpdate,
}: {
  block: Block;
  canRemove: boolean;
  onRemove: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-3 items-start bg-muted/30 p-4 rounded-lg border"
    >
      <button
        type="button"
        className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <Badge
        variant={block.type === 'text' ? 'default' : 'secondary'}
        className="mt-1 shrink-0 flex items-center gap-1"
      >
        {block.type === 'text' ? (
          <><Type className="h-3 w-3" /> TEKS</>
        ) : (
          <><ImageIcon className="h-3 w-3" /> GAMBAR</>
        )}
      </Badge>

      <div className="flex-1">
        {block.type === 'text' ? (
          <Textarea
            placeholder="Tulis paragraf di sini..."
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            className="min-h-[100px] bg-background"
            required
          />
        ) : block.content ? (
          <div className="relative w-max">
            <img src={block.content} alt="Block" className="h-28 rounded-lg shadow" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => onUpdate(block.id, '')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => onUpdate(block.id, res[0].url)}
            onUploadError={(error: Error) => alert(`Gagal upload: ${error.message}`)}
            appearance={{
              ...uploadAppearance,
              container:
                'w-full border border-dashed border-input rounded-lg p-4 flex-col gap-2 bg-background',
            }}
          />
        )}
      </div>

      {canRemove && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => onRemove(block.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function KelolaBerita() {
  const [berita, setBerita] = useState<any[]>([]);
  
  // States Form
  const [editId, setEditId] = useState<string | null>(null); // State untuk menandai mode Edit
  const [judul, setJudul] = useState('');
  const [slug, setSlug] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([{ id: '1', type: 'text', content: '' }]);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchBerita = async () => {
    const { data } = await supabase
      .from('berita')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setBerita(data);
  };

  useEffect(() => { fetchBerita(); }, []);

  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJudul(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const addBlock = (type: 'text' | 'image') => {
    setBlocks([...blocks, { id: Math.random().toString(), type, content: '' }]);
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter((b) => b.id !== id));

  const updateBlockContent = (id: string, content: string) =>
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((prev) => {
        const oldIndex = prev.findIndex((b) => b.id === active.id);
        const newIndex = prev.findIndex((b) => b.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // ─── FUNGSI RESET FORM ───
  const resetForm = () => {
    setEditId(null);
    setJudul(''); 
    setSlug(''); 
    setCoverUrl('');
    setBlocks([{ id: '1', type: 'text', content: '' }]);
  };

  // ─── FUNGSI SUBMIT (CREATE & UPDATE) ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const finalBlocks = blocks.map((b) => ({ type: b.type, content: b.content }));
    
    if (editId) {
      // UPDATE BERITA
      const { error } = await supabase
        .from('berita')
        .update({ judul, slug, gambar_cover: coverUrl, konten: finalBlocks })
        .eq('id', editId);

      if (!error) {
        resetForm();
        fetchBerita();
      } else {
        alert('Gagal update: ' + error.message);
      }
    } else {
      // INSERT BERITA BARU
      const { error } = await supabase.from('berita').insert([
        { judul, slug, gambar_cover: coverUrl, konten: finalBlocks },
      ]);
      
      if (!error) {
        resetForm();
        fetchBerita();
      } else {
        alert('Gagal menyimpan: ' + error.message);
      }
    }
    setLoading(false);
  };

  // ─── FUNGSI EDIT BERITA (POPULATE KE FORM) ───
  const handleEdit = (item: any) => {
    setEditId(item.id);
    setJudul(item.judul);
    setSlug(item.slug);
    setCoverUrl(item.gambar_cover || '');
    
    if (item.konten && Array.isArray(item.konten)) {
      setBlocks(item.konten.map((b: any, i: number) => ({
        id: i.toString(),
        type: b.type,
        content: b.content
      })));
    } else {
      setBlocks([{ id: '1', type: 'text', content: '' }]);
    }
    
    // Scroll otomatis ke atas form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus berita ini?')) {
      await supabase.from('berita').delete().eq('id', id);
      fetchBerita();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Newspaper className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Berita</h1>
          <p className="text-muted-foreground text-sm">Buat dan kelola artikel berita</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {berita.length} Artikel
        </Badge>
      </div>

      {/* Form */}
      <Card className={editId ? "border-primary/50 shadow-md" : ""}>
        <CardHeader>
          <CardTitle className="text-base flex justify-between items-center">
            {editId ? "Edit Berita" : "Tambah Berita Baru"}
            {editId && (
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                Batal Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Judul Berita</Label>
                <Input required value={judul} onChange={handleJudulChange} placeholder="Judul artikel..." />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (Otomatis)</Label>
                <Input value={slug} readOnly className="bg-muted text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Gambar Cover Utama</Label>
              {coverUrl ? (
                <div className="relative w-max">
                  <img src={coverUrl} alt="Cover" className="h-36 object-cover rounded-lg shadow" />
                  <Button
                    type="button" size="icon" variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => setCoverUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => setCoverUrl(res[0].url)}
                  onUploadError={(error: Error) => alert(`Gagal upload: ${error.message}`)}
                  appearance={uploadAppearance}
                />
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Susun Isi Berita</Label>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <GripVertical className="h-3 w-3" /> Drag untuk ubah urutan
                </span>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        canRemove={blocks.length > 1}
                        onRemove={removeBlock}
                        onUpdate={updateBlockContent}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('text')}>
                  <PlusCircle className="h-4 w-4 mr-1" /> Tambah Teks
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')}>
                  <PlusCircle className="h-4 w-4 mr-1" /> Tambah Gambar
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Menyimpan...' : (editId ? 'Update Berita' : 'Simpan Berita Terbit')}
              </Button>
              {editId && (
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
                  Batal
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Tabel Daftar Berita */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Berita</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Cover</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center w-32">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {berita.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Belum ada berita.
                  </TableCell>
                </TableRow>
              ) : (
                berita.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.gambar_cover ? (
                        <img src={item.gambar_cover} alt="Cover" className="w-14 h-14 object-cover rounded-md" />
                      ) : (
                        <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.judul}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">{item.slug}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* TOMBOL EDIT */}
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        {/* TOMBOL DELETE */}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
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