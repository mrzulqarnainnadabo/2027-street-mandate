"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DUTIES } from "@/lib/constants";

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
  const [tally, setTally] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/pulse");
        const data = await res.json();
        if (alive) {
          setVoices(data.voices || []);
          setTally(data.tally || {});
          setTotal(data.total || 0);
        }
      } catch {
        /* ignore */
      }
    }
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const max = Math.max(...Object.values(tally), 1);
  const topDuties = DUTIES.map((d) => ({ ...d, count: tally[d.id] || 0 }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const displayDuties =
    topDuties.length > 0
      ? topDuties
      : DUTIES.slice(0, 6).map((d) => ({ ...d, count: 0 }));

  return (
    <section className="mt-10 border-t border-forest-500/10 px-4 pb-16 pt-8">
      <h2 className="mb-1 text-center font-display text-lg font-bold text-forest-700">
        Civic Pulse
      </h2>
      <p className="mb-6 text-center text-xs text-forest-500">
        Published mandates by duty · never candidate rankings
      </p>

      <div className="mb-8 space-y-2">
        {displayDuties.map((m) => {
          const pct = total > 0 ? Math.round((m.count / max) * 100) : 0;
          return (
            <div key={m.id} className="flex items-center gap-2 text-xs">
              <span className="w-28 shrink-0 truncate text-forest-700">{m.label}</span>
              <div className="tally-track h-3 flex-1 overflow-hidden rounded-full bg-forest-100">
                <div
                  className="h-full rounded-full bg-forest-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 text-right font-medium text-forest-500">{m.count}</span>
            </div>
          );
        })}
      </div>

      {voices.length === 0 ? (
        <p className="rounded-xl border border-dashed border-forest-500/20 py-8 text-center text-sm text-forest-500">
          No published mandates yet. Submit one — it appears after moderation.
        </p>
      ) : (
        <div className="space-y-3">
          {voices.map((v) => (
            <Link
              key={v.id}
              href={`/mandate/${v.id}`}
              className="paper-card block rounded-xl px-4 py-3 transition hover:ring-1 hover:ring-forest-500/30"
            >
              <p className="text-sm leading-snug text-forest-900">“{v.sentence}”</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-forest-500">
                <span>
                  {v.state}
                  {v.lga ? ` · ${v.lga}` : ""}
                </span>
                {v.office ? (
                  <span className="rounded bg-forest-50 px-1.5 py-0.5">{v.office}</span>
                ) : null}
                <span className="rounded bg-forest-50 px-1.5 py-0.5">
                  {v.duty || v.mandate}
                </span>
                <span className="ml-auto text-forest-400">Open →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
