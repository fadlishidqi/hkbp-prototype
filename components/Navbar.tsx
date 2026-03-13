'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useLenis } from 'lenis/react'; // IMPORT LENIS
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

const navLinks = [
  { name: 'Beranda',  href: '#home'   },
  { name: 'Tentang',  href: '#about'  },
  { name: 'Jadwal',   href: '#jadwal' },
  { name: 'Berita',   href: '#berita' },
  { name: 'Tiket',    href: '#tiket'  },
];

export default function Navbar() {
  const [isOpen, setIsOpen]         = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted]       = React.useState(false);
  const { theme, setTheme }         = useTheme();
  
  // Ambil instance Lenis untuk kontrol scroll manual
  const lenis = useLenis();

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fungsi khusus untuk menangani klik pada link Anchor (#)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault(); // Cegah HTML lompat instan
      
      // Suruh Lenis scroll perlahan ke target
      lenis?.scrollTo(href, {
        offset: -90, // Beri jarak 90px dari atas agar judul tidak tertutup Navbar
        duration: 1.2, // Kecepatan scroll yang elegan
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Kurva animasi premium
      });
      
      setIsOpen(false); // Tutup menu mobile (jika sedang terbuka)
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none px-4 sm:px-6">
      <motion.div
        initial={false}
        animate={{
          y: isScrolled ? 16 : 0,
          width: isScrolled ? '100%' : '100%',
          maxWidth: isScrolled ? '1024px' : '1280px',
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`
          pointer-events-auto flex items-center justify-between w-full
          transition-colors duration-500
          ${isScrolled
            ? 'px-5 sm:px-8 py-3.5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border/40 \
               bg-background/70 backdrop-blur-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]'
            : 'px-2 sm:px-4 py-6 bg-transparent border-transparent'}
        `}
      >
        {/* LOGO */}
        <Link href="/" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-full">
            <Image 
              src="/Logo-HKBP.png" 
              alt="Logo HKBP" 
              width={64} 
              height={64} 
              className="w-14 sm:w-16 h-auto object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
              HKBP
            </span>
            <span
              className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5"
              style={{ color: 'var(--brand)' }}
            >
              165 Tahun
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)} // Pasang fungsi click di sini
              className="text-sm font-semibold transition-all duration-300 relative group
                         text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {link.name}
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: 'var(--brand)' }}
              />
            </a>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Sun  className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* CTA — desktop */}
          <a
            href="#tiket"
            onClick={(e) => handleNavClick(e, '#tiket')} // Pasang juga di tombol Beli Tiket
            className="hidden md:inline-flex relative group items-center justify-center gap-2 px-6 py-2.5
                       rounded-full text-sm font-bold transition-all duration-300
                       hover:scale-105 hover:-translate-y-0.5 overflow-hidden cursor-pointer"
            style={{ 
              background: 'var(--brand)', 
              color: 'var(--brand-foreground)',
              boxShadow: '0 4px 14px 0 var(--brand-muted)' 
            }}
          >
            <span className="relative z-10">Beli Tiket</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </a>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-foreground hover:bg-muted/50">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background border-l border-border/50 px-6 py-8">
                <SheetTitle className="mb-2 flex items-center gap-3">
                  <Image src="/Logo-HKBP.png" alt="Logo" width={32} height={32} className="w-8 h-auto" />
                  <span className="text-2xl font-bold text-foreground font-heading tracking-tight">HKBP</span>
                </SheetTitle>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-10" style={{ color: 'var(--brand)' }}>
                  165 Tahun Konser Perayaan
                </p>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)} // Pasang di menu mobile
                      className="text-lg font-medium px-4 py-3.5 rounded-2xl
                                 text-muted-foreground hover:text-foreground cursor-pointer
                                 hover:bg-muted/50 transition-all duration-300 active:scale-95"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                  <a
                    href="#tiket"
                    onClick={(e) => handleNavClick(e, '#tiket')} // Pasang di CTA mobile
                    className="flex items-center justify-center gap-2 w-full px-4 py-4 cursor-pointer
                               rounded-full text-sm font-bold shadow-lg transition-transform active:scale-95"
                    style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}
                  >
                    Beli Tiket Sekarang
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </header>
  );
}