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
    <div className="mx-auto min-h-screen max-w-3xl">
      <Header />
      <main className="px-4 py-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
          This device only
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-bold text-forest-900">Tracked mandates</h1>
        <p className="mt-2 max-w-lg text-sm text-forest-600">
          You are tracking these public records on this device. Tracking is not a vote, ranking, or
          show of political support.
        </p>
        {items.length === 0 ? (
          <div className="mt-10 rounded-md border border-dashed border-forest-500/20 px-4 py-10 text-center">
            <p className="text-sm font-medium text-forest-700">No tracked mandates yet</p>
            <p className="mt-1 text-xs text-forest-500">
              Open a published mandate and choose "Track this mandate".
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {items.map((t) => (
              <li key={t.id} className="rounded-md border border-forest-500/12 bg-white p-4">
                <p className="text-sm leading-snug text-forest-900">“{t.sentence}”</p>
                <p className="mt-1.5 text-xs text-forest-500">
                  {[t.state, t.duty].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                  <Link href={`/mandate/${t.id}`} className="text-forest-700 underline underline-offset-2">
                    Open record
                  </Link>
                  <button
                    type="button"
                    className="text-forest-500 underline underline-offset-2"
                    onClick={() => setItems(untrackMandate(t.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-center text-sm">
          <Link href="/" className="font-semibold underline underline-offset-2">
            ← Civic Mandate home
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
