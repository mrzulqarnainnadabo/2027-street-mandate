"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listTrackedMandates, untrackMandate, type TrackedMandate } from "@/lib/track-mandate";

export default function TrackedPage() {
  const [items, setItems] = useState<TrackedMandate[]>([]);

  useEffect(() => {
    setItems(listTrackedMandates());
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-2xl">
      <Header />
      <main className="px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-forest-900">Tracked mandates</h1>
        <p className="mt-2 text-sm text-forest-600">
          Saved on this device only. Tracking is not a vote, ranking, or show of political support.
        </p>
        {items.length === 0 ? (
          <p className="mt-8 text-center text-sm text-forest-500">No tracked mandates yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {items.map((t) => (
              <li key={t.id} className="rounded-xl border border-forest-500/15 bg-white p-4">
                <p className="text-sm text-forest-900">“{t.sentence}”</p>
                <p className="mt-1 text-xs text-forest-500">
                  {[t.state, t.duty].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                  <Link href={`/mandate/${t.id}`} className="text-forest-700 underline">
                    Open record
                  </Link>
                  <button
                    type="button"
                    className="text-forest-500 underline"
                    onClick={() => setItems(untrackMandate(t.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 text-center text-sm">
          <Link href="/" className="font-semibold underline">
            ← Civic Mandate home
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
