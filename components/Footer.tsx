import Link from "next/link";
import { ISEYC_LOGO_SRC, ISEYC_EMAIL, ISEYC_WEB } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-forest-500/10 bg-forest-900 px-4 py-10 text-center text-cream">
      <img
        src={ISEYC_LOGO_SRC}
        alt="ISEYC"
        width={200}
        height={150}
        className="mx-auto mb-4 h-auto w-44 object-contain"
      />
      <p className="font-display text-base font-bold tracking-wide">ISEYC</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-gold-400">
        Empowering Youth, Shaping Future
      </p>
      <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-cream/70">
        2027 Civic Mandate — a public civic instrument.
        <br />
        Non-partisan. No candidate rankings. No party colours as scores.
      </p>
      <div className="mt-6 flex flex-col items-center gap-2 text-[11px]">
        <Link href="/about" className="font-medium text-gold-400 underline-offset-2 hover:underline">
          Non-partisan charter &amp; rules
        </Link>
        <a
          href={ISEYC_WEB}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gold-400 underline-offset-2 hover:underline"
        >
          www.iseyc.com.ng
        </a>
        <a
          href={`mailto:${ISEYC_EMAIL}`}
          className="font-medium text-cream/80 underline-offset-2 hover:text-gold-400 hover:underline"
        >
          {ISEYC_EMAIL}
        </a>
      </div>
    </footer>
  );
}
