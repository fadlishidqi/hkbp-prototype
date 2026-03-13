import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";

// Font untuk paragraf & UI (Modern, bersih, mudah dibaca)
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Font untuk Heading / Judul (Elegan, mewah, berwibawa)
const fontHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// ─── UPGRADE: SEO & Social Media Meta Tags dengan Template ───
export const metadata: Metadata = {
  metadataBase: new URL('https://hkbp-prototype.vercel.app'), // Domain deployment Vercel
  title: {
    default: "HUT ke-165 HKBP", // Judul halaman utama
    template: "%s | HUT 165 HKBP", // Otomatis menambah nama brand di halaman lain
  },
  description: "Portal resmi perayaan HUT ke-165 HKBP. Temukan informasi terbaru seputar kegiatan panitia, berita terkini, dan jadwal tur konser di 65 kota.",
  keywords: ["HKBP", "HUT HKBP 165", "Konser HKBP", "Berita HKBP", "Jadwal Konser HKBP", "Tiket Konser HKBP"],
  openGraph: {
    title: "HUT ke-165 HKBP",
    description: "Website resmi HUT ke-165 HKBP. Dapatkan update berita kegiatan kepanitiaan dan info lengkap tur konser di 65 kota di Indonesia.",
    url: "https://hkbp-prototype.vercel.app",
    siteName: "HUT 165 HKBP",
    images: [
      {
        url: "/og-image.png", // Akan membaca file di folder public/og-image.png
        width: 1200,
        height: 630,
        alt: "HUT 165 HKBP",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HUT ke-165 HKBP",
    description: "Website resmi HUT ke-165 HKBP. Dapatkan update berita kegiatan road to 165 dan informasi tur konser di 65 kota di Indonesia.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          fontSans.variable,
          fontHeading.variable,
          fontSans.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Layar Loading Teatrikal */}
          <Preloader /> 
          
          {/* Smooth Scrolling (Lenis) */}
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}