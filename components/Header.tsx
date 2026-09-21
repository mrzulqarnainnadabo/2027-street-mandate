import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-500/15 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img
            src={ISEYC_SEAL_SRC}
            alt="ISEYC official seal"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full bg-white object-contain shadow-sm ring-1 ring-forest-500/20"
          />
          <div className="min-w-0 text-left">
            <div className="truncate font-display text-sm font-bold tracking-wide text-forest-700">
              ISEYC 2027 Civic Mandate
            </div>
            <div className="text-[10px] leading-snug text-forest-500">
              Non-partisan · Demands, not rankings
            </div>
          </div>
        </Link>
        <Link
          href="/about"
          className="shrink-0 rounded-full border border-forest-500/20 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-forest-700 transition hover:border-forest-500/40"
        >
          Charter
        </Link>
      </div>
    </header>
  );
}
