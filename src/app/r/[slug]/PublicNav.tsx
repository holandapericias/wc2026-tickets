"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";

export default function PublicNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const base = `/r/${slug}`;
  const links = [
    { href: base, label: t("dashboard"), match: (p: string) => p === base },
    {
      href: `${base}/market`,
      label: t("market"),
      match: (p: string) => p === `${base}/market`,
    },
    {
      href: `${base}/scraper`,
      label: t("scraper"),
      match: (p: string) => p === `${base}/scraper`,
    },
  ];

  return (
    <nav className="border-b border-dark-border bg-dark-card sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between h-14">
        <Link href={base} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-fifa-red flex items-center justify-center text-white font-bold text-sm">
            WC
          </div>
          <span className="font-semibold text-dark-text hidden sm:inline">
            {t("robertoTickets")}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                link.match(pathname)
                  ? "bg-fifa-red text-white"
                  : "text-dark-muted hover:text-dark-text hover:bg-dark-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 border-l border-dark-border pl-2">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
