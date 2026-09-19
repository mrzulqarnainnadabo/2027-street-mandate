"use client";

import { OFFICE_OPTIONS } from "@/lib/constants";

export default function OfficeCards({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (office: string) => void;
}) {
  return (
    <section className="px-4 pt-4">
      <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-forest-500">
        1 · Who should be responsible?
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {OFFICE_OPTIONS.map((office) => (
          <button
            key={office.id}
            type="button"
            onClick={() => onSelect(office.id)}
            className={`rounded-xl border px-3 py-3 text-left transition active:scale-[0.98] ${
              selected === office.id
                ? "border-forest-500 bg-forest-50 shadow-sm"
                : "border-forest-500/15 bg-white/70 hover:border-forest-500/30"
            }`}
          >
            <span className="block text-sm font-bold text-forest-800">{office.label}</span>
            <span className="mt-1 block text-[10px] leading-snug text-forest-600/70">
              {office.helper}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
