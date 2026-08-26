import { ISEYC_SEAL_SRC } from "@/lib/brand";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-500/15 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={ISEYC_SEAL_SRC}
            alt="ISEYC — Initiative for Sustainable Evolution for the Youth and Community"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full bg-white object-contain shadow-sm ring-1 ring-forest-500/20"
          />
          <div className="min-w-0">
            <div className="font-display text-sm font-bold tracking-wide text-forest-700">
              ISEYC
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gold-600">
              Street Mandate 2027
            </div>
          </div>
        </div>
        <div className="text-right text-[10px] leading-snug text-forest-500/70">
          Non-partisan
          <br />
          One voice per device
        </div>
      </div>
    </header>
  );
}
