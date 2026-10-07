"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { CivicIntelligenceSnapshot } from "@/lib/civic-intelligence";
import { PRODUCT_NAME } from "@/lib/brand";

type LoadState =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "ready"; data: CivicIntelligenceSnapshot };

function pct(share: number): string {
  if (share <= 0) return "0%";
  return `${Math.round(share * 100)}%`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function IntelligencePage() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    fetch("/api/civic-intelligence")
      .then(async (r) => {
        if (!r.ok) throw new Error("unavailable");
        return r.json();
      })
      .then((d) => {
        if (!alive) return;
        if (!d || typeof d.publishedCount !== "number" || !Array.isArray(d.duties)) {
          throw new Error("malformed");
        }
        setState({ status: "ready", data: d as CivicIntelligenceSnapshot });
      })
      .catch(() => {
        if (alive) setState({ status: "unavailable" });
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-3xl">
      <Header />
      <main className="px-4 py-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
          Civic Intelligence · Published records only
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-forest-900 sm:text-3xl">
          What published records show
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-700">
          A synthesis of <strong>Published</strong> Civic Mandate records after human review.
          This is <strong>not</strong> a poll, not a ranking of politicians, and not a claim about
          what all Nigerians think.
        </p>

        {state.status === "loading" && (
          <div className="mt-8 rounded-xl border border-forest-500/15 bg-white px-4 py-8 text-center text-sm text-forest-600">
            Loading published civic records…
          </div>
        )}

        {state.status === "unavailable" && (
          <div className="mt-8 rounded-xl border border-forest-500/15 bg-forest-50 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-forest-800">
              Civic Intelligence is temporarily unavailable
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-forest-600">
              Published records could not be loaded. No zero count is shown as if no mandates exist.
            </p>
          </div>
        )}

        {state.status === "ready" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-forest-500/15 bg-white p-4 sm:p-5">
              <p className="text-sm leading-relaxed text-forest-800">{state.data.framingLine}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Published records" value={String(state.data.publishedCount)} />
                <Stat label="States represented" value={String(state.data.statesRepresented)} />
                <Stat label="LGAs with labels" value={String(state.data.lgasRepresented)} />
                <Stat label="Duties present" value={String(state.data.dutiesRepresented)} />
              </div>
              {(state.data.periodStart || state.data.periodEnd) && (
                <p className="mt-3 text-[11px] text-forest-500">
                  Record created_time range: {formatDate(state.data.periodStart)} →{" "}
                  {formatDate(state.data.periodEnd)}
                  {state.data.truncated ? " · Snapshot may be truncated" : ""}
                </p>
              )}
            </div>

            <section>
              <h2 className="font-display text-lg font-bold text-forest-900">
                Public-service duties most frequently recorded
              </h2>
              <p className="mt-1 text-xs text-forest-600">
                Among published records only — frequency is not a vote and not a national ranking.
              </p>
              {state.data.duties.length === 0 ? (
                <p className="mt-3 text-sm text-forest-600">No published duties in this snapshot.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {state.data.duties.map((d) => (
                    <li
                      key={d.duty}
                      className="flex items-center justify-between gap-3 rounded-lg border border-forest-500/10 bg-white px-3 py-2.5"
                    >
                      <span className="text-sm font-medium text-forest-900">{d.duty}</span>
                      <span className="shrink-0 text-xs tabular-nums text-forest-600">
                        {d.count} · {pct(d.shareOfPublished)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-forest-900">
                Where published demands are coming from
              </h2>
              <p className="mt-1 text-xs text-forest-600">
                States with at least one Published record. Absence of a state does not mean absence
                of need.
              </p>
              {state.data.states.length === 0 ? (
                <p className="mt-3 text-sm text-forest-600">No state labels in this snapshot.</p>
              ) : (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {state.data.states.map((s) => (
                    <li
                      key={s.state}
                      className="flex items-center justify-between gap-2 rounded-lg border border-forest-500/10 bg-white px-3 py-2"
                    >
                      <Link
                        href={`/brief?state=${encodeURIComponent(s.state)}`}
                        className="text-sm font-medium text-forest-900 underline-offset-2 hover:underline"
                      >
                        {s.state}
                      </Link>
                      <span className="text-xs tabular-nums text-forest-600">{s.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-forest-900">
                Offices named on published records
              </h2>
              <p className="mt-1 text-xs text-forest-600">
                Citizen/ISEYC classification for navigation — not a legal assignment of blame.
              </p>
              {state.data.offices.length === 0 ? (
                <p className="mt-3 text-sm text-forest-600">No office labels in this snapshot.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {state.data.offices.map((o) => (
                    <li
                      key={o.office}
                      className="flex items-center justify-between gap-3 rounded-lg border border-forest-500/10 bg-white px-3 py-2"
                    >
                      <span className="text-sm text-forest-800">{o.office}</span>
                      <span className="text-xs tabular-nums text-forest-600">{o.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {state.data.topLgas.length > 0 && (
              <section>
                <h2 className="font-display text-lg font-bold text-forest-900">
                  LGAs appearing most often
                </h2>
                <p className="mt-1 text-xs text-forest-600">
                  Only where an LGA label was provided on the published record.
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {state.data.topLgas.map((g) => (
                    <li
                      key={`${g.state}-${g.lga}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-forest-500/10 bg-white px-3 py-2 text-sm"
                    >
                      <span className="text-forest-800">
                        {g.lga}
                        <span className="text-forest-500"> · {g.state}</span>
                      </span>
                      <span className="text-xs tabular-nums text-forest-600">{g.count}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-xl border border-forest-500/15 bg-forest-50/80 p-4 sm:p-5">
              <h2 className="font-display text-base font-bold text-forest-900">Methodology</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-forest-700">
                {state.data.methodology.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              <h3 className="mt-4 font-display text-sm font-bold text-forest-900">Limitations</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-forest-700">
                {state.data.limitations.map((L) => (
                  <li key={L}>{L}</li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] text-forest-500">
                {PRODUCT_NAME} · Snapshot v{state.data.version} ·{" "}
                <Link href="/methodology" className="underline underline-offset-2">
                  Full methodology
                </Link>
              </p>
            </section>

            <p className="text-center text-xs text-forest-600">
              <Link href="/" className="font-medium text-forest-800 underline-offset-2 hover:underline">
                Add a clear demand
              </Link>
              {" · "}
              <Link
                href="/brief"
                className="font-medium text-forest-800 underline-offset-2 hover:underline"
              >
                State Civic Brief
              </Link>
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-forest-50 px-3 py-2.5 text-center">
      <div className="font-display text-xl font-bold tabular-nums text-forest-900">{value}</div>
      <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-forest-500">
        {label}
      </div>
    </div>
  );
}
