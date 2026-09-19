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
      <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-forest-500">
        1 · What must be delivered?
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {DUTIES.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={`paper-card flex flex-col items-center gap-1.5 rounded-xl px-2.5 py-3.5 text-center transition active:scale-[0.98] ${
                active ? "ring-2 ring-forest-500 bg-forest-50" : "hover:bg-white"
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              <span
                className={`text-[11px] font-semibold leading-tight ${
                  active ? "text-forest-700" : "text-forest-900"
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
