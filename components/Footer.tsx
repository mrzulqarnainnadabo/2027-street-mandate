import Link from "next/link";
import { ISEYC_LOGO_SRC, ISEYC_EMAIL, ISEYC_WEB } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-forest-500/10 bg-forest-900 px-4 py-10 text-center text-cream">
      <img
        src={ISEYC_LOGO_SRC}
        alt="ISEYC official logo"
        width={900}
        height={605}
        className="mx-auto mb-5 h-auto w-56 object-contain sm:w-64"
      />
      <p className="text-[10px] uppercase tracking-[0.18em] text-gold-400">
        2027 Civic Mandate
      </p>
      <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-cream/70">
        A public civic instrument by ISEYC.
        <br />
        Non-partisan. No candidate rankings. No party colours as scores.
      </p>
      <div className="mt-6 flex flex-col items-center gap-2 text-[11px]">
        <Link href="/map" className="font-medium text-gold-400 underline-offset-2 hover:underline">
          Responsibility map (duty → office)
        </Link>
        <Link href="/about" className="font-medium text-gold-400 underline-offset-2 hover:underline">
          Charter, methodology &amp; rules
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
