'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path jika folder lib berbeda

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Email atau password salah. Silakan coba lagi.');
      setLoading(false);
    } else {
      // Berhasil login, arahkan ke dashboard
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 dark:bg-background relative overflow-hidden px-4">
      
      {/* Background Ornaments (Efek Cahaya Halus) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          
          {/* Header Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative overflow-hidden rounded-full bg-muted/30 p-3 mb-4">
              <Image 
                src="/Logo-HKBP.png" 
                alt="Logo HKBP" 
                width={56} 
                height={56} 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground tracking-tight">
              Login Admin
            </h1>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mt-2 text-brand">
              Konser HUT 165 HKBP
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-xl mb-6"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold tracking-wider uppercase text-muted-foreground">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground/70" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hkbp165.id"
                  className="block w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-300 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold tracking-wider uppercase text-muted-foreground">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground/70" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-300 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-2 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ 
                background: 'var(--brand)', 
                color: 'var(--brand-foreground)',
                boxShadow: '0 4px 14px 0 var(--brand-muted)'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </span>
              {/* Efek Hover Kaca */}
              {!loading && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              )}
            </button>
          </form>

        </div>
        
        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-8 font-medium">
          Halaman ini dibatasi hanya untuk panitia terdaftar.
        </p>
      </motion.div>
    </div>
  );
}