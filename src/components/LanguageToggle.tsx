"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "pt" : "en")}
      className="flex items-center gap-1 px-2 py-1 rounded text-xs text-dark-muted hover:text-dark-text hover:bg-dark-surface transition-colors"
      title={locale === "en" ? "Mudar para Português" : "Switch to English"}
    >
      <span className="text-sm">{locale === "en" ? "🇺🇸" : "🇧🇷"}</span>
      <span className="hidden sm:inline">{locale === "en" ? "EN" : "PT"}</span>
    </button>
  );
}
