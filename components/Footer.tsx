import Link from "next/link";
import { CIVIC_BRAIN_URL, CIVIC_OBSERVATORY_URL, ISEYC_SEAL_SRC, ISEYC_EMAIL, ISEYC_WEB, PRODUCT_NAME } from "@/lib/brand";

const DEPARTMENTS = [
  ["Education & Capacity Building", "education"],
  ["Health & Well-being", "health"],
  ["Software & Technology", "software-technology"],
  ["Civic Department", "civic"],
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-forest-500/10 bg-forest-900 text-cream">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={ISEYC_SEAL_SRC} alt="ISEYC official seal" width={40} height={40}
              className="h-10 w-10 rounded-full bg-white object-contain" />
            <div>
              <p className="font-display text-sm font-bold text-cream">{PRODUCT_NAME}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-gold-400">ISEYC · Non-partisan</p>
            </div>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-cream/75">
            A reviewed public record of citizen demands on public office — organised by place and responsibility.
            Not a poll. Not an endorsement. Publication is not independent verification.
          </p>
        </div>

        <div className="mt-8 border-t border-cream/10 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-400">ISEYC digital systems</p>
          <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-medium" aria-label="ISEYC products">
            <span className="text-cream">Civic Mandate Nigeria</span>
            <a href={CIVIC_BRAIN_URL} target="_blank" rel="noopener noreferrer" className="text-gold-400 underline-offset-2 hover:underline">Civic Brain</a>
            <a href={CIVIC_OBSERVATORY_URL} target="_blank" rel="noopener noreferrer" className="text-gold-400 underline-offset-2 hover:underline">Civic Intelligence Observatory</a>
          </nav>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-400">Institutional departments</p>
          <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[12px]" aria-label="ISEYC departments">
            {DEPARTMENTS.map(([label, id]) => <a key={id}
              href={CIVIC_OBSERVATORY_URL + "#/departments/" + id} target="_blank" rel="noopener noreferrer"
              className="text-cream/80 underline-offset-2 hover:text-gold-400 hover:underline">{label}</a>)}
          </nav>
        </div>

        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-medium" aria-label="Methodology and charter">
          <Link href="/methodology" className="text-gold-400 underline-offset-2 hover:underline">Methodology</Link>
          <Link href="/about" className="text-gold-400 underline-offset-2 hover:underline">Non-partisan charter</Link>
          <Link href="/report" className="text-gold-400 underline-offset-2 hover:underline">Report an observation</Link>
          <a href={ISEYC_WEB} target="_blank" rel="noopener noreferrer" className="text-gold-400 underline-offset-2 hover:underline">ISEYC website</a>
          <a href={`mailto:${ISEYC_EMAIL}`} className="text-gold-400 underline-offset-2 hover:underline">Contact</a>
        </nav>
        <p className="mt-6 border-t border-cream/10 pt-5 text-[11px] text-cream/60">
          ISEYC | Strictly Non-Partisan | www.iseyc.com.ng
        </p>
        <div className="mt-3 flex flex-col gap-1 text-[11px] text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <a href={ISEYC_WEB} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">www.iseyc.com.ng</a>
          <a href={`mailto:${ISEYC_EMAIL}`} className="hover:text-gold-400">{ISEYC_EMAIL}</a>
        </div>
      </div>
    </footer>
  );
}
