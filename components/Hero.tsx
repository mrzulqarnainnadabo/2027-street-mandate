import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

export default function Hero({ total, states }: { total: number; states: number }) {
  return (
    <section className="px-4 pb-4 pt-8 text-center">
      <div className="mb-4 flex justify-center">
        <img
          src={ISEYC_SEAL_SRC}
          alt="ISEYC"
          width={80}
          height={80}
          className="h-20 w-20 rounded-full bg-white object-contain p-0.5 shadow-md ring-2 ring-gold-400/40"
        />
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
        Initiative for Sustainable Evolution for Youth and Community
      </p>

      <h1 className="font-display text-2xl font-bold leading-tight text-forest-900 sm:text-3xl">
        Don’t tell them who you’ll vote for.
        <br />
        <span className="text-forest-500">Tell them what they must deliver.</span>
      </h1>

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-forest-700/85">
        A non-partisan public place for one concrete demand, tied to the right office and your
        state. ISEYC reviews before anything appears on the wall — never a horse-race poll.
      </p>

      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-forest-500">
        Start below · Choose what public office must deliver
      </p>

      <div className="mt-5 flex justify-center gap-3">
        <div className="paper-card min-w-[100px] rounded-xl px-4 py-2.5">
          <div className="font-display text-xl font-bold text-forest-500">{total}</div>
          <div className="text-[10px] uppercase tracking-wider text-forest-700/60">
            Published on wall
          </div>
        </div>
        <div className="paper-card min-w-[100px] rounded-xl px-4 py-2.5">
          <div className="font-display text-xl font-bold text-forest-500">{states}</div>
          <div className="text-[10px] uppercase tracking-wider text-forest-700/60">
            States on wall
          </div>
        </div>
      </div>
      <p className="mx-auto mt-2 max-w-xs text-[10px] leading-snug text-forest-500/80">
        Counts show published mandates currently loaded — not a national census or popularity score.
      </p>

      <div className="mt-4">
        <Link
          href="/about"
          className="inline-flex items-center rounded-full border border-forest-500/20 bg-white/80 px-3 py-1.5 text-[11px] font-medium text-forest-600 shadow-sm transition hover:border-forest-500/40"
        >
          Read the non-partisan charter
        </Link>
      </div>
    </section>
  );
}
