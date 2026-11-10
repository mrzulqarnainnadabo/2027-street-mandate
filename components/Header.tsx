"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ISEYC_WORDMARK_SRC, PRODUCT_NAME, CIVIC_BRAIN_URL, CIVIC_OBSERVATORY_URL } from "@/lib/brand";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLang } from "@/components/LanguageProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/states", label: "States" },
  { href: "/blueprints", label: "Blueprints" },
  { href: "/profiles", label: "Profiles" },
  { href: "/explore", label: "Explore" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/report", label: "Report an observation" },
  { href: "/#mandate-form", label: "Submit a demand" },
  { href: "/brief", label: "Brief" },
  { href: "/methodology", label: "Methodology" },
  { href: "/tracked", label: "Tracked" },
 ] as const;

const PRIMARY_NAV = NAV.filter((item) => ["/", "/learn", "/explore", "/intelligence", "/report", "/#mandate-form"].includes(item.href));
const MORE_NAV = NAV.filter((item) => ["/states", "/blueprints", "/profiles", "/brief", "/methodology", "/tracked"].includes(item.href));

const DEPARTMENTS = [
  ["Education & Capacity Building", "education"],
  ["Health & Well-being", "health"],
  ["Software & Technology", "software-technology"],
  ["Civic Department", "civic"],
] as const;

export default function Header() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-forest-500/12 bg-cream/98 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={ISEYC_WORDMARK_SRC} alt="ISEYC — Initiative for Sustainable Evolution for Youth and Community" width={154} height={32}
            className="h-auto w-[126px] shrink-0 object-contain sm:w-[154px]" />
          <div className="min-w-0 text-left">
            <div className="truncate font-display text-[13px] font-bold leading-tight text-forest-800 sm:text-sm">{PRODUCT_NAME}</div>
            <div className="hidden truncate text-[10px] text-forest-500 sm:block">{t("header.tagline")}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 whitespace-nowrap md:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className="rounded px-2 py-1.5 text-[11px] font-semibold text-forest-700 transition hover:bg-forest-50 hover:text-forest-900">
              {item.label}
            </Link>
          ))}
          <details className="relative">
            <summary className="cursor-pointer list-none rounded px-2 py-1.5 text-[11px] font-semibold text-forest-700 transition hover:bg-forest-50">More <span aria-hidden="true">⌄</span></summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-lg border border-forest-500/15 bg-white p-1.5 shadow-lg">
              {MORE_NAV.map((item) => (
                <Link key={item.href} href={item.href}
                  className="block rounded px-3 py-2.5 text-xs font-semibold text-forest-700 hover:bg-forest-50">
                  {item.label === "Brief" ? t("header.brief") : item.label}
                </Link>
              ))}
            </div>
          </details>
          <div className="ml-1 border-l border-forest-500/15 pl-2"><LanguageSwitcher /></div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-forest-500/15 bg-white text-forest-800"
            aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}>
            {open ? <span className="text-lg leading-none" aria-hidden>×</span> :
              <span className="flex flex-col gap-1" aria-hidden><span className="block h-0.5 w-4 bg-forest-700" /><span className="block h-0.5 w-4 bg-forest-700" /><span className="block h-0.5 w-4 bg-forest-700" /></span>}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-forest-500/10 bg-cream md:hidden" role="dialog" aria-label="Site navigation">
          <nav className="mx-auto flex max-w-3xl flex-col px-2 py-2" aria-label="Mobile primary">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}
                className="rounded-md px-3 py-3 text-sm font-semibold text-forest-800 hover:bg-forest-50"
                onClick={() => setOpen(false)}>{item.label === "Brief" ? t("header.brief") : item.label}</Link>
            ))}
          </nav>
        </div>
      ) : null}

      <nav className="border-t border-forest-500/10 bg-white/80" aria-label="ISEYC products and departments">
        <div className="mx-auto flex max-w-3xl items-center gap-2 overflow-x-auto px-4 py-2 text-[11px] font-semibold">
          <span className="shrink-0 uppercase tracking-wider text-forest-500">ISEYC systems</span>
          <span aria-current="page" className="shrink-0 rounded bg-forest-50 px-2.5 py-1.5 text-forest-900">Mandate</span>
          <a className="shrink-0 rounded px-2.5 py-1.5 text-forest-700 hover:bg-forest-50" href={CIVIC_BRAIN_URL} target="_blank" rel="noopener noreferrer">Brain</a>
          <a className="shrink-0 rounded px-2.5 py-1.5 text-forest-700 hover:bg-forest-50" href={CIVIC_OBSERVATORY_URL} target="_blank" rel="noopener noreferrer">Observatory</a>
          <span className="mx-1 h-5 shrink-0 border-l border-forest-500/15" />
          {DEPARTMENTS.map(([label, id]) => (
            <a key={id} className="shrink-0 rounded px-2 py-1.5 text-forest-600 hover:bg-forest-50"
              href={CIVIC_OBSERVATORY_URL + "#/departments/" + id} target="_blank" rel="noopener noreferrer">{label}</a>
          ))}
        </div>
      </nav>
    </header>
  );
}
