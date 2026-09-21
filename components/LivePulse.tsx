"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DUTIES, OFFICES, STATES } from "@/lib/constants";

type Voice = {
  id: string;
  sentence: string;
  mandate: string;
  duty?: string;
  office?: string;
  state: string;
  lga?: string;
};

export default function LivePulse() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [total, setTotal] = useState(0);
  const [truncated, setTruncated] = useState(false);
  const [stateFilter, setStateFilter] = useState("");
  const [officeFilter, setOfficeFilter] = useState("");
  const [dutyFilter, setDutyFilter] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/pulse");
        if (!res.ok) throw new Error("Pulse unavailable");
        const data = await res.json();
        if (alive) {
          setError(false);
          setVoices(data.voices || []);
          setTotal(typeof data.total === "number" ? data.total : (data.voices || []).length);
          setTruncated(Boolean(data.truncated));
        }
      } catch {
        if (alive) setError(true);
      }
    }
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const filteredVoices = useMemo(
    () =>
      voices.filter(
        (v) =>
          (!stateFilter || v.state === stateFilter) &&
          (!officeFilter || v.office === officeFilter) &&
          (!dutyFilter || (v.duty || v.mandate) === dutyFilter)
      ),
    [voices, stateFilter, officeFilter, dutyFilter]
  );

  const filteredTally = useMemo(() => {
    const next: Record<string, number> = {};
    for (const v of filteredVoices) {
      const duty = v.duty || v.mandate;
      next[duty] = (next[duty] || 0) + 1;
    }
    return next;
  }, [filteredVoices]);

  const max = Math.max(...Object.values(filteredTally), 1);
  const displayDuties = DUTIES.map((d) => ({
    ...d,
    count: filteredTally[d.id] || 0,
  }));

  const hasFilters = Boolean(stateFilter || officeFilter || dutyFilter);

  return (
    <section className="mt-10 border-t border-forest-500/10 px-4 pb-16 pt-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-5 border-b border-forest-500/10 pb-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">
            Public record
          </p>
          <h2 className="mt-1 font-display text-lg font-bold text-forest-900">Civic Pulse</h2>
          <p className="mt-1 text-xs text-forest-500">
            Published mandates by duty · never candidate rankings
          </p>
          {!error && total > 0 ? (
            <p className="mt-2 text-[11px] tabular-nums text-forest-600">
              {total} published on this wall
              {truncated ? " · more exist beyond this view" : ""}
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="border-y border-forest-500/15 bg-forest-50 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-forest-800">
              Civic Pulse is temporarily unavailable.
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-forest-600">
              Published civic records could not be loaded. This wall will try again automatically.
              No zero or empty count is being shown as a substitute.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 grid gap-2 sm:grid-cols-3">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                aria-label="Filter by state"
                className="min-h-[48px] w-full rounded-md border border-forest-500/15 bg-white px-3 text-xs text-forest-700 outline-none focus:border-forest-500"
              >
                <option value="">All states</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                value={officeFilter}
                onChange={(e) => setOfficeFilter(e.target.value)}
                aria-label="Filter by office"
                className="min-h-[48px] w-full rounded-md border border-forest-500/15 bg-white px-3 text-xs text-forest-700 outline-none focus:border-forest-500"
              >
                <option value="">All offices</option>
                {OFFICES.filter((office) => office.id !== "Unsure").map((office) => (
                  <option key={office.id} value={office.id}>{office.label}</option>
                ))}
              </select>

              <select
                value={dutyFilter}
                onChange={(e) => setDutyFilter(e.target.value)}
                aria-label="Filter by duty"
                className="min-h-[48px] w-full rounded-md border border-forest-500/15 bg-white px-3 text-xs text-forest-700 outline-none focus:border-forest-500"
              >
                <option value="">All duties</option>
                {DUTIES.map((duty) => (
                  <option key={duty.id} value={duty.id}>{duty.label}</option>
                ))}
              </select>
            </div>

            {hasFilters ? (
              <div className="mb-5 flex items-start justify-between gap-3 border-y border-forest-500/10 bg-forest-50 px-3 py-2.5 text-[11px] text-forest-600">
                <span>Showing {filteredVoices.length} of {total} published mandates</span>
                <button
                  type="button"
                  onClick={() => {
                    setStateFilter("");
                    setOfficeFilter("");
                    setDutyFilter("");
                  }}
                  className="shrink-0 font-semibold underline underline-offset-2"
                >
                  Clear
                </button>
              </div>
            ) : null}

            <div className="mb-8 space-y-2.5">
              {displayDuties.map((m) => {
                const pct = filteredVoices.length > 0 ? Math.round((m.count / max) * 100) : 0;
                return (
                  <div key={m.id} className="flex items-center gap-2 text-xs">
                    <span className="w-28 shrink-0 truncate text-forest-700">{m.label}</span>
                    <div className="tally-track h-2.5 flex-1 overflow-hidden rounded-sm">
                      <div className="h-full bg-forest-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right font-medium tabular-nums text-forest-500">{m.count}</span>
                  </div>
                );
              })}
            </div>

            {filteredVoices.length === 0 ? (
              <p className="border-y border-dashed border-forest-500/20 py-8 text-center text-sm text-forest-500">
                {hasFilters ? (
                  <>No published mandates match these filters.{" "}
                    <button
                      type="button"
                      className="font-semibold underline"
                      onClick={() => {
                        setStateFilter("");
                        setOfficeFilter("");
                        setDutyFilter("");
                      }}
                    >
                      Clear filters
                    </button>
                  </>
                ) : "No published mandates yet. Submit one — it appears after moderation."}
              </p>
            ) : (
              <div className="space-y-2.5">
                {filteredVoices.map((v) => (
                  <Link
                    key={v.id}
                    href={`/mandate/${v.id}`}
                    className="block border border-forest-500/12 bg-white px-4 py-3.5 transition hover:border-forest-500/30"
                  >
                    <p className="text-sm leading-snug text-forest-900">“{v.sentence}”</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-forest-500">
                      <span>{v.state}{v.lga ? ` · ${v.lga}` : ""}</span>
                      {v.office ? <span className="border-l border-forest-500/15 pl-2">{v.office}</span> : null}
                      <span className="border-l border-forest-500/15 pl-2">{v.duty || v.mandate}</span>
                      <span className="ml-auto font-medium text-forest-400">Open →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
