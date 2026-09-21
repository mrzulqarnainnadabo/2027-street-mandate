import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

export default function Hero({ total, states }: { total: number; states: number }) {
  return (
    <section className="px-4 pb-2 pt-7 text-center">
      <div className="mb-3 flex justify-center">
        <img
          src={ISEYC_SEAL_SRC}
          alt="ISEYC"
          width={64}
          height={64}
          className="h-16 w-16 rounded-full bg-white object-contain ring-1 ring-forest-500/20"
        />
      </div>

      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
        ISEYC · National civic instrument
      </p>

      <h1 className="font-display text-[1.65rem] font-bold leading-[1.25] text-forest-900 sm:text-3xl">
        Don’t tell them who you’ll vote for.
        <br />
        <span className="text-forest-500">Tell them what they must deliver.</span>
      </h1>

      <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-forest-700/90">
        One concrete demand. The right office. Your state. Reviewed by ISEYC before it enters the
        public wall — never a popularity contest.
      </p>

      <div className="mx-auto mt-5 flex max-w-xs justify-center gap-6 border-y border-forest-500/10 py-3 text-left">
        <div>
          <div className="font-display text-xl font-bold tabular-nums text-forest-700">{total}</div>
          <div className="text-[10px] uppercase tracking-wide text-forest-500">On the wall</div>
        </div>
        <div className="w-px bg-forest-500/15" />
        <div>
          <div className="font-display text-xl font-bold tabular-nums text-forest-700">{states}</div>
          <div className="text-[10px] uppercase tracking-wide text-forest-500">States heard</div>
        </div>
      </div>
      <p className="mt-1.5 text-[10px] text-forest-500/75">Published mandates only · not a poll</p>

      <p className="mt-4 text-[11px] font-semibold text-forest-600">
        Scroll · Choose a duty below
      </p>

      <Link
        href="/about"
        className="mt-2 inline-block text-[11px] text-forest-500 underline underline-offset-2"
      >
        Non-partisan charter
      </Link>
    </section>
  );
}
