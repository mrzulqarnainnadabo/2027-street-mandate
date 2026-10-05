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
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">
        Civic Mandate Nigeria
      </p>
      <h1 className="mt-2 max-w-xl font-display text-[1.55rem] font-bold leading-[1.25] text-forest-900 sm:text-[1.85rem]">
        A national public record of what citizens ask government to deliver.
      </h1>
      <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-forest-700/90">
        Citizens submit one concrete demand. ISEYC reviews it. Published demands become part of the
        public civic record — not votes, rankings, or endorsements.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a href="#mandate-form" className="civic-action inline-flex">
          State a mandate
        </a>
        <a
          href="#civic-pulse"
          className="inline-flex min-h-[48px] items-center rounded-md border border-forest-500/20 bg-white px-4 text-sm font-semibold text-forest-800 transition hover:border-forest-500/40 hover:bg-forest-50"
        >
          Explore the public record
        </a>
      </div>

      {/* Public record strip */}
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
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-forest-500">
              Published mandates
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="font-display text-2xl font-bold tabular-nums text-forest-800">
              {loading ? (
                <span className="inline-block h-7 w-8 animate-pulse rounded bg-forest-100" aria-hidden />
              ) : showCounts ? (
                states
              ) : (
                "—"
              )}
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-forest-500">
              States represented
            </div>
          </div>
        </div>
      )}
      <p className="mt-2 text-[10px] text-forest-500/80">
        {showCounts
          ? "Public record · evidence only · not a scoreboard"
          : loading
            ? "Loading public record…"
            : t("hero.loadingNote")}
      </p>

      {/* Explore the record */}
      <div className="mt-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-500">
          Explore the record
        </p>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          <Link
            href="/states"
            className="rounded-md border border-forest-500/12 bg-white px-3.5 py-3 transition hover:border-forest-500/25 hover:bg-forest-50/80"
          >
            <span className="block text-sm font-semibold text-forest-900">States &amp; FCT</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-forest-600">
              Civic activity across Nigeria’s 36 states and the FCT.
            </span>
          </Link>
          <Link
            href="/brief"
            className="rounded-md border border-forest-500/12 bg-white px-3.5 py-3 transition hover:border-forest-500/25 hover:bg-forest-50/80"
          >
            <span className="block text-sm font-semibold text-forest-900">State Briefs</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-forest-600">
              Structured state-level civic information for reference.
            </span>
          </Link>
          <Link
            href="/blueprints"
            className="rounded-md border border-forest-500/12 bg-white px-3.5 py-3 transition hover:border-forest-500/25 hover:bg-forest-50/80"
          >
            <span className="block text-sm font-semibold text-forest-900">Blueprints</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-forest-600">
              Publicly submitted proposals under dual review.
            </span>
          </Link>
          <Link
            href="/methodology"
            className="rounded-md border border-forest-500/12 bg-white px-3.5 py-3 transition hover:border-forest-500/25 hover:bg-forest-50/80"
          >
            <span className="block text-sm font-semibold text-forest-900">Methodology</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-forest-600">
              How the record is reviewed and what we do not do.
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
