import LanguageToggle from "@/components/LanguageToggle";

export default function PublicPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-dark-border bg-dark-card sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-fifa-red flex items-center justify-center text-white font-bold text-sm">
              WC
            </div>
            <span className="font-semibold text-dark-text hidden sm:inline">
              WC2026
            </span>
          </div>
          <LanguageToggle />
        </div>
      </header>
      <main className="max-w-[1600px] mx-auto px-4 py-6">{children}</main>
    </>
  );
}
