"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function StatesSearch({ states }: { states: readonly string[] }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return states.filter((s) => s.toLowerCase().includes(needle)).slice(0, 8);
  }, [q, states]);

  function go(state: string) {
    router.push(`/brief?state=${encodeURIComponent(state)}`);
  }

  return (
    <div className="rounded-2xl border border-forest-500/15 bg-white p-3 shadow-sm">
      <label htmlFor="state-search" className="sr-only">
        Search state or FCT
      </label>
      <input
        id="state-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder="Search state or FCT…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="min-h-[44px] w-full rounded-xl border border-forest-500/20 bg-cream px-3 text-sm text-forest-900 outline-none ring-forest-600 focus:ring-2"
      />
      {matches.length > 0 ? (
        <ul className="mt-2 divide-y divide-forest-500/10" role="listbox">
          {matches.map((state) => (
            <li key={state}>
              <button
                type="button"
                role="option"
                className="flex min-h-[44px] w-full items-center px-2 text-left text-sm font-medium text-forest-800 hover:bg-forest-50"
                onClick={() => go(state)}
              >
                {state}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
