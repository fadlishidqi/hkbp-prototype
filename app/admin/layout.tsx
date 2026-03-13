// app/admin/layout.tsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Sembunyikan navbar jika sedang di halaman login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-8 text-center mt-4">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard" className="p-2 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
          <Link href="/admin/berita" className="p-2 hover:bg-gray-700 rounded">
            Kelola Berita
          </Link>
          <Link href="/admin/tiket" className="p-2 hover:bg-gray-700 rounded">
            Kelola Tiket
          </Link>
          <button 
            onClick={handleLogout}
            className="p-2 bg-red-600 hover:bg-red-700 rounded mt-8 text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}