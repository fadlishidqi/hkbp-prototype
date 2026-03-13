export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-xl font-extrabold text-foreground">HKBP</p>
          <p
            className="text-xs font-semibold tracking-[0.15em] uppercase mt-0.5"
            style={{ color: 'var(--brand)' }}
          >
            165 Tahun Bersama
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} HKBP. Soli Deo Gloria.
        </p>
      </div>
    </footer>
  );
}