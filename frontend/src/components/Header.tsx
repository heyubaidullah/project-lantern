export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dbe9ee]/80 bg-[#F7FBFC]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6FAFCF] to-[#8CC7C3] shadow-[0_10px_30px_rgba(111,175,207,0.25)]">
            <span className="text-sm font-semibold text-white">ه</span>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#5A6B75]">
              One Ayah Forward
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-[#1E2D38]">
              Al-Huda
            </h1>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <button className="rounded-full px-4 py-2 text-sm font-medium text-[#5A6B75] transition hover:bg-white hover:text-[#1E2D38]">
            Today
          </button>
          <button className="rounded-full px-4 py-2 text-sm font-medium text-[#5A6B75] transition hover:bg-white hover:text-[#1E2D38]">
            Pathways
          </button>
          <button className="rounded-full px-4 py-2 text-sm font-medium text-[#5A6B75] transition hover:bg-white hover:text-[#1E2D38]">
            Progress
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden rounded-full border border-[#D6E8EF] bg-white px-4 py-2 text-sm font-medium text-[#1E2D38] transition hover:border-[#6FAFCF] hover:text-[#6FAFCF] sm:inline-flex">
            Resume
          </button>
          <button className="rounded-full bg-[#1E2D38] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Begin today
          </button>
        </div>
      </div>
    </header>
  );
}