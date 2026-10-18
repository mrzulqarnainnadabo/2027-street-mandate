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
    <section className="border-b border-forest-500/10 px-4 pb-6 pt-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
        ISEYC · Civic Mandate Nigeria · Non-partisan
      </p>

      <h1 className="mt-2 max-w-xl font-display text-[1.55rem] font-bold leading-[1.25] text-forest-900 sm:text-[1.85rem]">
        Tell them what must be delivered
      </h1>

      <p className="mt-2 max-w-md text-[13px] leading-snug text-forest-700">
        Submit a concrete public-service demand. ISEYC reviews it. Only published records enter the public record.
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <a href="#mandate-form" className="civic-action inline-flex min-h-[48px] items-center">
          Submit a demand
        </a>
        <Link
          href="/intelligence"
          className="inline-flex min-h-[48px] items-center rounded-md border border-forest-500/20 bg-white px-4 text-sm font-semibold text-forest-800 transition hover:border-forest-500/40 hover:bg-forest-50"
        >
          See published records
        </Link>
      </div>

      {unavailable ? (
        <div className="mt-5 rounded-md border border-forest-500/12 bg-forest-50 px-4 py-3">
          <p className="text-xs font-semibold text-forest-800">{t("hero.unavailableTitle")}</p>
          <p className="mt-1 text-[11px] leading-snug text-forest-600">{t("hero.unavailableBody")}</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-forest-500/12 bg-white px-3 py-3 text-center shadow-sm">
            <p className="font-display text-2xl font-bold tabular-nums text-forest-900">
              {loading ? "…" : showCounts ? total : "—"}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-forest-600">
              Published
            </p>
          </div>
          <div className="rounded-lg border border-forest-500/12 bg-white px-3 py-3 text-center shadow-sm">
            <p className="font-display text-2xl font-bold tabular-nums text-forest-900">
              {loading ? "…" : showCounts ? states : "—"}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-forest-600">
              States
            </p>
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-snug text-forest-600">
        Pilot data · Not a poll · Not a ranking ·{" "}
        <Link href="/methodology" className="font-semibold text-forest-800 underline underline-offset-2">
          Methodology
        </Link>
      </p>
    </section>
  );
}
