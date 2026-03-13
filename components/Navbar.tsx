'use client';
import * as React from 'react';
import Link from 'next/link';
import { Menu, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
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

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <motion.div
        initial={false}
        animate={{
          width: isScrolled ? '94%' : '100%',
          y:     isScrolled ? 10 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          flex items-center justify-between max-w-7xl w-full
          transition-all duration-300
          ${isScrolled
            ? 'px-4 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-md border border-border \
               bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl'
            : 'px-4 sm:px-10 py-4 sm:py-5 bg-transparent'}
        `}
      >
        {/* LOGO */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            HKBP
          </span>
          <span
            className="text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] sm:tracking-[0.18em] uppercase"
            style={{ color: 'var(--brand)' }}
          >
            165 Tahun
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200 relative group
                text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              {link.name}
              <span
                className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ background: 'var(--brand)' }}
              />
            </a>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          {/* Dark mode toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 sm:w-9 sm:h-9 transition-colors
                text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <Sun  className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* CTA — desktop */}
          <a
            href="#tiket"
            className="hidden md:inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5
                       rounded-full text-sm font-semibold transition-all duration-200
                       hover:opacity-90 hover:scale-105"
            style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}
          >
            Beli Tiket
          </a>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 sm:w-9 sm:h-9 ${
                    isScrolled
                      ? 'text-zinc-600 dark:text-zinc-300'
                      : 'text-zinc-900 dark:text-white'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-72 bg-white dark:bg-zinc-900
                           border-l border-zinc-200 dark:border-zinc-700 px-6"
              >
                <SheetTitle className="mb-1">
                  <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
                    HKBP
                  </span>
                </SheetTitle>
                <p
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-8"
                  style={{ color: 'var(--brand)' }}
                >
                  165 Tahun Bersama
                </p>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium px-3 py-3 rounded-xl
                                 text-zinc-500 hover:text-zinc-900
                                 dark:text-zinc-400 dark:hover:text-white
                                 hover:bg-zinc-100 dark:hover:bg-zinc-800
                                 transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
                <a
                  href="#tiket"
                  onClick={() => setIsOpen(false)}
                  className="mt-8 flex items-center justify-center gap-2 px-4 py-3.5
                             rounded-full text-sm font-semibold"
                  style={{ background: 'var(--brand)', color: 'var(--brand-foreground)' }}
                >
                  Beli Tiket Sekarang
                </a>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </header>
  );
}