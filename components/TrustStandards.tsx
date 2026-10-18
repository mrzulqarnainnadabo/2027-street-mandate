"use client";

import Link from "next/link";

const ITEMS = [
  { title: "Non-partisan", body: "No rankings or endorsements" },
  { title: "Human-reviewed", body: "Only Published goes public" },
  { title: "Traceable", body: "Claims tied to records" },
  { title: "Private by default", body: "Contacts stay off the wall" },
] as const;

export default function TrustStandards() {
  return (
    <section className="border-b border-forest-500/10 px-4 py-5" aria-label="Standards">
      <div className="mx-auto grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-forest-500/10 bg-white px-2.5 py-3 text-center"
          >
            <p className="text-[11px] font-bold text-forest-900">{item.title}</p>
            <p className="mt-0.5 text-[10px] leading-snug text-forest-600">{item.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-forest-600">
        <Link href="/about" className="font-semibold underline underline-offset-2">
          Charter
        </Link>
        {" · "}
        <Link href="/methodology" className="font-semibold underline underline-offset-2">
          Methodology
        </Link>
        {" · "}
        <Link href="/intelligence" className="font-semibold underline underline-offset-2">
          Published records
        </Link>
      </p>
    </section>
  );
}
