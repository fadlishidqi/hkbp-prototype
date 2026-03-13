'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, type Variants } from 'framer-motion'; // IMPORT Variants UNTUK FIX ERROR TS
import { Newspaper, Ticket, TrendingUp, ArrowRight, Activity } from 'lucide-react';

// Tambahkan : Variants agar TypeScript tidak komplain
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalBerita, setTotalBerita] = useState<number>(0);
  const [totalTiket, setTotalTiket] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const [{ count: beritaCount }, { count: tiketCount }] = await Promise.all([
        supabase.from('berita').select('*', { count: 'exact', head: true }),
        supabase.from('tiket').select('*', { count: 'exact', head: true }),
      ]);

      setTotalBerita(beritaCount ?? 0);
      setTotalTiket(tiketCount ?? 0);
      setLoading(false);
    };
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted/50 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-32 bg-muted/40 rounded-xl border border-border/50" />
          <div className="h-32 bg-muted/40 rounded-xl border border-border/50" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header Sesuai Ukuran Asli */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Ringkasan data admin.
        </p>
      </motion.div>

      {/* Stats Sesuai Ukuran Asli */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-card/50 backdrop-blur-xl border border-border/60 rounded-xl p-6 shadow-sm transition-colors hover:bg-card/80"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Berita
                </h3>
              </div>
              {/* Dikembalikan ke text-4xl sesuai aslinya */}
              <p className="text-4xl font-bold text-foreground">
                {totalBerita}
              </p>
            </div>
            <Activity className="w-8 h-8 text-muted/30" />
          </div>
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            Artikel terpublikasi
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-card/50 backdrop-blur-xl border border-border/60 rounded-xl p-6 shadow-sm transition-colors hover:bg-card/80"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Tiket
                </h3>
              </div>
              {/* Dikembalikan ke text-4xl sesuai aslinya */}
              <p className="text-4xl font-bold text-foreground">
                {totalTiket}
              </p>
            </div>
            <Activity className="w-8 h-8 text-muted/30" />
          </div>
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            Tiket tersedia
          </p>
        </motion.div>

      </div>

      {/* Akses Cepat */}
      <motion.div variants={itemVariants} className="pt-2">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Akses Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/berita')}
            className="group cursor-pointer flex items-center gap-4 p-5 bg-card border border-border/60 rounded-xl shadow-sm hover:shadow-md hover:border-brand/50 transition-all"
          >
            <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Newspaper className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground">Kelola Berita</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Tambah, edit, dan hapus artikel berita</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors" />
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/tiket')}
            className="group cursor-pointer flex items-center gap-4 p-5 bg-card border border-border/60 rounded-xl shadow-sm hover:shadow-md hover:border-brand/50 transition-all"
          >
            <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground">Kelola Tiket</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Pantau dan proses tiket masuk</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors" />
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  );
}