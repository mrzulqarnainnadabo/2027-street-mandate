import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-500/15 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/iseyc-seal.png"
            alt="ISEYC"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <div>
            <div className="font-display text-sm font-bold tracking-wide text-forest-700">
              ISEYC
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gold-600">
              Street Mandate 2027
            </div>
          </div>
        </div>
        <div className="text-right text-[10px] text-forest-500/70">
          Non-partisan
          <br />
          One voice per device
        </div>
      </div>
    </header>
  );
}
