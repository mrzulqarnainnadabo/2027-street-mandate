"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

const STEPS = [
  {
    n: "01",
    title: "Name the public service",
    body: "Choose the duty of government the issue concerns.",
  },
  {
    n: "02",
    title: "Point to responsibility",
    body: "Name the office you believe should deliver — or say you are unsure.",
  },
  {
    n: "03",
    title: "Locate the issue",
    body: "Add your state and, if you know it, the LGA.",
  },
  {
    n: "04",
    title: "One concrete demand",
    body: "Write a clear service or outcome — not a slogan or attack.",
  },
  {
    n: "05",
    title: "Human review",
    body: "ISEYC reviews for clarity, safety, and non-partisanship.",
  },
  {
    n: "06",
    title: "Public record",
    body: "Only Published demands appear on Pulse, Briefs, and Intelligence.",
  },
] as const;

export default function HowItWorks() {
  const { t } = useLang();

  return (
    <section className="border-b border-forest-500/10 px-4 py-7" aria-labelledby="how-heading">
      <h2
        id="how-heading"
        className="text-center font-display text-sm font-bold tracking-wide text-forest-800"
      >
        How it works
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-center text-[12px] leading-snug text-forest-600">
        Submitting does not guarantee government action. It creates a reviewed public record of what
        was asked.
      </p>

      <ol className="mx-auto mt-5 grid max-w-xl gap-3 sm:grid-cols-2">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="flex gap-3 rounded-md border border-forest-500/10 bg-white px-3 py-3"
          >
            <span className="font-display text-sm font-bold tabular-nums text-gold-600" aria-hidden>
              {s.n}
            </span>
            <div>
              <p className="text-sm font-semibold text-forest-900">{s.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-forest-600">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-4 max-w-md text-center text-[11px] leading-snug text-forest-600">
        Unsure which office delivers a duty?{" "}
        <Link href="/map" className="font-semibold underline underline-offset-2">
          Open the responsibility map
        </Link>
        . Labels are Primary, Shared, or Unclear — not rankings of people.
      </p>

      <p className="mx-auto mt-3 max-w-md text-center text-[10px] leading-snug text-forest-500">
        {t("how.footer")}{" "}
        <Link href="/methodology" className="font-semibold underline underline-offset-2">
          Methodology
        </Link>
        {" · "}
        <Link href="/about" className="font-semibold underline underline-offset-2">
          {t("how.charter")}
        </Link>
      </p>
    </section>
  );
}
