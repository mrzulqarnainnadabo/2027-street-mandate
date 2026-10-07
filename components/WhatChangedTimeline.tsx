import { buildWhatChangedTimeline, type PublicMandateFacts } from "@/lib/what-changed";

export default function WhatChangedTimeline({ mandate }: { mandate: PublicMandateFacts }) {
  const events = buildWhatChangedTimeline(mandate);

  return (
    <section className="mt-4 rounded-xl border border-forest-500/12 bg-white px-4 py-4">
      <h2 className="text-[10px] font-bold uppercase tracking-wide text-forest-500">
        Accountability path
      </h2>
      <p className="mt-1 text-[11px] leading-snug text-forest-500">
        Demand → responsibility → response → evidence → change. Only confirmed public facts are
        marked Confirmed. Missing stages are stated honestly — never invented.
      </p>
      <ol className="mt-3 space-y-3">
        {events.map((e) => (
          <li key={e.id} className="border-l-2 border-forest-500/25 pl-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-semibold text-forest-900">{e.label}</span>
              <span
                className={`text-[10px] font-bold uppercase ${
                  e.confirmed ? "text-forest-600" : "text-forest-400"
                }`}
              >
                {e.confirmed ? "Confirmed" : "Not on public record"}
              </span>
            </div>
            {e.at ? (
              <p className="text-[11px] text-forest-500">{new Date(e.at).toLocaleString()}</p>
            ) : null}
            {e.detail ? <p className="mt-0.5 text-xs text-forest-600">{e.detail}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
