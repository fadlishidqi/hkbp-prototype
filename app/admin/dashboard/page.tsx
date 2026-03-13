// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Cek apakah user sudah login
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login'); // Tendang ke halaman login jika belum login
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="p-8">Memuat dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Selamat datang di panel admin. Di sini nanti kita akan menambahkan fitur kelola Berita dan Tiket.</p>
      
      <button 
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/admin/login');
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}