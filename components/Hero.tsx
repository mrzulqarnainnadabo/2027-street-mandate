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
    <section className="border-b border-forest-500/10 bg-gradient-to-br from-forest-50 via-cream-50 to-white px-4 py-7 sm:py-10">
      <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-[minmax(0,1.25fr)_minmax(250px,.75fr)] md:items-center">
        <div>
          <p className="motion-fade-up text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
            ISEYC · Civic Mandate Nigeria · Non-partisan
          </p>
          <h1 className="motion-fade-up motion-delay-1 mt-3 max-w-2xl font-display text-[2rem] font-bold leading-[1.08] tracking-tight text-forest-900 sm:text-[2.8rem]">
            Know your rights. Understand public duties. Shape the country we share.
          </h1>
          <p className="motion-fade-up motion-delay-2 mt-3 max-w-xl text-sm leading-relaxed text-forest-700 sm:text-[15px]">
            Understand how public institutions work, learn your responsibilities, and help create a reviewed public record of what communities ask public office to deliver.
          </p>
          <div className="motion-fade-up motion-delay-3 mt-5 flex flex-wrap gap-2.5">
            <Link href="/learn" className="civic-action inline-flex min-h-[48px] items-center">
              Explore civic learning <span aria-hidden="true">→</span>
            </Link>
            <a href="#mandate-form" className="inline-flex min-h-[48px] items-center rounded-md border border-forest-500/20 bg-white px-4 text-sm font-semibold text-forest-800 transition hover:border-forest-500/40 hover:bg-forest-50">
              Submit a demand
            </a>
            <Link href="/explore" className="inline-flex min-h-[48px] items-center rounded-md px-2 text-sm font-semibold text-forest-800 underline underline-offset-4">
              Explore published records
            </Link>
          </div>
          <p className="motion-fade-in motion-delay-5 mt-4 text-[11px] leading-snug text-forest-600">
            Pilot data · Not a poll · Not a ranking ·{" "}
            <Link href="/methodology" className="font-semibold text-forest-800 underline underline-offset-2">
              Methodology
            </Link>
          </p>
        </div>

        <div className="motion-fade-up motion-delay-3 rounded-xl border border-forest-500/15 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-700">Published civic record</p>
            <span className="rounded-full border border-forest-500/15 bg-forest-50 px-2.5 py-1 text-[10px] font-semibold text-forest-800">Human reviewed</span>
          </div>
          {unavailable ? (
            <div className="mt-5 rounded-lg border border-forest-500/12 bg-forest-50 px-4 py-3">
              <p className="text-xs font-semibold text-forest-800">{t("hero.unavailableTitle")}</p>
              <p className="mt-1 text-[11px] leading-snug text-forest-600">{t("hero.unavailableBody")}</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-forest-950 px-3 py-4 text-white">
                <p className="font-display text-3xl font-bold tabular-nums">{loading ? "…" : showCounts ? total : "—"}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/70">Published</p>
              </div>
              <div className="rounded-lg border border-forest-500/12 bg-forest-50 px-3 py-4">
                <p className="font-display text-3xl font-bold tabular-nums text-forest-900">{loading ? "…" : showCounts ? states : "—"}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-forest-600">States represented</p>
              </div>
            </div>
          )}
          <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="How a demand enters the public record">
            <li className="min-w-0 border-t-2 border-gold-500 pt-2"><span className="block text-[9px] font-bold text-gold-700">01</span><span className="mt-1 block text-[10px] font-semibold leading-tight text-forest-900">Submit</span></li>
            <li className="min-w-0 border-t-2 border-forest-300 pt-2"><span className="block text-[9px] font-bold text-forest-600">02</span><span className="mt-1 block text-[10px] font-semibold leading-tight text-forest-900">Human review</span></li>
            <li className="min-w-0 border-t-2 border-forest-300 pt-2"><span className="block text-[9px] font-bold text-forest-600">03</span><span className="mt-1 block text-[10px] font-semibold leading-tight text-forest-900">Published</span></li>
          </ol>
          <p className="mt-4 border-t border-forest-500/10 pt-3 text-[10px] leading-relaxed text-forest-600">A submission is not public until an authorised ISEYC reviewer publishes it.</p>
        </div>
      </div>
    </section>
  );
}
