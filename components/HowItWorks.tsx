"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

const STEPS = [
  { n: "01", title: "Choose a duty", body: "What must public office deliver?" },
  { n: "02", title: "Identify responsibility", body: "Which office is primarily responsible?" },
  { n: "03", title: "Add location", body: "State and, if known, LGA." },
  { n: "04", title: "State one demand", body: "One concrete, measurable ask." },
  { n: "05", title: "ISEYC reviews", body: "Human review for clarity and safety." },
  { n: "06", title: "Public record", body: "Published demands enter Civic Pulse." },
] as const;

export default function HowItWorks() {
  const { t } = useLang();

  return (
    <section className="border-b border-forest-500/10 px-4 py-7" aria-labelledby="how-heading">
      <h2
        id="how-heading"
        className="text-center font-display text-sm font-bold tracking-wide text-forest-800"
      >
        {t("how.title")}
      </h2>

      <ol className="mx-auto mt-5 grid max-w-xl gap-3 sm:grid-cols-2">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="flex gap-3 rounded-md border border-forest-500/10 bg-white px-3 py-3"
          >
            <span
              className="font-display text-sm font-bold tabular-nums text-gold-600"
              aria-hidden
            >
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
        {" "}— Primary, Shared, or Unclear. Not rankings.
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
