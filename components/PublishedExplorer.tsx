"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type PublicVoice = {
  id: string;
  sentence: string;
  mandate?: string;
  duty?: string;
  office?: string;
  state?: string;
  lga?: string;
  created?: string;
};

type LoadState = "loading" | "ready" | "empty" | "error";

function uniqueSorted(values: (string | undefined)[]): string[] {
  return Array.from(
    new Set(values.map((v) => (v || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
}

export default function PublishedExplorer({ compact = false }: { compact?: boolean }) {
  const [voices, setVoices] = useState<PublicVoice[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [duty, setDuty] = useState("all");
  const [state, setState] = useState("all");
  const [q, setQ] = useState("");

  const load = useCallback(() => {
    setStatus("loading");
    setErrorMsg("");
    fetch("/api/pulse")
      .then(async (r) => {
        if (!r.ok) throw new Error("Published records are temporarily unavailable.");
        return r.json();
      })
      .then((d) => {
        if (d?.error || !Array.isArray(d?.voices)) {
          throw new Error("Published records response was incomplete.");
        }
        const list = d.voices as PublicVoice[];
        setVoices(list);
        setStatus(list.length ? "ready" : "empty");
      })
      .catch((err: Error) => {
        setVoices([]);
        setStatus("error");
        setErrorMsg(err?.message || "Could not load published records.");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const duties = useMemo(
    () => uniqueSorted(voices.map((v) => v.duty || v.mandate)),
    [voices]
  );
  const states = useMemo(() => uniqueSorted(voices.map((v) => v.state)), [voices]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return voices.filter((v) => {
      const d = (v.duty || v.mandate || "").trim();
      if (duty !== "all" && d !== duty) return false;
      if (state !== "all" && (v.state || "").trim() !== state) return false;
      if (!needle) return true;
      const hay = [v.sentence, v.lga, v.office, d, v.state]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [voices, duty, state, q]);

  return (
    <section aria-labelledby="published-explorer-heading" className={compact ? "" : "px-4 py-6"}>
      <div className={compact ? "" : "mx-auto max-w-3xl"}>
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-600">Public record</p>
          <h2 id="published-explorer-heading" className="mt-1 font-display text-lg font-bold text-forest-900 sm:text-xl">
            Explore published demands
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-forest-600">
            Filter by duty and state. Only human-reviewed Published records appear. Pilot data — not a national survey.
          </p>
        </div>

        <div className="sticky top-[3.25rem] z-20 -mx-1 mb-4 space-y-2 rounded-lg border border-forest-500/12 bg-cream/95 p-3 backdrop-blur-sm">
          <label className="block">
            <span className="sr-only">Search published demands</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search place, duty, or wording…"
              className="min-h-[44px] w-full rounded-md border border-forest-500/20 bg-white px-3 text-sm text-forest-900 outline-none ring-forest-600 focus:ring-2"
              autoComplete="off"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-[11px] font-semibold text-forest-700">
              Duty
              <select
                value={duty}
                onChange={(e) => setDuty(e.target.value)}
                className="mt-1 min-h-[44px] w-full rounded-md border border-forest-500/20 bg-white px-2 text-sm text-forest-900"
              >
                <option value="all">All duties</option>
                {duties.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="block text-[11px] font-semibold text-forest-700">
              State
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 min-h-[44px] w-full rounded-md border border-forest-500/20 bg-white px-2 text-sm text-forest-900"
              >
                <option value="all">All states</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-[11px] text-forest-600" aria-live="polite">
            {status === "ready"
              ? `${filtered.length} of ${voices.length} published record${voices.length === 1 ? "" : "s"}`
              : status === "loading"
                ? "Loading published records…"
                : status === "empty"
                  ? "No published records yet."
                  : "Could not load records."}
          </p>
        </div>

        {status === "loading" && (
          <div className="rounded-lg border border-forest-500/12 bg-white px-4 py-6 text-sm text-forest-600" role="status">
            Loading published demands…
          </div>
        )}

        {status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900" role="alert">
            <p className="font-semibold">Published records unavailable</p>
            <p className="mt-1 text-xs">{errorMsg}</p>
            <button type="button" onClick={load} className="mt-3 min-h-[44px] rounded-md bg-forest-800 px-4 text-sm font-semibold text-cream">
              Try again
            </button>
          </div>
        )}

        {status === "empty" && (
          <div className="rounded-lg border border-forest-500/12 bg-white px-4 py-6 text-sm text-forest-600">
            No published records are available yet. Submit a demand and wait for human review.
          </div>
        )}

        {status === "ready" && filtered.length === 0 && (
          <div className="rounded-lg border border-forest-500/12 bg-white px-4 py-6 text-sm text-forest-600">
            No published records match these filters. Clear search or choose All duties / All states.
          </div>
        )}

        {status === "ready" && filtered.length > 0 && (
          <ul className="space-y-3" role="list">
            {filtered.map((v) => (
              <li key={v.id}>
                <Link
                  href={`/mandate/${v.id}`}
                  className="block rounded-lg border border-forest-500/12 bg-white p-4 transition hover:border-forest-500/30 hover:bg-forest-50/60 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <p className="text-[15px] font-medium leading-snug text-forest-900">“{v.sentence}”</p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    {(v.duty || v.mandate) && (
                      <span className="rounded-full bg-forest-50 px-2 py-1 font-semibold text-forest-800">{v.duty || v.mandate}</span>
                    )}
                    {v.state && (
                      <span className="rounded-full bg-cream px-2 py-1 text-forest-700">
                        {v.state}{v.lga ? ` · ${v.lga}` : ""}
                      </span>
                    )}
                    {v.office && (
                      <span className="rounded-full border border-forest-500/15 px-2 py-1 text-forest-600">Named office: {v.office}</span>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] font-semibold text-forest-700">Open public record →</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
