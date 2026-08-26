export default function Footer() {
  return (
    <footer className="border-t border-forest-500/10 bg-forest-900 px-4 py-10 text-center text-cream">
      <img
        src="/iseyc-seal.svg"
        alt="ISEYC"
        width={72}
        height={72}
        className="mx-auto mb-4 h-[72px] w-[72px] rounded-full ring-2 ring-gold-400/40"
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
      <a
        href="https://www.iseyc.com.ng"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block text-[11px] font-medium text-gold-400 underline-offset-2 hover:underline"
      >
        www.iseyc.com.ng
      </a>
    </footer>
  );
}
