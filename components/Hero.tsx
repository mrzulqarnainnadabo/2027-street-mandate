"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

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
  const { t } = useLang();
  const showCounts = pulseStatus === "ready";
  const unavailable = pulseStatus === "unavailable";
  const loading = pulseStatus === "loading";

  return (
    <section className="border-b border-forest-500/10 px-4 pb-8 pt-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
        ISEYC · Civic Mandate Nigeria · Non-partisan
      </p>

      <h1 className="mt-2 max-w-xl font-display text-[1.5rem] font-bold leading-[1.28] text-forest-900 sm:text-[1.75rem]">
        What are Nigerians asking public office to deliver?
      </h1>

      <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-forest-700">
        A public record of concrete public-service demands — organised by place and
        responsibility, reviewed before publication. Not a poll. Not a ranking. Not a campaign.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <a href="#mandate-form" className="civic-action inline-flex">
          Tell us what matters where you live
        </a>
        <Link
          href="/intelligence"
          className="inline-flex min-h-[48px] items-center rounded-md border border-forest-500/20 bg-white px-4 text-sm font-semibold text-forest-800 transition hover:border-forest-500/40 hover:bg-forest-50"
        >
          What published records show
        </Link>
      </div>

      {unavailable ? (
        <div className="mt-6 rounded-md border border-forest-500/12 bg-forest-50 px-4 py-3">
          <p className="text-xs font-semibold text-forest-800">{t("hero.unavailableTitle")}</p>
          <p className="mt-1 text-[11px] leading-snug text-forest-600">{t("hero.unavailableBody")}</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-0 overflow-hidden rounded-md border border-forest-500/12 bg-white">
          <div className="border-r border-forest-500/10 px-4 py-3">
            <div className="font-display text-2xl font-bold tabular-nums text-forest-800">
              {loading ? (
                <span className="inline-block h-7 w-10 animate-pulse rounded bg-forest-100" aria-hidden />
              ) : showCounts ? (
                total
              ) : (
                "—"
              )}
            </div>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-forest-500">
              Published records
            </p>
          </div>
          <div className="px-4 py-3">
            <div className="font-display text-2xl font-bold tabular-nums text-forest-800">
              {loading ? (
                <span className="inline-block h-7 w-10 animate-pulse rounded bg-forest-100" aria-hidden />
              ) : showCounts ? (
                states
              ) : (
                "—"
              )}
            </div>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-forest-500">
              States represented
            </p>
          </div>
        </div>
      )}

      {showCounts && !loading && (
        <p className="mt-2 text-[11px] leading-snug text-forest-500">
          Counts are published Civic Mandate records only — not votes and not a survey of all
          Nigerians.{" "}
          <Link href="/methodology" className="font-semibold underline underline-offset-2">
            Methodology
          </Link>
        </p>
      )}
    </section>
  );
}
