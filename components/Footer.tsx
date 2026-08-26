import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-forest-500/10 bg-forest-900 px-4 py-8 text-center text-cream">
      <Image
        src="/iseyc-seal.png"
        alt="ISEYC"
        width={56}
        height={56}
        className="mx-auto mb-3 rounded-full"
      />
      <p className="font-display text-sm font-bold">ISEYC</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-gold-400">
        Empowering Youth, Shaping Future
      </p>
      <p className="mx-auto mt-4 max-w-xs text-xs text-cream/60">
        Non-partisan. No party colours. No candidate names.  
        The 2027 Street Mandate is a public civic instrument.
      </p>
      <p className="mt-4 text-[10px] text-cream/40">
        www.iseyc.com.ng
      </p>
    </footer>
  );
}
