import Link from "next/link";
import { ISEYC_SEAL_SRC, ISEYC_EMAIL, ISEYC_WEB, PRODUCT_NAME } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-forest-500/10 bg-forest-900 text-cream">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ISEYC_SEAL_SRC}
              alt="ISEYC official seal"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full bg-white object-contain"
            />
            <div>
              <p className="font-display text-sm font-bold text-cream">{PRODUCT_NAME}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-gold-400">
                ISEYC · Non-partisan
              </p>
            </div>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-cream/75">
            A reviewed public record of citizen demands on public office — organised by place and
            responsibility. Not a poll, ranking, or campaign tool.
          </p>
        </div>

        <nav
          className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-medium"
          aria-label="Footer"
        >
          <Link href="/" className="text-gold-400 underline-offset-2 hover:underline">
            Home
          </Link>
          <Link href="/intelligence" className="text-gold-400 underline-offset-2 hover:underline">
            Intelligence
          </Link>
          <Link href="/states" className="text-gold-400 underline-offset-2 hover:underline">
            States
          </Link>
          <Link href="/brief" className="text-gold-400 underline-offset-2 hover:underline">
            State Brief
          </Link>
          <Link href="/blueprints" className="text-gold-400 underline-offset-2 hover:underline">
            Blueprints
          </Link>
          <Link href="/map" className="text-gold-400 underline-offset-2 hover:underline">
            Responsibility map
          </Link>
          <Link href="/methodology" className="text-gold-400 underline-offset-2 hover:underline">
            Methodology
          </Link>
          <Link href="/about" className="text-gold-400 underline-offset-2 hover:underline">
            Charter
          </Link>
        </nav>

        <div className="mt-6 flex flex-col gap-1 border-t border-cream/10 pt-5 text-[11px] text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={ISEYC_WEB}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-400"
          >
            www.iseyc.com.ng
          </a>
          <a href={`mailto:${ISEYC_EMAIL}`} className="hover:text-gold-400">
            {ISEYC_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
