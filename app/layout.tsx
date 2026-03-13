import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "HUT ke-165 HKBP",
  description: "Huria Kristen Batak Protestan — Konser Perayaan 7 Oktober 2026",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("scroll-smooth")}
    >
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}