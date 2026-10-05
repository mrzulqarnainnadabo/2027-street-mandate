"use client";

import { DUTIES } from "@/lib/constants";

export default function DutyCards({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="px-4 pt-6" aria-labelledby="duty-step-heading">
      <div className="mb-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-500">
          Step 01
        </p>
        <h2
          id="duty-step-heading"
          className="mt-1 font-display text-base font-bold text-forest-800"
        >
          What must public office deliver?
        </h2>
        <p className="mt-1 text-[11px] text-forest-500">Pick one duty of government</p>
      </div>
      <div
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        role="group"
        aria-label="Duty of government"
      >
        {DUTIES.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              aria-pressed={active}
              className={`flex min-h-[52px] items-center gap-3 rounded-md border px-3 py-3 text-left transition active:scale-[0.99] ${
                active
                  ? "border-forest-500 bg-forest-50 ring-1 ring-forest-500"
                  : "border-forest-500/12 bg-white hover:border-forest-500/30"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-base ${
                  active ? "bg-forest-500 text-cream" : "bg-forest-50 text-forest-700"
                }`}
                aria-hidden
              >
                {m.icon}
              </span>
              <span
                className={`text-sm font-medium leading-snug ${
                  active ? "text-forest-800" : "text-forest-900"
                }`}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
