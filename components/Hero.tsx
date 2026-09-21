import Link from "next/link";
import { ISEYC_SEAL_SRC } from "@/lib/brand";

type PulseStatus = "loading" | "ready" | "unavailable";

export default function Hero({
  total,
  states,
  pulseStatus = "ready",
}: {
  total: number;
  states: number;
  pulseStatus?: PulseStatus;
}) {
  const showCounts = pulseStatus === "ready";
  const unavailable = pulseStatus === "unavailable";

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
      <a href="#mandate-form" className="civic-action mt-5 inline-flex">
        State your mandate <span aria-hidden="true">↓</span>
      </a>

      {unavailable ? (
        <div className="mx-auto mt-5 max-w-sm border-y border-forest-500/10 bg-forest-50 px-3 py-3 text-center">
          <p className="text-xs font-semibold text-forest-800">
            Published counts temporarily unavailable
          </p>
          <p className="mt-1 text-[10px] leading-snug text-forest-600">
            The public record could not be loaded. No zero count is shown in place of real data.
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-5 flex max-w-xs justify-center divide-x divide-forest-500/15 border-y border-forest-500/10 py-3 text-left">
          <div className="w-1/2 pr-6">
            <div className="font-display text-xl font-bold tabular-nums text-forest-700">
              {showCounts ? total : "—"}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-forest-500">
              Published mandates
            </div>
          </div>
          <div className="w-1/2 pl-6">
            <div className="font-display text-xl font-bold tabular-nums text-forest-700">
              {showCounts ? states : "—"}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-forest-500">
              States represented
            </div>
          </div>
        </div>
      )}

      <p className="mt-1.5 text-[10px] text-forest-500/75">
        {showCounts ? "Published records only · not a poll" : "Loading public record…"}
      </p>

      <p className="mt-4 text-[11px] font-semibold text-forest-600">
        Scroll to begin · choose a duty of government
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px]">
        <Link href="/brief" className="text-forest-600 underline underline-offset-2">
          State Civic Brief
        </Link>
        <Link href="/about" className="text-forest-500 underline underline-offset-2">
          Non-partisan charter
        </Link>
      </div>
    </section>
  );
}
