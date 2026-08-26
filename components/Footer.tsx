import { ISEYC_LOGO_SRC, CIVIC_BRAIN_URL } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-forest-500/10 bg-forest-900 px-4 py-10 text-center text-cream">
      <img
        src={ISEYC_LOGO_SRC}
        alt="ISEYC — Initiative for Sustainable Evolution for the Youth and Community"
        width={96}
        height={96}
        className="mx-auto mb-4 h-24 w-24 rounded-full bg-white object-contain p-1 ring-2 ring-gold-400/50"
      />
      <p className="font-display text-base font-bold tracking-wide">ISEYC</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-gold-400">
        Empowering Youth, Shaping Future
      </p>
      <p className="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed text-cream/50">
        Initiative for Sustainable Evolution for the Youth and Community
      </p>
      <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-cream/65">
        Non-partisan. No party colours. No candidate names.
        <br />
        The 2027 Street Mandate is a public civic instrument owned by ISEYC.
      </p>
      <div className="mt-6 flex flex-col items-center gap-2.5 text-[11px]">
        <a
          href="https://www.iseyc.com.ng"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gold-400 underline-offset-2 hover:underline"
        >
          www.iseyc.com.ng
        </a>
        <a
          href={CIVIC_BRAIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-gold-400/40 bg-forest-800 px-4 py-2 font-medium text-gold-400 transition hover:bg-forest-700"
        >
          Open ISEYC Civic Brain →
        </a>
      </div>
    </footer>
  );
}
