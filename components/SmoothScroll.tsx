'use client';
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Matikan efek Lenis Smooth Scroll di seluruh halaman Admin 
  // karena admin panel membutuhkan native scrolling untuk dashboard, tabel, dan sidebar
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}