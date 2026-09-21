import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

export default function Hero({ total, states }: { total: number; states: number }) {
  return (
    <section className="border-b border-forest-500/10 px-4 pb-6 pt-7 text-center">
      <div className="mb-3 flex justify-center">
        <img
          src={ISEYC_SEAL_SRC}
          alt="ISEYC official seal"
          width={72}
          height={72}
          className="h-[72px] w-[72px] rounded-full bg-white object-contain"
        />
      </div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">
        ISEYC · National civic instrument · 2027
      </p>

      <h1 className="font-display text-[1.65rem] font-bold leading-[1.22] text-forest-900 sm:text-3xl">
        Don’t tell them who you’ll vote for.
        <br />
        <span className="text-forest-500">Tell them what they must deliver.</span>
      </h1>

      <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-forest-700/90">
        One concrete demand. The right office. Your state. Reviewed by ISEYC before it enters the
        public record — never a candidate ranking or popularity poll.
      </p>

      <div className="mx-auto mt-5 flex max-w-xs justify-center divide-x divide-forest-500/15 border-y border-forest-500/10 py-3 text-left">
        <div className="w-1/2 pr-6">
          <div className="font-display text-xl font-bold tabular-nums text-forest-700">{total}</div>
          <div className="text-[10px] uppercase tracking-wide text-forest-500">Published mandates</div>
        </div>
        <div className="w-1/2 pl-6">
          <div className="font-display text-xl font-bold tabular-nums text-forest-700">{states}</div>
          <div className="text-[10px] uppercase tracking-wide text-forest-500">States represented</div>
        </div>
      </div>

      <p className="mt-1.5 text-[10px] text-forest-500/75">Published records only · not a poll</p>

      <p className="mt-4 text-[11px] font-semibold text-forest-600">
        Scroll to begin · choose a duty of government
      </p>

      <Link
        href="/about"
        className="mt-2 inline-block text-[11px] text-forest-500 underline underline-offset-2"
      >
        Read the non-partisan charter
      </Link>
    </section>
  );
}
