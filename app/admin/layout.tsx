'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Newspaper, 
  Ticket, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
  { href: '/admin/berita', label: 'Manajemen Berita', icon: Newspaper },
  { href: '/admin/tiket', label: 'Kelola Tiket', icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // --- KOMPONEN SIDEBAR ---
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden w-[256px]">
      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-8 px-2 whitespace-nowrap">
        <div className="relative overflow-hidden rounded-full bg-muted/40 p-1.5 border border-border/50 flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center">
          <Image 
            src="/Logo-HKBP.png" 
            alt="Logo HKBP" 
            width={36} 
            height={36} 
            className="w-8 h-8 object-contain"
          />
        </div>
        <div 
          className={cn(
            "flex flex-col overflow-hidden transition-opacity duration-300", 
            isHovered ? "opacity-100" : "md:opacity-0 opacity-100"
          )}
        >
          <span className="font-heading font-bold text-lg tracking-tight leading-none text-foreground truncate">
            HKBP 165
          </span>
          <span className="text-[8px] font-bold tracking-[0.2em] uppercase mt-1 text-brand truncate">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex flex-col gap-1.5 flex-1", isHovered ? "w-full" : "w-auto md:w-full")}>
        <div 
          className={cn(
            "text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2 px-2 transition-opacity duration-300 whitespace-nowrap",
            isHovered ? "opacity-100" : "md:opacity-0 opacity-100"
          )}
        >
          Menu Utama
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}>
              <div
                className={cn(
                  'group flex items-center py-2.5 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden whitespace-nowrap',
                  isHovered ? 'px-3' : 'md:px-1.5 px-3',
                  isActive 
                    ? 'bg-brand/10 text-brand shadow-[inset_3px_0_0_0_var(--brand)]' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  !isHovered && !isActive && 'md:hover:bg-transparent md:hover:text-muted-foreground' // Clean look when collapsed unhovered
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                     <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                  </div>
                  <span 
                    className={cn(
                      "text-sm transition-all duration-300 truncate", 
                      isActive ? "font-bold" : "font-medium",
                      isHovered ? "opacity-100 w-auto" : "md:opacity-0 md:w-0 opacity-100 w-auto"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight 
                    className={cn(
                      "w-3.5 h-3.5 opacity-70 ml-auto transition-opacity duration-300 flex-shrink-0",
                      isHovered ? "opacity-70" : "md:opacity-0 opacity-70"
                    )} 
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar (Logout) */}
      <div className={cn("mt-auto pt-6 border-t border-border/50 whitespace-nowrap", isHovered ? "w-full" : "w-auto md:w-full")}>
        <button
          onClick={handleLogout}
          className={cn(
            "group flex items-center rounded-xl text-sm font-medium text-muted-foreground transition-all duration-300 overflow-hidden",
            isHovered ? "px-3 py-2.5 hover:bg-destructive/10 hover:text-destructive shadow-[inset_0_0_0_0_var(--destructive)] hover:shadow-[inset_3px_0_0_0_var(--destructive)] w-full" : "md:px-2 md:py-2 px-3 py-2.5 md:hover:bg-transparent hover:bg-destructive/10 md:w-auto w-full"
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
             <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:text-destructive md:group-hover:-translate-x-0 group-hover:-translate-x-1" />
          </div>
          <span 
             className={cn(
                 "transition-opacity duration-300 ml-3 truncate",
                 isHovered ? "opacity-100 md:w-auto" : "md:opacity-0 md:w-0 opacity-100 w-auto"
             )}
          >Keluar Sistem</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-background flex overflow-hidden selection:bg-brand/20 selection:text-brand">
      
      {/* ── DESKTOP SIDEBAR ── */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-card/50 backdrop-blur-xl border-r border-border/50 py-5 z-20 shadow-[4px_0_24px_rgb(0,0,0,0.02)] transition-[width,padding] duration-300 ease-in-out overflow-hidden h-screen sticky top-0 items-start",
          isHovered ? "w-64 px-5" : "w-[80px] px-3.5"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderSidebarContent()}
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border p-5 z-50 flex flex-col md:hidden shadow-2xl overflow-y-auto"
            >
              {/* Force Mobile View Properties explicitly overriding Desktop Sidebar's constraints based on hover */}
              <div className="w-[216px] h-full flex flex-col opacity-100"> 
                <div className="flex flex-col h-full overflow-hidden w-full opacity-100">
                  {/* Brand Header */}
                  <div className="flex items-center gap-4 mb-8 px-2 whitespace-nowrap opacity-100">
                    <div className="relative overflow-hidden rounded-full bg-muted/40 p-1.5 border border-border/50 flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center opacity-100">
                      <Image 
                        src="/Logo-HKBP.png" 
                        alt="Logo HKBP" 
                        width={36} 
                        height={36} 
                        className="w-8 h-8 object-contain opacity-100"
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden transition-opacity duration-300 opacity-100">
                      <span className="font-heading font-bold text-lg tracking-tight leading-none text-foreground truncate opacity-100">
                        HKBP 165
                      </span>
                      <span className="text-[8px] font-bold tracking-[0.2em] uppercase mt-1 text-brand truncate opacity-100">
                        Admin Panel
                      </span>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-col gap-1.5 flex-1 w-full opacity-100">
                    <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2 px-2 transition-opacity duration-300 whitespace-nowrap opacity-100">
                      Menu Utama
                    </div>
                    {navItems.map(({ href, label, icon: Icon }) => {
                      const isActive = pathname === href;
                      return (
                        <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}>
                          <div
                            className={cn(
                              'group flex items-center py-2.5 px-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden whitespace-nowrap opacity-100',
                              isActive 
                                ? 'bg-brand/10 text-brand shadow-[inset_3px_0_0_0_var(--brand)]' 
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            )}
                          >
                            <div className="flex items-center gap-3 opacity-100">
                              <div className="flex items-center justify-center w-8 h-8 flex-shrink-0 opacity-100">
                                 <Icon className={cn("w-5 h-5 transition-transform duration-300 opacity-100", isActive ? "scale-110" : "group-hover:scale-110")} />
                              </div>
                              <span className={cn("text-sm transition-all duration-300 truncate opacity-100 w-auto", isActive ? "font-bold" : "font-medium")}>
                                {label}
                              </span>
                            </div>
                            {isActive && (
                              <ChevronRight className="w-3.5 h-3.5 opacity-70 ml-auto transition-opacity duration-300 flex-shrink-0" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Footer Sidebar (Logout) */}
                  <div className="mt-auto pt-6 border-t border-border/50 whitespace-nowrap w-full opacity-100">
                    <button
                      onClick={handleLogout}
                      className="group flex items-center rounded-xl text-sm font-medium text-muted-foreground transition-all duration-300 overflow-hidden px-3 py-2.5 hover:bg-destructive/10 hover:text-destructive shadow-[inset_0_0_0_0_var(--destructive)] hover:shadow-[inset_3px_0_0_0_var(--destructive)] w-full opacity-100"
                    >
                      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0 opacity-100">
                         <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:text-destructive group-hover:-translate-x-1 opacity-100" />
                      </div>
                      <span className="transition-opacity duration-300 ml-3 truncate opacity-100 w-auto">Keluar Sistem</span>
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-5 right-5 p-2 bg-muted rounded-full text-muted-foreground z-50"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* ── TOP HEADER (CLEANED UP) ── */}
        <header className="h-20 border-b border-border/50 bg-card/40 backdrop-blur-md flex items-center justify-between px-6 sm:px-10 z-10">
          
          {/* Bagian Kiri: Hanya tombol menu di Mobile */}
          <div>
            <button 
              className="md:hidden p-2 -ml-2 bg-muted/50 hover:bg-muted rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </div>
          
          {/* Bagian Kanan Header: Theme Toggle + Status */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/80 bg-background/50 border border-border/50"
              >
                <Sun  className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-full border border-border/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                Sistem Aktif
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content (FIXED SCROLL ISSUE) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10 relative pb-24 touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-7xl mx-auto pb-10" // <-- Diubah dari h-full agar bisa di-scroll
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}