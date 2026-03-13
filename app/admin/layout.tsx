'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Newspaper, Ticket, LogOut } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/berita', label: 'Kelola Berita', icon: Newspaper },
  { href: '/admin/tiket', label: 'Kelola Tiket', icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-muted/40 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-background border-r flex flex-col min-h-screen p-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <Separator className="mb-4" />

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant={pathname === href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2',
                  pathname === href && 'font-semibold'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <Separator className="my-4" />

        <Button
          variant="destructive"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}