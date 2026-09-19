"use client";

import { useEffect, useState } from "react";
import { DUTIES } from "@/lib/constants";

type Voice = {
  id: string;
  sentence: string;
  office: string;
  duty: string;
  state: string;
  lga: string;
};

type PulseData = {
  voices: Voice[];
  tally: Record<string, number>;
  officeTally: Record<string, number>;
  lgaTally: Record<string, number>;
  dutyTally: Record<string, number>;
  total: number;
};

export default function LivePulse() {
  const [data, setData] = useState<PulseData>({
    voices: [],
    tally: {},
    officeTally: {},
    lgaTally: {},
    dutyTally: {},
    total: 0,
  });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/pulse", { cache: "no-store" });
        const next = await res.json();

        if (alive) {
          setData({
            voices: next.voices || [],
            tally: next.tally || {},
            officeTally: next.officeTally || {},
            lgaTally: next.lgaTally || {},
            dutyTally: next.dutyTally || {},
            total: next.total || 0,
          });
        }
      } catch {}
    }

    load();
    const timer = setInterval(load, 30000);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const topLgas = Object.entries(data.lgaTally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxDuty = Math.max(...Object.values(data.dutyTally), 1);

  return (
    <section className="mt-10 border-t border-forest-500/10 px-4 pb-16 pt-8">
      <div className="text-center">
        <h2 className="font-display text-lg font-bold text-forest-700">
          Public Mandate Wall
        </h2>
        <p className="mt-1 text-xs text-forest-500">
          Published voices only · moderated before public display
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {Object.entries(data.officeTally).map(([office, count]) => (
          <div key={office} className="rounded-xl border border-forest-500/10 bg-white/70 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-forest-500">{office}</p>
            <p className="mt-0.5 text-lg font-bold text-forest-700">{count}</p>
          </div>
        ))}
      </div>

      {topLgas.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-forest-500">
            LGA pulse
          </p>
          <div className="space-y-2">
            {topLgas.map(([lga, count]) => (
              <div key={lga} className="flex items-center justify-between rounded-lg bg-forest-50 px-3 py-2">
                <span className="text-xs font-medium text-forest-700">{lga}</span>
                <span className="text-xs font-bold text-forest-500">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-forest-500">
          Top duties
        </p>
        <div className="space-y-2">
          {DUTIES.map((duty) => {
            const count = data.dutyTally[duty.id] || 0;
            const pct = Math.round((count / maxDuty) * 100);

            return (
              <div key={duty.id} className="flex items-center gap-2 text-xs">
                <span className="w-24 shrink-0 truncate text-forest-700">
                  {duty.label}
                </span>
                <div className="tally-track h-3 flex-1 overflow-hidden rounded-full bg-forest-100">
                  <div
                    className="h-full rounded-full bg-forest-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right font-medium text-forest-500">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {data.voices.length === 0 ? (
          <p className="rounded-xl border border-dashed border-forest-500/20 py-8 text-center text-sm text-forest-500">
            No published mandates yet.
          </p>
        ) : (
          <div className="space-y-3">
            {data.voices.map((voice) => (
              <div key={voice.id} className="paper-card rounded-xl px-4 py-3">
                <p className="text-sm leading-snug text-forest-900">
                  “{voice.sentence}”
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-forest-500">
                  <span className="rounded bg-forest-50 px-1.5 py-0.5">{voice.lga}</span>
                  <span className="rounded bg-forest-50 px-1.5 py-0.5">{voice.duty}</span>
                  <span className="rounded bg-forest-50 px-1.5 py-0.5">{voice.office}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}