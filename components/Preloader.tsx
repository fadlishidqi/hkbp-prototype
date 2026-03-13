'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kunci scroll halaman selama Preloader aktif
    document.body.style.overflow = 'hidden';
    
    // Durasi preloader: 2.2 detik (waktu yang pas, tidak terlalu lama/cepat)
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Kembalikan kemampuan scroll setelah tirai terangkat
      document.body.style.overflow = '';
    }, 2200); 

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          // Animasi "Tirai Terangkat" saat exit
          initial={{ y: 0 }}
          exit={{ y: '-100vh' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} // Kurva cubic-bezier premium
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background border-b border-border/50"
        >
          {/* Kontainer Logo & Teks */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* Logo HKBP */}
            <div className="relative overflow-hidden rounded-full bg-muted/20 p-5 md:p-6 shadow-[0_0_40px_var(--brand-muted)]">
              <Image
                src="/Logo-HKBP.png"
                alt="Logo HKBP"
                width={160}
                height={160}
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
                priority // Paksa load gambar ini duluan
              />
            </div>
            
            {/* Teks Judul */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight">
                HKBP
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-2 text-brand">
                165 Tahun 
              </span>
            </motion.div>
          </motion.div>

          {/* Garis Loading (Progress Bar) Estetik */}
          <motion.div 
            className="absolute bottom-1/4 w-48 h-[2px] bg-border/50 overflow-hidden rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div 
              className="h-full bg-brand"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              // Animasi meluncur berulang hingga preloader hilang
              transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}