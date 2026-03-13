'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number; // ms
  className?: string;
}

export default function FadeInSection({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}