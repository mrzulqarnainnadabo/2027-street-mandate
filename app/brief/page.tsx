"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DUTIES, STATES } from "@/lib/constants";

type Voice = {
  id: string;
  sentence: string;
  mandate: string;
  duty?: string;
  office?: string;
  state: string;
  lga?: string;
};

/**
 * State Civic Brief — data for action, not rankings.
 * Groups published mandates so communities and offices can see
 * concrete demands by duty. Never candidate scores.
 */
export default function BriefPage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState("Kaduna");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/pulse")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setVoices(d.voices || []);
        setTotal(typeof d.total === "number" ? d.total : (d.voices || []).length);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const forState = useMemo(
    () => voices.filter((v) => v.state === state),
    [voices, state]
  );

  const byDuty = useMemo(() => {
    const map: Record<string, Voice[]> = {};
    for (const d of DUTIES) map[d.id] = [];
    for (const v of forState) {
      const duty = v.duty || v.mandate || "Other";
      if (!map[duty]) map[duty] = [];
      map[duty].push(v);
    }
    return map;
  }, [forState]);

  const dutiesWithData = DUTIES.filter((d) => (byDuty[d.id] || []).length > 0);

  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      <Header />
      <main className="px-4 py-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
          Data for delivery
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-forest-900">
          State Civic Brief
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-forest-700/90">
          Published citizen demands for one state, grouped by duty of government.
          This is a public memory of what people asked for — not a poll, not a ranking,
          not an endorsement.
        </p>

        <label className="mt-6 block text-xs font-semibold text-forest-700">
          State
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1.5 min-h-[48px] w-full rounded-md border border-forest-500/15 bg-white px-3 text-sm text-forest-900 outline-none focus:border-forest-500"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 border-y border-forest-500/10 py-3 text-xs text-forest-600">
          {loading ? (
            <span>Loading published records…</span>
          ) : (
            <>
              <strong className="tabular-nums text-forest-800">{forState.length}</strong>{" "}
              published from {state}
              {total > 0 ? (
                <span className="text-forest-500">
                  {" "}· {total} published nationally on this wall
                </span>
              ) : null}
            </>
          )}
        </div>

        {!loading && forState.length === 0 ? (
          <div className="mt-8 border border-dashed border-forest-500/20 py-10 text-center">
            <p className="text-sm text-forest-600">
              No published mandates from {state} yet.
            </p>
            <p className="mt-2 text-xs text-forest-500">
              When citizens submit and ISEYC publishes, demands will group here by duty — so
              communities can see patterns, not personalities.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-semibold text-forest-700 underline underline-offset-2"
            >
              Submit a mandate →
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {dutiesWithData.map((d) => {
              const items = byDuty[d.id] || [];
              return (
                <section key={d.id}>
                  <div className="mb-3 flex items-baseline justify-between border-b border-forest-500/15 pb-2">
                    <h2 className="font-display text-base font-bold text-forest-800">
                      {d.label}
                    </h2>
                    <span className="text-[11px] tabular-nums text-forest-500">
                      {items.length} demand{items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {items.map((v) => (
                      <li key={v.id}>
                        <Link
                          href={`/mandate/${v.id}`}
                          className="block border border-forest-500/12 bg-white px-3 py-3 transition hover:border-forest-500/30"
                        >
                          <p className="text-sm leading-snug text-forest-900">
                            “{v.sentence}”
                          </p>
                          <p className="mt-1.5 text-[10px] text-forest-500">
                            {[v.lga, v.office].filter(Boolean).join(" · ") || "Office not specified"}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-10 border-t border-forest-500/10 pt-6 text-xs leading-relaxed text-forest-500">
          <p className="font-semibold text-forest-700">How this helps</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Communities see what others in their state already demanded.</li>
            <li>ISEYC can turn weekly published rows into field briefs without ranking people.</li>
            <li>Offices and aspirants can read public expectations — response is optional and separate.</li>
          </ul>
          <p className="mt-3">
            Counts describe published demands only. They are not votes, polls, or popularity scores.
          </p>
        </div>

        <p className="mt-8 text-center">
          <Link href="/" className="text-sm font-semibold text-forest-600 underline underline-offset-2">
            ← Back to Civic Mandate
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
