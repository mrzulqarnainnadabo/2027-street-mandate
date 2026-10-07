"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ISEYC_SEAL_SRC, PRODUCT_NAME } from "@/lib/brand";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLang } from "@/components/LanguageProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/states", label: "States" },
  { href: "/blueprints", label: "Blueprints" },
  { href: "/profiles", label: "Profiles" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/brief", label: "Brief" },
  { href: "/methodology", label: "Methodology" },
  { href: "/tracked", label: "Tracked" },
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
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <img
            src={ISEYC_SEAL_SRC}
            alt="ISEYC official seal"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full bg-white object-contain ring-1 ring-forest-500/15"
          />
          <div className="min-w-0 text-left">
            <div className="truncate font-display text-[13px] font-bold leading-tight text-forest-800 sm:text-sm">
              {PRODUCT_NAME}
            </div>
            <div className="hidden truncate text-[10px] text-forest-500 sm:block">
              {t("header.tagline")}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {NAV.filter((n) => n.href !== "/").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2.5 py-1.5 text-[12px] font-semibold text-forest-700 transition hover:bg-forest-50 hover:text-forest-900"
            >
              {item.label === "Brief" ? t("header.brief") : item.label}
            </Link>
          ))}
          <div className="ml-1 border-l border-forest-500/15 pl-2">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile: language + menu */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-forest-500/15 bg-white text-forest-800"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <span className="text-lg leading-none" aria-hidden>
                ×
              </span>
            ) : (
              <span className="flex flex-col gap-1" aria-hidden>
                <span className="block h-0.5 w-4 bg-forest-700" />
                <span className="block h-0.5 w-4 bg-forest-700" />
                <span className="block h-0.5 w-4 bg-forest-700" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-forest-500/10 bg-cream md:hidden"
          role="dialog"
          aria-label="Site navigation"
        >
          <nav className="mx-auto flex max-w-3xl flex-col px-2 py-2" aria-label="Mobile primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-semibold text-forest-800 hover:bg-forest-50"
                onClick={() => setOpen(false)}
              >
                {item.label === "Brief" ? t("header.brief") : item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
