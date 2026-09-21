import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-500/15 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 border-t-2 border-gold-400 px-4 py-2.5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img
            src={ISEYC_SEAL_SRC}
            alt="ISEYC official seal"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full bg-white object-contain"
          />
          <div className="min-w-0 text-left">
            <div className="font-display text-[13px] font-bold uppercase leading-tight tracking-[0.06em] text-forest-900">
              ISEYC 2027 Civic Mandate
            </div>
            <div className="mt-0.5 text-[10px] leading-tight text-forest-600">
              National civic instrument · non-partisan
            </div>
          </div>
        </Link>
        <Link
          href="/about"
          className="shrink-0 border-l border-forest-500/15 pl-3 text-[11px] font-semibold text-forest-700 underline-offset-2 hover:underline"
        >
          Charter
        </Link>
      </div>
    </header>
  );
}
