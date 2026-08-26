"use client";

import { useEffect, useState } from "react";
import { MANDATES } from "@/lib/constants";

type Voice = {
  id: string;
  sentence: string;
  mandate: string;
  state: string;
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
      } catch {}
    }
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const max = Math.max(...Object.values(tally), 1);

  return (
    <section className="mt-10 border-t border-forest-500/10 px-4 pb-16 pt-8">
      <h2 className="mb-1 text-center font-display text-lg font-bold text-forest-700">
        Street Ledger
      </h2>
      <p className="mb-6 text-center text-xs text-forest-500">
        Live published voices · updates every 30s
      </p>

      <div className="mb-8 space-y-2">
        {MANDATES.map((m) => {
          const count = tally[m.id] || 0;
          const pct = total > 0 ? Math.round((count / max) * 100) : 0;
          return (
            <div key={m.id} className="flex items-center gap-2 text-xs">
              <span className="w-28 shrink-0 truncate text-forest-700">{m.label}</span>
              <div className="tally-track h-3 flex-1 overflow-hidden rounded-full bg-forest-100">
                <div
                  className="h-full rounded-full bg-forest-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 text-right font-medium text-forest-500">{count}</span>
            </div>
          );
        })}
      </div>

      {voices.length === 0 ? (
        <p className="rounded-xl border border-dashed border-forest-500/20 py-8 text-center text-sm text-forest-500">
          No published voices yet. Be the first — then come back after moderation.
        </p>
      ) : (
        <div className="space-y-3">
          {voices.map((v) => (
            <div key={v.id} className="paper-card rounded-xl px-4 py-3">
              <p className="text-sm leading-snug text-forest-900">“{v.sentence}”</p>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-forest-500">
                <span>{v.state}</span>
                <span className="rounded bg-forest-50 px-1.5 py-0.5">{v.mandate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
