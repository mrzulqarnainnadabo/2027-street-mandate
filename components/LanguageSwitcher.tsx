"use client";

import { LOCALES } from "@/lib/i18n";
import { useLang } from "@/components/LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLang();

  return (
    <label className="flex items-center gap-1 text-[10px] font-semibold text-forest-700">
      <span className="sr-only">{t("lang.label")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as (typeof LOCALES)[number]["id"])}
        aria-label={t("lang.label")}
        className="min-h-[36px] max-w-[5.5rem] rounded border border-forest-500/20 bg-white px-1.5 text-[10px] text-forest-800 outline-none focus:border-forest-500"
      >
        {LOCALES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.short}
          </option>
        ))}
      </select>
    </label>
  );
}
