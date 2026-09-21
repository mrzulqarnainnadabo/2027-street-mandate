import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-500/12 bg-cream/98 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={ISEYC_SEAL_SRC}
            alt="ISEYC official seal"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full bg-white object-contain ring-1 ring-forest-500/15"
          />
          <div className="min-w-0 text-left">
            <div className="truncate font-display text-[13px] font-bold leading-tight text-forest-800">
              ISEYC 2027 Civic Mandate
            </div>
            <div className="text-[10px] text-forest-500">National civic instrument · non-partisan</div>
          </div>
        </Link>
        <nav className="flex shrink-0 items-center gap-3 text-[11px] font-semibold text-forest-700">
          <Link href="/brief" className="underline-offset-2 hover:underline">
            Brief
          </Link>
          <Link href="/about" className="underline-offset-2 hover:underline">
            Charter
          </Link>
        </nav>
      </div>
    </header>
  );
}
