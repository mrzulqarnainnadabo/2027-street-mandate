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
    <section className="px-4">
      <h2 className="mb-1 text-center font-display text-base font-bold text-forest-800">
        What must public office deliver?
      </h2>
      <p className="mb-4 text-center text-[11px] text-forest-500">
        Step 1 · Pick one duty of government
      </p>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {DUTIES.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={`flex min-h-[48px] items-center gap-3 rounded-lg border px-3 py-3 text-left transition active:scale-[0.99] ${
                active
                  ? "border-forest-500 bg-forest-50 ring-1 ring-forest-500"
                  : "border-forest-500/12 bg-white hover:border-forest-500/30"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm ${
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
