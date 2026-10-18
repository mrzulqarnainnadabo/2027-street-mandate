"use client";

import Link from "next/link";
import { CIVIC_BRAIN_URL } from "@/lib/brand";

const STEPS = [
  { n: "1", title: "Submit", body: "Service + place" },
  { n: "2", title: "Review", body: "Human check" },
  { n: "3", title: "Publish", body: "If approved" },
  { n: "4", title: "Track", body: "Receipt + Brain" },
] as const;

export default function HowItWorks() {
  return (
    <section className="border-b border-forest-500/10 px-4 py-6" aria-labelledby="how-heading">
      <h2
        id="how-heading"
        className="text-center font-display text-sm font-bold tracking-wide text-forest-800"
      >
        How it works
      </h2>
      <p className="mx-auto mt-1 max-w-sm text-center text-[11px] text-forest-600">
        Submission is not government action — it is a reviewed public record of what was asked.
      </p>

      <ol className="mx-auto mt-4 flex max-w-lg items-stretch justify-between gap-1">
        {STEPS.map((s) => (
          <li key={s.n} className="flex flex-1 flex-col items-center text-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 font-display text-sm font-bold text-cream">
              {s.n}
            </span>
            <p className="mt-2 text-[12px] font-bold text-forest-900">{s.title}</p>
            <p className="text-[10px] text-forest-600">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-x-3 gap-y-1 text-center text-[11px]">
        <Link href="/map" className="font-semibold text-forest-800 underline underline-offset-2">
          Responsibility map
        </Link>
        <span className="text-forest-400">·</span>
        <a
          href={CIVIC_BRAIN_URL}
          className="font-semibold text-forest-800 underline underline-offset-2"
          rel="noopener noreferrer"
        >
          Civic Brain
        </a>
        <span className="text-forest-400">·</span>
        <Link href="/methodology" className="font-semibold text-forest-800 underline underline-offset-2">
          Methodology
        </Link>
      </div>
    </section>
  );
}
