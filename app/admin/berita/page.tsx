'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadButton } from '@/lib/uploadthing';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale'; // Untuk format tanggal Bahasa Indonesia
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // CUSTOM POPOVER
import { Calendar as CustomCalendar } from '@/components/ui/calendar'; // CUSTOM CALENDAR
import { cn } from '@/lib/utils';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { 
  Trash2, ImageOff, Newspaper, PlusCircle, 
  Type, Image as ImageIcon, GripVertical, Edit, X,
  Calendar as CalendarIcon
} from 'lucide-react';

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
    'ut-ready:bg-primary ut-uploading:bg-primary/80 after:bg-primary/50 w-full rounded-md text-sm font-medium h-10 px-4 transition-all',
  container:
    'w-full border border-dashed border-input rounded-lg p-6 flex-col gap-2 bg-muted/30 hover:border-primary/50 transition-colors',
  allowedContent: 'text-muted-foreground text-xs',
};

// ─── Helper Format Tanggal Indonesia ──────────────────────
const formatTanggal = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex gap-3 items-start p-4 rounded-lg border transition-all duration-300",
        isDragging ? "bg-card border-primary shadow-xl opacity-90 scale-[1.02]" : "bg-muted/30 border-border/50 hover:border-border"
      )}
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
            className="min-h-[100px] bg-background border-border/50 focus:border-primary"
            required
          />
        ) : block.content ? (
          <div className="relative w-max">
            <img src={block.content} alt="Block" className="h-28 rounded-lg shadow border border-border/50" />
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
              container: 'w-full border border-dashed border-input rounded-lg p-4 flex-col gap-2 bg-background hover:border-primary/50 transition-colors',
            }}
          />
        )}
      </div>

      {canRemove && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(block.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function KelolaBerita() {
  const [berita, setBerita] = useState<any[]>([]);
  
  // States Form
  const [editId, setEditId] = useState<string | null>(null);
  const [judul, setJudul] = useState('');
  const [slug, setSlug] = useState('');
  
  // STATE TANGGAL MENGGUNAKAN OBJECT DATE
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date());
  
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

  const resetForm = () => {
    setEditId(null);
    setJudul(''); 
    setSlug(''); 
    setTanggal(new Date()); 
    setCoverUrl('');
    setBlocks([{ id: '1', type: 'text', content: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format tanggal untuk disimpan ke database (YYYY-MM-DD)
    const formattedDate = tanggal ? format(tanggal, 'yyyy-MM-dd') : null;
    const finalBlocks = blocks.map((b) => ({ type: b.type, content: b.content }));
    
    if (editId) {
      const { error } = await supabase
        .from('berita')
        .update({ judul, slug, tanggal: formattedDate, gambar_cover: coverUrl, konten: finalBlocks })
        .eq('id', editId);

      if (!error) {
        resetForm();
        fetchBerita();
      } else {
        alert('Gagal update: ' + error.message);
      }
    } else {
      const { error } = await supabase.from('berita').insert([
        { judul, slug, tanggal: formattedDate, gambar_cover: coverUrl, konten: finalBlocks },
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

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setJudul(item.judul);
    setSlug(item.slug);
    setTanggal(item.tanggal ? new Date(item.tanggal) : new Date()); 
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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus berita ini?')) {
      await supabase.from('berita').delete().eq('id', id);
      fetchBerita();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Newspaper className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Berita</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Buat dan kelola artikel berita</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {berita.length} Artikel
        </Badge>
      </div>

      {/* Form Card */}
      <Card className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm transition-colors", editId && "border-primary/50 shadow-md ring-1 ring-primary/20")}>
        <CardHeader>
          <CardTitle className="text-base flex justify-between items-center text-foreground">
            {editId ? "Edit Berita" : "Tambah Berita Baru"}
            {editId && (
              <Button type="button" variant="ghost" size="sm" onClick={resetForm} className="h-8 hover:text-destructive hover:bg-destructive/10">
                <X className="w-4 h-4 mr-1" /> Batal Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Judul */}
              <div className="space-y-1.5">
                <Label className="text-foreground">Judul Berita</Label>
                <Input required value={judul} onChange={handleJudulChange} placeholder="Judul artikel..." className="bg-background border-border/50 focus:border-primary" />
              </div>

              {/* TANGGAL PREMIUM DENGAN POPOVER CALENDAR */}
              <div className="space-y-1.5 flex flex-col">
                <Label className="text-foreground">Tanggal Kegiatan / Publikasi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-border/50 hover:bg-muted/50 transition-colors",
                        !tanggal && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {tanggal ? format(tanggal, "PPP", { locale: localeID }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  {/* Calendar Popup yang menyatu dengan Dark Mode */}
                  <PopoverContent className="w-auto p-0 bg-card border-border/50 shadow-xl rounded-xl overflow-hidden" align="start">
                    <CustomCalendar
                      mode="single"
                      selected={tanggal}
                      onSelect={setTanggal}
                      initialFocus
                      className="bg-card text-foreground"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Slug */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-foreground">Slug (Otomatis)</Label>
                <Input value={slug} readOnly className="bg-muted text-muted-foreground border-transparent cursor-not-allowed" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground">Gambar Cover Utama</Label>
              {coverUrl ? (
                <div className="relative w-max">
                  <img src={coverUrl} alt="Cover" className="h-36 object-cover rounded-lg shadow border border-border/50" />
                  <Button
                    type="button" size="icon" variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
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

            <Separator className="bg-border/50" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">Susun Isi Berita</Label>
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
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('text')} className="bg-background hover:bg-muted">
                  <PlusCircle className="h-4 w-4 mr-1" /> Tambah Teks
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')} className="bg-background hover:bg-muted">
                  <PlusCircle className="h-4 w-4 mr-1" /> Tambah Gambar
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="w-full font-medium transition-all active:scale-[0.98]">
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

      <Separator className="bg-border/50" />

      {/* Tabel Daftar Berita */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20">
          <CardTitle className="text-base text-foreground">Daftar Berita</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-24 pl-6 text-foreground">Cover</TableHead>
                <TableHead className="text-foreground w-[40%]">Info Berita</TableHead>
                <TableHead className="text-foreground hidden md:table-cell">Slug</TableHead>
                <TableHead className="text-center w-28 pr-6 text-foreground">Aksi</TableHead>
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
                  <TableRow key={item.id} className="hover:bg-muted/40 transition-colors border-border/50">
                    <TableCell className="pl-6">
                      {item.gambar_cover ? (
                        <img src={item.gambar_cover} alt="Cover" className="w-14 h-14 object-cover rounded-md border border-border/50" />
                      ) : (
                        <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center border border-border/50">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell className="max-w-xs pr-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground line-clamp-2" title={item.judul}>
                          {item.judul}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{formatTanggal(item.tanggal || item.created_at)}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell truncate max-w-[200px]" title={item.slug}>
                      <Badge variant="outline" className="font-mono text-xs font-normal border-border/50 bg-background/50 truncate max-w-full inline-block">
                        {item.slug}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <div className="flex justify-center gap-1.5">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500 transition-colors shrink-0" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0" onClick={() => handleDelete(item.id)}>
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